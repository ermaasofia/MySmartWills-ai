export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const isProd = process.env.NODE_ENV === 'production';
  const errors: string[] = [];
  const warnings: string[] = [];

  const requireOrCollect = (key: string, list: string[], extra?: string) => {
    if (!process.env[key]) list.push(extra ? `${key} (${extra})` : key);
  };

  // Always-required: app cannot function without these
  requireOrCollect('NEXT_PUBLIC_SUPABASE_URL', errors);
  requireOrCollect('NEXT_PUBLIC_SUPABASE_ANON_KEY', errors);
  requireOrCollect('OPENROUTER_API_KEY', errors, 'chat API depends on this');

  // SECURITY: CAPTCHA must be configured in ALL environments
  // Prevents email spam attacks (forgot-password, signup, login endpoints)
  requireOrCollect(
    'CLOUDFLARE_TURNSTILE_SECRET_KEY',
    errors,  // Required in both production AND development
    'signup, login, and password reset require CAPTCHA verification',
  );

  // Distributed rate limit — opt-in to in-memory fallback if Redis is intentionally absent
  const hasUpstash =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
  const allowInMemory = process.env.RATE_LIMIT_ALLOW_INMEMORY === '1';
  if (!hasUpstash && !allowInMemory) {
    (isProd ? errors : warnings).push(
      'UPSTASH_REDIS_REST_URL/TOKEN missing and RATE_LIMIT_ALLOW_INMEMORY!=1 — distributed rate limiting disabled',
    );
  }

  for (const w of warnings) {
    console.warn(`[AI SmartWills] ${w}`);
  }

  if (errors.length > 0) {
    const msg = `[AI SmartWills] Refusing to start — missing required configuration:\n  - ${errors.join('\n  - ')}`;
    if (isProd) throw new Error(msg);
    console.warn(msg);
  }
}

