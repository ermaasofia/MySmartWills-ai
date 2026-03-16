import { verifyTurnstileToken } from '@/lib/turnstile';
import { getClientIp } from '@/lib/ip';
import { NextResponse } from 'next/server';

// Rate limit for Turnstile verification to prevent abuse
const verifyAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  try {
    // SECURITY: Origin check
    const origin = req.headers.get('origin');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aismartwills.me';
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

    // Basic IP-based rate limiting for this endpoint
    const ip = getClientIp(req.headers);
    const now = Date.now();
    const attempt = verifyAttempts.get(ip);

    if (attempt && now < attempt.resetAt && attempt.count >= 10) {
      return NextResponse.json(
        { error: 'Too many verification attempts' },
        { status: 429 }
      );
    }

    if (!attempt || now >= attempt.resetAt) {
      verifyAttempts.set(ip, { count: 1, resetAt: now + 60_000 });
    } else {
      attempt.count++;
    }

    // Cap map size
    if (verifyAttempts.size > 5000) {
      verifyAttempts.clear();
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
