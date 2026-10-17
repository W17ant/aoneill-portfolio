/** About page - The engineering-to-ML story, education, and the full career timeline */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTimeline } from '@/lib/content';
import Timeline from '@/components/ui/Timeline';
import EmailButton from '@/components/ui/EmailButton';

export const metadata: Metadata = {
  title: "About | Antony O'Neill, ML & Software Engineer",
  description:
    "Antony O'Neill is an ML & Software Engineer in Manchester, UK. 17 years in mechanical engineering, then an MSc in Computer Science with AI at St Mary's University.",
  alternates: { canonical: '/about/' },
  openGraph: {
    title: "About | Antony O'Neill",
    description: '17 years diagnosing physical systems, now designing ML experiments and building production software.',
    url: '/about/',
  },
};

/* ###########################################################
   ###   1. Static Content                                  ###
   ########################################################### */

// Units taken from the MSc timeline entry in content.ts
const MSC_UNITS = [
  'Databases',
  'Web Technologies',
  'Software Testing and CI/CD',
  'Artificial Intelligence',
  'Machine Learning',
  'Natural Language Processing',
  'Computer Vision',
];

const MSC_PROGRAMME_URL = 'https://online.stmarys.ac.uk/msc-computer-science-with-artificial-intelligence/';

/* ###########################################################
   ###   2. Page Component                                  ###
   ########################################################### */

export default async function AboutPage() {
  const timeline = await getTimeline();

  return (
    <main style={{ background: 'var(--bg-base)' }}>
      {/* =====================================================
          STORY - Portrait + quick facts beside the long-form story
          ===================================================== */}
      <section aria-labelledby="about-heading" className="pt-28 md:pt-16 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Why order classes: on phones the heading and story come first, facts after */}
          <aside className="order-2 lg:order-1 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div
                className="w-40 h-40 md:w-48 md:h-48 rounded-[var(--radius)] overflow-hidden mb-6"
                style={{ border: '1px solid var(--stroke)', background: 'var(--bg-surface)' }}
              >
                <Image
                  src="/images/Selfie.webp"
                  alt="Portrait of Antony O'Neill"
                  width={300}
                  height={260}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt style={{ color: 'var(--ink-muted)' }}>Role</dt>
                  <dd className="font-medium" style={{ color: 'var(--ink)' }}>ML &amp; Software Engineer</dd>
                </div>
                <div>
                  <dt style={{ color: 'var(--ink-muted)' }}>Based in</dt>
                  <dd className="font-medium" style={{ color: 'var(--ink)' }}>Manchester, UK</dd>
                </div>
                <div>
                  <dt style={{ color: 'var(--ink-muted)' }}>Looking for</dt>
                  <dd className="font-medium" style={{ color: 'var(--ink)' }}>
                    Graduate roles in ML engineering, data science and software
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="order-1 lg:order-2 lg:col-span-8">
            <h1
              id="about-heading"
              className="text-4xl md:text-6xl font-bold tracking-[-0.035em] leading-[1.05] mb-8"
              style={{ color: 'var(--ink)' }}
            >
              From fixing machines to testing models
            </h1>

            <div className="space-y-5 text-lg leading-relaxed max-w-[62ch]" style={{ color: 'var(--ink-secondary)' }}>
              <p>
                I spent 17 years in mechanical engineering. A lot of that work was diagnosing equipment that had
                stopped, often with people waiting on me, and always with safety, time and cost in play. You learn
                to fix the cause rather than the symptom, because the symptom comes back.
              </p>
              <p>
                By 2024 I had been teaching myself to program for a while and wanted to go further. I enrolled on
                an MSc in Computer Science with Artificial Intelligence at St Mary&apos;s University to put
                structure on the self-taught work and go deeper on machine learning.
              </p>
              <p>
                Fault-finding and ML evaluation turn out to be close relatives. Both start with a hypothesis,
                change one variable at a time and trust the measurement over the gut feeling. Software bugs and
                broken machines are surprisingly similar once you start pulling them apart.
              </p>
              <p>
                That&apos;s why my{' '}
                <Link href="/projects/nlp-twitter-sentiment" className="underline underline-offset-4" style={{ color: 'var(--link)' }}>
                  sentiment classification study
                </Link>{' '}
                ran six architectures under the same preprocessing before drawing a conclusion, and why the{' '}
                <Link href="/projects/snake-rl-agent" className="underline underline-offset-4" style={{ color: 'var(--link)' }}>
                  Snake reinforcement learning agent
                </Link>{' '}
                came with a set of controlled experiments rather than one lucky run.
              </p>
              <p>
                Alongside the degree I build production websites and web apps for clients, mostly with Next.js,
                React and TypeScript, and I keep a{' '}
                <Link href="/lab" className="underline underline-offset-4" style={{ color: 'var(--link)' }}>
                  Lab
                </Link>{' '}
                of small experiments for whatever I&apos;m trying to understand that week.
              </p>
              <p>
                I&apos;m now looking for a graduate role in ML engineering, data science or software engineering,
                somewhere the technical and the practical meet.
              </p>
            </div>

            {/* Education */}
            <div className="mt-16 pt-10 border-t" style={{ borderColor: 'var(--stroke)' }}>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] mb-6" style={{ color: 'var(--ink)' }}>
                Education
              </h2>
              {/* TODO(antony): add the award/classification and completion date once confirmed. */}
              <h3 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                MSc Computer Science with Artificial Intelligence
              </h3>
              <p className="mb-4" style={{ color: 'var(--ink-secondary)' }}>
                St Mary&apos;s University, 2024 to 2026.{' '}
                <a
                  href={MSC_PROGRAMME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                  style={{ color: 'var(--link)' }}
                >
                  Programme details
                </a>
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
                Units, each with a substantial build alongside the theory:
              </p>
              <ul className="flex flex-wrap gap-2">
                {MSC_UNITS.map((unit) => (
                  <li key={unit} className="tag">
                    {unit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TIMELINE - Full career journey (moved from homepage)
          ===================================================== */}
      <section
        id="timeline"
        aria-labelledby="timeline-heading"
        className="py-20 md:py-28 border-t"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--stroke)' }}
      >
        <div className="max-w-4xl mx-auto px-5">
          <h2
            id="timeline-heading"
            className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] mb-3"
            style={{ color: 'var(--ink)' }}
          >
            Timeline
          </h2>
          <p className="text-base mb-10 md:mb-14" style={{ color: 'var(--ink-secondary)' }}>
            How I got here and what I&apos;ve been doing since.
          </p>
          <Timeline entries={timeline} />
        </div>
      </section>

      {/* =====================================================
          CLOSING CTA
          ===================================================== */}
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-5 flex flex-wrap items-center justify-between gap-6">
          <p className="text-xl md:text-2xl font-semibold tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
            Want to talk about a role?
          </p>
          <div className="flex flex-wrap gap-3">
            <EmailButton
              user="Antony"
              domain="aoneill.co.uk"
              className="btn-primary inline-flex items-center px-6 py-3 rounded-[var(--radius-sm)] text-[13px] font-semibold border transition-colors"
            >
              Email me
            </EmailButton>
            <Link href="/projects" className="btn px-6 py-3">
              See the work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
