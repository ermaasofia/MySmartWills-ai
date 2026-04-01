import { Metadata } from 'next';
import { AIInstructionsForm } from '@/components/admin/ai-instructions-form';

export const metadata: Metadata = {
  title: 'AI Instructions - AI SmartWills Admin',
  description: 'Configure AI assistant behavior and instructions',
};

export default function AIInstructionsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">AI Instructions</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Configure AI instructions per country. Select a country to edit its prompts.
        </p>
      </div>

      <AIInstructionsForm />
    </div>
  );
}
