/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   LIGHTHOUSE API - Fetches PageSpeed Insights        ###
   ###   scores with caching for performance display        ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { isOriginAllowed, corsBlockedResponse, handlePreflight } from '@/lib/cors';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

// Rate limit: 10 requests per minute per IP
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  fetchedAt: string;
}

interface CacheEntry {
  scores: LighthouseScores;
  timestamp: number;
}

/** Response body when no real scores exist yet. */
interface UnavailableResponse {
  available: false;
}

// Why: there is deliberately no hardcoded fallback. A made-up score set with a
// fresh timestamp would present invented numbers as a live measurement.

/* ###########################################################
   ###   2. Cache Configuration                             ###
   ########################################################### */

// Cache scores for 24 hours (in milliseconds) to avoid API quota limits
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// In-memory cache (persists across requests in same instance)
let cache: CacheEntry | null = null;

// Why: www is the canonical host (the apex redirects to it), so testing www
// measures the page visitors actually get rather than a redirect hop.
const SITE_URL = 'https://www.aoneill.co.uk';

/* ###########################################################
   ###   3. PageSpeed Insights Fetcher                      ###
   ########################################################### */

async function fetchLighthouseScores(): Promise<LighthouseScores> {
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
  const categoryParams = categories.map((c) => `category=${c}`).join('&');

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL)}&${categoryParams}&strategy=mobile`;

  const response = await fetch(apiUrl, {
    next: { revalidate: 86400 }, // Cache at CDN level for 24 hours
  });

  if (!response.ok) {
    throw new Error(`PageSpeed API error: ${response.status}`);
  }

  const data = await response.json();
  const categories_result = data.lighthouseResult?.categories;

  if (!categories_result) {
    throw new Error('Invalid API response structure');
  }

  return {
    performance: Math.round((categories_result.performance?.score || 0) * 100),
    accessibility: Math.round((categories_result.accessibility?.score || 0) * 100),
    bestPractices: Math.round((categories_result['best-practices']?.score || 0) * 100),
    seo: Math.round((categories_result.seo?.score || 0) * 100),
    fetchedAt: new Date().toISOString(),
  };
}

/* ###########################################################
   ###   4. API Route Handler                               ###
   ########################################################### */

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

export async function GET(request: Request) {
  // CORS check
  if (!isOriginAllowed(request)) {
    return corsBlockedResponse();
  }

  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`lighthouse:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.resetIn) } }
    );
  }

  try {
    const now = Date.now();

    // Return cached scores if still valid
    if (cache && now - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cache.scores,
        available: true,
        cached: true,
      });
    }

    // Fetch fresh scores
    const scores = await fetchLighthouseScores();

    // Update cache
    cache = {
      scores,
      timestamp: now,
    };

    return NextResponse.json({
      ...scores,
      available: true,
      cached: false,
    });
  } catch (error) {
    console.error('Lighthouse API error:', error);

    // Return the last real result, even if stale. Its fetchedAt is the time it
    // was actually measured, so the UI date stays truthful.
    if (cache) {
      return NextResponse.json({
        ...cache.scores,
        available: true,
        cached: true,
        stale: true,
      });
    }

    // No real result to show: say so explicitly rather than inventing one.
    const body: UnavailableResponse = { available: false };
    return NextResponse.json(body, { status: 503 });
  }
}

/* ###########################################################
   ###           END OF LIGHTHOUSE API                      ###
   ########################################################### */
