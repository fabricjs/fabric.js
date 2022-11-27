const chalk = require('chalk');
const config = require('./testem.config');

const reportPath = process.env.REPORT_DIR;
console.log(chalk.bold(chalk.blue(`running unit test suite`)));
console.log(chalk.gray(`reporting results to ${reportPath}`));

module.exports = {
  ...config,
  report_dir: reportPath,
  serve_files: [
    ...config.serve_files,
    'test/lib/event.simulate.js',
    ...(process.env.TEST_FILES ? process.env.TEST_FILES.split(',') : ['test/unit/*.js'])
  ],
  launchers: {
    Node: {
      command: process.env.NODE_CMD || 'qunit test/testSetup.node.js test/lib test/unit',
      protocol: 'tap'
    }
  },
}
