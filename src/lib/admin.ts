import { SupabaseClient } from '@supabase/supabase-js';

const ADMIN_EMAILS_ENV = process.env.ADMIN_EMAILS ?? '';

function getAdminEmails(): string[] {
  return ADMIN_EMAILS_ENV
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Check if the current authenticated user is an admin.
 * 1. Queries profiles.role in the database
 * 2. Falls back to ADMIN_EMAILS env var (bootstrap convenience)
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

  // Check database role first
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin') {
    return { isAdmin: true, user: { id: user.id, email: user.email } };
  }

  // Fallback: check ADMIN_EMAILS environment variable
  const adminEmails = getAdminEmails();
  if (adminEmails.includes(user.email.toLowerCase())) {
    return { isAdmin: true, user: { id: user.id, email: user.email } };
  }

  return { isAdmin: false, user: { id: user.id, email: user.email } };
}
