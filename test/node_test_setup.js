require('source-map-support/register');
require('./lib/assert');
// set the fabric framework as a global for tests
var chalk = require('chalk');
var commander = require('commander');

// TODO remove block and dependency when node 14 fades out
// node 14 AbortController polyfill for tests
if (!global.AbortController) {
  require("abort-controller/polyfill");
}


commander.program
  .option('-d, --debug', 'debug visual tests by overriding refs (golden images) in case of visual changes', false)
  .option('-r, --recreate', 'recreate visual refs (golden images)', false)
  .action(options => {
    QUnit.debug = QUnit.debugVisual = options.debug;
    QUnit.recreateVisualRefs = options.recreate;
  }).parse(process.argv);
//  for now accept an env variable because qunit doesn't allow passing unknown options
QUnit.debugVisual = Number(process.env.QUNIT_DEBUG_VISUAL_TESTS);
QUnit.recreateVisualRefs = Number(process.env.QUNIT_RECREATE_VISUAL_REFS);
QUnit.config.filter = process.env.QUNIT_FILTER;


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

QUnit.config.testTimeout = 15000;
QUnit.config.noglobals = true;
QUnit.config.hidepassed = true;

global.isNode = () => true;

//  QUnit Logging

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
