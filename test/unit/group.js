(function() {

  var el = fabric.document.createElement('canvas');
  el.width = 600; el.height = 600;

  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.Canvas(el);

  // function _createImageElement() {
  //   return fabric.isLikelyNode ? new (require('canvas').Image)() : fabric.document.createElement('img');
  // }

  function makeGroupWith2Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 });

    return new fabric.Group([ rect1, rect2 ], {strokeWidth: 0});
  }

  function makeGroupWith4Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 }),
        rect3 = new fabric.Rect({ top: 40, left: 0, width: 20, height: 40 }),
        rect4 = new fabric.Rect({ top: 75, left: 75, width: 40, height: 40 });

    return new fabric.Group([ rect1, rect2, rect3, rect4 ]);
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
    deepEqual(group.getObjects(), [ rect1, rect2 ], 'should return deepEqual objects as those passed to constructor');
  });

  test('getObjects with type', function() {
    var rect = new fabric.Rect({ width: 10, height: 20 }),
        circle = new fabric.Circle({ radius: 30 });

    var group = new fabric.Group([ rect, circle ]);

    equal(group.size(), 2, 'should have length=2 initially');

    deepEqual(group.getObjects('rect'), [rect], 'should return rect only');
    deepEqual(group.getObjects('circle'), [circle], 'should return circle only');
  });

  test('add', function() {
    var group = makeGroupWith2Objects();
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        rect3 = new fabric.Rect();

    ok(typeof group.add == 'function');
    equal(group.add(rect1), group, 'should be chainable');
    strictEqual(group.item(group.size()-1), rect1, 'last object should be newly added one');
    equal(group.getObjects().length, 3, 'there should be 3 objects');

    group.add(rect2, rect3);
    strictEqual(group.item(group.size()-1), rect3, 'last object should be last added one');
    equal(group.size(), 5, 'there should be 5 objects');
  });

  test('remove', function() {
    var rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        rect3 = new fabric.Rect(),
        group = new fabric.Group([ rect1, rect2, rect3 ]);

    ok(typeof group.remove == 'function');
    equal(group.remove(rect2), group, 'should be chainable');
    deepEqual(group.getObjects(), [rect1, rect3], 'should remove object properly');

    group.remove(rect1, rect3);
    equal(group.isEmpty(), true, 'group should be empty');
  });

  test('size', function() {
    var group = makeGroupWith2Objects();

    ok(typeof group.size == 'function');
    equal(group.size(), 2);
    group.add(new fabric.Rect());
    equal(group.size(), 3);
    group.remove(group.getObjects()[0]);
    group.remove(group.getObjects()[0]);
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
      'type':                     'group',
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
      'objects':                  clone.objects
    };

    deepEqual(clone, expectedObject);

    ok(group !== clone, 'should produce different object');
    ok(group.getObjects() !== clone.objects, 'should produce different object array');
    ok(group.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');
  });

test('toObject without default values', function() {
  var group = makeGroupWith2Objects();
  group.includeDefaultValues = false;
  var clone = group.toObject();

  var expectedObject = {
    'type':               'group',
    'left':               50,
    'top':                100,
    'width':              80,
    'height':             60,
    'objects':            clone.objects
  };

  deepEqual(clone, expectedObject);
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

  test('moveTo', function() {
    var group = makeGroupWith4Objects(),
        groupEl1 = group.getObjects()[0],
        groupEl2 = group.getObjects()[1],
        groupEl3 = group.getObjects()[2],
        groupEl4 = group.getObjects()[3];

    ok(typeof group.item(0).moveTo == 'function');

    // [ 1, 2, 3, 4 ]
    equal(group.item(0), groupEl1);
    equal(group.item(1), groupEl2);
    equal(group.item(2), groupEl3);
    equal(group.item(3), groupEl4);
    equal(group.item(9999), undefined);

    group.item(0).moveTo(3);

    // moved 1 to level 3 — [2, 3, 4, 1]
    equal(group.item(3), groupEl1);
    equal(group.item(0), groupEl2);
    equal(group.item(1), groupEl3);
    equal(group.item(2), groupEl4);
    equal(group.item(9999), undefined);

    group.item(0).moveTo(2);

    // moved 2 to level 2 — [3, 4, 2, 1]
    equal(group.item(3), groupEl1);
    equal(group.item(2), groupEl2);
    equal(group.item(0), groupEl3);
    equal(group.item(1), groupEl4);
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
    group.set({ originX: 'center', originY: 'center' }).setCoords();

    //  Rect #1     top: 100, left: 100, width: 30, height: 10
    //  Rect #2     top: 120, left: 50, width: 10, height: 40

    ok(typeof group.containsPoint == 'function');

    ok(!group.containsPoint({ x: 0, y: 0 }));

    group.scale(2);
    ok(group.containsPoint({ x: 50, y: 120 }));
    ok(group.containsPoint({ x: 100, y: 160 }));
    ok(!group.containsPoint({ x: 0, y: 0 }));

    group.scale(1);
    group.padding = 30;
    group.setCoords();
    ok(group.containsPoint({ x: 50, y: 120 }));
    ok(!group.containsPoint({ x: 100, y: 170 }));
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

    var expectedSVG = '<g transform="translate(90 130)">\n<rect x="-15" y="-5" rx="0" ry="0" width="30" height="10" style="stroke: none; stroke-width: 0; stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform="translate(25 -25)"/>\n<rect x="-5" y="-20" rx="0" ry="0" width="10" height="40" style="stroke: none; stroke-width: 0; stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform="translate(-35 10)"/>\n</g>\n';
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

    group.getObjects()[0].lockMovementX = true;
    equal(group.get('lockMovementX'), true);

    group.getObjects()[0].lockMovementX = false;
    equal(group.get('lockMovementX'), false);

    group.set('lockMovementX', true);
    equal(group.get('lockMovementX'), true);

    group.set('lockMovementX', false);
    group.getObjects()[0].lockMovementY = true;
    group.getObjects()[1].lockRotation = true;

    equal(group.get('lockMovementY'), true);
    equal(group.get('lockRotation'), true);
  });

  test('z-index methods with group objects', function() {

    var textBg = new fabric.Rect({
      fill : '#abc',
      width : 100,
      height : 100
    });

    var text = new fabric.Text('text');
    var group = new fabric.Group([ textBg, text ]);

    canvas.add(group);

    ok(group.getObjects()[0] === textBg);
    ok(group.getObjects()[1] === text);

    textBg.bringToFront();

    ok(group.getObjects()[0] === text);
    ok(group.getObjects()[1] === textBg);

    textBg.sendToBack();

    ok(group.getObjects()[0] === textBg);
    ok(group.getObjects()[1] === text);
  });

  test('group reference on an object', function() {
    var group = makeGroupWith2Objects();
    var firstObjInGroup = group.getObjects()[0];
    var secondObjInGroup = group.getObjects()[1];

    equal(firstObjInGroup.group, group);
    equal(secondObjInGroup.group, group);

    group.remove(firstObjInGroup);
    ok(typeof firstObjInGroup.group == 'undefined');
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

  test('canvas property propagation', function() {
    var g1 = makeGroupWith4Objects(),
        g2 = makeGroupWith4Objects(),
        rect1 = new fabric.Rect(),
        rect2 = new fabric.Rect(),
        group1 = new fabric.Group([g1]);

    group1.add(g2);
    group1.insertAt(rect1, 0);
    g2.insertAt(rect2, 0);

    canvas.add(group1);
    equal(g2.canvas, canvas);
    equal(g2._objects[3].canvas, canvas);
    equal(g1.canvas, canvas);
    equal(g1._objects[3].canvas, canvas);
    equal(rect2.canvas, canvas);
    equal(rect1.canvas, canvas);
  });

  test('test group transformMatrix', function() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 10, height: 10, strokeWidth: 0 }),
        rect2 = new fabric.Rect({ top: 120, left: 120, width: 10, height: 10, strokeWidth: 0 }),
        group = new fabric.Group([ rect1, rect2 ]),
        ctx = canvas.contextContainer, isTransparent = fabric.util.isTransparent;
    canvas.add(group);
    equal(isTransparent(ctx, 80, 80, 0), true);
    equal(isTransparent(ctx, 101, 101, 0), false);
    group.transformMatrix = [1.2, 0, 0, 1.2, 1, 1];
    canvas.renderAll();
    equal(isTransparent(ctx, 101, 101, 0), true);
    equal(isTransparent(ctx, 131, 131, 0), false);
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
