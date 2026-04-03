'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { type PromptType, AI_INSTRUCTION_COUNTRIES, EMPTY_PROMPTS } from '@/lib/constants';
import { PromptData } from '@/types';

interface SaveStatus {
  [key: string]: 'idle' | 'saving' | 'success' | 'error';
}

const PROMPT_CONFIGS: {
  key: PromptType;
  title: string;
  description: string;
  placeholder: string;
}[] = [
  {
    key: 'character',
    title: 'AI Character / Personality',
    description: 'Define how the AI behaves and its personality. E.g: Friendly, professional, empathetic.',
    placeholder: 'E.g: You are friendly and professional. You speak in a warm, empathetic tone...',
  },
  {
    key: 'sop',
    title: 'Standard Operating Procedures (SOP)',
    description: 'Guidelines the AI follows when responding. E.g: Response format, step by step process.',
    placeholder: 'E.g: Always greet users first. Provide clear steps. Ask clarifying questions when needed...',
  },
  {
    key: 'company_info',
    title: 'Company Information',
    description: 'Company details the AI can reference when users ask.',
    placeholder: 'E.g: SmartWills is a will planning platform in Malaysia. Founded in 2020...',
  },
  {
    key: 'services',
    title: 'Services / Products',
    description: 'Services or products the company offers so the AI can inform users accurately.',
    placeholder: 'E.g: 1. Will Writing Service - RM299, 2. Trust Setup - RM1,999...',
  },
  {
    key: 'other',
    title: 'Other Instructions',
    description: 'Additional instructions or special cases not covered by other categories.',
    placeholder: 'E.g: Special promotions, seasonal offers, important disclaimers...',
  },
];

export function AIInstructionsForm() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('MY');
  const [prompts, setPrompts] = useState<PromptData>({ ...EMPTY_PROMPTS });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    character: 'idle',
    sop: 'idle',
    company_info: 'idle',
    services: 'idle',
    other: 'idle',
  });
  const [isLoading, setIsLoading] = useState(true);
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  const fetchPrompts = useCallback(async (countryCode: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/ai-prompts?country_code=${countryCode}`);
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
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
      setPrompts({ ...EMPTY_PROMPTS });
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPrompts(selectedCountry);
    const timeouts = timeoutsRef.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, [selectedCountry, fetchPrompts]);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSaveStatus({
      character: 'idle',
      sop: 'idle',
      company_info: 'idle',
      services: 'idle',
      other: 'idle',
    });
  };

  const handleSave = async (promptType: PromptType) => {
    setSaveStatus((prev) => ({ ...prev, [promptType]: 'saving' }));

    try {
      const response = await fetch('/api/admin/ai-prompts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_type: promptType,
          content: prompts[promptType],
          country_code: selectedCountry,
        }),
      });

      if (response.status === 403) {
        router.push('/chat');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }

      setSaveStatus((prev) => ({ ...prev, [promptType]: 'success' }));
      clearTimeout(timeoutsRef.current[promptType]);
      timeoutsRef.current[promptType] = setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [promptType]: 'idle' }));
      }, 2000);
    } catch (error) {
      console.error('Error saving prompt:', error);
      setSaveStatus((prev) => ({ ...prev, [promptType]: 'error' }));
      clearTimeout(timeoutsRef.current[promptType]);
      timeoutsRef.current[promptType] = setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [promptType]: 'idle' }));
      }, 3000);
    }
  };

  const handleChange = (promptType: PromptType, value: string) => {
    setPrompts((prev) => ({ ...prev, [promptType]: value }));
  };

  const getButtonVariant = (status: string) => {
    if (status === 'success') return 'outline' as const;
    if (status === 'error') return 'destructive' as const;
    return 'default' as const;
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved';
      case 'error':
        return 'Error — Retry';
      default:
        return 'Save';
    }
  };

  const selectedCountryName = AI_INSTRUCTION_COUNTRIES.find(
    (c) => c.code === selectedCountry
  )?.name || selectedCountry;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Label className="text-sm font-medium whitespace-nowrap">Country</Label>
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[260px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AI_INSTRUCTION_COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.flag} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="p-4 md:p-6">
                <div className="h-5 w-3/4 max-w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full max-w-72 bg-muted animate-pulse rounded mt-2" />
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="h-24 md:h-32 bg-muted animate-pulse rounded" />
                <div className="h-9 w-20 bg-muted animate-pulse rounded mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Editing instructions for <span className="font-medium">{selectedCountryName}</span>. These prompts will be used when users chat with this country selected.
          </p>
          {PROMPT_CONFIGS.map((config) => (
            <Card key={config.key}>
              <CardHeader className="p-4 pb-2 md:p-6 md:pb-3">
                <CardTitle className="text-sm md:text-base">{config.title}</CardTitle>
                <CardDescription className="text-xs">
                  {config.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`${selectedCountry}-${config.key}`} className="sr-only">
                    {config.title}
                  </Label>
                  <Textarea
                    id={`${selectedCountry}-${config.key}`}
                    value={prompts[config.key]}
                    onChange={(e) => handleChange(config.key, e.target.value)}
                    placeholder={config.placeholder}
                    className="min-h-24 md:min-h-32 text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground text-right">
                    {prompts[config.key].length.toLocaleString()} characters
                  </p>
                </div>
                <Button
                  onClick={() => handleSave(config.key)}
                  disabled={saveStatus[config.key] === 'saving'}
                  variant={getButtonVariant(saveStatus[config.key])}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  {getButtonText(saveStatus[config.key])}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
