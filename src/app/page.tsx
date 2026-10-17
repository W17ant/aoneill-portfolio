/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   HOME PAGE - Introduction, selected work,           ###
   ###   engineering perspective, lab preview, contact      ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjects, getExperiments, type Project } from '@/lib/content';
import { availability } from '@/lib/availability';
import HeroWithLanyard from '@/components/home/HeroWithLanyard';
import MobileAboutCard from '@/components/home/MobileAboutCard';
import SelectedProjects from '@/components/home/SelectedProjects';
import EngineeringPerspective from '@/components/home/EngineeringPerspective';
import ExperimentIcon from '@/components/ui/ExperimentIcon';
import EmailButton from '@/components/ui/EmailButton';
import ObfuscatedEmail from '@/components/ui/ObfuscatedEmail';

export const metadata: Metadata = {
  title: "Antony O'Neill | ML & Software Engineer, Manchester, UK",
  description:
    "ML & Software Engineer in Manchester, UK. MSc Computer Science & AI after 17 years in mechanical engineering. Selected work, lab experiments and contact details.",
  alternates: { canonical: '/' },
};

/* ###########################################################
   ###   1. Content Selection                               ###
   ########################################################### */

// Why by slug: the homepage story is fixed to these three (a tool, an ML
// study, a client build). The `featured` flag drives /projects and can change
// independently without reshuffling the homepage.
const SELECTED_SLUGS = ['agent-office', 'nlp-twitter-sentiment', 'keepitwhat'];

// Why these three: two ML experiments plus the terminal UI show range without
// repeating the lanyard, which is already in the hero.
const LAB_SLUGS = ['snake-rl', 'bot-detector', 'terminal-nav'];

// Why not the global .btn class: it is unlayered CSS, so it overrides
// Tailwind utilities and paints light-theme surfaces onto the dark bands.
const BUTTON_BASE =
  'inline-flex items-center px-6 py-3 rounded-[var(--radius-sm)] text-[13px] font-semibold border transition-colors';
const PRIMARY = `btn-primary ${BUTTON_BASE}`;
const GHOST_ON_DARK = `${BUTTON_BASE} border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30`;

const GITHUB_URL = 'https://github.com/W17ANT';

// TODO(antony): no CV file exists in /public. Add one (e.g. /public/antony-oneill-cv.pdf)
// and set CV_URL to show a "Download CV" link in the hero.
const CV_URL: string | null = null;

/* ###########################################################
   ###   2. Page Component                                  ###
   ########################################################### */

export default async function HomePage() {
  const [projects, experiments] = await Promise.all([getProjects(), getExperiments()]);

  const selected = SELECTED_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is Project => Boolean(p)
  );
  const labPicks = LAB_SLUGS.map((slug) => experiments.find((e) => e.slug === slug)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e)
  );

  const statusColor =
    availability.status === 'available'
      ? 'var(--accent-light)'
      : availability.status === 'limited'
        ? 'var(--warning)'
        : 'var(--danger)';

  return (
    <main>
      {/* =====================================================
          INTRODUCTION - Who, role, pitch, CTAs + lanyard
          ===================================================== */}
      <section
        aria-labelledby="intro-heading"
        className="relative overflow-hidden pt-28 md:pt-12 lg:pt-0"
        style={{
          // Why: a quieter two-stop version of the old three-stop gradient,
          // with the blue kept as a soft glow behind the lanyard only.
          background:
            'radial-gradient(ellipse 700px 600px at 85% 30%, color-mix(in srgb, var(--hero-end) 45%, transparent), transparent), linear-gradient(160deg, var(--hero-start), var(--hero-mid))',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_480px] gap-x-12 items-center">
          <div className="py-12 md:py-20 lg:py-24">
            <h1 id="intro-heading" className="text-white mb-8">
              <span className="block text-5xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.02]">
                Antony O&apos;Neill
              </span>
              <span className="block mt-4 text-xl md:text-2xl font-medium tracking-[-0.01em] text-white/80">
                ML &amp; Software Engineer, Manchester, UK
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-[38ch] mb-10">
              Seventeen years as a mechanical engineer, now finishing an MSc in Computer Science &amp; AI (April 2027). I design ML
              experiments and build the production software around them.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a href="#work" className={PRIMARY}>
                View selected work
              </a>
              <EmailButton
                user="Antony"
                domain="aoneill.co.uk"
                className={GHOST_ON_DARK}
              >
                Email me
              </EmailButton>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={GHOST_ON_DARK}
              >
                GitHub
              </a>
              {/* CV slot: rendered only once CV_URL is set (see TODO above) */}
              {CV_URL && (
                <a
                  href={CV_URL}
                  className={GHOST_ON_DARK}
                >
                  Download CV
                </a>
              )}
            </div>

            <p className="mt-10 inline-flex items-center gap-2.5 text-sm text-white/70">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: statusColor }}
                aria-hidden="true"
              />
              {availability.label}: ML engineering, data science and software.
            </p>
          </div>

          <HeroWithLanyard />
        </div>

        {/* Mobile/tablet stand-in for the lanyard (component is lg:hidden) */}
        <MobileAboutCard />
      </section>

      {/* =====================================================
          SELECTED WORK - Three editorial project spreads
          ===================================================== */}
      <section id="work" aria-labelledby="work-heading" className="py-24 md:py-32 scroll-mt-20" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-14 md:mb-20">
            <div>
              <h2
                id="work-heading"
                className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] mb-3"
                style={{ color: 'var(--ink)' }}
              >
                Selected work
              </h2>
              <p className="text-base max-w-[52ch]" style={{ color: 'var(--ink-secondary)' }}>
                An open-source tool, an ML study and a client build.
              </p>
            </div>
            <Link href="/projects" className="text-sm font-medium underline underline-offset-4" style={{ color: 'var(--link)' }}>
              All projects
            </Link>
          </div>

          <SelectedProjects projects={selected} />
        </div>
      </section>

      {/* =====================================================
          ENGINEERING PERSPECTIVE - Background + capabilities
          ===================================================== */}
      <section
        aria-labelledby="perspective-heading"
        className="py-24 md:py-32 border-y"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--stroke)' }}
      >
        <div className="max-w-6xl mx-auto px-5">
          <EngineeringPerspective projects={projects} />
        </div>
      </section>

      {/* =====================================================
          LAB PREVIEW - Three experiments, links to /lab
          ===================================================== */}
      <section aria-labelledby="lab-heading" className="py-24 md:py-28" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2
                id="lab-heading"
                className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] mb-3"
                style={{ color: 'var(--ink)' }}
              >
                Lab
              </h2>
              <p className="text-base max-w-[52ch]" style={{ color: 'var(--ink-secondary)' }}>
                Small interactive experiments you can play with in the browser.
              </p>
            </div>
            <Link href="/lab" className="text-sm font-medium underline underline-offset-4" style={{ color: 'var(--link)' }}>
              Open the Lab
            </Link>
          </div>

          <ul className="grid gap-4 md:grid-cols-3">
            {labPicks.map((exp) => (
              <li key={exp.slug}>
                <Link
                  href={`/lab/${exp.slug}`}
                  className="group flex h-full gap-4 p-5 rounded-[var(--radius)] border transition-colors hover:border-[var(--stroke-hover)]"
                  style={{ borderColor: 'var(--stroke)', background: 'var(--bg-elevated)' }}
                >
                  <span
                    className="w-10 h-10 shrink-0 rounded-[var(--radius-sm)] flex items-center justify-center"
                    style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                    aria-hidden="true"
                  >
                    <ExperimentIcon name={exp.icon} size={20} />
                  </span>
                  <span>
                    <span
                      className="block font-semibold mb-1 group-hover:text-[var(--link)] transition-colors"
                      style={{ color: 'var(--ink)' }}
                    >
                      {exp.title}
                    </span>
                    <span className="block text-sm leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                      {exp.description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =====================================================
          CONTACT - Closing call to action
          ===================================================== */}
      <section
        aria-labelledby="contact-heading"
        className="py-24 md:py-32"
        style={{ background: 'linear-gradient(160deg, var(--hero-start), var(--hero-mid))' }}
      >
        <div className="max-w-6xl mx-auto px-5 grid gap-10 lg:grid-cols-12 items-end">
          <div className="lg:col-span-7">
            <h2 id="contact-heading" className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] text-white mb-5">
              Hiring for a graduate role?
            </h2>
            <p className="text-lg text-white/75 leading-relaxed max-w-[52ch]">{availability.description}</p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end flex flex-col gap-4 items-start">
            <div className="flex flex-wrap gap-3">
              <EmailButton user="Antony" domain="aoneill.co.uk" className={PRIMARY}>
                Email me
              </EmailButton>
              <Link
                href="/contact"
                className={GHOST_ON_DARK}
              >
                Use the contact form
              </Link>
            </div>
            <ObfuscatedEmail user="Antony" domain="aoneill.co.uk" className="text-sm text-white/70 hover:text-white" />
          </div>
        </div>
      </section>
    </main>
  );
}

/* ###########################################################
   ###           END OF HOME PAGE                           ###
   ########################################################### */
