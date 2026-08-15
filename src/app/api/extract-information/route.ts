import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth';
import { extractFactsFromMessage } from '@/lib/extract-facts';
import { upsertPlanData } from '@/lib/plan_data_v2';
import { isAllowedOrigin } from '@/lib/validation';

type ExtractedFacts = Record<string, unknown>;
type JsonObject = Record<string, unknown>;

// ============================================================
// AI EXTRACTION PROMPT
// ============================================================

const AI_EXTRACTION_SYSTEM_PROMPT = `
You are a structured data extractor for SmartWills Malaysia.

Your only job is to extract will-planning information and return JSON.

Extract only information supplied or explicitly confirmed by the user.

Use the previous assistant message as context when the user's answer
is short or when the user is answering a question about a specific
will section.

============================================================
TESTATOR
============================================================

Testator information uses top-level fields:

user_name
birthdate
phone
email
gender
address
religion
marital_status
dependents_count
dependents_label
identity_number
identity_country
identity_type

Example:

Previous assistant:
"What is your marital status?"

User:
"Married"

Return:

{
  "marital_status": "Married"
}

============================================================
EXECUTORS
============================================================

Executor information must be stored inside "executors".

Example structure:

{
  "executors": [
    {
      "type": "primary",
      "name": "",
      "identity_number": "",
      "identity_type": "",
      "identity_country": "",
      "relationship": "",
      "address": "",
      "email": "",
      "phone": ""
    }
  ]
}

Use:

"type": "primary"

for the primary executor.

Use:

"type": "secondary"

for the secondary executor.

Example:

Previous assistant:
"What is your primary executor's address?"

User:
"No. 3 Jalan ABC, Shah Alam"

Return:

{
  "executors": [
    {
      "type": "primary",
      "address": "No. 3 Jalan ABC, Shah Alam"
    }
  ]
}

============================================================
GUARDIANS
============================================================

Guardian information must be stored inside "guardians".

Example structure:

{
  "guardians": [
    {
      "type": "primary",
      "name": "",
      "identity_number": "",
      "identity_type": "",
      "identity_country": "",
      "relationship": "",
      "address": "",
      "email": "",
      "phone": ""
    }
  ]
}

Use:

"type": "primary"

for the primary guardian.

Use:

"type": "substitute"

for a substitute guardian.

A substitute guardian is still a guardian.

There may be:

- one primary guardian
- one or more substitute guardians

Never store guardian information inside executors.
Never store guardian information inside beneficiaries.

Example:

Previous assistant:
"Please provide the details for your Substitute Guardian."

User:
"Aina Binti Ahmad, NRIC 920202-03-5678, my cousin,
phone 0198765432, address Pasir Mas"

Return:

{
  "guardians": [
    {
      "type": "substitute",
      "name": "Aina Binti Ahmad",
      "identity_number": "920202-03-5678",
      "identity_type": "NRIC",
      "identity_country": "MY",
      "relationship": "my cousin",
      "phone": "0198765432",
      "address": "Pasir Mas"
    }
  ]
}

============================================================
ASSETS
============================================================

Asset information must be stored inside "assets".

Example:

{
  "assets": [
    {
      "category": "",
      "type": "",
      "description": "",
      "address": ""
    }
  ]
}

Examples of asset types:

- Condominium
- House
- Car
- Savings Account
- Investment
- Property

If the user adds another asset, return another asset object.

============================================================
BENEFICIARIES
============================================================

Normal beneficiary information must be stored inside "beneficiaries".

Example:

{
  "beneficiaries": [
    {
      "type": "main",
      "name": "",
      "identity_number": "",
      "identity_type": "",
      "identity_country": "",
      "relationship": "",
      "percentage": 0
    }
  ]
}

IMPORTANT:

"second beneficiary"
"another beneficiary"
"third beneficiary"
"add another beneficiary"

mean NORMAL beneficiaries.

They do NOT mean Residue Estate beneficiaries.

Never put a normal beneficiary into residue_estate unless the user
has explicitly moved to the Residue Estate section.

============================================================
RESIDUE ESTATE
============================================================

Residue Estate uses:

{
  "residue_estate": {
    "main": [],
    "substitute": []
  }
}

Each residue beneficiary may contain:

{
  "name": "",
  "identity_number": "",
  "identity_type": "",
  "identity_country": "",
  "relationship": "",
  "percentage": 0
}

Do not enter the Residue Estate section unless the conversation
clearly indicates that the user has proceeded to Residue Estate.

============================================================
RESIDUE ESTATE CONFIRMATION
============================================================

Sometimes the assistant proposes a specific Residue Estate
distribution and the user confirms it.

Example:

Previous assistant:

"Residue Estate Distribution

Daniel Tan — 50%
Nur Aisyah — 50%

Is this acceptable?"

User:

"Yes, confirm the default 50-50 split."

In this situation, the user has explicitly confirmed the proposed
distribution.

This is the ONLY situation where information from the previous
assistant message may be treated as confirmed user information.

Do NOT use this exception if the user rejects, changes, adjusts,
or customizes the distribution.

============================================================
WITNESSES
============================================================

Witness information must be stored inside "witnesses".

Example:

{
  "witnesses": [
    {
      "name": "",
      "identity_number": "",
      "identity_type": "",
      "identity_country": "",
      "address": "",
      "phone": ""
    }
  ]
}

Multiple witnesses are separate objects inside the witnesses array.

============================================================
SECTION CONTEXT ROUTING
============================================================

Use the previous assistant message to determine which section
the user's response belongs to.

If the previous assistant message is asking about an executor:
Return executor information ONLY inside "executors".

If the previous assistant message is asking about a guardian:
Return guardian information ONLY inside "guardians".

If the previous assistant message is asking about an asset:
Return asset information ONLY inside "assets".

If the previous assistant message is asking about a normal beneficiary:
Return beneficiary information ONLY inside "beneficiaries".

If the previous assistant message is asking about residue estate:
Return residue information ONLY inside "residue_estate".

If the previous assistant message is asking about a witness:
Return witness information ONLY inside "witnesses".

If the previous assistant message is asking about the testator:
Use top-level testator fields.

Explicit wording in the user's own message takes priority.

Examples:

"My primary guardian is Sarah"
→ guardians

"My substitute guardian is Aina"
→ guardians

"My primary executor is Alan"
→ executors

"My second beneficiary is Nur Aisyah"
→ beneficiaries

"My witness is John"
→ witnesses

============================================================
IDENTITY RULES
============================================================

For a Malaysian NRIC:

identity_type = "NRIC"
identity_country = "MY"

For structured people such as executors, guardians, beneficiaries,
and witnesses, keep identity information inside that person's JSON
object.

Do NOT store an executor, guardian, beneficiary, or witness NRIC
inside the top-level testator identity_number field.

============================================================
IMPORTANT RULES
============================================================

1. Extract only facts supplied or explicitly confirmed by the user.

2. Do not invent missing information.

3. Use the previous assistant message only to understand context.

4. Do not copy information from the assistant message as a user answer,
   except for an explicitly confirmed Residue Estate distribution.

5. Omit fields that were not provided.

6. Partial objects are allowed.

7. Do not output empty strings.

8. Do not output empty arrays unless necessary.

9. Return exactly one valid JSON object.

10. Do not return Markdown.

11. Do not return code fences.

12. Do not include explanations.

13. If no relevant information can be extracted, return {}.
`;

// ============================================================
// OPENROUTER
// ============================================================

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// ============================================================
// REQUEST BODY
// ============================================================

type ExtractInformationBody = {
  sessionId?: unknown;
  message?: unknown;
  countryCode?: unknown;
  previousAssistantMessage?: unknown;
};

// ============================================================
// JSON HELPERS
// ============================================================

function parseJsonFromText(
  text: string
): Record<string, unknown> | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(jsonMatch[0]);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Recursively clean an AI-generated value.
 *
 * Removes:
 * - null
 * - undefined
 * - empty strings
 * - empty arrays
 * - empty objects
 */
function normalizeValue(
  value: unknown
): unknown | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    return trimmed.length > 0
      ? trimmed
      : undefined;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value)
      ? value
      : undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    const cleaned = value
      .map(normalizeValue)
      .filter(
        (item): item is Exclude<
          typeof item,
          undefined
        > => item !== undefined
      );

    return cleaned.length > 0
      ? cleaned
      : undefined;
  }

  if (typeof value === 'object') {
    const cleaned: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(
      value as Record<string, unknown>
    )) {
      const normalized = normalizeValue(item);

      if (normalized !== undefined) {
        cleaned[key] = normalized;
      }
    }

    return Object.keys(cleaned).length > 0
      ? cleaned
      : undefined;
  }

  return undefined;
}

function normalizeAiExtraction(
  result: Record<string, unknown> | null
): ExtractedFacts {
  if (!result) {
    return {};
  }

  const normalized: ExtractedFacts = {};

  for (const [key, value] of Object.entries(result)) {
    const cleaned = normalizeValue(value);

    if (cleaned !== undefined) {
      normalized[key] = cleaned;
    }
  }

  return normalized;
}

// ============================================================
// AI EXTRACTION
// ============================================================

async function extractFactsWithModel(
  message: string,
  previousAssistantMessage: string | undefined,
  modelId: string
): Promise<ExtractedFacts> {
  const model = openrouter.chat(modelId) as any;

  const prompt = `
PREVIOUS ASSISTANT MESSAGE:

${previousAssistantMessage ?? 'Not provided'}

USER MESSAGE:

${message}

TASK:

Determine which will section the user's message belongs to.

Use the previous assistant message only as context.

Extract only information supplied or explicitly confirmed by the user.

Return exactly one valid JSON object.

Return {} if no relevant fact can be extracted.
`;

  console.log('Using extraction model:', modelId);

  const { text } = await generateText({
    model,
    system: AI_EXTRACTION_SYSTEM_PROMPT,
    prompt,
    maxOutputTokens: 600,
    temperature: 0,
  });

  console.log(
    '🤖 Raw AI extraction:',
    text
  );

  const parsed = parseJsonFromText(text);

  return normalizeAiExtraction(parsed);
}

async function extractFactsWithAI(
  message: string,
  previousAssistantMessage: string | undefined
): Promise<ExtractedFacts> {
  const result = await extractFactsWithModel(
    message,
    previousAssistantMessage,
    'deepseek/deepseek-chat'
  );

  if (Object.keys(result).length > 0) {
    console.log(
      '🤖 AI extraction succeeded:',
      result
    );
  }

  return result;
}

// ============================================================
// PREVIOUS ASSISTANT MESSAGE RECOVERY
// ============================================================

async function recoverPreviousAssistantMessage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sessionId: string,
  currentUserMessage: string
): Promise<string | undefined> {
  const {
    data: recentMessages,
    error,
  } = await supabase
    .from('chat_messages')
    .select('role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', {
      ascending: false,
    })
    .limit(30);

  if (error) {
    console.warn(
      'Could not recover previous assistant message:',
      error
    );

    return undefined;
  }

  if (!recentMessages?.length) {
    return undefined;
  }

  /**
   * Messages are ordered newest -> oldest.
   *
   * The current assistant reply might already have been
   * saved by the time extraction runs.
   *
   * Therefore:
   *
   * 1. Find the current USER message.
   * 2. Look only at messages older than it.
   * 3. Find the first assistant message there.
   */

  const currentUserIndex =
    recentMessages.findIndex(
      (item) =>
        item.role === 'user' &&
        typeof item.content === 'string' &&
        item.content.trim() ===
          currentUserMessage.trim()
    );

  if (currentUserIndex >= 0) {
    const messagesBeforeCurrentUser =
      recentMessages.slice(
        currentUserIndex + 1
      );

    const previousAssistant =
      messagesBeforeCurrentUser.find(
        (item) =>
          item.role === 'assistant' &&
          typeof item.content === 'string'
      );

    if (
      previousAssistant &&
      typeof previousAssistant.content === 'string'
    ) {
      return previousAssistant.content.trim();
    }
  }

  /**
   * Fallback:
   * use an assistant message from history if exact user
   * matching failed.
   */
  const fallbackAssistant =
    recentMessages.find(
      (item) =>
        item.role === 'assistant' &&
        typeof item.content === 'string'
    );

  if (
    fallbackAssistant &&
    typeof fallbackAssistant.content === 'string'
  ) {
    return fallbackAssistant.content.trim();
  }

  return undefined;
}

// ============================================================
// RESIDUE ESTATE CONFIRMATION
// ============================================================

function isAffirmativeResidueConfirmation(
  message: string,
  previousAssistantMessage:
    | string
    | undefined
): boolean {
  const current = message
    .trim()
    .toLowerCase();

  const previous =
    previousAssistantMessage
      ?.trim()
      .toLowerCase() ?? '';

  const hasNegativeIntent =
    /\b(no|not|don't|do not|change|customize|adjust|different)\b/i.test(
      current
    );

  if (hasNegativeIntent) {
    return false;
  }

  const affirmative =
    /\b(yes|confirm|confirmed|agree|agreed|acceptable|okay|ok)\b/i.test(
      current
    );

  if (!affirmative) {
    return false;
  }

  const residueContext =
    previous.includes('residue estate') ||
    previous.includes('residue assets') ||
    previous.includes('default split') ||
    previous.includes('remaining estate') ||
    current.includes('residue estate');

  return residueContext;
}

async function saveConfirmedResidueEstate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sessionId: string,
  userId: string,
  countryCode: string
): Promise<ExtractedFacts | null> {
  const {
    data: existingPlan,
    error,
  } = await supabase
    .from('plan_data_v2')
    .select('beneficiaries')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error(
      'Failed to retrieve beneficiaries for residue estate:',
      error
    );

    return null;
  }

  const beneficiaries =
    Array.isArray(
      existingPlan?.beneficiaries
    )
      ? existingPlan.beneficiaries
      : [];

  if (beneficiaries.length === 0) {
    console.warn(
      'Residue confirmation detected but no beneficiaries are saved.'
    );

    return null;
  }

  const residueMain =
    beneficiaries
      .filter(
        (
          beneficiary
        ): beneficiary is JsonObject =>
          typeof beneficiary === 'object' &&
          beneficiary !== null &&
          !Array.isArray(beneficiary)
      )
      .map((beneficiary) => {
        const residuePerson: JsonObject = {};

        if (beneficiary.name !== undefined) {
          residuePerson.name =
            beneficiary.name;
        }

        if (
          beneficiary.identity_number !==
          undefined
        ) {
          residuePerson.identity_number =
            beneficiary.identity_number;
        }

        if (
          beneficiary.identity_type !==
          undefined
        ) {
          residuePerson.identity_type =
            beneficiary.identity_type;
        }

        if (
          beneficiary.identity_country !==
          undefined
        ) {
          residuePerson.identity_country =
            beneficiary.identity_country;
        }

        if (
          beneficiary.relationship !==
          undefined
        ) {
          residuePerson.relationship =
            beneficiary.relationship;
        }

        const percentage =
          beneficiary.percentage ??
          beneficiary.share;

        if (percentage !== undefined) {
          residuePerson.percentage =
            percentage;
        }

        return residuePerson;
      });

  if (residueMain.length === 0) {
    return null;
  }

  const extraction: ExtractedFacts = {
    residue_estate: {
      main: residueMain,
      substitute: [],
    },
  };

  console.log(
    '🏠 Saving confirmed residue estate:',
    extraction
  );

  await upsertPlanData(
    sessionId,
    userId,
    countryCode,
    extraction
  );

  console.log(
    '✅ Residue estate confirmed and saved'
  );

  return extraction;
}

// ============================================================
// POST
// ============================================================

export async function POST(req: Request) {
  try {
    // --------------------------------------------------------
    // ORIGIN
    // --------------------------------------------------------

    const origin =
      req.headers.get('origin');

    if (!isAllowedOrigin(origin)) {
      return Response.json(
        {
          error: 'Forbidden',
        },
        {
          status: 403,
        }
      );
    }

    // --------------------------------------------------------
    // AUTH
    // --------------------------------------------------------

    const user =
      await getSessionUser();

    if (!user) {
      return Response.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------------
    // BODY
    // --------------------------------------------------------

    const body =
      (await req.json()) as ExtractInformationBody;

    const sessionId =
      typeof body.sessionId === 'string'
        ? body.sessionId.trim()
        : '';

    const message =
      typeof body.message === 'string'
        ? body.message.trim()
        : '';

    const countryCode =
      typeof body.countryCode === 'string'
        ? body.countryCode
            .trim()
            .slice(0, 5)
        : '';

    let previousAssistantMessage =
      typeof body.previousAssistantMessage ===
      'string'
        ? body.previousAssistantMessage.trim()
        : undefined;

    if (!sessionId || !message) {
      return Response.json(
        {
          error:
            'sessionId and message are required',
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // VERIFY SESSION
    // --------------------------------------------------------

    const supabase =
      await createClient();

    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from('chat_sessions')
      .select('id, country_code')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (sessionError) {
      console.error(
        'Session lookup failed:',
        sessionError
      );
    }

    if (!session) {
      return Response.json(
        {
          error: 'Chat session not found',
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------------
    // RECOVER PREVIOUS ASSISTANT MESSAGE
    // --------------------------------------------------------

    if (!previousAssistantMessage) {
      previousAssistantMessage =
        await recoverPreviousAssistantMessage(
          supabase,
          sessionId,
          message
        );
    }

    console.log(
      '🧭 Previous assistant message:',
      previousAssistantMessage
    );

    const safeCountryCode =
      countryCode ||
      session.country_code ||
      'MY';

    // --------------------------------------------------------
    // SPECIAL CASE:
    // RESIDUE ESTATE CONFIRMATION
    // --------------------------------------------------------

    const isResidueConfirmation =
      isAffirmativeResidueConfirmation(
        message,
        previousAssistantMessage
      );

    if (isResidueConfirmation) {
      console.log(
        '🏠 Residue estate confirmation detected'
      );

      const residueExtraction =
        await saveConfirmedResidueEstate(
          supabase,
          sessionId,
          user.id,
          safeCountryCode
        );

      if (residueExtraction) {
        return Response.json({
          ok: true,
          updated: true,
          extracted:
            residueExtraction,
        });
      }
    }

    // --------------------------------------------------------
    // REGEX EXTRACTION
    // --------------------------------------------------------

    const ruleExtraction =
      extractFactsFromMessage(message);

    console.log(
      '🔍 Rule-extracted facts:',
      ruleExtraction
    );

    // --------------------------------------------------------
    // AI EXTRACTION
    // --------------------------------------------------------

    let aiExtraction:
      ExtractedFacts = {};

    try {
      aiExtraction =
        await extractFactsWithAI(
          message,
          previousAssistantMessage
        );
    } catch (aiError) {
      console.warn(
        'AI extraction failed:',
        aiError
      );
    }

    // --------------------------------------------------------
    // AI FIRST, REGEX FALLBACK
    // --------------------------------------------------------

    let finalExtraction:
      ExtractedFacts;

    if (
      Object.keys(aiExtraction).length >
      0
    ) {
      finalExtraction =
        aiExtraction;
    } else {
      finalExtraction =
        ruleExtraction;
    }

    console.log(
      'Final extraction:',
      finalExtraction
    );

    // --------------------------------------------------------
    // NOTHING TO SAVE
    // --------------------------------------------------------

    if (
      Object.keys(finalExtraction).length ===
      0
    ) {
      return Response.json({
        ok: true,
        updated: false,
        extracted: {},
      });
    }

    // --------------------------------------------------------
    // SAVE TO PLAN_DATA_V2
    // --------------------------------------------------------

    await upsertPlanData(
      sessionId,
      user.id,
      safeCountryCode,
      finalExtraction
    );

    console.log(
      '✅ plan_data_v2 updated successfully'
    );

    console.log(
      '✅ Saved plan information:',
      finalExtraction
    );

    return Response.json({
      ok: true,
      updated: true,
      extracted:
        finalExtraction,
    });
  } catch (error) {
    console.error(
      'POST /api/extract-information error:',
      error
    );

    return Response.json(
      {
        error:
          'Failed to extract information',
      },
      {
        status: 500,
      }
    );
  }
}