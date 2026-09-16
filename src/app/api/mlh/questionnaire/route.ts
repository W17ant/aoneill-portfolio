/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   MLH QUESTIONNAIRE API - Start, resume and save      ###
   ###   Access code + rate limit; Turnstile when configured ###
   ###   Last Updated: 16-09-2026                            ###
   ########################################################### */

/**
 * The only way in or out of the questionnaire store.
 *
 * One route with an `action` rather than three endpoints, so the access-code
 * check, the rate limit and the Turnstile check exist once and cannot drift
 * apart. Actions:
 *
 *   start   verify the code, then resume the given response or begin a new one
 *   save    merge a patch of answers into a response
 *   finish  the same as save, and stamp the response as completed
 *   accept  record that the client accepted the costs cover page
 *
 * The response id is the only thing the client holds afterwards. It is a v4 uuid
 * and never guessable, but it is not a secret on its own - every action still
 * carries the access code, so a copied link is useless without it.
 */

import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { isOriginAllowed, corsBlockedResponse, handlePreflight } from '@/lib/cors';
import { createResponse, loadResponse, saveAnswers, acceptCosts, isConfigured } from '@/lib/mlh/store';
import { allQuestions, type Answers } from '@/lib/mlh/questionnaire';

/* ###########################################################
   ###   1. Configuration                                   ###
   ########################################################### */

// Generous on purpose: the form autosaves, and a client working through 333
// questions in one sitting will legitimately make hundreds of calls. The limit is
// here to stop a script, not to ration a client's afternoon.
const RATE_LIMIT_MAX = 400;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

// Answers are prose, not essays. Long enough for a hire policy, short enough that
// nobody can use the form as free storage.
const MAX_ANSWER_LENGTH = 4000;
const MAX_PATCH_KEYS = 60;

/** Question ids that exist, so an unknown key cannot be written into the jsonb. */
const VALID_IDS = new Set(allQuestions().map((q) => q.id));

/* ###########################################################
   ###   2. Access checks                                   ###
   ########################################################### */

/**
 * Compares the submitted code with the configured one.
 *
 * Length-insensitive comparison in constant-ish time: the code is low value, but
 * an early-exit compare on a short shared secret is a free thing to avoid.
 */
function codeMatches(submitted: unknown): boolean {
  const expected = process.env.MLH_ACCESS_CODE;
  if (!expected) return false;
  if (typeof submitted !== 'string') return false;

  const a = submitted.trim();
  if (a.length !== expected.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= a.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verifies a Cloudflare Turnstile token, when Turnstile is configured.
 *
 * Optional by design. There is no Turnstile site on aoneill.co.uk yet, and the
 * access code plus the rate limit already keep this closed; adding the secret to
 * the environment switches the check on without another deploy. Returns true when
 * unconfigured so the form keeps working either way.
 */
async function turnstilePasses(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== 'string' || !token) return false;

  try {
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const result = (await verify.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    // A Cloudflare outage must not lock the client out of a form they are
    // halfway through. The access code is still required.
    return true;
  }
}

/* ###########################################################
   ###   3. Validation                                      ###
   ########################################################### */

/**
 * Keeps only answers to questions that exist, trimmed and length-capped.
 *
 * Unknown keys are dropped rather than rejected: the question set is regenerated
 * from a Word document, so a client with a stale page open could legitimately
 * send an id that has since been renumbered. Losing that one answer is better
 * than failing their whole save.
 */
function cleanPatch(raw: unknown): { patch: Answers; dropped: number } {
  if (!raw || typeof raw !== 'object') return { patch: {}, dropped: 0 };

  const patch: Answers = {};
  let dropped = 0;

  for (const [key, value] of Object.entries(raw as Record<string, unknown>).slice(0, MAX_PATCH_KEYS)) {
    if (!VALID_IDS.has(key) || typeof value !== 'string') {
      dropped += 1;
      continue;
    }
    patch[key] = value.slice(0, MAX_ANSWER_LENGTH);
  }

  return { patch, dropped };
}

/* ###########################################################
   ###   4. Route                                           ###
   ########################################################### */

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

export async function POST(request: Request) {
  if (!isOriginAllowed(request)) return corsBlockedResponse();

  const ip = getClientIP(request);
  const limit = checkRateLimit(`mlh-questionnaire:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.resetIn) } },
    );
  }

  if (!isConfigured()) {
    // Said plainly rather than as a 500: this is a deployment gap, and the person
    // reading it is a client who would otherwise think they had lost their work.
    return NextResponse.json(
      { error: 'The questionnaire is not connected to its database yet. Please let Antony know.' },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 });
  }

  if (!codeMatches(body.accessCode)) {
    // Deliberately vague and the same for a missing or wrong code.
    return NextResponse.json({ error: 'That access code is not right.' }, { status: 401 });
  }

  if (!(await turnstilePasses(body.turnstileToken, ip))) {
    return NextResponse.json({ error: 'Please complete the check and try again.' }, { status: 403 });
  }

  const action = body.action;

  try {
    /* --- start: resume an existing response, or open a new one --- */
    if (action === 'start') {
      const requested = typeof body.responseId === 'string' ? body.responseId : null;
      const existing = requested ? await loadResponse(requested) : null;
      const record = existing ?? (await createResponse(ip));

      return NextResponse.json({
        responseId: record.id,
        answers: record.answers,
        completedBy: record.completedBy,
        completedAt: record.completedAt,
        acceptedAt: record.acceptedAt,
        acceptedBy: record.acceptedBy,
        // Tells the client its resume link was stale, so it can say so rather
        // than silently presenting an empty form as if nothing was ever saved.
        resumed: Boolean(existing),
      });
    }

    /* --- save / finish --- */
    if (action === 'save' || action === 'finish') {
      const responseId = typeof body.responseId === 'string' ? body.responseId : '';
      if (!responseId) {
        return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 });
      }

      const { patch } = cleanPatch(body.patch);
      const completedBy = typeof body.completedBy === 'string' ? body.completedBy.slice(0, 200) : null;

      const result = await saveAnswers(responseId, patch, completedBy, action === 'finish');
      return NextResponse.json({ saved: true, ...result });
    }

    /* --- accept: the costs cover page --- */
    if (action === 'accept') {
      const responseId = typeof body.responseId === 'string' ? body.responseId : '';
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
      if (!responseId || !name) {
        return NextResponse.json({ error: 'Please add your name and try again.' }, { status: 400 });
      }

      const result = await acceptCosts(responseId, name);
      return NextResponse.json({ accepted: true, ...result });
    }

    return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 });
  } catch (error) {
    // Log the detail, return none: the client must never see a Postgres message.
    console.error('[MLH questionnaire]', error);
    return NextResponse.json(
      { error: "We couldn't save that right now. Your answers are still on screen - please try again shortly." },
      { status: 500 },
    );
  }
}
