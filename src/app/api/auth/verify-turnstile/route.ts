import { verifyTurnstileToken } from '@/lib/turnstile';
import { getClientIp } from '@/lib/ip';
import { rateLimitAsync } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // SECURITY: Origin check
    const origin = req.headers.get('origin');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartwills.ai';
    const allowedOrigins = [
      appUrl,
      appUrl.replace('://', '://www.'),
      ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
    ];
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Rate limit Turnstile verification: 10 attempts per minute per IP
    const ip = getClientIp(req.headers);
    const { success: rateLimitOk } = await rateLimitAsync(`turnstile-verify:${ip}`, {
      maxRequests: 10,
      windowMs: 60 * 1000,
    });

    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Too many verification attempts' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Missing verification token' },
        { status: 400 }
      );
    }

    // Token length sanity check
    if (token.length > 2048) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    const result = await verifyTurnstileToken(token, ip);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Verification failed' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
