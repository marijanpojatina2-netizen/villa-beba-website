#!/usr/bin/env node
// Generates 1200×630 opengraph-image.jpg files into the right App Router
// locations so Next.js's file-based metadata convention auto-wires them.
// Run once whenever hero images change: `node scripts/generate-og-images.mjs`
//
// Output: src/app/[locale]/<route>/opengraph-image.jpg
// (home goes to src/app/[locale]/opengraph-image.jpg)

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUB = resolve(ROOT, 'public');
const APP = resolve(ROOT, 'src/app/[locale]');

// route folder under [locale] → source image (relative to public/)
// 'home' uses [locale]/ root (no subfolder)
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

let ok = 0, fail = 0;
for (const [slug, rel] of Object.entries(map)) {
  const src = resolve(PUB, rel);
  const dstDir = slug === 'home' ? APP : resolve(APP, slug);
  const dst = resolve(dstDir, 'opengraph-image.jpg');
  try {
    await mkdir(dstDir, { recursive: true });
    await sharp(src)
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(dst);
    console.log(`✓ ${slug}: ${dst.replace(ROOT, '')}`);
    ok++;
  } catch (err) {
    console.error(`✗ ${slug} failed: ${err.message}`);
    fail++;
  }
}
console.log(`\nDone. ${ok} ok, ${fail} failed.`);
