#!/usr/bin/env node
// Warn if generateMetadata-emitted title or description exceeds Google's
// truncation thresholds. Best-effort regex (won't catch dynamic templates).

import { readFileSync } from 'node:fs';

let input = '';
try {
  input = readFileSync(0, 'utf-8');
} catch {
  process.exit(0);
}

let data;
try {
  data = JSON.parse(input);
} catch {
  process.exit(0);
}

const newContent =
  data.tool_input?.new_string ||
  data.tool_input?.content ||
  '';

if (!newContent.includes('generateMetadata')) process.exit(0);

const titleRe = /title:\s*['"]([^'"]+)['"]/g;
const descRe = /description:\s*['"]([^'"]+)['"]/g;

const warnings = [];

for (const m of newContent.matchAll(titleRe)) {
  if (m[1].length > 60) warnings.push(`title (${m[1].length} chars): "${m[1].slice(0, 50)}..."`);
}
for (const m of newContent.matchAll(descRe)) {
  if (m[1].length > 160) warnings.push(`description (${m[1].length} chars): "${m[1].slice(0, 50)}..."`);
}

if (warnings.length > 0) {
  console.error(`⚠️ SEO: ${warnings.length} meta string(s) exceed Google truncation:\n  ${warnings.join('\n  ')}`);
}

process.exit(0);
