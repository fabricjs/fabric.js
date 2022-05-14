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

  function createCanvasForTest(opts) {
    var fabricClass = opts.fabricClass || 'StaticCanvas';
    var options = { enableRetinaScaling: false, renderOnAddRemove: false, width: 200, height: 200 };
    if (opts.width) {
      options.width = opts.width;
    }
    if (opts.height) {
      options.height = opts.height;
    }
    return new fabric[fabricClass](null, options);
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
  exports.getAssetName = getAssetName;

  function getGoldeName(filename) {
    var finalName = '/golden/' + filename;
    return fabric.isLikelyNode ? localPath('/../visual', finalName) : getAbsolutePath('/test/visual' + finalName);
  }

  function getFixtureName(filename) {
    var finalName = '/fixtures/' + filename;
    return fabric.isLikelyNode ? localPath('/..', finalName) : getAbsolutePath('/test' + finalName);
  }

  function generateGolden(filename, original) {
    if (fabric.isLikelyNode && original) {
      var plainFileName = filename.replace('file://', '');
      var dataUrl = original.toDataURL().split(',')[1];
      console.log('creating original for ', filename);
      fs.writeFileSync(plainFileName, dataUrl, { encoding: 'base64' });
    }
  }

  function getImage(filename, original, callback) {
    if (fabric.isLikelyNode && original) {
      var plainFileName = filename.replace('file://', '');
      if (!fs.existsSync(plainFileName)) {
        generateGolden(filename, original);
      }
    }
    var img = fabric.document.createElement('img');
    img.onload = function() {
      img.onload = null;
      callback(img, false);
    };
    img.onerror = function(err) {
      img.onerror = null;
      callback(img, true);
      console.log('Image loading errored', err);
    };
    img.src = filename;
  }

  /**
   * 
   * @param {ImageData} actual 
   * @param {ImageData} expected 
   * @param {ImageData} output 
   * @param {*} [pixelmatchOptions]
   * @returns 
   */
  function pixelMatch(actual, expected, output, pixelmatchOptions) {
    var _pixelMatch;
    if (fabric.isLikelyNode) {
      _pixelMatch = global.pixelmatch;
    }
    else if (window) {
      _pixelMatch = window.pixelmatch;
    }
    
    var options = Object.assign({
      includeAA: true,
      threshold: 0.095
    }, pixelmatchOptions);

    return _pixelMatch(actual.data, expected.data, output.data, actual.width, actual.height, options);
  }

  /**
   * 
   * @param {CanvasImageSource} input 
   * @param {number} [width]
   * @param {number} [height]
   */
  function drawOntoCanvas(input, width, height) {
    var canvas = fabric.document.createElement('canvas');
    canvas.width = width || input.width;
    canvas.height = height || input.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(input, 0, 0);
    return canvas;
  }

  /**
   * 
   * @param {CanvasImageSource} actual 
   * @param {CanvasImageSource} expected 
   * @param {number} allowedPercentageDiff
   * @returns 
   */
  function compareVisuals(actual, expected, allowedPercentageDiff) {
    var visualCallback;
    var imageDataToChalk;
    if (fabric.isLikelyNode) {
      visualCallback = global.visualCallback;
      imageDataToChalk = global.imageDataToChalk;
    }
    else if (window) {
      visualCallback = window.visualCallback;
    }
    if (!actual.getContext) {
      actual = drawOntoCanvas(actual);
    }
    var width = actual.width;
    var height = actual.height;
    var totalPixels = width * height;
    var imageDataActual = actual.getContext('2d').getImageData(0, 0, width, height);
    var canvas = fabric.document.createElement('canvas');
    var canvas2 = fabric.document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas2.width = width;
    canvas2.height = height;
    var ctx = canvas.getContext('2d');
    var ctx2 = canvas2.getContext('2d');
    var output = ctx.getImageData(0, 0, width, height);
    ctx.drawImage(expected, 0, 0);
    ctx2.drawImage(actual, 0, 0, width, height);
    visualCallback.addArguments({
      enabled: true,
      golden: canvas,
      fabric: canvas2,
      diff: output
    });
    var imageDataExpected = ctx.getImageData(0, 0, width, height);
    var differentPixels = pixelMatch(imageDataActual, imageDataExpected, output);
    var percDiff = differentPixels / totalPixels * 100;
    var okDiff = totalPixels * allowedPercentageDiff;
    var isOK = differentPixels < okDiff
    return {
      ok: isOK,
      stats: {
        pixels: totalPixels,
        allowedDiff: okDiff
      },
      diff: {
        pixels: differentPixels,
        percent: percDiff,
        imageData: output,
        log() {
          imageDataToChalk && console.log(imageDataToChalk(output));
        }
      },
    }
  }

  exports.compareVisuals = compareVisuals;
  
  exports.compareGoldensTest = function (QUnit) {
    return function compareGoldens(testName, a, b, allowedPercentageDiff) {
      QUnit.test(testName, function (assert) {
        var done = assert.async();
        var aPath = getGoldeName(a);
        var bPath = getGoldeName(b);
        Promise.all([
          new Promise(resolve => getImage(aPath, null, resolve)),
          new Promise(resolve => getImage(bPath, null, resolve))
        ]).then((images) => {
          return compareVisuals(images[0], images[1], allowedPercentageDiff);
        }).then((result) => {
          assert.ok(
            result.ok,
            `${a} <> ${b} have too many different pixels ` +
            result.diff.pixels + ' (>' + result.stats.allowedDiff + ') representing ' +
            result.diff.percent + '%' + ' (>' + allowedPercentageDiff * 100 + '%)'
          );
          !result.ok && result.diff.log();
          done();
        });
      });
    }
  }

  exports.visualTestLoop = function(QUnit) {
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
          beforeEach: testObj.beforeEachHandler,
        });
      }
      QUnit.test(testName, function(assert) {
        var done = assert.async();
        var fabricCanvas = createCanvasForTest(testObj);
        code(fabricCanvas, function(actual) {
          getImage(getGoldeName(golden), actual, function (expected) {
            var result = compareVisuals(actual, expected, percentage);
            assert.ok(
              result.ok,
              testName + ' [' + golden + '] has too many different pixels ' +
              result.diff.pixels + ' (>' + result.stats.allowedDiff + ') representing ' +
              result.diff.percent + '%' + ' (>' + percentage * 100 + '%)'
            );
            !result.ok && result.diff.log();
            if ((!result.ok && QUnit.debugVisual) || QUnit.recreateVisualRefs) {
              generateGolden(getGoldeName(golden), actual);
            }
            fabricCanvas.dispose();
            done();
          });
        });
      });
    }
  }
})(typeof window === 'undefined' ? exports : this);
