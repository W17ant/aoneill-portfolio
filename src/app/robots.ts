/** Robots - crawl rules and sitemap location for /robots.txt */

import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.aoneill.co.uk';

/**
 * Generates /robots.txt.
 *
 * Why these disallows: /api/ holds JSON endpoints with nothing to index, and
 * /MLH/ is a client demo plus its questionnaire. Both cases are listed because
 * next.config.ts rewrites lowercase /mlh/ to the same files.
 *
 * @returns robots rules allowing everything else and pointing at the sitemap
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/MLH/', '/mlh/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
