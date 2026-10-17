/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   PROJECT DETAIL PAGE - Case study per project:      ###
   ###   problem -> approach -> results -> next steps       ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

import { getProjectBySlug, getProjects, getExperimentBySlug, projectCategoryLabels } from '@/lib/content';
import type { Project } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import ProjectMediaGallery from '@/components/projects/ProjectMediaGallery';
import ResultsChart from '@/components/projects/ResultsChart';

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

  const categoryLabel = projectCategoryLabels[project.category];
  const description = toMetaDescription(project.description);
  // Why: a real screenshot makes a better social card than a square logo.
  const ogImage = project.media?.find((m) => m.kind === 'image' && m.device !== 'mobile');

  return {
    title: `${project.title} | ${categoryLabel} Case Study | Antony O'Neill`,
    description,
    keywords: [...project.tech, categoryLabel, 'Case Study'],
    openGraph: {
      title: `${project.title} | ${categoryLabel} Case Study`,
      description,
      url: `/projects/${slug}/`,
      type: 'article',
      images: ogImage
        ? [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }]
        : project.logo
          ? [{ url: project.logo }]
          : undefined,
    },
    alternates: {
      canonical: `/projects/${slug}/`,
    },
  };
}

/** Trims to the ~160 characters search engines show, cutting at a word boundary. */
function toMetaDescription(text: string): string {
  // Why: 160 is the common SERP snippet cut-off; past that the text is truncated mid-word.
  const MAX = 160;
  if (text.length <= MAX) return text;
  const cut = text.slice(0, MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/* ###########################################################
   ###   4. Schema.org Structured Data                      ###
   ########################################################### */

function ProjectSchema({ project, slug }: { project: Project, slug: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    // Why: JSON-LD has no metadataBase, so it needs absolute URLs on the canonical www host.
    url: `https://www.aoneill.co.uk/projects/${slug}/`,
    author: {
      '@type': 'Person',
      name: 'Antony O\'Neill',
      url: 'https://www.aoneill.co.uk/',
    },
    genre: projectCategoryLabels[project.category],
    keywords: project.tech.join(', '),
    ...(project.url && {
      mainEntityOfPage: project.url.startsWith('http') ? project.url : `https://www.aoneill.co.uk${project.url}`,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ###########################################################
   ###   5. Section Helpers                                 ###
   ########################################################### */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <p className="leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
      {children}
    </p>
  );
}

/* ###########################################################
   ###   6. Page Component                                  ###
   ########################################################### */

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const allProjects = await getProjects();

  if (!project) {
    notFound();
  }

  const relatedExperiment = project.relatedExperiment
    ? await getExperimentBySlug(project.relatedExperiment)
    : undefined;

  // Why: same-category projects first, so an ML case study points at more ML work.
  const others = allProjects.filter((p) => p.slug !== slug);
  const relatedProjects = [
    ...others.filter((p) => p.category === project.category),
    ...others.filter((p) => p.category !== project.category),
  ].slice(0, 2);

  const isExternal = (href: string) => href.startsWith('http');

  return (
    <>
      <ProjectSchema project={project} slug={slug} />
      <main className="min-h-[100svh] pt-24 pb-16" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-3xl mx-auto px-5">
        <Link
          href="/projects/"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:text-[var(--link)]"
          style={{ color: 'var(--ink-secondary)' }}
        >
          &larr; Back to Projects
        </Link>

        <header className="mb-10">
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
                  alt=""
                  width={64}
                  height={64}
                  className="object-contain rounded-xl"
                />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: 'var(--accent)' }}>
                {projectCategoryLabels[project.category]}
              </p>
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

          <div className="flex flex-wrap gap-3">
            {project.url && (
              <a
                href={project.url}
                {...(isExternal(project.url) && { target: '_blank', rel: 'noopener noreferrer' })}
                className="btn btn-accent"
                style={{ borderRadius: '100px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {project.category === 'client' ? 'View Live Site' : 'Open Project'}
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn inline-flex items-center gap-2"
                style={{ borderRadius: '100px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Code
              </a>
            )}
            {relatedExperiment && (
              <Link
                href={`/lab/${relatedExperiment.slug}/`}
                className="btn inline-flex items-center gap-2"
                style={{ borderRadius: '100px' }}
              >
                Try it in the Lab
              </Link>
            )}
          </div>
        </header>
      </div>

      {/* Why: visuals sit in a wider column than the prose so screenshots are readable. */}
      {project.media && project.media.length > 0 && (
        <div className="max-w-5xl mx-auto px-5 mb-14">
          <ProjectMediaGallery media={project.media} />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-5">
        <article>
          <Section title="Overview">
            <Prose>{project.overview || project.description}</Prose>
          </Section>

          {project.problem && (
            <Section title="The problem">
              <Prose>{project.problem}</Prose>
            </Section>
          )}

          {project.approach && (
            <Section title="The approach">
              <Prose>{project.approach}</Prose>
            </Section>
          )}

          {(project.outcome || project.results) && (
            <Section title="Results">
              {project.outcome && <Prose>{project.outcome}</Prose>}
              {project.results && project.results.length > 0 && (
                <div className="mt-6">
                  <ResultsChart results={project.results} />
                </div>
              )}
              {project.evaluation && (
                <div
                  className="mt-6 rounded-xl p-5"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--stroke)' }}
                >
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                    How it was evaluated
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                    {project.evaluation}
                  </p>
                </div>
              )}
            </Section>
          )}

          {project.nextSteps && (
            <Section title="What I'd do next">
              <Prose>{project.nextSteps}</Prose>
            </Section>
          )}

          {relatedExperiment && (
            <Section title="Interactive version">
              <Prose>
                {relatedExperiment.description}{' '}
                <Link href={`/lab/${relatedExperiment.slug}/`} className="font-medium hover:underline" style={{ color: 'var(--link)' }}>
                  Open {relatedExperiment.title} in the Lab &rarr;
                </Link>
              </Prose>
            </Section>
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
                  href={`/projects/${related.slug}/`}
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
                          alt=""
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-1" style={{ color: 'var(--ink-muted)' }}>
                        {projectCategoryLabels[related.category]}
                      </p>
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
