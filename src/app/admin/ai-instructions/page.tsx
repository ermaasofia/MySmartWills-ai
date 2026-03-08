import { Metadata } from 'next';
import { AIInstructionsForm } from '@/components/admin/ai-instructions-form';

export const metadata: Metadata = {
  title: 'AI Instructions - AI SmartWills Admin',
  description: 'Configure AI assistant behavior and instructions',
};

export default function AIInstructionsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">AI Instructions</h1>
        <p className="text-sm text-muted-foreground">
          Configure how the AI assistant responds to users. All prompts are used in chat.
        </p>
      </div>

      <AIInstructionsForm />
    </div>
  );
}
