import sharp from 'sharp';
import { readdir, stat, writeFile, unlink, rename } from 'fs/promises';
import { join, relative, dirname } from 'path';

const INPUT_DIR = 'public/images';
const MAX_WIDTH = 2400;
const QUALITY = 80;

let totalBefore = 0;
let totalAfter = 0;
let processedCount = 0;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath)));
    } else if (/\.jpg$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function compressImage(filePath) {
  try {
    const info = await stat(filePath);
    const beforeSize = info.size;
    totalBefore += beforeSize;
    const beforeMB = (beforeSize / (1024 * 1024)).toFixed(2);

    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;

    // Resize if wider than MAX_WIDTH, preserving aspect ratio
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    // Output as progressive JPEG, quality 80
    const buffer = await pipeline
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toBuffer();

    const afterSize = buffer.length;
    totalAfter += afterSize;
    const afterMB = (afterSize / (1024 * 1024)).toFixed(2);
    const saving = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(1);

    // Write to temp file then replace original
    const dir = dirname(filePath);
    const tempPath = join(dir, `_compress_temp_${Date.now()}.jpg`);
    await writeFile(tempPath, buffer);
    await unlink(filePath);
    await rename(tempPath, filePath);

    processedCount++;
    console.log(
      `[${processedCount}] ${relative(INPUT_DIR, filePath)}: ${beforeMB}MB -> ${afterMB}MB (${saving}% saved) ${metadata.width > MAX_WIDTH ? `[resized ${metadata.width}->${MAX_WIDTH}px]` : ''}`
    );
  } catch (err) {
    console.error(`ERR ${filePath}: ${err.message}`);
  }
}

console.log('Image Compression Script');
console.log('========================');
console.log(`Max width: ${MAX_WIDTH}px | Quality: ${QUALITY} | Progressive JPEG\n`);

const files = await getFiles(INPUT_DIR);
console.log(`Found ${files.length} .jpg files to compress...\n`);

for (const file of files) {
  await compressImage(file);
}

const beforeMB = (totalBefore / (1024 * 1024)).toFixed(1);
const afterMB = (totalAfter / (1024 * 1024)).toFixed(1);
const savedMB = ((totalBefore - totalAfter) / (1024 * 1024)).toFixed(1);
const savedPct = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);

console.log(`\n========================`);
console.log(`TOTAL: ${beforeMB}MB -> ${afterMB}MB (saved ${savedMB}MB / ${savedPct}%)`);
console.log(`Processed ${processedCount} files`);
