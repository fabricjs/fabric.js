  let canvas;
  QUnit.module('Draw Shapes', function (hooks) {
    hooks.before(() => {
      canvas = new fabric.Canvas();
    });
    hooks.afterEach(function() {
      canvas.cancelRequestedRender();
    });
    hooks.after(() => {
      canvas.dispose();
    });

    [true, false].forEach((val) => {
      QUnit.module(`enableRetinaScaling = ${val}`, (hooks) => {
        hooks.beforeEach(function () {
          canvas.enableRetinaScaling = val;
        });
        hooks.afterEach(() => canvas.off());

        function runShapeBrushTest(brush, assert, e = {}) {
          var fireBeforePathCreatedEvent = false;
          var firePathCreatedEvent = false;
          var added = null;
          canvas.on('before:path:created', function () {
            fireBeforePathCreatedEvent = true;
          });
          canvas.on('path:created', function (opt) {
            firePathCreatedEvent = true;
            added = opt.path;
          });
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10 });
          var pointer2 = canvas.getPointer({ clientX: 15, clientY: 15 });
          var pointer3 = canvas.getPointer({ clientX: 20, clientY: 25 });
          brush.onMouseDown(pointer, { e });
          brush.onMouseMove(pointer2, { e });
          brush.onMouseMove(pointer3, { e });
          brush.onMouseMove(pointer2, { e });
          brush.onMouseMove(pointer3, { e });
          brush.onMouseUp({ e, pointer: pointer3 });
          assert.equal(fireBeforePathCreatedEvent, true, 'before:path:created event is fired');
          assert.equal(firePathCreatedEvent, true, 'path:created event is fired');
          return added;
        }

        QUnit.test('Draw Shape', function (assert) {
          const brush = new fabric.DrawShape(canvas);
          brush.width = 5;
          const shape = runShapeBrushTest(brush, assert);
          assert.ok(shape instanceof fabric.Rect, 'a rect is added');
          assert.equal(shape.strokeWidth, 5, 'should set width');
          assert.equal(shape.width, 10, 'should set width');
          assert.equal(shape.height, 15, 'should set height');
          assert.deepEqual(
            shape.translateToOriginPoint(shape.getCenterPoint(), 'left', 'top'),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
        });

        QUnit.test('Draw Shape + symmetric', function (assert) {
          const shape = runShapeBrushTest(new fabric.DrawShape(canvas), assert, {
            shiftKey: true
          });
          assert.equal(Math.round(shape.width), 13, 'should set width to height value');
          assert.equal(Math.round(shape.width), 13, 'should set height');
          assert.deepEqual(
            shape.translateToOriginPoint(shape.getCenterPoint(), 'left', 'top'),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
        });

        QUnit.test('Draw Shape + centered', function (assert) {
          const brush = new fabric.DrawShape(canvas);
          brush.centered = true;
          const shape = runShapeBrushTest(brush, assert);
          assert.equal(shape.width, 10, 'should set width');
          assert.equal(shape.height, 15, 'should set height');
          assert.deepEqual(shape.getCenterPoint(), new fabric.Point(10, 10), 'should preserve position from mousedown');
        });

        QUnit.test('Draw Shape + symmetric + centered', function (assert) {
          const brush = new fabric.DrawShape(canvas);
          brush.centered = true;
          const shape = runShapeBrushTest(brush, assert, {
            shiftKey: true
          });
          assert.equal(Math.round(shape.width), 25, 'should set width');
          assert.equal(Math.round(shape.width), 25, 'should set height');
          assert.deepEqual(shape.getCenterPoint(), new fabric.Point(10, 10), 'should preserve position from mousedown');
        });

        QUnit.test('Draw Oval', function (assert) {
          const shape = runShapeBrushTest(new fabric.DrawOval(canvas), assert);
          assert.equal(shape.rx, 5, 'should set rx');
          assert.equal(shape.ry, 7.5, 'should set ry');
          assert.equal(shape.width, 10, 'should set width');
          assert.equal(shape.height, 15, 'should set height');
          assert.deepEqual(
            shape.translateToOriginPoint(shape.getCenterPoint(), 'left', 'top'),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
        });

        QUnit.test('Draw Oval + centered', function (assert) {
          const brush = new fabric.DrawOval(canvas);
          brush.centered = true;
          const shape = runShapeBrushTest(brush, assert);
          assert.equal(shape.rx, 10, 'should set rx');
          assert.equal(shape.ry, 15, 'should set ry');
          assert.equal(shape.width, 20, 'should set width');
          assert.equal(shape.height, 30, 'should set height');
          assert.deepEqual(
            shape.getCenterPoint(),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
        });

        QUnit.test('Draw Oval + symmetric', function (assert) {
          const shape = runShapeBrushTest(new fabric.DrawOval(canvas), assert, {
            shiftKey: true
          });
          assert.equal(shape.rx, 7.5, 'should set rx');
          assert.equal(shape.ry, 7.5, 'should set ry');
          assert.equal(shape.width, 15, 'should set width');
          assert.equal(shape.height, 15, 'should set height');
          assert.deepEqual(
            shape.translateToOriginPoint(shape.getCenterPoint(), 'left', 'top'),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
        });

        QUnit.test('Draw Oval + centered + symmetric', function (assert) {
          const brush = new fabric.DrawOval(canvas);
          brush.centered = true;
          const shape = runShapeBrushTest(brush, assert, {
            shiftKey: true
          });
          assert.equal(Math.round(shape.rx), 18, 'should set rx');
          assert.equal(Math.round(shape.ry), 18, 'should set ry');
          assert.equal(Math.round(shape.width), 36, 'should set width');
          assert.equal(Math.round(shape.height), 36, 'should set height');
          assert.deepEqual(
            shape.getCenterPoint(),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
        });

        [fabric.Polygon, fabric.Polyline].forEach(builder => {
          QUnit.test(`Draw ${builder.name}`, function (assert) {
            const brush = new fabric.DrawPoly(canvas);
            brush.builder = builder;
            const e = {};
            let fireBeforePathCreatedEvent = false;
            let firePathCreatedEvent = false;
            let poly = null;
            canvas.on('before:path:created', function () {
              fireBeforePathCreatedEvent = true;
            });
            canvas.on('path:created', function (opt) {
              firePathCreatedEvent = true;
              poly = opt.path;
            });
            const pointer = canvas.getPointer({ clientX: 10, clientY: 10 });
            const pointer2 = canvas.getPointer({ clientX: 15, clientY: 15 });
            const pointer3 = canvas.getPointer({ clientX: 20, clientY: 25 });
            brush.onMouseDown(pointer, { e });
            brush.onMouseMove(pointer3, { e });
            brush.onMouseUp({ e, pointer: pointer2 });
            brush.onMouseMove(pointer2, { e });
            brush.onDoubleClick(pointer3);
            assert.equal(fireBeforePathCreatedEvent, true, 'before:path:created event is fired');
            assert.equal(firePathCreatedEvent, true, 'path:created event is fired');
            assert.ok(poly instanceof builder, `should create poly of type ${builder.name}`);
            assert.deepEqual(poly.points, [pointer, pointer2, pointer3], 'should set points');
            assert.deepEqual(
              poly.translateToOriginPoint(poly.getCenterPoint(), 'left', 'top'),
              new fabric.Point(10, 10),
              'should preserve position from mousedown');
          });
        });
      });
    });
  });

