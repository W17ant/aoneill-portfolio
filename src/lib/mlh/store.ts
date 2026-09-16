/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   MLH QUESTIONNAIRE - Supabase access                 ###
   ###   Server only: uses the secret key, bypasses RLS      ###
   ###   Last Updated: 16-09-2026                            ###
   ########################################################### */

/**
 * Reads and writes questionnaire responses.
 *
 * SERVER ONLY. Every function here sends the project's secret key, which bypasses
 * row level security - the table has RLS on with no policies precisely so that
 * nothing but this file can reach it. Never import it into a client component.
 *
 * Plain fetch rather than @supabase/supabase-js: this needs one insert, one select
 * and one RPC, the merge has to happen in the database anyway (see
 * mlh_save_answers in supabase/mlh-questionnaire.sql), and the portfolio has no
 * other reason to carry a Supabase dependency.
 */

import 'server-only';
import type { Answers } from './questionnaire';

/* ###########################################################
   ###   1. Configuration                                   ###
   ########################################################### */

interface Config {
  url: string;
  key: string;
}

/**
 * Reads the credentials at call time.
 *
 * Deliberately not at module load: the portfolio builds and deploys without these
 * set, and a missing questionnaire must not fail the whole site's build.
 */
function config(): Config | null {
  const url = process.env.MLH_SUPABASE_URL;
  const key = process.env.MLH_SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

/** True when answers can actually be stored. The form says so rather than failing silently. */
export function isConfigured(): boolean {
  return config() !== null;
}

async function request(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
): Promise<Response> {
  const cfg = config();
  if (!cfg) throw new Error('MLH questionnaire storage is not configured');

  return fetch(`${cfg.url}${path}`, {
    ...init,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    // Answers must never be served from a cache.
    cache: 'no-store',
  });
}

/* ###########################################################
   ###   2. Response records                                ###
   ########################################################### */

export interface StoredResponse {
  id: string;
  answers: Answers;
  completedBy: string | null;
  completedAt: string | null;
  /** When the client accepted the costs cover page, or null if they have not. */
  acceptedAt: string | null;
  acceptedBy: string | null;
}

/** Starts a response and returns it empty. */
export async function createResponse(ip: string | null): Promise<StoredResponse> {
  const response = await request('/rest/v1/mlh_responses', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ started_from_ip: ip }),
  });

  if (!response.ok) {
    throw new Error(`Could not start a response (${response.status}): ${await response.text()}`);
  }

  const [row] = (await response.json()) as Array<Record<string, unknown>>;
  return toStored(row);
}

/**
 * Loads a response so the client can pick up where they left off.
 *
 * Returns null for an unknown id rather than throwing: a stale resume link is a
 * normal thing to happen, and the form starts a fresh response instead.
 */
export async function loadResponse(id: string): Promise<StoredResponse | null> {
  if (!isUuid(id)) return null;

  const response = await request(
    // select=* rather than naming columns: PostgREST rejects the whole query if
    // one named column is missing, so an explicit list makes this code depend on
    // a migration having run. With * a lagging migration just means the
    // acceptance fields read as null and the questionnaire keeps working.
    `/rest/v1/mlh_responses?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
  );

  if (!response.ok) {
    throw new Error(`Could not load the response (${response.status})`);
  }

  const rows = (await response.json()) as Array<Record<string, unknown>>;
  return rows.length ? toStored(rows[0]) : null;
}

/* ###########################################################
   ###   3. Saving                                          ###
   ########################################################### */

export interface SaveResult {
  answered: number;
  completedAt: string | null;
}

/**
 * Merges a patch of answers into a response.
 *
 * Goes through the mlh_save_answers function rather than a PATCH so the merge is
 * one statement in the database. The form autosaves a single answer at a time,
 * and a read-modify-write here would drop one of two saves in flight.
 *
 * @param id - the response being edited
 * @param patch - answers keyed by question id
 * @param completedBy - optional name; only overwrites when non-empty
 * @param complete - true when they finish the last section
 */
export async function saveAnswers(
  id: string,
  patch: Answers,
  completedBy?: string | null,
  complete = false,
): Promise<SaveResult> {
  const response = await request('/rest/v1/rpc/mlh_save_answers', {
    method: 'POST',
    body: JSON.stringify({
      p_id: id,
      p_patch: patch,
      p_completed_by: completedBy ?? null,
      p_complete: complete,
    }),
  });

  if (!response.ok) {
    throw new Error(`Could not save (${response.status}): ${await response.text()}`);
  }

  const rows = (await response.json()) as Array<{ answered: number; completed_at: string | null }>;
  const row = rows[0];
  return { answered: row?.answered ?? 0, completedAt: row?.completed_at ?? null };
}

/* ###########################################################
   ###   4. Cost acceptance                                 ###
   ########################################################### */

/**
 * Records that the client accepted the costs cover page.
 *
 * Idempotent: the function keeps the first timestamp, so re-reading the page and
 * pressing accept again does not move the date.
 *
 * @param id - the response being accepted against
 * @param name - who accepted, as they typed it
 */
export async function acceptCosts(
  id: string,
  name: string,
): Promise<{ acceptedAt: string | null; acceptedBy: string | null }> {
  const response = await request('/rest/v1/rpc/mlh_accept_costs', {
    method: 'POST',
    body: JSON.stringify({ p_id: id, p_name: name }),
  });

  if (!response.ok) {
    throw new Error(`Could not record acceptance (${response.status}): ${await response.text()}`);
  }

  const rows = (await response.json()) as Array<{ accepted_at: string | null; accepted_by: string | null }>;
  return { acceptedAt: rows[0]?.accepted_at ?? null, acceptedBy: rows[0]?.accepted_by ?? null };
}

/* ###########################################################
   ###   5. Helpers                                         ###
   ########################################################### */

function toStored(row: Record<string, unknown>): StoredResponse {
  return {
    id: String(row.id),
    answers: (row.answers as Answers) ?? {},
    completedBy: (row.completed_by as string | null) ?? null,
    completedAt: (row.completed_at as string | null) ?? null,
    acceptedAt: (row.accepted_at as string | null) ?? null,
    acceptedBy: (row.accepted_by as string | null) ?? null,
  };
}

/** Guards the id before it reaches a URL, so a malformed resume link cannot probe. */
function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
