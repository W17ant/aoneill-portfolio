/** ContactModes - Switches /contact between the plain form (default) and the optional terminal form */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ContactForm, { type ContactFormInitialResult } from '@/components/experiments/ContactForm';

// Why: the terminal is an opt-in extra, so keep it out of the initial bundle
const TerminalContactForm = dynamic(() => import('@/components/experiments/TerminalContactForm'), {
  ssr: false,
  loading: () => (
    <p className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
      Loading terminal…
    </p>
  ),
});

type Mode = 'form' | 'terminal';

// localStorage key for the remembered mode
const STORAGE_KEY = 'contact-mode';

function readStoredMode(): Mode | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'terminal' || stored === 'form' ? stored : null;
  } catch {
    // Why: storage can throw in private windows or with site data blocked
    return null;
  }
}

function storeMode(mode: Mode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Non-essential preference; ignore storage failures
  }
}

/**
 * Renders the contact form with a "Terminal mode" toggle. The server always
 * renders the plain form; a remembered terminal preference is applied after
 * hydration. A no-JS submission result always shows in the plain form.
 * @param initialResult - outcome of a no-JS form post, forwarded to ContactForm
 */
export default function ContactModes({ initialResult }: { initialResult: ContactFormInitialResult }) {
  const [mode, setMode] = useState<Mode>('form');

  useEffect(() => {
    // Why: don't hide a no-JS success/error message behind the terminal
    if (initialResult) return;
    const stored = readStoredMode();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off sync from localStorage after hydration
    if (stored === 'terminal') setMode('terminal');
  }, [initialResult]);

  const toggle = () => {
    const next: Mode = mode === 'form' ? 'terminal' : 'form';
    setMode(next);
    storeMode(next);
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={mode === 'terminal'}
          className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors"
          style={{ color: 'var(--ink-secondary)', border: '1px solid var(--stroke-hover)', background: 'var(--bg-surface)' }}
        >
          <span aria-hidden="true" className="font-mono">&gt;_</span>
          Terminal mode
          <span
            aria-hidden="true"
            className="text-xs font-semibold"
            style={{ color: mode === 'terminal' ? 'var(--accent)' : 'var(--ink-muted)' }}
          >
            {mode === 'terminal' ? 'On' : 'Off'}
          </span>
        </button>
      </div>

      {mode === 'terminal' ? <TerminalContactForm /> : <ContactForm initialResult={initialResult} />}
    </div>
  );
}
