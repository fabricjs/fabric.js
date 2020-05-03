(function(){
  QUnit.module('fabric.controlHandlers', function(hooks) {
    var eventData, transform;
    var canvas = new fabric.Canvas(null);
    hooks.beforeEach(function() {
      var target = new fabric.Rect({ width: 100, height: 100 });
      canvas.add(target);
      eventData = {
      };
      transform = {
        originX: 'left',
        orginY: 'top',
        target: target,
        corner: 'mr',
        signX: 1,
        signY: 1,
      };
    });
    hooks.afterEach(function() {
      canvas.clear();
    });
    QUnit.test('changeWidth changes the width', function(assert) {
      assert.equal(transform.target.width, 100);
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(transform.target.width, 199);
    });
    QUnit.test('changeWidth changes the width with big strokeWidth', function(assert) {
      transform.target.strokeWidth = 15;
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(transform.target.width, 185);
    });
    QUnit.test('changeWidth changes the width with big strokeWidth and strokeUniform', function(assert) {
      transform.target.strokeWidth = 15;
      transform.target.strokeUniform = true;
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(transform.target.width, 185);
    });
    QUnit.test('changeWidth changes the width with big strokeWidth and strokeUniform + scaling', function(assert) {
      transform.target.strokeWidth = 15;
      transform.target.strokeUniform = true;
      transform.target.scaleX = 3;
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(Math.floor(transform.target.width), 61);
    });
    QUnit.test('changeWidth changes the width with big strokeWidth + scaling', function(assert) {
      transform.target.strokeWidth = 15;
      transform.target.scaleX = 3;
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(Math.floor(transform.target.width), 51);
    });
    QUnit.test('scalingXOrSkewingY changes scaleX', function(assert) {
      transform.target.scaleX = 1;
      transform.target.strokeWidth = 0;
      fabric.controlHandlers.scalingXOrSkewingY(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.scaleX), 2);
    });
    QUnit.test('scalingXOrSkewingY changes scaleX to flip', function(assert) {
      transform.target.scaleX = 1;
      transform.target.strokeWidth = 0;
      var returned = fabric.controlHandlers.scalingXOrSkewingY(eventData, transform, -50, 300);
      assert.equal(transform.target.scaleX, 0.5);
      assert.equal(transform.target.flipX, true, 'the object flipped X');
      assert.equal(returned, true, 'action was permitted');
    });
    QUnit.test('scalingXOrSkewingY blocks scaleX to flip', function(assert) {
      transform.target.scaleX = 1;
      transform.target.strokeWidth = 0;
      transform.target.lockScalingFlip = true;
      var returned = fabric.controlHandlers.scalingXOrSkewingY(eventData, transform, -50, 300);
      assert.equal(transform.target.scaleX, 1);
      assert.equal(transform.target.flipX, false, 'the object did not flip X');
      assert.equal(returned, false, 'action was not permitted X');
    });
    QUnit.test('scalingYOrSkewingX changes scaleY', function(assert) {
      transform.target.scaleY = 1;
      transform.target.strokeWidth = 0;
      fabric.controlHandlers.scalingYOrSkewingX(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.scaleY), 3);
    });
    QUnit.test('scalingYOrSkewingX changes scaleY to flip', function(assert) {
      transform.target.scaleY = 1;
      transform.target.strokeWidth = 0;
      var returned = fabric.controlHandlers.scalingYOrSkewingX(eventData, transform, 200, -80);
      assert.equal(transform.target.scaleY, 0.8);
      assert.equal(transform.target.flipY, true, 'the object flipped Y');
      assert.equal(returned, true, 'action was permitted Y');
    });
    QUnit.test('scalingYOrSkewingX blocks scaleX to flip', function(assert) {
      transform.target.scaley = 1;
      transform.target.strokeWidth = 0;
      transform.target.lockScalingFlip = true;
      var returned = fabric.controlHandlers.scalingYOrSkewingX(eventData, transform, 200, -80);
      assert.equal(transform.target.scaleY, 1);
      assert.equal(transform.target.flipY, false, 'the object did not flip Y');
      assert.equal(returned, false, 'action was not permitted Y');
    });
    QUnit.test('scalingXOrSkewingY changes skewY if shift pressed', function(assert) {
      transform.target.scaleX = 1;
      transform.target.skewY = 0;
      transform.target.strokeWidth = 0;
      eventData.shiftKey = true;
      fabric.controlHandlers.scalingXOrSkewingY(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.skewY), 79);
      assert.equal(Math.round(transform.target.scaleX), 1);
    });
    QUnit.test('scalingYOrSkewingX changes skewX if shift pressed', function(assert) {
      transform.target.scaleY = 1;
      transform.target.skewX = 0;
      transform.target.strokeWidth = 0;
      eventData.shiftKey = true;
      fabric.controlHandlers.scalingYOrSkewingX(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.skewX), 72);
      assert.equal(Math.round(transform.target.scaleY), 1);
    });
    QUnit.test('scalingXOrSkewingY will fire events on canvas and target', function(assert) {
      var done = assert.async();
      transform.target.scaleX = 1;
      transform.target.canvas.on('object:scaling', function(options) {
        assert.equal(options.target, transform.target);
      });
      transform.target.on('scaling', function(options) {
        assert.deepEqual(options, {
          e: eventData,
          transform: transform,
          pointer: {
            x: 200,
            y: 300,
          },
        });
        done();
      });
      fabric.controlHandlers.scalingXOrSkewingY(eventData, transform, 200, 300);
    });
  });
})();
