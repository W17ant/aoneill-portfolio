/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   NEXT.JS CONFIG - Build and runtime settings        ###
   ###   Security headers handled by middleware.ts          ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

import type { NextConfig } from "next";

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
      { source: '/renovaelabs-dark',  destination: '/renovaelabs-dark/index.html' },
      { source: '/renovaelabs-dark/', destination: '/renovaelabs-dark/index.html' },
    ];
  },
};

export default nextConfig;
