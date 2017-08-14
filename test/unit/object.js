(function(){

  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.StaticCanvas();

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) {
      return path;
    }
    var imgEl = _createImageElement();
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  var IMG_SRC = fabric.isLikelyNode ? (__dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif'),
      IMG_WIDTH = 276,
      IMG_HEIGHT  = 110;

  function _createImageElement() {
    return fabric.isLikelyNode ? new (require(fabric.canvasModule).Image)() : fabric.document.createElement('img');
  }

  function createImageObject(callback) {
    var elImage = _createImageElement();
    elImage.width = IMG_WIDTH;
    elImage.height = IMG_HEIGHT;
    setSrc(elImage, IMG_SRC, function() {
      callback(elImage);
    });
  }

  function setSrc(img, src, callback) {
    if (fabric.isLikelyNode) {
      require('fs').readFile(src, function(err, imgData) {
        if (err) {
          throw err;
        };
        img.src = imgData;
        callback && callback();
      });
    }
    else {
      img.src = src;
      callback && callback();
    }
  }

  QUnit.module('fabric.Object', {
    teardown: function() {
      fabric.perfLimitSizeTotal = 2097152;
      fabric.maxCacheSideLimit = 4096;
      fabric.minCacheSideLimit = 256;
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });

  test('constructor & properties', function() {
    ok(typeof fabric.Object == 'function');

    var cObj = new fabric.Object();

    ok(cObj);
    ok(cObj instanceof fabric.Object);
    ok(cObj.constructor === fabric.Object);

    equal(cObj.type, 'object');
    equal(cObj.includeDefaultValues, true);
    equal(cObj.selectable, true);
  });

  test('get', function() {
    var cObj = new fabric.Object({
      left: 11,
      top: 22,
      width: 50,
      height: 60,
      opacity: 0.7
    });

    equal(cObj.get('left'), 11);
    equal(cObj.get('top'), 22);
    equal(cObj.get('width'), 50);
    equal(cObj.get('height'), 60);
    equal(cObj.get('opacity'), 0.7);
  });

  test('set', function() {
    var cObj = new fabric.Object({ left: 11, top: 22, width: 50, height: 60, opacity: 0.7 });

    cObj.set('left', 12);
    cObj.set('top', 23);
    cObj.set('width', 51);
    cObj.set('height', 61);
    cObj.set('opacity', 0.5);

    equal(cObj.get('left'), 12);
    equal(cObj.get('top'), 23);
    equal(cObj.get('width'), 51);
    equal(cObj.get('height'), 61);
    equal(cObj.get('opacity'), 0.5);

    equal(cObj.set('opacity', 0.5), cObj, 'chainable');
  });

  test('set and minScaleLimit', function() {
    var cObj = new fabric.Object({ left: 11, top: 22, width: 50, height: 60, opacity: 0.7 });

    //the min scale limit is given by height.
    equal(cObj.minScaleLimit.toFixed(3), 0.017);

    cObj.set('width', 1000);
    equal(cObj.width, 1000);
    //the min scale limit is given by width.
    equal(cObj.minScaleLimit, 0.001);

    cObj.set('width', 1);
    equal(cObj.width, 1);
    //the min scale limit is given by height.
    equal(cObj.minScaleLimit.toFixed(3), 0.017);
  });

  test('set with object of prop/values', function() {
    var cObj = new fabric.Object({  });

    equal(cObj, cObj.set({ width: 99, height: 88, fill: 'red' }), 'chainable');

    equal('red', cObj.get('fill'));
    equal(99, cObj.get('width'));
    equal(88, cObj.get('height'));
  });

  // test('Dinamically generated accessors', function() {
  //   var cObj = new fabric.Object({ });
  //
  //   equal('function', typeof cObj.getWidth);
  //   equal('function', typeof cObj.setWidth);
  //
  //   equal('function', typeof cObj.getFill);
  //   equal('function', typeof cObj.setFill);
  //
  //   equal(cObj, cObj.setFill('red'), 'chainable');
  //   equal('red', cObj.getFill());
  //
  //   cObj.setScaleX(2.3);
  //   equal(2.3, cObj.getScaleX());
  //
  //   cObj.setOpacity(0.123);
  //   equal(0.123, cObj.getOpacity());
  // });

  test('stateProperties', function() {
    var cObj = new fabric.Object();
    ok(cObj.stateProperties);
    ok(cObj.stateProperties.length > 0);
  });

  test('transform', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.transform == 'function');
  });

  test('toJSON', function() {
    var emptyObjectJSON = '{"type":"object","originX":"left","originY":"top","left":0,"top":0,"width":0,"height":0,"fill":"rgb(0,0,0)",' +
                          '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,' +
                          '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                          '"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over",' +
                          '"transformMatrix":null,"skewX":0,"skewY":0}';

    var augmentedJSON = '{"type":"object","originX":"left","originY":"top","left":0,"top":0,"width":122,"height":0,"fill":"rgb(0,0,0)",' +
                        '"stroke":null,"strokeWidth":1,"strokeDashArray":[5,2],"strokeLineCap":"round","strokeLineJoin":"bevil","strokeMiterLimit":5,' +
                        '"scaleX":1.3,"scaleY":1,"angle":0,"flipX":false,"flipY":true,"opacity":0.88,' +
                        '"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over",' +
                        '"transformMatrix":null,"skewX":0,"skewY":0}';

    var cObj = new fabric.Object();
    ok(typeof cObj.toJSON == 'function');
    equal(JSON.stringify(cObj.toJSON()), emptyObjectJSON);

    cObj.set('opacity', 0.88)
        .set('scaleX', 1.3)
        .set('width', 122)
        .set('flipY', true)
        .set('strokeDashArray', [5, 2])
        .set('strokeLineCap', 'round')
        .set('strokeLineJoin', 'bevil')
        .set('strokeMiterLimit', 5);

    equal(JSON.stringify(cObj.toJSON()), augmentedJSON);
  });

  test('toObject', function() {
    var emptyObjectRepr = {
      'type':                     'object',
      'originX':                  'left',
      'originY':                  'top',
      'left':                     0,
      'top':                      0,
      'width':                    0,
      'height':                   0,
      'fill':                     'rgb(0,0,0)',
      'stroke':                   null,
      'strokeWidth':              1,
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
      'shadow':                   null,
      'visible':                  true,
      'backgroundColor':          '',
      'clipTo':                   null,
      'fillRule':                 'nonzero',
      'globalCompositeOperation': 'source-over',
      'skewX':                      0,
      'skewY':                      0,
      'transformMatrix':          null
    };

    var augmentedObjectRepr = {
      'type':                     'object',
      'originX':                  'left',
      'originY':                  'top',
      'left':                     10,
      'top':                      20,
      'width':                    30,
      'height':                   40,
      'fill':                     'rgb(0,0,0)',
      'stroke':                   null,
      'strokeWidth':              1,
      'strokeDashArray':          [5, 2],
      'strokeLineCap':            'round',
      'strokeLineJoin':           'bevil',
      'strokeMiterLimit':         5,
      'scaleX':                   1,
      'scaleY':                   1,
      'angle':                    0,
      'flipX':                    true,
      'flipY':                    false,
      'opacity':                  0.13,
      'shadow':                   null,
      'visible':                  true,
      'backgroundColor':          '',
      'clipTo':                   null,
      'fillRule':                 'nonzero',
      'globalCompositeOperation': 'source-over',
      'transformMatrix':          null,
      'skewX':                      0,
      'skewY':                      0
    };

    var cObj = new fabric.Object();
    deepEqual(emptyObjectRepr, cObj.toObject());

    cObj.set('left', 10)
        .set('top', 20)
        .set('width', 30)
        .set('height', 40)
        .set('flipX', true)
        .set('opacity', 0.13)
        .set('strokeDashArray', [5, 2])
        .set('strokeLineCap', 'round')
        .set('strokeLineJoin', 'bevil')
        .set('strokeMiterLimit', 5);

    deepEqual(augmentedObjectRepr, cObj.toObject());

    var fractionalValue = 166.66666666666666,
        testedProperties = 'left top width height'.split(' '),
        fractionDigitsDefault = 2;

    function testFractionDigits(fractionDigits, expectedValue) {

      fabric.Object.NUM_FRACTION_DIGITS = fractionDigits;

      testedProperties.forEach(function(property) {
        cObj.set(property, fractionalValue);
        equal(cObj.toObject()[property], expectedValue,
          'value of ' + property + ' should have ' + fractionDigits + ' fractional digits');
      }, this);

      fabric.Object.NUM_FRACTION_DIGITS = fractionDigitsDefault;
    }

    testFractionDigits.call(this, 2, 166.67);
    testFractionDigits.call(this, 3, 166.667);
    testFractionDigits.call(this, 0, 167);
  });

  test('toObject without default values', function() {

    var emptyObjectRepr = { type: 'object' };

    var augmentedObjectRepr = {
      type: 'object',
      left: 10,
      top: 20,
      width: 30,
      height: 40,
      strokeDashArray: [5, 2],
      strokeLineCap: 'round',
      strokeLineJoin: 'bevil',
      strokeMiterLimit: 5,
      flipX: true,
      opacity: 0.13,
      transformMatrix: [3, 0, 3, 1, 0, 0]
    };

    var cObj = new fabric.Object(),
        toObjectObj;
    cObj.includeDefaultValues = false;
    deepEqual(emptyObjectRepr, cObj.toObject());

    cObj.set('left', 10)
        .set('top', 20)
        .set('width', 30)
        .set('height', 40)
        .set('flipX', true)
        .set('opacity', 0.13)
        .set('strokeDashArray', [5, 2])
        .set('strokeLineCap', 'round')
        .set('strokeLineJoin', 'bevil')
        .set('strokeMiterLimit', 5)
        .set('transformMatrix', [3, 0, 3, 1, 0, 0]);
    toObjectObj = cObj.toObject();
    deepEqual(augmentedObjectRepr, toObjectObj);
    notEqual(augmentedObjectRepr.transformMatrix, toObjectObj.transformMatrix);
    deepEqual(augmentedObjectRepr.transformMatrix, toObjectObj.transformMatrix);
    notEqual(augmentedObjectRepr.strokeDashArray, toObjectObj.strokeDashArray);
    deepEqual(augmentedObjectRepr.strokeDashArray, toObjectObj.strokeDashArray);
  });

  test('toDatalessObject', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.toDatalessObject == 'function');
    deepEqual(cObj.toObject(), cObj.toDatalessObject());
  });

  test('toString', function() {
    var cObj = new fabric.Object();
    equal(cObj.toString(), '#<fabric.Object>');
    cObj.type = 'moo';
    equal(cObj.toString(), '#<fabric.Moo>');
  });

  test('render', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.render == 'function');
  });

  test('getBoundingRect', function() {
    var cObj = new fabric.Object({ strokeWidth: 0 }),
        boundingRect;
    ok(typeof cObj.getBoundingRect == 'function');

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    equal(boundingRect.left, 0);
    equal(boundingRect.top, 0);
    equal(boundingRect.width, 0);
    equal(boundingRect.height, 0);
    cObj.set('width', 123).setCoords();
    boundingRect = cObj.getBoundingRect();
    equal(boundingRect.left, 0);
    equal(boundingRect.top, 0);
    equal(boundingRect.width, 123);
    equal(boundingRect.height, 0);

    cObj.set('height', 167).setCoords();
    boundingRect = cObj.getBoundingRect();
    equal(boundingRect.left, 0);
    equal(Math.abs(boundingRect.top).toFixed(13), 0);
    equal(boundingRect.width, 123);
    equal(boundingRect.height, 167);

    cObj.scale(2).setCoords();
    boundingRect = cObj.getBoundingRect();
    equal(boundingRect.left, 0);
    equal(Math.abs(boundingRect.top).toFixed(13), 0);
    equal(boundingRect.width, 246);
    equal(boundingRect.height, 334);
  });

  test('getBoundingRectWithStroke', function() {
    var cObj = new fabric.Object(),
        boundingRect;
    ok(typeof cObj.getBoundingRect == 'function');

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    equal(boundingRect.left.toFixed(2), 0);
    equal(boundingRect.top.toFixed(2), 0);
    equal(boundingRect.width.toFixed(2), 1);
    equal(boundingRect.height.toFixed(2), 1);

    cObj.set('width', 123).setCoords();
    boundingRect = cObj.getBoundingRect();
    equal(boundingRect.left.toFixed(2), 0);
    equal(boundingRect.top.toFixed(2), 0);
    equal(boundingRect.width.toFixed(2), 124);
    equal(boundingRect.height.toFixed(2), 1);

    cObj.set('height', 167).setCoords();
    boundingRect = cObj.getBoundingRect();
    equal(boundingRect.left.toFixed(2), 0);
    equal(boundingRect.top.toFixed(2), 0);
    equal(boundingRect.width.toFixed(2), 124);
    equal(boundingRect.height.toFixed(2), 168);

    cObj.scale(2).setCoords();
    boundingRect = cObj.getBoundingRect();
    equal(boundingRect.left.toFixed(2), 0);
    equal(boundingRect.top.toFixed(2), 0);
    equal(boundingRect.width.toFixed(2), 248);
    equal(boundingRect.height.toFixed(2), 336);
  });

  test('getWidth', function() {
    var cObj = new fabric.Object();
    //ok(typeof cObj.getWidth == 'function');
    equal(cObj.getScaledWidth(), 0 + cObj.strokeWidth);
    cObj.set('width', 123);
    equal(cObj.getScaledWidth(), 123 + cObj.strokeWidth);
    cObj.set('scaleX', 2);
    equal(cObj.getScaledWidth(), 246 + cObj.strokeWidth * 2);
  });

  test('getHeight', function() {
    var cObj = new fabric.Object({strokeWidth: 0});
  //  ok(typeof cObj.getHeight == 'function');
    equal(cObj.getScaledHeight(), 0);
    cObj.set('height', 123);
    equal(cObj.getScaledHeight(), 123);
    cObj.set('scaleY', 2);
    equal(cObj.getScaledHeight(), 246);
  });

  test('rotate', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.rotate == 'function');
    equal(cObj.get('angle'), 0);
    equal(cObj.rotate(45), cObj, 'chainable');
    equal(cObj.get('angle'), 45);
  });

  test('scale', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.scale == 'function');
    equal(cObj.get('scaleX'), 1);
    equal(cObj.get('scaleY'), 1);
    cObj.scale(1.5);
    equal(cObj.get('scaleX'), 1.5);
    equal(cObj.get('scaleY'), 1.5);
    equal(cObj.scale(2), cObj, 'chainable');
  });

  test('scaleToWidth', function() {
    var cObj = new fabric.Object({ width: 560, strokeWidth: 0 });
    ok(typeof cObj.scaleToWidth == 'function');
    equal(cObj.scaleToWidth(100), cObj, 'chainable');
    equal(cObj.getScaledWidth(), 100);
    equal(cObj.get('scaleX'), 100 / 560);
  });

  test('scaleToHeight', function() {
    var cObj = new fabric.Object({ height: 560, strokeWidth: 0 });
    ok(typeof cObj.scaleToHeight == 'function');
    equal(cObj.scaleToHeight(100), cObj, 'chainable');
    equal(cObj.getScaledHeight(), 100);
    equal(cObj.get('scaleY'), 100 / 560);
  });

  test('scaleToWidth on rotated object', function() {
    var obj = new fabric.Object({ height: 100, width: 100, strokeWidth: 0 });
    obj.rotate(45);
    obj.scaleToWidth(200);
    equal(Math.round(obj.getBoundingRect().width), 200);
  });

  test('scaleToHeight on rotated object', function() {
    var obj = new fabric.Object({ height: 100, width: 100, strokeWidth: 0 });
    obj.rotate(45);
    obj.scaleToHeight(300);
    equal(Math.round(obj.getBoundingRect().height), 300);
  });

  test('setOpacity', function() {
    var cObj = new fabric.Object();
    equal(cObj.get('opacity'), 1);
    cObj.set('opacity', 0.68);
    equal(cObj.get('opacity'), 0.68);
    equal(cObj.set('opacity', 1), cObj, 'chainable');
  });

  test('getAngle', function() {
    var cObj = new fabric.Object();
    equal(cObj.get('angle'), 0);
    cObj.rotate(45);
    equal(cObj.get('angle'), 45);
  });

  test('rotate', function() {
    var cObj = new fabric.Object();
    equal(cObj.get('angle'), 0);
    equal(cObj.set('angle', 45), cObj, 'chainable');
    equal(cObj.get('angle'), 45);
  });

  test('drawBorders', function() {
    var cObj = new fabric.Object(), canvas = fabric.document.createElement('canvas');

    var dummyContext = canvas.getContext('2d');

    ok(typeof cObj.drawBorders == 'function');
    equal(cObj.drawBorders(dummyContext), cObj, 'chainable');
  });

  test('drawControls', function() {
    var cObj = new fabric.Object(), canvas = fabric.document.createElement('canvas');

    var dummyContext = canvas.getContext('2d');
    ok(typeof cObj.drawControls == 'function');
    equal(cObj.drawControls(dummyContext), cObj, 'chainable');
  });

  test('clone', function() {
    var cObj = new fabric.Object({ left: 123, top: 456, opacity: 0.66 });
    ok(typeof cObj.clone == 'function');
    cObj.clone(function(clone) {
      equal(clone.get('left'), 123);
      equal(clone.get('top'), 456);
      equal(clone.get('opacity'), 0.66);

      // augmenting clone properties should not affect original instance
      clone.set('left', 12).set('scaleX', 2.5).rotate(33);

      equal(cObj.get('left'), 123);
      equal(cObj.get('scaleX'), 1);
      equal(cObj.get('angle'), 0);
    });
  });

  asyncTest('cloneAsImage', function() {
    var cObj = new fabric.Rect({ width: 100, height: 100, fill: 'red', strokeWidth: 0 });

    ok(typeof cObj.cloneAsImage == 'function');

    if (!fabric.Canvas.supports('toDataURL')) {
      fabric.log('`toDataURL` is not supported by this environment; skipping `cloneAsImage` test (as it relies on `toDataURL`)');
      start();
    }
    else {
      cObj.cloneAsImage(function(image) {
        ok(image);
        ok(image instanceof fabric.Image);
        equal(image.width, 100, 'the image has same dimension of object');
        start();
      });
    }
  });

  asyncTest('cloneAsImage with retina scaling enabled', function() {
    var cObj = new fabric.Rect({ width: 100, height: 100, fill: 'red', strokeWidth: 0 });
    fabric.devicePixelRatio = 2;
    if (!fabric.Canvas.supports('toDataURL')) {
      fabric.log('`toDataURL` is not supported by this environment; skipping `cloneAsImage` test (as it relies on `toDataURL`)');
      start();
    }
    else {
      cObj.cloneAsImage(function(image) {
        ok(image);
        ok(image instanceof fabric.Image);
        equal(image.width, 200, 'the image has been scaled by retina');
        fabric.devicePixelRatio = 1;
        start();
      }, { enableRetinaScaling: true });
    }
  });

  test('toDataURL', function() {
    // var data =
    //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQA'+
    //   'AABkCAYAAABw4pVUAAAA+UlEQVR4nO3RoRHAQBDEsOu/6YR+B2s'+
    //   'gIO4Z3919pMwDMCRtHoAhafMADEmbB2BI2jwAQ9LmARiSNg/AkLR5AI'+
    //   'akzQMwJG0egCFp8wAMSZsHYEjaPABD0uYBGJI2D8CQtHkAhqTNAzAkbR'+
    //   '6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPwJC0eQCGpM0DMCRtHoAhafMADEm'+
    //   'bB2BI2jwAQ9LmARiSNg/AkLR5AIakzQMwJG0egCFp8wAMSZsHYEjaPABD0'+
    //   'uYBGJI2D8CQtHkAhqTNAzAkbR6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPw'+
    //   'JC0eQCGpM0DMCRtHsDjB5K06yueJFXJAAAAAElFTkSuQmCC';

    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red', strokeWidth: 0
    });

    ok(typeof cObj.toDataURL == 'function');

    if (!fabric.Canvas.supports('toDataURL')) {
      window.alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
    }
    else {
      var dataURL = cObj.toDataURL();
      equal(typeof dataURL, 'string');
      equal(dataURL.substring(0, 21), 'data:image/png;base64');

      try {
        dataURL = cObj.toDataURL({ format: 'jpeg' });
        equal(dataURL.substring(0, 22), 'data:image/jpeg;base64');
      }
      catch (err) {
        fabric.log('jpeg toDataURL not supported');
      }
    }
  });

  test('toDataURL & reference to canvas', function() {
  // var data =
  //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQA'+
  //   'AABkCAYAAABw4pVUAAAA+UlEQVR4nO3RoRHAQBDEsOu/6YR+B2s'+
  //   'gIO4Z3919pMwDMCRtHoAhafMADEmbB2BI2jwAQ9LmARiSNg/AkLR5AI'+
  //   'akzQMwJG0egCFp8wAMSZsHYEjaPABD0uYBGJI2D8CQtHkAhqTNAzAkbR'+
  //   '6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPwJC0eQCGpM0DMCRtHoAhafMADEm'+
  //   'bB2BI2jwAQ9LmARiSNg/AkLR5AIakzQMwJG0egCFp8wAMSZsHYEjaPABD0'+
  //   'uYBGJI2D8CQtHkAhqTNAzAkbR6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPw'+
  //   'JC0eQCGpM0DMCRtHsDjB5K06yueJFXJAAAAAElFTkSuQmCC';

    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red'
    });
    canvas.add(cObj);

    if (!fabric.Canvas.supports('toDataURL')) {
      window.alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
    }
    else {
      var objCanvas = cObj.canvas;
      cObj.toDataURL();

      equal(objCanvas, cObj.canvas);
    }
  });

  test('isType', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.isType == 'function');
    ok(cObj.isType('object'));
    ok(!cObj.isType('rect'));
    cObj = new fabric.Rect();
    ok(cObj.isType('rect'));
    ok(!cObj.isType('object'));
  });

  test('toggle', function() {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    ok(typeof object.toggle == 'function');

    object.set('flipX', false);
    equal(object.toggle('flipX'), object, 'should be chainable');
    equal(object.get('flipX'), true);
    object.toggle('flipX');
    equal(object.get('flipX'), false);

    object.set('left', 112.45);
    object.toggle('left');
    equal(object.get('left'), 112.45, 'non boolean properties should not be affected');
  });

  test('_setLineDash', function() {
    var object = new fabric.Rect({ left: 100, top: 124, width: 210, height: 66, stroke: 'black', strokeWidth: 2});
    ok(typeof object._setLineDash === 'function');
    object.strokeDashArray = [3, 2, 1];
    equal(object.strokeDashArray.length, 3, 'strokeDash array is odd');
    object._setLineDash(canvas.contextContainer, object.strokeDashArray, null);
    equal(object.strokeDashArray.length, 6, 'strokeDash array now is even');
  });

  test('straighten', function() {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    ok(typeof object.straighten == 'function');

    object.rotate(123.456);
    object.straighten();
    equal(object.get('angle'), 90);

    object.rotate(97.111);
    object.straighten();
    equal(object.get('angle'), 90);

    object.rotate(3.45);
    object.straighten();
    equal(object.get('angle'), 0);

    object.rotate(-157);
    object.straighten();
    equal(object.get('angle'), -180);

    object.rotate(159);
    object.straighten();
    equal(object.get('angle'), 180);

    object.rotate(999);
    object.straighten();
    equal(object.get('angle'), 270);
  });

  asyncTest('fxStraighten', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    var onCompleteFired = false;
    var onComplete = function(){ onCompleteFired = true; };

    var onChangeFired = false;
    var onChange = function(){ onChangeFired = true; };

    var callbacks = { onComplete: onComplete, onChange: onChange };
    ok(typeof object.fxStraighten == 'function');
    equal(object.fxStraighten(callbacks), object, 'should be chainable');
    equal(fabric.util.toFixed(object.get('angle'), 0), 43);
    setTimeout(function(){
      ok(onCompleteFired);
      ok(onChangeFired);
      equal(object.get('angle'), 0, 'angle should be set to 0 by the end of animation');
      equal(object.fxStraighten(), object, 'should work without callbacks');
      start();
    }, 1000);
  });

  test('observable', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    var fooFired = false,
        barFired = false;

    object.on('foo', function(){ fooFired = true; });
    object.on('bar', function(){ barFired = true; });

    object.fire('foo');
    ok(fooFired);
    ok(!barFired);

    object.fire('bar');
    ok(fooFired);
    ok(barFired);

    var firedOptions;
    object.on('baz', function(options) { firedOptions = options; });
    object.fire('baz', { param1: 'abrakadabra', param2: 3.1415 });

    equal('abrakadabra', firedOptions.param1);
    equal(3.1415, firedOptions.param2);
  });

  test('object:added', function() {
    var object = new fabric.Object();
    var addedEventFired = false;

    object.on('added', function(){ addedEventFired = true; });
    canvas.add(object);

    ok(addedEventFired);
  });

  test('canvas reference', function() {
    var object = new fabric.Object();
    var object2 = new fabric.Object();

    canvas.add(object);
    canvas.insertAt(object2, 0);

    ok(object.canvas === canvas);
    ok(object2.canvas === canvas);
  });

  test('object:removed', function() {
    var object = new fabric.Object();
    var removedEventFired = false;

    canvas.add(object);

    object.on('removed', function(){ removedEventFired = true; });
    canvas.remove(object);

    ok(removedEventFired);
  });

  test('center', function() {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    ok(typeof object.center == 'function');

    canvas.add(object);
    equal(object.center(), object, 'should be chainable');

    equal(object.getCenterPoint().x, canvas.getWidth() / 2);
    equal(object.getCenterPoint().y, canvas.getHeight() / 2);

    canvas.setZoom(2);
    object.center();
    equal(object.getCenterPoint().x, canvas.getWidth() / 2, 'object center.x is in canvas center when the canvas is transformed');
    equal(object.getCenterPoint().y, canvas.getHeight() / 2, 'object center.y is in canvas center when the canvas is transformed');

  });

  test('centerH', function() {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    ok(typeof object.centerH == 'function');
    var oldY = object.top;

    canvas.add(object);
    equal(object.centerH(), object, 'should be chainable');

    equal(object.getCenterPoint().x, canvas.getWidth() / 2);
    equal(object.top, oldY, 'object top did not change');
    canvas.setZoom(2);
    object.centerH();
    equal(object.getCenterPoint().x, canvas.getWidth() / 2, 'object center.x is in canvas center when the canvas is transformed');
  });

  test('centerV', function() {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    ok(typeof object.centerV == 'function');
    var oldX = object.left;

    canvas.add(object);
    equal(object.centerV(), object, 'should be chainable');
    equal(object.left, oldX, 'object top did not change');
    equal(object.getCenterPoint().y, canvas.getHeight() / 2);

    canvas.setZoom(2);
    object.centerV();
    equal(object.getCenterPoint().y, canvas.getHeight() / 2, 'object center.y is in canvas center when the canvas is transformed');
  });

  test('viewportCenter', function() {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    ok(typeof object.viewportCenter == 'function');

    canvas.add(object);
    equal(object.viewportCenter(), object, 'should be chainable');

    equal(object.getCenterPoint().x, canvas.getWidth() / 2);
    equal(object.getCenterPoint().y, canvas.getHeight() / 2);

    canvas.setZoom(2);
    object.viewportCenter();
    equal(object.getCenterPoint().x, canvas.getWidth() / (2 * canvas.getZoom()));
    equal(object.getCenterPoint().y, canvas.getHeight() / (2 * canvas.getZoom()));
  });

  test('viewportCenterH', function() {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    ok(typeof object.viewportCenterH == 'function');

    var oldY = object.top;
    canvas.add(object);
    equal(object.viewportCenterH(), object, 'should be chainable');
    equal(object.getCenterPoint().x, canvas.getWidth() / 2);
    equal(object.top, oldY, 'object top did not change');
    canvas.setZoom(2);
    object.viewportCenterH();
    equal(object.getCenterPoint().x, canvas.getWidth() / (2 * canvas.getZoom()));
    equal(object.top, oldY, 'object top did not change');
  });

  test('viewportCenterV', function() {
    var object = new fabric.Object();
    object.strokeWidth = 0;
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    ok(typeof object.viewportCenterV == 'function');

    var oldX = object.left;

    canvas.add(object);
    equal(object.viewportCenterV(), object, 'should be chainable');
    equal(object.getCenterPoint().y, canvas.getHeight() / 2);
    equal(object.left, oldX, 'object left did not change');
    canvas.setZoom(2);
    object.viewportCenterV();
    equal(object.getCenterPoint().y, canvas.getHeight() / (2 * canvas.getZoom()));
    equal(object.left, oldX, 'object left did not change');
  });


  test('sendToBack', function() {
    var object = new fabric.Object();

    ok(typeof object.sendToBack == 'function');

    canvas.add(object);
    equal(object.sendToBack(), object, 'should be chainable');
  });

  test('bringToFront', function() {
    var object = new fabric.Object();

    ok(typeof object.bringToFront == 'function');

    canvas.add(object);
    equal(object.bringToFront(), object, 'should be chainable');
  });

  test('sendBackwards', function() {
    var object = new fabric.Object();

    ok(typeof object.sendBackwards == 'function');

    canvas.add(object);
    equal(object.sendBackwards(), object, 'should be chainable');
  });

  test('bringForward', function() {
    var object = new fabric.Object();

    ok(typeof object.bringForward == 'function');

    canvas.add(object);
    equal(object.bringForward(), object, 'should be chainable');
  });

  test('moveTo', function() {
    var object = new fabric.Object();

    ok(typeof object.moveTo == 'function');

    canvas.add(object);
    equal(object.moveTo(), object, 'should be chainable');
  });

  test('setGradient', function() {
    var object = new fabric.Object();

    ok(typeof object.setGradient == 'function');

    equal(object.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      colorStops: {
        '0': 'rgb(255,0,0)',
        '1': 'rgb(0,128,0)'
      }
    }), object, 'should be chainable');

    ok(typeof object.toObject().fill == 'object');
    ok(object.fill instanceof fabric.Gradient);

    var fill = object.fill;

    equal(fill.type, 'linear');

    equal(fill.coords.x1, 0);
    equal(fill.coords.y1, 0);

    equal(fill.coords.x2, 100);
    equal(fill.coords.y2, 100);

    equal(fill.colorStops[0].offset, 0);
    equal(fill.colorStops[1].offset, 1);
    equal(fill.colorStops[0].color, 'rgb(255,0,0)');
    equal(fill.colorStops[1].color, 'rgb(0,128,0)');
  });

  test('setGradient with gradientTransform', function() {
    var object = new fabric.Object();

    ok(typeof object.setGradient == 'function');

    equal(object.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      gradientTransform: [1, 0, 0, 4, 5, 5],
      colorStops: {
        '0': 'rgb(255,0,0)',
        '1': 'rgb(0,128,0)'
      }
    }), object, 'should be chainable');

    ok(typeof object.toObject().fill == 'object');
    ok(object.fill instanceof fabric.Gradient);

    var fill = object.fill;

    equal(fill.type, 'linear');

    equal(fill.coords.x1, 0);
    equal(fill.coords.y1, 0);

    equal(fill.coords.x2, 100);
    equal(fill.coords.y2, 100);

    deepEqual(fill.gradientTransform, [1, 0, 0, 4, 5, 5]);

    equal(fill.colorStops[0].offset, 0);
    equal(fill.colorStops[1].offset, 1);
    equal(fill.colorStops[0].color, 'rgb(255,0,0)');
    equal(fill.colorStops[1].color, 'rgb(0,128,0)');
  });

  asyncTest('setPatternFill', function() {
    var object = new fabric.Object();

    ok(typeof object.setPatternFill == 'function');

    createImageObject(function(img) {
      equal(object.setPatternFill({source: img}), object, 'should be chainable');

      ok(typeof object.toObject().fill == 'object');
      ok(object.fill instanceof fabric.Pattern);

      equal(object.fill.source, img);
      equal(object.fill.repeat, 'repeat');
      equal(object.fill.offsetX, 0);
      equal(object.fill.offsetY, 0);

      equal(object.setPatternFill({source: img, repeat: 'repeat-y', offsetX: 100, offsetY: 50}), object, 'should be chainable');

      ok(typeof object.fill == 'object');
      ok(object.fill instanceof fabric.Pattern);

      equal(object.fill.source, img);
      equal(object.fill.repeat, 'repeat-y');
      equal(object.fill.offsetX, 100);
      equal(object.fill.offsetY, 50);

      start();
    });
  });

  test('setShadow', function() {
    var object = new fabric.Object();

    ok(typeof object.setShadow == 'function');

    equal(object.setShadow({
      color: 'red',
      blur: 10,
      offsetX: 5,
      offsetY: 15
    }), object, 'should be chainable');

    ok(typeof object.toObject().shadow == 'object');
    ok(object.shadow instanceof fabric.Shadow);

    equal(object.shadow.color, 'red');
    equal(object.shadow.blur, 10);
    equal(object.shadow.offsetX, 5);
    equal(object.shadow.offsetY, 15);

    equal(object.setShadow(null), object, 'should be chainable');
    ok(!(object.shadow instanceof fabric.Shadow));
    equal(object.shadow, null);

  });

  test('set shadow', function() {
    var object = new fabric.Object();

    object.set('shadow', '10px 5px 0 #FF0000');

    ok(object.shadow instanceof fabric.Shadow);

    equal(object.shadow.color, '#FF0000');
    equal(object.shadow.blur, 0);
    equal(object.shadow.offsetX, 10);
    equal(object.shadow.offsetY, 5);

    object.set('shadow', null);

    ok(!(object.shadow instanceof fabric.Shadow));

    equal(object.shadow, null);
  });

  test('setColor', function(){
    var object = new fabric.Object();

    ok(typeof object.setColor == 'function');

    equal(object.setColor('123456'), object, 'should be chainable');
    equal(object.get('fill'), '123456');
  });

  test('clipTo', function() {
    var object = new fabric.Object({
      left: 40,
      top: 40,
      width: 40,
      height: 50,
      clipTo: function(ctx) { ctx.arc(10, 10, 10, 0, Math.PI * 2, false); }
    });

    equal(typeof object.clipTo, 'function');

    var deserializedObject = new fabric.Object(JSON.parse(JSON.stringify(object)));
    equal(typeof deserializedObject.clipTo, 'function');
  });

  test('getObjectScale', function() {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    var objectScale = object.getObjectScaling();
    deepEqual(objectScale, {scaleX: object.scaleX, scaleY: object.scaleY});
  });

  test('getObjectScale in group', function() {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    var group = new fabric.Group();
    group.scaleX = 2;
    group.scaleY = 2;
    object.group = group;
    var objectScale = object.getObjectScaling();
    deepEqual(objectScale, {
      scaleX: object.scaleX * group.scaleX,
      scaleY: object.scaleY * group.scaleY
    });
  });

  test('dirty flag on set property', function() {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    object.cacheProperties = ['propA', 'propB'];
    object.dirty = false;
    equal(object.dirty, false, 'object starts with dirty flag disabled');
    object.set('propC', '3');
    equal(object.dirty, false, 'after setting a property out of cache, dirty flag is still false');
    object.set('propA', '2');
    equal(object.dirty, true, 'after setting a property from cache, dirty flag is true');
  });

  test('isCacheDirty statefullCache disabled', function() {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2, width: 1, height: 2});
    equal(object.dirty, true, 'object is dirty after creation');
    object.cacheProperties = ['propA', 'propB'];
    object.dirty = false;
    object.statefullCache = false;
    object._createCacheCanvas();
    equal(object.isCacheDirty(), false, 'object is not dirty if dirty flag is false');
    object.dirty = true;
    equal(object.isCacheDirty(), true, 'object is dirty if dirty flag is true');
  });

  test('isCacheDirty statefullCache enabled', function() {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2, width: 1, height: 2});
    object.cacheProperties = ['propA', 'propB'];
    object.dirty = false;
    object.statefullCache = true;
    object.propA = 'A';
    object.setupState({ propertySet: 'cacheProperties' });
    object._createCacheCanvas();
    equal(object.isCacheDirty(), true, 'object is dirty if canvas has been just created');
    object.setupState({ propertySet: 'cacheProperties' });
    equal(object.isCacheDirty(), false, 'object is not dirty');
    object.propA = 'B';
    equal(object.isCacheDirty(), true, 'object is dirty because change in propA is detected by statefullCache');
  });

  test('_getCacheCanvasDimensions returns dimensions and zoom for cache canvas', function() {
    var object = new fabric.Object({ width: 10, height: 10, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    deepEqual(dims, { width: 12, height: 12, zoomX: 1, zoomY: 1 }, 'if no scaling is applied cache is as big as object');
    object.strokeWidth = 2;
    dims = object._getCacheCanvasDimensions();
    deepEqual(dims, { width: 14, height: 14, zoomX: 1, zoomY: 1 }, 'cache contains the stroke');
    object.scaleX = 2;
    object.scaleY = 3;
    dims = object._getCacheCanvasDimensions();
    deepEqual(dims, { width: 26, height: 38, zoomX: 2, zoomY: 3 }, 'cache is as big as the scaled object');
  });

  test('_updateCacheCanvas check if cache canvas should be updated', function() {
    fabric.perfLimitSizeTotal = 10000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 1;
    var object = new fabric.Object({ width: 10, height: 10, strokeWidth: 0 });
    object._createCacheCanvas();
    equal(object.cacheWidth, 12, 'current cache dimensions are saved');
    equal(object.cacheHeight, 12, 'current cache dimensions are saved');
    equal(object._updateCacheCanvas(), false, 'second execution of cache canvas return false');
    object.scaleX = 2;
    equal(object._updateCacheCanvas(), true, 'if scale change, it returns true');
    equal(object.cacheWidth, 22, 'current cache dimensions is updated');
    equal(object.zoomX, 2, 'current scale level is saved');
    object.width = 2;
    equal(object._updateCacheCanvas(), true, 'if dimension change, it returns true');
    equal(object.cacheWidth, 6, 'current cache dimensions is updated');
    object.strokeWidth = 2;
    equal(object._updateCacheCanvas(), true, 'if strokeWidth change, it returns true');
  });

  test('_limitCacheSize limit min to 256', function() {
    fabric.perfLimitSizeTotal = 10000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 200, height: 200, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    equal(dims, limitedDims, 'object is mutated');
    equal(dims.width, 256, 'width gets minimum to the cacheSideLimit');
    equal(dims.height, 256, 'height gets minimum to the cacheSideLimit');
    equal(zoomX, dims.zoomX, 'zoom factor X does not need a change');
    equal(zoomY, dims.zoomY, 'zoom factor Y does not need a change');
  });

  test('_limitCacheSize does not limit if not necessary', function() {
    fabric.perfLimitSizeTotal = 1000000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 400, height: 400, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    equal(dims, limitedDims, 'object is mutated');
    equal(dims.width, 402, 'width is in the middle of limits');
    equal(dims.height, 402, 'height is in the middle of limits');
    equal(zoomX, dims.zoomX, 'zoom factor X does not need a change');
    equal(zoomY, dims.zoomY, 'zoom factor Y does not need a change');
  });

  test('_limitCacheSize does cap up minCacheSideLimit', function() {
    fabric.perfLimitSizeTotal = 10000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 400, height: 400, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var width = dims.width;
    var height = dims.height;
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    equal(dims, limitedDims, 'object is mutated');
    equal(dims.width, 256, 'width is capped to min');
    equal(dims.height, 256, 'height is capped to min');
    equal(zoomX * dims.width / width, dims.zoomX, 'zoom factor X gets updated to represent the shrink');
    equal(zoomY * dims.height / height, dims.zoomY, 'zoom factor Y gets updated to represent the shrink');
  });

  test('_limitCacheSize does cap up if necessary', function() {
    fabric.perfLimitSizeTotal = 1000000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 2046, height: 2046, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var width = dims.width;
    var height = dims.height;
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    equal(dims, limitedDims, 'object is mutated');
    equal(dims.width, 1000, 'width is capped to max allowed by area');
    equal(dims.height, 1000, 'height is capped to max allowed by area');
    equal(zoomX * dims.width / width, dims.zoomX, 'zoom factor X gets updated to represent the shrink');
    equal(zoomY * dims.height / height, dims.zoomY, 'zoom factor Y gets updated to represent the shrink');
  });

  test('_limitCacheSize does cap up if necessary to maxCacheSideLimit', function() {
    fabric.perfLimitSizeTotal = 100000000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 8192, height: 8192, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    equal(dims, limitedDims, 'object is mutated');
    equal(dims.width, fabric.maxCacheSideLimit, 'width is capped to max allowed by fabric');
    equal(dims.height, fabric.maxCacheSideLimit, 'height is capped to max allowed by fabric');
    equal(dims.zoomX, zoomX * 4096 / 8194, 'zoom factor X gets updated to represent the shrink');
    equal(dims.zoomY, zoomY * 4096 / 8194, 'zoom factor Y gets updated to represent the shrink');
  });

  test('_limitCacheSize does cap up if necessary to maxCacheSideLimit, different AR', function() {
    fabric.perfLimitSizeTotal = 100000000;
    fabric.maxCacheSideLimit = 4096;
    fabric.minCacheSideLimit = 256;
    var object = new fabric.Object({ width: 16384, height: 8192, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var width = dims.width;
    var height = dims.height;
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    equal(dims, limitedDims, 'object is mutated');
    equal(dims.width, fabric.maxCacheSideLimit, 'width is capped to max allowed by fabric');
    equal(dims.height, fabric.maxCacheSideLimit, 'height is capped to max allowed by fabric');
    equal(dims.zoomX, zoomX * fabric.maxCacheSideLimit / width, 'zoom factor X gets updated to represent the shrink');
    equal(dims.zoomY, zoomY * fabric.maxCacheSideLimit / height, 'zoom factor Y gets updated to represent the shrink');
  });

  test('_setShadow', function(){
    var el = fabric.document.createElement('canvas');
    el.width = 600; el.height = 600;
    var canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.StaticCanvas(el);
    var context = canvas.contextContainer;
    var object = new fabric.Object({ scaleX: 1, scaleY: 1});
    var group = new fabric.Group();
    group.scaleX = 2;
    group.scaleY = 2;
    object.setShadow({
      color: 'red',
      blur: 10,
      offsetX: 5,
      offsetY: 15
    });
    object._setShadow(context);
    equal(context.shadowOffsetX, object.shadow.offsetX);
    equal(context.shadowOffsetY, object.shadow.offsetY);
    equal(context.shadowBlur, object.shadow.blur);
    object.scaleX = 2;
    object.scaleY = 3;
    object._setShadow(context);
    equal(context.shadowOffsetX, object.shadow.offsetX * object.scaleX);
    equal(context.shadowOffsetY, object.shadow.offsetY * object.scaleY);
    equal(context.shadowBlur, object.shadow.blur * (object.scaleX + object.scaleY) / 2);
    object.group = group;
    object._setShadow(context);
    equal(context.shadowOffsetX, object.shadow.offsetX * object.scaleX * group.scaleX);
    equal(context.shadowOffsetY, object.shadow.offsetY * object.scaleY * group.scaleY);
    equal(context.shadowBlur, object.shadow.blur * (object.scaleX * group.scaleX + object.scaleY * group.scaleY) / 2);
  });

  test('willDrawShadow', function() {
    var object = new fabric.Object({ shadow: { offsetX: 0, offsetY: 0 }});
    equal(object.willDrawShadow(), false, 'object will not drawShadow');
    object.shadow.offsetX = 1;
    equal(object.willDrawShadow(), true, 'object will drawShadow');
  });
})();
