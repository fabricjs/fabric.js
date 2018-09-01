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
  fabric.Object.prototype.objectCaching = true;

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
    var finalName = '/fixtures/' + filename;
    return fabric.isLikelyNode ? (__dirname + '/..' + finalName) : getAbsolutePath('/test' + finalName);
  }

  function getGoldeName(filename) {
    var finalName = '/golden/' + filename;
    return fabric.isLikelyNode ? (__dirname + finalName) : getAbsolutePath('/test/visual' + finalName);
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
      img.onload = null;
      callback(img);
    };
    img.onerror = function(err) {
      img.onerror = null;
      console.log('Image loading errored', err);
    };
    img.src = filename;
  }

  function beforeEachHandler() {
    fabricCanvas.setZoom(1);
    fabricCanvas.setDimensions({
      width: 300,
      height: 150,
    });
    fabricCanvas.clear();
    fabricCanvas.renderAll();
  }

  var tests = [];

  function clipping0(canvas, callback) {
    canvas.setDimensions({
      width: 400,
      height: 400,
    });
    var clipPath = new fabric.Circle({ radius: 200, strokeWidth: 0, top: 20, left: 20 });
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 400, height: 400, fill: 'rgba(255,0,0,0.5)'});
    obj.clipPath = clipPath;
    canvas.add(obj);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Clip a rect with a circle, no zoom',
    code: clipping0,
    golden: 'clipping0.png',
    newModule: 'Clipping shapes',
    percentage: 0.06,
  });

  function clipping1(canvas, callback) {
    canvas.setDimensions({
      width: 400,
      height: 400,
    });
    var zoom = 40;
    canvas.setZoom(zoom);
    var clipPath = new fabric.Circle({ radius: 5, strokeWidth: 0, top: 1, left: 1 });
    var obj = new fabric.Rect({ top: 0, left: 0, strokeWidth: 0, width: 10, height: 10, fill: 'rgba(255,0,0,0.5)'});
    obj.clipPath = clipPath;
    canvas.add(obj);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Clip a rect with a circle, with zoom',
    code: clipping1,
    golden: 'clipping1.png',
    percentage: 0.06,
  });

  tests.forEach(function(testObj) {
    var testName = testObj.test;
    var code = testObj.code;
    var percentage = testObj.percentage;
    var golden = testObj.golden;
    var newModule = testObj.newModule;
    if (newModule) {
      QUnit.module(newModule, {
        beforeEach: beforeEachHandler,
      });
    }
    QUnit.test(testName, function(assert) {
      var done = assert.async();
      code(fabricCanvas, function(renderedCanvas) {
        var width = renderedCanvas.width;
        var height = renderedCanvas.height;
        var totalPixels = width * height;
        var imageDataCanvas = renderedCanvas.getContext('2d').getImageData(0, 0, width, height).data;
        var canvas = fabric.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        var output = ctx.getImageData(0, 0, width, height).data;
        getImage(getGoldeName(golden), renderedCanvas, function(goldenImage) {
          ctx.drawImage(goldenImage, 0, 0);
          var imageDataGolden = ctx.getImageData(0, 0, width, height).data;
          var differentPixels = _pixelMatch(imageDataCanvas, imageDataGolden, output, width, height, pixelmatchOptions);
          var percDiff = differentPixels / totalPixels * 100;
          var okDiff = totalPixels * percentage;
          assert.ok(
            differentPixels < okDiff,
            testName + ' has too many different pixels ' + differentPixels + '(' + okDiff + ') representing ' + percDiff + '%'
          );
          console.log('Different pixels:', differentPixels, '/', totalPixels, ' diff:', percDiff.toFixed(3), '%');
          done();
        });
      });
    });
  });
})();
