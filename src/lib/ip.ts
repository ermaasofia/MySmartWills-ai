/**
 * Extract the client IP address from request headers.
 * Priority: Cloudflare > Nginx/proxy > X-Forwarded-For > unknown
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  );
}
