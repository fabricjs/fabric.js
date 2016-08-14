(function() {

  QUnit.module('fabric.Intersection');

  test('constructor & properties', function() {
    ok(typeof fabric.Intersection == 'function');

    var intersection = new fabric.Intersection();

    ok(intersection);
    ok(intersection instanceof fabric.Intersection);
    ok(intersection.constructor === fabric.Intersection);
    ok(typeof intersection.constructor == 'function');
    deepEqual(intersection.points, [], 'starts with empty array of points');
    ok('status' in intersection, 'has status property');
    equal(intersection.status, undefined, 'no default value for status');

    var status = 'status';
    intersection = new fabric.Intersection(status);
    equal(intersection.status, status, 'constructor pass status value');
  });

  test('appendPoint', function(){
    var point = new fabric.Point(1, 1);
    var intersection = new fabric.Intersection();
    ok(typeof intersection.appendPoint === 'function', 'has appendPoint method');
    var returned = intersection.appendPoint(point);
    ok(returned instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(returned, intersection, 'is chainable');
    equal(intersection.points.indexOf(point), 0, 'now intersection contain points');
  });

  test('appendPoints', function(){
    var point = new fabric.Point(1, 1);
    var intersection = new fabric.Intersection();
    ok(typeof intersection.appendPoints === 'function', 'has appendPoint method');
    var returned = intersection.appendPoints([point, point]);
    ok(returned instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(returned, intersection, 'is chainable');
    equal(intersection.points.indexOf(point), 0, 'now intersection contain points');
    equal(intersection.points.length, 2, 'now intersection contains 2 points');
  });

  test('intersectLineLine simple intersection', function(){
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(10,10),
        p3 = new fabric.Point(0, 10), p4 = new fabric.Point(10, 0),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    ok(typeof fabric.Intersection.intersectLineLine === 'function', 'has intersectLineLine function');
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, 'Intersection', 'it return a inteserction result');
    deepEqual(intersection.points[0], new fabric.Point(5, 5), 'intersect in 5,5');
  });

  test('intersectLineLine parallel', function(){
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(0,10),
        p3 = new fabric.Point(10, 0), p4 = new fabric.Point(10, 10),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, 'Parallel', 'it return a Parallel result');
    deepEqual(intersection.points, [], 'no point of intersections');
  });

  test('intersectLineLine coincident', function(){
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(0, 10),
        p3 = new fabric.Point(0, 0), p4 = new fabric.Point(0, 10),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, 'Coincident', 'it return a Coincident result');
    deepEqual(intersection.points, [], 'no point of intersections');
  });

  test('intersectLineLine coincident but different', function(){
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(0, 10),
        p3 = new fabric.Point(0, 1), p4 = new fabric.Point(0, 9),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, 'Coincident', 'it return a Coincident result');
    deepEqual(intersection.points, [], 'no point of intersections');
  });

  test('intersectLineLine no intersect', function(){
    var p1 = new fabric.Point(0, 0), p2 = new fabric.Point(0,10),
        p3 = new fabric.Point(10, 0), p4 = new fabric.Point(1, 10),
        intersection = fabric.Intersection.intersectLineLine(p1, p2, p3, p4);
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, undefined, 'it return a undefined status result');
    deepEqual(intersection.points, [], 'no point of intersections');
  });

  test('intersectLinePolygon', function(){
    var p1 = new fabric.Point(0, 5), p2 = new fabric.Point(10, 5),
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectLinePolygon(p1, p2, points);
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    ok(typeof fabric.Intersection.intersectLinePolygon === 'function', 'has intersectLinePolygon function');
    equal(intersection.status, 'Intersection', 'it return a Intersection result');
    equal(intersection.points.length, 2, '2 points of intersections');
    deepEqual(intersection.points[0], new fabric.Point(3.5, 5), 'intersect in 3.5 ,5');
    deepEqual(intersection.points[1], new fabric.Point(6.5, 5), 'intersect in 6.5 ,5');
  });

  test('intersectLinePolygon in one point', function(){
    var p1 = new fabric.Point(0, 5), p2 = new fabric.Point(5, 5),
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectLinePolygon(p1, p2, points);
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, 'Intersection', 'it return a Intersection result');
    equal(intersection.points.length, 1, '1 points of intersections');
    deepEqual(intersection.points[0], new fabric.Point(3.5, 5), 'intersect in 3.5 ,5');
  });

  test('intersectLinePolygon in one point', function(){
    var p1 = new fabric.Point(0, 5), p2 = new fabric.Point(3, 5),
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectLinePolygon(p1, p2, points);
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, undefined, 'it return a undefined result');
    equal(intersection.points.length, 0, '0 points of intersections');
  });

  test('intersectLinePolygon on a polygon segment', function(){
    //TODO: fix this. it should return coincident.
    var p1 = new fabric.Point(1, 10), p2 = new fabric.Point(9, 10),
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectLinePolygon(p1, p2, points);
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, 'Intersection', 'it return a Intersection result');
    equal(intersection.points.length, 2, '2 points of intersections');
    deepEqual(intersection.points[0], new fabric.Point(2, 10), 'intersect in 2, 10');
    deepEqual(intersection.points[1], new fabric.Point(8, 10), 'intersect in 8, 10');
  });

  test('intersectPolygonPolygon not intersecting', function(){
    var p3b = new fabric.Point(50, 0), p4b = new fabric.Point(20, 100),
        p5b = new fabric.Point(80, 100), pointsb = [p3b, p4b, p5b],
        p3 = new fabric.Point(5, 0), p4 = new fabric.Point(2, 10),
        p5 = new fabric.Point(8, 10), points = [p3, p4, p5],
        intersection = fabric.Intersection.intersectPolygonPolygon(pointsb, points);
    ok(typeof fabric.Intersection.intersectPolygonPolygon === 'function', 'has intersectPolygonPolygon function');
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, undefined, 'it return a Intersection with no status');
    equal(intersection.points.length, 0, '0 points of intersections');
  });

  test('intersectPolygonPolygon intersecting', function(){
    var p3b = new fabric.Point(1, 1), p4b = new fabric.Point(3, 1),
        p5b = new fabric.Point(3, 3), p6b = new fabric.Point(1, 3),
        pointsb = [p3b, p4b, p5b, p6b],
        p3 = new fabric.Point(2, 2), p4 = new fabric.Point(4, 2),
        p5 = new fabric.Point(4, 4), p6 = new fabric.Point(2, 4),
        points = [p3, p4, p5, p6],
        intersection = fabric.Intersection.intersectPolygonPolygon(pointsb, points);
    ok(typeof fabric.Intersection.intersectPolygonPolygon === 'function', 'has intersectPolygonPolygon function');
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, 'Intersection', 'it return a Intersection result');
    equal(intersection.points.length, 2, '2 points of intersections');
    deepEqual(intersection.points[0], new fabric.Point(3, 2), 'point of intersections 3, 2');
    deepEqual(intersection.points[1], new fabric.Point(2, 3), 'point of intersections 2, 3');
  });

  test('intersectPolygonRectangle intersecting', function(){
    var p3b = new fabric.Point(1, 1),
        p5b = new fabric.Point(3, 3),
        p3 = new fabric.Point(2, 2), p4 = new fabric.Point(4, 2),
        p5 = new fabric.Point(4, 4), p6 = new fabric.Point(2, 4),
        points = [p3, p4, p5, p6],
        intersection = fabric.Intersection.intersectPolygonRectangle(points, p3b, p5b);
    ok(typeof fabric.Intersection.intersectPolygonRectangle === 'function', 'has intersectPolygonPolygon function');
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, 'Intersection', 'it return a Intersection result');
    equal(intersection.points.length, 2, '2 points of intersections');
    deepEqual(intersection.points[0], new fabric.Point(3, 2), 'point of intersections 3, 2');
    deepEqual(intersection.points[1], new fabric.Point(2, 3), 'point of intersections 2, 3');
  });

  test('intersectPolygonRectangle not intersecting', function(){
    var p3b = new fabric.Point(10, 10),
        p5b = new fabric.Point(30, 30),
        p3 = new fabric.Point(2, 2), p4 = new fabric.Point(4, 2),
        p5 = new fabric.Point(4, 4), p6 = new fabric.Point(2, 4),
        points = [p3, p4, p5, p6],
        intersection = fabric.Intersection.intersectPolygonRectangle(points, p3b, p5b);
    ok(typeof fabric.Intersection.intersectPolygonRectangle === 'function', 'has intersectPolygonPolygon function');
    ok(intersection instanceof fabric.Intersection, 'returns a fabric.Intersection');
    equal(intersection.status, undefined, 'it return a Intersection result');
    equal(intersection.points.length, 0, '0 points of intersections');
  });
})();
