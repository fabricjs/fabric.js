(function() {

  QUnit.module('fabric.Point');

  QUnit.test('constructor & properties', function(assert) {
    assert.ok(typeof fabric.Point === 'function');

    var point = new fabric.Point();

    assert.ok(point);
    assert.ok(point instanceof fabric.Point);
    assert.ok(point.constructor === fabric.Point);
    assert.ok(typeof point.constructor === 'function');
    assert.equal(point.type, 'point');
    assert.equal(point.x, undefined, 'no default values for x');
    assert.equal(point.y, undefined, 'no default values for y');

    var x = 5, y = 6;
    point = new fabric.Point(x, y);
    assert.equal(point.x, x, 'constructor pass x value');
    assert.equal(point.y, y, 'constructor pass y value');
  });

  QUnit.test('point add', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.add === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.add(point2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'is not chainable');
    assert.equal(returned.x, x1 + x2, 'x coords should be added');
    assert.equal(returned.y, y1 + y2, 'y coords should be added');
    assert.equal(point.x, x1, 'point is not changed');
    assert.equal(point.y, y1, 'point is not changed');
    assert.equal(point2.x, x2, 'point 2 is not changed');
    assert.equal(point2.y, y2, 'point 2 is not changed');
  });

  QUnit.test('point addEquals', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.addEquals === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.addEquals(point2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'is chainable');
    assert.equal(point.x, x1 + x2, 'x coords should be added');
    assert.equal(point.y, y1 + y2, 'y coords should be added');
    assert.equal(point2.x, x2, 'point 2 is not changed');
    assert.equal(point2.y, y2, 'point 2 is not changed');
  });

  QUnit.test('scalarAdd', function(assert) {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.scalarAdd === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.scalarAdd(scalar);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'is not chainable');
    assert.equal(returned.x, x1 + scalar, 'x coords should be added');
    assert.equal(returned.y, y1 + scalar, 'y coords should be added');
  });

  QUnit.test('scalarAddEquals', function(assert) {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.scalarAddEquals === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.scalarAddEquals(scalar);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'is chainable');
    assert.equal(point.x, x1 + scalar, 'x coords should be added');
    assert.equal(point.y, y1 + scalar, 'y coords should be added');
  });

  QUnit.test('point subtract', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.subtract === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.subtract(point2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'is not chainable');
    assert.equal(returned.x, x1 - x2, 'x coords should be added');
    assert.equal(returned.y, y1 - y2, 'y coords should be added');
    assert.equal(point.x, x1, 'point is not changed');
    assert.equal(point.y, y1, 'point is not changed');
    assert.equal(point2.x, x2, 'point 2 is not changed');
    assert.equal(point2.y, y2, 'point 2 is not changed');
  });

  QUnit.test('point subtractEquals', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.subtractEquals === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.subtractEquals(point2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'is chainable');
    assert.equal(point.x, x1 - x2, 'x coords should be added');
    assert.equal(point.y, y1 - y2, 'y coords should be added');
    assert.equal(point2.x, x2, 'point 2 is not changed');
    assert.equal(point2.y, y2, 'point 2 is not changed');
  });

  QUnit.test('scalarSubtract', function(assert) {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.scalarSubtract === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.scalarSubtract(scalar);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'is not chainable');
    assert.equal(returned.x, x1 - scalar, 'x coords should be added');
    assert.equal(returned.y, y1 - scalar, 'y coords should be added');
  });

  QUnit.test('scalarSubtractEquals', function(assert) {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.scalarSubtractEquals === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.scalarSubtractEquals(scalar);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'is chainable');
    assert.equal(point.x, x1 - scalar, 'x coords should be added');
    assert.equal(point.y, y1 - scalar, 'y coords should be added');
  });

  QUnit.test('multiply', function(assert) {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.multiply === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.multiply(scalar);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'is not chainable');
    assert.equal(returned.x, x1 * scalar, 'x coords should be added');
    assert.equal(returned.y, y1 * scalar, 'y coords should be added');
  });

  QUnit.test('multiplyEquals', function(assert) {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.multiplyEquals === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.multiplyEquals(scalar);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'is chainable');
    assert.equal(point.x, x1 * scalar, 'x coords should be added');
    assert.equal(point.y, y1 * scalar, 'y coords should be added');
  });

  QUnit.test('divide', function(assert) {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.divide === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.divide(scalar);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'is not chainable');
    assert.equal(returned.x, x1 / scalar, 'x coords should be added');
    assert.equal(returned.y, y1 / scalar, 'y coords should be added');
  });

  QUnit.test('divideEquals', function(assert) {
    var x1 = 2, y1 = 3, scalar = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.divideEquals === 'function');
    assert.equal(point.x, x1, 'constructor pass x value');
    assert.equal(point.y, y1, 'constructor pass y value');
    var returned = point.divideEquals(scalar);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'is chainable');
    assert.equal(point.x, x1 / scalar, 'x coords should be added');
    assert.equal(point.y, y1 / scalar, 'y coords should be added');
  });

  QUnit.test('point eq', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point3 = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.eq === 'function');
    assert.ok(!point.eq(point2), 'points are not equals');
    assert.ok(point.eq(point), 'a point should be equal to itself');
    assert.ok(point.eq(point3), 'point constructed from save var are equals');
  });

  QUnit.test('point lt', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.lt === 'function');
    assert.ok(point.x < point2.x, 'x1 should be less than x2');
    assert.ok(point.y < point2.y, 'y1 should be less than y2');
    assert.ok(point.lt(point2), 'point should be lt than point 2');
  });

  QUnit.test('point gt', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.gt === 'function');
    assert.ok(point2.x > point.x, 'x1 should be gt than x2');
    assert.ok(point2.y > point.y, 'y1 should be gt than y2');
    assert.ok(point2.gt(point), 'point2 should be gt than point');
  });

  QUnit.test('point lte', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point3 = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.lte === 'function');
    assert.ok(point.x <= point2.x, 'x1 should be less than x2');
    assert.ok(point.y <= point2.y, 'y1 should be less than y2');
    assert.ok(point.lte(point2), 'point should be lt than point 2');
    assert.ok(point.x <= point3.x, 'x1 should be less than x2');
    assert.ok(point.y <= point3.y, 'y1 should be less than y2');
    assert.ok(point.eq(point3) && point.lte(point3), 'lte return true on equal points');
    assert.ok(point.lte(point), 'point is lte than itselft');
  });

  QUnit.test('point gte', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point3 = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.gte === 'function');
    assert.ok(point2.x >= point.x, 'x1 should be greater than x2');
    assert.ok(point2.y >= point.y, 'y1 should be greater than y2');
    assert.ok(point2.gte(point), 'point2 should be gte than point');
    assert.ok(point3.x >= point.x, 'x1 should be greater than x2');
    assert.ok(point3.y >= point.y, 'y1 should be greater than y2');
    assert.ok(point3.eq(point) && point3.gte(point), 'gte returns true on equal points');
    assert.ok(point.gte(point), 'point should be gte than itself');
  });

  QUnit.test('point lerp', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.lerp === 'function');
    var returned = point.lerp(point2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'not chainable');
    assert.equal(returned.x, point.x + (point2.x - point.x) / 2, 'default is in the middle');
    assert.equal(returned.y, point.y + (point2.y - point.y) / 2, 'default is in the middle');
    returned = point.lerp(point2, 0);
    assert.deepEqual(returned, point, '0 gives you the original point');
    returned = point.lerp(point2, 1);
    assert.deepEqual(returned, point2, '1 gives you the destination point');
    returned = point.lerp(point2, -1);
    assert.deepEqual(returned, point, '-1 < 0 so t = 0 gives you the original point');
    returned = point.lerp(point2, 2);
    assert.deepEqual(returned, point2, '2 > 1 so t = 1 gives you the destination point');
  });

  QUnit.test('point distance from', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.distanceFrom === 'function');
    var returned = point.distanceFrom(point2, 0.5);
    assert.ok(typeof returned === 'number', 'returns a number');
    assert.equal(returned, Math.sqrt(Math.pow(point2.x - point.x, 2) + Math.pow(point2.y - point.y, 2)), 'return the geomentric distance between coords');
  });

  QUnit.test('midPointFrom', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 5,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.midPointFrom === 'function');
    var returned = point.midPointFrom(point2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'not chainable');
    assert.equal(returned.x, point.x + (point2.x - point.x) / 2, 'point.x is in the middle');
    assert.equal(returned.y, point.y + (point2.y - point.y) / 2, 'point.y is in the middle');
  });

  QUnit.test('min', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 1,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.min === 'function');
    var returned = point.min(point2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'not chainable');
    assert.equal(returned.x, Math.min(point.x, point2.x), 'point.x is the min from the points');
    assert.equal(returned.y, Math.min(point.y, point2.y), 'point.y is the min from the points');
  });

  QUnit.test('max', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 1,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.max === 'function');
    var returned = point.max(point2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'not chainable');
    assert.equal(returned.x, Math.max(point.x, point2.x), 'point.x is the max from the points');
    assert.equal(returned.y, Math.max(point.y, point2.y), 'point.y is the max from the points');
  });

  QUnit.test('toString', function(assert) {
    var x1 = 2, y1 = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.toString === 'function');
    var returned = point.toString();
    assert.ok(typeof returned === 'string', 'returns a string');
    assert.equal(returned, point.x + ',' + point.y, 'coords concat with ,');
  });

  QUnit.test('setXY', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 8,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.setXY === 'function');
    var returned = point.setXY(x2, y2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'chainable');
    assert.equal(returned.x, x2, 'it changed x property');
    assert.equal(returned.y, y2, 'it changed x property');
  });

  QUnit.test('setX', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.setX === 'function');
    var returned = point.setX(x2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'chainable');
    assert.equal(returned.x, x2, 'it changed x property');
  });

  QUnit.test('setY', function(assert) {
    var x1 = 2, y1 = 3, y2 = 8,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.setY === 'function');
    var returned = point.setY(y2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'chainable');
    assert.equal(returned.y, y2, 'it changed y property');
  });

  QUnit.test('setFromPoint', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 8,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.setFromPoint === 'function');
    var returned = point.setFromPoint(point2);
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.equal(returned, point, 'chainable');
    assert.equal(returned.x, point2.x, 'it changed x property');
    assert.equal(returned.y, point2.y, 'it changed x property');
  });

  QUnit.test('swap', function(assert) {
    var x1 = 2, y1 = 3, x2 = 4, y2 = 8,
        point = new fabric.Point(x1, y1),
        point2 = new fabric.Point(x2, y2);

    assert.ok(typeof point.swap === 'function');
    var returned = point.swap(point2);
    assert.equal(returned, undefined, 'it does not return anything');
    assert.equal(point.x, x2, 'swapped x');
    assert.equal(point.y, y2, 'swapped y');
    assert.equal(point2.x, x1, 'swapped x');
    assert.equal(point2.y, y1, 'swapped y');
  });

  QUnit.test('clone', function(assert) {
    var x1 = 2, y1 = 3,
        point = new fabric.Point(x1, y1);

    assert.ok(typeof point.clone === 'function');
    var returned = point.clone();
    assert.ok(returned instanceof fabric.Point, 'returns a point class');
    assert.notEqual(returned, point, 'is not chainable');
    assert.equal(returned.x, point.x, 'x coords should be same');
    assert.equal(returned.y, point.y, 'y coords should be same');
  });

})();
