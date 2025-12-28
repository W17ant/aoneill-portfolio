/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   LIGHTHOUSE API - Fetches PageSpeed Insights        ###
   ###   scores with caching for performance display        ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

import { NextResponse } from 'next/server';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

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

// Fallback scores to show when API is rate-limited or unavailable
const FALLBACK_SCORES: LighthouseScores = {
  performance: 100,
  accessibility: 96,
  bestPractices: 100,
  seo: 100,
  fetchedAt: new Date().toISOString(),
};

/* ###########################################################
   ###   2. Cache Configuration                             ###
   ########################################################### */

// Cache scores for 1 hour (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;

// In-memory cache (persists across requests in same instance)
let cache: CacheEntry | null = null;

// The URL to test - your live site
const SITE_URL = 'https://aoneill.co.uk';

/* ###########################################################
   ###   3. PageSpeed Insights Fetcher                      ###
   ########################################################### */

async function fetchLighthouseScores(): Promise<LighthouseScores> {
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
  const categoryParams = categories.map((c) => `category=${c}`).join('&');

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL)}&${categoryParams}&strategy=mobile`;

  const response = await fetch(apiUrl, {
    next: { revalidate: 3600 }, // Cache at CDN level too
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

export async function GET() {
  try {
    const now = Date.now();

    // Return cached scores if still valid
    if (cache && now - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cache.scores,
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
      cached: false,
    });
  } catch (error) {
    console.error('Lighthouse API error:', error);

    // Return cached data if available, even if stale
    if (cache) {
      return NextResponse.json({
        ...cache.scores,
        cached: true,
        stale: true,
      });
    }

    // Return fallback scores when API unavailable (rate-limited, etc.)
    return NextResponse.json({
      ...FALLBACK_SCORES,
      fallback: true,
    });
  }
}

/* ###########################################################
   ###           END OF LIGHTHOUSE API                      ###
   ########################################################### */
