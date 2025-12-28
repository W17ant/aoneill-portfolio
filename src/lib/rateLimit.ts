/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   RATE LIMITER - Simple in-memory rate limiting      ###
   ###   Limits requests per IP address                     ###
   ###   Last Updated: 28-12-2025                           ###
   ########################################################### */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (resets on cold starts, but provides basic protection)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check if a request should be rate limited
 * @param identifier - Usually the IP address
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 3,
  windowMs: number = 60 * 60 * 1000 // 1 hour default
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetIn: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= maxRequests) {
    // Rate limited
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  // Increment counter
  entry.count++;
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Get client IP from request headers (works with Vercel/Cloudflare)
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Vercel specific
  const vercelIP = request.headers.get('x-vercel-forwarded-for');
  if (vercelIP) {
    return vercelIP.split(',')[0].trim();
  }

  return 'unknown';
}
