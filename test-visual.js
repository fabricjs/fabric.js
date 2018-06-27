var testrunner = require('node-qunit');

testrunner.options.log.summary = true;
testrunner.options.log.tests = false;
testrunner.options.log.assertions = false;
testrunner.options.log.coverage = false;

testrunner.options.coverage = true;
testrunner.options.maxBlockDuration = 120000;

testrunner.run({
  deps: './test/fixtures/test_script.js',
  code: './dist/fabric.js',
  tests: [
    './test/visual/svg_import.js',
  ],
  // tests: ['./test/unit/object_clipPath.js',],
}, function(err, report) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  if(report.failed > 0){
    process.on('exit', function() {
      process.exit(1);
    });
  }
});
