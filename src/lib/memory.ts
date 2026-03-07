import { SupabaseClient } from '@supabase/supabase-js';
import { generateText, type LanguageModel } from 'ai';
import type { UserMemoryFacts, ConversationSummaryRow } from '@/types/memory';

// ─── DB Helpers ──────────────────────────────────────────────────────────────

export async function getUserMemory(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserMemoryFacts | null> {
  const { data } = await supabase
    .from('user_memories')
    .select('facts')
    .eq('user_id', userId)
    .single();

  if (!data) return null;
  return data.facts as UserMemoryFacts;
}

export async function upsertUserMemory(
  supabase: SupabaseClient,
  userId: string,
  facts: UserMemoryFacts,
) {
  const { error } = await supabase
    .from('user_memories')
    .upsert({ user_id: userId, facts }, { onConflict: 'user_id' });

  if (error) console.error('Failed to upsert user memory:', error.message);
}

export async function getSessionSummary(
  supabase: SupabaseClient,
  sessionId: string,
): Promise<ConversationSummaryRow | null> {
  const { data } = await supabase
    .from('conversation_summaries')
    .select('summary, message_count')
    .eq('session_id', sessionId)
    .single();

  if (!data) return null;
  return data as ConversationSummaryRow;
}

export async function upsertSessionSummary(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  summary: string,
  messageCount: number,
) {
  const { error } = await supabase
    .from('conversation_summaries')
    .upsert(
      { session_id: sessionId, user_id: userId, summary, message_count: messageCount },
      { onConflict: 'session_id' },
    );

  if (error) console.error('Failed to upsert session summary:', error.message);
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

interface ExtractionResult {
  facts: Partial<UserMemoryFacts>;
  summary: string | null;
}

function parseExtractionResponse(text: string): ExtractionResult {
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      facts: parsed.facts && typeof parsed.facts === 'object' ? parsed.facts : {},
      summary: typeof parsed.summary === 'string' ? parsed.summary : null,
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
    (merged as Record<string, unknown>)[key] = value;
  }

  return merged;
}

export async function extractAndSaveMemory(
  model: LanguageModel,
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  userMessage: string,
  assistantMessage: string,
  existingMemory: UserMemoryFacts | null,
  summaryData: ConversationSummaryRow | null,
) {
  const currentMessageCount = (summaryData?.message_count ?? 0) + 2; // +2 for user + assistant
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

  // Save facts if new ones were extracted
  if (Object.keys(facts).length > 0) {
    const merged = mergeFacts(existingMemory, facts);
    await upsertUserMemory(supabase, userId, merged);
  }

  // Save summary if updated
  if (summary) {
    await upsertSessionSummary(supabase, userId, sessionId, summary, currentMessageCount);
  } else {
    // Still update message count even if summary wasn't regenerated
    await upsertSessionSummary(
      supabase,
      userId,
      sessionId,
      summaryData?.summary ?? '',
      currentMessageCount,
    );
  }
}

// ─── Prompt Formatting ───────────────────────────────────────────────────────

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

    if (facts.name) lines.push(`- Name: ${facts.name}`);
    if (facts.age) lines.push(`- Age: ${facts.age}`);
    if (facts.nationality) lines.push(`- Nationality: ${facts.nationality}`);
    if (facts.country_of_residence) lines.push(`- Country of Residence: ${facts.country_of_residence}`);
    if (facts.religion) lines.push(`- Religion: ${facts.religion}`);
    if (facts.marital_status) lines.push(`- Marital Status: ${facts.marital_status}`);
    if (facts.spouse_name) lines.push(`- Spouse: ${facts.spouse_name}`);

    if (facts.children?.length) {
      const childList = facts.children
        .map(c => `${c.name}${c.age ? ` (age ${c.age})` : ''}${c.notes ? ` - ${c.notes}` : ''}`)
        .join(', ');
      lines.push(`- Children: ${childList}`);
    }

    if (facts.dependents?.length) {
      const depList = facts.dependents
        .map(d => `${d.name} (${d.relationship})${d.notes ? ` - ${d.notes}` : ''}`)
        .join(', ');
      lines.push(`- Dependents: ${depList}`);
    }

    if (facts.assets?.length) {
      const assetList = facts.assets
        .map(a => `${a.type}: ${a.description}${a.location ? ` (${a.location})` : ''}`)
        .join('; ');
      lines.push(`- Assets: ${assetList}`);
    }

    if (facts.has_existing_will !== undefined) {
      lines.push(`- Has Existing Will: ${facts.has_existing_will ? 'Yes' : 'No'}`);
    }
    if (facts.existing_will_details) lines.push(`- Existing Will Details: ${facts.existing_will_details}`);
    if (facts.preferred_executor) lines.push(`- Preferred Executor: ${facts.preferred_executor}`);
    if (facts.preferred_guardian) lines.push(`- Preferred Guardian: ${facts.preferred_guardian}`);

    if (facts.specific_bequests?.length) {
      const bequestList = facts.specific_bequests
        .map(b => `${b.asset} to ${b.beneficiary}`)
        .join('; ');
      lines.push(`- Specific Bequests: ${bequestList}`);
    }

    if (facts.charitable_wishes) lines.push(`- Charitable Wishes: ${facts.charitable_wishes}`);
    if (facts.islamic_faraid_applicable !== undefined) {
      lines.push(`- Islamic Faraid Applicable: ${facts.islamic_faraid_applicable ? 'Yes' : 'No'}`);
    }

    if (facts.primary_concerns?.length) {
      lines.push(`- Primary Concerns: ${facts.primary_concerns.join(', ')}`);
    }
    if (facts.planning_goals) lines.push(`- Planning Goals: ${facts.planning_goals}`);
    if (facts.preferred_language) lines.push(`- Preferred Language: ${facts.preferred_language}`);
  }

  if (summary) {
    lines.push('');
    lines.push('CONVERSATION SUMMARY (current session):');
    lines.push(summary);
  }

  lines.push('');
  lines.push('Use this context naturally in your responses. Reference it when relevant but do not recite it back unless asked.');

  return '\n' + lines.join('\n') + '\n';
}
