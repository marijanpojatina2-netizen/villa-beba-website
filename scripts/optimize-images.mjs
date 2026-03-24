import sharp from 'sharp';
import { readdir, stat, rename, writeFile, unlink } from 'fs/promises';
import { join, relative, dirname, basename, extname } from 'path';

const INPUT_DIR = 'public/images';
const MAX_WIDTH = 1920;
const QUALITY = 80;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath)));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  try {
    const info = await stat(filePath);
    const sizeMB = info.size / (1024 * 1024);

    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;

    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    const buffer = await pipeline
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();

    const newSizeMB = buffer.length / (1024 * 1024);

    if (newSizeMB < sizeMB * 0.9) {
      // Write to temp file then replace
      const dir = dirname(filePath);
      const tempPath = join(dir, `_temp_${Date.now()}.jpg`);
      await writeFile(tempPath, buffer);
      await unlink(filePath);
      await rename(tempPath, filePath);
      console.log(`OK ${relative(INPUT_DIR, filePath)}: ${sizeMB.toFixed(1)}MB -> ${newSizeMB.toFixed(1)}MB`);
    } else {
      console.log(`-- ${relative(INPUT_DIR, filePath)}: ${sizeMB.toFixed(1)}MB (skip)`);
    }
  } catch (err) {
    console.error(`ERR ${filePath}: ${err.message}`);
  }
}

const files = await getFiles(INPUT_DIR);
console.log(`Found ${files.length} images to optimize...\n`);

for (const file of files) {
  await optimizeImage(file);
}

const afterSize = await getFiles(INPUT_DIR).then(async (fs) => {
  let total = 0;
  for (const f of fs) { total += (await stat(f)).size; }
  return total;
});
console.log(`\nTotal: ${(afterSize / (1024*1024)).toFixed(0)}MB`);
