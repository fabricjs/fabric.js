(function() {

  var canvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, width: 600, height: 600});

  function makeAsWith2Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 });

    return new fabric.ActiveSelection([rect1, rect2], {strokeWidth: 0});
  }

  function makeAsWith2ObjectsWithOpacity() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0, opacity: 0.5 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, opacity: 0.8 });

    return new fabric.ActiveSelection([rect1, rect2], {strokeWidth: 0});
  }

  function makeAsWith4Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 }),
        rect3 = new fabric.Rect({ top: 40, left: 0, width: 20, height: 40 }),
        rect4 = new fabric.Rect({ top: 75, left: 75, width: 40, height: 40 });

    return new fabric.ActiveSelection([rect1, rect2, rect3, rect4]);
  }

  QUnit.module('fabric.ActiveSelection', {
    afterEach: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
    }
  });

  QUnit.test('constructor', function(assert) {
    var group = makeAsWith2Objects();

    assert.ok(group);
    assert.ok(group instanceof fabric.ActiveSelection, 'should be instance of fabric.ActiveSelection');
  });

  QUnit.test('toString', function(assert) {
    var group = makeAsWith2Objects();
    assert.equal(group.toString(), '#<fabric.ActiveSelection: (2)>', 'should return proper representation');
  });

  QUnit.test('_renderControls', function(assert) {
    assert.ok(typeof fabric.ActiveSelection.prototype._renderControls === 'function');
  });

})();
