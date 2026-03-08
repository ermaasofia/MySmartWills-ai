import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';

// GET: Fetch all AI prompts
export async function GET() {
  try {
    const supabase = await createClient();

    // Check admin authorization
    const { isAdmin: adminStatus } = await isAdmin(supabase);

    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch all prompts
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
    const supabase = await createClient();

    // Check admin authorization
    const { isAdmin: adminStatus } = await isAdmin(supabase);

    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { prompt_type, content } = body;

    // Validate input
    if (!prompt_type || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. prompt_type and content are required.' },
        { status: 400 }
      );
    }

    // Validate prompt_type
    const validTypes = ['character', 'sop', 'company_info', 'services', 'other'];
    if (!validTypes.includes(prompt_type)) {
      return NextResponse.json(
        { error: `Invalid prompt_type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if prompt exists
    const { data: existing } = await supabase
      .from('ai_prompts')
      .select('id')
      .eq('prompt_type', prompt_type)
      .single();

    let result;
    if (existing) {
      // Update existing prompt
      result = await supabase
        .from('ai_prompts')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('prompt_type', prompt_type)
        .select()
        .single();
    } else {
      // Insert new prompt
      result = await supabase
        .from('ai_prompts')
        .insert({ prompt_type, content, is_active: true })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving AI prompt:', result.error);
      return NextResponse.json(
        { error: 'Failed to save prompt' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      prompt: result.data 
    });
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
    const supabase = await createClient();

    // Check admin authorization
    const { isAdmin: adminStatus } = await isAdmin(supabase);

    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { prompts } = body;

    if (!Array.isArray(prompts)) {
      return NextResponse.json(
        { error: 'Invalid input. prompts must be an array.' },
        { status: 400 }
      );
    }

    const validTypes = ['character', 'sop', 'company_info', 'services', 'other'];
    
    // Process each prompt
    const results = [];
    for (const prompt of prompts) {
      const { prompt_type, content } = prompt;
      
      if (!validTypes.includes(prompt_type) || typeof content !== 'string') {
        continue; // Skip invalid entries
      }

      // Check if exists
      const { data: existing } = await supabase
        .from('ai_prompts')
        .select('id')
        .eq('prompt_type', prompt_type)
        .single();

      let result;
      if (existing) {
        result = await supabase
          .from('ai_prompts')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('prompt_type', prompt_type)
          .select()
          .single();
      } else {
        result = await supabase
          .from('ai_prompts')
          .insert({ prompt_type, content, is_active: true })
          .select()
          .single();
      }

      if (!result.error) {
        results.push(result.data);
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: results.length,
      prompts: results 
    });
  } catch (error) {
    console.error('Error in POST /api/admin/ai-prompts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
