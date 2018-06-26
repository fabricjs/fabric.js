(function(global) {
  var pixelmatch = global.pixelmatch;
  var canvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, width: 600, height: 600});
  var pixelmatchOptions = {
    includeAA: true,
    threshold: 0.05,
  }

  function getAsset(filename) {
    var finalName = './assets/' + filename + '.svg';
    return fabric.isLikelyNode ? (__dirname + finalName) : getAbsolutePath(finalName);
  }

  function getGolden(filename) {
    var finalName = './golden/' + filename + '.png';
    return fabric.isLikelyNode ? (__dirname + finalName) : getAbsolutePath(finalName);
  }

  // main function
  function loadAndPrepareCanvasFor(filename, callback) {

  }

  QUnit.module('Simple svg import test', {
    afterEach: function() {
    }
  });

  [
    'svg_stroke_1',
    'svg_stroke_2',
    'svg_stroke_3',
    'svg_stroke_4',
    'svg_stroke_5',
    'svg_stroke_6',
    'svg_stroke_7',
    'svg_stroke_8',
  ].forEach(function(filename) {
    QUnit.test('Import test for file ' + filename, function(assert) {
      var done = assert.async();
      loadAndPrepareCanvasFor(filename, function(imageDataCanvas, imageDataGolden, width, height, output) {
        var totalPixels = width * height;
        var differentPixels = pixelmatch(imageDataCanvas, imageDataGolden, output, width, height, pixelmatchOptions);
        assert.ok(differentPixels < totalPixels * 0.005, 'Image ' + filename + ' has too many different pixels ' + totalPixels);
        done();
      });
    });
  });
})(global);
