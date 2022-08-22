
const path = require('path');
const config = require('../testem.benchmarks');

const entry = path.relative(process.cwd(), __dirname);

module.exports = {
  ...config,
  name: 'Animation',
  serve_files: [
    ...config.serve_files,
    `${entry}/qunit.js`,
    `${entry}/index.js`,
  ],
  routes: {
    '/benchmark': `${entry}/index.mustache`,
    '/assets': `${entry}/assets`
  },
}