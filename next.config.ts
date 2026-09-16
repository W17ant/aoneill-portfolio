/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   NEXT.JS CONFIG - Build and runtime settings        ###
   ###   Security headers handled by middleware.ts          ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

import type { NextConfig } from "next";
import { readdirSync, existsSync } from "node:fs";
import { join, posix } from "node:path";

/**
 * Builds a rewrite for every page inside a static demo subtree in /public.
 *
 * Why this is generated rather than listed: a Next static export with
 * trailingSlash writes each page as `<route>/index.html`, and neither `next dev`
 * nor the Next static handler resolves a directory to its index. Without an
 * explicit rewrite, /MLH/ works (it is listed by hand) but /MLH/campervans/
 * 404s - which is exactly what the /arc subtree does today, despite the comment
 * below claiming otherwise.
 *
 * Walking the folder keeps the rewrites correct when the demo is re-exported
 * with different pages, and it emits nothing at all if the folder is absent, so
 * a clone without the demo still builds.
 *
 * @param root - folder name under /public, e.g. "MLH"
 * @returns one rewrite per directory holding an index.html, both with and
 *          without a trailing slash
 */
function staticSubtreeRewrites(root: string) {
  const base = join(process.cwd(), "public", root);
  if (!existsSync(base)) return [];

  const routes: string[] = [];

  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      // _next holds hashed assets, which are served as files, not pages.
      if (!entry.isDirectory() || entry.name === "_next") continue;
      const next = join(dir, entry.name);
      const route = posix.join(prefix, entry.name);
      if (existsSync(join(next, "index.html"))) routes.push(route);
      walk(next, route);
    }
  };

  walk(base, "");

  // Both cases of the folder name point at the same files. The folder is
  // uppercase because the client's brand is MLH, but people type it lowercase -
  // and Vercel serves static files case-sensitively, so /mlh/campervans/ would
  // 404 while /MLH/campervans/ worked. Listing both sources is explicit and
  // cannot loop: every destination ends in index.html, which no source matches.
  const sources = (path: string) =>
    Array.from(new Set([path, path.toLowerCase()]));

  return routes.flatMap((route) =>
    sources(`/${root}/${route}`).flatMap((source) => [
      { source, destination: `/${root}/${route}/index.html` },
      { source: `${source}/`, destination: `/${root}/${route}/index.html` },
    ]),
  );
}

const nextConfig: NextConfig = {
  // Security headers are now handled by middleware.ts
  // to support CSP nonces for improved security

  // Ensure trailing slashes for static HTML files in public folder
  trailingSlash: true,

  // Client-demo subtrees (static HTML under /public) don't get directory-
  // index resolution by default, so a bare /<folder>/ hits the Next.js
  // router and 404s. Map the bare path to the static index.html inside.
  // Why: renovaelabs is now lowercase. The previous CamelCase redirect
  // attempt loop'd because Vercel's edge matcher applies path matchers
  // case-insensitively — the catch-all kept rewriting /RenovaeLabs/* to
  // itself. Hosting at lowercase eliminates the issue.
  async rewrites() {
    return [
      { source: '/tomthevacuumman',   destination: '/tomthevacuumman/index.html' },
      { source: '/tomthevacuumman/',  destination: '/tomthevacuumman/index.html' },
      { source: '/renovaelabs',       destination: '/renovaelabs/index.html' },
      { source: '/renovaelabs/',      destination: '/renovaelabs/index.html' },
      // Why: /arc serves the Jarvis Astro docs subtree (built into /public/arc).
      // Astro emits trailingSlash directories with index.html, so child routes
      // like /arc/quickstart/ resolve via Next's static serving — only the bare
      // /arc + /arc/ need explicit rewrites to land on the homepage.
      { source: '/arc',               destination: '/arc/index.html' },
      { source: '/arc/',              destination: '/arc/index.html' },
      // Why: /MLH is the Manchester Leisure Hire demo — a Next static export
      // (basePath /MLH) under /public/MLH. Its own trailingSlash output means
      // child routes like /MLH/campervans/ already resolve to a directory
      // index, so only the bare /MLH + /MLH/ need a rewrite, same as /arc.
      //
      // The uppercase path is safe here despite the RenovaeLabs loop above:
      // that looped because the catch-all destination also matched the source
      // case-insensitively. These two destinations are a different path.
      { source: '/MLH',               destination: '/MLH/index.html' },
      { source: '/MLH/',              destination: '/MLH/index.html' },
      { source: '/mlh',               destination: '/MLH/index.html' },
      { source: '/mlh/',              destination: '/MLH/index.html' },
      ...staticSubtreeRewrites('MLH'),
    ];
  },
};

export default nextConfig;
