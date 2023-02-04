(function() {
  var canvas = new fabric.Canvas();
  var parsePath = fabric.util.parsePath;
  function fireBrushEvent(brush, type, pointer) {
    brush.fire(`mouse:${type}:before`, fabric.Event.init({
      e: {},
      pointer
    }));
  }
  QUnit.module('fabric.BaseBrush', function(hooks) {
    hooks.afterEach(function() {
      canvas.cancelRequestedRender();
    });

    QUnit.test('fabric brush constructor', function(assert) {
      assert.ok(fabric.BaseBrush);

      let setCursor;

      var brush = new fabric.SimpleBrush({
        setCursor(cursor) {
          setCursor = cursor;
        }
      });

      assert.ok(brush instanceof fabric.Observable, 'should inherit from fabric.Observable');
      assert.ok(brush instanceof fabric.BaseBrush, 'should inherit from fabric.BaseBrush');
      assert.ok(brush instanceof fabric.SimpleBrush, 'should inherit from fabric.SimpleBrush');
      assert.equal(brush.color, 'rgb(0, 0, 0)', 'default color is black');
      assert.equal(brush.width, 1, 'default width is 1');
      assert.equal(brush.cursor, 'crosshair', 'default cursor');
    });
    QUnit.test('start', function(assert) {
      let setCursor;
      const brush = new fabric.SimpleBrush({
        setCursor(cursor) {
          setCursor = cursor;
        }
      });
      assert.equal(brush.cursor, 'crosshair', 'default cursor');
      brush.cursor = 'testCursor';
      brush.start();
      assert.equal(setCursor, 'testCursor', 'should set canvas cursor');
    });
    QUnit.test('canvas event is fired on brush', function(assert) {
      const done = assert.async();
      const brush = new fabric.SimpleBrush(canvas);
      canvas.freeDrawingBrush = brush;
      let e;
      const fired = [];
      Promise.all([
        new Promise(resolve => {
          canvas.on('foo', ev => {
            fired.push({ canvas: ev });
            resolve();
          });
        }),
        new Promise(resolve => {
          brush.on('foo', ev => {
            fired.push({ brush: ev });
            resolve();
          });
        })
      ]).then(() => {
        assert.equal(fired[0].brush, e, 'same event ref, firing order is kept')
        assert.equal(fired[1].canvas, e, 'same event ref, firing order is kept')
        done();
      })
      e = canvas.fire('foo', { bar: 'baz' });
    });
    QUnit.test('fabric pencil brush constructor', function(assert) {
      assert.ok(fabric.PencilBrush);
      var brush = new fabric.PencilBrush(canvas);
      assert.equal(brush.canvas, canvas, 'assigns canvas');
      assert.deepEqual(brush._points, [], 'points is an empty array');
    });

	  QUnit.test('decimate points', function(assert) {
	    var brush = new fabric.PencilBrush(canvas);
	    var points = [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }];
	    var distance = 6;
	    var newPoints = brush.decimatePoints(points, distance);
	    assert.equal(newPoints[0], points[0], 'first point is always present');
	    assert.equal(newPoints[1], points[points.length-1], 'last point is always present');
	    assert.equal(newPoints.length, 2, 'All points removed except first and last');
	  });

    [true, false].forEach(function(val) {
      QUnit.module('fabric.BaseBrush with canvas.enableRetinaScaling = ' + val, function(hooks) {
        hooks.beforeEach(function() {
          canvas.enableRetinaScaling = val;
        });
        QUnit.test('fabric pencil brush draw point', function(assert) {
          var brush = new fabric.PencilBrush(canvas);
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
          fireBrushEvent(brush, 'down', pointer);
          var pathData = brush.getPathFromPoints(brush._points);
          assert.deepEqual(pathData, parsePath('M 9.999 10 L 10.001 10'), 'path data create a small line that looks like a point');
        });
        QUnit.test('fabric pencil brush multiple points', function(assert) {
          var brush = new fabric.PencilBrush(canvas);
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
          fireBrushEvent(brush, 'down', pointer);
          fireBrushEvent(brush, 'move', pointer);
          fireBrushEvent(brush, 'move', pointer);
          fireBrushEvent(brush, 'move', pointer);
          fireBrushEvent(brush, 'move', pointer);
          var pathData = brush.getPathFromPoints(brush._points);
          assert.deepEqual(pathData, parsePath('M 9.999 10 L 10.001 10'), 'path data create a small line that looks like a point');
          assert.equal(brush._points.length, 2, 'concident points are discarded');
        });
        QUnit.test('fabric pencil brush multiple points not discarded', function(assert) {
          var brush = new fabric.PencilBrush(canvas);
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
          var pointer2 = canvas.getPointer({ clientX: 15, clientY: 15});
          var pointer3 = canvas.getPointer({ clientX: 20, clientY: 20});
          fireBrushEvent(brush, 'down', pointer);
          fireBrushEvent(brush, 'move', pointer2);
          fireBrushEvent(brush, 'move', pointer3);
          fireBrushEvent(brush, 'move', pointer2);
          fireBrushEvent(brush, 'move', pointer3);
          var pathData = brush.getPathFromPoints(brush._points);
          assert.deepEqual(
            pathData,
            parsePath('M 9.999 9.999 Q 10 10 12.5 12.5 Q 15 15 17.5 17.5 Q 20 20 17.5 17.5 Q 15 15 17.5 17.5 L 20.001 20.001'),
            'path data create a complex path'
          );
          assert.equal(brush._points.length, 6, 'concident points are discarded');
        });
        QUnit.test('fabric pencil brush multiple points outside canvas', function(assert) {
          var brush = new fabric.PencilBrush(canvas);
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
          var pointer2 = canvas.getPointer({ clientX: 15, clientY: 100});
          var pointer3 = canvas.getPointer({ clientX: 20, clientY: 160});
          var pointer4 = canvas.getPointer({ clientX: 320, clientY: 100});
          var pointer5 = canvas.getPointer({ clientX: 100, clientY: 100});
          fireBrushEvent(brush, 'down', pointer);
          fireBrushEvent(brush, 'move', pointer2);
          fireBrushEvent(brush, 'move', pointer3);
          fireBrushEvent(brush, 'move', pointer4);
          fireBrushEvent(brush, 'move', pointer5);
          var pathData = brush.getPathFromPoints(brush._points);
          assert.deepEqual(
            pathData,
            parsePath('M 9.999 9.999 Q 10 10 12.5 55 Q 15 100 17.5 130 Q 20 160 170 130 Q 320 100 210 100 L 99.999 100'),
            'path data create a path that goes beyond canvas'
          );
          assert.equal(brush._points.length, 6, 'all points are available');
        });
        QUnit.test('fabric pencil brush multiple points outside canvas, limitedToCanvasSize true', function(assert) {
          var brush = new fabric.PencilBrush(canvas);
          brush.limitedToCanvasSize = true;
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
          var pointer2 = canvas.getPointer({ clientX: 15, clientY: 100});
          var pointer3 = canvas.getPointer({ clientX: 20, clientY: 160});
          var pointer4 = canvas.getPointer({ clientX: 320, clientY: 100});
          var pointer5 = canvas.getPointer({ clientX: 100, clientY: 100});
          fireBrushEvent(brush, 'down', pointer);
          fireBrushEvent(brush, 'move', pointer2);
          fireBrushEvent(brush, 'move', pointer3);
          fireBrushEvent(brush, 'move', pointer4);
          fireBrushEvent(brush, 'move', pointer5);
          var pathData = brush.getPathFromPoints(brush._points);
          assert.deepEqual(
            pathData,
            parsePath('M 9.999 9.999 Q 10 10 12.5 55 Q 15 100 57.5 100 L 100.001 100'),
            'path data create a path that does not go beyond canvas'
          );
          assert.equal(brush._points.length, 4, '2 points have been discarded');
        });
        QUnit.test('fabric pencil brush multiple points not discarded', function (assert) {
          assert.expect(2);
          canvas.on('interaction:completed', ({ result }) => {
              assert.ok(result instanceof fabric.Path, 'a path is added');
              assert.ok(result.path.length, 6, 'path has 6 steps');
              canvas.off();
            });
          var brush = new fabric.PencilBrush(canvas);
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
          var pointer2 = canvas.getPointer({ clientX: 15, clientY: 15});
          var pointer3 = canvas.getPointer({ clientX: 20, clientY: 20});
          fireBrushEvent(brush, 'down', pointer);
          fireBrushEvent(brush, 'move', pointer2);
          fireBrushEvent(brush, 'move', pointer3);
          fireBrushEvent(brush, 'move', pointer2);
          fireBrushEvent(brush, 'move', pointer3);
          fireBrushEvent(brush, 'up', pointer3);
        });
      });
    });
  });
})();
