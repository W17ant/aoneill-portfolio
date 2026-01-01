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
};

export default nextConfig;
