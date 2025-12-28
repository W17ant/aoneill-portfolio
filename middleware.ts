/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   MIDDLEWARE - CSP nonce generation for security     ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a random nonce for this request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Build CSP header with nonce for scripts, allow inline styles for Next.js/React
  // 'unsafe-inline' and https: are ignored by modern browsers but provide backward compatibility
  // Trusted Types with default policy for React/Next.js compatibility
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https: http:;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    connect-src 'self' https://www.googleapis.com https://pagespeedonline.googleapis.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    object-src 'none';
    upgrade-insecure-requests;
    require-trusted-types-for 'script';
    trusted-types default nextjs nextjs#bundler;
  `.replace(/\s{2,}/g, ' ').trim();

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Create response with CSP header
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
