import { getExperiments } from '@/lib/content';
import Link from 'next/link';
import ExperimentIcon from '@/components/ui/ExperimentIcon';

export const metadata = {
  title: 'Lab | Antony O\'Neill - Interactive Web Experiments',
  description: 'Interactive experiments exploring physics simulations, AI/ML visualizations, UI interactions, and creative coding. Built with React, Canvas, and modern web technologies.',
  keywords: ['Web Experiments', 'Interactive Demos', 'Physics Simulation', 'Canvas Animation', 'React Experiments', 'Creative Coding', 'UI Interactions', 'Machine Learning Visualization'],
  openGraph: {
    title: 'Lab | Antony O\'Neill - Interactive Web Experiments',
    description: 'Interactive experiments exploring physics simulations, AI/ML visualizations, and creative coding.',
    url: 'https://aoneill.co.uk/lab',
  },
  alternates: {
    canonical: 'https://aoneill.co.uk/lab',
  },
};

export default async function LabPage() {
  const experiments = await getExperiments();

  return (
    <main className="min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <header className="mb-12">
          <h1 className="text-4xl font-semibold mb-4 tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
            Lab
          </h1>
          <p className="text-lg" style={{ color: 'var(--ink-secondary)' }}>
            Occasional experiments to explore interaction, motion, and systems.
            Curious, controlled, intentional — never gimmicky.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {experiments.map((exp) => (
            <Link
              key={exp.slug}
              href={`/lab/${exp.slug}`}
              className="card card-interactive group p-6"
            >
              <div
                className="w-12 h-12 rounded-[var(--radius-sm)] flex items-center justify-center mb-4"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
              >
                <ExperimentIcon name={exp.icon} size={24} />
              </div>
              <h2
                className="text-xl font-semibold mb-2 group-hover:text-[var(--link)] transition-colors"
                style={{ color: 'var(--ink)' }}
              >
                {exp.title}
              </h2>
              <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span key={tag} className="tag">
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
