/** ContactForm - Plain, accessible contact form posting to /api/contact (works without JS) */

'use client';

import { useEffect, useRef, useState } from 'react';

/* ###########################################################
   ###   1. Types & Validation                              ###
   ########################################################### */

type FieldName = 'name' | 'email' | 'subject' | 'message';
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;
type Status = 'idle' | 'sending' | 'success' | 'error';

/** Result passed in from the server after a no-JS form post redirect. */
export type ContactFormInitialResult = 'sent' | 'rate' | 'validation' | 'server' | null;

const EMPTY: Values = { name: '', email: '', subject: '', message: '' };

// Why: same regex and length limits as src/app/api/contact/route.ts, so the
// client never accepts something the server will reject.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = {
  name: { min: 2, max: 100 },
  subject: { min: 3, max: 200 },
  message: { min: 10, max: 5000 },
  email: { max: 254 },
} as const;

const FIELD_ORDER: FieldName[] = ['name', 'email', 'subject', 'message'];

function validateField(field: FieldName, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case 'name':
      if (!value) return 'Enter your name.';
      if (value.length < LIMITS.name.min) return `Name must be at least ${LIMITS.name.min} characters.`;
      if (value.length > LIMITS.name.max) return `Name must be ${LIMITS.name.max} characters or fewer.`;
      return;
    case 'email':
      if (!value) return 'Enter your email address.';
      if (!EMAIL_RE.test(value) || value.length > LIMITS.email.max) return 'Enter a valid email address, like name@example.com.';
      return;
    case 'subject':
      // Optional: only validated when something is typed
      if (!value) return;
      if (value.length < LIMITS.subject.min) return `Subject must be at least ${LIMITS.subject.min} characters, or leave it blank.`;
      if (value.length > LIMITS.subject.max) return `Subject must be ${LIMITS.subject.max} characters or fewer.`;
      return;
    case 'message':
      if (!value) return 'Enter a message.';
      if (value.length < LIMITS.message.min) return `Message must be at least ${LIMITS.message.min} characters.`;
      if (value.length > LIMITS.message.max) return `Message must be ${LIMITS.message.max} characters or fewer.`;
      return;
  }
}

function validateAll(values: Values): Errors {
  const errors: Errors = {};
  for (const f of FIELD_ORDER) {
    const e = validateField(f, values[f]);
    if (e) errors[f] = e;
  }
  return errors;
}

const SERVER_MESSAGES: Record<Exclude<ContactFormInitialResult, 'sent' | null>, string> = {
  rate: 'Too many messages from your connection recently. Please try again later, or email me directly.',
  validation: 'Some fields were missing or invalid. Please check them and send again.',
  server: 'Your message could not be sent. Please try again, or email me directly.',
};

/* ###########################################################
   ###   2. Styles                                          ###
   ########################################################### */

// Why: --danger / --accent alone are under 4.5:1 as small text on the light
// background. Mixing toward --ink darkens them in light mode and lightens them
// in dark mode, so both themes pass without new tokens.
const ERROR_COLOR = 'color-mix(in srgb, var(--danger) 70%, var(--ink))';
const SUCCESS_COLOR = 'color-mix(in srgb, var(--accent) 75%, var(--ink))';
// Why: .btn-primary is white on #059669 (3.8:1) in light mode; nudge it darker.
const BUTTON_BG = 'color-mix(in srgb, var(--accent) 80%, var(--ink))';

const inputClass =
  'w-full rounded-[var(--radius-sm)] px-3.5 py-2.5 text-base outline-none transition-colors ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]';

/* ###########################################################
   ###   3. Component                                       ###
   ########################################################### */

/**
 * Default contact form. Server-rendered as a real <form> that posts to
 * /api/contact, so it works before (or without) hydration; once JS loads it
 * submits via fetch with inline validation and live status announcements.
 * @param initialResult - outcome of a no-JS submission, read from the URL by the page
 */
export default function ContactForm({ initialResult = null }: { initialResult?: ContactFormInitialResult }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>(
    initialResult === 'sent' ? 'success' : initialResult ? 'error' : 'idle'
  );
  const [serverError, setServerError] = useState<string>(
    initialResult && initialResult !== 'sent' ? SERVER_MESSAGES[initialResult] : ''
  );
  const [summary, setSummary] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>>({});

  // Why: without JS the browser's native required/minLength/type=email checks
  // apply. Once hydrated we take over with inline messages, so switch native
  // validation off by mutating the DOM (no re-render, no hydration mismatch).
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);

  const setValue = (field: FieldName, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Re-validate live only once the user has left the field, so errors don't
    // appear while they're still typing the first time.
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
  };

  const handleBlur = (field: FieldName) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    const firstInvalid = FIELD_ORDER.find((f) => nextErrors[f]);
    if (firstInvalid) {
      const count = Object.keys(nextErrors).length;
      setStatus('idle');
      setServerError('');
      setSummary(`${count} ${count === 1 ? 'field needs' : 'fields need'} attention.`);
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setSummary('');
    setStatus('sending');
    setServerError('');

    const honeypot = (formRef.current?.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';

    try {
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          website: honeypot,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error(data.message ? `Too many messages recently. ${data.message}, or email me directly.` : SERVER_MESSAGES.rate);
        }
        if (response.status === 400 && data.error) throw new Error(`${data.error}.`);
        throw new Error(SERVER_MESSAGES.server);
      }

      setStatus('success');
      setValues(EMPTY);
      setTouched({});
      setErrors({});
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error && err.message !== 'Failed to fetch' ? err.message : SERVER_MESSAGES.server);
    }
  };

  const sending = status === 'sending';

  const renderField = (
    field: FieldName,
    label: string,
    opts: { type?: string; autoComplete?: string; optional?: boolean; multiline?: boolean; hint?: string }
  ) => {
    const id = `contact-${field}`;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const error = errors[field];
    const describedBy = [opts.hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
    const limits = LIMITS[field];
    const common = {
      id,
      name: field,
      value: values[field],
      required: !opts.optional,
      minLength: 'min' in limits ? limits.min : undefined,
      maxLength: limits.max,
      disabled: sending,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy,
      onBlur: () => handleBlur(field),
      className: inputClass,
      style: {
        background: 'var(--bg-elevated)',
        color: 'var(--ink)',
        // Why: --stroke is ~1.1:1, too faint for a form-control boundary (WCAG 1.4.11 needs 3:1)
        border: `1px solid ${error ? ERROR_COLOR : 'var(--ink-muted)'}`,
      } as React.CSSProperties,
    };

    return (
      <div>
        <label htmlFor={id} className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ink)' }}>
          {label}
          {opts.optional && (
            <span className="font-normal" style={{ color: 'var(--ink-muted)' }}>
              {' '}(optional)
            </span>
          )}
        </label>
        {opts.hint && (
          <p id={hintId} className="text-xs mb-1.5" style={{ color: 'var(--ink-secondary)' }}>
            {opts.hint}
          </p>
        )}
        {opts.multiline ? (
          <textarea
            {...common}
            ref={(el) => {
              fieldRefs.current[field] = el;
            }}
            rows={6}
            onChange={(e) => setValue(field, e.target.value)}
            className={`${inputClass} resize-y min-h-[9rem]`}
          />
        ) : (
          <input
            {...common}
            ref={(el) => {
              fieldRefs.current[field] = el;
            }}
            type={opts.type ?? 'text'}
            autoComplete={opts.autoComplete}
            onChange={(e) => setValue(field, e.target.value)}
          />
        )}
        {error && (
          <p id={errorId} className="mt-1.5 text-sm font-medium" style={{ color: ERROR_COLOR }}>
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <form
      ref={formRef}
      id="contact-form"
      action="/api/contact/"
      method="post"
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-title"
      className="card p-6 sm:p-8"
    >
      <h2 id="contact-form-title" className="text-xl font-semibold mb-1" style={{ color: 'var(--ink)' }}>
        Send a message
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-secondary)' }}>
        All fields are required unless marked optional.
      </p>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill every field */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {renderField('name', 'Name', { autoComplete: 'name' })}
          {renderField('email', 'Email', { type: 'email', autoComplete: 'email' })}
        </div>
        {renderField('subject', 'Subject', { optional: true, autoComplete: 'off' })}
        {renderField('message', 'Message', {
          multiline: true,
          hint: 'A role, a team, or a project you have in mind.',
        })}
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          className="btn btn-primary justify-center text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: BUTTON_BG, borderColor: BUTTON_BG }}
          disabled={sending}
          aria-disabled={sending || undefined}
        >
          {sending ? 'Sending…' : 'Send message'}
        </button>

        {/* Live region: announces sending / success. Always mounted so screen readers pick up changes. */}
        <p role="status" aria-live="polite" className="text-sm" style={{ color: status === 'success' ? SUCCESS_COLOR : 'var(--ink-secondary)' }}>
          {status === 'idle' && summary}
          {status === 'sending' && 'Sending your message…'}
          {status === 'success' && "Thanks, your message has been sent. I'll reply by email."}
        </p>
      </div>

      {/* Errors are announced assertively; also mounted up-front for reliable announcement */}
      <div role="alert" className="text-sm font-medium empty:hidden mt-4" style={{ color: ERROR_COLOR }}>
        {status === 'error' && serverError}
      </div>
    </form>
  );
}
