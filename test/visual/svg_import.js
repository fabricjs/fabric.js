(function(global) {
  var fs = global.fs;
  var pixelmatch = global.pixelmatch;
  var fabricCanvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, renderOnAddRemove: false});
  var pixelmatchOptions = {
    includeAA: true,
    threshold: 0.05,
  };

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) { return path; };
    var imgEl = fabric.document.createElement('img');
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  function getAsset(filename) {
    var finalName = '/assets/' + filename + '.svg';
    if (fabric.isLikelyNode) {
      var path = (__dirname + finalName);
      return fs.readFileSync(path, { encoding: 'utf8' });
    } else {

    }
  }

  function getGolden(filename) {
    var finalName = '/golden/' + filename + '.png';
    return fabric.isLikelyNode ? (__dirname + finalName) : getAbsolutePath(finalName);
  }

  function getGoldenImage(filename, callback) {
    var img = fabric.document.createElement('img');
    img.onload = function() {
      callback(img);
    };
    img.onerror = function(err) {
      console.log('Image loading errored', err);
    };
    img.src = getGolden(filename);
  }

  // main function
  function loadAndPrepareCanvasFor(filename, callback) {
    getGoldenImage(filename, function(img) {
      var canvas = fabric.document.createElement('canvas');
      var width = canvas.width = img.width;
      var height = canvas.height = img.height;
      fabricCanvas.setDimensions({
        width: width,
        height: height
      });
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      var goldenImageData = ctx.getImageData(0, 0, width, height).data;
      ctx.clearRect(0, 0, width, height);
      var outputImageData = ctx.getImageData(0, 0, width, height).data;
      fabric.loadSVGFromString(getAsset(filename), function(objects) {
        fabricCanvas.add.apply(fabricCanvas, objects);
        fabricCanvas.renderAll();
        var fabricImageData = fabricCanvas.contextContainer.getImageData(0, 0, width, height).data;
        callback(fabricImageData, goldenImageData, width, height, outputImageData);
      });
    });
  }

  QUnit.module('Simple svg import test', {
    afterEach: function() {
      fabricCanvas.clear();
      fabricCanvas.renderAll();
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
        var percentage = 0.01;
        var differentPixels = pixelmatch(imageDataCanvas, imageDataGolden, output, width, height, pixelmatchOptions);
        assert.ok(differentPixels < totalPixels * percentage, 'Image ' + filename + ' has too many different pixels ' + differentPixels + ' representing ' + differentPixels / totalPixels * 100 + '%');
        done();
      });
    });
  });
})(global);
