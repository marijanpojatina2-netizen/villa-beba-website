#!/usr/bin/env node
// BLOCK any Edit/Write that introduces an uppercase image path under /images/.
// Linux Vercel is case-sensitive; Windows local FS isn't. We've already
// burned twice on this — see memory/case_sensitivity_gotcha.md.

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

if (!newContent || typeof newContent !== 'string') process.exit(0);

const imagePathRe = /['"]\/images\/[a-z]+\/([^'"]+\.(jpg|jpeg|png|webp|avif|gif))['"]/gi;
const violations = [];

for (const m of newContent.matchAll(imagePathRe)) {
  if (/[A-Z]/.test(m[1])) {
    violations.push(m[0]);
  }
}

if (violations.length > 0) {
  console.error(
    `❌ BLOCKED: ${violations.length} uppercase image path(s) — Linux Vercel case-sensitive, Windows local isn't. Lowercase the filename(s):\n  ${violations.join('\n  ')}\n\nThis hook is here because we've burned twice already (Rovinj.jpg, IMG_*.jpg).`,
  );
  process.exit(1);
}

process.exit(0);
