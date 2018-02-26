// set the fabric famework as a global for tests
global.fabric = require('../dist/fabric').fabric;

QUnit.config.testTimeout = 10000;
QUnit.config.noglobals = true;
