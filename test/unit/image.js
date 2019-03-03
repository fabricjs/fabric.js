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

  function makeImageElement(attributes) {
    var element = {};
    element.getAttribute = function(x) {
      return element[x];
    };
    element.setAttribute = function(x, value) {
      element[x] = value;
    };
    for (var prop in attributes) {
      element.setAttribute(prop, attributes[prop]);
    }
    return element;
  }

  var IMG_SRC     = fabric.isLikelyNode ? ('file://' + require('path').join(__dirname + '/../fixtures/test_image.gif')) : getAbsolutePath('../fixtures/test_image.gif'),
      IMG_SRC_REL = fabric.isLikelyNode ? ('file://' + require('path').join(__dirname + '/../fixtures/test_image.gif')) : '/fixtures/test_image.gif',
      IMG_WIDTH   = 276,
      IMG_HEIGHT  = 110;

  var REFERENCE_IMG_OBJECT = {
    version:                  fabric.version,
    type:                     'image',
    originX:                  'left',
    originY:                  'top',
    left:                     0,
    top:                      0,
    width:                    IMG_WIDTH, // node-canvas doesn't seem to allow setting width/height on image objects
    height:                   IMG_HEIGHT, // or does it now?
    fill:                     'rgb(0,0,0)',
    stroke:                   null,
    strokeWidth:              0,
    strokeDashArray:          null,
    strokeLineCap:            'butt',
    strokeDashOffset:         0,
    strokeLineJoin:           'miter',
    strokeMiterLimit:         4,
    scaleX:                   1,
    scaleY:                   1,
    angle:                    0,
    flipX:                    false,
    flipY:                    false,
    opacity:                  1,
    src:                      IMG_SRC,
    shadow:                   null,
    visible:                  true,
    backgroundColor:          '',
    clipTo:                   null,
    filters:                  [],
    fillRule:                 'nonzero',
    paintFirst:               'fill',
    globalCompositeOperation: 'source-over',
    skewX:                    0,
    skewY:                    0,
    transformMatrix:          null,
    crossOrigin:              '',
    cropX:                    0,
    cropY:                    0
  };

  function _createImageElement() {
    return fabric.document.createElement('img');
  }

  function _createImageObject(width, height, callback, options, src) {
    options = options || {};
    src = src || IMG_SRC;
    var elImage = _createImageElement();
    setSrc(elImage, src, function() {
      options.width = width;
      options.height = height;
      callback(new fabric.Image(elImage, options));
    });
  }

  function createImageObject(callback, options) {
    return _createImageObject(IMG_WIDTH, IMG_HEIGHT, callback, options);
  }

  function createSmallImageObject(callback, options) {
    return _createImageObject(IMG_WIDTH / 2, IMG_HEIGHT / 2, callback, options);
  }

  function createImageObjectWithSrc(callback, options, src) {
    return _createImageObject(IMG_WIDTH, IMG_HEIGHT, callback, options, src);
  }

  function setSrc(img, src, callback) {
    img.onload = function() {
      callback && callback();
    };
    img.src = src;
  }

  QUnit.module('fabric.Image');

  QUnit.test('constructor', function(assert) {
    var done = assert.async();
    assert.ok(fabric.Image);

    createImageObject(function(image) {
      assert.ok(image instanceof fabric.Image);
      assert.ok(image instanceof fabric.Object);

      assert.equal(image.get('type'), 'image');

      done();
    });
  });

  QUnit.test('toObject', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.toObject === 'function');
      var toObject = image.toObject();
      // workaround for node-canvas sometimes producing images with width/height and sometimes not
      if (toObject.width === 0) {
        toObject.width = IMG_WIDTH;
      }
      if (toObject.height === 0) {
        toObject.height = IMG_HEIGHT;
      }
      assert.deepEqual(toObject, REFERENCE_IMG_OBJECT);
      done();
    });
  });

  QUnit.test('setSrc', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      image.width = 100;
      image.height = 100;
      assert.ok(typeof image.setSrc === 'function');
      assert.equal(image.width, 100);
      assert.equal(image.height, 100);
      image.setSrc(IMG_SRC, function() {
        assert.equal(image.width, IMG_WIDTH);
        assert.equal(image.height, IMG_HEIGHT);
        done();
      });
    });
  });

  QUnit.test('toObject with no element', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.toObject === 'function');
      var toObject = image.toObject();
      // workaround for node-canvas sometimes producing images with width/height and sometimes not
      if (toObject.width === 0) {
        toObject.width = IMG_WIDTH;
      }
      if (toObject.height === 0) {
        toObject.height = IMG_HEIGHT;
      }
      assert.deepEqual(toObject, REFERENCE_IMG_OBJECT);
      done();
    });
  });

  QUnit.test('toObject with resize filter', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.toObject === 'function');
      var filter = new fabric.Image.filters.Resize({resizeType: 'bilinear', scaleX: 0.3, scaleY: 0.3});
      image.resizeFilter = filter;
      assert.ok(image.resizeFilter instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
      var toObject = image.toObject();
      assert.deepEqual(toObject.resizeFilter, filter.toObject(), 'the filter is in object form now');
      fabric.Image.fromObject(toObject, function(imageFromObject) {
        var filterFromObj = imageFromObject.resizeFilter;
        assert.ok(filterFromObj instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
        assert.deepEqual(filterFromObj, filter,  'the filter has been restored');
        assert.equal(filterFromObj.scaleX, 0.3);
        assert.equal(filterFromObj.scaleY, 0.3);
        assert.equal(filterFromObj.resizeType, 'bilinear');
        done();
      });
    });
  });

  QUnit.test('toObject with normal filter and resize filter', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      var filter = new fabric.Image.filters.Resize({resizeType: 'bilinear' });
      image.resizeFilter = filter;
      var filterBg = new fabric.Image.filters.Brightness({ brightness: 0.8 });
      image.filters = [filterBg];
      image.scaleX = 0.3;
      image.scaleY = 0.3;
      var toObject = image.toObject();
      assert.deepEqual(toObject.resizeFilter, filter.toObject(), 'the filter is in object form now');
      assert.deepEqual(toObject.filters[0], filterBg.toObject(), 'the filter is in object form now brightness');
      fabric.Image.fromObject(toObject, function(imageFromObject) {
        var filterFromObj = imageFromObject.resizeFilter;
        var brightnessFromObj = imageFromObject.filters[0];
        assert.ok(filterFromObj instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
        assert.ok(brightnessFromObj instanceof fabric.Image.filters.Brightness, 'should inherit from fabric.Image.filters.Resize');
        done();
      });
    });
  });

  QUnit.test('toObject with applied resize filter', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.toObject === 'function');
      var filter = new fabric.Image.filters.Resize({resizeType: 'bilinear', scaleX: 0.2, scaleY: 0.2});
      image.filters.push(filter);
      var width = image.width, height = image.height;
      assert.ok(image.filters[0] instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
      image.applyFilters();
      assert.equal(image.width, Math.floor(width), 'width is not changed');
      assert.equal(image.height, Math.floor(height), 'height is not changed');
      assert.equal(image._filterScalingX.toFixed(1), 0.2, 'a new scaling factor is made for x');
      assert.equal(image._filterScalingY.toFixed(1), 0.2, 'a new scaling factor is made for y');
      var toObject = image.toObject();
      assert.deepEqual(toObject.filters[0], filter.toObject());
      assert.equal(toObject.width, width, 'width is stored as before filters');
      assert.equal(toObject.height, height, 'height is stored as before filters');
      fabric.Image.fromObject(toObject, function(_imageFromObject) {
        var filterFromObj = _imageFromObject.filters[0];
        assert.ok(filterFromObj instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
        assert.equal(filterFromObj.scaleY, 0.2);
        assert.equal(filterFromObj.scaleX, 0.2);
        done();
      });
    });
  });

  QUnit.test('toString', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.toString === 'function');
      assert.equal(image.toString(), '#<fabric.Image: { src: "' + IMG_SRC + '" }>');
      done();
    });
  });

  QUnit.test('toSVG with crop', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      image.cropX = 1;
      image.cropY = 1;
      image.width -= 2;
      image.height -= 2;
      fabric.Object.__uid = 1;
      var expectedSVG = '<g transform=\"matrix(1 0 0 1 137 54)\"  >\n<clipPath id=\"imageCrop_1\">\n\t<rect x=\"-137\" y=\"-54\" width=\"274\" height=\"108\" />\n</clipPath>\n\t<image style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  xlink:href=\"' + IMG_SRC + '\" x=\"-138\" y=\"-55\" width=\"276\" height=\"110\" clip-path=\"url(#imageCrop_1)\" ></image>\n</g>\n';
      assert.equal(image.toSVG(), expectedSVG);
      done();
    });
  });

  QUnit.test('hasCrop', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.hasCrop === 'function');
      assert.equal(image.hasCrop(), false, 'standard image has no crop');
      image.cropX = 1;
      assert.equal(image.hasCrop(), true, 'cropX !== 0 gives crop true');
      image.cropX = 0;
      image.cropY = 1;
      assert.equal(image.hasCrop(), true, 'cropY !== 0 gives crop true');
      image.width -= 1;
      assert.equal(image.hasCrop(), true, 'width < element.width gives crop true');
      image.width += 1;
      image.height -= 1;
      assert.equal(image.hasCrop(), true, 'height < element.height gives crop true');
      done();
    });
  });

  QUnit.test('toSVG', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.toSVG === 'function');
      var expectedSVG = '<g transform=\"matrix(1 0 0 1 138 55)\"  >\n\t<image style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  xlink:href=\"' + IMG_SRC + '\" x=\"-138\" y=\"-55\" width=\"276\" height=\"110\"></image>\n</g>\n';
      assert.equal(image.toSVG(), expectedSVG);
      done();
    });
  });

  QUnit.test('getSrc', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.getSrc === 'function');
      assert.equal(image.getSrc(), IMG_SRC);
      done();
    });
  });

  QUnit.test('getSrc with srcFromAttribute', function(assert) {
    var done = assert.async();
    createImageObjectWithSrc(function(image) {
      assert.equal(image.getSrc(), IMG_SRC_REL);
      done();
    },
    {
      srcFromAttribute: true
    },
    IMG_SRC_REL
    );
  });

  QUnit.test('getElement', function(assert) {
    var elImage = _createImageElement();
    var image = new fabric.Image(elImage);
    assert.ok(typeof image.getElement === 'function');
    assert.equal(image.getElement(), elImage);
  });

  QUnit.test('setElement', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.setElement === 'function');

      var elImage = _createImageElement();
      assert.notEqual(image.getElement(), elImage);
      assert.equal(image.setElement(elImage), image, 'chainable');
      assert.equal(image.getElement(), elImage);
      assert.equal(image._originalElement, elImage);
      done();
    });
  });

  QUnit.test('setElement resets the webgl cache', function(assert) {
    var done = assert.async();
    var fabricBackend = fabric.filterBackend;
    createImageObject(function(image) {
      fabric.filterBackend = {
        textureCache: {},
        evictCachesForKey: function(key) {
          delete this.textureCache[key];
        }
      };
      var elImage = _createImageElement();
      fabric.filterBackend.textureCache[image.cacheKey] = 'something';
      assert.equal(image.setElement(elImage), image, 'chainable');
      assert.equal(fabric.filterBackend.textureCache[image.cacheKey], undefined);
      fabric.filterBackend = fabricBackend;
      done();
    });
  });

  QUnit.test('crossOrigin', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.equal(image.crossOrigin, '', 'initial crossOrigin value should be set');

      var elImage = _createImageElement();
      elImage.crossOrigin = 'anonymous';
      image = new fabric.Image(elImage);
      assert.equal(image.crossOrigin, '', 'crossOrigin value on an instance takes precedence');

      var objRepr = image.toObject();
      assert.equal(objRepr.crossOrigin, '', 'toObject should return proper crossOrigin value');

      var elImage2 = _createImageElement();
      elImage2.crossOrigin = 'anonymous';
      image.setElement(elImage2);
      assert.equal(elImage2.crossOrigin, 'anonymous', 'setElement should set proper crossOrigin on an img element');

      // fromObject doesn't work on Node :/
      if (fabric.isLikelyNode) {
        done();
        return;
      }

      fabric.Image.fromObject(objRepr, function(img) {
        assert.equal(img.crossOrigin, '');
        done();
      });
    });
  });

  QUnit.test('clone', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      assert.ok(typeof image.clone === 'function');
      image.clone(function(clone) {
        assert.ok(clone instanceof fabric.Image);
        assert.deepEqual(clone.toObject(), image.toObject());
        done();
      });
    });
  });

  QUnit.test('cloneWidthHeight', function(assert) {
    var done = assert.async();
    createSmallImageObject(function(image) {
      image.clone(function(clone) {
        assert.equal(clone.width, IMG_WIDTH / 2,
          'clone\'s element should have width identical to that of original image');
        assert.equal(clone.height, IMG_HEIGHT / 2,
          'clone\'s element should have height identical to that of original image');
        done();
      });
    });
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Image.fromObject === 'function');

    // should not throw error when no callback is given
    var obj = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_IMG_OBJECT), {
      src: IMG_SRC
    });
    fabric.Image.fromObject(obj, function(instance){
      assert.ok(instance instanceof fabric.Image);
      done();
    });
  });

  QUnit.test('fromObject with clipPath', function(assert) {
    var done = assert.async();
    // should not throw error when no callback is given
    var obj = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_IMG_OBJECT), {
      src: IMG_SRC,
      clipPath: (new fabric.Rect({ width: 100, height: 100 })).toObject(),
    });
    fabric.Image.fromObject(obj, function(instance){
      assert.ok(instance instanceof fabric.Image);
      assert.ok(instance.clipPath instanceof fabric.Rect);
      done();
    });
  });

  QUnit.test('fromObject does not mutate data', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Image.fromObject === 'function');

    var obj = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_IMG_OBJECT), {
      src: IMG_SRC
    });
    var brightness = {
      type: 'Brightness',
      brightness: 0.1
    };
    var contrast = {
      type: 'Contrast',
      contrast: 0.1
    };
    obj.filters = [brightness];
    obj.resizeFilter = contrast;
    var copyOfFilters = obj.filters;
    var copyOfBrighteness = brightness;
    var copyOfContrast = contrast;
    var copyOfObject = obj;
    fabric.Image.fromObject(obj, function(){
      assert.ok(copyOfFilters === obj.filters, 'filters array did not mutate');
      assert.ok(copyOfBrighteness === copyOfFilters[0], 'filter is same object');
      assert.deepEqual(copyOfBrighteness, obj.filters[0], 'did not mutate filter');
      assert.deepEqual(copyOfFilters, obj.filters, 'did not mutate array');
      assert.deepEqual(copyOfContrast, obj.resizeFilter, 'did not mutate object');
      assert.deepEqual(copyOfObject, obj, 'did not change any value');
      assert.ok(copyOfContrast === obj.resizeFilter, 'resizefilter is same object');
      done();
    });
  });

  QUnit.test('fromURL', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Image.fromURL === 'function');
    fabric.Image.fromURL(IMG_SRC, function(instance) {
      assert.ok(instance instanceof fabric.Image);
      assert.deepEqual(REFERENCE_IMG_OBJECT, instance.toObject());
      done();
    });
  });

  QUnit.test('fromElement', function(assert) {
    var done = assert.async();

    var IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

    assert.ok(typeof fabric.Image.fromElement === 'function', 'fromElement should exist');

    var imageEl = makeImageElement({
      width: '14',
      height: '17',
      'xlink:href': IMAGE_DATA_URL
    });

    fabric.Image.fromElement(imageEl, function(imgObject) {
      assert.ok(imgObject instanceof fabric.Image);
      assert.deepEqual(imgObject.get('width'), 14, 'width of an object');
      assert.deepEqual(imgObject.get('height'), 17, 'height of an object');
      assert.deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
      done();
    });
  });

  QUnit.test('fromElement with preserveAspectRatio', function(assert) {
    var done = assert.async();

    var IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

    assert.ok(typeof fabric.Image.fromElement === 'function', 'fromElement should exist');

    var imageEl = makeImageElement({
      width: '140',
      height: '170',
      'xlink:href': IMAGE_DATA_URL
    });

    fabric.Image.fromElement(imageEl, function(imgObject) {
      imgObject._removeTransformMatrix(imgObject.parsePreserveAspectRatioAttribute());
      assert.ok(imgObject instanceof fabric.Image);
      assert.deepEqual(imgObject.get('width'), 14, 'width of an object');
      assert.deepEqual(imgObject.get('height'), 17, 'height of an object');
      assert.deepEqual(imgObject.get('scaleX'), 10, 'scaleX compensate the width');
      assert.deepEqual(imgObject.get('scaleY'), 10, 'scaleY compensate the height');
      assert.deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
      done();
    });
  });

  QUnit.test('fromElement with preserveAspectRatio and smaller bbox', function(assert) {
    var done = assert.async();

    var IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

    assert.ok(typeof fabric.Image.fromElement === 'function', 'fromElement should exist');

    var imageEl = makeImageElement({
      x: '0',
      y: '0',
      width: '70',
      height: '170',
      preserveAspectRatio: 'meet xMidYMid',
      'xlink:href': IMAGE_DATA_URL
    });

    fabric.Image.fromElement(imageEl, function(imgObject) {
      imgObject._removeTransformMatrix(imgObject.parsePreserveAspectRatioAttribute());
      assert.deepEqual(imgObject.get('width'), 14, 'width of an object');
      assert.deepEqual(imgObject.get('height'), 17, 'height of an object');
      assert.deepEqual(imgObject.get('left'), 0, 'left');
      assert.deepEqual(imgObject.get('top'), 42.5, 'top is moved to stay in center');
      assert.deepEqual(imgObject.get('scaleX'), 5, 'scaleX compensate the width');
      assert.deepEqual(imgObject.get('scaleY'), 5, 'scaleY compensate the height');
      assert.deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
      done();
    });
  });

  QUnit.test('fromElement with preserveAspectRatio and smaller bbox xMidYmax', function(assert) {
    var done = assert.async();

    var IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

    assert.ok(typeof fabric.Image.fromElement === 'function', 'fromElement should exist');

    var imageEl = makeImageElement({
      x: '0',
      y: '0',
      width: '70',
      height: '170',
      preserveAspectRatio: 'meet xMidYMax',
      'xlink:href': IMAGE_DATA_URL
    });

    fabric.Image.fromElement(imageEl, function(imgObject) {
      imgObject._removeTransformMatrix(imgObject.parsePreserveAspectRatioAttribute());
      assert.deepEqual(imgObject.get('width'), 14, 'width of an object');
      assert.deepEqual(imgObject.get('height'), 17, 'height of an object');
      assert.deepEqual(imgObject.get('left'), 0, 'left');
      assert.deepEqual(imgObject.get('top'), 85, 'top is moved to stay in center');
      assert.deepEqual(imgObject.get('scaleX'), 5, 'scaleX compensate the width');
      assert.deepEqual(imgObject.get('scaleY'), 5, 'scaleY compensate the height');
      assert.deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
      done();
    });
  });

  QUnit.test('fromElement with preserveAspectRatio and smaller bbox xMidYmin', function(assert) {
    var done = assert.async();

    var IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

    assert.ok(typeof fabric.Image.fromElement === 'function', 'fromElement should exist');

    var imageEl = makeImageElement({
      x: '0',
      y: '0',
      width: '70',
      height: '170',
      preserveAspectRatio: 'meet xMidYMin',
      'xlink:href': IMAGE_DATA_URL
    });

    fabric.Image.fromElement(imageEl, function(imgObject) {
      imgObject._removeTransformMatrix(imgObject.parsePreserveAspectRatioAttribute());
      assert.deepEqual(imgObject.get('width'), 14, 'width of an object');
      assert.deepEqual(imgObject.get('height'), 17, 'height of an object');
      assert.deepEqual(imgObject.get('left'), 0, 'left');
      assert.deepEqual(imgObject.get('top'), 0, 'top is moved to stay in center');
      assert.deepEqual(imgObject.get('scaleX'), 5, 'scaleX compensate the width');
      assert.deepEqual(imgObject.get('scaleY'), 5, 'scaleY compensate the height');
      assert.deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
      done();
    });
  });

  QUnit.test('fromElement with preserveAspectRatio and smaller V bbox xMinYMin', function(assert) {
    var done = assert.async();

    var IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

    assert.ok(typeof fabric.Image.fromElement === 'function', 'fromElement should exist');

    var imageEl = makeImageElement({
      x: '0',
      y: '0',
      width: '140',
      height: '85',
      preserveAspectRatio: 'meet xMinYMin',
      'xlink:href': IMAGE_DATA_URL
    });

    fabric.Image.fromElement(imageEl, function(imgObject) {
      imgObject._removeTransformMatrix(imgObject.parsePreserveAspectRatioAttribute());
      assert.deepEqual(imgObject.get('width'), 14, 'width of an object');
      assert.deepEqual(imgObject.get('height'), 17, 'height of an object');
      assert.deepEqual(imgObject.get('left'), 0, 'left');
      assert.deepEqual(imgObject.get('top'), 0, 'top is moved to stay in center');
      assert.deepEqual(imgObject.get('scaleX'), 5, 'scaleX compensate the width');
      assert.deepEqual(imgObject.get('scaleY'), 5, 'scaleY compensate the height');
      assert.deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
      done();
    });
  });

  QUnit.test('fromElement with preserveAspectRatio and smaller V bbox xMidYmin', function(assert) {
    var done = assert.async();

    var IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

    assert.ok(typeof fabric.Image.fromElement === 'function', 'fromElement should exist');

    var imageEl = makeImageElement({
      x: '0',
      y: '0',
      width: '140',
      height: '85',
      preserveAspectRatio: 'meet xMidYMin',
      'xlink:href': IMAGE_DATA_URL
    });

    fabric.Image.fromElement(imageEl, function(imgObject) {
      imgObject._removeTransformMatrix(imgObject.parsePreserveAspectRatioAttribute());
      assert.deepEqual(imgObject.get('width'), 14, 'width of an object');
      assert.deepEqual(imgObject.get('height'), 17, 'height of an object');
      assert.deepEqual(imgObject.get('left'), 35, 'left');
      assert.deepEqual(imgObject.get('top'), 0, 'top is moved to stay in center');
      assert.deepEqual(imgObject.get('scaleX'), 5, 'scaleX compensate the width');
      assert.deepEqual(imgObject.get('scaleY'), 5, 'scaleY compensate the height');
      assert.deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
      done();
    });
  });

  QUnit.test('fromElement with preserveAspectRatio and smaller V bbox xMaxYMin', function(assert) {
    var done = assert.async();

    var IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNqMU7tOBDEMtENuy614/QE/gZBOuvJK+Et6CiQ6JP6ExxWI7bhL1vgVExYKLPmsTTIzjieHd+MZZSBIAJwEyJU0EWaum+lNljRux3O6nl70Gx/GUwUeyYcDJWZNhMK1aEXYe95Mz4iP44kDTRUZSWSq1YEHri0/HZxXfGSFBN+qDEJTrNI+QXRBviZ7eWCQgjsg+IHiHYB30MhqUxwcmH1Arc2kFDwkBldeFGJLPqs/AbbF2dWgUym6Z2Tb6RVzYxG1wUnmaNcOonZiU0++l6C7FzoQY42g3+8jz+GZ+dWMr1rRH0OjAFhPO+VJFx/vWDqPmk8H97CGBUYUiqAGW0PVe1+aX8j2Ll0tgHtvLx6AK9Tu1ZTFTQ0ojChqGD4qkOzeAuzVfgzsaTym1ClS+IdwtQCFooQMBTumNun1H6Bfcc9/MUn4R3wJMAAZH6MmA4ht4gAAAABJRU5ErkJggg==';

    assert.ok(typeof fabric.Image.fromElement === 'function', 'fromElement should exist');

    var imageEl = makeImageElement({
      x: '0',
      y: '0',
      width: '140',
      height: '85',
      preserveAspectRatio: 'meet xMaxYMin',
      'xlink:href': IMAGE_DATA_URL
    });

    fabric.Image.fromElement(imageEl, function(imgObject) {
      imgObject._removeTransformMatrix(imgObject.parsePreserveAspectRatioAttribute());
      assert.deepEqual(imgObject.get('width'), 14, 'width of an object');
      assert.deepEqual(imgObject.get('height'), 17, 'height of an object');
      assert.deepEqual(imgObject.get('left'), 70, 'left');
      assert.deepEqual(imgObject.get('top'), 0, 'top is moved to stay in center');
      assert.deepEqual(imgObject.get('scaleX'), 5, 'scaleX compensate the width');
      assert.deepEqual(imgObject.get('scaleY'), 5, 'scaleY compensate the height');
      assert.deepEqual(imgObject.getSrc(), IMAGE_DATA_URL, 'src of an object');
      done();
    });
  });

  QUnit.test('consecutive dataURLs give same result.', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      var data1 = image.toDataURL();
      var data2 = image.toDataURL();
      var data3 = image.toDataURL();
      assert.ok(data1 === data2, 'dataurl does not change 1');
      assert.ok(data1 === data3, 'dataurl does not change 2');
      done();
    });
  });

  QUnit.test('apply filters run isNeutralState implementation of filters', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      var run = false;
      image.dirty = false;
      var filter = new fabric.Image.filters.Brightness();
      image.filters = [filter];
      filter.isNeutralState = function() {
        run = true;
      };
      assert.equal(run, false, 'isNeutralState did not run yet');
      image.applyFilters();
      assert.equal(run, true, 'isNeutralState did run');
      done();
    });
  });

  QUnit.test('apply filters set the image dirty', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      image.dirty = false;
      assert.equal(image.dirty, false, 'false apply filter dirty is false');
      image.applyFilters();
      assert.equal(image.dirty, true, 'After apply filter dirty is true');
      done();
    });
  });

  QUnit.test('apply filters reset _element and _filteredEl', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      var contrast = new fabric.Image.filters.Contrast({ contrast: 0.5 });
      image.applyFilters();
      var element = image._element;
      var filtered = image._filteredEl;
      image.filters = [contrast];
      image.applyFilters();
      assert.notEqual(image._element, element, 'image element has changed');
      assert.notEqual(image._filteredEl, filtered, 'image _filteredEl element has changed');
      assert.equal(image._element, image._filteredEl, 'after filtering elements are the same');
      done();
    });
  });

  QUnit.test('apply filters and resize filter', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      var contrast = new fabric.Image.filters.Contrast({ contrast: 0.5 });
      var resizeFilter = new fabric.Image.filters.Resize();
      image.filters = [contrast];
      image.resizeFilter = resizeFilter;
      var element = image._element;
      var filtered = image._filteredEl;
      image.scaleX = 0.4;
      image.scaleY = 0.4;
      image.applyFilters();
      assert.notEqual(image._element, element, 'image element has changed');
      assert.notEqual(image._filteredEl, filtered, 'image _filteredEl element has changed');
      assert.equal(image._element, image._filteredEl, 'after filtering elements are the same');
      image.applyResizeFilters();
      assert.notEqual(image._element, image._filteredEl, 'after resizing the 2 elements differ');
      assert.equal(image._lastScaleX, image.scaleX, 'after resizing we know how much we scaled');
      assert.equal(image._lastScaleY, image.scaleY, 'after resizing we know how much we scaled');
      image.applyFilters();
      assert.equal(image._element, image._filteredEl, 'after filters again the elements changed');
      assert.equal(image._lastScaleX, 1, 'lastScale X is reset');
      assert.equal(image._lastScaleY, 1, 'lastScale Y is reset');
      assert.equal(image._needsResize(), true, 'resizing is needed again');
      done();
    });
  });

  QUnit.test('apply filters set the image dirty and also the group', function(assert) {
    var done = assert.async();
    createImageObject(function(image) {
      var group = new fabric.Group([image]);
      image.dirty = false;
      group.dirty = false;
      assert.equal(image.dirty, false, 'false apply filter dirty is false');
      assert.equal(group.dirty, false, 'false apply filter dirty is false');
      image.applyFilters();
      assert.equal(image.dirty, true, 'After apply filter dirty is true');
      assert.equal(group.dirty, true, 'After apply filter dirty is true');
      done();
    });
  });

  QUnit.test('_renderFill respects source boundaries ', function (assert) {
    fabric.Image.prototype._renderFill.call({
      cropX: -1,
      cropY: -1,
      _filterScalingX: 1,
      _filterScalingY: 1,
      width: 300,
      height: 300,
      _element: {
        naturalWidth: 200,
        height: 200,
      },
    }, {
      drawImage: function(src, sX, sY, sW, sH) {
        assert.ok(sX >= 0, 'sX should be positive');
        assert.ok(sY >= 0, 'sY should be positive');
        assert.ok(sW <= 200, 'sW should not be larger than image width');
        assert.ok(sH <= 200, 'sH should  not be larger than image height');
      }
    });
  });
})();
