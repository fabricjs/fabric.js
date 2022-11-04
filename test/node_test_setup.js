require('source-map-support/register');
require('./fabricSetup.node');

const diff = require('deep-object-diff').diff;
const { visualTestLoop } = require('./lib/visualTestLoop');
const { simulateEvent } = require('./lib/event.simulate');
const { fabric } = require('../dist/fabric');
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

QUnit.debugVisual = Number(process.env.QUNIT_DEBUG_VISUAL_TESTS);
QUnit.recreateVisualRefs = Number(process.env.QUNIT_RECREATE_VISUAL_REFS);
QUnit.config.filter = process.env.QUNIT_FILTER;
QUnit.config.testTimeout = Number(process.env.QUNIT_TIMEOUT);
QUnit.config.noglobals = true;
QUnit.config.hidepassed = true;

//  QUnit Logging

//  global error handling

process.on('uncaughtExceptionMonitor', (err, origin) => {
  QUnit.onUncaughtException(err);
});

process.on('unhandledRejection', (reason, promise) => {
  QUnit.onUncaughtException(reason);
});

// JSDOM catches errors and throws them to the window

fabric.window.addEventListener('unhandledrejection', (event) => {
  // prevent logging to console
  event.preventDefault();
  QUnit.onUncaughtException(event.reason);
});

fabric.window.addEventListener('error', (event) => {
  // prevent logging to console
  event.preventDefault();
  QUnit.onUncaughtException(event.error);
});

//  testID
var objectInit = fabric.Object.prototype.initialize;
var canvasInit = fabric.StaticCanvas.prototype.initialize;
var testID = 0;
fabric.Object.prototype.initialize = function () {
  objectInit.apply(this, arguments);
  this.testID = `${this.type}#${++testID}`;
}
fabric.StaticCanvas.prototype.initialize = function () {
  canvasInit.apply(this, arguments);
  this.testID = `Canvas#${++testID}`;
}

function getLoggingRepresentation(input) {
  return typeof input === 'object' && input && input.testID ?
    input.testID :
    input;
}

//  https://api.qunitjs.com/extension/QUnit.dump.parse/
QUnit.dump.maxDepth = 1;
//  https://github.com/qunitjs/qunit/blob/main/src/assert.js
QUnit.assert.deepEqual = function (actual, expected, message) {
  actual = QUnit.dump.parse(actual);
  expected = QUnit.dump.parse(expected);
  this.pushResult({
    result: QUnit.equiv(actual, expected),
    message: `${message}\ndiff:\n${diff(actual, expected)}`,
    actual,
    expected
  });
};
QUnit.assert.equal = function (actual, expected, message) {
  this.pushResult({
    result: actual == expected,
    actual: getLoggingRepresentation(actual),
    expected: getLoggingRepresentation(expected),
    message
  });
};
QUnit.assert.strictEqual = function (actual, expected, message) {
  this.pushResult({
    result: actual === expected,
    actual: getLoggingRepresentation(actual),
    expected: getLoggingRepresentation(expected),
    message
  });
};
