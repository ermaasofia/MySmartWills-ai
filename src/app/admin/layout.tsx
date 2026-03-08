import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { isAdmin: adminStatus, user } = await isAdmin(supabase);

  if (!adminStatus || !user) {
    redirect('/chat');
  }

  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}
