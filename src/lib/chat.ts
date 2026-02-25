import { SupabaseClient } from '@supabase/supabase-js';

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function createChatSession(
  supabase: SupabaseClient,
  userId: string,
  countryCode: string,
  title = 'New Chat',
) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, country_code: countryCode, title })
    .select('id, title, country_code, created_at, updated_at')
    .single();

  if (error) throw new Error(`Failed to create session: ${error.message}`);
  return data;
}

export async function getUserSessions(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, title, country_code, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch sessions: ${error.message}`);
  return data ?? [];
}

export async function updateSessionTitle(
  supabase: SupabaseClient,
  sessionId: string,
  title: string,
) {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ title: title.slice(0, 100) })
    .eq('id', sessionId);

  if (error) throw new Error(`Failed to update session title: ${error.message}`);
}

export async function deleteSession(supabase: SupabaseClient, sessionId: string) {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw new Error(`Failed to delete session: ${error.message}`);
}

// ─── Message helpers ──────────────────────────────────────────────────────────

export async function saveChatMessage(
  supabase: SupabaseClient,
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, role, content })
    .select('id, role, content, created_at')
    .single();

  if (error) throw new Error(`Failed to save message: ${error.message}`);
  return data;
}

export async function getSessionMessages(
  supabase: SupabaseClient,
  sessionId: string,
) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
  return data ?? [];
}
