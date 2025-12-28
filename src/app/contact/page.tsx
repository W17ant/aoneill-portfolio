/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   CONTACT PAGE - Enquiry form with availability      ###
   ###   status and terminal-style contact form             ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

import { availability } from '@/lib/availability';
import TerminalContactForm from '@/components/experiments/TerminalContactForm';

/* ###########################################################
   ###   1. SEO Metadata                                    ###
   ########################################################### */

export const metadata = {
  title: 'Contact | Antony O\'Neill - Hire a Full-Stack Developer',
  description: 'Get in touch for web development projects, freelance enquiries, and collaborations. Manchester-based full-stack developer available for Next.js, React, and TypeScript projects.',
  keywords: ['Hire Developer', 'Freelance Web Developer', 'Contact Developer', 'Web Development Enquiry', 'Project Collaboration', 'Manchester Web Developer'],
  openGraph: {
    title: 'Contact | Antony O\'Neill',
    description: 'Get in touch for web development projects, freelance enquiries, and collaborations.',
    url: 'https://aoneill.co.uk/contact',
  },
  alternates: {
    canonical: 'https://aoneill.co.uk/contact',
  },
};

/* ###########################################################
   ###   2. Page Component                                  ###
   ########################################################### */

export default function ContactPage() {
  const { status, responseTime, nextStart, headline, description } = availability;

  return (
    <main className="min-h-[100svh] pt-24 pb-16" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-6xl mx-auto px-5">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-semibold mb-4 tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
            Contact
          </h1>
          <p className="text-lg" style={{ color: 'var(--ink-secondary)' }}>
            Let&apos;s discuss your project.
          </p>
        </header>

        {/* 2-column layout: Form (2/3) | Status (1/3) */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Terminal Contact Form - 2/3 width */}
          <div className="lg:col-span-2">
            <TerminalContactForm />

            {/* Direct Contact */}
            <div className="mt-6 text-center lg:text-left">
              <p className="text-sm mb-2" style={{ color: 'var(--ink-secondary)' }}>
                Prefer email directly?
              </p>
              <a
                href="mailto:Antony@aoneill.co.uk"
                className="font-semibold transition-colors hover:text-[var(--link)]"
                style={{ color: 'var(--ink)' }}
              >
                Antony@aoneill.co.uk
              </a>
            </div>
          </div>

          {/* Availability Card - 1/3 width */}
          <div className="card p-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--ink-muted)' }}
              >
                Current Status
              </span>
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                style={{
                  background:
                    status === 'available'
                      ? 'var(--accent-bg)'
                      : status === 'limited'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                  color:
                    status === 'available'
                      ? 'var(--accent)'
                      : status === 'limited'
                      ? 'var(--warning)'
                      : 'var(--danger)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background:
                      status === 'available'
                        ? 'var(--accent-light)'
                        : status === 'limited'
                        ? 'var(--warning)'
                        : 'var(--danger)',
                  }}
                />
                {status === 'available'
                  ? 'Available'
                  : status === 'limited'
                  ? 'Limited'
                  : 'Unavailable'}
              </span>
            </div>

            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              {headline}
            </h2>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {description}
            </p>

            <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--stroke)' }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-muted)' }}>
                  Response Time
                </p>
                <p className="font-semibold" style={{ color: 'var(--ink)' }}>
                  {responseTime}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-muted)' }}>
                  Next Available
                </p>
                <p className="font-semibold" style={{ color: 'var(--ink)' }}>
                  {nextStart}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
