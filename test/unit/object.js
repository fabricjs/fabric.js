(function(){

  var canvas = this.canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false});

  QUnit.module('fabric.Object', {
    afterEach: function () {
      fabric.config.configure({
        perfLimitSizeTotal: 2097152,
        maxCacheSideLimit: 4096,
        minCacheSideLimit: 256,
        devicePixelRatio: 1,
      });
      canvas.enableRetinaScaling = false;
      canvas.setZoom(1);
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });

  QUnit.test('constructor & properties', function(assert) {
    assert.ok(typeof fabric.Object === 'function');

    var cObj = new fabric.Object();

    assert.ok(cObj);
    assert.ok(cObj instanceof fabric.Object);
    assert.ok(cObj.constructor === fabric.Object);

    assert.equal(cObj.constructor.name, 'FabricObject');
    assert.equal(cObj.includeDefaultValues, true);
    assert.equal(cObj.selectable, true);

    assert.equal(cObj.objectCaching, !isNode(), 'object caching default value');
  });

  QUnit.test('get', function(assert) {
    var cObj = new fabric.Object({
      left: 11,
      top: 22,
      width: 50,
      height: 60,
      opacity: 0.7
    });

    assert.equal(cObj.get('left'), 11);
    assert.equal(cObj.get('top'), 22);
    assert.equal(cObj.get('width'), 50);
    assert.equal(cObj.get('height'), 60);
    assert.equal(cObj.get('opacity'), 0.7);
  });

  QUnit.test('set', function(assert) {
    var cObj = new fabric.Object({ left: 11, top: 22, width: 50, height: 60, opacity: 0.7 });

    cObj.set('left', 12);
    cObj.set('top', 23);
    cObj.set('width', 51);
    cObj.set('height', 61);
    cObj.set('opacity', 0.5);

    assert.equal(cObj.get('left'), 12);
    assert.equal(cObj.get('top'), 23);
    assert.equal(cObj.get('width'), 51);
    assert.equal(cObj.get('height'), 61);
    assert.equal(cObj.get('opacity'), 0.5);

    assert.equal(cObj.set('opacity', 0.5), cObj, 'chainable');
  });

  QUnit.test('set with object of prop/values', function(assert) {
    var cObj = new fabric.Object({  });

    assert.equal(cObj, cObj.set({ width: 99, height: 88, fill: 'red' }), 'chainable');

    assert.equal('red', cObj.get('fill'));
    assert.equal(99, cObj.get('width'));
    assert.equal(88, cObj.get('height'));
  });

  // QUnit.test('Dynamically generated accessors', function(assert) {
  //   var cObj = new fabric.Object({ });
  //
  //   assert.equal('function', typeof cObj.getWidth);
  //   assert.equal('function', typeof cObj.setWidth);
  //
  //   assert.equal('function', typeof cObj.getFill);
  //   assert.equal('function', typeof cObj.setFill);
  //
  //   assert.equal(cObj, cObj.setFill('red'), 'chainable');
  //   assert.equal('red', cObj.getFill());
  //
  //   cObj.setScaleX(2.3);
  //   assert.equal(2.3, cObj.getScaleX());
  //
  //   cObj.setOpacity(0.123);
  //   assert.equal(0.123, cObj.getOpacity());
  // });

  QUnit.test('stateProperties', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(cObj.constructor.stateProperties);
    assert.ok(cObj.constructor.stateProperties.length > 0);
  });

  QUnit.test('transform', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.transform === 'function');
  });

  QUnit.test('toJSON', function(assert) {
    var emptyObjectJSON = '{"type":"FabricObject","version":"' + fabric.version + '","originX":"left","originY":"top","left":0,"top":0,"width":0,"height":0,"fill":"rgb(0,0,0)",' +
                          '"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,' +
                          '"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,' +
                          '"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over",' +
                          '"skewX":0,"skewY":0}';

    var augmentedJSON = '{"type":"FabricObject","version":"' + fabric.version + '","originX":"left","originY":"top","left":0,"top":0,"width":122,"height":0,"fill":"rgb(0,0,0)",' +
                        '"stroke":null,"strokeWidth":1,"strokeDashArray":[5,2],"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"bevel","strokeUniform":false,"strokeMiterLimit":5,' +
                        '"scaleX":1.3,"scaleY":1,"angle":0,"flipX":false,"flipY":true,"opacity":0.88,' +
                        '"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over",' +
                        '"skewX":0,"skewY":0}';

    var cObj = new fabric.Object();
    assert.ok(typeof cObj.toJSON === 'function');
    assert.equal(JSON.stringify(cObj.toJSON()), emptyObjectJSON);
    assert.equal(JSON.stringify(cObj), emptyObjectJSON);

    cObj.set('opacity', 0.88)
      .set('scaleX', 1.3)
      .set('width', 122)
      .set('flipY', true)
      .set('strokeDashArray', [5, 2])
      .set('strokeLineCap', 'round')
      .set('strokeLineJoin', 'bevel')
      .set('strokeMiterLimit', 5);

    assert.equal(JSON.stringify(cObj.toJSON()), augmentedJSON);
  });

  QUnit.test('toObject', function(assert) {
    var emptyObjectRepr = {
      version:                  fabric.version,
      type:                     'FabricObject',
      originX:                  'left',
      originY:                  'top',
      left:                     0,
      top:                      0,
      width:                    0,
      height:                   0,
      fill:                     'rgb(0,0,0)',
      stroke:                   null,
      strokeWidth:              1,
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
      shadow:                   null,
      visible:                  true,
      backgroundColor:          '',
      fillRule:                 'nonzero',
      paintFirst:               'fill',
      globalCompositeOperation: 'source-over',
      skewX:                      0,
      skewY:                      0,
      strokeUniform:              false
    };

    var augmentedObjectRepr = {
      version:                  fabric.version,
      type:                     'FabricObject',
      originX:                  'left',
      originY:                  'top',
      left:                     10,
      top:                      20,
      width:                    30,
      height:                   40,
      fill:                     'rgb(0,0,0)',
      stroke:                   null,
      strokeWidth:              1,
      strokeDashArray:          [5, 2],
      strokeLineCap:            'round',
      strokeDashOffset:         0,
      strokeLineJoin:           'bevel',
      strokeMiterLimit:         5,
      scaleX:                   1,
      scaleY:                   1,
      angle:                    0,
      flipX:                    true,
      flipY:                    false,
      opacity:                  0.13,
      shadow:                   null,
      visible:                  true,
      backgroundColor:          '',
      fillRule:                 'nonzero',
      paintFirst:               'fill',
      globalCompositeOperation: 'source-over',
      skewX:                      0,
      skewY:                      0,
      strokeUniform:              false
    };

    var cObj = new fabric.Object();
    assert.deepEqual(emptyObjectRepr, cObj.toObject());

    cObj.set('left', 10)
      .set('top', 20)
      .set('width', 30)
      .set('height', 40)
      .set('flipX', true)
      .set('opacity', 0.13)
      .set('strokeDashArray', [5, 2])
      .set('strokeLineCap', 'round')
      .set('strokeLineJoin', 'bevel')
      .set('strokeMiterLimit', 5);

    assert.deepEqual(augmentedObjectRepr, cObj.toObject());

    var fractionalValue = 166.66666666666666,
        testedProperties = 'left top width height'.split(' '),
        fractionDigitsDefault = 2;

    function testFractionDigits(fractionDigits, expectedValue) {

      fabric.config.configure({ NUM_FRACTION_DIGITS: fractionDigits });

      testedProperties.forEach(function(property) {
        cObj.set(property, fractionalValue);
        assert.equal(cObj.toObject()[property], expectedValue,
          'value of ' + property + ' should have ' + fractionDigits + ' fractional digits');
      }, this);

      fabric.config.configure({ NUM_FRACTION_DIGITS: fractionDigitsDefault });
    }

    testFractionDigits.call(this, 2, 166.67);
    testFractionDigits.call(this, 3, 166.667);
    testFractionDigits.call(this, 0, 167);
  });

  QUnit.test('toObject without default values', function(assert) {

    var emptyObjectRepr = { version: fabric.version, type: 'FabricObject', top: 0, left: 0 };

    var augmentedObjectRepr = {
      version: fabric.version,
      type: 'FabricObject',
      left: 10,
      top: 20,
      width: 30,
      height: 40,
      strokeDashArray: [5, 2],
      strokeLineCap: 'round',
      strokeLineJoin: 'bevel',
      strokeMiterLimit: 5,
      flipX: true,
      opacity: 0.13,
    };

    var cObj = new fabric.Object(),
        toObjectObj;
    cObj.includeDefaultValues = false;
    assert.deepEqual(emptyObjectRepr, cObj.toObject(), 'top and left are always maintained');

    cObj.set('left', 10)
      .set('top', 20)
      .set('width', 30)
      .set('height', 40)
      .set('flipX', true)
      .set('opacity', 0.13)
      .set('strokeDashArray', [5, 2])
      .set('strokeLineCap', 'round')
      .set('strokeLineJoin', 'bevel')
      .set('strokeMiterLimit', 5);
    toObjectObj = cObj.toObject();
    assert.deepEqual(augmentedObjectRepr, toObjectObj);
    assert.notEqual(augmentedObjectRepr.strokeDashArray, toObjectObj.strokeDashArray);
    assert.deepEqual(augmentedObjectRepr.strokeDashArray, toObjectObj.strokeDashArray);
  });

  QUnit.test('toDatalessObject', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.toDatalessObject === 'function');
    assert.deepEqual(cObj.toObject(), cObj.toDatalessObject());
  });

  QUnit.test('toString', function (assert) {
    class Moo extends fabric.Object {
      static type = 'moo'
    }
    var cObj = new fabric.Object();
    assert.equal(cObj.toString(), '#<FabricObject>');
    assert.equal(new Moo().toString(), '#<Moo>');
  });

  QUnit.test('render', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.render === 'function');
  });

  QUnit.test('rotate', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.rotate === 'function');
    assert.equal(cObj.get('angle'), 0);
    cObj.rotate(45);
    assert.equal(cObj.get('angle'), 45);
  });

  QUnit.test('scale', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.scale === 'function');
    assert.equal(cObj.get('scaleX'), 1);
    assert.equal(cObj.get('scaleY'), 1);
    cObj.scale(1.5);
    assert.equal(cObj.get('scaleX'), 1.5);
    assert.equal(cObj.get('scaleY'), 1.5);
  });

  QUnit.test('setOpacity', function(assert) {
    var cObj = new fabric.Object();
    assert.equal(cObj.get('opacity'), 1);
    cObj.set('opacity', 0.68);
    assert.equal(cObj.get('opacity'), 0.68);
    assert.equal(cObj.set('opacity', 1), cObj, 'chainable');
  });

  QUnit.test('getAngle', function(assert) {
    var cObj = new fabric.Object();
    assert.equal(cObj.get('angle'), 0);
    cObj.rotate(45);
    assert.equal(cObj.get('angle'), 45);
  });

  QUnit.test('rotate', function(assert) {
    var cObj = new fabric.Object();
    assert.equal(cObj.get('angle'), 0);
    assert.equal(cObj.set('angle', 45), cObj, 'chainable');
    assert.equal(cObj.get('angle'), 45);
  });

  QUnit.test('clone', function(assert) {
    var done = assert.async();
    var cObj = new fabric.Object({ left: 123, top: 456, opacity: 0.66 });
    assert.ok(typeof cObj.clone === 'function');
    cObj.clone().then(function(clone) {
      assert.equal(clone.get('left'), 123);
      assert.equal(clone.get('top'), 456);
      assert.equal(clone.get('opacity'), 0.66);

      // augmenting clone properties should not affect original instance
      clone.set('left', 12).set('scaleX', 2.5).rotate(33);

      assert.equal(cObj.get('left'), 123);
      assert.equal(cObj.get('scaleX'), 1);
      assert.equal(cObj.get('angle'), 0);
      done();
    });
  });

  QUnit.test('cloneAsImage', function(assert) {
    var cObj = new fabric.Rect({ width: 100, height: 100, fill: 'red', strokeWidth: 0 });
    assert.ok(typeof cObj.cloneAsImage === 'function');
    var image = cObj.cloneAsImage();
    assert.ok(image);
    assert.ok(image instanceof fabric.Image);
    assert.equal(image.width, 100, 'the image has same dimension of object');
  });

  QUnit.test('cloneAsImage with retina scaling enabled', function(assert) {
    var cObj = new fabric.Rect({ width: 100, height: 100, fill: 'red', strokeWidth: 0 });
    fabric.config.configure({ devicePixelRatio: 2 });
    var image = cObj.cloneAsImage({ enableRetinaScaling: true });
    assert.ok(image);
    assert.ok(image instanceof fabric.Image);
    assert.equal(image.width, 200, 'the image has been scaled by retina');
  });

  QUnit.test('toCanvasElement', function(assert) {
    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red', strokeWidth: 0, canvas: canvas
    });

    assert.ok(typeof cObj.toCanvasElement === 'function');

    var canvasEl = cObj.toCanvasElement();

    assert.ok(typeof canvasEl.getContext === 'function', 'the element returned is a canvas');
    assert.ok(cObj.canvas === canvas, 'canvas ref should remain unchanged');
  });

  QUnit.test('toCanvasElement activeSelection', function(assert) {
    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red', strokeWidth: 0
    });

    var cObj2 = new fabric.Rect({
      width: 100, height: 100, fill: 'red', strokeWidth: 0
    });

    canvas.add(cObj, cObj2);

    var activeSel = new fabric.ActiveSelection([cObj, cObj2], { canvas: canvas });

    assert.equal(cObj.canvas, canvas, 'canvas is the main one step 1');

    activeSel.toCanvasElement();

    assert.equal(cObj.canvas, canvas, 'canvas is the main one step 2');

    activeSel.removeAll();

    assert.equal(cObj.canvas, canvas, 'canvas is the main one step 3');

  });

  QUnit.test('toCanvasElement does not modify oCoords on zoomed canvas', function(assert) {
    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red', strokeWidth: 0
    });
    canvas.setZoom(2);
    canvas.add(cObj);
    var originaloCoords = cObj.oCoords;
    var originalaCoords = cObj.aCoords;
    cObj.toCanvasElement();
    assert.deepEqual(cObj.oCoords, originaloCoords, 'cObj did not get object coords changed');
    assert.deepEqual(cObj.aCoords, originalaCoords, 'cObj did not get absolute coords changed');
  });


  QUnit.test('toDataURL', function(assert) {
    var cObj = new fabric.Rect({
      width: 100, height: 100, fill: 'red', strokeWidth: 0
    });

    assert.ok(typeof cObj.toDataURL === 'function');

    var dataURL = cObj.toDataURL();
    assert.equal(typeof dataURL, 'string');
    assert.equal(dataURL.substring(0, 21), 'data:image/png;base64');

    try {
      dataURL = cObj.toDataURL({ format: 'jpeg' });
      assert.equal(dataURL.substring(0, 22), 'data:image/jpeg;base64');
    }
    catch (err) {
      console.log('jpeg toDataURL not supported');
    }
  });

  QUnit.test('toDataURL & reference to canvas', function(assert) {
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
    var objCanvas = cObj.canvas;
    cObj.toDataURL();

    assert.equal(objCanvas, cObj.canvas);
  });

  QUnit.test('isType', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.isType === 'function');
    assert.ok(cObj.isType('FabricObject'));
    assert.ok(cObj.isType('object'));
    assert.ok(!cObj.isType('Rect'));
    cObj = new fabric.Rect();
    assert.ok(cObj.isType('Rect'));
    assert.ok(cObj.isType('rect'));
    assert.ok(!cObj.isType('Object'));
    assert.ok(cObj.isType('Object', 'Rect'));
    assert.ok(!cObj.isType('Object', 'Circle'));
  });

  QUnit.test('toggle', function(assert) {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    assert.ok(typeof object.toggle === 'function');

    object.set('flipX', false);
    assert.equal(object.toggle('flipX'), object, 'should be chainable');
    assert.equal(object.get('flipX'), true);
    object.toggle('flipX');
    assert.equal(object.get('flipX'), false);

    object.set('left', 112.45);
    object.toggle('left');
    assert.equal(object.get('left'), 112.45, 'non boolean properties should not be affected');
  });

  QUnit.test('_setLineDash', function(assert) {
    var object = new fabric.Rect({ left: 100, top: 124, width: 210, height: 66, stroke: 'black', strokeWidth: 2});
    assert.ok(typeof object._setLineDash === 'function');
    object.strokeDashArray = [3, 2, 1];
    assert.equal(object.strokeDashArray.length, 3, 'strokeDash array is odd');
    object._setLineDash(canvas.contextContainer, object.strokeDashArray, null);
    assert.equal(object.strokeDashArray.length, 6, 'strokeDash array now is even');

    assert.equal(canvas.contextContainer.getLineDash().length, 6, 'object pushed line dash to canvas');
    object._setLineDash(canvas.contextContainer, [], null);
    assert.equal(canvas.contextContainer.getLineDash().length, 6, 'bailed immediately as array empty');
  });

  QUnit.skip('straighten', function(assert) {
    var object = new fabric.Object({ left: 100, top: 124, width: 210, height: 66 });
    assert.ok(typeof object.straighten === 'function');

    object.rotate(123.456);
    object.straighten();
    assert.equal(object.get('angle'), 90);

    object.rotate(97.111);
    object.straighten();
    assert.equal(object.get('angle'), 90);

    object.rotate(3.45);
    object.straighten();
    assert.equal(object.get('angle'), 0);

    object.rotate(-157);
    object.straighten();
    assert.equal(object.get('angle'), -180);

    object.rotate(159);
    object.straighten();
    assert.equal(object.get('angle'), 180);

    object.rotate(999);
    object.straighten();
    assert.equal(object.get('angle'), 270);
  });

  QUnit.skip('fxStraighten', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    var onCompleteFired = false;
    var onComplete = function(){ onCompleteFired = true; };

    var onChangeFired = false;
    var onChange = function(){ onChangeFired = true; };

    var callbacks = { onComplete: onComplete, onChange: onChange };
    assert.ok(typeof object.fxStraighten === 'function');
    assert.ok(typeof object.fxStraighten(callbacks).abort === 'function', 'should return animation context');
    assert.equal(fabric.util.toFixed(object.get('angle'), 0), 43);
    setTimeout(function(){
      assert.ok(onCompleteFired);
      assert.ok(onChangeFired);
      assert.equal(object.get('angle'), 0, 'angle should be set to 0 by the end of animation');
      assert.ok(typeof object.fxStraighten().abort === 'function', 'should work without callbacks');
      done();
    }, 1000);
  });

  QUnit.test('observable', function(assert) {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    var fooFired = false,
        barFired = false;

    var fooDisposer = object.on('foo', function() { fooFired = true; });
    var barDisposer = object.on('bar', function () { barFired = true; });
    assert.ok(typeof fooDisposer === 'function', 'should return disposer');
    assert.ok(typeof barDisposer === 'function', 'should return disposer');

    object.fire('foo');
    assert.ok(fooFired);
    assert.ok(!barFired);

    object.fire('bar');
    assert.ok(fooFired);
    assert.ok(barFired);

    var firedOptions;
    object.on('baz', function(options) { firedOptions = options; });
    object.fire('baz', { param1: 'abrakadabra', param2: 3.1415 });

    assert.equal('abrakadabra', firedOptions.param1);
    assert.equal(3.1415, firedOptions.param2);
  });

  QUnit.test('object:added', function(assert) {
    var object = new fabric.Object();
    var addedEventFired = false;

    object.on('added', function (opt) {
      addedEventFired = true;
      assert.ok(opt.target === canvas, 'target should equal to canvas');
    });
    canvas.add(object);

    assert.ok(addedEventFired);
  });

  QUnit.test('canvas reference', function(assert) {
    var object = new fabric.Object();
    var object2 = new fabric.Object();

    canvas.add(object);
    canvas.insertAt(0, object2);

    assert.ok(object.canvas === canvas);
    assert.ok(object2.canvas === canvas);
  });

  QUnit.test('object:removed', function(assert) {
    var object = new fabric.Object();
    var removedEventFired = false;

    canvas.add(object);

    object.on('removed', function (opt) {
      removedEventFired = true;
      assert.ok(opt.target === canvas, 'target should equal to canvas');
      assert.ok(object.canvas === undefined, 'canvas should not be referenced');
    });
    canvas.remove(object);

    assert.ok(removedEventFired);
  });

  QUnit.test('getParent', function (assert) {
    const object = new fabric.Object();
    const parent = new fabric.Object();
    parent._exitGroup = () => { };
    assert.ok(typeof object.getParent === 'function');
    parent.canvas = canvas;
    object.group = parent;
    assert.equal(object.getParent(), parent);
    assert.equal(parent.getParent(), canvas);
    const another = new fabric.Object();
    object.group = another;
    object.group.group = parent;
    assert.equal(object.getParent(), another);
    assert.equal(another.getParent(), parent);
    object.group = undefined;
    assert.equal(object.getParent(), undefined);
    object.canvas = canvas;
    assert.equal(object.getParent(), canvas);
    object.group = parent;
    assert.equal(object.getParent(), parent);
    const activeSelection = new fabric.ActiveSelection([object], { canvas });
    assert.equal(object.group, activeSelection);
    assert.equal(object.__owningGroup, parent);
    assert.equal(object.canvas, canvas);
    assert.equal(object.getParent(), parent);
    object.__owningGroup = undefined;
    assert.equal(object.getParent(), canvas);
  });

  QUnit.test('isDescendantOf', function (assert) {
    const object = new fabric.Object();
    const parent = new fabric.Object();
    parent._exitGroup = () => { };
    assert.ok(typeof object.isDescendantOf === 'function');
    parent.canvas = canvas;
    object.group = parent;
    assert.ok(object.isDescendantOf(parent));
    object.group = new fabric.Object();
    object.group.group = parent;
    assert.ok(object.isDescendantOf(parent));
    assert.ok(object.isDescendantOf(canvas));
    object.group = undefined;
    assert.ok(object.isDescendantOf(parent) === false);
    assert.ok(object.isDescendantOf(canvas) === false);
    object.canvas = canvas;
    assert.ok(object.isDescendantOf(canvas));
    assert.ok(object.isDescendantOf(object) === false);
    object.group = parent;
    assert.equal(object.getParent(), parent);
    const activeSelection = new fabric.ActiveSelection([object], { canvas });
    assert.equal(object.group, activeSelection);
    assert.equal(object.__owningGroup, parent);
    assert.equal(object.canvas, canvas);
    assert.ok(object.isDescendantOf(parent), 'should recognize owning group');
    assert.ok(object.isDescendantOf(activeSelection), 'should recognize active selection');
    assert.ok(object.isDescendantOf(canvas), 'should recognize canvas');
    object.__owningGroup = undefined;
    assert.ok(!object.isDescendantOf(parent));
    assert.ok(object.isDescendantOf(activeSelection), 'should recognize active selection');
    assert.ok(object.isDescendantOf(canvas), 'should recognize canvas');
  });

  QUnit.test('getAncestors', function (assert) {
    var object = new fabric.Object();
    var parent = new fabric.Object();
    var other = new fabric.Object();
    assert.ok(typeof object.getAncestors === 'function');
    assert.deepEqual(object.getAncestors(), []);
    object.group = parent;
    assert.deepEqual(object.getAncestors(), [parent]);
    parent.canvas = canvas;
    assert.deepEqual(object.getAncestors(), [parent, canvas]);
    parent.group = other;
    assert.deepEqual(object.getAncestors(), [parent, other]);
    other.canvas = canvas;
    assert.deepEqual(object.getAncestors(), [parent, other, canvas]);
    delete object.group;
    assert.deepEqual(object.getAncestors(), []);
  });

  function prepareObjectsForTreeTesting() {
    class TestObject extends fabric.Object {
      toJSON() {
        return {
          id: this.id,
          objects: this._objects?.map(o => o.id),
          parent: this.parent?.id,
          canvas: this.canvas?.id
        }
      }
      toString() {
        return JSON.stringify(this.toJSON(), null, '\t');
      }
    }
    class TestCollection extends fabric.createCollectionMixin(TestObject) {
      constructor({ id }) {
        super();
        this.id = id;
        this._objects = [];
      }
      _onObjectAdded(object) {
        object.group = this;
      }
      _onObjectRemoved(object) {
        delete object.group;
      }
      removeAll() {
        this.remove(...this._objects);
      }
    }
    class TestCanvas extends TestCollection {
      _onObjectAdded (object) {
        object.canvas = this;
      }
      _onObjectRemoved (object) {
        delete object.canvas;
      }
    }
    return {
      object: new TestObject({ id: 'object' }),
      other: new TestObject({ id: 'other' }),
      a: new TestCollection({ id: 'a' }),
      b: new TestCollection({ id: 'b' }),
      c: new TestCollection({ id: 'c' }),
      canvas: new TestCanvas({ id: 'canvas' })
    }
  }

  QUnit.test('findCommonAncestors', function (assert) {
    function findCommonAncestors(object, other, strict, expected, message) {
      var common = object.findCommonAncestors(other, strict);
      assert.deepEqual(
        common.fork.map((obj) => obj.id),
        expected.fork.map((obj) => obj.id),
        message || `fork property should match check between '${object.id}' and '${other.id}'`
      );
      assert.deepEqual(
        common.otherFork.map((obj) => obj.id),
        expected.otherFork.map((obj) => obj.id),
        message || `otherFork property should match check between '${object.id}' and '${other.id}'`
      );
      assert.deepEqual(
        common.common.map((obj) => obj.id),
        expected.common.map((obj) => obj.id),
        message || `common property should match check between '${object.id}' and '${other.id}'`
      );
      var oppositeCommon = other.findCommonAncestors(object, strict);
      assert.deepEqual(
        oppositeCommon.fork.map((obj) => obj.id),
        expected.otherFork.map((obj) => obj.id),
        message || `fork property should match opposite check between '${other.id}' and '${object.id}'`
      );
      assert.deepEqual(
        oppositeCommon.otherFork.map((obj) => obj.id),
        expected.fork.map((obj) => obj.id),
        message || `otherFork property should match opposite check between '${other.id}' and '${object.id}'`
      );
      assert.deepEqual(
        oppositeCommon.common.map((obj) => obj.id),
        expected.common.map((obj) => obj.id),
        message || `common property should match opposite check between '${other.id}' and '${object.id}'`
      );
    }
    var { object, other, a, b, c, canvas } = prepareObjectsForTreeTesting();
    assert.ok(typeof object.findCommonAncestors === 'function');
    assert.ok(Array.isArray(a._objects));
    assert.ok(a._objects !== b._objects);
    //  same object
    findCommonAncestors(object, object, false, { fork: [], otherFork: [] , common: [object] });
    //  foreign objects
    findCommonAncestors(object, other, false, { fork: [object], otherFork: [other] , common: [] });
    //  same level
    a.add(object, other);
    findCommonAncestors(object, other, false, { fork: [object], otherFork: [other], common: [a] });
    findCommonAncestors(object, a, false, { fork: [object], otherFork: [], common: [a] });
    findCommonAncestors(other, a, false, { fork: [other], otherFork: [], common: [a] });
    findCommonAncestors(a, object, false, { fork: [], otherFork: [object], common: [a] });
    findCommonAncestors(a, object, true, { fork: [], otherFork: [object], common: [a] }, 'strict option should have no effect when outside canvas');
    // different level
    a.remove(object);
    b.add(object);
    a.add(b);
    findCommonAncestors(object, b, false, { fork: [object], otherFork: [], common: [b, a] });
    findCommonAncestors(b, a, false, { fork: [b], otherFork: [], common: [a] });
    findCommonAncestors(object, other, false, { fork: [object, b], otherFork: [other], common: [a] });
    // with common ancestor
    assert.equal(c.size(), 0, 'c should be empty');
    c.add(a);
    assert.equal(c.size(), 1, 'c should contain a');
    findCommonAncestors(object, b, false, { fork: [object], otherFork: [], common: [b, a, c] });
    findCommonAncestors(b, a, false, { fork: [b], otherFork: [], common: [a, c] });
    findCommonAncestors(object, other, false, { fork: [object, b], otherFork: [other], common: [a, c] });
    findCommonAncestors(object, c, false, { fork: [object, b, a], otherFork: [], common: [c] });
    findCommonAncestors(other, c, false, { fork: [other, a], otherFork: [], common: [c] });
    findCommonAncestors(b, c, false, { fork: [b, a], otherFork: [], common: [c] });
    findCommonAncestors(a, c, false, { fork: [a], otherFork: [], common: [c] });
    //  deeper asymmetrical
    c.removeAll();
    assert.equal(c.size(), 0, 'c should be cleared');
    a.remove(other);
    c.add(other, a);
    findCommonAncestors(object, b, false, { fork: [object], otherFork: [], common: [b, a, c] });
    findCommonAncestors(b, a, false, { fork: [b], otherFork: [], common: [a, c] });
    findCommonAncestors(a, other, false, { fork: [a], otherFork: [other], common: [c] });
    findCommonAncestors(object, other, false, { fork: [object, b, a], otherFork: [other], common: [c] });
    findCommonAncestors(object, c, false, { fork: [object, b, a], otherFork: [], common: [c] });
    findCommonAncestors(other, c, false, { fork: [other], otherFork: [], common: [c] });
    findCommonAncestors(b, c, false, { fork: [b, a], otherFork: [], common: [c] });
    findCommonAncestors(a, c, false, { fork: [a], otherFork: [], common: [c] });
    //  with canvas
    a.removeAll();
    b.removeAll();
    c.removeAll();
    canvas.add(object, other);
    findCommonAncestors(object, other, true, { fork: [object], otherFork: [other], common: [] });
    findCommonAncestors(object, other, false, { fork: [object], otherFork: [other], common: [canvas] });
    findCommonAncestors(object, canvas, true, { fork: [object], otherFork: [canvas], common: [] });
    findCommonAncestors(object, canvas, false, { fork: [object], otherFork: [], common: [canvas] });
    findCommonAncestors(other, canvas, false, { fork: [other], otherFork: [], common: [canvas] });
    //  parent precedes canvas when checking ancestor
    a.add(object);
    assert.ok(object.canvas === canvas, 'object should have canvas set');
    findCommonAncestors(object, other, true, { fork: [object, a], otherFork: [other], common: [] });
    findCommonAncestors(object, other, false, { fork: [object, a], otherFork: [other, canvas], common: [] });
    canvas.insertAt(0, a);
    findCommonAncestors(object, other, true, { fork: [object, a], otherFork: [other], common: [] });
    findCommonAncestors(object, other, false, { fork: [object, a], otherFork: [other], common: [canvas] });
    findCommonAncestors(a, other, false, { fork: [a], otherFork: [other], common: [canvas] });
    findCommonAncestors(a, canvas, false, { fork: [a], otherFork: [], common: [canvas] });
    findCommonAncestors(object, canvas, false, { fork: [object, a], otherFork: [], common: [canvas] });
    findCommonAncestors(other, canvas, false, { fork: [other], otherFork: [], common: [canvas] });
  });

  QUnit.assert.isInFrontOf = function (object, other, expected) {
    var actual = object.isInFrontOf(other);
    this.pushResult({
      expected: expected,
      actual: actual,
      result: actual === expected,
      message: `'${expected ? object.id : other.id}' should be in front of '${expected ? other.id : object.id}'`
    });
    if (actual === expected && typeof expected === 'boolean') {
      var actual2 = other.isInFrontOf(object);
      this.pushResult({
        expected: !expected,
        actual: actual2,
        result: actual2 === !expected,
        message: `should match opposite check between '${object.id}' and '${other.id}'`
      });
    }
  };

  QUnit.test('isInFrontOf', function (assert) {
    var { object, other, a, b, c, canvas } = prepareObjectsForTreeTesting();
    assert.ok(typeof object.isInFrontOf === 'function');
    assert.ok(Array.isArray(a._objects));
    assert.ok(a._objects !== b._objects);
    //  same object
    assert.isInFrontOf(object, object, undefined);
    //  foreign objects
    assert.isInFrontOf(object, other, undefined);
    //  same level
    a.add(object, other);
    assert.isInFrontOf(object, other, false);
    assert.isInFrontOf(object, a, true);
    assert.isInFrontOf(other, a, true);
    // different level
    a.remove(object);
    b.add(object);
    a.add(b);
    assert.isInFrontOf(object, b, true);
    assert.isInFrontOf(b, a, true);
    assert.isInFrontOf(object, other, true);
    //  with common ancestor
    assert.equal(c.size(), 0, 'c should be empty');
    c.add(a);
    assert.equal(c.size(), 1, 'c should contain a');
    assert.isInFrontOf(object, b, true);
    assert.isInFrontOf(b, a, true);
    assert.isInFrontOf(object, other, true);
    assert.isInFrontOf(object, c, true);
    assert.isInFrontOf(other, c, true);
    assert.isInFrontOf(b, c, true);
    assert.isInFrontOf(a, c, true);
    //  deeper asymmetrical
    c.removeAll();
    assert.equal(c.size(), 0, 'c should be cleared');
    a.remove(other);
    c.add(other, a);
    assert.isInFrontOf(object, b, true);
    assert.isInFrontOf(b, a, true);
    assert.isInFrontOf(a, other, true);
    assert.isInFrontOf(object, other, true);
    assert.isInFrontOf(object, c, true);
    assert.isInFrontOf(other, c, true);
    assert.isInFrontOf(b, c, true);
    assert.isInFrontOf(a, c, true);
    //  with canvas
    a.removeAll();
    b.removeAll();
    c.removeAll();
    canvas.add(object, other);
    assert.isInFrontOf(object, other, false);
    assert.isInFrontOf(object, canvas, true);
    assert.isInFrontOf(other, canvas, true);
    //  parent precedes canvas when checking ancestor
    a.add(object);
    assert.ok(object.canvas === canvas, 'object should have canvas set');
    assert.isInFrontOf(object, other, undefined);
    canvas.insertAt(0, a);
    assert.isInFrontOf(object, other, false);
    assert.isInFrontOf(a, other, false);
    assert.isInFrontOf(a, canvas, true);
    assert.isInFrontOf(object, canvas, true);
    assert.isInFrontOf(other, canvas, true);
  });

  QUnit.test('getTotalObjectScaling with zoom', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    canvas.setZoom(3);
    canvas.add(object);
    var objectScale = object.getTotalObjectScaling();
    assert.ok(objectScale instanceof fabric.Point);
    assert.deepEqual(objectScale, new fabric.Point(object.scaleX * 3, object.scaleY * 3));
  });

  QUnit.test('getTotalObjectScaling with retina', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    canvas.enableRetinaScaling = true;
    fabric.config.configure({ devicePixelRatio: 4 });
    canvas.add(object);
    var objectScale = object.getTotalObjectScaling();
    assert.ok(objectScale instanceof fabric.Point);
    assert.deepEqual(objectScale, new fabric.Point(object.scaleX * 4, object.scaleY * 4));
  });

  QUnit.test('getObjectScaling', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    var objectScale = object.getObjectScaling();
    assert.ok(objectScale instanceof fabric.Point);
    assert.deepEqual(objectScale, new fabric.Point(object.scaleX, object.scaleY));
  });

  QUnit.test('getObjectScaling in group', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    var group = new fabric.Group();
    group.scaleX = 2;
    group.scaleY = 2;
    object.group = group;
    var objectScale = object.getObjectScaling();
    assert.ok(objectScale instanceof fabric.Point);
    assert.deepEqual(objectScale, new fabric.Point(
      object.scaleX * group.scaleX,
      object.scaleY * group.scaleY
    ));
  });

  QUnit.test('getObjectScaling in group with object rotated', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2, angle: 45 });
    var group = new fabric.Group();
    group.scaleX = 2;
    group.scaleY = 3;
    object.group = group;
    var objectScale = object.getObjectScaling();
    assert.deepEqual(
      new fabric.Point(Math.round(objectScale.x * 1000) / 1000, Math.round(objectScale.y * 1000) / 1000),
      new fabric.Point(7.649, 4.707)
    );
  });

  QUnit.test('dirty flag on set property', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2});
    const originalCacheProps = fabric.Object.cacheProperties;
    fabric.Object.cacheProperties = ['propA', 'propB'];
    object.dirty = false;
    assert.equal(object.dirty, false, 'object starts with dirty flag disabled');
    object.set('propC', '3');
    assert.equal(object.dirty, false, 'after setting a property out of cache, dirty flag is still false');
    object.set('propA', '2');
    assert.equal(object.dirty, true, 'after setting a property from cache, dirty flag is true');
    fabric.Object.cacheProperties = originalCacheProps;
  });

  QUnit.test('_createCacheCanvas sets object as dirty', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2, width: 1, height: 2});
    assert.equal(object.dirty, true, 'object is dirty after creation');
    object.dirty = false;
    assert.equal(object.dirty, false, 'object is not dirty after specifying it');
    object._createCacheCanvas();
    assert.equal(object.dirty, true, 'object is dirty again if cache gets created');
  });

  QUnit.test('isCacheDirty', function(assert) {
    var object = new fabric.Object({ scaleX: 3, scaleY: 2, width: 1, height: 2});
    assert.equal(object.dirty, true, 'object is dirty after creation');
    const originalCacheProps = fabric.Object.cacheProperties;
    fabric.Object.cacheProperties = ['propA', 'propB'];
    object.dirty = false;
    assert.equal(object.isCacheDirty(), false, 'object is not dirty if dirty flag is false');
    object.dirty = true;
    assert.equal(object.isCacheDirty(), true, 'object is dirty if dirty flag is true');
    fabric.Object.cacheProperties = originalCacheProps;
  });

  QUnit.test('_getCacheCanvasDimensions returns dimensions and zoom for cache canvas', function(assert) {
    var object = new fabric.Object({ width: 10, height: 10, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    assert.deepEqual(dims, { width: 12, height: 12, zoomX: 1, zoomY: 1, x: 10, y: 10 }, 'if no scaling is applied cache is as big as object');
    object.strokeWidth = 2;
    dims = object._getCacheCanvasDimensions();
    assert.deepEqual(dims, { width: 14, height: 14, zoomX: 1, zoomY: 1, x: 12, y: 12 }, 'cache contains the stroke');
    object.scaleX = 2;
    object.scaleY = 3;
    dims = object._getCacheCanvasDimensions();
    assert.deepEqual(dims, { width: 26, height: 38, zoomX: 2, zoomY: 3, x: 24, y: 36 }, 'cache is as big as the scaled object');
  });

  QUnit.test('_getCacheCanvasDimensions and strokeUniform', function(assert) {
    var object = new fabric.Object({ width: 10, height: 10, strokeWidth: 2 });
    var dims = object._getCacheCanvasDimensions();
    assert.deepEqual(dims, { width: 14, height: 14, zoomX: 1, zoomY: 1, x: 12, y: 12 }, 'if no scaling is applied cache is as big as object + strokeWidth');
    object.strokeUniform = true;
    var dims = object._getCacheCanvasDimensions();
    assert.deepEqual(dims, { width: 14, height: 14, zoomX: 1, zoomY: 1, x: 12, y: 12 }, 'if no scaling is applied strokeUniform makes no difference');
    object.scaleX = 2;
    object.scaleY = 3;
    dims = object._getCacheCanvasDimensions();
    assert.deepEqual(dims, { width: 24, height: 34, zoomX: 2, zoomY: 3, x: 22, y: 32 }, 'cache is as big as the scaled object');
  });

  QUnit.test('_updateCacheCanvas check if cache canvas should be updated', function(assert) {
    fabric.config.configure({
      perfLimitSizeTotal: 10000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 1
    });
    var object = new fabric.Object({ width: 10, height: 10, strokeWidth: 0 });
    object._createCacheCanvas();
    assert.equal(object.cacheWidth, 12, 'current cache dimensions are saved');
    assert.equal(object.cacheHeight, 12, 'current cache dimensions are saved');
    assert.equal(object._updateCacheCanvas(), false, 'second execution of cache canvas return false');
    object.scaleX = 2;
    assert.equal(object._updateCacheCanvas(), true, 'if scale change, it returns true');
    assert.equal(object.cacheWidth, 22, 'current cache dimensions is updated');
    assert.equal(object.zoomX, 2, 'current scale level is saved');
    object.width = 2;
    assert.equal(object._updateCacheCanvas(), true, 'if dimension change, it returns true');
    assert.equal(object.cacheWidth, 6, 'current cache dimensions is updated');
    object.strokeWidth = 2;
    assert.equal(object._updateCacheCanvas(), true, 'if strokeWidth change, it returns true');
  });

  QUnit.test('_limitCacheSize limit min to 256', function(assert) {
    fabric.config.configure({
      perfLimitSizeTotal: 50000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256
    });
    var object = new fabric.Object({ width: 200, height: 200, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, 256, 'width gets minimum to the cacheSideLimit');
    assert.equal(dims.height, 256, 'height gets minimum to the cacheSideLimit');
    assert.equal(zoomX, dims.zoomX, 'zoom factor X does not need a change');
    assert.equal(zoomY, dims.zoomY, 'zoom factor Y does not need a change');
  });

  QUnit.test('_limitCacheSize does not limit if not necessary', function(assert) {
    fabric.config.configure({
      perfLimitSizeTotal: 1000000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256
    });
    var object = new fabric.Object({ width: 400, height: 400, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, 402, 'width is in the middle of limits');
    assert.equal(dims.height, 402, 'height is in the middle of limits');
    assert.equal(zoomX, dims.zoomX, 'zoom factor X does not need a change');
    assert.equal(zoomY, dims.zoomY, 'zoom factor Y does not need a change');
  });

  QUnit.test('_limitCacheSize does cap up minCacheSideLimit', function(assert) {
    fabric.config.configure({
      perfLimitSizeTotal: 10000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256
    });
    var object = new fabric.Object({ width: 400, height: 400, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var width = dims.width;
    var height = dims.height;
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, 256, 'width is capped to min');
    assert.equal(dims.height, 256, 'height is capped to min');
    assert.equal(zoomX * dims.width / width, dims.zoomX, 'zoom factor X gets updated to represent the shrink');
    assert.equal(zoomY * dims.height / height, dims.zoomY, 'zoom factor Y gets updated to represent the shrink');
  });

  QUnit.test('_limitCacheSize does cap up if necessary', function(assert) {
    fabric.config.configure({
      perfLimitSizeTotal: 1000000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256
    });
    var object = new fabric.Object({ width: 2046, height: 2046, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var width = dims.width;
    var height = dims.height;
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, 1000, 'width is capped to max allowed by area');
    assert.equal(dims.height, 1000, 'height is capped to max allowed by area');
    assert.equal(zoomX * dims.width / width, dims.zoomX, 'zoom factor X gets updated to represent the shrink');
    assert.equal(zoomY * dims.height / height, dims.zoomY, 'zoom factor Y gets updated to represent the shrink');
  });

  QUnit.test('_limitCacheSize does cap up if necessary to maxCacheSideLimit', function(assert) {
    fabric.config.configure({
      perfLimitSizeTotal: 100000000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256
    });
    var object = new fabric.Object({ width: 8192, height: 8192, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, fabric.config.maxCacheSideLimit, 'width is capped to max allowed by fabric');
    assert.equal(dims.height, fabric.config.maxCacheSideLimit, 'height is capped to max allowed by fabric');
    assert.equal(dims.zoomX, zoomX * 4096 / 8194, 'zoom factor X gets updated to represent the shrink');
    assert.equal(dims.zoomY, zoomY * 4096 / 8194, 'zoom factor Y gets updated to represent the shrink');
  });

  QUnit.test('_limitCacheSize does cap up if necessary to maxCacheSideLimit, different AR', function(assert) {
    fabric.config.configure({
      perfLimitSizeTotal: 100000000,
      maxCacheSideLimit: 4096,
      minCacheSideLimit: 256
    });
    var object = new fabric.Object({ width: 16384, height: 8192, strokeWidth: 0 });
    var dims = object._getCacheCanvasDimensions();
    var width = dims.width;
    var height = dims.height;
    var zoomX = dims.zoomX;
    var zoomY = dims.zoomY;
    var limitedDims = object._limitCacheSize(dims);
    assert.equal(dims, limitedDims, 'object is mutated');
    assert.equal(dims.width, fabric.config.maxCacheSideLimit, 'width is capped to max allowed by fabric');
    assert.equal(dims.height, fabric.config.maxCacheSideLimit, 'height is capped to max allowed by fabric');
    assert.equal(dims.zoomX, zoomX * fabric.config.maxCacheSideLimit / width, 'zoom factor X gets updated to represent the shrink');
    assert.equal(dims.zoomY, zoomY * fabric.config.maxCacheSideLimit / height, 'zoom factor Y gets updated to represent the shrink');
  });

  QUnit.test('_setShadow', function(assert) {
    var canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false, width: 600, height: 600});
    var context = canvas.contextContainer;
    var object = new fabric.Object({ scaleX: 1, scaleY: 1});
    var group = new fabric.Group();
    group.scaleX = 2;
    group.scaleY = 2;
    object.shadow = new fabric.Shadow({
      color: 'red',
      blur: 10,
      offsetX: 5,
      offsetY: 15
    });
    object._setShadow(context);
    assert.equal(context.shadowOffsetX, object.shadow.offsetX, 'shadow offsetX is set');
    assert.equal(context.shadowOffsetY, object.shadow.offsetY, 'shadow offsetY is set');
    assert.equal(context.shadowBlur, object.shadow.blur, 'shadow blur is set');
    fabric.config.configure({ browserShadowBlurConstant: 1.5 });
    object._setShadow(context);
    assert.equal(context.shadowOffsetX, object.shadow.offsetX, 'shadow offsetX is unchanged with browserConstant');
    assert.equal(context.shadowOffsetY, object.shadow.offsetY, 'shadow offsetY is unchanged with browserConstant');
    assert.equal(context.shadowBlur, object.shadow.blur * 1.5, 'shadow blur is affected with browserConstant');
    fabric.config.configure({ browserShadowBlurConstant: 1 });
    object.scaleX = 2;
    object.scaleY = 3;
    object._setShadow(context);
    assert.equal(context.shadowOffsetX, object.shadow.offsetX * object.scaleX, 'shadow offsetX is affected by scaleX');
    assert.equal(context.shadowOffsetY, object.shadow.offsetY * object.scaleY, 'shadow offsetY is affected by scaleY');
    assert.equal(context.shadowBlur, object.shadow.blur * (object.scaleX + object.scaleY) / 2, 'shadow blur is affected by scaleY and scaleX');
    object.group = group;
    object._setShadow(context);
    assert.equal(context.shadowOffsetX, object.shadow.offsetX * object.scaleX * group.scaleX, 'shadow offsetX is affected by scaleX and group.scaleX');
    assert.equal(context.shadowOffsetY, object.shadow.offsetY * object.scaleY * group.scaleY, 'shadow offsetX is affected by scaleX and group.scaleX');
    assert.equal(context.shadowBlur, object.shadow.blur * (object.scaleX * group.scaleX + object.scaleY * group.scaleY) / 2, 'shadow blur is affected by scales');
  });

  QUnit.test('willDrawShadow', function(assert) {
    var object = new fabric.Object({ shadow: { offsetX: 0, offsetY: 0 }});
    assert.equal(object.willDrawShadow(), false, 'object will not drawShadow');
    object.shadow.offsetX = 1;
    assert.equal(object.willDrawShadow(), true, 'object will drawShadow');
  });

  QUnit.test('_set  change a property', function(assert) {
    var object = new fabric.Object({ fill: 'blue' });
    object._set('fill', 'red');
    assert.equal(object.fill, 'red', 'property changed');
  });
  QUnit.test('_set can rise the dirty flag', function(assert) {
    var object = new fabric.Object({ fill: 'blue' });
    object.dirty = false;
    object._set('fill', 'red');
    assert.equal(object.dirty, true, 'dirty is raised');
  });
  QUnit.test('_set rise dirty flag only if value changed', function(assert) {
    var object = new fabric.Object({ fill: 'blue' });
    object.dirty = false;
    object._set('fill', 'blue');
    assert.equal(object.dirty, false, 'dirty is not raised');
  });
  QUnit.test('isNotVisible', function(assert) {
    var object = new fabric.Object({ fill: 'blue', width: 100, height: 100 });
    assert.equal(object.isNotVisible(), false, 'object is default visible');
    object = new fabric.Object({ fill: 'blue', width: 0, height: 0, strokeWidth: 1 });
    assert.equal(object.isNotVisible(), false, 'object is visible with width and height equal 0, but strokeWidth 1');
    object = new fabric.Object({ opacity: 0, fill: 'blue' });
    assert.equal(object.isNotVisible(), true, 'object is not visible with opacity 0');
    object = new fabric.Object({ fill: 'blue', visible: false });
    assert.equal(object.isNotVisible(), true, 'object is not visible with visible false');
    object = new fabric.Object({ fill: 'blue', width: 0, height: 0, strokeWidth: 0 });
    assert.equal(object.isNotVisible(), true, 'object is not visible with also strokeWidth equal 0');
  });
  QUnit.test('shouldCache', function(assert) {
    var object = new fabric.Object();
    object.objectCaching = false;
    assert.equal(object.shouldCache(), false, 'if objectCaching is false, object should not cache');
    object.objectCaching = true;
    assert.equal(object.shouldCache(), true, 'if objectCaching is true, object should cache');
    object.objectCaching = false;
    object.needsItsOwnCache = function () { return true; };
    assert.equal(object.shouldCache(), true, 'if objectCaching is false, but we have a clipPath, shouldCache returns true');

    object.needsItsOwnCache = function () { return false; };

    object.objectCaching = true;
    object.group = { isOnACache: function() { return true; }};
    assert.equal(object.shouldCache(), false, 'if objectCaching is true, but we are in a group, shouldCache returns false');

    object.objectCaching = true;
    object.group = { isOnACache: function() { return false; }};
    assert.equal(object.shouldCache(), true, 'if objectCaching is true, but we are in a not cached group, shouldCache returns true');

    object.objectCaching = false;
    object.group = { isOnACache: function() { return false; }};
    assert.equal(object.shouldCache(), false, 'if objectCaching is false, but we are in a not cached group, shouldCache returns false');

    object.objectCaching = false;
    object.group = { isOnACache: function() { return true; }};
    assert.equal(object.shouldCache(), false, 'if objectCaching is false, but we are in a cached group, shouldCache returns false');

    object.needsItsOwnCache = function () { return true; };

    object.objectCaching = false;
    object.group = { isOnACache: function() { return true; }};
    assert.equal(object.shouldCache(), true, 'if objectCaching is false, but we have a clipPath, group cached, we cache anyway');

    object.objectCaching = false;
    object.group = { isOnACache: function() { return false; }};
    assert.equal(object.shouldCache(), true, 'if objectCaching is false, but we have a clipPath, group not cached, we cache anyway');

  });
  QUnit.test('needsItsOwnCache', function(assert) {
    var object = new fabric.Object();
    assert.equal(object.needsItsOwnCache(), false, 'default needsItsOwnCache is false');
    object.clipPath = {};
    assert.equal(object.needsItsOwnCache(), true, 'with a clipPath is true');
    delete object.clipPath;

    object.paintFirst = 'stroke';
    object.stroke = 'black';
    object.shadow = {};
    assert.equal(object.needsItsOwnCache(), true, 'if stroke first will return true');

    object.paintFirst = 'stroke';
    object.stroke = 'black';
    object.shadow = null;
    assert.equal(object.needsItsOwnCache(), true, 'if stroke first will return false if no shadow');

    object.paintFirst = 'stroke';
    object.stroke = '';
    object.shadow = {};
    assert.equal(object.needsItsOwnCache(), false, 'if stroke first will return false if no stroke');

    object.paintFirst = 'stroke';
    object.stroke = 'black';
    object.fill = '';
    object.shadow = {};
    assert.equal(object.needsItsOwnCache(), false, 'if stroke first will return false if no fill');
  });
  QUnit.test('hasStroke', function(assert) {
    var object = new fabric.Object({ fill: 'blue', width: 100, height: 100, strokeWidth: 3, stroke: 'black' });
    assert.equal(object.hasStroke(), true, 'if strokeWidth is present and stroke is black hasStroke is true');
    object.stroke = '';
    assert.equal(object.hasStroke(), false, 'if strokeWidth is present and stroke is empty string hasStroke is false');
    object.stroke = 'transparent';
    assert.equal(object.hasStroke(), false, 'if strokeWidth is present and stroke is transparent hasStroke is false');
    object.stroke = 'black';
    object.strokeWidth = 0;
    assert.equal(object.hasStroke(), false, 'if strokeWidth is 0 and stroke is a color hasStroke is false');
  });
  QUnit.test('hasFill', function(assert) {
    var object = new fabric.Object({ fill: 'blue', width: 100, height: 100 });
    assert.equal(object.hasFill(), true, 'with a color that is not transparent, hasFill is true');
    object.fill = '';
    assert.equal(object.hasFill(), false, 'without a color, hasFill is false');
    object.fill = 'transparent';
    assert.equal(object.hasFill(), false, 'with a color that is transparent, hasFill is true');
  });
  QUnit.test('dispose', function (assert) {
    var object = new fabric.Object({ fill: 'blue', width: 100, height: 100 });
    let off = false;
    object.off = () => {
      off = true;
    }
    object.canvas = canvas;
    assert.ok(typeof object.dispose === 'function');
    object.animate({ fill: 'red' });
    const findAnimationsByTarget = target => fabric.runningAnimations.filter(({ target: t }) => target === t);
    assert.equal(findAnimationsByTarget(object).length, 1, 'runningAnimations should include the animation');
    object.dispose();
    assert.equal(findAnimationsByTarget(object).length, 0, 'runningAnimations should be empty after dispose');
    assert.ok(!object.canvas, 'cleared canvas');
    assert.ok(off, 'unsubscribe events');
  });
  // this is no more valid for now
  // QUnit.test('prototype changes', function (assert) {
  //   var object = new fabric.Object();
  //   var object2 = new fabric.Object();
  //   object2.fill = 'red'
  //   assert.equal(object.fill, 'rgb(0,0,0)', 'by default objects have a rgb(0,0,0) fill');
  //   assert.equal(object2.fill, 'red', 'once assigned object is red');
  //   fabric.Object.prototype.fill = 'green';
  //   assert.equal(object.fill, 'green', 'object with no value assigned read from prototype');
  //   assert.equal(object2.fill, 'red', 'once assigned object is red, it stays red');
  //   var object3 = new fabric.Object();
  //   assert.equal(object3.fill, 'green', 'newly created object have now green by default');
  //   fabric.Object.prototype.fill = 'rgb(0,0,0)';
  // });
})();
