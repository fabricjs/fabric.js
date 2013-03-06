(function(){

  var LINE_OBJECT = {
    'type': 'line',
    'originX': 'center',
    'originY': 'center',
    'left': 12,
    'top': 13,
    'width': 2,
    'height': 2,
    'fill': 'rgb(0,0,0)',
    'overlayFill': null,
    'stroke': null,
    'strokeWidth': 1,
    'strokeDashArray': null,
    'scaleX': 1,
    'scaleY': 1,
    'angle': 0,
    'flipX': false,
    'flipY': false,
    'opacity': 1,
    'x1': 11,
    'y1': 12,
    'x2': 13,
    'y2': 14,
    'selectable': true,
    'hasControls': true,
    'hasBorders': true,
    'hasRotatingPoint': true,
    'transparentCorners': true,
    'perPixelTargetFind': false,
    'shadow': null,
    'visible': true
  };

  QUnit.module('fabric.Line');

  test('constructor', function() {
    ok(fabric.Line);
    var line = new fabric.Line([10, 11, 20, 21]);

    ok(line instanceof fabric.Line);
    ok(line instanceof fabric.Object);

    equal(line.type, 'line');

    equal(line.get('x1'), 10);
    equal(line.get('y1'), 11);
    equal(line.get('x2'), 20);
    equal(line.get('y2'), 21);

    var lineWithoutPoints = new fabric.Line();

    equal(lineWithoutPoints.get('x1'), 0);
    equal(lineWithoutPoints.get('y1'), 0);
    equal(lineWithoutPoints.get('x2'), 0);
    equal(lineWithoutPoints.get('y2'), 0);
  });

  test('complexity', function() {
    var line = new fabric.Line();
    ok(typeof line.complexity == 'function');
  });

  test('toObject', function() {
    var line = new fabric.Line([11, 12, 13, 14]);
    ok(typeof line.toObject == 'function');
    deepEqual(LINE_OBJECT, line.toObject());
  });

  test('fromObject', function() {
    ok(typeof fabric.Line.fromObject == 'function');
    var line = fabric.Line.fromObject(LINE_OBJECT);
    ok(line instanceof fabric.Line);
    deepEqual(LINE_OBJECT, line.toObject());
  });

  test('fromElement', function() {
    ok(typeof fabric.Line.fromElement == 'function');

    var lineEl        = fabric.document.createElement('line'),
        x1            = 11,
        y1            = 23,
        x2            = 34,
        y2            = 7,
        stroke        = 'ff5555',
        strokeWidth   = 2;

    lineEl.setAttribute('x1', x1);
    lineEl.setAttribute('x2', x2);
    lineEl.setAttribute('y1', y1);
    lineEl.setAttribute('y2', y2);
    lineEl.setAttribute('stroke', stroke);
    lineEl.setAttribute('stroke-width', strokeWidth);

    var oLine = fabric.Line.fromElement(lineEl);
    ok(oLine instanceof fabric.Line);

    equal(oLine.get('x1'), x1);
    equal(oLine.get('y1'), y1);
    equal(oLine.get('x2'), x2);
    equal(oLine.get('y2'), y2);
    equal(oLine.get('stroke'), stroke);
    equal(oLine.get('strokeWidth'), strokeWidth);

    var lineElWithMissingAttributes = fabric.document.createElement('line');
    lineElWithMissingAttributes.setAttribute('x1', 10);
    lineElWithMissingAttributes.setAttribute('y1', 20);

    oLine = fabric.Line.fromElement(lineElWithMissingAttributes);

    equal(oLine.get('x2'), 0, 'missing attributes count as 0 values');
    equal(oLine.get('y2'), 0, 'missing attributes count as 0 values');
  });

  test('straight lines should be displayed', function() {
    var line1 = new fabric.Line([10,10,100,10]),
        line2 = new fabric.Line([10,10,10,100]);

    equal(line1.get('height'), 1);
    equal(line2.get('width'), 1);
  });

  test('changing x/y coords should update width/height', function() {
    var line = new fabric.Line([ 50, 50, 100, 100]);

    equal(50, line.width);

    line.set({ x1: 75, y1: 75, x2: 175, y2: 175 });

    equal(100, line.width);
    equal(100, line.height);
  });

  test('stroke-width in a style', function() {
    var lineEl = fabric.document.createElement('line'),
        x1 = 0,
        y1 = 0,
        x2 = 10,
        y2 = 10;

    lineEl.setAttribute('style', 'stroke-width:4');

    var oLine = fabric.Line.fromElement(lineEl);
    ok(4, oLine.strokeWidth);
  });

  // this isn't implemented yet, so disabling for now

  // test('x1,y1 less than x2,y2 should work', function() {
  //   var line = new fabric.Line([ 400, 200, 300, 400]);

  //   equal(100, line.width);
  //   equal(200, line.height);
  // });

})();