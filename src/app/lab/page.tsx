/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   LAB PAGE - Interactive experiments showcase        ###
   ###   featuring physics, AI/ML, and creative coding      ###
   ###   Last Updated: 30-12-2024                           ###
   ########################################################### */

import { getExperiments, getMakes } from '@/lib/content';
import Link from 'next/link';
import ExperimentIcon from '@/components/ui/ExperimentIcon';
import { ExternalLink } from 'lucide-react';

/* ###########################################################
   ###   1. SEO Metadata                                    ###
   ########################################################### */

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

/* ###########################################################
   ###   2. Page Component                                  ###
   ########################################################### */

export default async function LabPage() {
  const experiments = await getExperiments();
  const makes = await getMakes();

  return (
    <main className="min-h-[100svh] pt-24 pb-16" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <header className="mb-12">
          <h1 className="text-4xl font-semibold mb-4 tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
            Lab
          </h1>
          <p className="text-lg" style={{ color: 'var(--ink-secondary)' }}>
            Small things I build to figure something out. Sometimes it&apos;s how a piece of physics works,
            sometimes it&apos;s an idea I just wanted to try. I try to keep the gimmick count low.
          </p>
        </header>

        {/* Experiments Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--ink)' }}>
            Experiments
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {experiments.map((exp) => {
              const labColors: Record<string, string> = {
                'snake-rl': '#059669',
                'bot-detector': '#059669',
                'lanyard': '#3b82f6',
                'magnetic-cursor': '#3b82f6',
                'terminal-nav': '#8b5cf6',
                'cicd-pipeline': '#8b5cf6',
                'password-strength': '#f59e0b',
                'dependency-graph': '#3b82f6',
              };
              const headerColor = labColors[exp.slug] || '#059669';

              return (
                <Link
                  key={exp.slug}
                  href={`/lab/${exp.slug}`}
                  className="card card-interactive group overflow-hidden"
                >
                  <div
                    className="px-6 pt-5 pb-4 flex items-center"
                    style={{ background: `${headerColor}12` }}
                  >
                    <div
                      className="w-12 h-12 rounded-[var(--radius-sm)] flex items-center justify-center"
                      style={{ background: `${headerColor}20`, color: headerColor }}
                    >
                      <ExperimentIcon name={exp.icon} size={24} />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-xl font-semibold mb-2 group-hover:text-[var(--link)] transition-colors"
                      style={{ color: 'var(--ink)' }}
                    >
                      {exp.title}
                    </h3>
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
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Makes Section */}
        {makes.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--ink)' }}>
              Makes
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {makes.map((make) => (
                <a
                  key={make.slug}
                  href={make.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-interactive group p-6"
                >
                  <div
                    className="w-12 h-12 rounded-[var(--radius-sm)] flex items-center justify-center mb-4"
                    style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                  >
                    <ExperimentIcon name={make.icon} size={24} />
                  </div>
                  <h3
                    className="text-xl font-semibold mb-2 group-hover:text-[var(--link)] transition-colors flex items-center gap-2"
                    style={{ color: 'var(--ink)' }}
                  >
                    {make.title}
                    <ExternalLink size={16} style={{ color: 'var(--ink-tertiary)' }} />
                  </h3>
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                    {make.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {make.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
