import { getProjectBySlug, getProjects } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-5">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:text-[var(--primary)]"
          style={{ color: 'var(--foreground-muted)' }}
        >
          &larr; Back to Projects
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {project.title}
          </h1>
          <p className="text-xl mb-6" style={{ color: 'var(--foreground-muted)' }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
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
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--primary)' }}
            >
              View Live Site &rarr;
            </a>
          )}
        </header>

        <article className="prose prose-lg max-w-none" style={{ color: 'var(--foreground)' }}>
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Overview
            </h2>
            <p style={{ color: 'var(--foreground-muted)' }}>
              {project.overview || project.description}
            </p>
          </section>

          {project.problem && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                The Problem
              </h2>
              <p style={{ color: 'var(--foreground-muted)' }}>{project.problem}</p>
            </section>
          )}

          {project.approach && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                The Approach
              </h2>
              <p style={{ color: 'var(--foreground-muted)' }}>{project.approach}</p>
            </section>
          )}

          {project.outcome && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                Outcome
              </h2>
              <p style={{ color: 'var(--foreground-muted)' }}>{project.outcome}</p>
            </section>
          )}
        </article>
      </div>
    </main>
  );
}
