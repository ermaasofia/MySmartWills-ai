import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { rateLimitAsync } from '@/lib/rate-limit';
import { getUserMemory } from '@/lib/memory';
import { isAllowedOrigin } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  if (!isAllowedOrigin(req.headers.get('origin'))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { success: rateLimitOk } = await rateLimitAsync(`plan-fetch:${user.id}`, {
    maxRequests: 30,
    windowMs: 60 * 1000,
  });

  if (!rateLimitOk) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  const facts = await getUserMemory(user.id);

  const dependentsCount =
    (facts?.children?.length ?? 0) + (facts?.dependents?.length ?? 0);

  return NextResponse.json({
    plan: {
      marital_status: facts?.marital_status ?? null,
      spouse_name: facts?.spouse_name ?? null,
      dependents_count: dependentsCount,
      preferred_executor: facts?.preferred_executor ?? null,
      preferred_guardian: facts?.preferred_guardian ?? null,
      religion: facts?.religion ?? null,
      has_existing_will: facts?.has_existing_will ?? null,
    },
  });
}
