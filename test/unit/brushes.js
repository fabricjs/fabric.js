(function() {
  var canvas = new fabric.Canvas();
  QUnit.module('fabric.BaseBrush', {
    afterEach: function() {
      canvas.cancelRequestedRender();
    }
  });
  QUnit.test('fabric brush constructor', function(assert) {
    assert.ok(fabric.BaseBrush);

    var brush = new fabric.BaseBrush();

    assert.ok(brush instanceof fabric.BaseBrush, 'should inherit from fabric.BaseBrush');
    assert.equal(brush.color, 'rgb(0, 0, 0)', 'default color is black');
    assert.equal(brush.width, 1, 'default width is 1');
    assert.ok(typeof brush.setShadow === 'function', 'setShadow is a method');
  });
  QUnit.test('fabric pencil brush constructor', function(assert) {
    assert.ok(fabric.PencilBrush);
    var brush = new fabric.PencilBrush(canvas);
    assert.equal(brush.canvas, canvas, 'assigns canvas');
    assert.deepEqual(brush._points, [], 'points is an empty array');
  });
  QUnit.test('fabric pencil brush draw point', function(assert) {
    var brush = new fabric.PencilBrush(canvas);
    var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
    brush.onMouseDown(pointer);
    var pathData = brush.convertPointsToSVGPath(brush._points).join('');
    assert.equal(pathData, 'M 9.999 9.999 L 10.001 10.001', 'path data create a small line that looks like a point');
  });
  QUnit.test('fabric pencil brush multiple points', function(assert) {
    var brush = new fabric.PencilBrush(canvas);
    var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
    brush.onMouseDown(pointer);
    brush.onMouseMove(pointer);
    brush.onMouseMove(pointer);
    brush.onMouseMove(pointer);
    brush.onMouseMove(pointer);
    var pathData = brush.convertPointsToSVGPath(brush._points).join('');
    assert.equal(pathData, 'M 9.999 9.999 L 10.001 10.001', 'path data create a small line that looks like a point');
    assert.equal(brush._points.length, 2, 'concident points are discarded');
  });
  QUnit.test('fabric pencil brush multiple points not discarded', function(assert) {
    var brush = new fabric.PencilBrush(canvas);
    var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
    var pointer2 = canvas.getPointer({ clientX: 15, clientY: 15});
    var pointer3 = canvas.getPointer({ clientX: 20, clientY: 20});
    brush.onMouseDown(pointer);
    brush.onMouseMove(pointer2);
    brush.onMouseMove(pointer3);
    brush.onMouseMove(pointer2);
    brush.onMouseMove(pointer3);
    var pathData = brush.convertPointsToSVGPath(brush._points).join('');
    assert.equal(pathData, 'M 9.999 9.999 Q 10 10 12.5 12.5 Q 15 15 17.5 17.5 Q 20 20 17.5 17.5 Q 15 15 17.5 17.5 L 20.001 20.001', 'path data create a complex path');
    assert.equal(brush._points.length, 6, 'concident points are discarded');
  });
  QUnit.test('fabric pencil brush multiple points not discarded', function(assert) {
    var fired = false;
    var added = null;
    canvas.on('path:created', function(opt) {
      fired = true;
      added = opt.path;
    });
    var brush = new fabric.PencilBrush(canvas);
    var pointer = canvas.getPointer({ clientX: 10, clientY: 10});
    var pointer2 = canvas.getPointer({ clientX: 15, clientY: 15});
    var pointer3 = canvas.getPointer({ clientX: 20, clientY: 20});
    brush.onMouseDown(pointer);
    brush.onMouseMove(pointer2);
    brush.onMouseMove(pointer3);
    brush.onMouseMove(pointer2);
    brush.onMouseMove(pointer3);
    brush.onMouseUp(pointer3);
    assert.equal(fired, true, 'event is fired');
    assert.ok(added instanceof fabric.Path, 'a path is added');
    assert.ok(added.path.length, 6, 'path has 6 steps');
    canvas.off();
  });
})();
