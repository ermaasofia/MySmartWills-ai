'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface PromptData {
  character: string;
  sop: string;
  company_info: string;
  services: string;
  other: string;
}

interface SaveStatus {
  [key: string]: 'idle' | 'saving' | 'success' | 'error';
}

export function AIInstructionsForm() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<PromptData>({
    character: '',
    sop: '',
    company_info: '',
    services: '',
    other: '',
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    character: 'idle',
    sop: 'idle',
    company_info: 'idle',
    services: 'idle',
    other: 'idle',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/admin/ai-prompts');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch prompts');
      }

      const data = await response.json();
      const fetchedPrompts = data.prompts || {};

      setPrompts({
        character: fetchedPrompts.character?.content || '',
        sop: fetchedPrompts.sop?.content || '',
        company_info: fetchedPrompts.company_info?.content || '',
        services: fetchedPrompts.services?.content || '',
        other: fetchedPrompts.other?.content || '',
      });
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (promptType: keyof PromptData) => {
    setSaveStatus(prev => ({ ...prev, [promptType]: 'saving' }));

    try {
      const response = await fetch('/api/admin/ai-prompts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_type: promptType,
          content: prompts[promptType],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }

      setSaveStatus(prev => ({ ...prev, [promptType]: 'success' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [promptType]: 'idle' }));
      }, 2000);
    } catch (error) {
      console.error('Error saving prompt:', error);
      setSaveStatus(prev => ({ ...prev, [promptType]: 'error' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [promptType]: 'idle' }));
      }, 3000);
    }
  };

  const handleChange = (promptType: keyof PromptData, value: string) => {
    setPrompts(prev => ({ ...prev, [promptType]: value }));
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return '✓ Saved';
      case 'error':
        return '✗ Error';
      default:
        return 'Save';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Character Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>AI Character / Personality</CardTitle>
          <CardDescription>
            Define bagaimana AI akan behave dan personality dia. Contoh: Friendly, professional, empathetic, dll.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="character">Character Instructions</Label>
            <Textarea
              id="character"
              value={prompts.character}
              onChange={(e) => handleChange('character', e.target.value)}
              placeholder="Contoh: You are friendly and professional. You speak in a warm, empathetic tone..."
              className="min-h-32"
            />
          </div>
          <Button
            onClick={() => handleSave('character')}
            disabled={saveStatus.character === 'saving'}
            className="w-full sm:w-auto"
          >
            {getButtonText(saveStatus.character)}
          </Button>
        </CardContent>
      </Card>

      {/* SOP Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Operating Procedures (SOP)</CardTitle>
          <CardDescription>
            Define SOP atau guidelines yang AI kena follow bila respond. Contoh: Format response, step by step process, dll.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sop">SOP Instructions</Label>
            <Textarea
              id="sop"
              value={prompts.sop}
              onChange={(e) => handleChange('sop', e.target.value)}
              placeholder="Contoh: Always greet users first. Provide clear steps. Ask clarifying questions when needed..."
              className="min-h-32"
            />
          </div>
          <Button
            onClick={() => handleSave('sop')}
            disabled={saveStatus.sop === 'saving'}
            className="w-full sm:w-auto"
          >
            {getButtonText(saveStatus.sop)}
          </Button>
        </CardContent>
      </Card>

      {/* Company Info Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Maklumat tentang company supaya AI boleh refer dengan tepat bila user tanya.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_info">Company Information</Label>
            <Textarea
              id="company_info"
              value={prompts.company_info}
              onChange={(e) => handleChange('company_info', e.target.value)}
              placeholder="Contoh: SmartWills adalah platform will planning di Malaysia. Ditubuhkan pada 2020..."
              className="min-h-32"
            />
          </div>
          <Button
            onClick={() => handleSave('company_info')}
            disabled={saveStatus.company_info === 'saving'}
            className="w-full sm:w-auto"
          >
            {getButtonText(saveStatus.company_info)}
          </Button>
        </CardContent>
      </Card>

      {/* Services Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Services / Products</CardTitle>
          <CardDescription>
            List services atau products yang company offer supaya AI boleh inform users dengan betul.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="services">Services Information</Label>
            <Textarea
              id="services"
              value={prompts.services}
              onChange={(e) => handleChange('services', e.target.value)}
              placeholder="Contoh: 1. Will Writing Service - RM299, 2. Trust Setup - RM1,999, 3. Estate Planning Consultation..."
              className="min-h-32"
            />
          </div>
          <Button
            onClick={() => handleSave('services')}
            disabled={saveStatus.services === 'saving'}
            className="w-full sm:w-auto"
          >
            {getButtonText(saveStatus.services)}
          </Button>
        </CardContent>
      </Card>

      {/* Other Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Other Instructions</CardTitle>
          <CardDescription>
            Additional instructions atau special cases yang tak fit dalam categories lain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="other">Other Instructions</Label>
            <Textarea
              id="other"
              value={prompts.other}
              onChange={(e) => handleChange('other', e.target.value)}
              placeholder="Contoh: Special promotions, seasonal offers, important disclaimers..."
              className="min-h-32"
            />
          </div>
          <Button
            onClick={() => handleSave('other')}
            disabled={saveStatus.other === 'saving'}
            className="w-full sm:w-auto"
          >
            {getButtonText(saveStatus.other)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
