#!/usr/bin/env node

var saucie = require('saucie');
var pidFile = 'sc_client.pid';

saucie.disconnect(pidFile);
