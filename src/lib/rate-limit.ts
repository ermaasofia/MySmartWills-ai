// Distributed rate limiter using Upstash Redis
// Falls back to in-memory if Redis is not configured
// https://upstash.com/docs/redis/sdks/ratelimit-ts/overview

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ---------- Upstash Redis rate limiter ----------
let redisRateLimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  redisRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '60 s'),
    analytics: true,
    prefix: 'aismartwills:ratelimit',
  });
}

// ---------- In-memory fallback ----------
interface RateLimitEntry {
  count: number;
  resetAt: number;
  firstRequestAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export async function rateLimitAsync(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 20, windowMs: 60_000 }
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  // Sanitize identifier
  const safeId = identifier.slice(0, 128);

  // Use Redis if available (distributed, survives serverless cold starts)
  if (redisRateLimit) {
    try {
      const result = await redisRateLimit.limit(safeId);
      return {
        success: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    } catch (error) {
      console.warn('Redis rate limit failed, falling back to in-memory:', error);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  return rateLimit(safeId, options);
}

// Synchronous in-memory rate limiter (fallback)
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 20, windowMs: 60_000 }
): { success: boolean; remaining: number; resetAt: number } {
  const safeId = identifier.slice(0, 128);
  const now = Date.now();
  const entry = rateLimitMap.get(safeId);

  // Prevent the map from growing unbounded (DoS protection)
  if (rateLimitMap.size > 10_000) {
    const sortedEntries = [...rateLimitMap.entries()]
      .sort((a, b) => a[1].firstRequestAt - b[1].firstRequestAt);
    for (let i = 0; i < 5000; i++) {
      rateLimitMap.delete(sortedEntries[i][0]);
    }
  }

  if (!entry || now > entry.resetAt) {
    const resetAt = now + options.windowMs;
    rateLimitMap.set(safeId, { count: 1, resetAt, firstRequestAt: now });
    return { success: true, remaining: options.maxRequests - 1, resetAt };
  }

  if (entry.count >= options.maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}
