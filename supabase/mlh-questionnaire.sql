-- Manchester Leisure Hire website questionnaire — answer storage.
--
-- Run once against the MLH Supabase project (SQL Editor → New query → Run).
-- Safe to re-run: every statement is guarded.
--
-- One row per response, with the answers in a single jsonb object keyed by the
-- question ids the parser emits (q1 … q332, plus extra1 for the unnumbered
-- "Anything else" prompt).
--
-- Why one jsonb column rather than a row per answer: there are 333 questions and
-- exactly one client filling them in. A row-per-answer table would be 333 upserts
-- to read a response back, needs its own ordering to reassemble, and buys nothing
-- here — nothing queries a single answer across responses. The trade is that two
-- browsers editing at once could clobber each other, which the API avoids by
-- merging patches server-side (`answers || patch`) rather than replacing the object.
--
-- Answers are NOT validated against the question list in the database. The
-- question set is a generated JSON file that changes when the document does, and a
-- constraint here would reject a half-finished response the moment a question was
-- renumbered.

create extension if not exists "pgcrypto";

create table if not exists mlh_responses (
  id uuid primary key default gen_random_uuid(),

  -- Answers keyed by question id: { "q1": "Manchester Leisure Hire", … }
  answers jsonb not null default '{}'::jsonb,

  -- Who filled it in, from the document's own "Completed by" field. Optional:
  -- they can type answers before they tell us who they are.
  completed_by text,

  -- Set when they press Finish on the last section. A null here with answers
  -- present is a response still in progress, which is the normal state for days.
  completed_at timestamptz,

  -- For spotting a duplicate or abandoned attempt without reading the answers.
  started_from_ip text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Every read and write goes through the service role in a server route, which
-- bypasses RLS. Enabling it with no policies therefore denies the browser
-- outright: a leaked publishable key cannot read a client's business details,
-- staff arrangements or account owners.
alter table mlh_responses enable row level security;

comment on table mlh_responses is
  'MLH website questionnaire responses. Answers keyed by question id from src/content/mlh-questionnaire.json. Service-role access only.';

-- Keeps updated_at honest without every writer remembering to set it.
create or replace function mlh_touch_updated_at()
returns trigger
language plpgsql
-- Pinned so nothing resolves through a caller-controlled schema.
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists mlh_responses_touch on mlh_responses;
create trigger mlh_responses_touch
  before update on mlh_responses
  for each row execute function mlh_touch_updated_at();

-- The admin view: most recently touched first, with progress at a glance so an
-- unfinished response is obvious without opening the jsonb.
-- security_invoker makes the view run with the QUERYING role's rights. Without it
-- a view owned by a privileged role reads straight past the table's RLS, which
-- would hand a client's answers to anyone who could select from it. Supabase's
-- own advisor flags the default as critical, and it is right to.
create or replace view mlh_response_progress
  with (security_invoker = on)
as
  select
    id,
    completed_by,
    completed_at,
    created_at,
    updated_at,
    (select count(*) from jsonb_each_text(answers) a where length(trim(a.value)) > 0) as answered,
    answers
  from mlh_responses
  order by updated_at desc;

comment on view mlh_response_progress is
  'Questionnaire responses with a count of non-empty answers. Read this rather than the table when checking progress.';

-- ---------------------------------------------------------------------------
-- Saving answers
-- ---------------------------------------------------------------------------

/*
 * Merges a patch of answers into a response and returns its progress.
 *
 * Why a function rather than an UPDATE from the API: the form autosaves one
 * answer at a time, and `answers = answers || patch` has to read and write the
 * jsonb in a single statement or two saves in flight can drop one of them. Doing
 * it here also means the API never sends the whole 333-key object back and forth.
 *
 * Creating the row is the caller's job (insert, then pass the id) so that a bad
 * access code never reaches this far.
 *
 * NOT security definer. It is only ever called with the project's secret key,
 * whose role already bypasses RLS, so definer rights would buy nothing and would
 * instead let any role that could execute it write to any response.
 *
 * @param p_id          the response being edited
 * @param p_patch       answers to merge, e.g. {"q41": "Volkswagen T6"}
 * @param p_completed_by  optional name, overwritten only when given
 * @param p_complete    true when the client presses Finish on the last section
 */
create or replace function mlh_save_answers(
  p_id uuid,
  p_patch jsonb,
  p_completed_by text default null,
  p_complete boolean default false
)
returns table (id uuid, answered integer, completed_at timestamptz)
language plpgsql
security invoker
set search_path = public
as $$
begin
  update mlh_responses r
  set
    answers = r.answers || coalesce(p_patch, '{}'::jsonb),
    completed_by = coalesce(nullif(trim(p_completed_by), ''), r.completed_by),
    -- Only ever set, never cleared: a client who presses Finish then edits one
    -- more answer has still finished.
    completed_at = case when p_complete then coalesce(r.completed_at, now()) else r.completed_at end
  where r.id = p_id;

  if not found then
    raise exception 'No such response';
  end if;

  return query
    select
      r.id,
      (select count(*) from jsonb_each_text(r.answers) a where length(trim(a.value)) > 0)::integer,
      r.completed_at
    from mlh_responses r
    where r.id = p_id;
end;
$$;

comment on function mlh_save_answers is
  'Merges an answer patch into a response atomically. Called by the questionnaire API with the service role.';

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

-- Postgres grants EXECUTE to PUBLIC on a new function, so without this the
-- anon key could call the save function directly and write answers into any
-- response id. Only the server route, holding the secret key, has any business
-- here - and the same goes for reading the table or the progress view.
revoke execute on function mlh_save_answers(uuid, jsonb, text, boolean) from public, anon, authenticated;
revoke execute on function mlh_touch_updated_at() from public, anon, authenticated;
revoke all on mlh_responses from anon, authenticated;
revoke all on mlh_response_progress from anon, authenticated;
