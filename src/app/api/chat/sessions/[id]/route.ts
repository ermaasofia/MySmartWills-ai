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

    // Verify the session belongs to the authenticated user (defense-in-depth: explicit check + RLS)
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id, title, country_code, created_at, user_id')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.user_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = await getSessionMessages(supabase, sessionId);
    // Strip user_id from response — client doesn't need it
    const { user_id: _, ...safeSession } = session;
    return Response.json({ session: safeSession, messages });
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

    // Defense-in-depth: explicit ownership check + RLS
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id, user_id')
      .eq('id', sessionId)
      .single();

    if (!session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.user_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

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

    // Confirm ownership before deletion (defense-in-depth: explicit check + RLS)
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id, user_id')
      .eq('id', sessionId)
      .single();

    if (!session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.user_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteSession(supabase, sessionId);
    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/chat/sessions/[id] error:', error);
    return Response.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
