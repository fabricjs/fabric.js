(function(exports) {

  exports.getFixture = function(name, original, callback) {
    getImage(getFixtureName(name), original, callback);
  };

  exports.getAsset = function(name, callback) {
    var finalName = getAssetName(name);
    if (fabric.isLikelyNode) {
      var plainFileName = finalName.replace('file://', '');
      return fs.readFile(plainFileName, { encoding: 'utf8' }, callback);
    }
    else {
      fabric.util.request(finalName, {
        onComplete: function(xhr) {
          callback(null, xhr.responseText);
        }
      });
    }
  };

  function createCanvasForTest(width, height) {
    var options = { enableRetinaScaling: false, renderOnAddRemove: false, width: 200, height: 200 };
    if (width) {
      options.width = width;
    }
    if (height) {
      options.height = height;
    }
    return new fabric.StaticCanvas(null, options);
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

  function localPath(path, filename) {
    return 'file://' + require('path').join(__dirname, path, filename)
  }

  function getAssetName(filename) {
    var finalName = '/assets/' + filename + '.svg';
    return fabric.isLikelyNode ? localPath('/../visual', finalName) : getAbsolutePath('/test/visual' + finalName);
  }

  function getGoldeName(filename) {
    var finalName = '/golden/' + filename;
    return fabric.isLikelyNode ? localPath('/../visual', finalName) : getAbsolutePath('/test/visual' + finalName);
  }

  function getFixtureName(filename) {
    var finalName = '/fixtures/' + filename;
    return fabric.isLikelyNode ? localPath('/..', finalName) : getAbsolutePath('/test' + finalName);
  }

  function getImage(filename, original, callback) {
    if (fabric.isLikelyNode && original) {
      var plainFileName = filename.replace('file://', '');
      try {
        fs.statSync(plainFileName);
      }
      catch (err) {
        var dataUrl = original.toDataURL().split(',')[1];
        console.log('creating original for ', filename);
        fs.writeFileSync(plainFileName, dataUrl, { encoding: 'base64' });
      }
    }
    var img = fabric.document.createElement('img');
    img.onload = function() {
      img.onload = null;
      callback(img);
    };
    img.onerror = function(err) {
      img.onerror = null;
      callback(img);
      console.log('Image loading errored', err);
    };
    img.src = filename;
  }

  exports.visualTestLoop = function(QUnit) {
    var _pixelMatch;
    var visualCallback;
    var imageDataToChalk;
    if (fabric.isLikelyNode) {
      _pixelMatch = global.pixelmatch;
      visualCallback = global.visualCallback;
      imageDataToChalk = global.imageDataToChalk;
    }
    else {
      if (window) {
        _pixelMatch = window.pixelmatch;
        visualCallback = window.visualCallback;
      }
      imageDataToChalk = function() { return ''; };
    }

    var pixelmatchOptions = {
      includeAA: false,
      threshold: 0.095
    };

    function beforeEachHandler() {

    }

    return function testCallback(testObj) {
      if (testObj.disabled) {
        return;
      }
      fabric.StaticCanvas.prototype.requestRenderAll = fabric.StaticCanvas.prototype.renderAll;
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
        var fabricCanvas = createCanvasForTest(testObj.width, testObj.height);
        code(fabricCanvas, function(renderedCanvas) {
          var width = renderedCanvas.width;
          var height = renderedCanvas.height;
          var totalPixels = width * height;
          var imageDataCanvas = renderedCanvas.getContext('2d').getImageData(0, 0, width, height).data;
          var canvas = fabric.document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext('2d');
          var output = ctx.getImageData(0, 0, width, height);
          getImage(getGoldeName(golden), renderedCanvas, function(goldenImage) {
            ctx.drawImage(goldenImage, 0, 0);
            visualCallback.addArguments({
              enabled: true,
              golden: canvas,
              fabric: renderedCanvas,
              diff: output
            });
            var imageDataGolden = ctx.getImageData(0, 0, width, height).data;
            var differentPixels = _pixelMatch(imageDataCanvas, imageDataGolden, output.data, width, height, pixelmatchOptions);
            var percDiff = differentPixels / totalPixels * 100;
            var okDiff = totalPixels * percentage;
            var isOK = differentPixels < okDiff;
            assert.ok(
              isOK,
              testName + ' has too many different pixels ' + differentPixels + '(' + okDiff + ') representing ' + percDiff + '%'
            );
            if (!isOK) {
              var stringa = imageDataToChalk(output);
              console.log(stringa);
            }
            done();
            fabricCanvas.dispose();
          });
        });
      });
    }
  }
})(typeof window === 'undefined' ? exports : this);
