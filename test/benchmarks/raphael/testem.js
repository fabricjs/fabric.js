module.exports = {
  framework: 'qunit',
  serve_files: [
    'https://cdn.jsdelivr.net/gh/DmitryBaranovskiy/raphael@latest/raphael.min.js',
    'dist/fabric.js',
    'test/benchmarks/raphael/init.js',
    'test/benchmarks/raphael/qunit.js',
  ],
  css_files: [
    'test/benchmarks/styles.css'
  ],
  routes: {
    '/benchmark': 'test/benchmarks/raphael/index.mustache',
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