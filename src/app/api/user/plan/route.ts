import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserMemory } from '@/lib/memory';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const facts = await getUserMemory(supabase, user.id);

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
