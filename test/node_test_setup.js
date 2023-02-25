require('source-map-support/register');
require('./lib/assert');

// TODO remove block and dependency when node 14 fades out
// node 14 AbortController polyfill for tests
if (!global.AbortController) {
  require("abort-controller/polyfill");
}

global.isNode = () => true;

global.TEST_CONFIG = {
  CI: !!process.env.CI,
  visual: {
    recreate: !process.env.CI & Number(process.env.QUNIT_RECREATE_VISUAL_REFS),
    debug: !process.env.CI & Number(process.env.QUNIT_DEBUG_VISUAL_TESTS),
  }
};


global.fabric = require('../dist/index.node.cjs');
global.pixelmatch = require('pixelmatch');
global.fs = require('fs');
global.visualCallback = {
  addArguments: function() {},
};
global.visualTestLoop = require('./lib/visualTestLoop').visualTestLoop;
global.compareGoldensTest = require('./lib/visualTestLoop').compareGoldensTest;
global.getFixture = require('./lib/visualTestLoop').getFixture;
global.getAsset = require('./lib/visualTestLoop').getAsset;
global.getAssetName = require('./lib/visualTestLoop').getAssetName;
global.simulateEvent = require('./lib/event.simulate').simulateEvent;

QUnit.config.filter = process.env.QUNIT_FILTER;
QUnit.config.testTimeout = process.env.CI ? 15000 : 5000;
QUnit.config.noglobals = true;
QUnit.config.hidepassed = true;

//  global error handling

process.on('uncaughtExceptionMonitor', (err, origin) => {
  QUnit.onUncaughtException(err);
});

process.on('unhandledRejection', (reason, promise) => {
  QUnit.onUncaughtException(reason);
});

// JSDOM catches errors and throws them to the window

fabric.getWindow().addEventListener('unhandledrejection', (event) => {
  // prevent logging to console
  event.preventDefault();
  QUnit.onUncaughtException(event.reason);
});

fabric.getWindow().addEventListener('error', (event) => {
  // prevent logging to console
  event.preventDefault();
  QUnit.onUncaughtException(event.error);
});
