import { Country } from '@/types';

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

export const AI_INSTRUCTION_COUNTRIES = [
  { code: 'MY', name: 'Malaysia (Conventional Will)', flag: '\u{1F1F2}\u{1F1FE}' },
  { code: 'MY_WK', name: 'Malaysia / WasiatKu (Islamic Will)', flag: '\u{1F1F2}\u{1F1FE}' },
  { code: 'SG', name: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}' },
  { code: 'HK', name: 'Hong Kong', flag: '\u{1F1ED}\u{1F1F0}' },
  { code: 'CN', name: 'China', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'TW', name: 'Taiwan', flag: '\u{1F1F9}\u{1F1FC}' },
  { code: 'ID', name: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}' },
  { code: 'TH', name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}' },
  { code: 'AU', name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}' },
  { code: 'NZ', name: 'New Zealand', flag: '\u{1F1F3}\u{1F1FF}' },
  { code: 'BN', name: 'Brunei', flag: '\u{1F1E7}\u{1F1F3}' },
  { code: 'VN', name: 'Vietnam', flag: '\u{1F1FB}\u{1F1F3}' },
  { code: 'PH', name: 'Philippines', flag: '\u{1F1F5}\u{1F1ED}' },
] as const;

export type AIInstructionCountryCode = (typeof AI_INSTRUCTION_COUNTRIES)[number]['code'];

export const APP_NAME = 'AI SmartWills';
export const APP_DESCRIPTION = 'Your intelligent legal will planning assistant';
