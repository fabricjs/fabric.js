const path = require('path');

/**
 * common config 
 * @see https://github.com/testem/testem/blob/master/docs/config_file.md
 */
module.exports = {
  framework: 'qunit',
  get serve_files() {
    return [
      'dist/fabric.js',
      ...(this.src_files || []).map(file => path.join('build', file).replace(new RegExp(`\\${path.extname(file)}$`), '.js'))
    ];
  },
  renderScriptTag() {
    return (text, render) => {
      const src = render(text);
      switch (path.parse(src).ext) {
        case '.json':
          return `<script src="${src}" type="application/json"></script>`;
        default:
          return `<script src="${src}"></script>`;
      }
    }
  },
  renderTestScriptTag() {
    return (text, render) => {
      const src = render(text);
      console.log( path.join('build', src),src)
      const dist = path.join('build', src).replace(new RegExp(`\\${path.extname(src)}$`), '.js');
      return `<script src="${dist}" type="module"></script>`;
    }
  },
  styles: [
    'test/lib/tests.css'
  ],
  routes: {
    '/fixtures': 'test/fixtures',
    '/main': 'test/tests.mustache',
    '/*': 'build/*'
  },
  test_page: 'main?hidepassed&hideskipped&timeout=60000',
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
  parallel: 4
}