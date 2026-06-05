import fs from 'node:fs';
import path from 'node:path';
import { wd } from './dirname.mjs';

const roots = [path.resolve(wd, 'dist'), path.resolve(wd, 'dist-extensions')];

const packagesDir = path.resolve(wd, 'packages');

if (fs.existsSync(packagesDir)) {
  for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      roots.push(path.resolve(packagesDir, entry.name, 'dist'));
    }
  }
}

for (const dir of roots) {
  const relative = path.relative(wd, dir) || '.';
  if (fs.existsSync(dir)) {
    console.log(`[clean-dist] Removing ${relative}`);
    fs.rmSync(dir, { recursive: true, force: true });
  } else {
    console.log(`[clean-dist] Skipping ${relative} (not found)`);
  }
}

console.log('[clean-dist] Done.');
