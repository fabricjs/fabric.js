(function() {

  var el = fabric.document.createElement('canvas');
  el.width = 600; el.height = 600;

  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode(600, 600, {enableRetinaScaling: false}) : new fabric.Canvas(el, {enableRetinaScaling: false});

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
    teardown: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });

  test('constructor', function() {
    var group = makeAsWith2Objects();

    ok(group);
    ok(group instanceof fabric.ActiveSelection, 'should be instance of fabric.ActiveSelection');
  });

  test('toString', function() {
    var group = makeAsWith2Objects();
    equal(group.toString(), '#<fabric.ActiveSelection: (2)>', 'should return proper representation');
  });

  test('toObject', function() {
    var group = makeAsWith2Objects();

    ok(typeof group.toObject === 'function');

    var clone = group.toObject();

    var expectedObject = {
      'type':                     'activeSelection',
      'originX':                  'left',
      'originY':                  'top',
      'left':                     50,
      'top':                      100,
      'width':                    80,
      'height':                   60,
      'fill':                     'rgb(0,0,0)',
      'stroke':                   null,
      'strokeWidth':              0,
      'strokeDashArray':          null,
      'strokeLineCap':            'butt',
      'strokeLineJoin':           'miter',
      'strokeMiterLimit':         10,
      'scaleX':                   1,
      'scaleY':                   1,
      'shadow':                   null,
      'visible':                  true,
      'backgroundColor':          '',
      'clipTo':                   null,
      'angle':                    0,
      'flipX':                    false,
      'flipY':                    false,
      'opacity':                  1,
      'fillRule':                 'nonzero',
      'globalCompositeOperation': 'source-over',
      'transformMatrix':          null,
      'skewX':                    0,
      'skewY':                    0,
      'objects':                  clone.objects
    };

    deepEqual(clone, expectedObject);

    ok(group !== clone, 'should produce different object');
    ok(group.getObjects() !== clone.objects, 'should produce different object array');
    ok(group.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');
  });

  test('toObject without default values', function() {
    var group = makeAsWith2Objects();
    group.includeDefaultValues = false;
    var clone = group.toObject();
    var objects = [{
      type: 'rect',
      left: 10,
      top: -30,
      width: 30,
      height: 10,
      strokeWidth: 0
    }, {
      type: 'rect',
      left: -40,
      top: -10,
      width: 10,
      height: 40,
      strokeWidth: 0
    }];
    var expectedObject = {
      'type':               'activeSelection',
      'left':               50,
      'top':                100,
      'width':              80,
      'height':             60,
      'objects':            objects
    };
    deepEqual(clone, expectedObject);
  });

  test('_renderControls', function() {
    ok(typeof fabric.ActiveSelection.prototype._renderControls === 'function');
  });

  asyncTest('fromObject', function() {
    var group = makeAsWith2ObjectsWithOpacity();

    ok(typeof fabric.ActiveSelection.fromObject === 'function');
    var groupObject = group.toObject();

    fabric.ActiveSelection.fromObject(groupObject, function(newGroupFromObject) {

      var objectFromOldGroup = group.toObject();
      var objectFromNewGroup = newGroupFromObject.toObject();

      ok(newGroupFromObject instanceof fabric.ActiveSelection);

      deepEqual(objectFromOldGroup.objects[0], objectFromNewGroup.objects[0]);
      deepEqual(objectFromOldGroup.objects[1], objectFromNewGroup.objects[1]);

      // delete `objects` arrays, since `assertHashEqual` fails to compare them for equality
      delete objectFromOldGroup.objects;
      delete objectFromNewGroup.objects;

      deepEqual(objectFromOldGroup, objectFromNewGroup);

      start();
    });
  });

  test('get with locked objects', function() {
    var group = makeAsWith2Objects();

    equal(group.get('lockMovementX'), false);

    // TODO acitveGroup
    // group.getObjects()[0].lockMovementX = true;
    // equal(group.get('lockMovementX'), true);
    //
    // group.getObjects()[0].lockMovementX = false;
    // equal(group.get('lockMovementX'), false);

    group.set('lockMovementX', true);
    equal(group.get('lockMovementX'), true);

    // group.set('lockMovementX', false);
    // group.getObjects()[0].lockMovementY = true;
    // group.getObjects()[1].lockRotation = true;
    //
    // equal(group.get('lockMovementY'), true);
    // equal(group.get('lockRotation'), true);
  });

  test('insertAt', function() {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        group = new fabric.Group();

    group.add(rect1, rect2);

    ok(typeof group.insertAt == 'function', 'should respond to `insertAt` method');

    group.insertAt(rect1, 1);
    equal(group.item(1), rect1);
    group.insertAt(rect2, 2);
    equal(group.item(2), rect2);
    equal(group.insertAt(rect1, 2), group, 'should be chainable');
  });

  test('group addWithUpdate', function() {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        group = new fabric.Group([rect1]);

    var coords = group.oCoords;
    group.addWithUpdate(rect2);
    var newCoords = group.oCoords;
    notEqual(coords, newCoords, 'object coords have been recalculated - add');
  });

  test('group removeWithUpdate', function() {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: false}),
        group = new fabric.Group([rect1, rect2]);

    var coords = group.oCoords;
    group.removeWithUpdate(rect2);
    var newCoords = group.oCoords;
    notEqual(coords, newCoords, 'object coords have been recalculated - remove');
  });

  test('ActiveSelection shouldCache', function() {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        group = new fabric.ActiveSelection([rect1, rect2], { objectCaching: true});

    equal(group.shouldCache(), false, 'Active selection do not cache');
  });

  test('canvas property propagation', function() {
    var g2 = makeAsWith4Objects();

    canvas.add(g2);
    equal(g2.canvas, canvas);
    equal(g2._objects[3].canvas, canvas);
  });

})();
