import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AIInstructionsForm } from "@/components/admin/ai-instructions-form";

export const metadata: Metadata = {
  title: "AI Instructions - AI SmartWills Admin",
  description: "Configure AI assistant behavior and instructions",
};

export default async function AIInstructionsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin/ai-instructions');
  }

  // Optional: Add admin role check here if you implement roles
  // For now, any authenticated user can access

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Instructions Configuration</h1>
          <p className="text-muted-foreground">
            Configure bagaimana AI assistant akan respond kepada users. Semua prompts akan diguna dalam chat.
          </p>
        </div>

        <AIInstructionsForm />
      </div>
    </div>
  );
}
