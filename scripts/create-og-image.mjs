import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';

const SOURCE = 'public/images/ballena/ballena-42.jpg';
const OUTPUT_EN = 'src/app/[locale]/opengraph-image.jpg';

// Ensure output directory exists
await mkdir(dirname(OUTPUT_EN), { recursive: true });

// Create 1200x630 OG image (crop from center)
await sharp(SOURCE)
  .resize(1200, 630, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 85, progressive: true })
  .toFile(OUTPUT_EN);

console.log(`Created OG image: ${OUTPUT_EN}`);
