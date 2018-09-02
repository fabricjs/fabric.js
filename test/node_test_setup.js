// set the fabric famework as a global for tests
var chalk = require('chalk');
global.fabric = require('../dist/fabric').fabric;
global.pixelmatch = require('pixelmatch');
global.fs = require('fs');
global.visualCallback = {
  addArguments: function() {},
};
global.imageDataToChalk = function(imageData) {
  var data = imageData.data;
  var width = imageData.width;
  var height = imageData.height;
  var outputString = '';
  var cp = 0;
  for (var i = 0; i < height; i++) {
    outputString += '\n';
    for (var j = 0; j < width; j++) {
      cp = (i * width + j) * 4;
      outputString += chalk.rgb(data[cp], data[cp + 1], data[cp + 2]).inverse(' ');
    }
  }
  return outputString;
};
QUnit.config.testTimeout = 15000;
QUnit.config.noglobals = true;
QUnit.config.hidePassed = true;
