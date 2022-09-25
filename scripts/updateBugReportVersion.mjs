import fs from 'fs';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'path';
import YAML from 'yaml';
// const { version } = require('../package.json');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.resolve(__dirname, '..', '.github/ISSUE_TEMPLATE/bug_report.yml');
const id = 'version';
const content = YAML.parse(fs.readFileSync(file).toString());
const found = content.body.find(entry => entry.id === id && entry.type === 'dropdown');
const tags = JSON.parse(cp.execSync('npm view fabric versions --json').toString()).reverse();
found.attributes.options = tags
found.attributes.placeholder = tags[0];
fs.writeFileSync(file, YAML.stringify(content));
