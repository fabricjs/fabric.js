
/**
 * common config 
 * @see https://github.com/testem/testem/blob/master/docs/config_file.md
 */
module.exports = {
  framework: 'qunit',
  serve_files: [
    'dist/fabric.js'
  ],
  styles: [
    'test/lib/tests.css'
  ],
  routes: {
    '/fixtures': 'test/fixtures',
    '/main': 'test/tests.mustache'
  },
  test_page: 'main',
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
    'Node',
    'Firefox'
  ],
  launch_in_ci: [
    'Chrome',
    'Node',
    'Firefox'
  ],
  tap_failed_tests_only: !Number(process.env.VERBOSE) || false,
  ignore_missing_launchers: false,
  qunit: {
    filter: process.env.QUNIT_FILTER || null,
  },
  timeout: 540,
  browser_start_timeout: 60,
  browser_disconnect_timeout: 60,
  // since we are storing test results we don't want them to get messed up by concurrent runs
  parallel: 1,
  // https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
  CI: process.env.CI || false
}