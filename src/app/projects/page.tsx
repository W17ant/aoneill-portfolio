import { getProjects } from '@/lib/content';
import Link from 'next/link';

export const metadata = {
  title: 'Projects | Antony O\'Neill',
  description: 'Real-world projects demonstrating decision-making and delivery.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-5">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Projects
          </h1>
          <p className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
            Complete, real-world work. Each project demonstrates decision-making, not just output.
          </p>
        </header>

        <div className="grid gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="block p-6 rounded-xl border transition-all duration-200 hover:-translate-y-1"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--card-border)',
                boxShadow: '0 4px 6px var(--card-shadow)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    {project.title}
                  </h2>
                  <p className="mb-3" style={{ color: 'var(--foreground-muted)' }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-2xl" style={{ color: 'var(--primary)' }}>
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
