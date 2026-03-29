#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../package.json', import.meta.url), 'utf8');

function findDuplicateKeys(jsonText) {
  const duplicates = [];
  const stack = [];
  let i = 0;

  const skipWhitespace = () => {
    while (i < jsonText.length && /\s/.test(jsonText[i])) i += 1;
  };

  const parseString = () => {
    const start = i;
    i += 1; // opening quote
    let value = '';
    while (i < jsonText.length) {
      const ch = jsonText[i];
      if (ch === '\\') {
        value += ch;
        i += 1;
        if (i < jsonText.length) {
          value += jsonText[i];
          i += 1;
        }
        continue;
      }
      if (ch === '"') {
        i += 1;
        return { value, line: jsonText.slice(0, start).split('\n').length };
      }
      value += ch;
      i += 1;
    }
    throw new Error('Unterminated string in package.json');
  };

  while (i < jsonText.length) {
    const ch = jsonText[i];

    if (ch === '"') {
      const { value: key, line } = parseString();
      skipWhitespace();

      if (jsonText[i] === ':' && stack.length > 0 && stack.at(-1)?.type === 'object') {
        const currentObject = stack.at(-1);
        if (currentObject.keys.has(key)) {
          duplicates.push({ key, line });
        } else {
          currentObject.keys.add(key);
        }
      }

      continue;
    }

    if (ch === '{') {
      stack.push({ type: 'object', keys: new Set() });
      i += 1;
      continue;
    }

    if (ch === '[') {
      stack.push({ type: 'array' });
      i += 1;
      continue;
    }

    if (ch === '}' || ch === ']') {
      stack.pop();
      i += 1;
      continue;
    }

    i += 1;
  }

  return duplicates;
}

JSON.parse(source);

const duplicates = findDuplicateKeys(source);

if (duplicates.length > 0) {
  for (const duplicate of duplicates) {
    console.error(`Duplicate key "${duplicate.key}" at line ${duplicate.line}`);
  }
  process.exit(1);
}

console.log('package.json is valid and has no duplicate keys');
