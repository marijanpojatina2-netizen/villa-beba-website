#!/usr/bin/env node
// Pre-Edit/Write hook: warn (don't block) when an <Image> alt looks weak.
// Reads tool input as JSON on stdin per Claude Code hook protocol.

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

const imageJsxRe = /<Image[^>]*alt=(?:"([^"]*)"|\{[^}]*\})/g;
const weakAlts = [];

for (const m of newContent.matchAll(imageJsxRe)) {
  const alt = m[1];
  if (alt === undefined) continue;
  if (alt.trim().length < 8) {
    weakAlts.push(alt || '<empty>');
  }
}

if (weakAlts.length > 0) {
  console.error(
    `⚠️ SEO: ${weakAlts.length} <Image alt="..."> looks weak (≤7 chars or empty): ${JSON.stringify(weakAlts)}. Use descriptive alts (e.g., "Villa Ballena pool at dusk").`,
  );
}

process.exit(0);
