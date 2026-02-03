import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatHeader } from "@/components/chat/chat-header";

export const metadata: Metadata = {
  title: "Chat - AI SmartWills",
  description: "Chat with your AI will planning assistant",
};

export default async function ChatPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirect=/chat');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ChatHeader user={user} />
      <ChatInterface userId={user.id} />
    </div>
  );
}
