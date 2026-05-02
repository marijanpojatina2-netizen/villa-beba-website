#!/usr/bin/env node
// Generates 1200×630 OG cards from hero images. Run once whenever
// hero images change: `node scripts/generate-og-images.mjs`
//
// Output strategy:
//   - src/app/opengraph-image.jpg            ← inherited default (from 'home')
//   - public/og/<slug>.jpg                   ← per-route source (13 files)
//
// Why two locations:
//   The Next.js file convention places OG images via folder-segment
//   matching, but a Next 16 + Vercel issue (invariant: failed to find
//   source route for prerender) breaks static OG files inside dynamic
//   segments like [locale]. Until that's resolved, only the root-level
//   default OG image is wired (inherited by all routes).
//
//   The per-route public/og/*.jpg files are kept so a future
//   opengraph-image.tsx route handler (or generateMetadata refactor)
//   can read from them and serve route-specific OG cards.

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUB = resolve(ROOT, 'public');
const APP = resolve(ROOT, 'src/app');
const OG_DIR = resolve(PUB, 'og');

// route slug → source image (relative to public/)
// Mirrors heroImages in src/lib/images.ts
const map = {
  home: 'images/ballena/Ballena 42.jpg',
  'villa-ballena': 'images/ballena/Ballena 38.jpg',
  'villa-beluga': 'images/beluga/Beluga 36.jpg',
  'complex-beba': 'images/beluga/Beluga 42.jpg',
  weddings: 'images/ballena/Ballena 35-1.jpg',
  'corporate-retreats': 'images/ballena/Ballena 33.jpg',
  experiences: 'images/beluga/Beluga 13.jpg',
  pricing: 'images/ballena/Ballena 36.jpg',
  gallery: 'images/koridor/IMG_5216.jpg',
  about: 'images/ballena/Ballena 35-1.jpg',
  contact: 'images/ballena/Ballena 36.jpg',
  faq: 'images/ballena/Ballena 33.jpg',
  blog: 'images/beluga/Beluga 42.jpg',
};

await mkdir(OG_DIR, { recursive: true });

let ok = 0, fail = 0;
for (const [slug, rel] of Object.entries(map)) {
  const src = resolve(PUB, rel);
  const pubDst = resolve(OG_DIR, `${slug}.jpg`);
  try {
    await sharp(src)
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(pubDst);
    console.log(`✓ ${slug}: ${pubDst.replace(ROOT, '')}`);
    ok++;
    // Also write the home image as the inherited app-root default.
    if (slug === 'home') {
      const appDst = resolve(APP, 'opengraph-image.jpg');
      await sharp(src)
        .resize(1200, 630, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(appDst);
      console.log(`✓ home (app-root): ${appDst.replace(ROOT, '')}`);
    }
  } catch (err) {
    console.error(`✗ ${slug} failed: ${err.message}`);
    fail++;
  }
}
console.log(`\nDone. ${ok} ok, ${fail} failed.`);
