import { createClient } from '@/lib/supabase/server';
import { createChatSession, getUserSessions } from '@/lib/chat';

// GET /api/chat/sessions — list all sessions for the authenticated user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await getUserSessions(supabase);
    return Response.json({ sessions });
  } catch (error) {
    console.error('GET /api/chat/sessions error:', error);
    return Response.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST /api/chat/sessions — explicitly create a new session
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const countryCode =
      typeof body.countryCode === 'string' ? body.countryCode.slice(0, 5) : 'MY';
    const title =
      typeof body.title === 'string' ? body.title.slice(0, 100) : 'New Chat';

    const session = await createChatSession(supabase, user.id, countryCode, title);
    return Response.json({ session }, { status: 201 });
  } catch (error) {
    console.error('POST /api/chat/sessions error:', error);
    return Response.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
