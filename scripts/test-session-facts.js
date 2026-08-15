// Quick test harness for session-facts regex fallback
const samples = [
  {
    name: 'Muslim married with 2 children and executor',
    msgs: [
      'User: I am Muslim and married.',
      'User: I have 2 children.',
      'User: Executor: Ahmad bin Ali',
    ],
  },
  {
    name: 'Non-religious single no dependents',
    msgs: [
      'User: I am not religious.',
      'User: I am single.',
    ],
  },
  {
    name: 'Chinese guardian and one child',
    msgs: [
      'User: 我有一个孩子。',
      'User: 监护人: 王小明',
    ],
  },
];

function extractFromTexts(messages) {
  const joined = messages.join('\n').toLowerCase();
  const result = {};

  if (/\\bmuslim\\b|伊斯兰|穆斯林/.test(joined)) result.religion = 'Muslim';
  else if (/\\bchristian\\b|基督教|基督徒/.test(joined)) result.religion = 'Christian';
  else if (/no religion|non[- ]relig|atheist|不信教|无宗教|非宗教/.test(joined)) result.religion = 'Non-religious';

  if (/\\bmarried\\b|已婚/.test(joined)) result.marital_status = 'Married';
  else if (/\\bsingle\\b|未婚/.test(joined)) result.marital_status = 'Single';
  else if (/divorc|离婚/.test(joined)) result.marital_status = 'Divorced';

    const depMatch = joined.match(/(\b\d{1,2}\b)\s*(dependents|children|child|dependant|人|位)/);
  if (depMatch) result.dependents_count = Number(depMatch[1]);

    const execMatch = joined.match(/(?:executor|执行人|执行者|受托人)[:\s]*([^\n\r]{1,60})/i);
  if (execMatch) result.preferred_executor = execMatch[1].trim();
    const guardMatch = joined.match(/(?:guardian|监护人|监护者)[:\s]*([^\n\r]{1,60})/i);
  if (guardMatch) result.preferred_guardian = guardMatch[1].trim();

  return result;
}

for (const s of samples) {
  console.log('---', s.name);
  console.log(extractFromTexts(s.msgs));
}
