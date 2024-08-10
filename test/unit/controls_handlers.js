(function(){
  QUnit.module('fabric.controlsUtils', function(hooks) {
    var eventData, transform;
    var canvas = new fabric.Canvas(null);
    hooks.beforeEach(function() {
      var target = new fabric.Rect({ width: 100, height: 100 });
      canvas.add(target);
      eventData = {};
      transform = prepareTransform(target, 'mr');
    });
    hooks.afterEach(function () {
      canvas.off();
      canvas.clear();
    });
    function prepareTransform(target, corner) {
      var origin = canvas._getOriginFromCorner(target, corner);
      return {
        target,
        corner,
        originX: origin.x,
        originY: origin.y,
        signX: 1,
        signY: 1,
      };
    }
    QUnit.test('scalingXOrSkewingY changes scaleX', function(assert) {
      transform.target.scaleX = 1;
      transform.target.strokeWidth = 0;
      fabric.controlsUtils.scalingXOrSkewingY(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.scaleX), 2);
    });
    QUnit.test('scalingXOrSkewingY changes scaleX to flip', function(assert) {
      transform.target.scaleX = 1;
      transform.target.strokeWidth = 0;
      var returned = fabric.controlsUtils.scalingXOrSkewingY(eventData, transform, -50, 300);
      assert.equal(transform.target.scaleX, 0.5);
      assert.equal(transform.target.flipX, true, 'the object flipped X');
      assert.equal(returned, true, 'action was permitted');
    });
    QUnit.test('scalingXOrSkewingY blocks scaleX to flip', function(assert) {
      transform.target.scaleX = 1;
      transform.target.strokeWidth = 0;
      transform.target.lockScalingFlip = true;
      var returned = fabric.controlsUtils.scalingXOrSkewingY(eventData, transform, -50, 300);
      assert.equal(transform.target.scaleX, 1);
      assert.equal(transform.target.flipX, false, 'the object did not flip X');
      assert.equal(returned, false, 'action was not permitted X');
    });
    QUnit.test('scalingYOrSkewingX changes scaleY', function(assert) {
      transform.target.scaleY = 1;
      transform.target.strokeWidth = 0;
      fabric.controlsUtils.scalingYOrSkewingX(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.scaleY), 3);
    });
    QUnit.test('scalingYOrSkewingX changes scaleY to flip', function(assert) {
      transform.target.scaleY = 1;
      transform.target.strokeWidth = 0;
      var returned = fabric.controlsUtils.scalingYOrSkewingX(eventData, transform, 200, -80);
      assert.equal(transform.target.scaleY, 0.8);
      assert.equal(transform.target.flipY, true, 'the object flipped Y');
      assert.equal(returned, true, 'action was permitted Y');
    });
    QUnit.test('scalingYOrSkewingX blocks scaleX to flip', function(assert) {
      transform.target.scaleY = 1;
      transform.target.strokeWidth = 0;
      transform.target.lockScalingFlip = true;
      var returned = fabric.controlsUtils.scalingYOrSkewingX(eventData, transform, 200, -80);
      assert.equal(transform.target.scaleY, 1);
      assert.equal(transform.target.flipY, false, 'the object did not flip Y');
      assert.equal(returned, false, 'action was not permitted Y');
    });
    QUnit.test('scalingXOrSkewingY changes skewY if shift pressed', function(assert) {
      transform.target.scaleX = 1;
      transform.target.skewY = 0;
      transform.target.strokeWidth = 0;
      transform.skewX = 0;
      transform.skewY = 0;
      eventData.shiftKey = true;
      fabric.controlsUtils.scalingXOrSkewingY(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.skewY), 81);
      assert.equal(Math.round(transform.target.scaleX), 1);
    });
    QUnit.test('scalingYOrSkewingX changes skewX if shift pressed', function(assert) {
      transform.target.scaleY = 1;
      transform.target.skewX = 0;
      transform.target.strokeWidth = 0;
      transform.skewX = 0;
      transform.skewY = 0;
      eventData.shiftKey = true;
      fabric.controlsUtils.scalingYOrSkewingX(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.skewX), 76);
      assert.equal(Math.round(transform.target.scaleY), 1);
    });
    QUnit.test('skewing Y with existing skewing', function (assert) {
      transform.target.scaleX = 1;
      transform.target.skewY = 30;
      transform.target.skewY = 45;
      transform.target.strokeWidth = 0;
      transform.skewX = 45;
      transform.skewY = 15;
      eventData.shiftKey = true;
      fabric.controlsUtils.scalingXOrSkewingY(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.skewY), 81);
      assert.equal(Math.round(transform.target.scaleX), 1);
    });
    QUnit.test('skewing X with existing skewing', function(assert) {
      transform.target.scaleY = 1;
      transform.target.skewX = 30;
      transform.target.skewY = 45;
      transform.target.strokeWidth = 0;
      transform.skewX = 45;
      transform.skewY = 15;
      eventData.shiftKey = true;
      fabric.controlsUtils.scalingYOrSkewingX(eventData, transform, 200, 300);
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
          pointer: new fabric.Point(
            200,
            300,
          ),
        });
        done();
      });
      fabric.controlsUtils.scalingXOrSkewingY(eventData, transform, 200, 300);
    });
    QUnit.test('wrapWithFireEvent dont trigger event when actionHandler doesnt change anything', function(assert) {
      transform.target.canvas.on('object:scaling', function() {
        assert.ok(false);
      });
      var eventData = {some: 'data'}, x = 15, y = 25;
      var actionHandler = function (eventDataIn, transformIn, xIn, yIn) {
        assert.equal(eventDataIn, eventData);
        assert.equal(transformIn, transform);
        assert.equal(xIn, x);
        assert.equal(yIn, y);
        return false;
      };
      var wrapped = fabric.controlsUtils.wrapWithFireEvent(
        'scaling',
        fabric.controlsUtils.wrapWithFixedAnchor(actionHandler)
      );
      wrapped(eventData, transform, x, y);
    });
    ['ml', 'mt', 'mr', 'mb'].forEach(controlKey => {
      const axis = {
        ml: 'x',
        mt: 'y',
        mr: 'x',
        mb: 'y',
      }[controlKey]
      const AXIS = axis.toUpperCase();
      const signKey = `sign${AXIS}`;
      const scaleKey = `scale${AXIS}`;
      const flipKey = `flip${AXIS}`;
      const isX = axis === 'x';
      QUnit.test(`scaling ${AXIS} from ${controlKey} keeps the same sign when scale = 0`, function (assert) {
        transform = prepareTransform(transform.target, controlKey);
        const size = transform.target._getTransformedDimensions()[axis];
        const factor = 0.5;
        const fn = fabric.controlsUtils[`scaling${AXIS}`];
        const exec = point => {
          const { target } = transform;
          const origin = target.translateToGivenOrigin(
            target.getRelativeCenterPoint(),
            'center',
            'center',
            transform.originX,
            transform.originY
          );
          const pointer = point.add(origin);
          fn(eventData, transform, pointer.x, pointer.y);
        };
        const deltaFromControl = new fabric.Point(
          Number(isX),
          Number(!isX)
        ).scalarMultiply(size * factor);
        exec(new fabric.Point());
        assert.equal(transform[signKey], 1, `${signKey} value after scaling`);
        assert.equal(transform.target[flipKey], false, `${flipKey} value after scaling`);
        assert.ok(transform.target[scaleKey] <= 0.001, `${scaleKey} value after scaling back to origin`);
        exec(deltaFromControl);
        assert.equal(transform[signKey], 1, `${signKey} value after scaling`);
        assert.equal(transform.target[flipKey], false, `${flipKey} value after scaling`);
        assert.equal(transform.target[scaleKey], factor, `${scaleKey} value after scaling`);
        exec(new fabric.Point());
        assert.equal(transform[signKey], 1, `${signKey} value after scaling`);
        assert.equal(transform.target[flipKey], false, `${flipKey} value after scaling`);
        assert.ok(transform.target[scaleKey] <= 0.001, `${scaleKey} value after scaling back to origin`);
        exec(deltaFromControl.scalarMultiply(-1));
        assert.equal(transform[signKey], -1, `${signKey} value after scaling`);
        assert.equal(transform.target[flipKey], true, `${flipKey} value after scaling`);
        assert.equal(transform.target[scaleKey], factor, `${scaleKey} value after scaling`);
        exec(new fabric.Point());
        assert.equal(transform[signKey], -1, `${signKey} value after scaling`);
        assert.equal(transform.target[flipKey], true, `${flipKey} value after scaling`);
        assert.ok(transform.target[scaleKey] <= 0.001, `${scaleKey} value after scaling back to origin`);
      });
    });
  });
})();
