export type Country = {
  code: string;
  name: string;
  flag: string;
  language: string;
  locale: string;
  domain: string | null;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
};

export type ChatSession = {
  id: string;
  userId: string;
  countryCode: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface PromptData {
  character: string;
  sop: string;
  company_info: string;
  services: string;
  other: string;

  testator: string;
  executor: string;
  guardian: string;
  asset: string;
  beneficiary: string;
  residue_estate: string;
  witness: string;
  pdf_preview: string;
}

export type UserProfile = {
  id: string;
  email: string;
  fullName: string | null;
  preferredCountry: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
};
