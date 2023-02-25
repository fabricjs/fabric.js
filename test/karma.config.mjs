import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import ts from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const plugins = [
  json(),
  ts(),
  babel({
    extensions: ['.ts', '.js'],
    babelHelpers: 'bundled',
  }),
  nodeResolve(),
  commonjs({ include: 'node_modules/**' })
];

/**
 * https://github.com/tom-sherman/blog/blob/main/posts/02-running-jest-tests-in-a-browser.md
 * @param {*} config 
 */
export default async function (config) {
  config.set({
    plugins: [
      'karma-jasmine',
      'karma-qunit',
      'karma-rollup-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-coverage',
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // autoWatch: false,

    // singleRun: true,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'qunit'],

    browsers: ['Chrome'],//['ChromeHeadlessX', 'FirefoxHeadless', 'Chrome', 'Firefox'],

    customLaunchers: {
      ChromeHeadlessX: {
        base: 'ChromeHeadless',
        flags: [
          '--headless',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions',
          '--remote-debugging-port=9222',
        ],
      },
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [
          '--headless',
        ],
      },
    },

    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: '.nyc_output/' },
        // Karma uses subdirs by default to account for multiple browsers.
        // For the JSON file, it's important we disable 'subdir' so that
        // the 'nyc report' command can pick this up when combining code
        // coverage with the Node.js test run.
        { type: 'json', dir: '.nyc_output/', subdir: '.' }
      ]
    },

    // list of files / patterns to load in the browser
    // Here I'm including all of the the Jest tests which are all under the __tests__ directory.
    // You may need to tweak this patter to find your test files/
    files: [
      { pattern: 'test/fixtures/*', included: false, served: true, watched: false, nocache: false },
      { pattern: 'test/lib/*.js', included: true, served: true, watched: true, nocache: false },
      { pattern: 'test/lib/tests.css', included: true, served: true, watched: true, nocache: false },

      { pattern: 'dist/index.js', type: 'js', included: true, served: true, watched: true, nocache: true },
      { pattern: 'dist/index.js.map', included: false, served: true, watched: false, nocache: true },

      { pattern: 'test/karma.setup.js', type: 'js', included: true, served: true, watched: true, nocache: false },

      // add test files last
      { pattern: 'test/unit/**/*.js', type: 'js', included: true, served: true, watched: true, nocache: false },
      { pattern: 'test/visual/**/*.js', type: 'js', included: true, served: true, watched: true, nocache: false },
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
      '/goldens/': (await import('./GoldensServer.js')).startGoldensServer().url,
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // './karma.setup.js': ['rollup'],
      // './**/*.js': ['rollup'],
      'dist/index.js': ['coverage'],
    },

    rollupPreprocessor: {
      /**
       * This is just a normal Rollup config object,
       * except that `input` is handled for you.
       */
      plugins,
      output: {
        format: 'umd', // Helps prevent naming collisions.
        name: 'FabricTestSuite', // Required for 'iife' format.
        sourcemap: 'inline', // Sensible for testing.
      },
    },

    /**
     * QUnit client config
     * https://github.com/karma-runner/karma-qunit
     */
    client: {
      // runInParent: true,
      useIframe: false,
      clearContext: false,
      /**
       * QUnit client config
       * https://github.com/karma-runner/karma-qunit
       */
      qunit: {
        showUI: true,
        testTimeout: 15000,
        filter: process.env.QUNIT_FILTER || null,
        recreate: Number(process.env.QUNIT_RECREATE_VISUAL_REFS) || false,
        debug: Number(process.env.QUNIT_DEBUG_VISUAL_TESTS) || false,
        reorder: false,
        noglobals: true,
        hidepassed: true,
        autostart: true,
      }
    }
  });
}
