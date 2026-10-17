/** Sitemap - lists every public portfolio page for search engines */

import type { MetadataRoute } from 'next';
import { getExperiments, getProjects } from '@/lib/content';

// Why: www is the canonical host; the apex only redirects here.
const SITE_URL = 'https://www.aoneill.co.uk';

/**
 * Builds an absolute URL with a trailing slash.
 *
 * Why the slash: next.config.ts sets `trailingSlash: true`, so /projects
 * redirects to /projects/. Listing the redirecting form would make every
 * sitemap entry a redirect hop.
 *
 * @param path - site path starting with "/"
 * @returns absolute www URL ending in "/"
 */
function url(path: string): string {
  return `${SITE_URL}${path.endsWith('/') ? path : `${path}/`}`;
}

/**
 * Generates /sitemap.xml.
 *
 * Client demos (/MLH, /tomthevacuumman, /renovaelabs, /MSC) are deliberately
 * left out: they are previews for clients, not part of the portfolio.
 *
 * @returns sitemap entries for static pages, projects and lab experiments
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, experiments] = await Promise.all([getProjects(), getExperiments()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'monthly', priority: 1 },
    { url: url('/about'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/projects'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/lab'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/contact'), changeFrequency: 'yearly', priority: 0.6 },
    // Why: /arc is the static Jarvis docs subtree under /public/arc.
    { url: url('/arc'), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: url(`/projects/${project.slug}`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const labPages: MetadataRoute.Sitemap = experiments.map((experiment) => ({
    url: url(`/lab/${experiment.slug}`),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...staticPages, ...projectPages, ...labPages];
}
