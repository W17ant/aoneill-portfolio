import { getProjectBySlug, getProjects } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Antony O'Neill`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-3xl mx-auto px-5">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:text-[var(--link)]"
          style={{ color: 'var(--ink-secondary)' }}
        >
          &larr; Back to Projects
        </Link>

        <header className="mb-12">
          <div className="flex items-start gap-5 mb-6">
            {project.logo && (
              <div
                className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--stroke)',
                }}
              >
                <Image
                  src={project.logo}
                  alt={`${project.title} logo`}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-semibold mb-2 tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
                {project.title}
              </h1>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
              style={{ borderRadius: '100px' }}
            >
              View Live Site &rarr;
            </a>
          )}
        </header>

        <article>
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
              Overview
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {project.overview || project.description}
            </p>
          </section>

          {project.problem && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
                The Problem
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                {project.problem}
              </p>
            </section>
          )}

          {project.approach && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
                The Approach
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                {project.approach}
              </p>
            </section>
          )}

          {project.outcome && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
                Outcome
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                {project.outcome}
              </p>
            </section>
          )}
        </article>
      </div>
    </main>
  );
}
