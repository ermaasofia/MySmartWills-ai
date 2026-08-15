#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const sourcePath = path.resolve(__dirname, '../src/lib/extract-facts.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
});

const moduleExports = { exports: {} };
const wrapper = new Function('require', 'module', 'exports', outputText);
wrapper(require, moduleExports, moduleExports.exports);
const { extractFactsFromMessage } = moduleExports.exports;

const cases = [
  {
    name: 'captures full English name and birthdate with Chinese separator',
    input: 'My name is John Doe. Birthdate is 1990-01-01. Phone: 123456789',
    expected: {
      user_name: 'John Doe',
      birthdate: '1990-01-01',
      phone: '123456789',
    },
  },
  {
    name: 'captures Chinese fields with “是” and full name',
    input: '我的名字叫张三，出生日期是1990-01-01，电话是123456789',
    expected: {
      user_name: '张三',
      birthdate: '1990-01-01',
      phone: '123456789',
    },
  },
];

let passed = 0;
for (const testCase of cases) {
  const result = extractFactsFromMessage(testCase.input);
  const actual = {
    user_name: result.user_name ?? null,
    birthdate: result.birthdate ?? null,
    phone: result.phone ?? null,
  };
  const ok = JSON.stringify(actual) === JSON.stringify(testCase.expected);
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${testCase.name}`);
  if (!ok) {
    console.log('  expected:', testCase.expected);
    console.log('  actual:  ', actual);
  } else {
    passed += 1;
  }
}

if (passed !== cases.length) {
  process.exit(1);
}
