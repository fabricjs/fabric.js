var testrunner = require('qunit');

testrunner.options.log.summary = false;
testrunner.options.log.tests = false;
testrunner.options.log.assertions = false;

testrunner.run({
    code: "./dist/all.js",
    tests: [
      './site/test/unit/rect.js',
      './site/test/unit/ellipse.js',
      './site/test/unit/color.js',
      './site/test/unit/circle.js',
      './site/test/unit/line.js',
      './site/test/unit/polyline.js',
      './site/test/unit/polygon.js',
      './site/test/unit/path.js',
      './site/test/unit/path_group.js',
      './site/test/unit/observable.js',
      './site/test/unit/object.js',
      './site/test/unit/text.js',
      './site/test/unit/util.js',
      './site/test/unit/image.js',
      './site/test/unit/group.js',
      './site/test/unit/parser.js',
      './site/test/unit/canvas.js',
      './site/test/unit/canvas_static.js'
    ]
}, function(err, report) {
  if (err) {
    console.log(err);
  }
});