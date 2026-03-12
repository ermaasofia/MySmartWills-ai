import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Bot } from 'lucide-react';
import { PROMPT_TYPES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Dashboard - AI SmartWills Admin',
  description: 'Admin dashboard overview',
};

async function getStats() {
  const supabase = await createClient();

  const [profilesRes, sessionsRes, promptsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('chat_sessions').select('id', { count: 'exact', head: true }),
    supabase.from('ai_prompts').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ]);

  return {
    totalUsers: profilesRes.count ?? 0,
    totalSessions: sessionsRes.count ?? 0,
    activePrompts: promptsRes.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Chat Sessions',
      value: stats.totalSessions,
      icon: MessageSquare,
      description: 'Total conversations',
    },
    {
      title: 'AI Prompts',
      value: `${stats.activePrompts}/${PROMPT_TYPES.length}`,
      icon: Bot,
      description: 'Active prompt configs',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Overview of your AI SmartWills platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
