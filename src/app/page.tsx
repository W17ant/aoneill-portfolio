import Link from 'next/link';
import { getTimeline, getFeaturedProjects, getExperiments } from '@/lib/content';
import { availability } from '@/lib/availability';
import Timeline from '@/components/ui/Timeline';

export default async function HomePage() {
  const timeline = await getTimeline();
  const featuredProjects = await getFeaturedProjects();
  const experiments = await getExperiments();

  return (
    <main>
      {/* Hero Section */}
      <section
        className="min-h-[90vh] flex items-center pt-20"
        style={{
          background: 'linear-gradient(135deg, var(--hero-start), var(--hero-mid), var(--hero-end))',
        }}
      >
        <div className="max-w-4xl mx-auto px-5 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Antony O'Neill
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
            Full-stack developer focused on shipping clean, fast, reliable web products.
          </p>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            MSc Computer Science & AI student. Previously 17 years in mechanical engineering.
            I bring systems thinking and attention to detail to every build.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#timeline"
              className="px-8 py-3 rounded-full font-semibold bg-white text-[var(--hero-start)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              View Timeline
            </a>
            <Link
              href="/projects"
              className="px-8 py-3 rounded-full font-semibold border-2 border-white/30 text-white transition-all hover:bg-white/10"
            >
              View Projects
            </Link>
          </div>

          {/* Availability indicator */}
          <div className="mt-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    availability.status === 'available'
                      ? '#22c55e'
                      : availability.status === 'limited'
                      ? '#f59e0b'
                      : '#ef4444',
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
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            Timeline
          </h2>
          <p className="text-lg mb-10" style={{ color: 'var(--foreground-muted)' }}>
            How I got here, what I've built, and where I'm heading.
          </p>

          <Timeline entries={timeline} />
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20" style={{ background: 'var(--background-secondary)' }}>
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                Featured Projects
              </h2>
              <p style={{ color: 'var(--foreground-muted)' }}>
                Real work, shipped to production.
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors hover:bg-[var(--card)]"
              style={{ color: 'var(--primary)' }}
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
                className="group p-6 rounded-xl border transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: 'var(--card)',
                  borderColor: 'var(--card-border)',
                  boxShadow: '0 4px 6px var(--card-shadow)',
                }}
              >
                <h3
                  className="text-xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors"
                  style={{ color: 'var(--foreground)' }}
                >
                  {project.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-xs font-medium rounded-full"
                      style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/projects"
            className="sm:hidden flex items-center justify-center gap-2 mt-8 px-6 py-3 rounded-lg font-medium border transition-colors"
            style={{
              borderColor: 'var(--card-border)',
              color: 'var(--foreground)',
            }}
          >
            View all projects &rarr;
          </Link>
        </div>
      </section>

      {/* Lab Preview Section */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                Lab
              </h2>
              <p style={{ color: 'var(--foreground-muted)' }}>
                Experiments exploring interaction, motion, and systems.
              </p>
            </div>
            <Link
              href="/lab"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors hover:bg-[var(--background-secondary)]"
              style={{ color: 'var(--primary)' }}
            >
              View all
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {experiments.slice(0, 4).map((exp) => (
              <Link
                key={exp.slug}
                href={`/lab/${exp.slug}`}
                className="group p-5 rounded-xl border transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: 'var(--card)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"
                  style={{ background: 'var(--accent-green-light)' }}
                >
                  {exp.icon}
                </div>
                <h3
                  className="font-bold mb-1 group-hover:text-[var(--primary)] transition-colors"
                  style={{ color: 'var(--foreground)' }}
                >
                  {exp.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  {exp.tags.slice(0, 2).join(' · ')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(135deg, var(--hero-start), var(--hero-end))',
        }}
      >
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Let's work together</h2>
          <p className="text-lg text-white/80 mb-8">
            {availability.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 rounded-full font-semibold bg-white text-[var(--hero-start)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {availability.ctaText}
            </Link>
            <a
              href="mailto:antony@aoneill.co.uk"
              className="px-8 py-3 rounded-full font-semibold border-2 border-white/30 text-white transition-all hover:bg-white/10"
            >
              Email directly
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
