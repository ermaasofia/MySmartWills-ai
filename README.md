# AI SmartWills

Your intelligent legal will planning assistant for 12 countries across Asia-Pacific.

## Features

- Multi-country support (Malaysia, Singapore, Hong Kong, China, Taiwan, Indonesia, Thailand, Australia, New Zealand, Brunei, Vietnam, Philippines)
- AI-powered chat with country-specific legal knowledge
- Dark/Light mode with system sync
- Secure authentication via Supabase
- RAG-ready architecture for knowledge base integration
- Modern, minimal black & white design with Crimson Text font

## Tech Stack

- **Frontend**: Next.js 16+ with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Vector Store)
- **AI**: Vercel AI SDK with Groq (Llama 3.1) and Google Gemini (free tiers)
- **Deployment**: Vercel (free tier compatible)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account (free tier)
- Groq API key (free) and/or Google AI API key (free)

### 1. Clone and Install Dependencies

```bash
cd aismartwills
pnpm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API and copy:
   - Project URL
   - Anon public key
3. Go to SQL Editor and run the schema from `supabase/schema.sql`
4. Enable Email Auth in Authentication > Providers

### 3. Get Free AI API Keys

#### Groq (Recommended - Fast & Free)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Create an API key

#### Google Gemini (Alternative)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google
3. Create an API key

### 4. Configure Environment Variables

Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# AI Provider API Keys (at least one required)
GROQ_API_KEY=your_groq_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Project Structure

```
aismartwills/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/           # AI chat API route
│   │   ├── auth/
│   │   │   └── callback/       # OAuth callback handler
│   │   ├── chat/               # Protected chat page
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── globals.css         # Global styles & theme
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── auth/               # Auth forms
│   │   ├── chat/               # Chat interface components
│   │   ├── providers/          # Theme provider
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── supabase/           # Supabase clients
│   │   ├── constants.ts        # App constants & countries
│   │   └── utils.ts            # Utility functions
│   ├── types/                  # TypeScript types
│   └── middleware.ts           # Auth middleware
├── supabase/
│   └── schema.sql              # Database schema
└── public/                     # Static assets
```

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Vercel

Add these in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (set to your production URL)

## Security Features

- Row Level Security (RLS) on all database tables
- Secure session management with Supabase Auth
- Protected routes via middleware
- HTTP-only cookies for session tokens
- CSRF protection built into Supabase

## Supported Countries

| Country | Code | Languages | SmartWills Domain |
|---------|------|-----------|-------------------|
| Malaysia | MY | Malay/English | smartwills.com.my |
| Singapore | SG | English | smartwills.com.sg |
| Hong Kong | HK | Chinese/English | smartwills.com.hk |
| China | CN | Chinese | - |
| Taiwan | TW | Chinese | - |
| Indonesia | ID | Indonesian | - |
| Thailand | TH | Thai | - |
| Australia | AU | English | - |
| New Zealand | NZ | English | - |
| Brunei | BN | Malay/English | - |
| Vietnam | VN | Vietnamese | - |
| Philippines | PH | Filipino/English | - |

## Future Enhancements (Phase 2+)

- [ ] RAG implementation with SmartWills knowledge base
- [ ] Chat history persistence
- [ ] Multi-language UI localization
- [ ] Website content scraping for knowledge base
- [ ] Document generation assistance
- [ ] Email verification flow
- [ ] Password reset functionality

## License

Private - All rights reserved.

