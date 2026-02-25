import { createClient } from '@/lib/supabase/server';
import { getSessionMessages, deleteSession, updateSessionTitle } from '@/lib/chat';

// GET /api/chat/sessions/[id] — fetch all messages for a session
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // Verify the session belongs to the authenticated user (RLS also enforces this)
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id, title, country_code, created_at')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const messages = await getSessionMessages(supabase, sessionId);
    return Response.json({ session, messages });
  } catch (error) {
    console.error('GET /api/chat/sessions/[id] error:', error);
    return Response.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

// PATCH /api/chat/sessions/[id] — rename a session title
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 100) : null;

    if (!title) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }

    // RLS ensures only the owner can update
    await updateSessionTitle(supabase, sessionId, title);
    return Response.json({ success: true, title });
  } catch (error) {
    console.error('PATCH /api/chat/sessions/[id] error:', error);
    return Response.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

// DELETE /api/chat/sessions/[id] — delete a session and all its messages
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // Confirm ownership before deletion (RLS also enforces this)
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .single();

    if (!session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    await deleteSession(supabase, sessionId);
    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/chat/sessions/[id] error:', error);
    return Response.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
