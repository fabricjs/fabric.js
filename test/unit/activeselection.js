(function() {

  var canvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, width: 600, height: 600});

  function makeAsWith2Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 });

    return new fabric.ActiveSelection([rect1, rect2], {strokeWidth: 0});
  }

  function makeAsWith2ObjectsWithOpacity() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0, opacity: 0.5 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, opacity: 0.8 });

    return new fabric.ActiveSelection([rect1, rect2], {strokeWidth: 0});
  }

  function makeAsWith4Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 }),
        rect3 = new fabric.Rect({ top: 40, left: 0, width: 20, height: 40 }),
        rect4 = new fabric.Rect({ top: 75, left: 75, width: 40, height: 40 });

    return new fabric.ActiveSelection([rect1, rect2, rect3, rect4]);
  }

  QUnit.module('fabric.ActiveSelection', {
    afterEach: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.getDefaults().backgroundColor;
      canvas.calcOffset();
    }
  });

  QUnit.test('constructor', function(assert) {
    var group = makeAsWith2Objects();

    assert.ok(group);
    assert.ok(group instanceof fabric.ActiveSelection, 'should be instance of fabric.ActiveSelection');
  });

  QUnit.test('toString', function(assert) {
    var group = makeAsWith2Objects();
    assert.equal(group.toString(), '#<ActiveSelection: (2)>', 'should return proper representation');
  });

  QUnit.test('toObject', function(assert) {
    var group = makeAsWith2Objects();

    assert.ok(typeof group.toObject === 'function');

    var clone = group.toObject();

    var expectedObject = {
      version:                  fabric.version,
      type:                     'ActiveSelection',
      originX:                  'left',
      originY:                  'top',
      left:                     50,
      top:                      100,
      width:                    80,
      height:                   60,
      fill:                     'rgb(0,0,0)',
      layout:                   'fit-content',
      stroke:                   null,
      strokeWidth:              0,
      strokeDashArray:          null,
      strokeLineCap:            'butt',
      strokeDashOffset:         0,
      strokeLineJoin:           'miter',
      strokeMiterLimit:         4,
      scaleX:                   1,
      scaleY:                   1,
      shadow:                   null,
      subTargetCheck:           false,
      interactive:              false,
      visible:                  true,
      backgroundColor:          '',
      angle:                    0,
      flipX:                    false,
      flipY:                    false,
      opacity:                  1,
      fillRule:                 'nonzero',
      paintFirst:               'fill',
      globalCompositeOperation: 'source-over',
      skewX:                    0,
      skewY:                    0,
      strokeUniform:            false,
      objects:                  clone.objects
    };

    assert.deepEqual(clone, expectedObject);

    assert.ok(group !== clone, 'should produce different object');
    assert.ok(group.getObjects() !== clone.objects, 'should produce different object array');
    assert.ok(group.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');
  });

  QUnit.test('toObject without default values', function(assert) {
    var group = makeAsWith2Objects();
    group.includeDefaultValues = false;
    var clone = group.toObject();
    var objects = [{
      version: fabric.version,
      type: 'Rect',
      left: 10,
      top: -30,
      width: 30,
      height: 10,
      strokeWidth: 0
    }, {
      version: fabric.version,
      type: 'Rect',
      left: -40,
      top: -10,
      width: 10,
      height: 40,
      strokeWidth: 0
    }];
    var expectedObject = {
      version:            fabric.version,
      type:               'ActiveSelection',
      left:               50,
      top:                100,
      width:              80,
      height:             60,
      objects:            objects,
    };
    assert.deepEqual(clone, expectedObject);
  });

  QUnit.test('_renderControls', function(assert) {
    assert.ok(typeof fabric.ActiveSelection.prototype._renderControls === 'function');
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    var group = makeAsWith2ObjectsWithOpacity();

    assert.ok(typeof fabric.ActiveSelection.fromObject === 'function');
    var groupObject = group.toObject();

    fabric.ActiveSelection.fromObject(groupObject).then(function(newGroupFromObject) {

      var objectFromOldGroup = group.toObject();
      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.ActiveSelection);

      assert.deepEqual(objectFromOldGroup.objects[0], objectFromNewGroup.objects[0]);
      assert.deepEqual(objectFromOldGroup.objects[1], objectFromNewGroup.objects[1]);

      // delete `objects` arrays, since `assertHashEqual` fails to compare them for equality
      delete objectFromOldGroup.objects;
      delete objectFromNewGroup.objects;

      assert.deepEqual(objectFromOldGroup, objectFromNewGroup);

      done();
    });
  });

  QUnit.test('get with locked objects', function(assert) {
    var group = makeAsWith2Objects();

    assert.equal(group.get('lockMovementX'), false);

    // TODO activeGroup
    // group.getObjects()[0].lockMovementX = true;
    // assert.equal(group.get('lockMovementX'), true);
    //
    // group.getObjects()[0].lockMovementX = false;
    // assert.equal(group.get('lockMovementX'), false);

    group.set('lockMovementX', true);
    assert.equal(group.get('lockMovementX'), true);

    // group.set('lockMovementX', false);
    // group.getObjects()[0].lockMovementY = true;
    // group.getObjects()[1].lockRotation = true;
    //
    // assert.equal(group.get('lockMovementY'), true);
    // assert.equal(group.get('lockRotation'), true);
  });

  QUnit.test('ActiveSelection shouldCache', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        group = new fabric.ActiveSelection([rect1, rect2], { objectCaching: true});

    assert.equal(group.shouldCache(), false, 'Active selection do not cache');
  });

  QUnit.test('canvas property propagation', function(assert) {
    var g2 = makeAsWith4Objects();

    canvas.add(g2);
    assert.equal(g2.canvas, canvas);
    assert.equal(g2._objects[3].canvas, canvas);
  });

})();
