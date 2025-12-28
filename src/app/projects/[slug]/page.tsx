/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   PROJECT DETAIL PAGE - Individual project showcase  ###
   ###   with Schema.org markup and related projects        ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

import { getProjectBySlug, getProjects } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* ###########################################################
   ###   2. Static Generation                               ###
   ########################################################### */

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

/* ###########################################################
   ###   3. SEO Metadata                                    ###
   ########################################################### */

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  const fullDescription = project.overview
    ? `${project.description} ${project.overview}`
    : project.description;

  return {
    title: `${project.title} | Antony O'Neill - Web Development Project`,
    description: fullDescription.slice(0, 160),
    keywords: [...project.tech, 'Web Development', 'Case Study', 'Portfolio Project'],
    openGraph: {
      title: `${project.title} | Antony O'Neill`,
      description: project.description,
      url: `https://aoneill.co.uk/projects/${slug}`,
      type: 'article',
      images: project.logo ? [{ url: project.logo }] : undefined,
    },
    alternates: {
      canonical: `https://aoneill.co.uk/projects/${slug}`,
    },
  };
}

/* ###########################################################
   ###   4. Schema.org Structured Data                      ###
   ########################################################### */

function ProjectSchema({ project, slug }: { project: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>, slug: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `https://aoneill.co.uk/projects/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Antony O\'Neill',
      url: 'https://aoneill.co.uk',
    },
    keywords: project.tech.join(', '),
    ...(project.url && { mainEntityOfPage: project.url }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ###########################################################
   ###   5. Page Component                                  ###
   ########################################################### */

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const allProjects = await getProjects();

  if (!project) {
    notFound();
  }

  // Get related projects (other projects, excluding current)
  const relatedProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <ProjectSchema project={project} slug={slug} />
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

        {/* Related Projects - Internal Linking */}
        {relatedProjects.length > 0 && (
          <section className="mt-16 pt-10 border-t" style={{ borderColor: 'var(--stroke)' }}>
            <h2 className="text-xl font-semibold mb-6 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
              More Projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedProjects.map((related) => (
                <Link
                  key={related.slug}
                  href={`/projects/${related.slug}`}
                  className="card card-interactive p-5 group"
                >
                  <div className="flex items-start gap-4">
                    {related.logo && (
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center"
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--stroke)',
                        }}
                      >
                        <Image
                          src={related.logo}
                          alt={`${related.title} logo`}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold mb-1 group-hover:text-[var(--link)] transition-colors"
                        style={{ color: 'var(--ink)' }}
                      >
                        {related.title}
                      </h3>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--ink-secondary)' }}>
                        {related.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
    </>
  );
}
