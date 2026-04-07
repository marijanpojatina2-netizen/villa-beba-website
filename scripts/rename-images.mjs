// Image Rename Script
// Renames all images: lowercase, hyphens instead of spaces, remove "Copy of " prefix
// Then updates all code references in src/ ts and tsx files

import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public/images');
const SRC_DIR = path.resolve('src');

function sanitizeFilename(name) {
  return name
    .replace(/^Copy of /i, '')       // Remove "Copy of " prefix
    .replace(/š/g, 's')              // Replace diacritics
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/ž/g, 'z')
    .replace(/đ/g, 'd')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, '-')            // Spaces to hyphens
    .replace(/-+/g, '-')             // Multiple hyphens to single
    .toLowerCase();
}

function sanitizeDirname(name) {
  return name
    .replace(/š/g, 's')
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/ž/g, 'z')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

// Collect all files and build rename map
const renameMap = new Map(); // old web path -> new web path

function scanDir(dir, webPrefix) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const oldPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const newDirName = sanitizeDirname(entry.name);
      const newDirPath = path.join(dir, newDirName);
      const newWebPrefix = `${webPrefix}/${newDirName}`;

      if (entry.name !== newDirName) {
        // Rename directory
        if (!fs.existsSync(newDirPath)) {
          fs.renameSync(oldPath, newDirPath);
          console.log(`DIR: ${entry.name} -> ${newDirName}`);
        }
        scanDir(newDirPath, newWebPrefix);
      } else {
        scanDir(oldPath, `${webPrefix}/${entry.name}`);
      }
    } else if (entry.name.match(/\.(jpg|jpeg|png|webp|gif|svg|ico)$/i)) {
      const newName = sanitizeFilename(entry.name);
      const oldWebPath = `${webPrefix}/${entry.name}`;
      const newWebPath = `${webPrefix}/${newName}`;

      if (entry.name !== newName) {
        const newFilePath = path.join(path.dirname(oldPath), newName);
        // Handle case where dir was already renamed
        const actualOldPath = fs.existsSync(oldPath) ? oldPath : null;
        if (actualOldPath) {
          fs.renameSync(actualOldPath, newFilePath);
        }
        renameMap.set(oldWebPath, newWebPath);
        console.log(`FILE: ${oldWebPath} -> ${newWebPath}`);
      }
    }
  }
}

// Step 1: Rename directories first (bottom-up to avoid conflicts)
function renameDirsBottomUp(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name);
      renameDirsBottomUp(subDir); // recurse first

      const newDirName = sanitizeDirname(entry.name);
      if (entry.name !== newDirName) {
        const newDirPath = path.join(dir, newDirName);
        if (!fs.existsSync(newDirPath)) {
          fs.renameSync(subDir, newDirPath);
          console.log(`DIR RENAME: ${entry.name} -> ${newDirName}`);
        } else {
          // Merge: move files from old dir to new dir
          const files = fs.readdirSync(subDir);
          for (const f of files) {
            const src = path.join(subDir, f);
            const dest = path.join(newDirPath, f);
            if (!fs.existsSync(dest)) {
              fs.renameSync(src, dest);
            }
          }
          fs.rmSync(subDir, { recursive: true, force: true });
          console.log(`DIR MERGE: ${entry.name} -> ${newDirName}`);
        }
      }
    }
  }
}

// Step 2: Build web path mappings for ALL files (before rename)
function buildMappings(dir, webPrefix, mappings) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      buildMappings(path.join(dir, entry.name), `${webPrefix}/${entry.name}`, mappings);
    } else if (entry.name.match(/\.(jpg|jpeg|png|webp|gif|svg|ico)$/i)) {
      const newName = sanitizeFilename(entry.name);
      if (entry.name !== newName) {
        const oldWebPath = `${webPrefix}/${entry.name}`;
        const newWebPath = `${webPrefix}/${newName}`;
        mappings.push({ oldWeb: oldWebPath, newWeb: newWebPath, dir, oldName: entry.name, newName });
      }
    }
  }
}

// Step 3: Rename all files
function renameFiles(mappings) {
  for (const m of mappings) {
    const oldPath = path.join(m.dir, m.oldName);
    const newPath = path.join(m.dir, m.newName);
    if (fs.existsSync(oldPath) && oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`  ${m.oldName} -> ${m.newName}`);
    }
  }
}

// Step 4: Update all code references
function updateCodeReferences(mappings) {
  const codeFiles = [];

  function findCodeFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        findCodeFiles(path.join(dir, entry.name));
      } else if (entry.name.match(/\.(ts|tsx|js|jsx|json)$/)) {
        codeFiles.push(path.join(dir, entry.name));
      }
    }
  }

  findCodeFiles(SRC_DIR);

  let totalReplacements = 0;

  for (const file of codeFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    for (const m of mappings) {
      if (content.includes(m.oldWeb)) {
        content = content.split(m.oldWeb).join(m.newWeb);
        modified = true;
        totalReplacements++;
      }
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`  Updated: ${path.relative(process.cwd(), file)}`);
    }
  }

  console.log(`\nTotal code replacements: ${totalReplacements}`);
}

// Execute
console.log('=== Step 1: Renaming directories ===');
renameDirsBottomUp(PUBLIC_DIR);

console.log('\n=== Step 2: Building file mappings ===');
const mappings = [];
buildMappings(PUBLIC_DIR, '/images', mappings);
console.log(`Found ${mappings.length} files to rename`);

// Also build directory-level web path mappings
// After dir renames, the web paths in code that reference old dir names need updating too
const dirMappings = [];
// Check if Bijela/Plava dirs were renamed
if (fs.existsSync(path.join(PUBLIC_DIR, 'koridor', 'bijela'))) {
  dirMappings.push({ oldWeb: '/images/koridor/Bijela/', newWeb: '/images/koridor/bijela/' });
  dirMappings.push({ oldWeb: '/images/koridor/Plava/', newWeb: '/images/koridor/plava/' });
}

console.log('\n=== Step 3: Renaming files ===');
renameFiles(mappings);

console.log('\n=== Step 4: Updating code references ===');
// Combine dir mappings and file mappings for code updates
// Dir mappings must be applied first (they affect path prefixes)
const allMappings = [...dirMappings, ...mappings];
updateCodeReferences(allMappings);

console.log('\n=== Done! ===');
console.log(`Renamed ${mappings.length} files`);
console.log(`Updated directory references: ${dirMappings.length}`);
