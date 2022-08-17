
const path = require('path');

const entry = path.relative(process.cwd(), __dirname);

module.exports = {
  framework: 'qunit',
  name: 'Animation',
  serve_files: [
    'dist/fabric.js',
    `${entry}/qunit.js`,
    `${entry}/index.js`,
  ],
  css_files: [
    'test/benchmarks/styles.css'
  ],
  routes: {
    '/benchmark': `${entry}/index.mustache`,
    '/assets': `${entry}/assets`
  },
  test_page: [
    'benchmark'
  ],
  browser_args: {
    Chrome: [
      '--headless',
      '--disable-gpu',
      '--remote-debugging-port=9222'
    ],
    Firefox: [
      '--headless'
    ]
  },
  launch_in_dev: [
    'Chrome',
    'Firefox'
  ],
  launch_in_ci: [
    'Chrome',
    'Firefox'
  ],
  ignore_missing_launchers: true,
  timeout: 540,
  parallel: 4
}