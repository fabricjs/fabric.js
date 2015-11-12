(function() {

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) return path;
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
    'src':                      fabric.isLikelyNode ? undefined : IMG_SRC,
    'shadow':                   null,
    'visible':                  true,
    'backgroundColor':          '',
    'clipTo':                   null,
    'filters':                  [],
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

  function _createImageObject(width, height, callback) {
    var elImage = _createImageElement();
    elImage.width = width;
    elImage.height = height;
    setSrc(elImage, IMG_SRC, function() {
      callback(new fabric.Image(elImage));
    });
  }

  function createImageObject(callback) {
    return _createImageObject(IMG_WIDTH, IMG_HEIGHT, callback);
  }

  // function createSmallImageObject(callback) {
  //   return _createImageObject(IMG_WIDTH / 2, IMG_HEIGHT / 2, callback);
  // }

  function setSrc(img, src, callback) {
    if (fabric.isLikelyNode) {
      require('fs').readFile(src, function(err, imgData) {
        if (err) throw err;
        img.src = imgData;
        callback && callback();
      });
    }
    else {
      img.src = src;
      callback && callback();
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
      });
      start();
    });
  });

  // asyncTest('toObject without default values', function() {
  //   createImageObject(function(image) {

  //     image.includeDefaultValues = false;

  //     var object = image.toObject();

  //     // workaround for node-canvas sometimes producing images with width/height and sometimes not
  //     if (object.width === 0) {
  //       object.width = IMG_WIDTH;
  //     }
  //     if (object.height === 0) {
  //       object.height = IMG_HEIGHT;
  //     }
  //     deepEqual(object, {
  //       type: 'image',
  //       // why the hell deepEqual fail [] == [] check?!
  //       filters: [],
  //       crossOrigin: ''
  //     });
  //     start();
  //   });
  // });

  asyncTest('toString', function() {
    createImageObject(function(image) {
      ok(typeof image.toString == 'function');
      equal(image.toString(), '#<fabric.Image: { src: "' + (fabric.isLikelyNode ? undefined : IMG_SRC) + '" }>');
      start();
    });
  });

  asyncTest('getSrc', function() {
    createImageObject(function(image) {
      ok(typeof image.getSrc == 'function');
      equal(image.getSrc(), fabric.isLikelyNode ? undefined : IMG_SRC);
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

  // asyncTest('clone', function() {
  //   createImageObject(function(image) {
  //     ok(typeof image.clone == 'function');

  //     var imageClone = null;
  //     image.clone(function(clone) {
  //       imageClone = clone;
  //     });

  //     setTimeout(function() {
  //       ok(imageClone instanceof fabric.Image);
  //       deepEqual(imageClone.toObject(), image.toObject());
  //       start();
  //     }, 1000);
  //   });
  // });

  // asyncTest('cloneWidthHeight', function() {
  //   var image = createSmallImageObject();

  //   var imageClone = null;
  //   image.clone(function(clone) {
  //     imageClone = clone;
  //   });

  //   setTimeout(function() {
  //     equal(imageClone.getElement().width, IMG_WIDTH / 2,
  //       'clone\'s element should have width identical to that of original image');
  //     equal(imageClone.getElement().height, IMG_HEIGHT / 2,
  //       'clone\'s element should have height identical to that of original image');
  //     start();
  //   }, 1000);
  // });

  // asyncTest('fromObject', function() {
  //   ok(typeof fabric.Image.fromObject == 'function');

  //   // should not throw error when no callback is given
  //   var obj = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_IMG_OBJECT), {
  //     src: IMG_SRC
  //   });
  //   fabric.Image.fromObject(obj);

  //   var image;
  //   fabric.Image.fromObject(obj, function(instance){
  //     image = instance;
  //   });

  //   setTimeout(function() {
  //     ok(image instanceof fabric.Image);
  //     start();
  //   }, 1000);
  // });

  // asyncTest('fromURL', function() {
  //   ok(typeof fabric.Image.fromURL == 'function');

  //   // should not throw error when no callback is given
  //   // can't use `assertNothingRaised` due to asynchronous callback
  //   fabric.Image.fromURL(IMG_SRC);

  //   var image;
  //   fabric.Image.fromURL(IMG_SRC, function(instance) {
  //     image = instance;
  //   });

  //   setTimeout(function() {
  //     ok(image instanceof fabric.Image);
  //     deepEqual(REFERENCE_IMG_OBJECT, image.toObject());
  //     start();
  //   }, 1000);
  // });

  // test('toGrayscale', function() {
  //   var image = createImageObject(),
  //       imageEl = _createImageElement();

  //   imageEl.src = IMG_SRC;
  //   image.setElement(imageEl);

  //   ok(typeof image.toGrayscale == 'function');

  //   if (!fabric.Canvas.supports('toDataURL')) {
  //     alert('toDataURL is not supported. Some tests can not be run.');
  //   }
  //   else {
  //     equal(image.toGrayscale(), image, 'chainable');
  //   }
  // });

  // asyncTest('fromElement', function() {

  //   function makeImageElement(attributes) {
  //     var element = _createImageElement();
  //     for (var prop in attributes) {
  //       element.setAttribute(prop, attributes[prop]);
  //     }
  //     return element;
  //   }

  //   var IMAGE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==";

  //   ok(typeof fabric.Image.fromElement == 'function', 'fromElement should exist');

  //   var imageEl = makeImageElement({
  //     width: "14",
  //     height: "17",
  //     "xlink:href": IMAGE_DATA_URL
  //   });

  //   var imgObject;
  //   fabric.Image.fromElement(imageEl, function(obj) {
  //     imgObject = obj;
  //   });

  //   setTimeout(function() {
  //     ok(imgObject instanceof fabric.Image);
  //     deepEqual(imgObject.get('width'), 14, 'width of an object');
  //     deepEqual(imgObject.get('height'), 17, 'height of an object');
  //     deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
  //     start();
  //   }, 500);
  // });

})();
