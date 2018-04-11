(function() {
  var canvas = this.canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false});
  QUnit.module('fabric.ObjectGeometry');

  QUnit.test('intersectsWithRectangle', function(assert) {
    var cObj = new fabric.Object({ left: 50, top: 50, width: 100, height: 100 });
    cObj.setCoords();
    assert.ok(typeof cObj.intersectsWithRect === 'function');

    var point1 = new fabric.Point(110, 100),
        point2 = new fabric.Point(210, 200),
        point3 = new fabric.Point(0, 0),
        point4 = new fabric.Point(10, 10);

    assert.ok(cObj.intersectsWithRect(point1, point2));
    assert.ok(!cObj.intersectsWithRect(point3, point4));
  });

  QUnit.test('intersectsWithRectangle absolute', function(assert) {
    var cObj = new fabric.Rect({ left: 10, top: 10, width: 20, height: 20 });
    var absolute = true;
    canvas.add(cObj);
    canvas.viewportTransform = [2, 0, 0, 2, 0, 0];
    cObj.setCoords();
    canvas.calcViewportBoundaries();

    var point1 = new fabric.Point(5, 5),
        point2 = new fabric.Point(15, 15),
        point3 = new fabric.Point(25, 25),
        point4 = new fabric.Point(35, 35);

    assert.ok(!cObj.intersectsWithRect(point1, point2), 'Does not intersect because there is a 2x zoom');
    assert.ok(!cObj.intersectsWithRect(point3, point4), 'Does not intersect because there is a 2x zoom');
    assert.ok(cObj.intersectsWithRect(point1, point2, absolute), 'absolute coordinates intersect');
    assert.ok(cObj.intersectsWithRect(point3, point4, absolute), 'absolute coordinates intersect');
  });

  QUnit.test('intersectsWithObject', function(assert) {
    var cObj = new fabric.Object({ left: 50, top: 50, width: 100, height: 100 });
    cObj.setCoords();
    assert.ok(typeof cObj.intersectsWithObject === 'function', 'has intersectsWithObject method');

    var cObj2 = new fabric.Object({ left: -150, top: -150, width: 200, height: 200 });
    cObj2.setCoords();
    assert.ok(cObj.intersectsWithObject(cObj2), 'cobj2 does intersect with cobj');
    assert.ok(cObj2.intersectsWithObject(cObj), 'cobj2 does intersect with cobj');

    var cObj3 = new fabric.Object({ left: 392.5, top: 339.5, width: 13, height: 33 });
    cObj3.setCoords();
    assert.ok(!cObj.intersectsWithObject(cObj3), 'cobj3 does not intersect with cobj (external)');
    assert.ok(!cObj3.intersectsWithObject(cObj), 'cobj3 does not intersect with cobj (external)');

    var cObj4 = new fabric.Object({ left: 0, top: 0, width: 200, height: 200 });
    cObj4.setCoords();
    assert.ok(cObj4.intersectsWithObject(cObj), 'overlapping objects are considered intersecting');
    assert.ok(cObj.intersectsWithObject(cObj4), 'overlapping objects are considered intersecting');
  });

  QUnit.test('isContainedWithinRect', function(assert) {
    var cObj = new fabric.Object({ left: 20, top: 20, width: 10, height: 10 });
    cObj.setCoords();
    assert.ok(typeof cObj.isContainedWithinRect === 'function');

    // fully contained
    assert.ok(cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(100,100)));
    // only intersects
    assert.ok(!cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(25, 25)));
    // doesn't intersect
    assert.ok(!cObj.isContainedWithinRect(new fabric.Point(100,100), new fabric.Point(110, 110)));
  });

  QUnit.test('isContainedWithinRect absolute', function(assert) {
    var cObj = new fabric.Rect({ left: 20, top: 20, width: 10, height: 10 });
    var absolute = true;
    canvas.add(cObj);
    canvas.viewportTransform = [2, 0, 0, 2, 0, 0];
    cObj.setCoords();
    canvas.calcViewportBoundaries();
    assert.ok(typeof cObj.isContainedWithinRect === 'function');

    // fully contained
    assert.ok(cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(100,100), absolute));
    // only intersects
    assert.ok(!cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(25, 25), absolute));
    // doesn't intersect
    assert.ok(!cObj.isContainedWithinRect(new fabric.Point(100,100), new fabric.Point(110, 110), absolute));
  });

  QUnit.test('intersectsWithRect', function(assert) {
    var object = new fabric.Object({ left: 0, top: 0, width: 40, height: 50, angle: 160 }),
        point1 = new fabric.Point(-10, -10),
        point2 = new fabric.Point(20, 30),
        point3 = new fabric.Point(10, 15),
        point4 = new fabric.Point(30, 35),
        point5 = new fabric.Point(50, 60),
        point6 = new fabric.Point(70, 80);

    object.setCoords();

    // object and area intersects
    assert.equal(object.intersectsWithRect(point1, point2), true);
    // area is contained in object (no intersection)
    assert.equal(object.intersectsWithRect(point3, point4), false);
    // area is outside of object (no intersection)
    assert.equal(object.intersectsWithRect(point5, point6), false);
  });

  QUnit.test('intersectsWithObject', function(assert) {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 230, strokeWidth: 0 }),
        object1 = new fabric.Object({ left: 20, top: 30, width: 60, height: 30, angle: 10, strokeWidth: 0 }),
        object2 = new fabric.Object({ left: 25, top: 35, width: 20, height: 20, angle: 50, strokeWidth: 0 }),
        object3 = new fabric.Object({ left: 50, top: 50, width: 20, height: 20, angle: 0, strokeWidth: 0 });

    object.set({ originX: 'center', originY: 'center' }).setCoords();
    object1.set({ originX: 'center', originY: 'center' }).setCoords();
    object2.set({ originX: 'center', originY: 'center' }).setCoords();
    object3.set({ originX: 'center', originY: 'center' }).setCoords();

    assert.equal(object.intersectsWithObject(object1), true, 'object and object1 intersects');
    assert.equal(object.intersectsWithObject(object2), true, 'object2 is contained in object');
    assert.equal(object.intersectsWithObject(object3), false, 'object3 is outside of object (no intersection)');
  });

  QUnit.test('isContainedWithinObject', function(assert) {
    var object = new fabric.Object({ left: 0, top: 0, width: 40, height: 40, angle: 0 }),
        object1 = new fabric.Object({ left: 1, top: 1, width: 38, height: 38, angle: 0 }),
        object2 = new fabric.Object({ left: 20, top: 20, width: 40, height: 40, angle: 0 }),
        object3 = new fabric.Object({ left: 50, top: 50, width: 40, height: 40, angle: 0 });

    object.setCoords();
    object1.setCoords();
    object2.setCoords();
    object3.setCoords();

    assert.equal(object1.isContainedWithinObject(object), true, 'object1 is fully contained within object');
    assert.equal(object2.isContainedWithinObject(object), false, 'object2 intersects object (not fully contained)');
    assert.equal(object3.isContainedWithinObject(object), false, 'object3 is outside of object (not fully contained)');
    object1.angle = 45;
    object1.setCoords();
    assert.equal(object1.isContainedWithinObject(object), false, 'object1 rotated is not contained within object');

    var rect1 = new fabric.Rect({
      width: 50,
      height: 50,
      left: 50,
      top: 50
    });

    var rect2 = new fabric.Rect({
      width: 100,
      height: 100,
      left: 100,
      top: 0,
      angle: 45,
    });
    rect1.setCoords();
    rect2.setCoords();
    assert.equal(rect1.isContainedWithinObject(rect2), false, 'rect1 rotated is not contained within rect2');
  });

  QUnit.test('isContainedWithinRect', function(assert) {
    var object = new fabric.Object({ left: 40, top: 40, width: 40, height: 50, angle: 160 }),
        point1 = new fabric.Point(0, 0),
        point2 = new fabric.Point(80, 80),
        point3 = new fabric.Point(0, 0),
        point4 = new fabric.Point(80, 60),
        point5 = new fabric.Point(80, 80),
        point6 = new fabric.Point(90, 90);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // area is contained in object (no intersection)
    assert.equal(object.isContainedWithinRect(point1, point2), true);
    // object and area intersects
    assert.equal(object.isContainedWithinRect(point3, point4), false);
    // area is outside of object (no intersection)
    assert.equal(object.isContainedWithinRect(point5, point6), false);
  });

  QUnit.test('isContainedWithinRect', function(assert) {
    var object = new fabric.Object({ left: 40, top: 40, width: 40, height: 50, angle: 160 }),
        point1 = new fabric.Point(0, 0),
        point2 = new fabric.Point(80, 80),
        point3 = new fabric.Point(0, 0),
        point4 = new fabric.Point(80, 60),
        point5 = new fabric.Point(80, 80),
        point6 = new fabric.Point(90, 90);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // area is contained in object (no intersection)
    assert.equal(object.isContainedWithinRect(point1, point2), true);
    // object and area intersects
    assert.equal(object.isContainedWithinRect(point3, point4), false);
    // area is outside of object (no intersection)
    assert.equal(object.isContainedWithinRect(point5, point6), false);
  });

  QUnit.test('containsPoint', function(assert) {
    var object = new fabric.Object({ left: 40, top: 40, width: 40, height: 50, angle: 160, strokeWidth: 0 }),
        point1 = new fabric.Point(30, 30),
        point2 = new fabric.Point(60, 30),
        point3 = new fabric.Point(45, 65),
        point4 = new fabric.Point(15, 40),
        point5 = new fabric.Point(30, 15);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // point1 is contained in object
    assert.equal(object.containsPoint(point1), true);
    // point2 is outside of object (right)
    assert.equal(object.containsPoint(point2), false);
    // point3 is outside of object (bottom)
    assert.equal(object.containsPoint(point3), false);
    // point4 is outside of object (left)
    assert.equal(object.containsPoint(point4), false);
    // point5 is outside of object (top)
    assert.equal(object.containsPoint(point5), false);
  });

  QUnit.test('containsPoint with padding', function(assert) {
    var object = new fabric.Object({ left: 40, top: 40, width: 40, height: 50, angle: 160, padding: 5 }),
        point1 = new fabric.Point(30, 30),
        point2 = new fabric.Point(10, 20),
        point3 = new fabric.Point(65, 30),
        point4 = new fabric.Point(45, 75),
        point5 = new fabric.Point(10, 40),
        point6 = new fabric.Point(30, 5);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // point1 is contained in object
    assert.equal(object.containsPoint(point1), true);
    // point2 is contained in object (padding area)
    assert.equal(object.containsPoint(point2), true);
    // point2 is outside of object (right)
    assert.equal(object.containsPoint(point3), false);
    // point3 is outside of object (bottom)
    assert.equal(object.containsPoint(point4), false);
    // point4 is outside of object (left)
    assert.equal(object.containsPoint(point5), false);
    // point5 is outside of object (top)
    assert.equal(object.containsPoint(point6), false);
  });

  QUnit.test('setCoords', function(assert) {
    var cObj = new fabric.Object({ left: 150, top: 150, width: 100, height: 100, strokeWidth: 0});
    assert.ok(typeof cObj.setCoords === 'function');
    assert.equal(cObj.setCoords(), cObj, 'chainable');

    assert.equal(cObj.oCoords.tl.x, 150);
    assert.equal(cObj.oCoords.tl.y, 150);
    assert.equal(cObj.oCoords.tr.x, 250);
    assert.equal(cObj.oCoords.tr.y, 150);
    assert.equal(cObj.oCoords.bl.x, 150);
    assert.equal(cObj.oCoords.bl.y, 250);
    assert.equal(cObj.oCoords.br.x, 250);
    assert.equal(cObj.oCoords.br.y, 250);
    assert.equal(cObj.oCoords.mtr.x, 200);
    assert.equal(cObj.oCoords.mtr.y, 110);

    cObj.set('left', 250).set('top', 250);

    // coords should still correspond to initial one, even after invoking `set`
    assert.equal(cObj.oCoords.tl.x, 150);
    assert.equal(cObj.oCoords.tl.y, 150);
    assert.equal(cObj.oCoords.tr.x, 250);
    assert.equal(cObj.oCoords.tr.y, 150);
    assert.equal(cObj.oCoords.bl.x, 150);
    assert.equal(cObj.oCoords.bl.y, 250);
    assert.equal(cObj.oCoords.br.x, 250);
    assert.equal(cObj.oCoords.br.y, 250);
    assert.equal(cObj.oCoords.mtr.x, 200);
    assert.equal(cObj.oCoords.mtr.y, 110);

    // recalculate coords
    cObj.setCoords();

    // check that coords are now updated
    assert.equal(cObj.oCoords.tl.x, 250);
    assert.equal(cObj.oCoords.tl.y, 250);
    assert.equal(cObj.oCoords.tr.x, 350);
    assert.equal(cObj.oCoords.tr.y, 250);
    assert.equal(cObj.oCoords.bl.x, 250);
    assert.equal(cObj.oCoords.bl.y, 350);
    assert.equal(cObj.oCoords.br.x, 350);
    assert.equal(cObj.oCoords.br.y, 350);
    assert.equal(cObj.oCoords.mtr.x, 300);
    assert.equal(cObj.oCoords.mtr.y, 210);
  });

  QUnit.test('setCoords and aCoords', function(assert) {
    var cObj = new fabric.Object({ left: 150, top: 150, width: 100, height: 100, strokeWidth: 0});
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 0, 0]
    };
    cObj.setCoords();

    assert.equal(cObj.oCoords.tl.x, 300, 'oCoords are modified by viewportTransform');
    assert.equal(cObj.oCoords.tl.y, 300, 'oCoords are modified by viewportTransform');
    assert.equal(cObj.oCoords.tr.x, 500, 'oCoords are modified by viewportTransform');
    assert.equal(cObj.oCoords.tr.y, 300, 'oCoords are modified by viewportTransform');
    assert.equal(cObj.oCoords.bl.x, 300, 'oCoords are modified by viewportTransform');
    assert.equal(cObj.oCoords.bl.y, 500, 'oCoords are modified by viewportTransform');
    assert.equal(cObj.oCoords.br.x, 500, 'oCoords are modified by viewportTransform');
    assert.equal(cObj.oCoords.br.y, 500, 'oCoords are modified by viewportTransform');
    assert.equal(cObj.oCoords.mtr.x, 400, 'oCoords are modified by viewportTransform');
    assert.equal(cObj.oCoords.mtr.y, 260, 'oCoords are modified by viewportTransform');

    assert.equal(cObj.aCoords.tl.x, 150, 'aCoords do not interfere with viewportTransform');
    assert.equal(cObj.aCoords.tl.y, 150, 'aCoords do not interfere with viewportTransform');
    assert.equal(cObj.aCoords.tr.x, 250, 'aCoords do not interfere with viewportTransform');
    assert.equal(cObj.aCoords.tr.y, 150, 'aCoords do not interfere with viewportTransform');
    assert.equal(cObj.aCoords.bl.x, 150, 'aCoords do not interfere with viewportTransform');
    assert.equal(cObj.aCoords.bl.y, 250, 'aCoords do not interfere with viewportTransform');
    assert.equal(cObj.aCoords.br.x, 250, 'aCoords do not interfere with viewportTransform');
    assert.equal(cObj.aCoords.br.y, 250, 'aCoords do not interfere with viewportTransform');
  });

  QUnit.test('isOnScreen', function(assert) {
    var cObj = new fabric.Object({ left: 50, top: 50, width: 100, height: 100, strokeWidth: 0});
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    cObj.canvas = canvas;
    cObj.setCoords();
    assert.ok(cObj.isOnScreen(), 'object is onScreen');
    cObj.top = 1000;
    assert.ok(cObj.isOnScreen(), 'object is still wrongly on screen since setCoords is not called and calculate is not set, even when top is already at 1000');
    assert.ok(!cObj.isOnScreen(true), 'object is not onScreen with top 1000 with calculate true and no setCoords call');
    cObj.setCoords();
    assert.ok(!cObj.isOnScreen(), 'object is not onScreen with top 1000');
    canvas.setZoom(0.1);
    cObj.setCoords();
    assert.ok(cObj.isOnScreen(), 'zooming out the object is again on screen');
  });

  QUnit.test('transformMatrixKey depends from properties', function(assert) {
    var cObj = new fabric.Object(
      { left: -10, top: -10, width: 30, height: 40, strokeWidth: 0});
    var key1 = cObj.transformMatrixKey();
    cObj.left = 5;
    var key2 = cObj.transformMatrixKey();
    cObj.left = -10;
    var key3 = cObj.transformMatrixKey();
    cObj.width = 5;
    var key4 = cObj.transformMatrixKey();
    assert.notEqual(key1, key2, 'keys are different');
    assert.equal(key1, key3, 'keys are equal');
    assert.notEqual(key4, key2, 'keys are different');
    assert.notEqual(key4, key1, 'keys are different');
    assert.notEqual(key4, key3, 'keys are different');
  });

  QUnit.test('transformMatrixKey depends from originX/originY', function(assert) {
    var cObj = new fabric.Object(
      { left: -10, top: -10, width: 30, height: 40, strokeWidth: 0, originX: 'left', originY: 'top' });
    var key1 = cObj.transformMatrixKey();
    cObj.originX = 'center';
    var key2 = cObj.transformMatrixKey();
    cObj.originY = 'center';
    var key3 = cObj.transformMatrixKey();
    assert.notEqual(key1, key2, 'keys are different origins 1');
    assert.notEqual(key1, key3, 'keys are different origins 2');
    assert.notEqual(key2, key3, 'keys are different origins 3');
  });

  QUnit.test('isOnScreen with object that include canvas', function(assert) {
    var cObj = new fabric.Object(
      { left: -10, top: -10, width: canvas.getWidth() + 100, height: canvas.getHeight(), strokeWidth: 0});
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    cObj.canvas = canvas;
    cObj.setCoords();
    assert.equal(cObj.isOnScreen(), true, 'object is onScreen because it include the canvas');
    cObj.top = -1000;
    cObj.left = -1000;
    cObj.setCoords();
    assert.equal(cObj.isOnScreen(), false, 'object is completely out of viewport');
  });

  QUnit.test('isOnScreen with object that is in top left corner of canvas', function(assert) {
    var cObj = new fabric.Rect({left: -46.56, top: -9.23, width: 50,height: 50, angle: 314.57});
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    cObj.canvas = canvas;
    cObj.setCoords();
    assert.ok(cObj.isOnScreen(), 'object is onScreen because it intersect a canvas line');
    cObj.top -= 20;
    cObj.left -= 20;
    cObj.setCoords();
    assert.ok(!cObj.isOnScreen(), 'object is completely out of viewport');
  });

  QUnit.test('calcTransformMatrix with no group', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    assert.ok(typeof cObj.calcTransformMatrix === 'function', 'calcTransformMatrix should exist');
    cObj.top = 0;
    cObj.left = 0;
    cObj.scaleX = 2;
    cObj.scaleY = 3;
    assert.deepEqual(cObj.calcTransformMatrix(), cObj.calcOwnMatrix(), 'without group matrix is same');
  });

  QUnit.test('calcOwnMatrix', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    assert.ok(typeof cObj.calcOwnMatrix === 'function', 'calcTransformMatrix should exist');
    cObj.top = 0;
    cObj.left = 0;
    assert.deepEqual(cObj.calcOwnMatrix(), [1, 0, 0, 1, 5, 7.5], 'only translate matrix');
    cObj.scaleX = 2;
    cObj.scaleY = 3;
    assert.deepEqual(cObj.calcOwnMatrix(), [2, 0, 0, 3, 10, 22.5], 'only translate matrix and scale');
    cObj.skewX = 45;
    assert.deepEqual(cObj.calcOwnMatrix(), [2, 0, 1.9999999999999998, 3, 25, 22.5], 'translate matrix scale skewX');
    cObj.skewY = 30;
    assert.deepEqual(cObj.calcOwnMatrix(), [3.1547005383792515, 1.7320508075688772, 1.9999999999999998, 3, 30.773502691896255, 31.160254037844386], 'translate matrix scale skewX skewY');
    cObj.angle = 38;
    assert.deepEqual(cObj.calcOwnMatrix(), [1.4195809931249126,
      3.3071022498267006,
      -0.2709629187635314,
      3.595355211471482,
      5.065683074898075,
      43.50067533516962], 'translate matrix scale skewX skewY angle');
    cObj.flipX = true;
    assert.deepEqual(cObj.calcOwnMatrix(), [-3.552294904178618,
      -0.5773529255117364,
      -3.4230059331904186,
      1.1327093101688495,
      5.065683074898075,
      43.50067533516962], 'translate matrix scale skewX skewY angle flipX');
    cObj.flipY = true;
    assert.deepEqual(cObj.calcOwnMatrix(), [-1.4195809931249126,
      -3.3071022498267006,
      0.2709629187635314,
      -3.595355211471482,
      5.065683074898075,
      43.50067533516962], 'translate matrix scale skewX skewY angle flipX flipY');
  });

  QUnit.test('_calcDimensionsTransformMatrix', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    assert.ok(typeof cObj._calcDimensionsTransformMatrix === 'function', '_calcDimensionsTransformMatrix should exist');
  });

  QUnit.test('_calcRotateMatrix', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    assert.ok(typeof cObj._calcRotateMatrix === 'function', '_calcRotateMatrix should exist');
  });

  QUnit.test('scaleToWidth', function(assert) {
    var cObj = new fabric.Object({ width: 560, strokeWidth: 0 });
    assert.ok(typeof cObj.scaleToWidth === 'function',  'scaleToWidth should exist');
    assert.equal(cObj.scaleToWidth(100), cObj, 'chainable');
    assert.equal(cObj.getScaledWidth(), 100);
    assert.equal(cObj.get('scaleX'), 100 / 560);
  });

  QUnit.test('scaleToWidth with zoom', function(assert) {
    var cObj = new fabric.Object({ width: 560, strokeWidth: 0 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 0, 0]
    };
    assert.equal(cObj.scaleToWidth(100, true), cObj, 'chainable');
    assert.equal(cObj.getScaledWidth(), 100, 'is not influenced by zoom - width');
    assert.equal(cObj.get('scaleX'), 100 / 560);
    assert.equal(cObj.scaleToWidth(100), cObj, 'chainable');
    assert.equal(cObj.getScaledWidth(), 50, 'is influenced by zoom - width');
    assert.equal(cObj.get('scaleX'), 100 / 560 / 2);
  });


  QUnit.test('scaleToHeight', function(assert) {
    var cObj = new fabric.Object({ height: 560, strokeWidth: 0 });
    assert.ok(typeof cObj.scaleToHeight === 'function', 'scaleToHeight should exist');
    assert.equal(cObj.scaleToHeight(100), cObj, 'chainable');
    assert.equal(cObj.getScaledHeight(), 100);
    assert.equal(cObj.get('scaleY'), 100 / 560);
  });

  QUnit.test('scaleToHeight with zoom', function(assert) {
    var cObj = new fabric.Object({ height: 560, strokeWidth: 0 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 0, 0]
    };
    assert.equal(cObj.scaleToHeight(100, true), cObj, 'chainable');
    assert.equal(cObj.getScaledHeight(), 100, 'is not influenced by zoom - height');
    assert.equal(cObj.get('scaleY'), 100 / 560);
    assert.equal(cObj.scaleToHeight(100), cObj, 'chainable');
    assert.equal(cObj.getScaledHeight(), 50, 'is influenced by zoom - height');
    assert.equal(cObj.get('scaleY'), 100 / 560 / 2);
  });

  QUnit.test('scaleToWidth on rotated object', function(assert) {
    var obj = new fabric.Object({ height: 100, width: 100, strokeWidth: 0 });
    obj.rotate(45);
    obj.scaleToWidth(200);
    assert.equal(Math.round(obj.getBoundingRect().width), 200);
  });

  QUnit.test('scaleToHeight on rotated object', function(assert) {
    var obj = new fabric.Object({ height: 100, width: 100, strokeWidth: 0 });
    obj.rotate(45);
    obj.scaleToHeight(300);
    assert.equal(Math.round(obj.getBoundingRect().height), 300);
  });

  QUnit.test('getBoundingRect with absolute coords', function(assert) {
    var cObj = new fabric.Object({ strokeWidth: 0, width: 10, height: 10, top: 6, left: 5 }),
        boundingRect;

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 5, 'gives the bounding rect left with zoom 1');
    assert.equal(boundingRect.width, 10, 'gives the bounding rect width with zoom 1');
    assert.equal(boundingRect.height, 10, 'gives the bounding rect height with zoom 1');
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 0, 0]
    };
    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 10, 'gives the bounding rect left with zoom 2');
    assert.equal(boundingRect.width, 20, 'gives the bounding rect width with zoom 2');
    assert.equal(boundingRect.height, 20, 'gives the bounding rect height with zoom 2');
    boundingRect = cObj.getBoundingRect(true);
    assert.equal(boundingRect.left, 5, 'gives the bounding rect left with absolute coords');
    assert.equal(boundingRect.width, 10, 'gives the bounding rect width with absolute coords');
    assert.equal(boundingRect.height, 10, 'gives the bounding rect height with absolute coords');
  });

  QUnit.test('getBoundingRect', function(assert) {
    var cObj = new fabric.Object({ strokeWidth: 0 }),
        boundingRect;
    assert.ok(typeof cObj.getBoundingRect === 'function');

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 0);
    assert.equal(boundingRect.top, 0);
    assert.equal(boundingRect.width, 0);
    assert.equal(boundingRect.height, 0);
    cObj.set('width', 123).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 0);
    assert.equal(boundingRect.top, 0);
    assert.equal(boundingRect.width, 123);
    assert.equal(boundingRect.height, 0);

    cObj.set('height', 167).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 0);
    assert.equal(Math.abs(boundingRect.top).toFixed(13), 0);
    assert.equal(boundingRect.width, 123);
    assert.equal(boundingRect.height, 167);

    cObj.scale(2).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left, 0);
    assert.equal(Math.abs(boundingRect.top).toFixed(13), 0);
    assert.equal(boundingRect.width, 246);
    assert.equal(boundingRect.height, 334);
  });

  QUnit.test('getBoundingRectWithStroke', function(assert) {
    var cObj = new fabric.Object(),
        boundingRect;
    assert.ok(typeof cObj.getBoundingRect === 'function');

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left.toFixed(2), 0);
    assert.equal(boundingRect.top.toFixed(2), 0);
    assert.equal(boundingRect.width.toFixed(2), 1);
    assert.equal(boundingRect.height.toFixed(2), 1);

    cObj.set('width', 123).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left.toFixed(2), 0);
    assert.equal(boundingRect.top.toFixed(2), 0);
    assert.equal(boundingRect.width.toFixed(2), 124);
    assert.equal(boundingRect.height.toFixed(2), 1);

    cObj.set('height', 167).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left.toFixed(2), 0);
    assert.equal(boundingRect.top.toFixed(2), 0);
    assert.equal(boundingRect.width.toFixed(2), 124);
    assert.equal(boundingRect.height.toFixed(2), 168);

    cObj.scale(2).setCoords();
    boundingRect = cObj.getBoundingRect();
    assert.equal(boundingRect.left.toFixed(2), 0);
    assert.equal(boundingRect.top.toFixed(2), 0);
    assert.equal(boundingRect.width.toFixed(2), 248);
    assert.equal(boundingRect.height.toFixed(2), 336);
  });

  QUnit.test('getScaledWidth', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.getScaledWidth === 'function');
    assert.equal(cObj.getScaledWidth(), 0 + cObj.strokeWidth);
    cObj.set('width', 123);
    assert.equal(cObj.getScaledWidth(), 123 + cObj.strokeWidth);
    cObj.set('scaleX', 2);
    assert.equal(cObj.getScaledWidth(), 246 + cObj.strokeWidth * 2);
  });

  QUnit.test('getScaledHeight', function(assert) {
    var cObj = new fabric.Object({strokeWidth: 0});
    //  assert.ok(typeof cObj.getHeight === 'function');
    assert.equal(cObj.getScaledHeight(), 0);
    cObj.set('height', 123);
    assert.equal(cObj.getScaledHeight(), 123);
    cObj.set('scaleY', 2);
    assert.equal(cObj.getScaledHeight(), 246);
  });

  QUnit.test('scale', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    assert.ok(typeof cObj.scale === 'function', 'scale should exist');
  });

  QUnit.test('_constrainScale', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    assert.ok(typeof cObj._constrainScale === 'function', '_constrainScale should exist');
    cObj.set('scaleX', 0);
    assert.equal(cObj.scaleX, 0.0001);
    cObj.set('scaleY', 0);
    assert.equal(cObj.scaleY, 0.0001);
    cObj.minScaleLimit = 3;
    cObj.set('scaleY', 0);
    assert.equal(cObj.scaleY, 3);
  });

  QUnit.test('getCoords return coordinate of object in canvas coordinate.', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40 });
    var coords = cObj.getCoords();
    assert.deepEqual(coords[0], new fabric.Point(40, 30), 'return top left corner');
    assert.deepEqual(coords[1], new fabric.Point(52, 30), 'return top right corner');
    assert.deepEqual(coords[2], new fabric.Point(52, 47), 'return bottom right corner');
    assert.deepEqual(coords[3], new fabric.Point(40, 47), 'return bottom left corner');

    cObj.left += 5;
    coords = cObj.getCoords();
    assert.deepEqual(coords[0], new fabric.Point(40, 30), 'return top left corner cached oCoords');
    assert.deepEqual(coords[1], new fabric.Point(52, 30), 'return top right corner cached oCoords');
    assert.deepEqual(coords[2], new fabric.Point(52, 47), 'return bottom right corner cached oCoords');
    assert.deepEqual(coords[3], new fabric.Point(40, 47), 'return bottom left corner cached oCoords');

    coords = cObj.getCoords(false, true);
    assert.deepEqual(coords[0], new fabric.Point(45, 30), 'return top left corner recalculated');
    assert.deepEqual(coords[1], new fabric.Point(57, 30), 'return top right corner recalculated');
    assert.deepEqual(coords[2], new fabric.Point(57, 47), 'return bottom right corner recalculated');
    assert.deepEqual(coords[3], new fabric.Point(45, 47), 'return bottom left corner recalculated');
  });

  QUnit.test('getCoords return coordinate of object in zoomed canvas coordinate.', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 35]
    };
    var coords = cObj.getCoords();
    assert.deepEqual(coords[0], new fabric.Point(115, 95), 'return top left corner is influenced by canvas zoom');
    assert.deepEqual(coords[1], new fabric.Point(139, 95), 'return top right corner is influenced by canvas zoom');
    assert.deepEqual(coords[2], new fabric.Point(139, 129), 'return bottom right corner is influenced by canvas zoom');
    assert.deepEqual(coords[3], new fabric.Point(115, 129), 'return bottom left corner is influenced by canvas zoom');
  });

  QUnit.test('getCoords return coordinate of object in absolute coordinates and ignore canvas zoom', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 35]
    };
    var coords = cObj.getCoords(true);
    assert.deepEqual(coords[0], new fabric.Point(40, 30), 'return top left corner cached oCoords');
    assert.deepEqual(coords[1], new fabric.Point(52, 30), 'return top right corner cached oCoords');
    assert.deepEqual(coords[2], new fabric.Point(52, 47), 'return bottom right corner cached oCoords');
    assert.deepEqual(coords[3], new fabric.Point(40, 47), 'return bottom left corner cached oCoords');
  });

  QUnit.test('getCoords absolute with angle', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40, angle: 20 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25]
    };
    var coords = cObj.getCoords(true);
    assert.deepEqual(coords[0].x, 40, 'return top left absolute with angle X');
    assert.deepEqual(coords[1].x, 51.2763114494309, 'return top right absolute with angle X');
    assert.deepEqual(coords[2].x, 45.46196901289453, 'return bottom right absolute with angle X');
    assert.deepEqual(coords[3].x, 34.18565756346363, 'return bottom left absolute with angle X');
    assert.deepEqual(coords[0].y, 30, 'return top left absolute with angle Y');
    assert.deepEqual(coords[1].y, 34.104241719908025, 'return top right absolute with angle Y');
    assert.deepEqual(coords[2].y, 50.079016273268465, 'return bottom right absolute with angle Y');
    assert.deepEqual(coords[3].y, 45.97477455336044, 'return bottom left absolute with angle Y');
  });

  QUnit.test('getCoords with angle', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40, angle: 20 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25]
    };
    var coords = cObj.getCoords();
    assert.deepEqual(coords[0].x, 115, 'return top left with angle X');
    assert.deepEqual(coords[1].x, 137.55262289886178, 'return top right with angle X');
    assert.deepEqual(coords[2].x, 125.92393802578906, 'return bottom right with angle X');
    assert.deepEqual(coords[3].x, 103.37131512692726, 'return bottom left with angle X');
    assert.deepEqual(coords[0].y, 85, 'return top left with angle Y');
    assert.deepEqual(coords[1].y, 93.20848343981605, 'return top right with angle Y');
    assert.deepEqual(coords[2].y, 125.15803254653693, 'return bottom right with angle Y');
    assert.deepEqual(coords[3].y, 116.94954910672088, 'return bottom left with angle Y');
  });

  QUnit.test('getCoords absolute with skewX', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40, skewX: 45 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25]
    };
    var coords = cObj.getCoords(true);
    assert.deepEqual(coords[0].x, 40, 'return top left absolute with skewX X');
    assert.deepEqual(coords[1].x, 69, 'return top right absolute with skewX X');
    assert.deepEqual(coords[2].x, 69, 'return bottom absolute right with skewX X');
    assert.deepEqual(coords[3].x, 40, 'return bottom absolute left with skewX X');
    assert.deepEqual(coords[0].y, 30, 'return top left absolute with skewX Y');
    assert.deepEqual(coords[1].y, 30, 'return top right absolute with skewX Y');
    assert.deepEqual(coords[2].y, 47, 'return bottom absolute right with skewX Y');
    assert.deepEqual(coords[3].y, 47, 'return bottom absolute left with skewX Y');
  });

  QUnit.test('getCoords with skewX', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40, skewX: 45 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25]
    };
    var coords = cObj.getCoords();
    assert.deepEqual(coords[0].x, 115, 'return top left with skewX X');
    assert.deepEqual(coords[1].x, 173, 'return top right with skewX X');
    assert.deepEqual(coords[2].x, 173, 'return bottom right with skewX X');
    assert.deepEqual(coords[3].x, 115, 'return bottom left with skewX X');
    assert.deepEqual(coords[0].y, 85, 'return top left with skewX Y');
    assert.deepEqual(coords[1].y, 85, 'return top right with skewX Y');
    assert.deepEqual(coords[2].y, 119, 'return bottom right with skewX Y');
    assert.deepEqual(coords[3].y, 119, 'return bottom left with skewX Y');
  });

  QUnit.test('getCoords absolute with skewY', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40, skewY: 45 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25]
    };
    var coords = cObj.getCoords(true);
    assert.deepEqual(coords[0].x, 40, 'return top left absolute with skewY X');
    assert.deepEqual(coords[1].x, 52, 'return top right absolute with skewY X');
    assert.deepEqual(coords[2].x, 52, 'return bottom absolute right with skewY X');
    assert.deepEqual(coords[3].x, 40, 'return bottom absolute left with skewY X');
    assert.deepEqual(coords[0].y, 30, 'return top left absolute with skewY Y');
    assert.deepEqual(coords[1].y, 30, 'return top right absolute with skewY Y');
    assert.deepEqual(coords[2].y, 59, 'return bottom absolute right with skewY Y');
    assert.deepEqual(coords[3].y, 59, 'return bottom absolute left with skewY Y');
  });

  QUnit.test('getCoords with skewY', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40, skewY: 45 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25]
    };
    var coords = cObj.getCoords();
    assert.deepEqual(coords[0].x, 115, 'return top left with skewY X');
    assert.deepEqual(coords[1].x, 139, 'return top right with skewY X');
    assert.deepEqual(coords[2].x, 139, 'return bottom right with skewY X');
    assert.deepEqual(coords[3].x, 115, 'return bottom left with skewY X');
    assert.deepEqual(coords[0].y, 85, 'return top left with skewY Y');
    assert.deepEqual(coords[1].y, 85, 'return top right with skewY Y');
    assert.deepEqual(coords[2].y, 143, 'return bottom right with skewY Y');
    assert.deepEqual(coords[3].y, 143, 'return bottom left with skewY Y');
  });

  QUnit.test('getCoords absolute with skewY skewX angle', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40, skewY: 45, skewX: 30, angle: 90 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25]
    };
    var coords = cObj.getCoords(true);
    assert.deepEqual(coords[0].x, 40, 'return top left absolute with skewY skewX angle X');
    assert.deepEqual(coords[1].x, 40, 'return top right absolute with skewY skewX angle X');
    assert.deepEqual(coords[2].x, 11, 'return bottom absolute right with skewY skewX angle X');
    assert.deepEqual(coords[3].x, 11, 'return bottom absolute left with skewY skewX angle X');
    assert.deepEqual(coords[0].y, 30, 'return top left absolute with skewY skewX angle Y');
    assert.deepEqual(coords[1].y, 58.74315780649914, 'return top right absolute with skewY skewX angle Y');
    assert.deepEqual(coords[2].y, 58.74315780649914, 'return bottom absolute right with skewY skewX angle Y');
    assert.deepEqual(coords[3].y, 30, 'return bottom absolute left with skewY skewX angle Y');
  });

  QUnit.test('getCoords with skewY skewX angle', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40, skewY: 45, skewX: 30, angle: 90 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25]
    };
    var coords = cObj.getCoords();
    assert.deepEqual(coords[0].x, 115, 'return top left with skewY skewX angle X');
    assert.deepEqual(coords[1].x, 115, 'return top right with skewY skewX angle X');
    assert.deepEqual(coords[2].x, 57, 'return bottom right with skewY skewX angle X');
    assert.deepEqual(coords[3].x, 57, 'return bottom left with skewY skewX angle X');
    assert.deepEqual(coords[0].y, 85, 'return top left with skewY skewX angle Y');
    assert.deepEqual(coords[1].y, 142.48631561299828, 'return top right with skewY skewX angle Y');
    assert.deepEqual(coords[2].y, 142.48631561299828, 'return bottom right with skewY skewX angle Y');
    assert.deepEqual(coords[3].y, 85, 'return bottom left with skewY skewX angle Y');
  });

  QUnit.test('isPartiallyOnScreen', function(assert) {
    var cObj = new fabric.Object({ left: 50, top: 50, width: 100, height: 100, strokeWidth: 0});
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    cObj.canvas = canvas;
    cObj.left = -60;
    cObj.top = -60;
    cObj.setCoords();
    assert.equal(cObj.isPartiallyOnScreen(true), true,'object is partially onScreen');
    cObj.left = -110;
    cObj.top = -110;
    cObj.setCoords();
    assert.equal(cObj.isPartiallyOnScreen(true), false,'object is completely offScreen and not partial');
    cObj.left = 50;
    cObj.top = 50;
    cObj.setCoords();
    assert.equal(cObj.isPartiallyOnScreen(true), false, 'object is completely on screen and not partial');
    canvas.setZoom(2);
    assert.equal(cObj.isPartiallyOnScreen(true), true, 'after zooming object is partially onScreen and offScreen');
  });

})();
