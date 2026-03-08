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

export type UserProfile = {
  id: string;
  email: string;
  fullName: string | null;
  preferredCountry: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
};
