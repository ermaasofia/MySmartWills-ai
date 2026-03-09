import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { PROMPT_TYPES } from '@/lib/constants';

const FORBIDDEN = NextResponse.json({ error: 'Forbidden' }, { status: 403 });

async function requireAdmin() {
  const supabase = await createClient();
  const { isAdmin: ok } = await isAdmin(supabase);
  if (!ok) return { supabase: null as never, forbidden: true as const };
  return { supabase, forbidden: false as const };
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
    const { supabase, forbidden } = await requireAdmin();
    if (forbidden) return FORBIDDEN;

    const body = await req.json();
    const { prompt_type, content } = body;

    if (!prompt_type || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. prompt_type and content are required.' },
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
    const { supabase, forbidden } = await requireAdmin();
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
        typeof p.content === 'string'
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
