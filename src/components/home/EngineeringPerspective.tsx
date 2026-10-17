/** EngineeringPerspective - How mechanical fault-finding shapes the work, plus three capability summaries */

import Link from 'next/link';
import type { Project } from '@/lib/content';
import GitHubActivity from './GitHubActivity';

/* ###########################################################
   ###   1. Capability Data                                 ###
   ########################################################### */

interface Capability {
  title: string;
  summary: string;
  /** Slugs of the projects that demonstrate this capability */
  proof: string[];
}

// Why capability summaries instead of dot ratings: self-scored 1-5 dots say
// nothing verifiable. Each claim here points at a project a reviewer can open.
const CAPABILITIES: Capability[] = [
  {
    title: 'Building production web applications',
    summary:
      'Next.js and TypeScript apps with auth, payments and an admin side, built for a client and running in production.',
    proof: ['keepitwhat'],
  },
  {
    title: 'Designing and evaluating ML experiments',
    summary:
      'Controlled comparisons with shared preprocessing and logged metrics, so the result says which model is worth its cost, not just which scored highest.',
    proof: ['nlp-twitter-sentiment', 'snake-rl-agent'],
  },
  {
    title: 'Integrating tools and services',
    summary:
      'Joining APIs, WebSockets and command-line tools into something usable, like live agent activity streamed into a visual office.',
    proof: ['agent-office', 'jarvis'],
  },
];

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

interface EngineeringPerspectiveProps {
  /** All projects, used to resolve proof slugs to titles */
  projects: Project[];
}

/**
 * Short narrative on the engineering background followed by the three
 * capability summaries and a compact GitHub activity line.
 *
 * @param projects - Full project list for slug lookups (missing slugs are skipped)
 */
export default function EngineeringPerspective({ projects }: EngineeringPerspectiveProps) {
  const titleFor = (slug: string) => projects.find((p) => p.slug === slug)?.title;

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
      {/* Narrative */}
      <div className="lg:col-span-5">
        <h2
          id="perspective-heading"
          className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] mb-6"
          style={{ color: 'var(--ink)' }}
        >
          Engineering perspective
        </h2>
        <div className="space-y-4 text-base leading-relaxed max-w-[60ch]" style={{ color: 'var(--ink-secondary)' }}>
          <p>
            For 17 years my job was working out why machines had stopped. You form a hypothesis, change one
            thing at a time and trust the measurement over the hunch, usually with someone waiting on the answer.
          </p>
          <p>
            I work the same way with software and models: reproduce the problem, isolate the variable, measure
            it. It&apos;s why my ML work compares simple baselines before reaching for a bigger model.
          </p>
          <p>
            <Link href="/about" className="underline underline-offset-4" style={{ color: 'var(--link)' }}>
              Read the longer story
            </Link>
          </p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="lg:col-span-7">
        <ul className="divide-y" style={{ borderColor: 'var(--stroke)' }}>
          {CAPABILITIES.map((cap) => {
            const proofs = cap.proof
              .map((slug) => ({ slug, title: titleFor(slug) }))
              .filter((p): p is { slug: string; title: string } => Boolean(p.title));

            return (
              <li key={cap.title} className="py-7 first:pt-0" style={{ borderColor: 'var(--stroke)' }}>
                <h3 className="text-xl font-semibold tracking-[-0.01em] mb-2" style={{ color: 'var(--ink)' }}>
                  {cap.title}
                </h3>
                <p className="text-base leading-relaxed mb-3 max-w-[62ch]" style={{ color: 'var(--ink-secondary)' }}>
                  {cap.summary}
                </p>
                {proofs.length > 0 && (
                  <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                    Shown in{' '}
                    {proofs.map((p, i) => (
                      <span key={p.slug}>
                        {i > 0 && (i === proofs.length - 1 ? ' and ' : ', ')}
                        <Link
                          href={`/projects/${p.slug}`}
                          className="underline underline-offset-4"
                          style={{ color: 'var(--link)' }}
                        >
                          {p.title}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        {/* Supporting detail, deliberately small */}
        <div className="pt-7 border-t" style={{ borderColor: 'var(--stroke)' }}>
          <GitHubActivity />
        </div>
      </div>
    </div>
  );
}
