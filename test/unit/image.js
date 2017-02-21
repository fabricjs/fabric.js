(function() {

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) { return path; };
    var imgEl = _createImageElement();
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  var IMG_SRC     = fabric.isLikelyNode ? (__dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif'),
      IMG_WIDTH   = 276,
      IMG_HEIGHT  = 110;

  var REFERENCE_IMG_OBJECT = {
    'type':                     'image',
    'originX':                  'left',
    'originY':                  'top',
    'left':                     0,
    'top':                      0,
    'width':                    IMG_WIDTH, // node-canvas doesn't seem to allow setting width/height on image objects
    'height':                   IMG_HEIGHT, // or does it now?
    'fill':                     'rgb(0,0,0)',
    'stroke':                   null,
    'strokeWidth':              0,
    'strokeDashArray':          null,
    'strokeLineCap':            'butt',
    'strokeLineJoin':           'miter',
    'strokeMiterLimit':         10,
    'scaleX':                   1,
    'scaleY':                   1,
    'angle':                    0,
    'flipX':                    false,
    'flipY':                    false,
    'opacity':                  1,
    'src':                      IMG_SRC,
    'shadow':                   null,
    'visible':                  true,
    'backgroundColor':          '',
    'clipTo':                   null,
    'filters':                  [],
    'resizeFilters':            [],
    'fillRule':                 'nonzero',
    'globalCompositeOperation': 'source-over',
    'skewX':                    0,
    'skewY':                    0,
    'transformMatrix':          null,
    'crossOrigin':              '',
    'alignX':                   'none',
    'alignY':                   'none',
    'meetOrSlice':              'meet'
  };

  function _createImageElement() {
    return fabric.isLikelyNode ? new (require('canvas').Image)() : fabric.document.createElement('img');
  }

  function _createImageObject(width, height, callback, options) {
    var elImage = _createImageElement();
    setSrc(elImage, IMG_SRC, function() {
      if (width != elImage.width || height != elImage.height) {
        if (fabric.isLikelyNode) {
          var Canvas = require('canvas');
          var canvas = new Canvas(width, height);
          canvas.getContext('2d').drawImage(elImage, 0, 0, width, height);
          elImage._src = canvas.toDataURL();
          elImage.src = elImage._src;
        }
        else {
          elImage.width = width;
          elImage.height = height;
        }
        return new fabric.Image(elImage, options, callback);
      }
      else {
        return new fabric.Image(elImage, options, callback);
      }
    });
  }

  function createImageObject(callback, options) {
    return _createImageObject(IMG_WIDTH, IMG_HEIGHT, callback, options);
  }

  function createSmallImageObject(callback, options) {
    return _createImageObject(IMG_WIDTH / 2, IMG_HEIGHT / 2, callback, options);
  }

  function setSrc(img, src, callback) {
    if (fabric.isLikelyNode) {
      require('fs').readFile(src, function(err, imgData) {
        if (err) { throw err; };
        img.src = imgData;
        img._src = src;
        callback && callback();
      });
    }
    else {
      img.onload = function() {
        callback && callback();
      };
      img.src = src;
    }
  }

  QUnit.module('fabric.Image');

  asyncTest('constructor', function() {
    ok(fabric.Image);

    createImageObject(function(image) {
      ok(image instanceof fabric.Image);
      ok(image instanceof fabric.Object);

      equal(image.get('type'), 'image');

      start();
    });
  });

  asyncTest('toObject', function() {
    createImageObject(function(image) {
      ok(typeof image.toObject == 'function');
      var toObject = image.toObject();
      // workaround for node-canvas sometimes producing images with width/height and sometimes not
      if (toObject.width === 0) {
        toObject.width = IMG_WIDTH;
      }
      if (toObject.height === 0) {
        toObject.height = IMG_HEIGHT;
      }
      deepEqual(toObject, REFERENCE_IMG_OBJECT);
      start();
    });
  });

  asyncTest('toObject with no element', function() {
    createImageObject(function(image) {
      ok(typeof image.toObject == 'function');
      var toObject = image.toObject();
      // workaround for node-canvas sometimes producing images with width/height and sometimes not
      if (toObject.width === 0) {
        toObject.width = IMG_WIDTH;
      }
      if (toObject.height === 0) {
        toObject.height = IMG_HEIGHT;
      }
      deepEqual(toObject, REFERENCE_IMG_OBJECT);
      start();
    });
  });

  asyncTest('toObject with resize filter', function() {
    createImageObject(function(image) {
      ok(typeof image.toObject == 'function');
      var filter = new fabric.Image.filters.Resize({resizeType: 'bilinear', scaleX: 0.3, scaleY: 0.3});
      image.resizeFilters.push(filter);
      ok(image.resizeFilters[0] instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
      var toObject = image.toObject();
      deepEqual(toObject.resizeFilters[0], filter.toObject());
      fabric.Image.fromObject(toObject, function(imageFromObject) {
        var filterFromObj = imageFromObject.resizeFilters[0];
        deepEqual(filterFromObj, filter);
        ok(filterFromObj instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
        equal(filterFromObj.scaleX, 0.3);
        equal(filterFromObj.scaleY, 0.3);
        equal(filterFromObj.resizeType, 'bilinear');
        start();
      });
    });
  });

  asyncTest('toObject with applied resize filter', function() {
    createImageObject(function(image) {
      ok(typeof image.toObject == 'function');
      var filter = new fabric.Image.filters.Resize({resizeType: 'bilinear', scaleX: 0.2, scaleY: 0.2});
      image.filters.push(filter);
      var width = image.width, height = image.height;
      ok(image.filters[0] instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
      image.applyFilters(function() {
        equal(image.width, width / 5, 'width should be a fifth');
        equal(image.height, height / 5, 'height should a fifth');
        var toObject = image.toObject();
        deepEqual(toObject.filters[0], filter.toObject());
        equal(toObject.width, width, 'width is stored as before filters');
        equal(toObject.height, height, 'height is stored as before filters');
        fabric.Image.fromObject(toObject, function(_imageFromObject) {
          var filterFromObj = _imageFromObject.filters[0];
          ok(filterFromObj instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
          equal(filterFromObj.scaleY, 0.2);
          equal(filterFromObj.scaleX, 0.2);
          equal(_imageFromObject.width, width / 5, 'on image reload width is halved again');
          equal(_imageFromObject.height, height / 5, 'on image reload width is halved again');
          start();
        });
      });
    });
  });

  asyncTest('toString', function() {
    createImageObject(function(image) {
      ok(typeof image.toString == 'function');
      equal(image.toString(), '#<fabric.Image: { src: "' + IMG_SRC + '" }>');
      start();
    });
  });

  asyncTest('getSrc', function() {
    createImageObject(function(image) {
      ok(typeof image.getSrc == 'function');
      equal(image.getSrc(), IMG_SRC);
      start();
    });
  });

  test('getElement', function() {
    var elImage = _createImageElement();
    var image = new fabric.Image(elImage);
    ok(typeof image.getElement == 'function');
    equal(image.getElement(), elImage);
  });

  asyncTest('setElement', function() {
    createImageObject(function(image) {
      ok(typeof image.setElement == 'function');

      var elImage = _createImageElement();
      equal(image.setElement(elImage), image, 'chainable');
      equal(image.getElement(), elImage);
      equal(image._originalElement, elImage);

      start();
    });
  });

  asyncTest('crossOrigin', function() {
    createImageObject(function(image) {
      equal(image.crossOrigin, '', 'initial crossOrigin value should be set');

      var elImage = _createImageElement();
      elImage.crossOrigin = 'anonymous';
      image = new fabric.Image(elImage);
      equal(image.crossOrigin, '', 'crossOrigin value on an instance takes precedence');

      var objRepr = image.toObject();
      equal(objRepr.crossOrigin, '', 'toObject should return proper crossOrigin value');

      var elImage2 = _createImageElement();
      elImage2.crossOrigin = 'anonymous';
      image.setElement(elImage2);
      equal(elImage2.crossOrigin, 'anonymous', 'setElement should set proper crossOrigin on an img element');

      // fromObject doesn't work on Node :/
      if (fabric.isLikelyNode) {
        start();
        return;
      }

      fabric.Image.fromObject(objRepr, function(img) {
        equal(img.crossOrigin, '');
        start();
      });
    });
  });

  asyncTest('clone', function() {
    createImageObject(function(image) {
      ok(typeof image.clone == 'function');

      image.clone(function(clone) {
        ok(clone instanceof fabric.Image);
        deepEqual(clone.toObject(), image.toObject());
        start();
      });
    });
  });

  asyncTest('cloneWidthHeight', function() {
    createSmallImageObject(function(image) {
      image.clone(function(clone) {
        equal(clone.width, IMG_WIDTH / 2,
          'clone\'s element should have width identical to that of original image');
        equal(clone.height, IMG_HEIGHT / 2,
          'clone\'s element should have height identical to that of original image');
        start();
      });
    });
  });

  asyncTest('fromObject', function() {
    ok(typeof fabric.Image.fromObject == 'function');

    // should not throw error when no callback is given
    var obj = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_IMG_OBJECT), {
      src: IMG_SRC
    });
    fabric.Image.fromObject(obj, function(instance){
      ok(instance instanceof fabric.Image);
      start();
    });
  });

  asyncTest('fromURL', function() {
    ok(typeof fabric.Image.fromURL == 'function');
    fabric.Image.fromURL(IMG_SRC, function(instance) {
      ok(instance instanceof fabric.Image);
      deepEqual(REFERENCE_IMG_OBJECT, instance.toObject());
      start();
    });
  });

  asyncTest('fromElement', function() {

    function makeImageElement(attributes) {
      var element = _createImageElement();
      if (fabric.isLikelyNode) {
        element.getAttribute = function(x) {
          return element[x];
        };
        element.setAttribute = function(x, value) {
          element[x] = value;
        };
      }
      for (var prop in attributes) {
        element.setAttribute(prop, attributes[prop]);
      }
      return element;
    }

    var IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

    ok(typeof fabric.Image.fromElement == 'function', 'fromElement should exist');

    var imageEl = makeImageElement({
      width: '14',
      height: '17',
      'xlink:href': IMAGE_DATA_URL
    });

    fabric.Image.fromElement(imageEl, function(imgObject) {
      ok(imgObject instanceof fabric.Image);
      deepEqual(imgObject.get('width'), 14, 'width of an object');
      deepEqual(imgObject.get('height'), 17, 'height of an object');
      deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
      start();
    });
  });

  // asyncTest('minimumScale', function() {
  //   createImageObject(function(image) {
  //     ok(typeof image.toObject == 'function');
  //     var filter = new fabric.Image.filters.Resize({resizeType: 'sliceHack', scaleX: 0.2, scaleY: 0.2});
  //     image.resizeFilters.push(filter);
  //     var width = image.width, height = image.height;
  //     ok(image.resizeFilters[0] instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
  //     var toObject = image.toObject();
  //     fabric.Image.fromObject(toObject, function(_imageFromObject) {
  //       var filterFromObj = _imageFromObject.resizeFilters[0];
  //       ok(filterFromObj instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
  //       equal(filterFromObj.scaleY, 0.2);
  //       equal(filterFromObj.scaleX, 0.2);
  //       var canvasEl = _imageFromObject.applyFilters(null, _imageFromObject.resizeFilters, _imageFromObject._originalElement, true);
  //       start();
  //     });
  //   });
  // });

})();
