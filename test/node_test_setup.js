require('source-map-support/register');
require('./lib/assert');
// set the fabric framework as a global for tests
var chalk = require('chalk');
var diff = require('deep-object-diff').diff;
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


global.fabric = require('../dist/fabric').fabric;
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
global.imageDataToChalk = function(imageData) {
  // actually this does not work on travis-ci, so commenting it out
  return '';
  var block = String.fromCharCode(9608);
  var data = imageData.data;
  var width = imageData.width;
  var height = imageData.height;
  var outputString = '';
  var cp = 0;
  for (var i = 0; i < height; i++) {
    outputString += '\n';
    for (var j = 0; j < width; j++) {
      cp = (i * width + j) * 4;
      outputString += chalk.rgb(data[cp], data[cp + 1], data[cp + 2])(block);
    }
  }
  return outputString;
};
QUnit.config.testTimeout = 15000;
QUnit.config.noglobals = true;
QUnit.config.hidepassed = true;

var jsdom = require('jsdom');

// make a jsdom version for tests that does not spam too much.
class CustomResourceLoader extends jsdom.ResourceLoader {
  fetch(url, options) {
    return super.fetch(url, options).catch(e => {
      console.log('JSDOM CATCHED FETCHING', url);
      throw new Error('JSDOM FETCH CATCHED');
    });
  }
}

var virtualWindow = new jsdom.JSDOM(
  decodeURIComponent('%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'),
  {
    features: {
      FetchExternalResources: ['img']
    },
    resources: new CustomResourceLoader(),
  }).window;
fabric.document = virtualWindow.document;
fabric.jsdomImplForWrapper = require('jsdom/lib/jsdom/living/generated/utils').implForWrapper;
fabric.nodeCanvas = require('jsdom/lib/jsdom/utils').Canvas;
fabric.window = virtualWindow;
DOMParser = fabric.window.DOMParser;


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