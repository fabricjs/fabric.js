(function() {

  var canvas = this.canvas = new fabric.Canvas();

  function _createImageElement() {
    return fabric.isLikelyNode ? new (require('canvas').Image) : fabric.document.createElement('img');
  }

  function makeGroupWith2Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 });

    return new fabric.Group([ rect1, rect2 ]);
  }

  QUnit.module('fabric.Group', {
    teardown: function() {
      canvas.clear();
      canvas.setActiveGroup(null);
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });

  test('constructor', function() {
    var group = makeGroupWith2Objects();

    ok(group);
    ok(group instanceof fabric.Group, 'should be instance of fabric.Group');
  });

  test('toString', function() {
    var group = makeGroupWith2Objects();
    equal(group.toString(), '#<fabric.Group: (2)>', 'should return proper representation');
  });

  test('getObjects', function() {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect();

    var group = new fabric.Group([ rect1, rect2 ]);

    ok(typeof group.getObjects == 'function');
    ok(Object.prototype.toString.call(group.getObjects()) == '[object Array]', 'should be an array');
    equal(group.getObjects().length, 2, 'should have 2 items');
    deepEqual([ rect1, rect2 ], group.getObjects(), 'should return deepEqual objects as those passed to constructor');
  });

  test('add', function() {
    var group = makeGroupWith2Objects();
    var rect = new fabric.Rect();

    ok(typeof group.add == 'function');
    equal(group.add(rect), group, 'should be chainable');
    equal(group.getObjects()[group.getObjects().length-1], rect, 'last object should be newly added one');
    equal(group.getObjects().length, 3, 'there should be 3 objects');
  });

  test('remove', function() {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        rect3 = new fabric.Rect(),
        group = new fabric.Group([ rect1, rect2, rect3 ]);

    ok(typeof group.remove == 'function');
    equal(group.remove(rect2), group, 'should be chainable');
    deepEqual([rect1, rect3], group.getObjects(), 'should remove object properly');
  });

  test('size', function() {
    var group = makeGroupWith2Objects();

    ok(typeof group.size == 'function');
    equal(group.size(), 2);
    group.add(new fabric.Rect());
    equal(group.size(), 3);
    group.remove(group.getObjects()[0]).remove(group.getObjects()[0]);
    equal(group.size(), 1);
  });

  test('set', function() {
    var group = makeGroupWith2Objects(),
        firstObject = group.getObjects()[0];

    ok(typeof group.set == 'function');

    equal(group.set('opacity', 0.12345), group, 'should be chainable');
    equal(group.get('opacity'), 0.12345, 'group\'s "own" property should be set properly');
    equal(firstObject.get('opacity'), 0.12345, 'objects\' value should be set properly');

    group.set('left', 1234);
    equal(group.get('left'), 1234, 'group\'s own "left" property should be set properly');
    ok(firstObject.get('left') !== 1234, 'objects\' value should not be affected');

    group.set('left', function(value){ return value + 1234; });
    equal(group.get('left'), 2468, 'group\'s own "left" property should be set properly via function');
    ok(firstObject.get('left') !== 2468, 'objects\' value should not be affected when set via function');

    group.set({ left: 888, top: 999 });
    equal(group.get('left'), 888, 'group\'s own "left" property should be set properly via object');
    equal(group.get('top'), 999, 'group\'s own "top" property should be set properly via object');
  });

  test('contains', function() {
    var rect1           = new fabric.Rect(),
        rect2           = new fabric.Rect(),
        notIncludedRect = new fabric.Rect(),
        group           = new fabric.Group([ rect1, rect2 ]);

    ok(typeof group.contains == 'function');

    ok(group.contains(rect1), 'should contain first object');
    ok(group.contains(rect2), 'should contain second object');

    ok(!group.contains(notIncludedRect), 'should report not-included one properly');
  });

  test('toObject', function() {
    var group = makeGroupWith2Objects();

    ok(typeof group.toObject == 'function');

    var clone = group.toObject();

    var expectedObject = {
      'type': 'group',
      'originX': 'center',
      'originY': 'center',
      'left': 80,
      'top': 117.5,
      'width': 70,
      'height': 45,
      'fill': 'rgb(0,0,0)',
      'overlayFill': null,
      'stroke': null,
      'strokeWidth': 1,
      'strokeDashArray': null,
      'scaleX': 1,
      'scaleY': 1,
      'selectable': true,
      'hasControls': true,
      'hasBorders': true,
      'hasRotatingPoint': true,
      'transparentCorners': true,
      'perPixelTargetFind': false,
      'shadow': null,
      'visible': true,
      'angle': 0,
      'flipX': false,
      'flipY': false,
      'opacity': 1,
      'objects': clone.objects
    };

    deepEqual(clone, expectedObject);

    ok(group !== clone, 'should produce different object');
    ok(group.getObjects() !== clone.objects, 'should produce different object array');
    ok(group.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');
  });

  test('render', function() {
    var group = makeGroupWith2Objects();
    ok(typeof group.render == 'function');
  });

  test('item', function() {
    var group = makeGroupWith2Objects();

    ok(typeof group.item == 'function');
    equal(group.item(0), group.getObjects()[0]);
    equal(group.item(1), group.getObjects()[1]);
    equal(group.item(9999), undefined);
  });

  test('complexity', function() {
    var group = makeGroupWith2Objects();

    ok(typeof group.complexity == 'function');
    equal(group.complexity(), 2);
  });

  test('destroy', function() {
    var group = makeGroupWith2Objects(),
        firstObject = group.item(0),
        initialLeftValue = 100,
        initialTopValue = 100;

    ok(typeof group.destroy == 'function');

    ok(initialLeftValue !== firstObject.get('left'));
    ok(initialTopValue !== firstObject.get('top'));

    group.destroy();
    equal(firstObject.get('left'), initialLeftValue, 'should restore initial left value');
    equal(firstObject.get('top'), initialTopValue, 'should restore initial top value');
  });

  test('saveCoords', function() {
    var group = makeGroupWith2Objects();

    ok(typeof group.saveCoords == 'function');
    equal(group.saveCoords(), group, 'should be chainable');
  });

  test('hasMoved', function() {
    var group = makeGroupWith2Objects();

    ok(typeof group.hasMoved == 'function');
    equal(group.hasMoved(), false);

    function moveBy10(value) {
      return value + 10;
    }
    group.set('left', moveBy10);
    equal(group.hasMoved(), true);
    group.saveCoords();
    equal(group.hasMoved(), false);
    group.set('top', moveBy10);
    equal(group.hasMoved(), true);
  });

  test('setObjectCoords', function(){
    var group = makeGroupWith2Objects();

    ok(typeof group.setObjectsCoords == 'function');

    var invokedObjects = [ ];
    group.forEachObject(function(groupObject){
      groupObject.setCoords = function() {
        invokedObjects.push(this);
      };
    }, this);

    equal(group.setObjectsCoords(), group, 'should be chainable');
    // this.assertEnumEqualUnordered(invokedObjects, group.getObjects(), 'setObjectsCoords should call setCoords on all objects');
  });

  test('containsPoint', function() {

    var group = makeGroupWith2Objects();
    //  Rect #1     top: 100, left: 100, width: 30, height: 10
    //  Rect #2     top: 120, left: 50, width: 10, height: 40

    ok(typeof group.containsPoint == 'function');

    ok(group.containsPoint({ x: 50, y: 120 }));
    ok(group.containsPoint({ x: 100, y: 100 }));
    ok(!group.containsPoint({ x: 0, y: 0 }));
  });

  test('forEachObject', function() {
    var group = makeGroupWith2Objects();

    ok(typeof group.forEachObject == 'function');
    equal(group.forEachObject(function(){}), group, 'should be chainable');

    var iteratedObjects = [ ];
    group.forEachObject(function(groupObject) {
      iteratedObjects.push(groupObject);
    });

    equal(iteratedObjects[1], group.getObjects()[0]);
    equal(iteratedObjects[0], group.getObjects()[1]);
  });

  asyncTest('fromObject', function() {
    var group = makeGroupWith2Objects();

    ok(typeof fabric.Group.fromObject == 'function');
    var groupObject = group.toObject();

    fabric.Group.fromObject(groupObject, function(newGroupFromObject) {

      var objectFromOldGroup = group.toObject();
      var objectFromNewGroup = newGroupFromObject.toObject();

      ok(newGroupFromObject instanceof fabric.Group);

      // delete `objects` arrays, since `assertHashEqual` fails to compare them for equality
      delete objectFromOldGroup.objects;
      delete objectFromNewGroup.objects;

      deepEqual(objectFromOldGroup, objectFromNewGroup);

      start();
    });
  });

  test('toSVG', function() {
    var group = makeGroupWith2Objects();
    ok(typeof group.toSVG == 'function');

    var expectedSVG = '<g transform="translate(80 117.5)"><rect x="-5" y="-20" rx="0" ry="0" width="10" height="40" style="stroke: none; stroke-width: 1; stroke-dasharray: ; fill: rgb(0,0,0); opacity: 1;" transform="translate(-30 2.5)"/><rect x="-15" y="-5" rx="0" ry="0" width="30" height="10" style="stroke: none; stroke-width: 1; stroke-dasharray: ; fill: rgb(0,0,0); opacity: 1;" transform="translate(20 -17.5)"/></g>';
    equal(group.toSVG(), expectedSVG);
  });

  asyncTest('clonining group with 2 objects', function() {
    var group = makeGroupWith2Objects();
    group.clone(function(clone) {

      ok(clone !== group);
      deepEqual(clone.toObject(), group.toObject());

      start();
    });
  });

  test('get with locked objects', function() {
    var group = makeGroupWith2Objects();

    equal(group.get('lockMovementX'), false);

    group.objects[0].lockMovementX = true;
    equal(group.get('lockMovementX'), true);

    group.objects[0].lockMovementX = false;
    equal(group.get('lockMovementX'), false);

    group.set('lockMovementX', true);
    equal(group.get('lockMovementX'), true);

    group.set('lockMovementX', false);
    group.objects[0].lockMovementY = true;
    group.objects[1].lockRotation = true;

    equal(group.get('lockMovementY'), true);
    equal(group.get('lockRotation'), true);
  });

  // asyncTest('cloning group with image', function() {
  //   var rect = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
  //       img = new fabric.Image(_createImageElement()),
  //       group = new fabric.Group([ rect, img ]);

  //   img.src = 'foo.png';

  //   group.clone(function(clone) {
  //     ok(clone !== group);
  //     deepEqual(clone.toObject(), group.toObject());

  //     start();
  //   });
  // });

})();