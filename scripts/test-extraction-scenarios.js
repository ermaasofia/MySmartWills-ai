#!/usr/bin/env node

/**
 * Test extraction logic for different chat scenarios
 * Simulates the /api/chat/session-facts backend extraction
 */

// Mock regex extraction (matches regex fallback in route.ts)
function extractByRegex(messages) {
  // Keep original for Chinese pattern matching, also create lowercase for English
  const fullText = messages.map(m => m.content).join('\n');
  const joined = fullText.toLowerCase();
  const result = {};

  // Religion
  if (/\bmuslim\b|伊斯兰|穆斯林/.test(joined)) result.religion = 'Muslim';
  else if (/\bchristian\b|基督教|基督徒/.test(joined)) result.religion = 'Christian';
  else if (/(?:\bnot\s+)?(?:religious|relig)\b|no\s+religion|non[- ]?religious|atheist|不信教|无宗教|非宗教/.test(joined)) {
    // Check for "not religious" or "non-religious" - prefer that over just finding "religious"
    if (/\b(?:not|no|non[- ]?)?religious\b/.test(joined) && /\bnot\s+religious\b|non[- ]?religious|no\s+religion|atheist|不信教|无宗教|非宗教/.test(joined)) {
      result.religion = 'Non-religious';
    }
  }

  // Marital status
  if (/\bmarried\b|已婚/.test(joined)) result.marital_status = 'Married';
  else if (/\bsingle\b|未婚/.test(joined)) result.marital_status = 'Single';
  else if (/\bdivorc|离婚/.test(joined)) result.marital_status = 'Divorced';

  // Dependents count
  // Match either: "2 children", "2 kids", "2 people" OR "3个孩子", "3人" etc
  const depMatch = joined.match(/(\d{1,2})\s*(?:dependents|children|child|kids?|people|person|个孩子|人|位)/);
  if (depMatch) result.dependents_count = Number(depMatch[1]);

  // Executor / Guardian: use name extraction - try to get just the name part
  // Pattern: "executor: name" or "executor is name" or similar
  const execMatch = joined.match(/executor\b[:\s]+(?:is\s+)?([a-z\u4e00-\u9fff\s\-]{1,40}?)(?:\.|$|,|\band\b)/i);
  if (execMatch) {
    const name = execMatch[1].trim().split(/\band\b/)[0].trim();
    if (name.length > 1) result.preferred_executor = name;
  }

  const guardMatch = joined.match(/guardian\b[:\s]+(?:is\s+)?([a-z\u4e00-\u9fff\s\-]{1,40}?)(?:\.|$|,|\band\b)/i);
  if (guardMatch) {
    const name = guardMatch[1].trim().split(/\band\b/)[0].trim();
    if (name.length > 1) result.preferred_guardian = name;
  }

  return result;
}

// Test scenarios
const scenarios = [
  {
    name: '✅ Empty Session (No Messages)',
    messages: [],
    expected: {},
  },
  {
    name: '✅ Simple Info: Muslim, Married, 1 child',
    messages: [
      { content: 'I am Muslim and married with 1 child' },
    ],
    expected: {
      religion: 'Muslim',
      marital_status: 'Married',
      dependents_count: 1,
    },
  },
  {
    name: '✅ Executor Named: Ahmad bin Ali',
    messages: [
      { content: 'My executor is Ahmad bin Ali' },
    ],
    expected: {
      preferred_executor: 'ahmad bin ali',
    },
  },
  {
    name: '✅ Multiple Info: Christian, Divorced, 2 children, executor is my brother',
    messages: [
      { content: 'I am Christian and divorced with 2 children' },
      { content: 'My executor is Ahmad' },
    ],
    expected: {
      religion: 'Christian',
      marital_status: 'Divorced',
      dependents_count: 2,
      preferred_executor: 'ahmad',
    },
  },
  {
    name: '✅ Chinese: 穆斯林，已婚，3个孩子',
    messages: [
      { content: '我是穆斯林，已婚，有3个孩子' },
    ],
    expected: {
      religion: 'Muslim',
      marital_status: 'Married',
      dependents_count: 3,
    },
  },
  {
    name: '✅ Guardian Specified',
    messages: [
      { content: 'My guardian is Raj Kumar' },
    ],
    expected: {
      preferred_guardian: 'raj kumar',
    },
  },
  {
    name: '✅ Non-religious',
    messages: [
      { content: 'I am not religious and single with no dependents' },
    ],
    expected: {
      religion: 'Non-religious',
      marital_status: 'Single',
    },
  },
  {
    name: '❌ Incomplete Info (Only religion mentioned)',
    messages: [
      { content: 'I follow the Muslim faith' },
    ],
    expected: {
      religion: 'Muslim',
      // No marital_status, dependents_count, executor, guardian
    },
  },
  {
    name: '❌ No Matching Info',
    messages: [
      { content: 'Tell me about will planning in Malaysia' },
    ],
    expected: {},
  },
];

console.log('\n' + '='.repeat(80));
console.log('SESSION EXTRACTION TESTS (Regex Fallback Path)');
console.log('='.repeat(80) + '\n');

let passed = 0;
let failed = 0;

scenarios.forEach((scenario, idx) => {
  console.log(`\nTest ${idx + 1}: ${scenario.name}`);
  console.log('-'.repeat(80));

  const result = extractByRegex(scenario.messages);
  const resultStr = JSON.stringify(result, null, 2);
  const expectedStr = JSON.stringify(scenario.expected, null, 2);

  const match = JSON.stringify(result) === JSON.stringify(scenario.expected);

  if (match) {
    console.log('✅ PASS');
    passed++;
  } else {
    console.log('❌ FAIL');
    console.log('\nMessages:');
    scenario.messages.forEach(m => console.log(`  "${m.content}"`));
    console.log('\nExpected:', expectedStr);
    console.log('Got:', resultStr);
    failed++;
  }
});

console.log('\n' + '='.repeat(80));
console.log(`Summary: ${passed} passed, ${failed} failed (Total: ${passed + failed})`);
console.log('='.repeat(80) + '\n');

process.exit(failed > 0 ? 1 : 0);
