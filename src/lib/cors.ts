/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   CORS - Cross-Origin Resource Sharing protection    ###
   ###   Restricts API access to allowed origins only       ###
   ###   Last Updated: 03-01-2025                           ###
   ########################################################### */

import { NextResponse } from 'next/server';

/* ###########################################################
   ###   1. Configuration                                   ###
   ########################################################### */

// Allowed origins - add your domains here
const ALLOWED_ORIGINS = [
  'https://aoneill.co.uk',
  'https://www.aoneill.co.uk',
  'http://localhost:3000',        // Local development
  'http://localhost:3001',
  'http://localhost:3002',
];

/* ###########################################################
   ###   2. CORS Validation                                ###
   ########################################################### */

/**
 * Check if the request origin is allowed
 */
export function isOriginAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');

  // No origin header = same-origin request (browser navigation, not AJAX)
  if (!origin) return true;

  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Get the origin for CORS headers (returns the origin if allowed, null otherwise)
 */
export function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get('origin');

  if (!origin) return null;

  return ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

/* ###########################################################
   ###   3. CORS Response Helpers                          ###
   ########################################################### */

/**
 * Add CORS headers to a response
 */
export function addCorsHeaders(response: NextResponse, request: Request): NextResponse {
  const origin = getAllowedOrigin(request);

  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  }

  return response;
}

/**
 * Return a CORS error response for blocked origins
 */
export function corsBlockedResponse(): NextResponse {
  return NextResponse.json(
    { error: 'CORS: Origin not allowed' },
    { status: 403 }
  );
}

/**
 * Handle OPTIONS preflight requests
 */
export function handlePreflight(request: Request): NextResponse {
  const origin = getAllowedOrigin(request);

  if (!origin) {
    return corsBlockedResponse();
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
