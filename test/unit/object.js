(function(){

  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.StaticCanvas();

  QUnit.module('fabric.Object', {
    teardown: function() {
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

  test('set with object of prop/values', function() {
    var cObj = new fabric.Object({  });

    equal(cObj, cObj.set({ width: 99, height: 88, fill: 'red' }), 'chainable');

    equal('red', cObj.get('fill'));
    equal(99, cObj.get('width'));
    equal(88, cObj.get('height'));
  });

  test('Dinamically generated accessors', function() {
    var cObj = new fabric.Object({ });

    equal('function', typeof cObj.getWidth);
    equal('function', typeof cObj.setWidth);

    equal('function', typeof cObj.getFill);
    equal('function', typeof cObj.setFill);

    equal(cObj, cObj.setFill('red'), 'chainable');
    equal('red', cObj.getFill());

    cObj.setScaleX(2.3);
    equal(2.3, cObj.getScaleX());

    cObj.setOpacity(0.123)
    equal(0.123, cObj.getOpacity());
  });

  test('setSourcePath', function() {
    var cObj = new fabric.Object();
    var SRC_PATH = 'http://example.com/';

    ok(typeof cObj.setSourcePath == 'function');

    cObj.setSourcePath(SRC_PATH);
    equal(cObj.get('sourcePath'), SRC_PATH);
  });

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
    var emptyObjectJSON = '{"type":"object","originX":"center","originY":"center","left":0,"top":0,"width":0,"height":0,"fill":"rgb(0,0,0)",'+
                          '"overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,'+
                          '"flipX":false,"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":true,'+
                          '"transparentCorners":true,"perPixelTargetFind":false,"shadow":null,"visible":true}';

    var augmentedJSON = '{"type":"object","originX":"center","originY":"center","left":0,"top":0,"width":122,"height":0,"fill":"rgb(0,0,0)",'+
                        '"overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1.3,"scaleY":1,"angle":0,'+
                        '"flipX":false,"flipY":true,"opacity":0.88,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":true,'+
                        '"transparentCorners":true,"perPixelTargetFind":false,"shadow":null,"visible":true}';

    var cObj = new fabric.Object();
    ok(typeof cObj.toJSON == 'function');
    equal(JSON.stringify(cObj.toJSON()), emptyObjectJSON);

    cObj.set('opacity', 0.88).set('scaleX', 1.3).set('width', 122).set('flipY', true);
    equal(JSON.stringify(cObj.toJSON()), augmentedJSON);
  });

  test('toObject', function() {
    var emptyObjectRepr = {
      'type': "object",
      'originX': 'center',
      'originY': 'center',
      'left': 0,
      'top': 0,
      'width': 0,
      'height': 0,
      'fill': 'rgb(0,0,0)',
      'overlayFill': null,
      'stroke': null,
      'strokeWidth': 1,
      'strokeDashArray': null,
      'scaleX': 1,
      'scaleY': 1,
      'angle': 0,
      'flipX': false,
      'flipY': false,
      'opacity': 1,
      'selectable': true,
      'hasControls': true,
      'hasBorders': true,
      'hasRotatingPoint': true,
      'transparentCorners': true,
      'perPixelTargetFind': false,
      'shadow': null,
      'visible': true
    };

    var augmentedObjectRepr = {
      'type': "object",
      'originX': 'center',
      'originY': 'center',
      'left': 10,
      'top': 20,
      'width': 30,
      'height': 40,
      'fill': 'rgb(0,0,0)',
      'overlayFill': null,
      'stroke': null,
      'strokeWidth': 1,
      'strokeDashArray': null,
      'scaleX': 1,
      'scaleY': 1,
      'angle': 0,
      'flipX': true,
      'flipY': false,
      'opacity': 0.13,
      'selectable': false,
      'hasControls': true,
      'hasBorders': true,
      'hasRotatingPoint': true,
      'transparentCorners': true,
      'perPixelTargetFind': false,
      'shadow': null,
      'visible': true
    };

    var cObj = new fabric.Object();
    deepEqual(emptyObjectRepr, cObj.toObject());

    cObj.set('left', 10)
        .set('top', 20)
        .set('width', 30)
        .set('height', 40)
        .set('flipX', true)
        .set('opacity', 0.13)
        .set('selectable', false);

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

  test('toDatalessObject', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.toDatalessObject == 'function');
    deepEqual(cObj.toObject(), cObj.toDatalessObject());
  });

  test('isActive', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.isActive == 'function');
    ok(!cObj.isActive(), 'initially not active');
    cObj.setActive(true);
    ok(cObj.isActive());
  });

  test('setActive', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.setActive == 'function');
    equal(cObj.setActive(true), cObj, 'chainable?');
    ok(cObj.isActive());
    cObj.setActive(false);
    ok(!cObj.isActive());
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

  test('getWidth', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.getWidth == 'function');
    equal(cObj.getWidth(), 0);
    cObj.set('width', 123);
    equal(cObj.getWidth(), 123);
    cObj.set('scaleX', 2);
    equal(cObj.getWidth(), 246);
  });

  test('getHeight', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.getHeight == 'function');
    equal(cObj.getHeight(), 0);
    cObj.set('height', 123);
    equal(cObj.getHeight(), 123);
    cObj.set('scaleY', 2);
    equal(cObj.getHeight(), 246);
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
    var cObj = new fabric.Object({ width: 560 });
    ok(typeof cObj.scaleToWidth == 'function');
    equal(cObj.scaleToWidth(100), cObj, 'chainable');
    equal(cObj.getWidth(), 100);
    equal(cObj.get('scaleX'), 100/560);
  });

  test('scaleToHeight', function() {
    var cObj = new fabric.Object({ height: 560 });
    ok(typeof cObj.scaleToHeight == 'function');
    equal(cObj.scaleToHeight(100), cObj, 'chainable');
    equal(cObj.getHeight(), 100);
    equal(cObj.get('scaleY'), 100/560);
  });

  test('scaleToWidth on rotated object', function() {
    var obj = new fabric.Object({ height: 100, width: 100 });
    obj.rotate(45);
    obj.scaleToWidth(200);
    equal(Math.round(obj.getBoundingRectWidth()), 200);
  });

  test('scaleToHeight on rotated object', function() {
    var obj = new fabric.Object({ height: 100, width: 100 });
    obj.rotate(45);
    obj.scaleToHeight(300);
    equal(Math.round(obj.getBoundingRectHeight()), 300);
  });

  test('setOpacity', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.setOpacity == 'function');
    equal(cObj.get('opacity'), 1);
    cObj.setOpacity(0.68);
    equal(cObj.get('opacity'), 0.68);
    equal(cObj.setOpacity(1), cObj, 'chainable');
  });

  test('getAngle', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.getAngle == 'function');
    equal(cObj.getAngle(), 0);
    cObj.rotate(45);
    equal(cObj.getAngle(), 45);
  });

  test('setAngle', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.setAngle == 'function');
    equal(cObj.get('angle'), 0);
    equal(cObj.setAngle(45), cObj, 'chainable');
    equal(cObj.get('angle'), 45);
  });

  test('setCoords', function() {
    var cObj = new fabric.Object({ left: 200, top: 200, width: 100, height: 100 });
    ok(typeof cObj.setCoords == 'function');
    equal(cObj.setCoords(), cObj, 'chainable');

    cObj.set('left', 300).set('top', 300);

    // coords should still correspond to initial one, even after invoking `set`
    equal(cObj.oCoords.tl.x, 150);
    equal(cObj.oCoords.tl.y, 150);
    equal(cObj.oCoords.tr.x, 250);
    equal(cObj.oCoords.tr.y, 150);
    equal(cObj.oCoords.bl.x, 150);
    equal(cObj.oCoords.bl.y, 250);
    equal(cObj.oCoords.br.x, 250);
    equal(cObj.oCoords.br.y, 250);

    // recalculate coords
    cObj.setCoords();

    // check that coords are now updated
    equal(cObj.oCoords.tl.x, 250);
    equal(cObj.oCoords.tl.y, 250);
    equal(cObj.oCoords.tr.x, 350);
    equal(cObj.oCoords.tr.y, 250);
    equal(cObj.oCoords.bl.x, 250);
    equal(cObj.oCoords.bl.y, 350);
    equal(cObj.oCoords.br.x, 350);
    equal(cObj.oCoords.br.y, 350);
  });

  test('drawBorders', function() {
    var cObj = new fabric.Object(), canvas = fabric.document.createElement('canvas');

    //let excanvas kick in for IE8 and lower
    if (!canvas.getContext && typeof G_vmlCanvasManager != 'undefined') {
        G_vmlCanvasManager.initElement(canvas)
    }

    var dummyContext = canvas.getContext('2d');
  //  initElement

    ok(typeof cObj.drawBorders == 'function');
    equal(cObj.drawBorders(dummyContext), cObj, 'chainable');
  });

  test('drawControls', function() {
    var cObj = new fabric.Object(), canvas = fabric.document.createElement('canvas');

    //let excanvas kick in for IE8 and lower
    if (!canvas.getContext && typeof G_vmlCanvasManager != 'undefined') {
        G_vmlCanvasManager.initElement(canvas)
    }
    var dummyContext = canvas.getContext('2d');
    ok(typeof cObj.drawControls == 'function');
    equal(cObj.drawControls(dummyContext), cObj, 'chainable');
  });

  test('clone', function() {
    var cObj = new fabric.Object({ left: 123, top: 456, opacity: 0.66 });
    ok(typeof cObj.clone == 'function');
    var clone = cObj.clone();

    equal(clone.get('left'), 123);
    equal(clone.get('top'), 456);
    equal(clone.get('opacity'), 0.66);

    // augmenting clone properties should not affect original instance
    clone.set('left', 12).set('scaleX', 2.5).setAngle(33);

    equal(cObj.get('left'), 123);
    equal(cObj.get('scaleX'), 1);
    equal(cObj.getAngle(), 0);
  });

  asyncTest('cloneAsImage', function() {
    var cObj = new fabric.Rect({ width: 100, height: 100, fill: 'red' });

    ok(typeof cObj.cloneAsImage == 'function');

    if (!fabric.Canvas.supports('toDataURL')) {
      fabric.log('`toDataURL` is not supported by this environment; skipping `cloneAsImage` test (as it relies on `toDataURL`)');
      start();
    }
    else {
      var image;
      var _this = this;

      setTimeout(function() {
        ok(image);
        ok(image instanceof fabric.Image);
        start();
      }, 500);

      cObj.cloneAsImage(function(i) {
        image = i;
      });
    }
  });

  asyncTest('toDataURL', function() {
    var data =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQA'+
      'AABkCAYAAABw4pVUAAAA+UlEQVR4nO3RoRHAQBDEsOu/6YR+B2s'+
      'gIO4Z3919pMwDMCRtHoAhafMADEmbB2BI2jwAQ9LmARiSNg/AkLR5AI'+
      'akzQMwJG0egCFp8wAMSZsHYEjaPABD0uYBGJI2D8CQtHkAhqTNAzAkbR'+
      '6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPwJC0eQCGpM0DMCRtHoAhafMADEm'+
      'bB2BI2jwAQ9LmARiSNg/AkLR5AIakzQMwJG0egCFp8wAMSZsHYEjaPABD0'+
      'uYBGJI2D8CQtHkAhqTNAzAkbR6AIWnzAAxJmwdgSNo8AEPS5gEYkjYPw'+
      'JC0eQCGpM0DMCRtHsDjB5K06yueJFXJAAAAAElFTkSuQmCC';

    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red'
    });

    ok(typeof cObj.toDataURL == 'function');

    if (!fabric.Canvas.supports('toDataURL')) {
      alert('toDataURL is not supported by this environment. Some of the tests can not be run.');
      start();
    }
    else {
      cObj.toDataURL(function(dataURL) {
        equal(typeof dataURL, 'string');
        equal(dataURL.substring(0, 21), 'data:image/png;base64');

        start();
      });
    }
  });

  test('hasStateChanged', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.hasStateChanged == 'function');
    cObj.setupState();
    ok(!cObj.hasStateChanged());
    cObj.saveState();
    cObj.set('left', 123).set('top', 456);
    ok(cObj.hasStateChanged());
  });

  test('saveState', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.saveState == 'function');
    cObj.setupState();
    equal(cObj.saveState(), cObj, 'chainable');
    cObj.set('left', 123).set('top', 456);
    cObj.saveState();
    cObj.set('left', 223).set('top', 556);
    equal(cObj.originalState.left, 123);
    equal(cObj.originalState.top, 456);
  });

  test('intersectsWithRectangle', function() {
    var cObj = new fabric.Object({ left: 100, top: 100, width: 100, height: 100 });
    cObj.setCoords();
    ok(typeof cObj.intersectsWithRect == 'function');

    var point1 = new fabric.Point(110, 100),
        point2 = new fabric.Point(210, 200),
        point3 = new fabric.Point(0, 0),
        point4 = new fabric.Point(10, 10);

    ok(cObj.intersectsWithRect(point1, point2));
    ok(!cObj.intersectsWithRect(point3, point4));
  });

  test('intersectsWithObject', function() {
    var cObj = new fabric.Object({ left: 100, top: 100, width: 100, height: 100 });
    cObj.setCoords();
    ok(typeof cObj.intersectsWithObject == 'function');

    var cObj2 = new fabric.Object({ left: 50, top: 50, width: 200, height: 200 });
    cObj2.setCoords();
    ok(cObj.intersectsWithObject(cObj2));
    ok(cObj2.intersectsWithObject(cObj));

    var cObj3 = new fabric.Object({ left: 400, top: 356, width: 13, height: 33 });
    cObj3.setCoords();
    ok(!cObj.intersectsWithObject(cObj3));
    ok(!cObj3.intersectsWithObject(cObj));
  });

  test('isContainedWithinRect', function() {
    var cObj = new fabric.Object({ left: 20, top: 20, width: 10, height: 10 });
    cObj.setCoords();
    ok(typeof cObj.isContainedWithinRect == 'function');

    // fully contained
    ok(cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(100,100)));
    // only intersects
    ok(!cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(25, 25)));
    // doesn't intersect
    ok(!cObj.isContainedWithinRect(new fabric.Point(100,100), new fabric.Point(110, 110)));
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

  test('straighten', function() {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    ok(typeof object.straighten == 'function');

    object.setAngle(123.456);
    object.straighten();
    equal(object.get('angle'), 90);

    object.setAngle(97.111);
    object.straighten();
    equal(object.get('angle'), 90);

    object.setAngle(3.45);
    object.straighten();
    equal(object.get('angle'), 0);

    object.setAngle(-157);
    object.straighten();
    equal(object.get('angle'), -180);

    object.setAngle(159);
    object.straighten();
    equal(object.get('angle'), 180);

    object.setAngle(999);
    object.straighten();
    equal(object.get('angle'), 270);
  });

  test('toGrayscale', function() {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    ok(typeof object.toGrayscale == 'function');
    equal(object.toGrayscale(), object, 'should be chainable');

    object.set('fill', 'rgb(200,0,0)'); // set color to red

    object.toGrayscale();

    equal(object.get('overlayFill'), 'rgb(60,60,60)');
    equal(object.get('fill'), 'rgb(200,0,0)', 'toGrayscale should not overwrite original fill value');

    object.set('fill', '').set('overlayFill', '');
    object.toGrayscale();

    equal(object.get('overlayFill'), '', 'Empty fill values should be left intact');
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

  // asyncTest('animate', function() {
  //   var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

  //   ok(typeof object.animate == 'function');

  //   object.animate('left', 40);
  //   ok(true, 'animate without options does not crash');

  //   setTimeout(function() {

  //     equal(40, Math.round(object.getLeft()));
  //     start();

  //   }, 1000);
  // });

  // asyncTest('animate multiple properties', function() {
  //   var object = new fabric.Object({ left: 123, top: 124 });

  //   object.animate({ left: 223, top: 224 });

  //   setTimeout(function() {

  //     equal(223, Math.round(object.get('left')));
  //     equal(224, Math.round(object.get('top')));

  //     start();

  //   }, 1000);
  // });

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
    object.on('baz', function(options) { firedOptions = options; })
    object.fire('baz', { param1: 'abrakadabra', param2: 3.1415 });

    equal('abrakadabra', firedOptions.param1);
    equal(3.1415, firedOptions.param2);
  });

  test('object:added', function() {
    var object = new fabric.Object();
    var addedEventFired = false;

    object.on('added', function(){ addedEventFired = true; })
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

  test('remove', function() {
    var object = new fabric.Object();

    ok(typeof object.remove == 'function');

    canvas.add(object);
    object.remove();

    equal(canvas.getObjects().length, 0);
  });

  test('center', function() {
    var object = new fabric.Object();

    ok(typeof object.center == 'function');

    canvas.add(object);
    object.center();

    equal(object.getLeft(), canvas.getWidth() / 2);
    equal(object.getTop(), canvas.getHeight() / 2);
  });

  test('centerH', function() {
    var object = new fabric.Object();

    ok(typeof object.centerH == 'function');

    canvas.add(object);
    object.centerH();

    equal(object.getLeft(), canvas.getWidth() / 2);
  });

  test('centerV', function() {
    var object = new fabric.Object();

    ok(typeof object.centerV == 'function');

    canvas.add(object);
    object.centerV();

    equal(object.getTop(), canvas.getHeight() / 2);
  });

  test('sendToBack', function() {
    var object = new fabric.Object();

    ok(typeof object.sendToBack == 'function');
  });

  test('bringToFront', function() {
    var object = new fabric.Object();

    ok(typeof object.bringToFront == 'function');
  });

  test('sendBackwards', function() {
    var object = new fabric.Object();

    ok(typeof object.bringToFront == 'function');
  });

  test('bringForward', function() {
    var object = new fabric.Object();

    ok(typeof object.bringToFront == 'function');
  });

  test('gradient serialization', function() {
    var object = new fabric.Object();

    object.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      colorStops: {
        '0': 'rgb(255,0,0)',
        '1': 'rgb(0,128,0)'
      }
    });

    ok(typeof object.toObject().fill == 'object');

    equal(object.toObject().fill.type, 'linear');

    equal(object.toObject().fill.coords.x1, 0);
    equal(object.toObject().fill.coords.y1, 0);

    equal(object.toObject().fill.coords.x2, 100);
    equal(object.toObject().fill.coords.y2, 100);

    equal(object.toObject().fill.colorStops[0].offset, 0);
    equal(object.toObject().fill.colorStops[1].offset, 1);
    equal(object.toObject().fill.colorStops[0].color, 'rgb(255,0,0)');
    equal(object.toObject().fill.colorStops[1].color, 'rgb(0,128,0)');
  });

  test('setShadow', function() {
    var object = new fabric.Object();

    object.setShadow({
      color: 'red',
      blur: 10,
      offsetX: 5,
      offsetY: 15
    });

    ok(object.shadow instanceof fabric.Shadow);

    equal(object.shadow.color, 'red');
    equal(object.shadow.blur, 10);
    equal(object.shadow.offsetX, 5);
    equal(object.shadow.offsetY, 15);
  });

})();
