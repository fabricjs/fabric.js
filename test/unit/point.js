(function() {

  QUnit.module('fabric.Point');

  test('constructor & properties', function() {
    ok(typeof fabric.Point == 'function');

    var point = new fabric.Point();

    ok(point);
    ok(point instanceof fabric.Point);
    ok(point.constructor === fabric.Point);
    ok(typeof point.constructor == 'function');
    equal(point.type, 'point');
    equal(point.x, undefined, 'no default values for x');
    equal(point.y, undefined, 'no default values for y');

    var x = 5, y = 6;
    point = new fabric.Point(x, y);
    equal(point.x, x, 'constructor pass x value');
    equal(point.y, y, 'constructor pass y value');
  });

  test('point add', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.add == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.add(point2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'is not chainable');
    equal(returned.x, x1 + x2, 'x coords should be added');
    equal(returned.y, y1 + y2, 'y coords should be added');
    equal(point.x, x1, 'point is not changed');
    equal(point.y, y1, 'point is not changed');
    equal(point2.x, x2, 'point 2 is not changed');
    equal(point2.y, y2, 'point 2 is not changed');
  });

  test('point addEquals', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.addEquals == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.addEquals(point2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'is chainable');
    equal(point.x, x1 + x2, 'x coords should be added');
    equal(point.y, y1 + y2, 'y coords should be added');
    equal(point2.x, x2, 'point 2 is not changed');
    equal(point2.y, y2, 'point 2 is not changed');
  });

  test('scalarAdd', function() {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.scalarAdd == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.scalarAdd(scalar);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'is not chainable');
    equal(returned.x, x1 + scalar, 'x coords should be added');
    equal(returned.y, y1 + scalar, 'y coords should be added');
  });

  test('scalarAddEquals', function() {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.scalarAddEquals == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.scalarAddEquals(scalar);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'is chainable');
    equal(point.x, x1 + scalar, 'x coords should be added');
    equal(point.y, y1 + scalar, 'y coords should be added');
  });

  test('point subtract', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.subtract == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.subtract(point2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'is not chainable');
    equal(returned.x, x1 - x2, 'x coords should be added');
    equal(returned.y, y1 - y2, 'y coords should be added');
    equal(point.x, x1, 'point is not changed');
    equal(point.y, y1, 'point is not changed');
    equal(point2.x, x2, 'point 2 is not changed');
    equal(point2.y, y2, 'point 2 is not changed');
  });

  test('point subtractEquals', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.subtractEquals == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.subtractEquals(point2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'is chainable');
    equal(point.x, x1 - x2, 'x coords should be added');
    equal(point.y, y1 - y2, 'y coords should be added');
    equal(point2.x, x2, 'point 2 is not changed');
    equal(point2.y, y2, 'point 2 is not changed');
  });

  test('scalarSubtract', function() {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.scalarSubtract == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.scalarSubtract(scalar);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'is not chainable');
    equal(returned.x, x1 - scalar, 'x coords should be added');
    equal(returned.y, y1 - scalar, 'y coords should be added');
  });

  test('scalarSubtractEquals', function() {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.scalarSubtractEquals == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.scalarSubtractEquals(scalar);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'is chainable');
    equal(point.x, x1 - scalar, 'x coords should be added');
    equal(point.y, y1 - scalar, 'y coords should be added');
  });

  test('multiply', function() {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.multiply == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.multiply(scalar);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'is not chainable');
    equal(returned.x, x1 * scalar, 'x coords should be added');
    equal(returned.y, y1 * scalar, 'y coords should be added');
  });

  test('multiplyEquals', function() {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.multiplyEquals == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.multiplyEquals(scalar);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'is chainable');
    equal(point.x, x1 * scalar, 'x coords should be added');
    equal(point.y, y1 * scalar, 'y coords should be added');
  });

  test('divide', function() {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.divide == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.divide(scalar);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'is not chainable');
    equal(returned.x, x1 / scalar, 'x coords should be added');
    equal(returned.y, y1 / scalar, 'y coords should be added');
  });

  test('divideEquals', function() {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.divideEquals == 'function');
    equal(point.x, x1, 'constructor pass x value');
    equal(point.y, y1, 'constructor pass y value');
    var returned = point.divideEquals(scalar);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'is chainable');
    equal(point.x, x1 / scalar, 'x coords should be added');
    equal(point.y, y1 / scalar, 'y coords should be added');
  });

  test('point eq', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point3 = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.eq == 'function');
    ok(!point.eq(point2), 'points are not equals');
    ok(point.eq(point), 'a point should be equal to itself');
    ok(point.eq(point3), 'point constructed from save var are equals');
  });

  test('point lt', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.lt == 'function');
    ok(point.x < point2.x, 'x1 should be less than x2');
    ok(point.y < point2.y, 'y1 should be less than y2');
    ok(point.lt(point2), 'point should be lt than point 2');
  });

  test('point gt', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.gt == 'function');
    ok(point2.x > point.x, 'x1 should be gt than x2');
    ok(point2.y > point.y, 'y1 should be gt than y2');
    ok(point2.gt(point), 'point2 should be gt than point');
  });

  test('point lte', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point3 = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.lte == 'function');
    ok(point.x <= point2.x, 'x1 should be less than x2');
    ok(point.y <= point2.y, 'y1 should be less than y2');
    ok(point.lte(point2), 'point should be lt than point 2');
    ok(point.x <= point3.x, 'x1 should be less than x2');
    ok(point.y <= point3.y, 'y1 should be less than y2');
    ok(point.eq(point3) && point.lte(point3), 'lte return true on equal points');
    ok(point.lte(point), 'point is lte than itselft');
  });

  test('point gte', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point3 = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.gte == 'function');
    ok(point2.x >= point.x, 'x1 should be greater than x2');
    ok(point2.y >= point.y, 'y1 should be greater than y2');
    ok(point2.gte(point), 'point2 should be gte than point');
    ok(point3.x >= point.x, 'x1 should be greater than x2');
    ok(point3.y >= point.y, 'y1 should be greater than y2');
    ok(point3.eq(point) && point3.gte(point), 'gte returns true on equal points');
    ok(point.gte(point), 'point should be gte than itself');
  });

  test('point lerp', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.lerp == 'function');
    var returned = point.lerp(point2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'not chainable');
    equal(returned.x, point.x + (point2.x - point.x) / 2, 'default is in the middle');
    equal(returned.y, point.y + (point2.y - point.y) / 2, 'default is in the middle');
    returned = point.lerp(point2, 0);
    deepEqual(returned, point, '0 gives you the original point');
    returned = point.lerp(point2, 1);
    deepEqual(returned, point2, '1 gives you the destination point');
    returned = point.lerp(point2, -1);
    deepEqual(returned, point, '-1 < 0 so t = 0 gives you the original point');
    returned = point.lerp(point2, 2);
    deepEqual(returned, point2, '2 > 1 so t = 1 gives you the destination point');
  });

  test('point distance from', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.distanceFrom == 'function');
    var returned = point.distanceFrom(point2, 0.5);
    ok(typeof returned === 'number', 'returns a number');
    equal(returned, Math.sqrt(Math.pow(point2.x - point.x, 2) + Math.pow(point2.y - point.y, 2)), 'return the geomentric distance between coords');
  });

  test('midPointFrom', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.midPointFrom == 'function');
    var returned = point.midPointFrom(point2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'not chainable');
    equal(returned.x, point.x + (point2.x - point.x) / 2, 'point.x is in the middle');
    equal(returned.y, point.y + (point2.y - point.y) / 2, 'point.y is in the middle');
  });

  test('min', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 1,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.min == 'function');
    var returned = point.min(point2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'not chainable');
    equal(returned.x, Math.min(point.x, point2.x), 'point.x is the min from the points');
    equal(returned.y, Math.min(point.y, point2.y), 'point.y is the min from the points');
  });

  test('max', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 1,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.max == 'function');
    var returned = point.max(point2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'not chainable');
    equal(returned.x, Math.max(point.x, point2.x), 'point.x is the max from the points');
    equal(returned.y, Math.max(point.y, point2.y), 'point.y is the max from the points');
  });

  test('toString', function() {
    var x1 = 2, y1 = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.toString == 'function');
    var returned = point.toString();
    ok(typeof returned === 'string', 'returns a string');
    equal(returned, point.x + ',' + point.y, 'coords concat with ,');
  });

  test('setXY', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 8,
        point = new fabric.Point(x1, y1);

    ok(typeof point.setXY == 'function');
    var returned = point.setXY(x2, y2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'chainable');
    equal(returned.x, x2, 'it changed x property');
    equal(returned.y, y2, 'it changed x property');
  });

  test('setX', function() {
    var x1 = 2, y1 = 3, x2 = 4,
        point = new fabric.Point(x1, y1);

    ok(typeof point.setX == 'function');
    var returned = point.setX(x2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'chainable');
    equal(returned.x, x2, 'it changed x property');
  });

  test('setY', function() {
    var x1 = 2, y1 = 3, y2 = 8,
        point = new fabric.Point(x1, y1);

    ok(typeof point.setY == 'function');
    var returned = point.setY(y2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'chainable');
    equal(returned.y, y2, 'it changed y property');
  });

  test('setFromPoint', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 8,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.setFromPoint == 'function');
    var returned = point.setFromPoint(point2);
    ok(returned instanceof fabric.Point, 'returns a point class');
    equal(returned, point, 'chainable');
    equal(returned.x, point2.x, 'it changed x property');
    equal(returned.y, point2.y, 'it changed x property');
  });

  test('swap', function() {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 8,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    ok(typeof point.swap == 'function');
    var returned = point.swap(point2);
    equal(returned, undefined, 'it does not return anything');
    equal(point.x, x2, 'swapped x');
    equal(point.y, y2, 'swapped y');
    equal(point2.x, x1, 'swapped x');
    equal(point2.y, y1, 'swapped y');
  });

  test('clone', function() {
    var x1 = 2, y1 = 3,
        point = new fabric.Point(x1, y1);

    ok(typeof point.clone == 'function');
    var returned = point.clone();
    ok(returned instanceof fabric.Point, 'returns a point class');
    notEqual(returned, point, 'is not chainable');
    equal(returned.x, point.x, 'x coords should be same');
    equal(returned.y, point.y, 'y coords should be same');
  });

})();
