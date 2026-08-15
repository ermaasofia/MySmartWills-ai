import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getPlanData } from '@/lib/plan_data_v2';
import { isAllowedOrigin } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req.headers.get('origin'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const countryCode = searchParams.get('countryCode') ?? 'MY';

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const planData = await getPlanData(sessionId, user.id);

    return NextResponse.json({
      religion: planData?.religion ?? null,
      marital_status: planData?.marital_status ?? null,
      dependents_count: planData?.dependents_count ?? null,
      dependents_label: planData?.dependents_label ?? null,
      preferred_executor: planData?.executor_name ?? null,
      preferred_guardian: planData?.guardian_name ?? null,
      country_code: planData?.country_code ?? countryCode,
    });
  } catch (error) {
    console.error('Failed to load session facts:', error);
    return NextResponse.json({ error: 'Failed to load session facts' }, { status: 500 });
  }
}
