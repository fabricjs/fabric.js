require('source-map-support/register');
require('./fabricSetup.node');
require('./qunitSetup.node');

const { visualTestLoop } = require('./lib/visualTestLoop');
const { simulateEvent } = require('./lib/event.simulate');
const pixelmatch = require('pixelmatch');

const {
  getAsset,
  getFixture,
  getGolden,
  goldenExists,
  generateGolden,
  dumpResults
} = require('./lib/visualUtil.node');

// TODO remove block and dependency when node 14 fades out
// node 14 AbortController polyfill for tests
if (!global.AbortController) {
  require("abort-controller/polyfill");
}

Object.assign(global, {
  pixelmatch,
  simulateEvent,
  visualTestLoop,
  // running for CI: https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
  CI: process.env.CI,
  RUNNER_ID: process.env.RUNNER_ID || 'node',
  getAsset,
  getFixture,
  getGolden,
  goldenExists,
  generateGolden,
  dumpResults
});


