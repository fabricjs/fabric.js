(function() {
  fabric.enableGLFiltering = false;
  var _pixelMatch = pixelmatch;
  if (fabric.isLikelyNode) {
    var fs = global.fs;
    _pixelMatch = global.pixelmatch;
  }
  var fabricCanvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, renderOnAddRemove: false});
  var pixelmatchOptions = {
    includeAA: false,
    threshold: 0.01
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

  QUnit.module('Blend image filter test', {
    afterEach: function() {
      fabricCanvas.clear();
      fabricCanvas.renderAll();
    }
  });

  var testName = 'Multiple applications of filter';
  QUnit.test(testName, function(assert) {
    var done = assert.async();
    getImage(getFixtureName('greyfloral.png'), false, function(img) {
      getImage(getFixtureName('greyfloral_partial_transparent.png'), false, function(backdrop) {
        var image = new fabric.Image(img);
        var backdropImage = new fabric.Image(backdrop);
        image.filters.push(new fabric.Image.filters.BlendImage({image: backdropImage}));
        image.applyFilters();

        fabricCanvas.add(image);
        fabricCanvas.renderAll();

        var renderedCanvas = fabricCanvas.lowerCanvasEl;

        var width = renderedCanvas.width;
        var height = renderedCanvas.height;
        var totalPixels = width * height;
        var imageDataCanvas = renderedCanvas.getContext('2d').getImageData(0, 0, width, height).data;
        
        image.applyFilters();
        fabricCanvas.renderAll();
        var imageDataCanvas2 = renderedCanvas.getContext('2d').getImageData(0, 0, width, height).data;

        var differentPixels = _pixelMatch(imageDataCanvas, imageDataCanvas2, null, width, height, pixelmatchOptions);
        var percDiff = differentPixels / totalPixels * 100;
        var okDiff = totalPixels * 0.01;
        assert.ok(
          differentPixels < okDiff,
          testName + ' has too many different pixels ' + differentPixels + '(' + okDiff + ') representing ' + percDiff + '%'
        );
        console.log('Different pixels:', differentPixels, '/', totalPixels, ' diff:', percDiff.toFixed(3), '%');
        done();
      });      
    });
  });
})();
