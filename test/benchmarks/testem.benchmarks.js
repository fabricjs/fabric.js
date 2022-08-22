const config = require('../testem.config');

module.exports = {
  ...config,
  css_files: [
    'test/benchmarks/styles.css'
  ],
  test_page: [
    'benchmark'
  ],
  launch_in_dev: [
    'Chrome',
    'Firefox'
  ],
  launch_in_ci: [],
}