const chalk = require('chalk');
const config = require('./testem.config');
const { startGoldensServer } = require('./GoldensServer');

const reportPath = process.env.REPORT_DIR;
console.log(chalk.bold(chalk.blue(`running visual test suite`)));
console.log(chalk.gray(`reporting results to ${reportPath}`));

module.exports = {
  ...config,
  visual: true,
  report_dir: reportPath,
  serve_files: [
    ...config.serve_files,
    'test/lib/visualUtil.js',
    'test/lib/visualUtil.browser.js',
    'test/lib/visualTestLoop.js',
    'test/lib/appendTestResults.js',
    ...(process.env.TEST_FILES ? process.env.TEST_FILES.split(',') : ['test/visual/*.js'])
  ],
  routes: {
    ...config.routes,
    '/golden_maker': 'test/lib/goldenMaker.html',
    '/golden_maker.html': 'test/lib/goldenMaker.html',
    '/golden': 'test/visual/golden',
    '/assets': 'test/visual/assets',
    '/results': reportPath
  },
  launchers: {
    Node: {
      command: process.env.NODE_CMD || 'qunit test/testSetup.node.js test/lib test/visual',
      protocol: 'tap'
    }
  },
  proxies: {
    '/goldens': {
      target: startGoldensServer().url,
      secure: false,
    }
  },
  qunit: {
    ...config.qunit,
    recreate: Number(process.env.RECREATE_VISUAL_REFS) || false,
    debug: Number(process.env.DEBUG_VISUAL_TESTS) || false,
    launch: Number(process.env.QUNIT_LAUNCH) || false,
  },
}
