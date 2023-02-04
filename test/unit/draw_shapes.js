  
  QUnit.module('Draw Shapes', function (hooks) {
    let canvas;
    function fireBrushEvent(brush, type, pointer, { suffix = ':before', e = {} } = {}) {
      brush.fire(`mouse:${type}${suffix}`, fabric.Event.init({
        e,
        pointer
      }));
    }
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

        async function runShapeBrushTest(brush, assert, e) {
          let fired = false;
          const result = await new Promise(resolve => {
            canvas.on('interaction:completed', ({ result }) => {
              fired = true;
              resolve(result);
            });
            var pointer = canvas.getPointer({ clientX: 10, clientY: 10 });
            var pointer2 = canvas.getPointer({ clientX: 15, clientY: 15 });
            var pointer3 = canvas.getPointer({ clientX: 20, clientY: 25 });
            fireBrushEvent(brush, 'down', pointer, { e });
            fireBrushEvent(brush, 'move', pointer2, { e });
            fireBrushEvent(brush, 'move', pointer3, { e });
            fireBrushEvent(brush, 'move', pointer2, { e });
            fireBrushEvent(brush, 'move', pointer3, { e });
            fireBrushEvent(brush, 'up', pointer3, { e });
          });
          assert.equal(fired, true, 'interaction:completed event should have fired');
          return result;
        }

        QUnit.test('Draw Shape', async function (assert) {
          const done = assert.async();
          const brush = new fabric.DrawShape(canvas);
          brush.width = 5;
          const shape = await runShapeBrushTest(brush, assert);
          assert.ok(shape instanceof fabric.Rect, 'a rect is drawn');
          assert.equal(shape.strokeWidth, 5, 'should set width');
          assert.equal(shape.width, 10, 'should set width');
          assert.equal(shape.height, 15, 'should set height');
          assert.deepEqual(
            shape.translateToOriginPoint(shape.getCenterPoint(), 'left', 'top'),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
          done();
        });

        QUnit.test('Draw Shape + symmetric', async function (assert) {
          const done = assert.async();
          const shape = await runShapeBrushTest(new fabric.DrawShape(canvas), assert, {
            shiftKey: true
          });
          assert.equal(Math.round(shape.width), 13, 'should set width to height value');
          assert.equal(Math.round(shape.width), 13, 'should set height');
          assert.deepEqual(
            shape.translateToOriginPoint(shape.getCenterPoint(), 'left', 'top'),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
          done();
        });

        QUnit.test('Draw Shape + centered', async function (assert) {
          const done = assert.async();
          const brush = new fabric.DrawShape(canvas);
          brush.centered = true;
          const shape = await runShapeBrushTest(brush, assert);
          assert.equal(shape.width, 10, 'should set width');
          assert.equal(shape.height, 15, 'should set height');
          assert.deepEqual(shape.getCenterPoint(), new fabric.Point(10, 10), 'should preserve position from mousedown');
          done();
        });

        QUnit.test('Draw Shape + symmetric + centered', async function (assert) {
          const done = assert.async();
          const brush = new fabric.DrawShape(canvas);
          brush.centered = true;
          const shape = await runShapeBrushTest(brush, assert, {
            shiftKey: true
          });
          assert.equal(Math.round(shape.width), 25, 'should set width');
          assert.equal(Math.round(shape.width), 25, 'should set height');
          assert.deepEqual(shape.getCenterPoint(), new fabric.Point(10, 10), 'should preserve position from mousedown');
          done();
        });

        QUnit.test('Draw Oval', async function (assert) {
          const done = assert.async();
          const shape = await runShapeBrushTest(new fabric.DrawOval(canvas), assert);
          assert.equal(shape.rx, 5, 'should set rx');
          assert.equal(shape.ry, 7.5, 'should set ry');
          assert.equal(shape.width, 10, 'should set width');
          assert.equal(shape.height, 15, 'should set height');
          assert.deepEqual(
            shape.translateToOriginPoint(shape.getCenterPoint(), 'left', 'top'),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
          done();
        });

        QUnit.test('Draw Oval + centered', async function (assert) {
          const done = assert.async();
          const brush = new fabric.DrawOval(canvas);
          brush.centered = true;
          const shape = await runShapeBrushTest(brush, assert);
          assert.equal(shape.rx, 10, 'should set rx');
          assert.equal(shape.ry, 15, 'should set ry');
          assert.equal(shape.width, 20, 'should set width');
          assert.equal(shape.height, 30, 'should set height');
          assert.deepEqual(
            shape.getCenterPoint(),
            new fabric.Point(10, 10),
            'should preserve position from mousedown');
          done();
        });

        QUnit.test('Draw Oval + symmetric', async function (assert) {
          const done = assert.async();
          const shape = await runShapeBrushTest(new fabric.DrawOval(canvas), assert, {
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
          done();
        });

        QUnit.test('Draw Oval + centered + symmetric', async function (assert) {
          const done = assert.async();
          const brush = new fabric.DrawOval(canvas);
          brush.centered = true;
          const shape = await runShapeBrushTest(brush, assert, {
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
          done();
        });

        [fabric.Polygon, fabric.Polyline].forEach(builder => {
          QUnit.test(`Draw ${builder.name}`, function (assert) {
            const done = assert.async();
            const brush = new fabric.DrawPoly(canvas);
            brush.builder = builder;
            assert.expect(3);
            canvas.on('interaction:completed', ({ result: poly }) => {
              assert.ok(poly instanceof builder, `should create poly of type ${builder.name}`);
              assert.deepEqual(poly.points, [pointer, pointer2, pointer3], 'should set points');
              assert.deepEqual(
                poly.translateToOriginPoint(poly.getCenterPoint(), 'left', 'top'),
                new fabric.Point(10, 10),
                'should preserve position from mousedown');
              done();
            });
            const pointer = canvas.getPointer({ clientX: 10, clientY: 10 });
            const pointer2 = canvas.getPointer({ clientX: 15, clientY: 15 });
            const pointer3 = canvas.getPointer({ clientX: 20, clientY: 25 });
            fireBrushEvent(brush, 'down', pointer);
            fireBrushEvent(brush, 'move', pointer3);
            fireBrushEvent(brush, 'up', pointer2);
            fireBrushEvent(brush, 'move', pointer2);
            fireBrushEvent(brush, 'dblclick', pointer3, { suffix: '' });
          });
        });
      });
    });
  });

