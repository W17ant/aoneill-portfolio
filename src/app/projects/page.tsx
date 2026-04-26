/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   PROJECTS PAGE - Portfolio project listing with     ###
   ###   GitHub link and project cards                      ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

import { getProjects } from '@/lib/content';
import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';

/* ###########################################################
   ###   1. SEO Metadata                                    ###
   ########################################################### */

export const metadata = {
  title: 'Projects | Antony O\'Neill - AI & ML Developer',
  description: 'Portfolio of web applications, data-driven projects, and ML experiments. Built with Next.js, Python, and modern tooling.',
  keywords: ['AI Projects', 'ML Portfolio', 'Data Science Projects', 'Next.js Projects', 'Python Projects', 'Web Application Examples'],
  openGraph: {
    title: 'Projects | Antony O\'Neill',
    description: 'Portfolio of web applications, data-driven projects, and ML experiments.',
    url: 'https://aoneill.co.uk/projects',
  },
  alternates: {
    canonical: 'https://aoneill.co.uk/projects',
  },
};

/* ###########################################################
   ###   2. Page Component                                  ###
   ########################################################### */

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-[100svh] pt-24 pb-16" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <header className="mb-12">
          <h1 className="text-4xl font-semibold mb-4 tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
            Projects
          </h1>
          <p className="text-lg mb-4" style={{ color: 'var(--ink-secondary)' }}>
            Things I&apos;ve actually built and shipped. The case studies show the decisions behind them, not just screenshots.
          </p>
          <a
            href="https://github.com/W17ANT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--link)' }}
          >
            <Github size={18} />
            View my GitHub
          </a>
        </header>

        <div className="grid gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="card card-interactive group p-6"
            >
              <div className="flex items-start gap-5">
                {/* Logo */}
                {project.logo && (
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--stroke)',
                    }}
                  >
                    <Image
                      src={project.logo}
                      alt={`${project.title} logo`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2
                        className="text-xl font-semibold mb-2 group-hover:text-[var(--link)] transition-colors"
                        style={{ color: 'var(--ink)' }}
                      >
                        {project.title}
                      </h2>
                      <p className="mb-4 leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span key={t} className="tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span
                      className="text-xl flex-shrink-0 transition-transform group-hover:translate-x-1"
                      style={{ color: 'var(--link)' }}
                    >
                      &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
