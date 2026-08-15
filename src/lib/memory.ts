/**
 * Memory Library
 *
 * User memories and conversation summaries managed via Supabase.
 */

import { generateText, type LanguageModel } from 'ai';
import type { UserMemoryFacts, ConversationSummaryRow } from '@/types/memory';
import { createClient } from '@/lib/supabase/server';

// ─── DB Helpers ──────────────────────────────────────────────────────────────

export async function getUserMemory(
  userId: string,
): Promise<UserMemoryFacts | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('user_memories')
    .select('facts')
    .eq('user_id', userId)
    .single();

  if (!data) return null;

  try {
    return data.facts as UserMemoryFacts;
  } catch {
    return null;
  }
}

export async function upsertUserMemory(
  userId: string,
  facts: UserMemoryFacts,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('user_memories')
    .upsert(
      { user_id: userId, facts, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
}

export async function getSessionSummary(
  sessionId: string,
): Promise<ConversationSummaryRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('conversation_summaries')
    .select('summary, message_count')
    .eq('session_id', sessionId)
    .single();

  if (!data) return null;

  return data as ConversationSummaryRow;
}

export async function upsertSessionSummary(
  userId: string,
  sessionId: string,
  summary: string,
  messageCount: number,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('conversation_summaries')
    .upsert(
      {
        session_id: sessionId,
        user_id: userId,
        summary,
        message_count: messageCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'session_id' }
    );

  if (error) throw error;
}

// ─── Extraction Prompts ──────────────────────────────────────────────────────

const EXTRACTION_SYSTEM_PROMPT = `You are a memory extraction engine for a will planning assistant.
Analyze the conversation exchange and extract factual information the user has revealed.

RULES:
1. Extract ONLY facts explicitly stated by the user. Never infer or assume.
2. Return a JSON object with two keys: "facts" and "summary".
3. "facts" should contain ONLY fields with NEW or UPDATED information. Return {} if nothing new.
4. For array fields (children, assets, dependents, specific_bequests), return the COMPLETE updated array merged with existing data.
5. Keep values concise and factual.
6. Never include the assistant's suggestions as user facts.
7. "summary" should be null if not requested, or a concise paragraph (100-200 words) summarizing the conversation so far.

AVAILABLE FACT FIELDS:
- name (string), age (number), nationality, country_of_residence, religion
- marital_status ("single"|"married"|"divorced"|"widowed"), spouse_name
- children (array of {name, age?, notes?})
- dependents (array of {name, relationship, notes?})
- assets (array of {type, description, location?})
- has_existing_will (boolean), existing_will_details
- preferred_executor, preferred_guardian
- specific_bequests (array of {beneficiary, asset})
- charitable_wishes, islamic_faraid_applicable (boolean)
- primary_concerns (string array), planning_goals, preferred_language

Return ONLY valid JSON. No explanation, no markdown, no code fences.`;

function buildExtractionPrompt(
  existingFacts: UserMemoryFacts | null,
  existingSummary: string | null,
  userMessage: string,
  assistantMessage: string,
  shouldUpdateSummary: boolean,
): string {
  const parts: string[] = [];

  if (existingFacts && Object.keys(existingFacts).length > 0) {
    parts.push(`EXISTING MEMORY (merge arrays, update changed scalars):\n${JSON.stringify(existingFacts)}`);
  }

  if (shouldUpdateSummary && existingSummary) {
    parts.push(`EXISTING SUMMARY (extend, don't repeat):\n${existingSummary}`);
  }

  parts.push(`USER MESSAGE:\n${userMessage}`);
  parts.push(`ASSISTANT RESPONSE:\n${assistantMessage}`);

  if (shouldUpdateSummary) {
    parts.push('TASK: Extract new facts AND provide an updated conversation summary.');
  } else {
    parts.push('TASK: Extract new facts only. Set "summary" to null.');
  }

  return parts.join('\n\n');
}

// ─── Extraction Logic ────────────────────────────────────────────────────────

/** Whitelist of valid keys for UserMemoryFacts — reject anything else */
const VALID_FACT_KEYS = new Set<keyof UserMemoryFacts>([
  'name', 'age', 'nationality', 'country_of_residence', 'religion',
  'marital_status', 'spouse_name', 'children', 'dependents', 'assets',
  'has_existing_will', 'existing_will_details', 'preferred_executor',
  'preferred_guardian', 'specific_bequests', 'charitable_wishes',
  'islamic_faraid_applicable', 'primary_concerns', 'planning_goals',
  'preferred_language',
]);

interface ExtractionResult {
  facts: Partial<UserMemoryFacts>;
  summary: string | null;
}

/** Validate and sanitize individual fact values by type */
function validateFactValue(key: keyof UserMemoryFacts, value: unknown): unknown {
  switch (key) {
    case 'name':
    case 'nationality':
    case 'country_of_residence':
    case 'religion':
    case 'marital_status':
    case 'spouse_name':
    case 'existing_will_details':
    case 'preferred_executor':
    case 'preferred_guardian':
    case 'charitable_wishes':
    case 'planning_goals':
    case 'preferred_language':
      return typeof value === 'string' ? value.slice(0, 500) : undefined;

    case 'age':
      return typeof value === 'number' && Number.isFinite(value) && value > 0 && value < 200
        ? value : undefined;

    case 'has_existing_will':
    case 'islamic_faraid_applicable':
      return typeof value === 'boolean' ? value : undefined;

    case 'primary_concerns':
      if (!Array.isArray(value)) return undefined;
      return value
        .filter((v): v is string => typeof v === 'string')
        .map(v => v.slice(0, 500))
        .slice(0, 20);

    case 'children':
      if (!Array.isArray(value)) return undefined;
      return value
        .filter((v): v is Record<string, unknown> => typeof v === 'object' && v !== null && typeof v.name === 'string')
        .map(v => ({
          name: String(v.name).slice(0, 200),
          age: typeof v.age === 'number' && Number.isFinite(v.age) ? v.age : undefined,
          notes: typeof v.notes === 'string' ? v.notes.slice(0, 500) : undefined,
        }))
        .slice(0, 30);

    case 'dependents':
      if (!Array.isArray(value)) return undefined;
      return value
        .filter((v): v is Record<string, unknown> =>
          typeof v === 'object' && v !== null && typeof v.name === 'string' && typeof v.relationship === 'string')
        .map(v => ({
          name: String(v.name).slice(0, 200),
          relationship: String(v.relationship).slice(0, 200),
          notes: typeof v.notes === 'string' ? v.notes.slice(0, 500) : undefined,
        }))
        .slice(0, 30);

    case 'assets':
      if (!Array.isArray(value)) return undefined;
      return value
        .filter((v): v is Record<string, unknown> =>
          typeof v === 'object' && v !== null && typeof v.type === 'string' && typeof v.description === 'string')
        .map(v => ({
          type: String(v.type).slice(0, 200),
          description: String(v.description).slice(0, 500),
          location: typeof v.location === 'string' ? v.location.slice(0, 200) : undefined,
        }))
        .slice(0, 50);

    case 'specific_bequests':
      if (!Array.isArray(value)) return undefined;
      return value
        .filter((v): v is Record<string, unknown> =>
          typeof v === 'object' && v !== null && typeof v.beneficiary === 'string' && typeof v.asset === 'string')
        .map(v => ({
          beneficiary: String(v.beneficiary).slice(0, 200),
          asset: String(v.asset).slice(0, 500),
        }))
        .slice(0, 50);

    default:
      return undefined;
  }
}

function parseExtractionResponse(text: string): ExtractionResult {
  try {
    const cleaned = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.facts || typeof parsed.facts !== 'object') {
      return { facts: {}, summary: typeof parsed.summary === 'string' ? parsed.summary : null };
    }

    const safeFacts: Partial<UserMemoryFacts> = {};
    for (const [key, value] of Object.entries(parsed.facts)) {
      if (!VALID_FACT_KEYS.has(key as keyof UserMemoryFacts) || value === undefined || value === null) {
        continue;
      }
      const validated = validateFactValue(key as keyof UserMemoryFacts, value);
      if (validated !== undefined) {
        (safeFacts as Record<string, unknown>)[key] = validated;
      }
    }

    return {
      facts: safeFacts,
      summary: typeof parsed.summary === 'string' ? parsed.summary.slice(0, 2000) : null,
    };
  } catch {
    console.warn('Failed to parse memory extraction response');
    return { facts: {}, summary: null };
  }
}

export function mergeFacts(
  existing: UserMemoryFacts | null,
  extracted: Partial<UserMemoryFacts>,
): UserMemoryFacts {
  if (!existing) return extracted as UserMemoryFacts;
  if (Object.keys(extracted).length === 0) return existing;

  const merged = { ...existing };

  for (const [key, value] of Object.entries(extracted)) {
    if (value === undefined || value === null) continue;
    if (!VALID_FACT_KEYS.has(key as keyof UserMemoryFacts)) continue;
    (merged as Record<string, unknown>)[key] = value;
  }

  return merged;
}

export async function extractAndSaveMemory(
  model: LanguageModel,
  userId: string,
  sessionId: string,
  userMessage: string,
  assistantMessage: string,
  existingMemory: UserMemoryFacts | null,
  summaryData: ConversationSummaryRow | null,
) {
  
  const currentMessageCount = (summaryData?.message_count ?? 0) + 2;
  const shouldUpdateSummary = currentMessageCount >= 4 && currentMessageCount % 4 < 2;

  const prompt = buildExtractionPrompt(
    existingMemory,
    summaryData?.summary ?? null,
    userMessage,
    assistantMessage,
    shouldUpdateSummary,
  );

  const { text } = await generateText({
    model,
    system: EXTRACTION_SYSTEM_PROMPT,
    prompt,
    maxOutputTokens: 512,
  });

  const { facts, summary } = parseExtractionResponse(text);

  if (Object.keys(facts).length > 0) {
    const merged = mergeFacts(existingMemory, facts);
    await upsertUserMemory(userId, merged);
  }

  if (summary) {
    await upsertSessionSummary(userId, sessionId, summary, currentMessageCount);
  } else {
    await upsertSessionSummary(
      userId,
      sessionId,
      summaryData?.summary ?? '',
      currentMessageCount,
    );
  }
}

// ─── Prompt Formatting ───────────────────────────────────────────────────────

function sanitizeForPrompt(value: string): string {
  return value
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/[═─]/g, '-')
    .slice(0, 500);
}

export function formatMemoryForPrompt(
  facts: UserMemoryFacts | null,
  summary: string | null,
): string {
  if (!facts && !summary) return '';

  const lines: string[] = [];

  lines.push('═══════════════════════════════════════════');
  lines.push('USER CONTEXT (from previous conversations)');
  lines.push('═══════════════════════════════════════════');

  if (facts && Object.keys(facts).length > 0) {
    lines.push('The user has shared the following about themselves:');

    if (facts.name) lines.push(`- Name: ${sanitizeForPrompt(facts.name)}`);
    if (facts.age) lines.push(`- Age: ${facts.age}`);
    if (facts.nationality) lines.push(`- Nationality: ${sanitizeForPrompt(facts.nationality)}`);
    if (facts.country_of_residence) lines.push(`- Country of Residence: ${sanitizeForPrompt(facts.country_of_residence)}`);
    if (facts.religion) lines.push(`- Religion: ${sanitizeForPrompt(facts.religion)}`);
    if (facts.marital_status) lines.push(`- Marital Status: ${sanitizeForPrompt(facts.marital_status)}`);
    if (facts.spouse_name) lines.push(`- Spouse: ${sanitizeForPrompt(facts.spouse_name)}`);

    if (facts.children?.length) {
      const childList = facts.children
        .map(c => `${sanitizeForPrompt(c.name)}${c.age ? ` (age ${c.age})` : ''}${c.notes ? ` - ${sanitizeForPrompt(c.notes)}` : ''}`)
        .join(', ');
      lines.push(`- Children: ${childList}`);
    }

    if (facts.dependents?.length) {
      const depList = facts.dependents
        .map(d => `${sanitizeForPrompt(d.name)} (${sanitizeForPrompt(d.relationship)})${d.notes ? ` - ${sanitizeForPrompt(d.notes)}` : ''}`)
        .join(', ');
      lines.push(`- Dependents: ${depList}`);
    }

    if (facts.assets?.length) {
      const assetList = facts.assets
        .map(a => `${sanitizeForPrompt(a.type)}: ${sanitizeForPrompt(a.description)}${a.location ? ` (${sanitizeForPrompt(a.location)})` : ''}`)
        .join('; ');
      lines.push(`- Assets: ${assetList}`);
    }

    if (facts.has_existing_will !== undefined) {
      lines.push(`- Has Existing Will: ${facts.has_existing_will ? 'Yes' : 'No'}`);
    }
    if (facts.existing_will_details) lines.push(`- Existing Will Details: ${sanitizeForPrompt(facts.existing_will_details)}`);
    if (facts.preferred_executor) lines.push(`- Preferred Executor: ${sanitizeForPrompt(facts.preferred_executor)}`);
    if (facts.preferred_guardian) lines.push(`- Preferred Guardian: ${sanitizeForPrompt(facts.preferred_guardian)}`);

    if (facts.specific_bequests?.length) {
      const bequestList = facts.specific_bequests
        .map(b => `${sanitizeForPrompt(b.asset)} to ${sanitizeForPrompt(b.beneficiary)}`)
        .join('; ');
      lines.push(`- Specific Bequests: ${bequestList}`);
    }

    if (facts.charitable_wishes) lines.push(`- Charitable Wishes: ${sanitizeForPrompt(facts.charitable_wishes)}`);
    if (facts.islamic_faraid_applicable !== undefined) {
      lines.push(`- Islamic Faraid Applicable: ${facts.islamic_faraid_applicable ? 'Yes' : 'No'}`);
    }

    if (facts.primary_concerns?.length) {
      lines.push(`- Primary Concerns: ${facts.primary_concerns.map(sanitizeForPrompt).join(', ')}`);
    }
    if (facts.planning_goals) lines.push(`- Planning Goals: ${sanitizeForPrompt(facts.planning_goals)}`);
    if (facts.preferred_language) lines.push(`- Preferred Language: ${sanitizeForPrompt(facts.preferred_language)}`);
  }

  if (summary) {
    lines.push('');
    lines.push('CONVERSATION SUMMARY (current session):');
    lines.push(summary.replace(/[═─]/g, '-').slice(0, 2000));
  }

  lines.push('');
  lines.push('Use this context naturally in your responses. Reference it when relevant but do not recite it back unless asked.');

  return '\n' + lines.join('\n') + '\n';
}

