/**
 * Auth Library
 *
 * All authentication and user management using Supabase Auth + profiles table.
 */

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  full_name: string | null;
}

// ─── Session Cookie Management ───────────────────────────────────────────────

const SESSION_COOKIE = 'sw_session';

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// ─── User Queries (Supabase profiles table) ──────────────────────────────────

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    role: data.role as 'user' | 'admin',
    full_name: data.full_name,
  };
}

export async function findUserById(id: string): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', id)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    role: data.role as 'user' | 'admin',
    full_name: data.full_name,
  };
}

// ─── Session User (from Supabase Auth) ───────────────────────────────────────

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) return null;

    // Get role from profiles table
    const profile = await findUserById(user.id);
    if (!profile) {
      // Profile may not exist yet if trigger hasn't run; fall back to auth user metadata
      return {
        id: user.id,
        email: user.email,
        role: (user.user_metadata?.role as 'user' | 'admin') || 'user',
        full_name: user.user_metadata?.full_name as string | null || null,
      };
    }

    return profile;
  } catch {
    return null;
  }
}

// ─── Admin Check ─────────────────────────────────────────────────────────────

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return user;
}

// ─── Guest / OAuth user handling ─────────────────────────────────────────────

export async function findOrCreateOAuthUser(
  email: string,
  fullName: string | null
): Promise<AuthUser> {
  const existing = await findUserByEmail(email);
  if (existing) return existing;

  // OAuth user profile is created via the Supabase handle_new_user() trigger,
  // so we should find it after sign-in. If not found, create manually.
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user) {
    // User should already be authenticated by OAuth flow at this point
    throw new Error('User not authenticated');
  }

  // Try to find the profile (trigger should have created it)
  const profile = await findUserById(user.user.id);
  if (profile) return profile;

  // Create profile manually if trigger didn't fire
  await supabase.from('profiles').upsert({
    id: user.user.id,
    email: email.toLowerCase().trim(),
    full_name: fullName,
    role: 'user',
  });

  return {
    id: user.user.id,
    email: email.toLowerCase().trim(),
    role: 'user',
    full_name: fullName,
  };
}

// ─── Count queries for admin dashboard ───────────────────────────────────────

export async function getTotalUsers(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

export async function getTotalSessions(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('chat_sessions')
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

export async function getActivePromptsCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('ai_prompts')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  return count ?? 0;
}

// ─── Password Reset Token ────────────────────────────────────────────────────

export async function createPasswordResetToken(userId: string): Promise<string> {
  const supabase = await createClient();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const { error } = await supabase
    .from('password_reset_tokens')
    .insert({ user_id: userId, token, expires_at: expiresAt.toISOString() });

  if (error) throw error;
  return token;
}

export async function verifyPasswordResetToken(token: string): Promise<AuthUser | null> {
  const supabase = await createClient();

  // Find valid token
  const { data: tokenData } = await supabase
    .from('password_reset_tokens')
    .select('user_id')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .is('used_at', null)
    .single();

  if (!tokenData) return null;

  // Mark token as used
  await supabase
    .from('password_reset_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token);

  // Get user
  return findUserById(tokenData.user_id);
}

// ─── OAuth State Token ───────────────────────────────────────────────────────

export async function createOAuthStateToken(): Promise<string> {
  const supabase = await createClient();
  const state = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const { error } = await supabase
    .from('oauth_states')
    .insert({ state, expires_at: expiresAt.toISOString() });

  if (error) throw error;
  return state;
}

export async function verifyOAuthStateToken(state: string): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('oauth_states')
    .select('id')
    .eq('state', state)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!data) return false;

  // Clean up used state
  await supabase
    .from('oauth_states')
    .delete()
    .eq('state', state);

  return true;
}

// ─── Profile Management ──────────────────────────────────────────────────────

export async function updateUserProfile(
  userId: string,
  updates: { full_name?: string | null; preferred_country?: string | null }
): Promise<void> {
  const supabase = await createClient();
  const dbUpdates: Record<string, string | null> = {};

  if (updates.full_name !== undefined) dbUpdates.full_name = updates.full_name;
  if (updates.preferred_country !== undefined) dbUpdates.preferred_country = updates.preferred_country;

  if (Object.keys(dbUpdates).length === 0) return;

  const { error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', userId);

  if (error) throw error;
}

