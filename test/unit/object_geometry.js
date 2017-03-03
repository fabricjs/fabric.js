(function() {
  var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode() : new fabric.StaticCanvas();
  QUnit.module('fabric.ObjectGeometry');

  test('intersectsWithRectangle', function() {
    var cObj = new fabric.Object({ left: 50, top: 50, width: 100, height: 100 });
    cObj.setCoords();
    ok(typeof cObj.intersectsWithRect == 'function');

    var point1 = new fabric.Point(110, 100),
        point2 = new fabric.Point(210, 200),
        point3 = new fabric.Point(0, 0),
        point4 = new fabric.Point(10, 10);

    ok(cObj.intersectsWithRect(point1, point2));
    ok(!cObj.intersectsWithRect(point3, point4));
  });

  test('intersectsWithRectangle absolute', function() {
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

    ok(!cObj.intersectsWithRect(point1, point2), 'Does not intersect because there is a 2x zoom');
    ok(!cObj.intersectsWithRect(point3, point4), 'Does not intersect because there is a 2x zoom');
    ok(cObj.intersectsWithRect(point1, point2, absolute), 'absolute coordinates intersect');
    ok(cObj.intersectsWithRect(point3, point4, absolute), 'absolute coordinates intersect');
  });

  test('intersectsWithObject', function() {
    var cObj = new fabric.Object({ left: 50, top: 50, width: 100, height: 100 });
    cObj.setCoords();
    ok(typeof cObj.intersectsWithObject == 'function', 'has intersectsWithObject method');

    var cObj2 = new fabric.Object({ left: -150, top: -150, width: 200, height: 200 });
    cObj2.setCoords();
    ok(cObj.intersectsWithObject(cObj2), 'cobj2 does intersect with cobj');
    ok(cObj2.intersectsWithObject(cObj), 'cobj2 does intersect with cobj');

    var cObj3 = new fabric.Object({ left: 392.5, top: 339.5, width: 13, height: 33 });
    cObj3.setCoords();
    ok(!cObj.intersectsWithObject(cObj3), 'cobj3 does not intersect with cobj (external)');
    ok(!cObj3.intersectsWithObject(cObj), 'cobj3 does not intersect with cobj (external)');

    var cObj4 = new fabric.Object({ left: 0, top: 0, width: 200, height: 200 });
    cObj4.setCoords();
    ok(cObj4.intersectsWithObject(cObj), 'overlapping objects are considered intersecting');
    ok(cObj.intersectsWithObject(cObj4), 'overlapping objects are considered intersecting');
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

  test('isContainedWithinRect absolute', function() {
    var cObj = new fabric.Rect({ left: 20, top: 20, width: 10, height: 10 });
    var absolute = true;
    canvas.add(cObj);
    canvas.viewportTransform = [2, 0, 0, 2, 0, 0];
    cObj.setCoords();
    canvas.calcViewportBoundaries();
    ok(typeof cObj.isContainedWithinRect == 'function');

    // fully contained
    ok(cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(100,100), absolute));
    // only intersects
    ok(!cObj.isContainedWithinRect(new fabric.Point(10,10), new fabric.Point(25, 25), absolute));
    // doesn't intersect
    ok(!cObj.isContainedWithinRect(new fabric.Point(100,100), new fabric.Point(110, 110), absolute));
  });

  test('intersectsWithRect', function() {
    var object = new fabric.Object({ left: 0, top: 0, width: 40, height: 50, angle: 160 }),
        point1 = new fabric.Point(-10, -10),
        point2 = new fabric.Point(20, 30),
        point3 = new fabric.Point(10, 15),
        point4 = new fabric.Point(30, 35),
        point5 = new fabric.Point(50, 60),
        point6 = new fabric.Point(70, 80);

    object.setCoords();

    // object and area intersects
    equal(object.intersectsWithRect(point1, point2), true);
    // area is contained in object (no intersection)
    equal(object.intersectsWithRect(point3, point4), false);
    // area is outside of object (no intersection)
    equal(object.intersectsWithRect(point5, point6), false);
  });

  test('intersectsWithObject', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 230, strokeWidth: 0 }),
        object1 = new fabric.Object({ left: 20, top: 30, width: 60, height: 30, angle: 10, strokeWidth: 0 }),
        object2 = new fabric.Object({ left: 25, top: 35, width: 20, height: 20, angle: 50, strokeWidth: 0 }),
        object3 = new fabric.Object({ left: 50, top: 50, width: 20, height: 20, angle: 0, strokeWidth: 0 });

    object.set({ originX: 'center', originY: 'center' }).setCoords();
    object1.set({ originX: 'center', originY: 'center' }).setCoords();
    object2.set({ originX: 'center', originY: 'center' }).setCoords();
    object3.set({ originX: 'center', originY: 'center' }).setCoords();

    equal(object.intersectsWithObject(object1), true, 'object and object1 intersects');
    equal(object.intersectsWithObject(object2), true, 'object2 is contained in object');
    equal(object.intersectsWithObject(object3), false, 'object3 is outside of object (no intersection)');
  });

  test('isContainedWithinObject', function() {
    var object = new fabric.Object({ left: 0, top: 0, width: 40, height: 40, angle: 0 }),
        object1 = new fabric.Object({ left: 1, top: 1, width: 38, height: 38, angle: 0 }),
        object2 = new fabric.Object({ left: 20, top: 20, width: 40, height: 40, angle: 0 }),
        object3 = new fabric.Object({ left: 50, top: 50, width: 40, height: 40, angle: 0 });

    object.setCoords();
    object1.setCoords();
    object2.setCoords();
    object3.setCoords();

    equal(object1.isContainedWithinObject(object), true, 'object1 is fully contained within object');
    equal(object2.isContainedWithinObject(object), false, 'object2 intersects object (not fully contained)');
    equal(object3.isContainedWithinObject(object), false, 'object3 is outside of object (not fully contained)');
    object1.angle = 45;
    object1.setCoords();
    equal(object1.isContainedWithinObject(object), false, 'object1 rotated is not contained within object');

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
    equal(rect1.isContainedWithinObject(rect2), false, 'rect1 rotated is not contained within rect2');
  });

  test('isContainedWithinRect', function() {
    var object = new fabric.Object({ left: 40, top: 40, width: 40, height: 50, angle: 160 }),
        point1 = new fabric.Point(0, 0),
        point2 = new fabric.Point(80, 80),
        point3 = new fabric.Point(0, 0),
        point4 = new fabric.Point(80, 60),
        point5 = new fabric.Point(80, 80),
        point6 = new fabric.Point(90, 90);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // area is contained in object (no intersection)
    equal(object.isContainedWithinRect(point1, point2), true);
    // object and area intersects
    equal(object.isContainedWithinRect(point3, point4), false);
    // area is outside of object (no intersection)
    equal(object.isContainedWithinRect(point5, point6), false);
  });

  test('isContainedWithinRect', function() {
    var object = new fabric.Object({ left: 40, top: 40, width: 40, height: 50, angle: 160 }),
        point1 = new fabric.Point(0, 0),
        point2 = new fabric.Point(80, 80),
        point3 = new fabric.Point(0, 0),
        point4 = new fabric.Point(80, 60),
        point5 = new fabric.Point(80, 80),
        point6 = new fabric.Point(90, 90);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // area is contained in object (no intersection)
    equal(object.isContainedWithinRect(point1, point2), true);
    // object and area intersects
    equal(object.isContainedWithinRect(point3, point4), false);
    // area is outside of object (no intersection)
    equal(object.isContainedWithinRect(point5, point6), false);
  });

  test('containsPoint', function() {
    var object = new fabric.Object({ left: 40, top: 40, width: 40, height: 50, angle: 160, strokeWidth: 0 }),
        point1 = new fabric.Point(30, 30),
        point2 = new fabric.Point(60, 30),
        point3 = new fabric.Point(45, 65),
        point4 = new fabric.Point(15, 40),
        point5 = new fabric.Point(30, 15);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // point1 is contained in object
    equal(object.containsPoint(point1), true);
    // point2 is outside of object (right)
    equal(object.containsPoint(point2), false);
    // point3 is outside of object (bottom)
    equal(object.containsPoint(point3), false);
    // point4 is outside of object (left)
    equal(object.containsPoint(point4), false);
    // point5 is outside of object (top)
    equal(object.containsPoint(point5), false);
  });

  test('containsPoint with padding', function() {
    var object = new fabric.Object({ left: 40, top: 40, width: 40, height: 50, angle: 160, padding: 5 }),
        point1 = new fabric.Point(30, 30),
        point2 = new fabric.Point(10, 20),
        point3 = new fabric.Point(65, 30),
        point4 = new fabric.Point(45, 75),
        point5 = new fabric.Point(10, 40),
        point6 = new fabric.Point(30, 5);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // point1 is contained in object
    equal(object.containsPoint(point1), true);
    // point2 is contained in object (padding area)
    equal(object.containsPoint(point2), true);
    // point2 is outside of object (right)
    equal(object.containsPoint(point3), false);
    // point3 is outside of object (bottom)
    equal(object.containsPoint(point4), false);
    // point4 is outside of object (left)
    equal(object.containsPoint(point5), false);
    // point5 is outside of object (top)
    equal(object.containsPoint(point6), false);
  });

  test('setCoords', function() {
    var cObj = new fabric.Object({ left: 150, top: 150, width: 100, height: 100, strokeWidth: 0});
    ok(typeof cObj.setCoords == 'function');
    equal(cObj.setCoords(), cObj, 'chainable');

    equal(cObj.oCoords.tl.x, 150);
    equal(cObj.oCoords.tl.y, 150);
    equal(cObj.oCoords.tr.x, 250);
    equal(cObj.oCoords.tr.y, 150);
    equal(cObj.oCoords.bl.x, 150);
    equal(cObj.oCoords.bl.y, 250);
    equal(cObj.oCoords.br.x, 250);
    equal(cObj.oCoords.br.y, 250);
    equal(cObj.oCoords.mtr.x, 200);
    equal(cObj.oCoords.mtr.y, 110);

    cObj.set('left', 250).set('top', 250);

    // coords should still correspond to initial one, even after invoking `set`
    equal(cObj.oCoords.tl.x, 150);
    equal(cObj.oCoords.tl.y, 150);
    equal(cObj.oCoords.tr.x, 250);
    equal(cObj.oCoords.tr.y, 150);
    equal(cObj.oCoords.bl.x, 150);
    equal(cObj.oCoords.bl.y, 250);
    equal(cObj.oCoords.br.x, 250);
    equal(cObj.oCoords.br.y, 250);
    equal(cObj.oCoords.mtr.x, 200);
    equal(cObj.oCoords.mtr.y, 110);

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
    equal(cObj.oCoords.mtr.x, 300);
    equal(cObj.oCoords.mtr.y, 210);
  });

  test('setCoords and aCoords', function() {
    var cObj = new fabric.Object({ left: 150, top: 150, width: 100, height: 100, strokeWidth: 0});
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 0, 0]
    };
    cObj.setCoords();

    equal(cObj.oCoords.tl.x, 300, 'oCoords are modified by viewportTransform');
    equal(cObj.oCoords.tl.y, 300, 'oCoords are modified by viewportTransform');
    equal(cObj.oCoords.tr.x, 500, 'oCoords are modified by viewportTransform');
    equal(cObj.oCoords.tr.y, 300, 'oCoords are modified by viewportTransform');
    equal(cObj.oCoords.bl.x, 300, 'oCoords are modified by viewportTransform');
    equal(cObj.oCoords.bl.y, 500, 'oCoords are modified by viewportTransform');
    equal(cObj.oCoords.br.x, 500, 'oCoords are modified by viewportTransform');
    equal(cObj.oCoords.br.y, 500, 'oCoords are modified by viewportTransform');
    equal(cObj.oCoords.mtr.x, 400, 'oCoords are modified by viewportTransform');
    equal(cObj.oCoords.mtr.y, 260, 'oCoords are modified by viewportTransform');

    equal(cObj.aCoords.tl.x, 150, 'aCoords do not interfere with viewportTransform');
    equal(cObj.aCoords.tl.y, 150, 'aCoords do not interfere with viewportTransform');
    equal(cObj.aCoords.tr.x, 250, 'aCoords do not interfere with viewportTransform');
    equal(cObj.aCoords.tr.y, 150, 'aCoords do not interfere with viewportTransform');
    equal(cObj.aCoords.bl.x, 150, 'aCoords do not interfere with viewportTransform');
    equal(cObj.aCoords.bl.y, 250, 'aCoords do not interfere with viewportTransform');
    equal(cObj.aCoords.br.x, 250, 'aCoords do not interfere with viewportTransform');
    equal(cObj.aCoords.br.y, 250, 'aCoords do not interfere with viewportTransform');
  });

  test('isOnScreen', function(){
    var cObj = new fabric.Object({ left: 50, top: 50, width: 100, height: 100, strokeWidth: 0});
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    cObj.canvas = canvas;
    cObj.setCoords();
    ok(cObj.isOnScreen(), 'object is onScreen');
    cObj.top = 1000;
    cObj.setCoords();
    ok(!cObj.isOnScreen(), 'object is not onScreen with top 1000');
    canvas.setZoom(0.1);
    cObj.setCoords();
    ok(cObj.isOnScreen(), 'zooming out the object is again on screen');
  });

  test('isOnScreen with object that include canvas', function(){
    var cObj = new fabric.Object(
      { left: -10, top: -10, width: canvas.getWidth() + 100, height: canvas.getHeight(), strokeWidth: 0});
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    cObj.canvas = canvas;
    cObj.setCoords();
    equal(cObj.isOnScreen(), true, 'object is onScreen because it include the canvas');
    cObj.top = -1000;
    cObj.left = -1000;
    cObj.setCoords();
    equal(cObj.isOnScreen(), false, 'object is completely out of viewport');
  });

  test('isOnScreen with object that is in top left corner of canvas', function(){
    var cObj = new fabric.Rect({left: -46.56, top: -9.23, width: 50,height: 50, angle: 314.57});
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    cObj.canvas = canvas;
    cObj.setCoords();
    ok(cObj.isOnScreen(), 'object is onScreen because it intersect a canvas line');
    cObj.top -= 20;
    cObj.left -= 20;
    cObj.setCoords();
    ok(!cObj.isOnScreen(), 'object is completely out of viewport');
  });

  test('calcTransformMatrix', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj.calcTransformMatrix == 'function', 'calcTransformMatrix should exist');
  });

  test('_calcDimensionsTransformMatrix', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj._calcDimensionsTransformMatrix == 'function', '_calcDimensionsTransformMatrix should exist');
  });

  test('_calcRotateMatrix', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj._calcRotateMatrix == 'function', '_calcRotateMatrix should exist');
  });

  test('scaleToHeight', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj.scaleToHeight == 'function', 'scaleToHeight should exist');
  });

  test('scaleToWidth', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj.scaleToWidth == 'function', 'scaleToWidth should exist');
  });

  test('scale', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj.scale == 'function', 'scale should exist');
  });

  test('_constrainScale', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj._constrainScale == 'function', '_constrainScale should exist');
  });

  test('getCoords return coordinate of object in canvas coordinate.', function() {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40 });
    var coords = cObj.getCoords();
    deepEqual(coords[0], new fabric.Point(40, 30), 'return top left corner');
    deepEqual(coords[1], new fabric.Point(52, 30), 'return top right corner');
    deepEqual(coords[2], new fabric.Point(52, 47), 'return bottom right corner');
    deepEqual(coords[3], new fabric.Point(40, 47), 'return bottom left corner');

    cObj.left += 5;
    coords = cObj.getCoords();
    deepEqual(coords[0], new fabric.Point(40, 30), 'return top left corner cached oCoords');
    deepEqual(coords[1], new fabric.Point(52, 30), 'return top right corner cached oCoords');
    deepEqual(coords[2], new fabric.Point(52, 47), 'return bottom right corner cached oCoords');
    deepEqual(coords[3], new fabric.Point(40, 47), 'return bottom left corner cached oCoords');

    coords = cObj.getCoords(false, true);
    deepEqual(coords[0], new fabric.Point(45, 30), 'return top left corner recalculated');
    deepEqual(coords[1], new fabric.Point(57, 30), 'return top right corner recalculated');
    deepEqual(coords[2], new fabric.Point(57, 47), 'return bottom right corner recalculated');
    deepEqual(coords[3], new fabric.Point(45, 47), 'return bottom left corner recalculated');
  });

  test('getCoords return coordinate of object in zoomed canvas coordinate.', function() {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 35]
    };
    var coords = cObj.getCoords();
    deepEqual(coords[0], new fabric.Point(115, 95), 'return top left corner is influenced by canvas zoom');
    deepEqual(coords[1], new fabric.Point(139, 95), 'return top right corner is influenced by canvas zoom');
    deepEqual(coords[2], new fabric.Point(139, 129), 'return bottom right corner is influenced by canvas zoom');
    deepEqual(coords[3], new fabric.Point(115, 129), 'return bottom left corner is influenced by canvas zoom');
  });

  test('getCoords return coordinate of object in absolute coordinates and ignore canvas zoom', function() {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40 });
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 35]
    };
    var coords = cObj.getCoords(true);
    deepEqual(coords[0], new fabric.Point(40, 30), 'return top left corner cached oCoords');
    deepEqual(coords[1], new fabric.Point(52, 30), 'return top right corner cached oCoords');
    deepEqual(coords[2], new fabric.Point(52, 47), 'return bottom right corner cached oCoords');
    deepEqual(coords[3], new fabric.Point(40, 47), 'return bottom left corner cached oCoords');
  });

  // test('getCoords return coordinate of object', function() {
  //   var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 2, top: 30, left: 40 });
  //   var coords = cObj.getCoords();
  //   equal(coords[0], { x: 40, y: 30 }, 'return top left corner');
  //   equal(coords[1], { x: 1, y: 1 }, 'return top right corner');
  //   equal(coords[2], { x: 1, y: 1 }, 'return bottom right corner');
  //   equal(coords[3], { x: 1, y: 1 }, 'return bottom left corner');
  // });

})();
