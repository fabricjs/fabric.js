module.exports = {
  framework: 'qunit',
  serve_files: [
    'https://cdn.jsdelivr.net/gh/DmitryBaranovskiy/raphael@latest/raphael.min.js',
    'dist/fabric.js',
  ],
  css_files: [
    'test/benchmarks/styles.css'
  ],
  routes: {
    '/raphael': 'test/benchmarks/raphael',
  },
  test_page: [
    'main'
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