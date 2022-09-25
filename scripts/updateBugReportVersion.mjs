import fs from 'fs';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'path';
import YAML from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.resolve(__dirname, '..', '.github/ISSUE_TEMPLATE/bug_report.yml');
const id = 'version';
const packageName = 'fabric';
const content = YAML.load(fs.readFileSync(file).toString());
const found = content.body.find(entry => entry.id === id && entry.type === 'dropdown');
const tags = JSON.parse(cp.execSync(`npm view ${packageName} versions --json`).toString()).reverse();
found.attributes.options = tags;
fs.writeFileSync(file, YAML.dump(content));
