export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const required = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      console.warn(
        `[AI SmartWills] Missing required environment variables: ${missing.join(', ')}`
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.warn(
        '[AI SmartWills] GROQ_API_KEY is not set — chat API will be unavailable'
      );
    }
  }
}
