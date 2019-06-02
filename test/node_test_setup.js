// set the fabric famework as a global for tests
var chalk = require('chalk');
global.fabric = require('../dist/fabric').fabric;
global.pixelmatch = require('pixelmatch');
global.fs = require('fs');
global.visualCallback = {
  addArguments: function() {},
};
global.visualTestLoop = require('./lib/visualTestLoop').visualTestLoop;
global.getFixture = require('./lib/visualTestLoop').getFixture;
global.getAsset = require('./lib/visualTestLoop').getAsset;
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
QUnit.config.hidePassed = true;

var jsdom = require('jsdom');

// make a jsdom version for tests that does not spam too much.
class CustomResourceLoader extends jsdom.ResourceLoader {
  fetch(url, options) {
    return super.fetch(url, options).catch(e => {
      throw new Error('JSDOM FETCH CATCHED');
    });
  }
}

var jsdom = require('jsdom');
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
