import chalk from 'chalk';
import { startGoldensServer } from './GoldensServer.mjs';

// https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
const CI = !!process.env.CI
const BROWSERS = process.env.BROWSERS ? process.env.BROWSERS.split(/,| /g) : ['chrome', 'firefox'];
const TEST_FILES = process.env.TEST_FILES ? process.env.TEST_FILES.split(/,| /g) : null;
const VISUAL_TEST_CONFIG = {
  recreate: Number(process.env.QUNIT_RECREATE_VISUAL_REFS),
  debug: Number(process.env.QUNIT_DEBUG_VISUAL_TESTS),
};

/** 
 * http://karma-runner.github.io/6.4/config/configuration-file.html
 * https://github.com/tom-sherman/blog/blob/main/posts/02-running-jest-tests-in-a-browser.md
 * @param {*} config 
 */
export default async function (config) {
  const browsers = (CI ?
    ['ChromeCI', 'FirefoxCI'] :
    [...(!VISUAL_TEST_CONFIG.debug && !VISUAL_TEST_CONFIG.recreate ? ['ChromeCI', 'FirefoxCI'] : []), 'Chrome', 'Firefox'])
    .filter(browser => BROWSERS.some(b => browser.toLowerCase().startsWith(b)));
  if (VISUAL_TEST_CONFIG.debug || VISUAL_TEST_CONFIG.recreate) {
    if (browsers.length > 1) {
      console.warn(chalk.yellow(`Debugging/recreating visual tests is allowed ONLY when running tests in a single browser`));
    }
    if (CI) {
      throw new Error(chalk.red(`Debugging/recreating visual refs is banned in CI`));
    }
  }
  if (browsers.length === 0) {
    throw new Error(`no browsers to launch, input: ${BROWSERS}`);
  }
  
  config.set({
    plugins: [
      'karma-jasmine',
      'karma-qunit',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-coverage',
      'karma-spec-reporter'
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',
    autoWatch: false,
    singleRun: true,
    pingTimeout: 10000,
    browserDisconnectTimeout: 10000,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [/*'jasmine',*/ 'qunit'],
    browsers,
    customLaunchers: {
      ChromeCI: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions',
          '--remote-debugging-port=9222',
        ],
      },
      FirefoxCI: {
        base: 'Firefox'
      }
    },

    reporters: ['spec', 'coverage'],
    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: '.nyc_output/',
          subdir: (browser) => browser.split(/-| /)[0].toLowerCase()
        },
        {
          type: 'json',
          dir: '.nyc_output/',
          subdir: (browser) => browser.split(/-| /)[0].toLowerCase()
        }
      ]
    },

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'test/fixtures/**/*', included: false, served: true, watched: false, nocache: false },
      { pattern: 'test/lib/*.js', included: true, served: true, watched: true, nocache: false },
      { pattern: 'test/lib/tests.css', included: true, served: true, watched: true, nocache: false }, // qunit only
      { pattern: 'test/visual/golden/**/*', included: false, served: true, watched: false, nocache: false },
      { pattern: 'test/visual/assets/**/*', included: false, served: true, watched: false, nocache: false },

      { pattern: 'dist/index.js', type: 'js', included: true, served: true, watched: true, nocache: true },
      { pattern: 'dist/index.js.map', included: false, served: true, watched: false, nocache: true },

      { pattern: 'test/karma.setup.js', type: 'js', included: true, served: true, watched: true, nocache: false },

      // add test files last
      ...(TEST_FILES ?
        TEST_FILES.map(file => ({ pattern: file, type: 'js', included: true, served: true, watched: true, nocache: false })) :
        [
          process.env.TEST_SUITE === 'unit' && { pattern: 'test/unit/**/*.js', type: 'js', included: true, served: true, watched: true, nocache: false },
          process.env.TEST_SUITE === 'visual' && { pattern: 'test/visual/**/*.js', type: 'js', included: true, served: true, watched: true, nocache: false },
        ].filter((exists) => exists)
      )
    ],

    /**
     * https://github.com/karma-runner/karma/issues/2917#issuecomment-496473358
     */
    proxies: {
      '/fixtures/': '/base/test/fixtures/',
      '/golden_maker': '/base/test/lib/goldenMaker.html',
      '/golden_maker.html': '/base/test/lib/goldenMaker.html',
      '/golden/': '/base/test/visual/golden/',
      '/assets/': '/base/test/visual/assets/',
      '/goldens/': startGoldensServer().url,
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // 'test/**/*.js': ['rollup'],
      'dist/index.js': ['coverage'],
    },

    /**
     * Object available on the client in `window.__karma__.config`
     */
    client: {
      clearContext: false,
      CI: !!CI,
      visual: {
        recreate: browsers.length === 1 && !CI && VISUAL_TEST_CONFIG.recreate,
        debug: browsers.length === 1 && !CI && VISUAL_TEST_CONFIG.debug,
      },
      /**
       * QUnit client config
       * https://github.com/karma-runner/karma-qunit
       */
      qunit: {
        showUI: true,
        testTimeout: CI ? 15000 : 10000,
        filter: process.env.QUNIT_FILTER || '',
        reorder: false,
        noglobals: true,
        hidepassed: true,
      }
    }
  });
}
