#!/usr/bin/env node
// Generates 1200×630 OG cards from hero images. Run once whenever hero
// imagery changes: `node scripts/generate-og-images.mjs`
//
// Output: public/og/<route>.jpg (one per page).
//
// Why public/og/ and NOT app/[locale]/.../opengraph-image.jpg:
// Next 16 + Vercel hit an "Invariant: failed to find source route" error
// when static OG image files live inside dynamic segments like [locale].
// Serving from /public is the safe path. Each page references via
// metadata.openGraph.images explicitly.

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUB = resolve(ROOT, 'public');
const OUT = resolve(PUB, 'og');

// route slug → source image (relative to public/)
const map = {
  home: 'images/ballena/ballena-42.jpg',
  'villa-ballena': 'images/ballena/ballena-38.jpg',
  'villa-beluga': 'images/beluga/beluga-36.jpg',
  'complex-beba': 'images/beluga/beluga-42.jpg',
  weddings: 'images/ballena/ballena-35-1.jpg',
  'corporate-retreats': 'images/ballena/ballena-33.jpg',
  experiences: 'images/beluga/beluga-13.jpg',
  pricing: 'images/ballena/ballena-36.jpg',
  gallery: 'images/koridor/img_5216.jpg',
  about: 'images/ballena/ballena-35-1.jpg',
  contact: 'images/ballena/ballena-36.jpg',
  faq: 'images/ballena/ballena-33.jpg',
  blog: 'images/beluga/beluga-42.jpg',
};

await mkdir(OUT, { recursive: true });

let ok = 0, fail = 0;
for (const [slug, rel] of Object.entries(map)) {
  const src = resolve(PUB, rel);
  const dst = resolve(OUT, `${slug}.jpg`);
  try {
    await sharp(src)
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 85, progressive: true, mozjpeg: true })
      .toFile(dst);
    console.log(`✓ ${slug}.jpg ← ${rel}`);
    ok++;
  } catch (err) {
    console.error(`✗ ${slug}.jpg failed: ${err.message}`);
    fail++;
  }
}
console.log(`\nDone. ${ok} ok, ${fail} failed.`);
