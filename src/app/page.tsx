/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   HOME PAGE - Main landing page with hero,           ###
   ###   timeline, projects preview, and lab experiments    ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

import Link from 'next/link';
import { getTimeline, getFeaturedProjects, getExperiments } from '@/lib/content';
import { availability } from '@/lib/availability';
import Timeline from '@/components/ui/Timeline';
import HeroWithLanyard from '@/components/home/HeroWithLanyard';
import MobileAboutCard from '@/components/home/MobileAboutCard';
import ExperimentIcon from '@/components/ui/ExperimentIcon';

/* ###########################################################
   ###   1. Page Component                                  ###
   ########################################################### */

export default async function HomePage() {
  const timeline = await getTimeline();
  const featuredProjects = await getFeaturedProjects();
  const experiments = await getExperiments();

  /* ###########################################################
     ###   2. Page Sections                                    ###
     ########################################################### */

  return (
    <main>
      {/* =====================================================
          HERO SECTION - Main intro with animated lanyard
          ===================================================== */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background layer - separate so lanyard can overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, var(--hero-start), var(--hero-mid), var(--hero-end))',
          }}
        />

        {/* Lanyard, tension bar, and instructions */}
        <HeroWithLanyard />

        <div className="max-w-4xl mx-auto px-5 py-20 w-full relative z-10">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6 tracking-[-0.02em]">
              Antony O&apos;Neill
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
              Full-stack developer focused on shipping clean, fast, reliable web products.
            </p>
            <p className="text-lg text-white/70 mb-10 max-w-2xl leading-relaxed">
              MSc Computer Science & AI student. Previously 17 years in mechanical engineering.
              I bring systems thinking and attention to detail to every build.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#timeline"
                className="btn-primary px-8 py-3"
                style={{ borderRadius: '100px' }}
              >
                View Timeline
              </a>
              <Link
                href="/projects"
                className="btn px-8 py-3 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
                style={{ borderRadius: '100px' }}
              >
                View Projects
              </Link>
            </div>

            {/* Availability indicator */}
            <div className="mt-12">
              <div className="status-badge inline-flex">
                <span
                  className="status-dot"
                  style={{
                    background:
                      availability.status === 'available'
                        ? 'var(--accent-light)'
                        : availability.status === 'limited'
                        ? 'var(--warning)'
                        : 'var(--danger)',
                    boxShadow:
                      availability.status === 'available'
                        ? '0 0 8px var(--accent-light)'
                        : availability.status === 'limited'
                        ? '0 0 8px var(--warning)'
                        : '0 0 8px var(--danger)',
                  }}
                />
                {availability.status === 'available'
                  ? 'Available for projects'
                  : availability.status === 'limited'
                  ? 'Limited availability'
                  : 'Currently unavailable'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE ABOUT CARD - Static flippable lanyard card
          ===================================================== */}
      <div style={{ background: 'linear-gradient(180deg, var(--hero-end), var(--bg-base))' }}>
        <MobileAboutCard />
      </div>

      {/* =====================================================
          TIMELINE SECTION - Career journey and milestones
          ===================================================== */}
      <section id="timeline" className="py-24 md:py-32" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-3xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
            Timeline
          </h2>
          <p className="text-base mb-12" style={{ color: 'var(--ink-secondary)' }}>
            How I got here, what I&apos;ve built, and where I&apos;m heading.
          </p>

          <Timeline entries={timeline} />
        </div>
      </section>

      {/* =====================================================
          FEATURED PROJECTS - Showcase of production work
          ===================================================== */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-semibold mb-2 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
                Featured Projects
              </h2>
              <p style={{ color: 'var(--ink-secondary)' }}>
                Real work, shipped to production.
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: 'var(--link)' }}
            >
              View all
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="card card-interactive group p-6"
              >
                <h3
                  className="text-lg font-semibold mb-2 group-hover:text-[var(--link)] transition-colors"
                  style={{ color: 'var(--ink)' }}
                >
                  {project.title}
                </h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/projects"
            className="sm:hidden flex items-center justify-center gap-2 mt-8 btn"
          >
            View all projects &rarr;
          </Link>
        </div>
      </section>

      {/* =====================================================
          LAB PREVIEW - Interactive experiments showcase
          ===================================================== */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-semibold mb-2 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
                Lab
              </h2>
              <p style={{ color: 'var(--ink-secondary)' }}>
                Experiments exploring interaction, motion, and systems.
              </p>
            </div>
            <Link
              href="/lab"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: 'var(--link)' }}
            >
              View all
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {experiments.slice(0, 4).map((exp) => (
              <Link
                key={exp.slug}
                href={`/lab/${exp.slug}`}
                className="card card-interactive group p-4 sm:p-5"
              >
                <div
                  className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center mb-3"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                >
                  <ExperimentIcon name={exp.icon} size={20} />
                </div>
                <h3
                  className="font-semibold mb-1 text-sm sm:text-base group-hover:text-[var(--link)] transition-colors truncate"
                  style={{ color: 'var(--ink)' }}
                >
                  {exp.title}
                </h3>
                <p className="text-xs sm:text-sm truncate" style={{ color: 'var(--ink-muted)' }}>
                  {exp.tags.slice(0, 2).join(' · ')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CTA - Call to action with availability
          ===================================================== */}
      <section
        className="py-24 md:py-32"
        style={{
          background: 'linear-gradient(135deg, var(--hero-start), var(--hero-end))',
        }}
      >
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4 tracking-[-0.01em]">Let&apos;s work together</h2>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            {availability.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-primary px-8 py-3"
              style={{ borderRadius: '100px' }}
            >
              {availability.ctaText}
            </Link>
            <a
              href="mailto:Antony@aoneill.co.uk"
              className="btn px-8 py-3 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
              style={{ borderRadius: '100px' }}
            >
              Email directly
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ###########################################################
   ###           END OF HOME PAGE                           ###
   ########################################################### */
