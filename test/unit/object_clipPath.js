(function(){

  // var canvas = this.canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false});

  QUnit.module('fabric.Object - clipPath', {
    afterEach: function() {
      // canvas.clear();
      // canvas.calcOffset();
    }
  });

  QUnit.test('constructor & properties', function(assert) {
    var cObj = new fabric.Object();
    assert.equal(cObj.clipPath, undefined, 'clipPath should not be defined out of the box');
  });

  QUnit.test('toObject with clipPath', function(assert) {
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
      skewX:                     0,
      skewY:                     0,
      strokeUniform:             false
    };

    var cObj = new fabric.Object();
    assert.deepEqual(emptyObjectRepr, cObj.toObject());

    cObj.clipPath = new fabric.Object();

    assert.deepEqual({
      ...emptyObjectRepr,
      clipPath: {
        ...emptyObjectRepr,
        inverted: cObj.clipPath.inverted,
      absolutePositioned: cObj.clipPath.absolutePositioned,
      }
    }, cObj.toObject());

    cObj.clipPath.excludeFromExport = true;
    assert.ok(cObj.toObject().clipPath === undefined);
  });

  QUnit.test('from object with clipPath', function(assert) {
    var done = assert.async();
    var rect = new fabric.Rect({ width: 100, height: 100 });
    rect.clipPath = new fabric.Circle({ radius: 50 });
    var toObject = rect.toObject();
    fabric.Rect.fromObject(toObject).then(function(rect) {
      assert.ok(rect.clipPath instanceof fabric.Circle, 'clipPath is enlived');
      assert.equal(rect.clipPath.radius, 50, 'radius is restored correctly');
      done();
    });
  });

  QUnit.test('from object with clipPath inverted, absolutePositioned', function(assert) {
    var done = assert.async();
    var rect = new fabric.Rect({ width: 100, height: 100 });
    rect.clipPath = new fabric.Circle({ radius: 50, inverted: true, absolutePositioned: true });
    var toObject = rect.toObject();
    fabric.Rect.fromObject(toObject).then(function(rect) {
      assert.ok(rect.clipPath instanceof fabric.Circle, 'clipPath is enlived');
      assert.equal(rect.clipPath.radius, 50, 'radius is restored correctly');
      assert.equal(rect.clipPath.inverted, true, 'inverted is restored correctly');
      assert.equal(rect.clipPath.absolutePositioned, true, 'absolutePositioned is restored correctly');
      done();
    });
  });

  QUnit.test('from object with clipPath, nested', function(assert) {
    var done = assert.async();
    var rect = new fabric.Rect({ width: 100, height: 100 });
    rect.clipPath = new fabric.Circle({ radius: 50 });
    rect.clipPath.clipPath = new fabric.Text('clipPath');
    var toObject = rect.toObject();
    fabric.Rect.fromObject(toObject).then(function(rect) {
      assert.ok(rect.clipPath instanceof fabric.Circle, 'clipPath is enlived');
      assert.equal(rect.clipPath.radius, 50, 'radius is restored correctly');
      assert.ok(rect.clipPath.clipPath instanceof fabric.Text, 'nested clipPath is enlived');
      assert.equal(rect.clipPath.clipPath.text, 'clipPath', 'instance is restored correctly');
      done();
    });
  });

  QUnit.test('from object with clipPath, nested inverted, absolutePositioned', function(assert) {
    var done = assert.async();
    var rect = new fabric.Rect({ width: 100, height: 100 });
    rect.clipPath = new fabric.Circle({ radius: 50 });
    rect.clipPath.clipPath = new fabric.Text('clipPath', { inverted: true, absolutePositioned: true});
    var toObject = rect.toObject();
    fabric.Rect.fromObject(toObject).then(function(rect) {
      assert.ok(rect.clipPath instanceof fabric.Circle, 'clipPath is enlived');
      assert.equal(rect.clipPath.radius, 50, 'radius is restored correctly');
      assert.ok(rect.clipPath.clipPath instanceof fabric.Text, 'neted clipPath is enlived');
      assert.equal(rect.clipPath.clipPath.text, 'clipPath', 'instance is restored correctly');
      assert.equal(rect.clipPath.clipPath.inverted, true, 'instance inverted is restored correctly');
      assert.equal(rect.clipPath.clipPath.absolutePositioned, true, 'instance absolutePositioned is restored correctly');
      done();
    });
  });

  QUnit.test('_setClippingProperties fix the context props', function(assert) {
    var canvas = new fabric.Canvas();
    var rect = new fabric.Rect({ width: 100, height: 100 });
    canvas.contextContainer.fillStyle = 'red';
    canvas.contextContainer.strokeStyle = 'blue';
    canvas.contextContainer.globalAlpha = 0.3;
    rect._setClippingProperties(canvas.contextContainer);
    assert.equal(canvas.contextContainer.fillStyle, '#000000', 'fillStyle is reset');
    assert.equal(new fabric.Color(canvas.contextContainer.strokeStyle).getAlpha(), 0, 'stroke style is reset');
    assert.equal(canvas.contextContainer.globalAlpha, 1, 'globalAlpha is reset');
  });
})();
