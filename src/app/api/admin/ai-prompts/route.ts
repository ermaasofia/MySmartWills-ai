import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { PROMPT_TYPES } from '@/lib/constants';
import { SupabaseClient } from '@supabase/supabase-js';

/** Log admin action for audit trail */
async function logAdminAction(
  supabase: SupabaseClient,
  userId: string,
  action: string,
  details: Record<string, unknown>,
) {
  try {
    await supabase.from('admin_audit_logs').insert({
      admin_id: userId,
      action,
      details,
    });
  } catch {
    // Non-critical — don't block the request if logging fails
    console.error('Failed to write audit log');
  }
}

const FORBIDDEN = NextResponse.json({ error: 'Forbidden' }, { status: 403 });

async function requireAdmin() {
  const supabase = await createClient();
  const { isAdmin: ok, user } = await isAdmin(supabase);
  if (!ok || !user) return { supabase: null as never, user: null, forbidden: true as const };
  return { supabase, user, forbidden: false as const };
}

// GET: Fetch all AI prompts
export async function GET() {
  try {
    const { supabase, forbidden } = await requireAdmin();
    if (forbidden) return FORBIDDEN;

    const { data: prompts, error } = await supabase
      .from('ai_prompts')
      .select('*')
      .order('prompt_type');

    if (error) {
      console.error('Error fetching AI prompts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch prompts' },
        { status: 500 }
      );
    }

    // Return as object keyed by prompt_type for easier access
    const promptsMap = prompts?.reduce((acc, prompt) => {
      acc[prompt.prompt_type] = prompt;
      return acc;
    }, {} as Record<string, { id: string; prompt_type: string; content: string; is_active: boolean; created_at: string; updated_at: string }>) || {};

    return NextResponse.json({ prompts: promptsMap });
  } catch (error) {
    console.error('Error in GET /api/admin/ai-prompts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update a specific AI prompt
export async function PUT(req: NextRequest) {
  try {
    const { supabase, user, forbidden } = await requireAdmin();
    if (forbidden) return FORBIDDEN;

    const body = await req.json();
    const { prompt_type, content } = body;

    if (!prompt_type || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. prompt_type and content are required.' },
        { status: 400 }
      );
    }

    // Prevent excessively large prompts that would bloat every LLM request
    if (content.length > 10_000) {
      return NextResponse.json(
        { error: 'Prompt content too long. Maximum 10,000 characters.' },
        { status: 400 }
      );
    }

    if (!PROMPT_TYPES.includes(prompt_type)) {
      return NextResponse.json(
        { error: `Invalid prompt_type. Must be one of: ${PROMPT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('ai_prompts')
      .upsert(
        { prompt_type, content, is_active: true, updated_at: new Date().toISOString() },
        { onConflict: 'prompt_type' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving AI prompt:', error);
      return NextResponse.json(
        { error: 'Failed to save prompt' },
        { status: 500 }
      );
    }

    // Audit log
    await logAdminAction(supabase, user.id, 'update_ai_prompt', {
      prompt_type,
      content_length: content.length,
    });

    return NextResponse.json({ success: true, prompt: data });
  } catch (error) {
    console.error('Error in PUT /api/admin/ai-prompts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Batch update multiple prompts
export async function POST(req: NextRequest) {
  try {
    const { supabase, user, forbidden } = await requireAdmin();
    if (forbidden) return FORBIDDEN;

    const body = await req.json();
    const { prompts } = body;

    if (!Array.isArray(prompts)) {
      return NextResponse.json(
        { error: 'Invalid input. prompts must be an array.' },
        { status: 400 }
      );
    }

    const valid = prompts.filter(
      (p: { prompt_type: string; content: unknown }) =>
        PROMPT_TYPES.includes(p.prompt_type as typeof PROMPT_TYPES[number]) &&
        typeof p.content === 'string' &&
        (p.content as string).length <= 10_000
    );

    const results = await Promise.all(
      valid.map((p: { prompt_type: string; content: string }) =>
        supabase
          .from('ai_prompts')
          .upsert(
            { prompt_type: p.prompt_type, content: p.content, is_active: true, updated_at: new Date().toISOString() },
            { onConflict: 'prompt_type' }
          )
          .select()
          .single()
      )
    );

    const saved = results.filter((r) => !r.error).map((r) => r.data);

    // Audit log
    await logAdminAction(supabase, user.id, 'batch_update_ai_prompts', {
      prompt_types: valid.map((p: { prompt_type: string }) => p.prompt_type),
      count: saved.length,
    });

    return NextResponse.json({
      success: true,
      count: saved.length,
      prompts: saved,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/ai-prompts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
