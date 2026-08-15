/**
 * Supabase Query Builder
 *
 * Since the real Supabase SDK doesn't support the `.from()` method on
 * a generic `any` type in a ways that avoids TS errors with the Proxy pattern,
 * this is intentionally deleted.
 *
 * Instead, all consumer code should use:
 *   const client = await createClient();
 *   const { data, error } = await client.from('table').select('*');
 */

// Re-export types for convenience
import type { SupabaseClient } from './server';
export type SupabaseQueryBuilder = ReturnType<SupabaseClient['from']>;

