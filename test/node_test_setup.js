// set the fabric famework as a global for tests
global.fabric = require('../dist/fabric').fabric;
global.pixelmatch = require('pixelmatch');
global.fs = require('fs');
global.visualCallback = {
  addArguments: function() {},
};
QUnit.config.testTimeout = 15000;
QUnit.config.noglobals = true;
QUnit.config.hidePassed = true;
