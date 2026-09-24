/**
 * Build check: translation completeness across ko/en/ja.
 * Any key present in one dictionary but missing in another fails the build.
 * Runs via `npm run check:i18n` and in CI before `npm run build`.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '..', 'src', 'i18n');

function loadKeys(file) {
  const path = resolve(src, file);
  const source = readFileSync(path, 'utf8');
  // Parse the flat string-keyed object literal via Node's module system by
  // compiling a tiny ESM-safe wrapper instead of evaluating the file (the
  // files import types only, which would break at runtime).
  const keys = new Set();
  const regex = /^\s{2}'([^']+)'\s*:/gm;
  let match;
  while ((match = regex.exec(source)) !== null) keys.add(match[1]);
  return keys;
}

const ko = loadKeys('ko.ts');
const en = loadKeys('en.ts');
const ja = loadKeys('ja.ts');

let failed = false;
function report(name, missing, extra) {
  if (missing.length) {
    failed = true;
    console.error(`[i18n] ${name} is missing ${missing.length} key(s):`);
    missing.forEach((k) => console.error(`  - ${k}`));
  }
  if (extra.length) {
    failed = true;
    console.error(`[i18n] ${name} has ${extra.length} extra key(s) not in ko:`);
    extra.forEach((k) => console.error(`  - ${k}`));
  }
}

report('en', [...ko].filter((k) => !en.has(k)), [...en].filter((k) => !ko.has(k)));
report('ja', [...ko].filter((k) => !ja.has(k)), [...ja].filter((k) => !ko.has(k)));

const total = ko.size;
if (failed) {
  console.error(`[i18n] FAIL — ko has ${total} keys.`);
  process.exit(1);
} else {
  console.log(`[i18n] OK — ${total} keys complete in ko, en, ja.`);
}
