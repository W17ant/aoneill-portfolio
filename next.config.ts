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
  async rewrites() {
    return [
      { source: '/tomthevacuumman',  destination: '/tomthevacuumman/index.html' },
      { source: '/tomthevacuumman/', destination: '/tomthevacuumman/index.html' },
      { source: '/RenovaeLabs',      destination: '/RenovaeLabs/index.html' },
      { source: '/RenovaeLabs/',     destination: '/RenovaeLabs/index.html' },
    ];
  },

  // Redirect common lowercase variants to the canonical CamelCase path.
  // Why: case-insensitive matchers in some upstream proxies (and in some
  // QR/typed entries) sent /renovaelabs/ through, which served the HTML
  // but resolved relative asset URLs against the lowercase prefix —
  // styles.css and app.js then 404'd. A permanent redirect normalises
  // the URL in the address bar so all asset paths resolve.
  async redirects() {
    return [
      { source: '/renovaelabs',  destination: '/RenovaeLabs/', permanent: true },
      { source: '/renovaelabs/', destination: '/RenovaeLabs/', permanent: true },
      { source: '/renovaelabs/:path*', destination: '/RenovaeLabs/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
