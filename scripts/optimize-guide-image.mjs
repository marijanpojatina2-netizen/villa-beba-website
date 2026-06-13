// Convert a single source photo into a guide-ready WebP.
//
// Guide heroes and inline images follow one convention: WebP, max 1920px wide
// (never upscaled), quality 82 — the same recipe behind the truffle-hunting
// guide images. The bulk scripts (optimize-images.mjs / compress-images.mjs)
// only emit JPEG over the whole tree, so per-guide art needs this.
//
// Usage:
//   node scripts/optimize-guide-image.mjs <input> <output.webp> [maxWidth=1920] [quality=82]
//
// Prints the final { width, height, bytes } as JSON on the last line so the
// caller can paste exact dimensions into the GuideImage entry (next/image needs
// width/height to reserve layout space and avoid CLS).
import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import { dirname } from 'path';

const [, , input, output, maxWidthArg, qualityArg] = process.argv;

if (!input || !output) {
  console.error('Usage: node scripts/optimize-guide-image.mjs <input> <output.webp> [maxWidth=1920] [quality=82]');
  process.exit(1);
}

const MAX_WIDTH = Number(maxWidthArg) || 1920;
const QUALITY = Number(qualityArg) || 82;

await mkdir(dirname(output), { recursive: true });

const before = (await stat(input)).size;

// .rotate() with no args bakes in EXIF orientation before we resize — WebP does
// not carry the orientation tag, so phone photos would otherwise ship sideways.
const pipeline = sharp(input)
  .rotate()
  .resize(MAX_WIDTH, null, { withoutEnlargement: true })
  .webp({ quality: QUALITY });

const info = await pipeline.toFile(output);

console.log(
  `OK ${input} -> ${output}: ${(before / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB (${info.width}x${info.height})`
);
console.log(JSON.stringify({ width: info.width, height: info.height, bytes: info.size }));
