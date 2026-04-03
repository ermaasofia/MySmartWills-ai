import { Country, PromptData } from '@/types';

export const COUNTRIES: Country[] = [
  {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    language: 'Malay / English',
    locale: 'ms-MY',
    domain: 'smartwills.com.my',
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    language: 'English',
    locale: 'en-SG',
    domain: 'smartwills.com.sg',
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    flag: '🇭🇰',
    language: 'Chinese / English',
    locale: 'zh-HK',
    domain: 'smartwills.com.hk',
  },
  {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    language: 'Chinese',
    locale: 'zh-CN',
    domain: null,
  },
  {
    code: 'TW',
    name: 'Taiwan',
    flag: '🇹🇼',
    language: 'Chinese',
    locale: 'zh-TW',
    domain: null,
  },
  {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    language: 'Indonesian',
    locale: 'id-ID',
    domain: null,
  },
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    language: 'Thai',
    locale: 'th-TH',
    domain: null,
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    language: 'English',
    locale: 'en-AU',
    domain: null,
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    language: 'English',
    locale: 'en-NZ',
    domain: null,
  },
  {
    code: 'BN',
    name: 'Brunei',
    flag: '🇧🇳',
    language: 'Malay / English',
    locale: 'ms-BN',
    domain: null,
  },
  {
    code: 'VN',
    name: 'Vietnam',
    flag: '🇻🇳',
    language: 'Vietnamese',
    locale: 'vi-VN',
    domain: null,
  },
  {
    code: 'PH',
    name: 'Philippines',
    flag: '🇵🇭',
    language: 'Filipino / English',
    locale: 'en-PH',
    domain: null,
  },
];

export const PROMPT_TYPES = ['character', 'sop', 'company_info', 'services', 'other'] as const;
export type PromptType = (typeof PROMPT_TYPES)[number];

export const EMPTY_PROMPTS: PromptData = {
  character: '',
  sop: '',
  company_info: '',
  services: '',
  other: '',
};

export const AI_INSTRUCTION_COUNTRIES = [
  { code: 'MY' as const, name: 'Malaysia (Conventional Will)', flag: COUNTRIES[0].flag },
  { code: 'MY_WK' as const, name: 'Malaysia / WasiatKu (Islamic Will)', flag: COUNTRIES[0].flag },
  ...COUNTRIES.filter((c) => c.code !== 'MY').map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
  })),
];

export type AIInstructionCountryCode = (typeof AI_INSTRUCTION_COUNTRIES)[number]['code'];

export const APP_NAME = 'AI SmartWills';
export const APP_DESCRIPTION = 'Your intelligent legal will planning assistant';
