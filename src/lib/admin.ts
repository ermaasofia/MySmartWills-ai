/**
 * Admin Library
 *
 * Admin role verification using Supabase profiles table.
 */

import { getSessionUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAILS_ENV = process.env.ADMIN_EMAILS ?? '';

function getAdminEmails(): string[] {
  return ADMIN_EMAILS_ENV
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// Cached once an admin row is observed in profiles. Once true, ADMIN_EMAILS
// env-var fallback is permanently disabled for this process.
let adminRowExists: boolean | null = null;

export async function isBootstrapMode(): Promise<boolean> {
  if (adminRowExists === true) return false;

  const supabase = await createClient();
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin');

  if (count && count > 0) {
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
 *
 * @param _supabase Optional pre-created Supabase client (for API route re-use, currently unused)
 */
export async function isAdmin(
  _supabase?: Awaited<ReturnType<typeof createClient>>
): Promise<{ isAdmin: boolean; user: { id: string; email: string } | null }> {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.email) {
    return { isAdmin: false, user: null };
  }

  if (sessionUser.role === 'admin') {
    return { isAdmin: true, user: { id: sessionUser.id, email: sessionUser.email } };
  }

  if (await isBootstrapMode()) {
    const adminEmails = getAdminEmails();
    if (adminEmails.includes(sessionUser.email.toLowerCase())) {
      return { isAdmin: true, user: { id: sessionUser.id, email: sessionUser.email } };
    }
  }

  return { isAdmin: false, user: { id: sessionUser.id, email: sessionUser.email } };
}
