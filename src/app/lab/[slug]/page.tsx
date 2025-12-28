/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   LAB EXPERIMENT PAGE - Dynamic experiment detail    ###
   ###   Renders individual lab experiments with metadata   ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

/* ###########################################################
   ###   1. Imports                                         ###
   ########################################################### */

import { getExperimentBySlug, getExperiments } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ExperimentRenderer from '@/components/experiments/ExperimentRenderer';

/* ###########################################################
   ###   2. Type Definitions                                ###
   ########################################################### */

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* ###########################################################
   ###   3. Static Params Generation                        ###
   ########################################################### */

export async function generateStaticParams() {
  const experiments = await getExperiments();
  return experiments.map((exp) => ({ slug: exp.slug }));
}

/* ###########################################################
   ###   4. Metadata Generation                             ###
   ########################################################### */

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const experiment = await getExperimentBySlug(slug);
  if (!experiment) return { title: 'Experiment Not Found' };

  return {
    title: `${experiment.title} | Lab | Antony O'Neill`,
    description: experiment.description,
  };
}

/* ###########################################################
   ###   5. Page Component                                  ###
   ########################################################### */

export default async function ExperimentPage({ params }: PageProps) {
  const { slug } = await params;
  const experiment = await getExperimentBySlug(slug);

  if (!experiment) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-5xl mx-auto px-5">
        <Link
          href="/lab"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:text-[var(--link)]"
          style={{ color: 'var(--ink-secondary)' }}
        >
          &larr; Back to Lab
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl font-semibold mb-4 tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
            {experiment.title}
          </h1>
          <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
            {experiment.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {experiment.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Demo area */}
        <section className="mb-12">
          <ExperimentRenderer slug={slug} />
        </section>

        {/* Explanation */}
        <article className="max-w-3xl">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
              What this explores
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {experiment.explores || experiment.description}
            </p>
          </section>

          {experiment.principles && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
                Principles demonstrated
              </h2>
              <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--ink-secondary)' }}>
                {experiment.principles.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
    </main>
  );
}
