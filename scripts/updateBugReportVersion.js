const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

const TAG = '<!-- CI_REPLACE_VERSION -->';
const file = path.resolve(__dirname, '..', '.github/ISSUE_TEMPLATE/bug_report.md');
const content = fs.readFileSync(file).toString();
fs.writeFileSync(file, content.replace(new RegExp(`${TAG}.*${TAG}`), `${TAG}${version}${TAG}`));
