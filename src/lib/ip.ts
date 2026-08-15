/**
 * Extract the client IP address from request headers.
 * Priority: Vercel (trusted) > Cloudflare > unknown
 *
 * SECURITY: x-forwarded-for is client-controllable and MUST NOT be trusted.
 * Vercel sets x-vercel-forwarded-for from the actual socket — it cannot be spoofed.
 * Cloudflare sets cf-connecting-ip from the actual connection.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() ??
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    'unknown'
  );
}
