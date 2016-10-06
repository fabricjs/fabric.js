#!/usr/bin/env node

var saucie = require('saucie');
var pidFile = 'sc_client.pid';

var opts = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  verbose: true,
  logger: console.log,
  pidfile: pidFile
};

if (process.env.TRAVIS_JOB_NUMBER) {
  opts.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
}

saucie.connect(opts).then(function () {
  process.exit();
});
