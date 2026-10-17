/** SelectedProjects - Large editorial cards for the three homepage case studies */

import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/content';

/* ###########################################################
   ###   1. Visual Selection                                ###
   ########################################################### */

interface Visual {
  src: string;
  alt: string;
  /** cover fills the frame (illustrations); contain pads it (logos on white) */
  fit: 'cover' | 'contain';
  /** Frame background shown behind contained images */
  background: string;
}

interface Framing {
  /** Plain-language description of what kind of project this is */
  kind: string;
  visual: Visual;
}

// Why a local map: the homepage picks these three by slug rather than the
// `featured` flag, and each needs its own framing. When content.ts gains a
// `media` field it takes priority via pickMedia() below, so a real
// screenshot slots into the same frame without touching this file.
const FRAMING: Record<string, Framing> = {
  'agent-office': {
    kind: 'Open-source developer tool',
    visual: {
      src: '/images/agent-office-logo.webp',
      alt: 'Pixel-art illustration of a developer at a desk, the Agent Office artwork',
      fit: 'cover',
      background: 'var(--hero-start)',
    },
  },
  'nlp-twitter-sentiment': {
    kind: 'MSc NLP assessment',
    visual: {
      src: '/images/nlp-twitter-sentiment-logo.webp',
      alt: 'Illustration of positive, negative and neutral speech bubbles over a network graph',
      fit: 'cover',
      background: 'var(--hero-start)',
    },
  },
  'the-card-genie': {
    kind: 'My own AI product',
    visual: {
      src: '/images/projects/the-card-genie/desktop-home.webp',
      alt: 'The Card Genie homepage',
      fit: 'cover',
      background: 'var(--hero-start)',
    },
  },
  keepitwhat: {
    kind: 'Client e-commerce build',
    visual: {
      src: '/images/keepitwhat-logo.png',
      alt: 'Keep It What logo',
      fit: 'contain',
      // Why white in both themes: the logo artwork has a white background
      background: '#ffffff',
    },
  },
};

/** First screenshot from the project's `media` list, if it has one. */
function pickMedia(project: Project): { src: string; alt?: string } | null {
  return project.media?.[0] ?? null;
}

function visualFor(project: Project): Visual {
  const media = pickMedia(project);
  const framing = FRAMING[project.slug];
  if (media) {
    return {
      src: media.src,
      alt: media.alt ?? `${project.title} screenshot`,
      fit: 'cover',
      background: 'var(--bg-surface)',
    };
  }
  if (framing) return framing.visual;
  return {
    src: project.logo ?? '/images/og-image.png',
    alt: `${project.title} logo`,
    fit: 'contain',
    background: 'var(--bg-surface)',
  };
}

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

interface SelectedProjectsProps {
  projects: Project[];
}

/**
 * Renders each project as a wide image beside its summary, alternating sides
 * on desktop so the section reads as a sequence of spreads, not a card grid.
 *
 * @param projects - Projects in display order (already resolved by slug)
 */
export default function SelectedProjects({ projects }: SelectedProjectsProps) {
  return (
    <ol className="flex flex-col gap-20 md:gap-28" aria-label="Selected projects">
      {projects.map((project, index) => {
        const visual = visualFor(project);
        const kind = FRAMING[project.slug]?.kind;
        const caseStudy = `/projects/${project.slug}`;
        const flip = index % 2 === 1;
        const externalHref = project.url?.startsWith('http') ? project.url : undefined;

        return (
          <li key={project.slug} className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Visual - duplicate link to the case study, hidden from AT to avoid repetition */}
            <Link
              href={caseStudy}
              tabIndex={-1}
              aria-hidden="true"
              className={`group block lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}
            >
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)]"
                style={{ background: visual.background, border: '1px solid var(--stroke)' }}
              >
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className={`transition-transform duration-500 ease-out group-hover:scale-[1.02] ${
                    visual.fit === 'cover' ? 'object-cover' : 'object-contain p-16 md:p-24'
                  }`}
                  priority={index === 0}
                />
              </div>
            </Link>

            {/* Summary */}
            <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
              {kind && (
                <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
                  {kind}
                </p>
              )}
              <h3
                className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] mb-4"
                style={{ color: 'var(--ink)' }}
              >
                <Link href={caseStudy} className="hover:text-[var(--link)] transition-colors">
                  {project.title}
                </Link>
              </h3>
              <p className="text-base leading-relaxed mb-5 max-w-[60ch]" style={{ color: 'var(--ink-secondary)' }}>
                {project.description}
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>
                {project.tech.slice(0, 4).join(', ')}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                <Link href={caseStudy} className="underline underline-offset-4" style={{ color: 'var(--link)' }}>
                  Read the case study
                </Link>
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 decoration-[var(--stroke-hover)] hover:decoration-current"
                    style={{ color: 'var(--ink-secondary)' }}
                  >
                    Source on GitHub
                  </a>
                )}
                {externalHref && (
                  <a
                    href={externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 decoration-[var(--stroke-hover)] hover:decoration-current"
                    style={{ color: 'var(--ink-secondary)' }}
                  >
                    Visit the live site
                  </a>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
