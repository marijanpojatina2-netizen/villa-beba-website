// scripts/db-setup.mjs
// One-time schema setup: DATABASE_URL=... node scripts/db-setup.mjs
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set. Get it from the Neon dashboard (Vercel > Storage).');
  process.exit(1);
}

const schemaPath = join(dirname(fileURLToPath(import.meta.url)), 'checkin-schema.sql');
const ddl = readFileSync(schemaPath, 'utf8');
const sql = neon(url);

// Split on ';' at end of statement — schema file has no procedural SQL.
const statements = ddl.split(/;\s*(?:\n|$)/).map((s) => s.trim()).filter(Boolean);
for (const stmt of statements) {
  await sql.query(stmt);
  console.log('OK:', stmt.split('\n')[0]);
}
console.log('Schema ready.');
