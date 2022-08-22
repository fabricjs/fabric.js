const config = require('../testem');
const path = require('path');
const { readFileSync } = require('fs');

const entry = path.relative(process.cwd(), __dirname);

const STEPS = [10, 100, 500, 1000, 2000, 5000];

module.exports = {
  ...config,
  name: 'Simple Shape',
  serve_files: [
    ...config.serve_files,
    `${entry}/common.js`,
    `${entry}/raphael.js`,
    `${entry}/fabric.js`,
  ],
  routes: {
    ...config.routes,
    '/asset': `${entry}/pug.jpg`
  },
  test_page: [
    ...config.test_page,
    ...STEPS.map(n => `benchmark?n=${n}`),
    ...STEPS.map(n => `benchmark?n=${n}&optimize_caching=1`)
  ],
  pre: readFileSync(path.resolve(__dirname, './header.html')).toString()
}