import { getExperiments } from '@/lib/content';
import Link from 'next/link';

export const metadata = {
  title: 'Lab | Antony O\'Neill',
  description: 'Experiments exploring interaction, motion, and systems.',
};

export default async function LabPage() {
  const experiments = await getExperiments();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-5">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Lab
          </h1>
          <p className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
            Occasional experiments to explore interaction, motion, and systems.
            Curious, controlled, intentional — never gimmicky.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {experiments.map((exp) => (
            <Link
              key={exp.slug}
              href={`/lab/${exp.slug}`}
              className="group block p-6 rounded-xl border transition-all duration-200 hover:-translate-y-1"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--card-border)',
                boxShadow: '0 4px 6px var(--card-shadow)',
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
                style={{ background: 'var(--accent-green-light)' }}
              >
                {exp.icon || '🧪'}
              </div>
              <h2
                className="text-xl font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors"
                style={{ color: 'var(--foreground)' }}
              >
                {exp.title}
              </h2>
              <p className="text-sm mb-3" style={{ color: 'var(--foreground-muted)' }}>
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-medium rounded-full"
                    style={{
                      background: 'var(--background-secondary)',
                      color: 'var(--foreground-subtle)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
