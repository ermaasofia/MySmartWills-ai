import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin: adminStatus, user } = await isAdmin();

  if (!adminStatus || !user) {
    redirect('/chat');
  }

  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}
