(function() {
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
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

  function afterEachHandler() {
    fabricCanvas.setZoom(1);
    fabricCanvas.setDimensions({
      width: 300,
      height: 150,
    });
    fabricCanvas.clear();
    fabricCanvas.renderAll();
  }

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
      image.dispose();
    });
  }

  tests.push({
    test: 'Image resize with canvas zoom',
    code: imageResizeTest,
    golden: 'parrot.png',
    newModule: 'Image resize filter test',
    percentage: 0.06,
  });

  function imageResizeTestNoZoom(canvas, callback) {
    getImage(getFixtureName('parrot.png'), false, function(img) {
      canvas.setDimensions({
        width: 200,
        height: 200,
      });
      var image = new fabric.Image(img);
      image.resizeFilter = new fabric.Image.filters.Resize({ resizeType: 'lanczos' });
      image.scaleToWidth(canvas.width);
      canvas.add(image);
      canvas.renderAll();
      callback(canvas.lowerCanvasEl);
      image.dispose();
    });
  }

  tests.push({
    test: 'Image resize without zoom',
    code: imageResizeTestNoZoom,
    golden: 'parrot.png',
    percentage: 0.06,
  });

  function imageResizeTestGroup(canvas, callback) {
    getImage(getFixtureName('parrot.png'), false, function(img) {
      canvas.setDimensions({
        width: 200,
        height: 200,
      });
      var image = new fabric.Image(img, { strokeWidth: 0 });
      image.resizeFilter = new fabric.Image.filters.Resize({ resizeType: 'lanczos' });
      var group = new fabric.Group([image]);
      group.strokeWidth = 0;
      group.scaleToWidth(canvas.width);
      canvas.add(group);
      canvas.renderAll();
      image.dispose();
      callback(canvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'Image resize with scaled group',
    code: imageResizeTestGroup,
    golden: 'parrot.png',
    percentage: 0.06,
  });

  function blendImageTest2(canvas, callback) {
    getImage(getFixtureName('parrot.png'), false, function(img) {
      var image = new fabric.Image(img);
      var backdropImage = new fabric.Image(img);
      backdropImage.left = backdropImage.width;
      backdropImage.scaleX = -1;
      image.filters.push(new fabric.Image.filters.BlendImage({ image: backdropImage }));
      image.applyFilters();
      image.scaleToWidth(400);
      canvas.setDimensions({
        width: 400,
        height: 400,
      });
      canvas.add(image);
      canvas.renderAll();
      image.dispose();
      backdropImage.dispose();
      callback(canvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'Blend image test with flip',
    code: blendImageTest2,
    golden: 'parrotblend2.png',
    newModule: 'Image Blend test',
    percentage: 0.06,
  });

  function blendImageTest(canvas, callback) {
    getImage(getFixtureName('parrot.png'), false, function(img) {
      getImage(getFixtureName('very_large_image.jpg'), false, function(backdrop) {
        var image = new fabric.Image(img);
        var backdropImage = new fabric.Image(backdrop);
        image.filters.push(new fabric.Image.filters.BlendImage({image: backdropImage, alpha: 0.5 }));
        image.scaleToWidth(400);
        image.applyFilters();
        canvas.setDimensions({
          width: 400,
          height: 400,
        });
        canvas.add(image);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
      });
    });
  }

  tests.push({
    test: 'Blend image test',
    code: blendImageTest,
    golden: 'parrotblend.png',
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
        afterEach: afterEachHandler,
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
