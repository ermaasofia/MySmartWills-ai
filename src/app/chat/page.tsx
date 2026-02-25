import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatShell } from "@/components/chat/chat-shell";

export const metadata: Metadata = {
  title: "Chat - AI SmartWills",
  description: "Chat with your AI will planning assistant",
};

interface ChatPageProps {
  searchParams: Promise<{ session?: string }>;
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/chat');
  }

  const { session: sessionId } = await searchParams;

  return (
    <ChatShell
      userId={user.id}
      userName={user.user_metadata?.full_name ?? ''}
      userEmail={user.email ?? ''}
      initialSessionId={sessionId}
    />
  );
}
