import { getSessionUser } from '@/lib/auth';
import { rateLimitAsync } from '@/lib/rate-limit';
import { createChatSession, getUserSessions } from '@/lib/chat';
import { isAllowedOrigin } from '@/lib/validation';

// GET /api/chat/sessions — list all sessions for the authenticated user
export async function GET(req: Request) {
  try {
    if (!isAllowedOrigin(req.headers.get('origin'))) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success: rateLimitOk } = await rateLimitAsync(`session-list:${user.id}`, {
      maxRequests: 30,
      windowMs: 60 * 1000,
    });

    if (!rateLimitOk) {
      return Response.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const sessions = await getUserSessions(user.id);
    return Response.json({ sessions });
  } catch (error) {
    console.error('GET /api/chat/sessions error:', error);
    return Response.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST /api/chat/sessions — explicitly create a new session
export async function POST(req: Request) {
  try {
    if (!isAllowedOrigin(req.headers.get('origin'))) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success: rateLimitOk } = await rateLimitAsync(`session-create:${user.id}`, {
      maxRequests: 10,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimitOk) {
      return Response.json(
        { error: 'Too many sessions created. Please wait before creating more.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const countryCode =
      typeof body.countryCode === 'string' ? body.countryCode.slice(0, 5) : 'MY';
    const title =
      typeof body.title === 'string' ? body.title.slice(0, 100) : 'New Chat';

    const session = await createChatSession(user.id, countryCode, title);
    return Response.json({ session }, { status: 201 });
  } catch (error) {
    console.error('POST /api/chat/sessions error:', error);
    return Response.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
