import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';

// Initialize AI providers - using free tiers
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Country-specific context for will planning
const COUNTRY_CONTEXTS: Record<string, string> = {
  MY: `Malaysian will law follows the Wills Act 1959. Key points:
- Wills must be in writing and signed by the testator
- Two witnesses are required who are not beneficiaries
- Muslims are subject to Syariah law for estate distribution (Faraid)
- Non-Muslims can distribute assets freely
- Executors must be 18+ years old
- EPF nominations and insurance are separate from wills`,

  SG: `Singapore will law is based on the Wills Act (Cap 352). Key points:
- Wills must be signed in the presence of two witnesses
- Witnesses cannot be beneficiaries or spouses of beneficiaries
- Muslims follow the Administration of Muslim Law Act
- CPF nominations are separate from wills
- HDB flat rules may affect inheritance
- Testamentary capacity requires being of sound mind and 21+`,

  HK: `Hong Kong will law follows the Wills Ordinance. Key points:
- Wills must be in writing and signed
- Two witnesses are required
- Beneficiaries and their spouses should not witness
- No forced heirship rules (except for maintenance claims)
- Probate is required for estates with assets
- Chinese customary law may apply in some cases`,

  CN: `Chinese inheritance law (中国继承法). Key points:
- Both statutory succession and testamentary succession exist
- Forced heirship protects certain family members
- A will can be holographic (handwritten), printed, or notarized
- Two witnesses required for non-holographic wills
- Property must generally pass through probate
- Notarized wills have highest legal priority`,

  TW: `Taiwan Civil Code governs inheritance. Key points:
- Forced heirship (特留分) protects lineal descendants, parents, and spouse
- Wills can be self-written, notarized, or witnessed
- Self-written wills must be entirely handwritten
- Two witnesses needed for witnessed wills
- Inheritance tax applies to estates over NT$12 million
- Registration may be required for certain property`,

  ID: `Indonesian inheritance law involves multiple systems. Key points:
- Civil Code, Islamic law, or Adat law may apply
- Muslims follow Kompilasi Hukum Islam
- Wills should be notarized for validity
- Forced heirship exists in all systems
- Foreign ownership restrictions apply to land
- Probate through Religious or District Courts`,

  TH: `Thai inheritance law is governed by the Civil and Commercial Code. Key points:
- Wills must be in writing with date and signature
- Two witnesses required at the time of signing
- Forced heirship protects certain statutory heirs
- Foreigners face land ownership restrictions
- Probate through Thai courts is required
- Buddhist customs may influence practices`,

  AU: `Australian will law varies by state/territory. Key points:
- Wills must be in writing and signed
- Two witnesses required (most states)
- Family provision claims can override wills
- Superannuation and life insurance are often separate
- Testamentary trusts can provide tax benefits
- Digital assets should be addressed
- Each state has its own Succession Act`,

  NZ: `New Zealand will law follows the Wills Act 2007. Key points:
- Wills must be in writing and signed
- Two witnesses required (cannot be beneficiaries)
- Family Protection Act allows claims from family
- Relationship property claims possible
- KiwiSaver death benefits are separate
- Testamentary promises may be enforceable
- Māori land has special succession rules`,

  BN: `Brunei inheritance law. Key points:
- Muslims follow Syariah law and Faraid distribution
- Non-Muslims follow common law principles
- Wills must be in writing with witnesses
- Islamic law limits testamentary freedom to 1/3
- Wasiat (Islamic will) for specific bequests
- Hibah (gift) can be made during lifetime`,

  VN: `Vietnamese Civil Code governs inheritance. Key points:
- Both statutory and testamentary succession exist
- Forced heirship protects minor children, disabled dependents
- Wills can be written, witnessed, or notarized
- Notarized wills have strongest legal standing
- Land use rights have special succession rules
- Foreign inheritance restrictions may apply`,

  PH: `Philippine inheritance law is based on the Civil Code. Key points:
- Forced heirship (legitime) protects compulsory heirs
- Spouse, children, and parents have protected shares
- Only the "free portion" can be freely distributed
- Wills can be notarial or holographic
- Holographic wills must be entirely handwritten
- Estate tax applies to estates over PHP 5 million
- Foreign ownership restrictions on land`,
};

function getSystemPrompt(countryCode: string, countryName: string): string {
  const countryContext = COUNTRY_CONTEXTS[countryCode] || '';
  
  return `You are AI SmartWills, an intelligent legal will planning assistant specializing in ${countryName}. Your role is to help users understand the will planning process in their jurisdiction.

IMPORTANT GUIDELINES:
1. You provide general educational information about will planning, NOT legal advice
2. Always recommend consulting a qualified legal professional for specific situations
3. Be culturally sensitive and aware of local customs and practices
4. Explain concepts clearly in plain language
5. If asked about topics outside will planning, politely redirect to your area of expertise
6. Never make up legal requirements - if unsure, say so
7. Consider religious and cultural factors that may apply (e.g., Islamic law, Chinese customs)

COUNTRY-SPECIFIC KNOWLEDGE FOR ${countryName}:
${countryContext}

SMARTWILLS ECOSYSTEM:
- SmartWills offers online will writing services in Malaysia (smartwills.com.my), Singapore (smartwills.com.sg), and Hong Kong (smartwills.com.hk)
- MySmartwills (mysmartwills.com) is the global platform
- WasiatKu (wasiatku.com.my) is for Islamic wills in Malaysia
- You can mention these services when relevant but your primary role is educational

Respond in a helpful, professional, and empathetic manner. Will planning is a sensitive topic - be respectful of users' concerns about mortality and family matters.`;
}

export async function POST(req: Request) {
  try {
    const { messages, countryCode, countryName } = await req.json();

    // Try Groq first (faster, free tier), fall back to Google Gemini
    let model;
    
    if (process.env.GROQ_API_KEY) {
      model = groq('llama-3.3-70b-versatile');
    } else if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      model = google('gemini-1.5-flash');
    } else {
      // Return a helpful error if no API keys are configured
      return new Response(
        JSON.stringify({ 
          error: 'No AI provider configured. Please set GROQ_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY.' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model,
      system: getSystemPrompt(countryCode || 'MY', countryName || 'Malaysia'),
      messages,
      maxOutputTokens: 1024,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
