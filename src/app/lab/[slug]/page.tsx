import { getExperimentBySlug, getExperiments } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const experiments = await getExperiments();
  return experiments.map((exp) => ({ slug: exp.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const experiment = await getExperimentBySlug(slug);
  if (!experiment) return { title: 'Experiment Not Found' };

  return {
    title: `${experiment.title} | Lab | Antony O'Neill`,
    description: experiment.description,
  };
}

export default async function ExperimentPage({ params }: PageProps) {
  const { slug } = await params;
  const experiment = await getExperimentBySlug(slug);

  if (!experiment) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-5">
        <Link
          href="/lab"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:text-[var(--primary)]"
          style={{ color: 'var(--foreground-muted)' }}
        >
          &larr; Back to Lab
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {experiment.title}
          </h1>
          <p className="text-lg mb-6" style={{ color: 'var(--foreground-muted)' }}>
            {experiment.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {experiment.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-medium rounded-full"
                style={{
                  background: 'var(--accent-green-light)',
                  color: 'var(--accent-green)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Demo area - component will be rendered here */}
        <section
          className="rounded-2xl border overflow-hidden mb-10"
          style={{
            background: 'var(--background-secondary)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="aspect-video flex items-center justify-center">
            <p style={{ color: 'var(--foreground-muted)' }}>
              Demo component: {experiment.component || slug}
            </p>
          </div>
        </section>

        {/* Explanation */}
        <article>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
              What this explores
            </h2>
            <p style={{ color: 'var(--foreground-muted)' }}>
              {experiment.explores || experiment.description}
            </p>
          </section>

          {experiment.principles && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                Principles demonstrated
              </h2>
              <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--foreground-muted)' }}>
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
