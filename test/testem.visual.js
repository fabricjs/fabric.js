const chalk = require('chalk');
const config = require('./testem.config');
const { startGoldensServer } = require('./GoldensServer');

const reportPath = process.env.REPORT_FILE || 'cli_output/test_results/visual.txt';
console.log(chalk.bold(chalk.blue(`running visual test suite`)));
console.log(chalk.gray(`reporting results to ${reportPath}`));

module.exports = {
  ...config,
  visual: true,
  report_file: reportPath,
  src_files: [
    'test/lib/visualTestLoop.mjs',
    'test/lib/visualCallbackQunit.mjs',
    ...(process.env.TEST_FILES ? process.env.TEST_FILES.split(',') : ['test/visual/*.js', 'test/visual/*.mjs'])
  ],
  // "before_tests": "webpack --config webpack.testem.config.js",
  // "on_exit": "rm browserified.js",
  routes: {
    ...config.routes,
    '/golden_maker': 'test/lib/goldenMaker.html',
    '/golden_maker.html': 'test/lib/goldenMaker.html',
    '/golden': 'test/visual/golden',
    '/assets': 'test/visual/assets',
    '/visualCallback': 'cli_output/test/lib/visualCallbackQunit.js'
  },
  launchers: {
    Node: {
      command: process.env.NODE_CMD || 'qunit test/node_test_setup.js test/lib test/visual',
      protocol: 'tap'
    }
  },
  proxies: {
    '/goldens': {
      target: startGoldensServer().url,
      secure: false
    }
  },
  qunit: {
    ...config.qunit,
    recreate: Number(process.env.QUNIT_RECREATE_VISUAL_REFS) || false,
    debug: Number(process.env.QUNIT_DEBUG_VISUAL_TESTS) || false,
  },
}
