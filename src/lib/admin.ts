import { SupabaseClient } from '@supabase/supabase-js';

const ADMIN_EMAILS_ENV = process.env.ADMIN_EMAILS ?? '';

function getAdminEmails(): string[] {
  return ADMIN_EMAILS_ENV
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// Cached once an admin row is observed in profiles. Once true, ADMIN_EMAILS
// env-var fallback is permanently disabled for this process — `profiles.role`
// becomes the sole source of truth. A server restart is required to re-enable
// the env-var path (e.g. if every admin row is deleted).
let adminRowExists: boolean | null = null;

export async function isBootstrapMode(supabase: SupabaseClient): Promise<boolean> {
  if (adminRowExists === true) return false;

  const { count } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'admin');

  if ((count ?? 0) > 0) {
    adminRowExists = true;
    return false;
  }
  return true;
}

/**
 * Check if the current authenticated user is an admin.
 * 1. Queries profiles.role in the database
 * 2. Falls back to ADMIN_EMAILS env var ONLY when no admin row exists yet
 *    (bootstrap mode — first admin must self-promote then the env var stops mattering)
 */
export async function isAdmin(
  supabase: SupabaseClient
): Promise<{ isAdmin: boolean; user: { id: string; email: string } | null }> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    return { isAdmin: false, user: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin') {
    return { isAdmin: true, user: { id: user.id, email: user.email } };
  }

  if (await isBootstrapMode(supabase)) {
    const adminEmails = getAdminEmails();
    if (adminEmails.includes(user.email.toLowerCase())) {
      return { isAdmin: true, user: { id: user.id, email: user.email } };
    }
  }

  return { isAdmin: false, user: { id: user.id, email: user.email } };
}
