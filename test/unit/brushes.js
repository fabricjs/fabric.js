(function() {
  var canvas = new fabric.Canvas();
  var parsePath = fabric.util.parsePath;
  QUnit.module('fabric.BaseBrush', function(hooks) {
    hooks.afterEach(function() {
      canvas.cancelRequestedRender();
    });

    QUnit.test('fabric brush constructor', function(assert) {
      assert.ok(fabric.BaseBrush);

      var brush = new fabric.BaseBrush();

      assert.ok(brush instanceof fabric.BaseBrush, 'should inherit from fabric.BaseBrush');
      assert.equal(brush.color, 'rgb(0, 0, 0)', 'default color is black');
      assert.equal(brush.width, 1, 'default width is 1');
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
          brush.onMouseDown(pointer, { e: {} });
          var pathData = brush.convertPointsToSVGPath(brush._points);
          assert.deepEqual(pathData, parsePath('M 9.999 10 L 10.001 10'), 'path data create a small line that looks like a point');
        });
        QUnit.test('fabric pencil brush multiple points', function(assert) {
          var brush = new fabric.PencilBrush(canvas);
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
          brush.onMouseDown(pointer, { e: {} });
          brush.onMouseMove(pointer, { e: {} });
          brush.onMouseMove(pointer, { e: {} });
          brush.onMouseMove(pointer, { e: {} });
          brush.onMouseMove(pointer, { e: {} });
          var pathData = brush.convertPointsToSVGPath(brush._points);
          assert.deepEqual(pathData, parsePath('M 9.999 10 L 10.001 10'), 'path data create a small line that looks like a point');
          assert.equal(brush._points.length, 2, 'concident points are discarded');
        });
        QUnit.test('fabric pencil brush multiple points not discarded', function(assert) {
          var brush = new fabric.PencilBrush(canvas);
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
          var pointer2 = canvas.getPointer({ clientX: 15, clientY: 15});
          var pointer3 = canvas.getPointer({ clientX: 20, clientY: 20});
          brush.onMouseDown(pointer, { e: {} });
          brush.onMouseMove(pointer2, { e: {} });
          brush.onMouseMove(pointer3, { e: {} });
          brush.onMouseMove(pointer2, { e: {} });
          brush.onMouseMove(pointer3, { e: {} });
          var pathData = brush.convertPointsToSVGPath(brush._points);
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
          brush.onMouseDown(pointer, { e: {} });
          brush.onMouseMove(pointer2, { e: {} });
          brush.onMouseMove(pointer3, { e: {} });
          brush.onMouseMove(pointer4, { e: {} });
          brush.onMouseMove(pointer5, { e: {} });
          var pathData = brush.convertPointsToSVGPath(brush._points);
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
          brush.onMouseDown(pointer, { e: {} });
          brush.onMouseMove(pointer2, { e: {} });
          brush.onMouseMove(pointer3, { e: {} });
          brush.onMouseMove(pointer4, { e: {} });
          brush.onMouseMove(pointer5, { e: {} });
          var pathData = brush.convertPointsToSVGPath(brush._points);
          assert.deepEqual(
            pathData,
            parsePath('M 9.999 9.999 Q 10 10 12.5 55 Q 15 100 57.5 100 L 100.001 100'),
            'path data create a path that does not go beyond canvas'
          );
          assert.equal(brush._points.length, 4, '2 points have been discarded');
        });
        QUnit.test('fabric pencil brush multiple points not discarded', function(assert) {
          var fireBeforePathCreatedEvent = false;
          var firePathCreatedEvent = false;
          var added = null;
          canvas.on('before:path:created', function() {
            fireBeforePathCreatedEvent = true;
          });
          canvas.on('path:created', function(opt) {
            firePathCreatedEvent = true;
            added = opt.path;
          });
          var brush = new fabric.PencilBrush(canvas);
          var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
          var pointer2 = canvas.getPointer({ clientX: 15, clientY: 15});
          var pointer3 = canvas.getPointer({ clientX: 20, clientY: 20});
          brush.onMouseDown(pointer, { e: {} });
          brush.onMouseMove(pointer2, { e: {} });
          brush.onMouseMove(pointer3, { e: {} });
          brush.onMouseMove(pointer2, { e: {} });
          brush.onMouseMove(pointer3, { e: {} });
          brush.onMouseUp({ e: {} });
          assert.equal(fireBeforePathCreatedEvent, true, 'before:path:created event is fired');
          assert.equal(firePathCreatedEvent, true, 'path:created event is fired');
          assert.ok(added instanceof fabric.Path, 'a path is added');
          assert.ok(added.path.length, 6, 'path has 6 steps');
          canvas.off();
        });
      });
    });
  });
})();
