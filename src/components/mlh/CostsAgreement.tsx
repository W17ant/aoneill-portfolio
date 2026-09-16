'use client';

/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   MLH COSTS - Cover page with acceptance              ###
   ###   Shown before the questionnaire's first section      ###
   ###   Last Updated: 16-09-2026                            ###
   ########################################################### */

/**
 * The cover page: what this costs, who charges what, and an Accept button.
 *
 * Deliberately NOT called a service level agreement. An SLA sets out uptime
 * targets, response times and what happens when they are missed; this is a
 * quote - scope and money - so it is named as one. If uptime commitments are
 * wanted later they belong in a separate document.
 *
 * Nor is it a contract. Accepting records a name and a timestamp against the
 * response, which is a useful record of "these were the numbers they saw and
 * agreed to" and nothing more. Anything binding needs a real contract.
 *
 * The client cannot get to the questions without passing through this, so the
 * costs are seen before three hundred questions are answered rather than after.
 */

import { useState } from 'react';
import {
  ourFees,
  services,
  transactionFees,
  workedExample,
  monthlyTotal,
  undecided,
  pricesCheckedOn,
  type FeeLine,
  type ServiceLine,
} from '@/lib/mlh/costs';

export default function CostsAgreement({
  acceptedAt,
  acceptedBy,
  onAccept,
  onSkip,
  busy,
  error,
}: {
  acceptedAt: string | null;
  acceptedBy: string | null;
  onAccept: (name: string) => void;
  /** Lets an already-accepted client go straight on, and lets anyone read first. */
  onSkip: () => void;
  busy: boolean;
  error: string | null;
}) {
  const [name, setName] = useState(acceptedBy ?? '');
  const [ticked, setTicked] = useState(false);

  const alreadyAccepted = Boolean(acceptedAt);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--ink)]">
          What the website costs
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-muted)]">
          Everything below in plain terms: what we charge, what the outside
          services charge, and what comes out of each booking. Have a read, and
          if you are happy, accept at the bottom and carry on to the questions.
        </p>
      </header>

      {/* --- our fees ---------------------------------------------------- */}
      <Section
        title="Our fees"
        caption="Charged by Antony O'Neill."
        accent
      >
        {ourFees.map((fee) => (
          <Row key={fee.label} line={fee} />
        ))}
      </Section>

      {/* --- third-party services ---------------------------------------- */}
      <Section
        title="Services the site runs on"
        caption={`Billed by each provider to accounts in your name, not through us. List prices checked on ${pricesCheckedOn}.`}
      >
        {services.map((service) => (
          <Row key={service.label} line={service} />
        ))}
      </Section>

      {/* --- card fees ---------------------------------------------------- */}
      <Section
        title="Card fees on bookings"
        caption="Stripe's published UK rates. No monthly charge and no set-up fee - these only apply when a customer pays."
      >
        {transactionFees.map((fee) => (
          <Row key={fee.label} line={fee} />
        ))}
        <p className="rounded-[var(--radius-sm)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--ink-secondary)]">
          <strong className="font-medium">For example:</strong> a{' '}
          {workedExample.booking} paid on a UK card costs{' '}
          <strong className="font-medium">{workedExample.fee}</strong> in card
          fees. {workedExample.detail}
        </p>
      </Section>

      {/* --- still to decide --------------------------------------------- */}
      <Section
        title="Optional extras, still to price"
        caption="Not in the monthly figure below, so it holds no surprises."
      >
        {undecided.map((item) => (
          <Row key={item.label} line={item} />
        ))}
      </Section>

      {/* --- the number they actually want ------------------------------- */}
      <div className="rounded-[var(--radius-sm)] border-2 border-[var(--accent-border)] bg-[var(--accent-bg)] px-4 py-3.5">
        <p className="text-sm font-semibold text-[var(--ink)]">
          Running cost once live: {monthlyTotal.amount}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--ink-secondary)]">
          {monthlyTotal.detail}
        </p>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Plus the {ourFees[0].amount.replace(' one-off', '')} build fee at the
          start.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
          {monthlyTotal.excluded}
        </p>
      </div>

      {/* --- acceptance --------------------------------------------------- */}
      <div className="border-t border-[var(--stroke)] pt-6">
        {alreadyAccepted ? (
          <div className="space-y-4">
            <p className="rounded-[var(--radius-sm)] border border-[var(--accent-border)] bg-[var(--accent-bg)] px-3 py-2.5 text-sm text-[var(--ink-secondary)]">
              Accepted by {acceptedBy || 'you'} on{' '}
              {new Date(acceptedAt!).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              .
            </p>
            <button
              type="button"
              onClick={onSkip}
              className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--accent-light)]"
            >
              Continue to the questions
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="flex items-start gap-2.5 text-sm text-[var(--ink-secondary)]">
              <input
                type="checkbox"
                checked={ticked}
                onChange={(e) => setTicked(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span>
                I have read the costs above and I am happy to go ahead on this
                basis.
              </span>
            </label>

            <label className="block max-w-sm">
              <span className="text-sm font-medium text-[var(--ink)]">
                Your name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Who is accepting"
                className="mt-1.5 w-full rounded-[var(--radius-sm)] border border-[var(--stroke)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-glow)]"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onAccept(name.trim())}
                disabled={busy || !ticked || name.trim().length === 0}
                className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--accent-light)] disabled:opacity-50"
              >
                {busy ? 'Saving…' : 'Accept and continue'}
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="text-sm text-[var(--link)] hover:underline"
              >
                Skip for now and start the questions
              </button>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        )}

        <p className="mt-5 text-xs leading-relaxed text-[var(--ink-muted)]">
          This is a summary of costs, not a contract, and the third-party prices
          are theirs rather than ours - they can change them. Accepting records
          your name and the date so we both have a note of what was agreed.
        </p>
      </div>
    </div>
  );
}

/* ###########################################################
   ###   Pieces                                             ###
   ########################################################### */

function Section({
  title,
  caption,
  accent = false,
  children,
}: {
  title: string;
  caption: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[var(--radius-sm)] border px-4 py-4 ${
        accent
          ? 'border-[var(--accent-border)] bg-[var(--accent-bg)]'
          : 'border-[var(--stroke)]'
      }`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
        {title}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">
        {caption}
      </p>
      <div className="mt-3.5 space-y-3.5">{children}</div>
    </section>
  );
}

function Row({ line }: { line: FeeLine | ServiceLine }) {
  const service = line as ServiceLine;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className="text-sm font-medium text-[var(--ink)]">
          {line.label}
        </span>
        <span
          className={`text-sm font-semibold ${
            service.free ? 'text-[var(--accent)]' : 'text-[var(--ink)]'
          }`}
        >
          {line.amount}
        </span>
      </div>
      <p className="mt-0.5 text-sm leading-relaxed text-[var(--ink-secondary)]">
        {line.what}
      </p>
      {service.note && (
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{service.note}</p>
      )}
    </div>
  );
}
