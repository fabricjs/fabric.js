
const path = require('path');
const config = require('../testem.benchmarks');

const entry = path.relative(process.cwd(), __dirname);

module.exports = {
  ...config,
  name: 'Quantity',
  description: 'Drawing 150 randomly positioned, randomly colored and randomly rotated circles, rectangles and triangles.',
  serve_files: [
    ...config.serve_files,
    'test/benchmarks/TestContext.js',
    `${entry}/qunit.js`,
    `${entry}/index.js`,
  ],
  routes: {
    '/benchmark': `${entry}/index.mustache`,
    '/assets': `${entry}/assets`
  },
}