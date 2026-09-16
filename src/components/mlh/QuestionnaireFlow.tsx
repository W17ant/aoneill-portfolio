'use client';

/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   MLH QUESTIONNAIRE - The form itself                 ###
   ###   Access gate, seven sections, autosave, resume       ###
   ###   Last Updated: 16-09-2026                            ###
   ########################################################### */

/**
 * A 333-question questionnaire the client can work through over days.
 *
 * Shape: one modal panel, one section per page, seven pages. That was chosen over
 * 53 pages (one per subsection) because the page count is the thing that tells
 * someone how much is left, and 53 reads as endless. The subsections still group
 * the questions within a page, so nothing is a wall of inputs.
 *
 * Nothing is submitted. Every answer autosaves on blur, plus a debounced save
 * while typing, so the client can close the tab at any point and come back - a
 * single Submit at the end of 333 questions would be a cruel thing to build.
 *
 * The response id lives in localStorage so returning to the URL resumes. It is
 * also in the address bar, so they can move between devices by copying the link;
 * the access code is still required either way.
 */

import Image from 'next/image';
import CostsAgreement from '@/components/mlh/CostsAgreement';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  questionnaire,
  allQuestions,
  sectionQuestions,
  countAnswered,
  type Answers,
  type Question,
} from '@/lib/mlh/questionnaire';

/* ###########################################################
   ###   1. Configuration                                   ###
   ########################################################### */

/** Where the resume id is kept between visits. */
const STORAGE_KEY = 'mlh-questionnaire-response';

/**
 * How long to wait after the last keystroke before saving.
 *
 * Long enough that a sentence is one request rather than forty, short enough that
 * a closed laptop loses at most a few words. Blur saves immediately regardless.
 */
const AUTOSAVE_DELAY = 1200;

const TOTAL_QUESTIONS = allQuestions().length;

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function QuestionnaireFlow({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const [accessCode, setAccessCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [responseId, setResponseId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [completedBy, setCompletedBy] = useState('');
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const [acceptedAt, setAcceptedAt] = useState<string | null>(null);
  const [acceptedBy, setAcceptedBy] = useState<string | null>(null);
  /** The costs page is step 0. Dismissed once seen, per visit. */
  const [showCosts, setShowCosts] = useState(true);

  /** Answers edited but not yet sent, so a failed save is not lost. */
  const pending = useRef<Answers>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef('');

  const sections = questionnaire.sections;
  const section = sections[sectionIndex];

  const answeredTotal = useMemo(
    () => countAnswered(allQuestions(), answers),
    [answers],
  );

  /* --- talking to the API ------------------------------------------------ */

  const call = useCallback(
    async (payload: Record<string, unknown>) => {
      // Trailing slash on purpose: the site sets trailingSlash, so the slashless
      // URL answers 308. Browsers do re-POST on a 308, but relying on that costs
      // a round trip per autosave and trusts every proxy in between to behave.
      const response = await fetch('/api/mlh/questionnaire/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, accessCode: codeRef.current }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Something went wrong. Please try again.');
      return result;
    },
    [],
  );

  /** Sends whatever is pending. Keeps it on failure so the next save retries it. */
  const flush = useCallback(
    async (options: { complete?: boolean } = {}) => {
      const patch = { ...pending.current };
      const hasAnswers = Object.keys(patch).length > 0;
      if (!responseId || (!hasAnswers && !options.complete)) return;

      pending.current = {};
      setSaveState('saving');

      try {
        const result = await call({
          action: options.complete ? 'finish' : 'save',
          responseId,
          patch,
          completedBy: completedBy || null,
        });
        setSaveState('saved');
        if (result.completedAt) setCompletedAt(result.completedAt);
      } catch (error) {
        // Put it back: the client is still looking at these answers, and losing
        // them to a flaky connection is the one outcome this form cannot have.
        pending.current = { ...patch, ...pending.current };
        setSaveState('error');
        setMessage(error instanceof Error ? error.message : 'Could not save.');
      }
    },
    [call, completedBy, responseId],
  );

  /* --- unlocking --------------------------------------------------------- */

  async function unlock(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    codeRef.current = accessCode.trim();

    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      const fromUrl = new URLSearchParams(window.location.search).get('r');
      const result = await call({ action: 'start', responseId: fromUrl || stored || null });

      setResponseId(result.responseId);
      setAnswers(result.answers || {});
      setCompletedBy(result.completedBy || '');
      setCompletedAt(result.completedAt || null);
      setAcceptedAt(result.acceptedAt || null);
      setAcceptedBy(result.acceptedBy || null);
      setUnlocked(true);

      window.localStorage.setItem(STORAGE_KEY, result.responseId);
      // Keep the id in the URL so this page can be reopened anywhere.
      const url = new URL(window.location.href);
      url.searchParams.set('r', result.responseId);
      window.history.replaceState(null, '', url);

      if ((fromUrl || stored) && !result.resumed) {
        setResumeNotice(
          'We could not find your earlier answers, so this is a fresh start. If you had filled some in, let Antony know before going further.',
        );
      } else if (result.resumed) {
        const count = countAnswered(allQuestions(), result.answers || {});
        if (count > 0) setResumeNotice(`Picking up where you left off - ${count} of ${TOTAL_QUESTIONS} answered.`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not start.');
    } finally {
      setBusy(false);
    }
  }

  /* --- accepting the costs ----------------------------------------------- */

  async function acceptCosts(name: string) {
    if (!responseId) return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await call({ action: 'accept', responseId, name });
      setAcceptedAt(result.acceptedAt || new Date().toISOString());
      setAcceptedBy(result.acceptedBy || name);
      setShowCosts(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not record that.');
    } finally {
      setBusy(false);
    }
  }

  /* --- editing ----------------------------------------------------------- */

  function edit(id: string, value: string) {
    setAnswers((previous) => ({ ...previous, [id]: value }));
    pending.current[id] = value;
    setSaveState('idle');

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), AUTOSAVE_DELAY);
  }

  /** Saves immediately - on blur, and before moving between sections. */
  function commit() {
    if (timer.current) clearTimeout(timer.current);
    void flush();
  }

  // A closing tab gets one last synchronous-ish attempt. Best effort only:
  // browsers are allowed to drop this, which is why blur saves too.
  useEffect(() => {
    const onHide = () => {
      if (Object.keys(pending.current).length > 0) void flush();
    };
    window.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onHide);
    };
  }, [flush]);

  function goTo(index: number) {
    commit();
    setSectionIndex(Math.max(0, Math.min(sections.length - 1, index)));
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function finish() {
    if (timer.current) clearTimeout(timer.current);
    setBusy(true);
    await flush({ complete: true });
    setBusy(false);
  }

  /* --- access gate ------------------------------------------------------- */

  if (!unlocked) {
    return (
      <Panel>
        <h1 className="text-2xl font-semibold text-[var(--ink)]">{questionnaire.title}</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">{questionnaire.subtitle}</p>

        <form onSubmit={unlock} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[var(--ink)]">Access code</span>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              autoComplete="off"
              autoFocus
              className="mt-1.5 w-full rounded-[var(--radius-sm)] border border-[var(--stroke)] bg-[var(--bg-elevated)] px-3 py-2.5 text-[var(--ink)] outline-none focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-glow)]"
              placeholder="The code Antony sent you"
            />
          </label>

          {/* Only rendered when a Turnstile site is configured; the API skips the
              check when its secret is absent, so the two stay in step. */}
          {turnstileSiteKey && (
            <div
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
              data-action="mlh-questionnaire"
            />
          )}

          <button
            type="submit"
            disabled={busy || accessCode.trim().length === 0}
            className="w-full rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--accent-light)] disabled:opacity-50"
          >
            {busy ? 'Checking…' : 'Start'}
          </button>

          {message && (
            <p role="alert" className="text-sm text-red-600">
              {message}
            </p>
          )}
        </form>

        <p className="mt-6 text-xs text-[var(--ink-muted)]">
          {TOTAL_QUESTIONS} questions across {sections.length} sections. Your answers save as
          you type, so you can stop and come back whenever you like.
        </p>
      </Panel>
    );
  }

  /* --- step 0: the costs cover page -------------------------------------- */

  if (showCosts) {
    return (
      <Panel wide>
        <CostsAgreement
          acceptedAt={acceptedAt}
          acceptedBy={acceptedBy}
          onAccept={acceptCosts}
          onSkip={() => setShowCosts(false)}
          busy={busy}
          error={message}
        />
      </Panel>
    );
  }

  /* --- the questionnaire ------------------------------------------------- */

  const onLastSection = sectionIndex === sections.length - 1;
  const sectionTotal = sectionQuestions(section).length;
  const sectionAnswered = countAnswered(sectionQuestions(section), answers);

  return (
    <Panel wide>
      <header className="border-b border-[var(--stroke)] pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--ink-muted)]">
              Section {sectionIndex + 1} of {sections.length}
            </p>
            <h1 className="text-xl font-semibold text-[var(--ink)]">{section.title}</h1>
          </div>
          <p className="text-sm text-[var(--ink-muted)]">
            {answeredTotal} of {TOTAL_QUESTIONS} answered
            <SaveBadge state={saveState} />
          </p>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
            style={{ width: `${TOTAL_QUESTIONS ? (answeredTotal / TOTAL_QUESTIONS) * 100 : 0}%` }}
          />
        </div>

        <nav className="mt-4 flex flex-wrap gap-1.5" aria-label="Sections">
          {/* A way back to the costs, so they are re-readable rather than a gate
              seen once and lost. */}
          <button
            type="button"
            onClick={() => {
              commit();
              setShowCosts(true);
            }}
            className="rounded-full border border-[var(--stroke)] px-2.5 py-1 text-xs text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-surface)]"
          >
            Costs{acceptedAt ? ' ✓' : ''}
          </button>
          {sections.map((s, i) => {
            const done = countAnswered(sectionQuestions(s), answers);
            const total = sectionQuestions(s).length;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === sectionIndex ? 'step' : undefined}
                className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                  i === sectionIndex
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:bg-[var(--panel-hover)]'
                }`}
              >
                {s.title}
                <span className="ml-1.5 opacity-70">
                  {done}/{total}
                </span>
              </button>
            );
          })}
        </nav>
      </header>

      {resumeNotice && (
        <p className="mt-4 rounded-[var(--radius-sm)] border border-[var(--accent-border)] bg-[var(--accent-bg)] px-3 py-2 text-sm text-[var(--ink-secondary)]">
          {resumeNotice}
        </p>
      )}

      <div className="mt-6 space-y-8">
        {section.subsections.map((subsection, i) => (
          <fieldset key={`${section.id}-${i}`} className="space-y-5">
            {subsection.title && (
              <legend className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
                {subsection.title}
              </legend>
            )}
            {subsection.questions.map((question) => (
              <Field
                key={question.id}
                question={question}
                value={answers[question.id] ?? ''}
                onChange={(value) => edit(question.id, value)}
                onBlur={commit}
              />
            ))}
          </fieldset>
        ))}
      </div>

      <footer className="mt-8 border-t border-[var(--stroke)] pt-5">
        <label className="block max-w-sm">
          <span className="text-sm font-medium text-[var(--ink)]">Completed by</span>
          <input
            type="text"
            value={completedBy}
            onChange={(e) => setCompletedBy(e.target.value)}
            onBlur={commit}
            placeholder="Your name"
            className="mt-1.5 w-full rounded-[var(--radius-sm)] border border-[var(--stroke)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent-border)]"
          />
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(sectionIndex - 1)}
            disabled={sectionIndex === 0}
            className="rounded-[var(--radius-sm)] border border-[var(--stroke)] px-4 py-2 text-[var(--ink)] transition-colors hover:bg-[var(--bg-surface)] disabled:opacity-40"
          >
            Back
          </button>

          {!onLastSection ? (
            <button
              type="button"
              onClick={() => goTo(sectionIndex + 1)}
              className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--accent-light)]"
            >
              Next: {sections[sectionIndex + 1].title}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              disabled={busy}
              className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--accent-light)] disabled:opacity-50"
            >
              {busy ? 'Saving…' : "I'm finished"}
            </button>
          )}

          <span className="text-sm text-[var(--ink-muted)]">
            {sectionAnswered} of {sectionTotal} in this section
          </span>
        </div>

        {completedAt && (
          <p className="mt-4 rounded-[var(--radius-sm)] border border-[var(--accent-border)] bg-[var(--accent-bg)] px-3 py-2 text-sm text-[var(--ink-secondary)]">
            Thank you - marked as finished on{' '}
            {new Date(completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}. You
            can still change any answer; it saves straight away.
          </p>
        )}

        {message && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {message}
          </p>
        )}

        <p className="mt-5 text-xs text-[var(--ink-muted)]">
          Please do not put passwords, API keys or bank details in here - send those separately.
        </p>
      </footer>
    </Panel>
  );
}

/* ###########################################################
   ###   3. Pieces                                          ###
   ########################################################### */

/**
 * The modal panel. Centred card on a dimmed page, at both sizes.
 *
 * Carries the AO monogram so the client can see at a glance whose form they are
 * filling in - it arrives as a bare link with an access code and no covering
 * email, and 333 questions asking for company registration numbers and account
 * owners should say plainly who is asking.
 *
 * The monogram is the site's own asset and inherits --monogram-filter, so it
 * flips for dark mode with the rest of the page rather than staying black.
 */
function Panel({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen bg-[var(--bg-surface)] px-4 py-10">
      <div
        className={`mx-auto rounded-[var(--radius)] border border-[var(--stroke)] bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)] ${
          wide ? 'max-w-3xl' : 'max-w-md'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-[var(--stroke)] px-6 py-4 sm:px-8">
          <Image
            src="/images/monogram.png"
            alt="Antony O'Neill"
            width={128}
            height={71}
            className="h-6 w-auto"
            style={{ filter: 'var(--monogram-filter)' }}
            priority
          />
          <span className="text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            Website questionnaire
          </span>
        </div>

        <div className="p-6 sm:p-8">{children}</div>

        <p className="border-t border-[var(--stroke)] px-6 py-3 text-[11px] text-[var(--ink-muted)] sm:px-8">
          Prepared by Antony O&apos;Neill ·{' '}
          <a
            href="https://aoneill.co.uk"
            className="text-[var(--link)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            aoneill.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}

function Field({
  question,
  value,
  onChange,
  onBlur,
}: {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const inputId = `mlh-${question.id}`;
  const noteId = question.note ? `${inputId}-note` : undefined;
  const shared =
    'mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--stroke)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--ink)] outline-none transition-colors focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-glow)]';

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-[var(--ink)]">
        {question.number !== null && (
          <span className="mr-1.5 text-[var(--ink-muted)]">{question.number}.</span>
        )}
        {question.title}
      </label>

      {question.note && (
        <p id={noteId} className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">
          {question.note}
        </p>
      )}

      {question.long ? (
        <textarea
          id={inputId}
          aria-describedby={noteId}
          value={value}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={shared}
        />
      ) : (
        <input
          id={inputId}
          type="text"
          aria-describedby={noteId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={shared}
        />
      )}
    </div>
  );
}

/** Quiet save indicator. Silence means nothing to say, not that saving failed. */
function SaveBadge({ state }: { state: SaveState }) {
  if (state === 'idle') return null;

  const label =
    state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved' : 'Not saved - will retry';

  return (
    <span
      className={`ml-2 text-xs ${state === 'error' ? 'text-red-600' : 'text-[var(--accent)]'}`}
      aria-live="polite"
    >
      {label}
    </span>
  );
}
