'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

interface AdminShellProps {
  userEmail: string;
  children: React.ReactNode;
}

export function AdminShell({ userEmail, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('overflow-locked');
    document.body.classList.add('overflow-locked');
    return () => {
      document.documentElement.classList.remove('overflow-locked');
      document.body.classList.remove('overflow-locked');
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar
        userEmail={userEmail}
        isSidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
