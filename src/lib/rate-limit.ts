// In-memory rate limiter for API routes
// For production at scale, use Redis (Upstash) instead
// NOTE: On serverless (Vercel), each function instance has its own memory.
// This provides basic protection but consider Upstash Redis for distributed rate limiting.

interface RateLimitEntry {
  count: number;
  resetAt: number;
  firstRequestAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof globalThis !== 'undefined') {
  const cleanup = () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  };
  // Only set interval in Node.js environment (not edge)
  if (typeof setInterval !== 'undefined') {
    setInterval(cleanup, 5 * 60 * 1000);
  }
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 20, windowMs: 60_000 }
): { success: boolean; remaining: number; resetAt: number } {
  // Sanitize identifier to prevent abuse
  const safeId = identifier.slice(0, 128);
  const now = Date.now();
  const entry = rateLimitMap.get(safeId);

  // Prevent the map from growing unbounded (DoS protection)
  if (rateLimitMap.size > 10_000) {
    // Evict oldest entries
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
