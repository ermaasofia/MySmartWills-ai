/**
 * Chat Library
 *
 * Chat session and message management using Supabase.
 */

import { createClient } from '@/lib/supabase/server';

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function createChatSession(
  userId: string,
  countryCode: string,
  title = 'New Chat',
) {
  const supabase = await createClient();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('chat_sessions')
    .insert({
      id,
      user_id: userId,
      country_code: countryCode,
      title,
      created_at: now,
      updated_at: now,
    });

  if (error) throw error;

  return {
    id,
    title,
    country_code: countryCode,
    created_at: now,
    updated_at: now,
  };
}

export async function getUserSessions(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('chat_sessions')
    .select('id, title, country_code, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  return (data || []).map(row => ({
    ...row,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export async function updateSessionTitle(
  sessionId: string,
  title: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('chat_sessions')
    .update({ title: title.slice(0, 100), updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function deleteSession(sessionId: string) {
  const supabase = await createClient();
  // Messages will be deleted via CASCADE foreign key
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
}

// ─── Message helpers ──────────────────────────────────────────────────────────

export async function saveChatMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
) {
  const supabase = await createClient();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('chat_messages')
    .insert({ id, session_id: sessionId, role, content, created_at: now });

  if (error) throw error;

  return { id, role, content, created_at: now };
}

export async function getSessionMessages(
  sessionId: string,
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  return (data || []).map(row => ({
    id: row.id,
    role: row.role as 'user' | 'assistant',
    content: row.content,
    created_at: row.created_at,
  }));
}

export async function getSessionById(sessionId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('chat_sessions')
    .select('id, title, country_code, user_id, created_at')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    country_code: data.country_code,
    user_id: data.user_id,
    created_at: data.created_at,
  };
}

export async function getRecentUserMessages(sessionId: string, limit = 10) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('chat_messages')
    .select('content')
    .eq('session_id', sessionId)
    .eq('role', 'user')
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data || []).reverse();
}

