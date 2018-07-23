(function() {
  var _pixelMatch = pixelmatch;
  if (fabric.isLikelyNode) {
    var fs = global.fs;
    _pixelMatch = global.pixelmatch;
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

  function getFixtureName(filename) {
    var finalName = '/../fixtures/' + filename;
    return fabric.isLikelyNode ? (__dirname + finalName) : getAbsolutePath('test/fixtures/' + filename);
  }

  function getGoldeName(filename) {
    var finalName = '/golden/' + filename;
    return fabric.isLikelyNode ? (__dirname + finalName) : getAbsolutePath('test/visual/golden/' + filename);
  }

  function getImage(filename, original, callback) {
    if (fabric.isLikelyNode && original) {
      try {
        fs.statSync(filename);
      }
      catch (err) {
        var dataUrl = original.toDataURL().split(',')[1];
        console.log('creating original for ', filename);
        fs.writeFileSync(filename, dataUrl, { encoding: 'base64' });
      }
    }
    var img = fabric.document.createElement('img');
    img.onload = function() {
      callback(img);
    };
    img.onerror = function(err) {
      console.log('Image loading errored', err);
    };
    img.src = filename;
  }

  QUnit.module('Image resize filter test', {
    afterEach: function() {
      fabricCanvas.setZoom(1);
      fabricCanvas.setDimensions({
        width: 300,
        height: 150,
      });
      fabricCanvas.clear();
      fabricCanvas.renderAll();
    }
  });

  var tests = [];

  function imageResizeTest(canvas, callback) {
    getImage(getFixtureName('parrot.png'), false, function(img) {
      canvas.setDimensions({
        width: 200,
        height: 200,
      });
      var zoom = 8;
      var image = new fabric.Image(img);
      image.resizeFilter = new fabric.Image.filters.Resize({ resizeType: 'lanczos' });
      canvas.setZoom(zoom);
      image.scaleToWidth(canvas.width / zoom);
      canvas.add(image);
      canvas.renderAll();
      callback(canvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'Image resize with canvas zoom',
    code: imageResizeTest,
    golden: 'parrot.png',
  });

  tests.forEach(function(testArray) {
    var testName = testArray.test;
    var code = testArray.code;
    QUnit.test(testName, function(assert) {
      var done = assert.async();
      code(fabricCanvas, function(renderedCanvas) {
        var width = renderedCanvas.width;
        var height = renderedCanvas.height;
        var totalPixels = width * height;
        var percentage = 0.01;
        var imageDataCanvas = renderedCanvas.getContext('2d').getImageData(0, 0, width, height).data;
        var canvas = fabric.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        var output = ctx.getImageData(0, 0, width, height).data;
        getImage(getGoldeName('parrot.png'), renderedCanvas, function(golden) {
          ctx.drawImage(golden, 0, 0);
          var imageDataGolden = ctx.getImageData(0, 0, width, height).data;
          var differentPixels = _pixelMatch(imageDataCanvas, imageDataGolden, output, width, height, pixelmatchOptions);
          var percDiff = differentPixels / totalPixels * 100;
          assert.ok(
            differentPixels < totalPixels * percentage,
            testName + ' has too many different pixels ' + differentPixels + ' representing ' + percDiff + '%'
          );
          console.log('Different pixels:', differentPixels, '/', totalPixels, ' diff:', percDiff.toFixed(3), '%');
          done();
        });
      });
    });
  });
})();
