import { getSessionUser } from '@/lib/auth';
import { rateLimitAsync } from '@/lib/rate-limit';
import { getSessionMessages, deleteSession, updateSessionTitle, getSessionById } from '@/lib/chat';
import { isAllowedOrigin } from '@/lib/validation';

// GET /api/chat/sessions/[id] — fetch all messages for a session
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAllowedOrigin(req.headers.get('origin'))) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success: rateLimitOk } = await rateLimitAsync(`session-fetch:${user.id}`, {
      maxRequests: 30,
      windowMs: 60 * 1000,
    });

    if (!rateLimitOk) {
      return Response.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const { id: sessionId } = await params;

    const session = await getSessionById(sessionId, user.id);
    if (!session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const messages = await getSessionMessages(sessionId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id: _ignore, ...safeSession } = session as any;
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
    if (!isAllowedOrigin(req.headers.get('origin'))) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success: rateLimitOk } = await rateLimitAsync(`session-update:${user.id}`, {
      maxRequests: 15,
      windowMs: 60 * 1000,
    });

    if (!rateLimitOk) {
      return Response.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const { id: sessionId } = await params;
    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 100) : null;

    if (!title) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }

    const session = await getSessionById(sessionId, user.id);
    if (!session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    await updateSessionTitle(sessionId, title);
    return Response.json({ success: true, title });
  } catch (error) {
    console.error('PATCH /api/chat/sessions/[id] error:', error);
    return Response.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

// DELETE /api/chat/sessions/[id] — delete a session and all its messages
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAllowedOrigin(req.headers.get('origin'))) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success: rateLimitOk } = await rateLimitAsync(
      `session-delete:${user.id}`,
      {
        maxRequests: 10,
        windowMs: 60 * 60 * 1000,
      },
    );

    if (!rateLimitOk) {
      return Response.json(
        {
          error:
            'Too many deletions. Please wait before deleting more sessions.',
        },
        { status: 429 },
      );
    }

    const { id: sessionId } = await params;

    const session = await getSessionById(sessionId, user.id);
    if (!session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    await deleteSession(sessionId);
    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/chat/sessions/[id] error:', error);
    return Response.json(
      { error: 'Failed to delete session' },
      { status: 500 },
    );
  }
}
