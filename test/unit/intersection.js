(function() {

  QUnit.module('fabric.Intersection');

  QUnit.test('constructor & properties', function(assert) {
    assert.ok(typeof fabric.Intersection === 'function');

    var intersection = new fabric.Intersection();

    assert.ok(intersection);
    assert.ok(intersection instanceof fabric.Intersection);
    assert.ok(intersection.constructor === fabric.Intersection);
    assert.ok(typeof intersection.constructor === 'function');
    assert.deepEqual(intersection.points, [], 'starts with empty array of points');
    assert.ok('status' in intersection, 'has status property');
    assert.equal(intersection.status, undefined, 'no default value for status');

    var status = 'status';
    intersection = new fabric.Intersection(status);
    assert.equal(intersection.status, status, 'constructor pass status value');
  });

  QUnit.test('appendPoint', function(assert) {
    var point = new fabric.Point(1, 1);
    var intersection = new fabric.Intersection();
    assert.ok(typeof intersection.appendPoint === 'function', 'has appendPoint method');
    var returned = intersection.appendPoint(point);
    assert.ok(returned instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(returned, intersection, 'is chainable');
    assert.equal(intersection.points.indexOf(point), 0, 'now intersection contain points');
  });

  QUnit.test('appendPoints', function(assert) {
    var point = new fabric.Point(1, 1);
    var intersection = new fabric.Intersection();
    assert.ok(typeof intersection.appendPoints === 'function', 'has appendPoint method');
    var returned = intersection.appendPoints([point, point]);
    assert.ok(returned instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(returned, intersection, 'is chainable');
    assert.equal(intersection.points.indexOf(point), 0, 'now intersection contain points');
    assert.equal(intersection.points.length, 2, 'now intersection contains 2 points');
  });

  QUnit.test('intersectLineLine simple intersection', function(assert) {
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(10,10),
        p3 = new fabric.Point(0, 10), p4 = new fabric.Point(10, 0),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    assert.ok(typeof fabric.Intersection.intersectLineLine === 'function', 'has intersectLineLine function');
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, 'Intersection', 'it return a inteserction result');
    assert.deepEqual(intersection.points[0], new fabric.Point(5, 5), 'intersect in 5,5');
  });

  QUnit.test('intersectLineLine parallel', function(assert) {
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(0,10),
        p3 = new fabric.Point(10, 0), p4 = new fabric.Point(10, 10),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, 'Parallel', 'it return a Parallel result');
    assert.deepEqual(intersection.points, [], 'no point of intersections');
  });

  QUnit.test('intersectLineLine coincident', function(assert) {
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(0, 10),
        p3 = new fabric.Point(0, 0), p4 = new fabric.Point(0, 10),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, 'Coincident', 'it return a Coincident result');
    assert.deepEqual(intersection.points, [], 'no point of intersections');
  });

  QUnit.test('intersectLineLine coincident but different', function(assert) {
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(0, 10),
        p3 = new fabric.Point(0, 1), p4 = new fabric.Point(0, 9),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, 'Coincident', 'it return a Coincident result');
    assert.deepEqual(intersection.points, [], 'no point of intersections');
  });

  QUnit.test('intersectLineLine no intersect', function(assert) {
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(0,10),
        p3 = new fabric.Point(10, 0), p4 = new fabric.Point(1, 10),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, undefined, 'it return a undefined status result');
    assert.deepEqual(intersection.points, [], 'no point of intersections');
  });

  QUnit.test('intersectLinePolygon', function(assert) {
    var p1 = new fabric.Point(0, 5), p2 = new fabric.Point(10, 5),
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectLinePolygon(p1, p2, points);
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.ok(typeof fabric.Intersection.intersectLinePolygon === 'function', 'has intersectLinePolygon function');
    assert.equal(intersection.status, 'Intersection', 'it return a Intersection result');
    assert.equal(intersection.points.length, 2, '2 points of intersections');
    assert.deepEqual(intersection.points[0], new fabric.Point(3.5, 5), 'intersect in 3.5 ,5');
    assert.deepEqual(intersection.points[1], new fabric.Point(6.5, 5), 'intersect in 6.5 ,5');
  });

  QUnit.test('intersectLinePolygon in one point', function(assert) {
    var p1 = new fabric.Point(0, 5), p2 = new fabric.Point(5, 5),
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectLinePolygon(p1, p2, points);
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, 'Intersection', 'it return a Intersection result');
    assert.equal(intersection.points.length, 1, '1 points of intersections');
    assert.deepEqual(intersection.points[0], new fabric.Point(3.5, 5), 'intersect in 3.5 ,5');
  });

  QUnit.test('intersectLinePolygon in one point', function(assert) {
    var p1 = new fabric.Point(0, 5), p2 = new fabric.Point(3, 5),
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectLinePolygon(p1, p2, points);
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, undefined, 'it return a undefined result');
    assert.equal(intersection.points.length, 0, '0 points of intersections');
  });

  QUnit.test('intersectLinePolygon on a polygon segment', function(assert) {
    //TODO: fix this. it should return coincident.
    var p1 = new fabric.Point(1, 10), p2 = new fabric.Point(9, 10),
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectLinePolygon(p1, p2, points);
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, 'Intersection', 'it return a Intersection result');
    assert.equal(intersection.points.length, 2, '2 points of intersections');
    assert.deepEqual(intersection.points[0], new fabric.Point(2, 10), 'intersect in 2, 10');
    assert.deepEqual(intersection.points[1], new fabric.Point(8, 10), 'intersect in 8, 10');
  });

  QUnit.test('intersectPolygonPolygon not intersecting', function(assert) {
    var p3b = new fabric.Point(50, 0), p4b = new fabric.Point(20, 100),
        p5b = new fabric.Point(80, 100), pointsb = [p3b, p4b, p5b],
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectPolygonPolygon(pointsb, points);
    assert.ok(typeof fabric.Intersection.intersectPolygonPolygon === 'function', 'has intersectPolygonPolygon function');
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, undefined, 'it return a Intersection with no status');
    assert.equal(intersection.points.length, 0, '0 points of intersections');
  });

  QUnit.test('intersectPolygonPolygon intersecting', function(assert) {
    var p3b = new fabric.Point(1, 1), p4b = new fabric.Point(3, 1),
        p5b = new fabric.Point(3, 3), p6b = new fabric.Point(1, 3),
        pointsb = [p3b, p4b, p5b, p6b],
        p3 = new fabric.Point(2, 2), p4 = new fabric.Point(4, 2),
        p5 = new fabric.Point(4, 4), p6 = new fabric.Point(2, 4),
        points = [p3, p4, p5, p6],
        intersection = fabric.Intersection.intersectPolygonPolygon(pointsb, points);
    assert.ok(typeof fabric.Intersection.intersectPolygonPolygon === 'function', 'has intersectPolygonPolygon function');
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, 'Intersection', 'it return a Intersection result');
    assert.equal(intersection.points.length, 2, '2 points of intersections');
    assert.deepEqual(intersection.points[0], new fabric.Point(3, 2), 'point of intersections 3, 2');
    assert.deepEqual(intersection.points[1], new fabric.Point(2, 3), 'point of intersections 2, 3');
  });

  QUnit.test('intersectPolygonRectangle intersecting', function(assert) {
    var p3b = new fabric.Point(1, 1),
        p5b = new fabric.Point(3, 3),
        p3 = new fabric.Point(2, 2), p4 = new fabric.Point(4, 2),
        p5 = new fabric.Point(4, 4), p6 = new fabric.Point(2, 4),
        points = [p3, p4, p5, p6],
        intersection = fabric.Intersection.intersectPolygonRectangle(points, p3b, p5b);
    assert.ok(typeof fabric.Intersection.intersectPolygonRectangle === 'function', 'has intersectPolygonPolygon function');
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, 'Intersection', 'it return a Intersection result');
    assert.equal(intersection.points.length, 2, '2 points of intersections');
    assert.deepEqual(intersection.points[0], new fabric.Point(3, 2), 'point of intersections 3, 2');
    assert.deepEqual(intersection.points[1], new fabric.Point(2, 3), 'point of intersections 2, 3');
  });

  QUnit.test('intersectPolygonRectangle not intersecting', function(assert) {
    var p3b = new fabric.Point(10, 10),
        p5b = new fabric.Point(30, 30),
        p3 = new fabric.Point(2, 2), p4 = new fabric.Point(4, 2),
        p5 = new fabric.Point(4, 4), p6 = new fabric.Point(2, 4),
        points = [p3, p4, p5, p6],
        intersection = fabric.Intersection.intersectPolygonRectangle(points, p3b, p5b);
    assert.ok(typeof fabric.Intersection.intersectPolygonRectangle === 'function', 'has intersectPolygonPolygon function');
    assert.ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    assert.equal(intersection.status, undefined, 'it return a Intersection result');
    assert.equal(intersection.points.length, 0, '0 points of intersections');
  });
})();
