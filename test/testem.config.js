const { default: chalk } = require('chalk');
const { ensureDirSync, writeFileSync, createWriteStream } = require('fs-extra');
const _ = require('lodash');
const TapReporter = require('testem/lib/reporters/tap_reporter');
const { resultString,summaryDisplay } = require('testem/lib/utils/displayutils');

/**
 * https://github.com/testem/testem/blob/master/lib/reporters/tap_reporter.js
 * https://github.com/testem/testem/blob/master/docs/custom_reporter.md
 */
class TapReporterLogger extends TapReporter {
  constructor(silent, out, config) {
    super(silent, out, config);
    this.reportDir = config.get('report_dir');
    ensureDirSync(this.reportDir);
  }
  finish() {
    super.finish();
    const results = _.map(this.results, ({ launcher, result }, index) => ({
      launcher,
      result: {
        ...result,
        log: resultString(result.originalResultObj?.id || index, launcher, result, this.quietLogs, this.strictSpecCompliance)
      }
    }));
    const resultsByLauncher = _.groupBy(results, ({ launcher }) => launcher);
    writeFileSync(`${this.reportDir}/results.json`, JSON.stringify(resultsByLauncher, null, 2));
    _.forEach(resultsByLauncher, (results, launcher) => {
      let passed = 0,
        skipped = 0,
        todo = 0;
      const contextName = launcher.toLowerCase().trim().split(' ')[0];
      const logs = results.map(data => {
        data.result.passed && passed++;
        data.result.skipped && skipped++;
        data.result.todo && todo++;
        return data.result.log;
      }).join('');
      const summary = summaryDisplay.call({
        total: results.length,
        pass: passed,
        skipped,
        todo
      });
      const out = `${logs}\n${summary}`;
      writeFileSync(`${this.reportDir}/${contextName}.txt`, out);
      if (process.env.CI) {
        console.log(`\n\n${chalk.cyan(`${contextName} results:`)}`);
        console.log(out);
      }
    });
  }
}

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
  parallel: 4,
  reporter: TapReporterLogger,
  // https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
  CI: process.env.CI || false,
  // disable hectic logging in CI
  stdout_stream: process.env.CI ? createWriteStream('./cli_output/dump.txt') : process.stdout
}