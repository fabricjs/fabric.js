const config = require('./testem.config');

module.exports = {
  ...config,
  serve_files: [
    ...config.serve_files,
    'test/lib/event.simulate.js',
    ...(process.env.TEST_FILES?.split(',') || ['test/unit/*.js'])
  ],
  launchers: {
    Node: {
      command: process.env.NODE_CMD || 'qunit test/node_test_setup.js test/lib test/unit',
      protocol: 'tap'
    }
  },
}