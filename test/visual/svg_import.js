(function() {
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  var _pixelMatch;
  var visualCallback;
  var fs;
  if (fabric.isLikelyNode) {
    fs = global.fs;
    _pixelMatch = global.pixelmatch;
    visualCallback = global.visualCallback;
  } else {
    _pixelMatch = pixelmatch;
    if (window) {
      visualCallback = window.visualCallback;
    }
  }
  var fabricCanvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, renderOnAddRemove: false});
  var pixelmatchOptions = {
    includeAA: false,
    threshold: 0.095
  };
  fabric.Object.prototype.objectCaching = false;
  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) { return path; };
    var imgEl = fabric.document.createElement('img');
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  function getAsset(filename, callback) {
    var finalName = '/assets/' + filename + '.svg';
    if (fabric.isLikelyNode) {
      var path = (__dirname + finalName);
      return fs.readFile(path, { encoding: 'utf8' }, callback);
    }
    else {
      var path = getAbsolutePath('/test/visual' + finalName);
      fabric.util.request(path, {
        onComplete: function(xhr) {
          callback(null, xhr.responseText);
        }
      });
    }
  }

  function getGolden(filename) {
    var finalName = '/golden/' + filename + '.png';
    return fabric.isLikelyNode ? (__dirname + finalName) : getAbsolutePath('/test/visual' + finalName);
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
      var outputImageData = ctx.getImageData(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
      var goldenImageData = ctx.getImageData(0, 0, width, height);
      getAsset(filename, function(err, string) {
        fabric.loadSVGFromString(string, function(objects) {
          fabricCanvas.add.apply(fabricCanvas, objects);
          fabricCanvas.renderAll();
          visualCallback.addArguments({
            enabled: true,
            golden: canvas,
            fabric: fabricCanvas.lowerCanvasEl,
            diff: outputImageData
          });
          var fabricImageData = fabricCanvas.contextContainer.getImageData(0, 0, width, height).data;
          callback(fabricImageData, goldenImageData.data, width, height, outputImageData.data);
        });
      });
    });
  }

  QUnit.module('Simple svg import test', {
    beforeEach: function() {
      fabricCanvas.clear();
      fabricCanvas.renderAll();
    }
  });

  [
    ['svg_stroke_1', 0],
    ['svg_stroke_2', 0],
    ['svg_stroke_3', 0],
    ['svg_stroke_4', 8],
    ['svg_stroke_5', 4],
    ['svg_stroke_6', 83],
    ['svg_stroke_7', 0],
    ['svg_stroke_8', 0],
    ['svg_linear_1', 0],
    ['svg_linear_2', 0],
    ['svg_linear_3', 0],
    ['svg_linear_4', 14],
    ['svg_linear_5', 8],
    ['svg_linear_6', 83],
    ['svg_linear_7', 0],
    ['svg_linear_8', 0],
    ['svg_radial_1', 100],
    ['svg_radial_2', 0],
    ['svg_radial_3', 0],
    ['svg_radial_4', 143],
    ['svg_radial_5', 143],
    ['svg_radial_6', 8],
    ['svg_radial_8', 0],
    ['svg_radial_9', 8],
    ['svg_radial_10', 12],
    ['svg_radial_11', 0],
    ['svg_radial_12', 8],
    ['svg_radial_13', 4],
  ].forEach(function(filenameArray) {
    var filename = filenameArray[0];
    var expectedPixels = filenameArray[1];
    QUnit.test('Import test for file ' + filename, function(assert) {
      var done = assert.async();
      loadAndPrepareCanvasFor(filename, function(imageDataCanvas, imageDataGolden, width, height, output) {
        var totalPixels = width * height;
        var percentage = 0.01;
        var differentPixels = _pixelMatch(imageDataCanvas, imageDataGolden, output, width, height, pixelmatchOptions);
        var percDiff = differentPixels / totalPixels * 100;
        assert.ok(differentPixels < totalPixels * percentage, 'Image ' + filename + ' has too many different pixels ' + differentPixels + ' representing ' + percDiff + '%');
        done();
      });
    });
  });
})();
