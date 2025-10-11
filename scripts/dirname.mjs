import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const wd = path.resolve(__dirname, '..');
export const dumpsPath = path.resolve(wd, 'cli_output');
export const CLI_CACHE = path.resolve(dumpsPath, 'cli_cache.json');

if (!fs.existsSync(dumpsPath)) {
  fs.mkdirSync(dumpsPath);
}
