const config = require('../testem.benchmarks');

module.exports = {
  ...config,
  serve_files: [
    ...config.serve_files,
    'https://cdn.jsdelivr.net/gh/DmitryBaranovskiy/raphael@latest/raphael.min.js',
    'test/benchmarks/TestContext.js',
    'test/benchmarks/raphael/init.js',
    'test/benchmarks/raphael/qunit.js',
  ],
  routes: {
    '/benchmark': 'test/benchmarks/raphael/index.mustache',
  },
}