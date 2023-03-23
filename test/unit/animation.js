(function () {

  const findAnimationsByTarget = target => fabric.runningAnimations.filter(({ target: t }) => target === t);

  QUnit.module('animate', {
    afterEach: function (assert) {
      assert.equal(fabric.runningAnimations.length, 0, 'runningAnimations should be empty at the end of a test');
      fabric.runningAnimations.cancelAll();
    }
  });

  QUnit.test('animateColor', function(assert) {
    var done = assert.async();
    function testing(val, complete) {
      if (complete !== 1) {
        assert.notEqual(val, 'rgba(0,0,255,1)', 'color is not blue');
      }
      else {
        assert.equal(val, 'rgba(0,0,255,1)', 'color is blue');
      }
      assert.ok(typeof val === 'string', 'expected type is String');
    }
    assert.ok(typeof fabric.util.animateColor === 'function', 'animateColor is a function');
    fabric.util.animateColor({
      startValue: 'red',
      endValue: 'blue',
      duration: 16,
      onComplete: function (val, changePerc, timePerc) {
        assert.equal(val, 'rgba(0,0,255,1)', 'color is blue');
        assert.equal(changePerc, 1, 'change percentage is 100%');
        assert.equal(timePerc, 1, 'time percentage is 100%');
        done();
      },
      onChange: testing,
    });
  });

  QUnit.test('animateColor change percentage is calculated from a changed value', function (assert) {
    const done = assert.async();
    let called = false;
    fabric.util.animateColor({
      startValue: 'red',
      endValue: 'blue',
      duration: 96,
      onChange: function (val, changePerc) {
        called && assert.ok(changePerc !== 0, 'change percentage');
        called = true;
      },
      onComplete: function (val, changePerc, timePerc) {
        assert.equal(val, 'rgba(0,0,255,1)', 'color is blue');
        assert.equal(changePerc, 1, 'change percentage is 100%');
        assert.equal(timePerc, 1, 'time percentage is 100%');
        done();
      }
    });
  });

  QUnit.test('animateColor with opacity', function (assert) {
    var done = assert.async();
    fabric.util.animateColor({
      startValue: 'rgba(255, 0, 0, 0.9)',
      endValue: 'rgba(0, 0, 255, 0.7)',
      duration: 16,
      onComplete: function (val, changePerc, timePerc) {
        assert.equal(val, 'rgba(0,0,255,0.7)', 'color is animated on all 4 values');
        assert.equal(changePerc, 1, 'change percentage is 100%');
        assert.equal(timePerc, 1, 'time percentage is 100%');
        done();
      }
    });
  });

  QUnit.test('animateColor, opacity out of bounds value are ignored', function (assert) {
    var done = assert.async();
    fabric.util.animateColor({
      startValue: 'red',
      endValue: [255, 255, 255, 3],
      duration: 16,
      onChange: val => {
        assert.equal(new fabric.Color(val).getAlpha(), 1, 'alpha diff should be ignored')
      },
      onComplete: function (val, changePerc, timePerc) {
        assert.equal(val, 'rgba(255,255,255,1)', 'color is normalized to max values');
        assert.equal(changePerc, 1, 'change percentage is 100%');
        assert.equal(timePerc, 1, 'time percentage is 100%');
        done();
      }
    });
  });

  QUnit.test('animateColor opacity only', function (assert) {
    var done = assert.async();
    let called = false;
    fabric.util.animateColor({
      startValue: 'rgba(255, 0, 0, 0.9)',
      endValue: 'rgba(255, 0, 0, 0.7)',
      duration: 96,
      onChange: function (val, changePerc) {
        const alpha = new fabric.Color(val).getAlpha();
        assert.equal(changePerc, (0.9 - alpha) / (0.9 - 0.7), 'valueProgress should match');
        called = true;
      },
      onComplete: function (val, changePerc, timePerc) {
        assert.equal(val, 'rgba(255,0,0,0.7)', 'color is animated on all 4 values');
        assert.equal(changePerc, 1, 'change percentage is 100%');
        assert.equal(timePerc, 1, 'time percentage is 100%');
        assert.ok(called);
        done();
      }
    });
  });

  QUnit.test('endValue', function (assert) {
    var done = assert.async();
    fabric.util.animate({
      startValue: 2,
      endValue: 5,
      duration: 16,
      onComplete: function (val, changePerc, timePerc) {
        assert.equal(val, 5, 'endValue is respected');
        assert.equal(changePerc, 1, 'change percentage is 100%');
        assert.equal(timePerc, 1, 'time percentage is 100%');
        done();
      }
    });
  });

  QUnit.test('animation context', function (assert) {
    var done = assert.async();
    var options = { foo: 'bar' };
    const context = fabric.util.animate(options);
    assert.equal(context.state, 'pending', 'state');
    assert.ok(typeof context.abort === 'function', 'context');
    assert.equal(context.duration, 500, 'defaults');
    assert.propEqual(options, { foo: 'bar' }, 'options were mutated');
    setTimeout(function () {
      assert.equal(context.state, 'completed', 'state');
      assert.equal(fabric.runningAnimations.length, 0, 'animation should not exist in registry');
      done();
    }, 1000);
  });

  QUnit.test('fabric.runningAnimations', function (assert) {
    var done = assert.async();
    assert.ok(fabric.runningAnimations instanceof Array);
    assert.ok(typeof fabric.runningAnimations.cancelAll === 'function');
    assert.ok(typeof fabric.runningAnimations.cancelByTarget === 'function');
    assert.ok(typeof fabric.runningAnimations.cancelByCanvas === 'function');
    assert.equal(fabric.runningAnimations.length, 0, 'should have registered animation');
    var context, target = { foo: 'bar' };
    var options = {
      target,
      onChange() {
        assert.equal(context.state, 'running', 'state');
        assert.equal(fabric.runningAnimations.indexOf(context), 0, 'animation should exist in registry');
      },
      onComplete() {
        setTimeout(() => {
          assert.equal(context.state, 'completed', 'state');
          assert.equal(fabric.runningAnimations.length, 0, 'should have unregistered animation');
          done();
        }, 0);
      }
    };
    context = fabric.util.animate(options);
    assert.equal(fabric.runningAnimations.length, 1, 'should have registered animation');
    assert.equal(fabric.runningAnimations.indexOf(context), 0, 'animation should exist in registry');
    var byTarget = findAnimationsByTarget(target);
    assert.equal(byTarget.length, 1, 'should have found registered animation by target');
    assert.deepEqual(byTarget[0], context, 'should have found registered animation by target');
    delete byTarget[0].target;
    assert.equal(findAnimationsByTarget(target), 0, 'should not have found registered animation by target');
  });

  QUnit.test('fabric.runningAnimations with abort', function (assert) {
    var done = assert.async();
    var _abort = false;
    var options = {
      onStart() {
        setTimeout(() => {
          _abort = true;
        }, 100);
      },
      abort() {
        if (_abort) {
          setTimeout(() => {
            assert.equal(fabric.runningAnimations.length, 0, 'should have unregistered animation');
            done();
          }, 0);
        }
        assert.equal(fabric.runningAnimations.indexOf(context), 0, 'animation should exist in registry');
        return _abort;
      }
    };
    var context = fabric.util.animate(options);
    assert.equal(fabric.runningAnimations.length, 1, 'should have registered animation');
    assert.equal(fabric.runningAnimations.indexOf(context), 0, 'animation should exist in registry');
  });

  QUnit.test('fabric.runningAnimations with imperative abort', function (assert) {
    var options = { foo: 'bar' };
    var context = fabric.util.animate(options);
    assert.equal(context.state, 'pending', 'state');
    assert.equal(fabric.runningAnimations.length, 1, 'should have registered animation');
    assert.equal(fabric.runningAnimations.indexOf(context), 0, 'animation should exist in registry');
    context.abort();
    assert.equal(context.state, 'aborted', 'state');
    assert.equal(fabric.runningAnimations.length, 0, 'should have unregistered animation');
  });

  QUnit.test('fabric.runningAnimations cancelAll', function (assert) {
    var options = { foo: 'bar' };
    fabric.util.animate(options);
    fabric.util.animate(options);
    fabric.util.animate(options);
    fabric.util.animate(options);
    assert.equal(fabric.runningAnimations.length, 4, 'should have registered animations');
    var cancelledAnimations = fabric.runningAnimations.cancelAll();
    assert.equal(cancelledAnimations.length, 4, 'should return cancelled animations');
    assert.equal(fabric.runningAnimations.length, 0, 'should have registered animations');
    //  make sure splice didn't destroy instance
    assert.ok(fabric.runningAnimations instanceof Array);
    assert.ok(typeof fabric.runningAnimations.cancelAll === 'function');
  });

  QUnit.test('fabric.runningAnimations cancelByCanvas', function (assert) {
    var done = assert.async();
    var canvas = { pip: 'py' };
    fabric.util.animate({ foo: 'bar', target: 'pip' });
    fabric.util.animate({ foo: 'bar', target: { canvas: 'pip' } });
    fabric.util.animate({ foo: 'bar' });
    fabric.util.animate({ target: { canvas } });
    assert.equal(fabric.runningAnimations.length, 4, 'should have registered animations');
    var cancelledAnimations = fabric.runningAnimations.cancelByCanvas();
    assert.equal(cancelledAnimations.length, 0, 'should return empty array');
    assert.equal(fabric.runningAnimations.length, 4, 'should have registered animations');
    cancelledAnimations = fabric.runningAnimations.cancelByCanvas(canvas);
    assert.equal(cancelledAnimations.length, 1, 'should return cancelled animations');
    assert.equal(cancelledAnimations[0].target.canvas, canvas, 'should return cancelled animations by canvas');
    assert.equal(fabric.runningAnimations.length, 3, 'should have left registered animation');
    setTimeout(() => {
      done();
    }, 1000);
  });

  QUnit.test('fabric.runningAnimations cancelByTarget', function (assert) {
    var done = assert.async();
    var options = { foo: 'bar', target: 'pip' }, opt2 = { bar: 'baz' };
    fabric.util.animate(options);
    fabric.util.animate(options);
    fabric.util.animate(options);
    const baz = fabric.util.animate(opt2);
    assert.equal(fabric.runningAnimations.length, 4, 'should have registered animations');
    var cancelledAnimations = fabric.runningAnimations.cancelByTarget();
    assert.equal(cancelledAnimations.length, 0, 'should return empty array');
    assert.equal(fabric.runningAnimations.length, 4, 'should have registered animations');
    cancelledAnimations = fabric.runningAnimations.cancelByTarget('pip');
    assert.equal(cancelledAnimations.length, 3, 'should return cancelled animations');
    assert.equal(fabric.runningAnimations.length, 1, 'should have left 1 registered animation');
    assert.strictEqual(fabric.runningAnimations[0], baz, 'should have left 1 registered animation');
    setTimeout(() => {
      done();
    }, 1000);
  });

  QUnit.test('animate', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    assert.ok(typeof object.animate === 'function');

    const context = object.animate({ left: 40 });
    assert.deepEqual(Object.keys(context), ['left'], 'should return a map of animation classes');
    assert.equal(context.left.constructor.name, 'ValueAnimation', 'should be instance of ValueAnimation');
    assert.equal(fabric.runningAnimations.length, 1, 'should have 1 registered animation');
    assert.equal(fabric.runningAnimations[0].target, object, 'animation.target should be set');

    setTimeout(function() {

      assert.equal(40, Math.round(object.left), 'left has been animated to 40');
      done();

    }, 1000);
  });

  QUnit.test('animate with increment', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    object.animate({ left: object.left + 40 });
    assert.ok(true, 'animate without options does not crash');

    setTimeout(function() {

      assert.equal(Math.round(object.left), 60, 'left has been increased by 40');
      done();
    }, 1000);
  });

  QUnit.test('animate with keypath', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43, shadow: { offsetX: 20 } });

    object.animate({ 'shadow.offsetX': 100 });
    assert.ok(true, 'animate without options does not crash');

    setTimeout(function() {
      assert.equal(Math.round(object.shadow.offsetX), 100, 'property has been animated');
      done();
    }, 1000);
  });

  QUnit.test('animate with color', function(assert) {
    var done = assert.async(),
        object = new fabric.Object(),
        properties = fabric.Object.getDefaults().colorProperties;

    properties.forEach(function (prop, index) {
      object.set(prop, 'red');
      object.animate({ [prop]: 'blue' });
      assert.ok(true, 'animate without options does not crash');
      assert.equal(fabric.runningAnimations.length, index + 1, 'should have 1 registered animation');
      assert.equal(findAnimationsByTarget(object).length, index + 1, 'animation.target should be set');

      setTimeout(function () {
        assert.equal(object[prop], new fabric.Color('blue').toRgba(), 'property [' + prop + '] has been animated');
      }, 1000);
    });

    setTimeout(function () {
      done();
    }, 1000);
  });

  QUnit.test('animate with decrement', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    object.animate({ left: object.left - 40 });
    assert.ok(true, 'animate without options does not crash');

    setTimeout(function() {

      assert.equal(Math.round(object.left), -20, 'left has been decreased by 40');
      done();
    }, 1000);
  });

  QUnit.test('animate multiple properties', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 123, top: 124 });
    const context = object.animate({ left: 223, top: 224 });
    assert.deepEqual(Object.keys(context), ['left', 'top'], 'should return a map of animation classes');
    assert.equal(context.left.constructor.name, 'ValueAnimation', 'should be instance of ValueAnimation');
    assert.equal(context.top.constructor.name, 'ValueAnimation', 'should be instance of ValueAnimation');
    setTimeout(function() {
      assert.equal(223, Math.round(object.get('left')));
      assert.equal(224, Math.round(object.get('top')));
      done();
    }, 1000);
  });

  QUnit.test('animate multiple properties with callback', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 0, top: 0 });

    var changedInvocations = 0;
    var completeInvocations = 0;

    object.animate({ left: 1, top: 1 }, {
      duration: 1,
      onChange: function() {
        changedInvocations++;
      },
      onComplete: function() {
        completeInvocations++;
      }
    });

    setTimeout(function() {

      assert.equal(Math.round(object.get('left')), 1);
      assert.equal(Math.round(object.get('top')), 1);

      assert.ok(changedInvocations > 0);
      assert.equal(completeInvocations, 2, 'the callbacks get call for each animation');

      done();

    }, 1000);
  });

  QUnit.test('animate with list of values', function(assert) {
    var done = assert.async();
    var run = false;

    fabric.util.animate({
      startValue: [1, 2, 3],
      endValue: [2, 4, 6],
      duration: 96,
      onChange: function(currentValue, valueProgress) {
        assert.equal(fabric.runningAnimations.length, 1, 'runningAnimations should not be empty');
        assert.ok(Array.isArray(currentValue), 'should be array');
        assert.ok(Object.isFrozen(fabric.runningAnimations[0].value), 'should be frozen');
        assert.deepEqual(fabric.runningAnimations[0].value, currentValue);
        assert.equal(currentValue.length, 3);
        currentValue.forEach(function(v) {
          assert.ok(v > 0, 'confirm values are not invalid numbers');
        })
        assert.equal(valueProgress, currentValue[0] - 1, 'should match');
        // Make sure mutations are not kept
        assert.ok(currentValue[0] <= 2, 'mutating callback values must not persist');
        currentValue[0] = 200;
        run = true;
      },
      onComplete: function (endValue) {
        assert.ok(Object.isFrozen(endValue), 'should be frozen');
        assert.equal(endValue.length, 3);
        assert.deepEqual(endValue, [2, 4, 6]);
        assert.equal(run, true, 'something run');
        done();
      }
    })
  });

  QUnit.test('animate with abort', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 123, top: 124 });

    var context;
    object.animate({ left: 223, top: 224 }, {
      abort: function() {
        context = this;
        return true;
      }
    });

    setTimeout(function() {
      assert.equal(123, Math.round(object.get('left')));
      assert.equal(124, Math.round(object.get('top')));
      assert.equal(context, object, 'abort should be called in context of an object');
      done();
    }, 100);
  });

  QUnit.test('animate with imperative abort', function (assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 123, top: 124 });

    let called = 0;
    const context = object._animate('left', 223, {
      abort: function () {
        called++;
        return false;
      }
    });

    assert.ok(typeof context.abort === 'function');
    assert.equal(context.state, 'pending', 'state');
    context.abort();
    assert.equal(context.state, 'aborted', 'state');

    setTimeout(function () {
      assert.equal(Math.round(object.get('left')), 123);
      assert.equal(called, 0, 'declarative abort should be called once before imperative abort cancels the run');
      done();
    }, 100);
  });

  QUnit.test('animate with delay', function (assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 123, top: 124 });
    var t = new Date();
    const context = object._animate('left', 223, {
      onStart: function () {
        assert.equal(context.state, 'running', 'state');
        assert.gte(new Date() - t, 500, 'animation delay');
        return false;
      },
      onComplete: done,
      delay: 500
    });
    assert.equal(context.state, 'pending', 'state');
  });

  QUnit.test('animate easing easeInQuad', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInQuad === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInQuad
    });
  });

  QUnit.test('animate easing easeOutQuad', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutQuad === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutQuad
    });
  });

  QUnit.test('animate easing easeInOutQuad', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutQuad === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutQuad
    });
  });

  QUnit.test('animate easing easeInCubic', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInCubic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInCubic
    });
  });

  QUnit.test('animate easing easeOutCubic', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutCubic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutCubic
    });
  });

  QUnit.test('animate easing easeInOutCubic', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutCubic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutCubic
    });
  });

  QUnit.test('animate easing easeInQuart', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInQuart === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInQuart
    });
  });

  QUnit.test('animate easing easeOutQuart', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutQuart === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutQuart
    });
  });

  QUnit.test('animate easing easeInOutQuart', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutQuart === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutQuart
    });
  });

  QUnit.test('animate easing easeInQuint', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInQuint === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInQuint
    });
  });

  QUnit.test('animate easing easeOutQuint', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutQuint === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutQuint
    });
  });


  // easeInOutQuint: easeInOutQuint,
  QUnit.test('animate easing easeInOutQuint', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutQuint === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutQuint
    });
  });

  // easeInSine: easeInSine,
  QUnit.test('animate easing easeInSine', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInSine === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInSine
    });
  });

  // easeOutSine: easeOutSine,
  QUnit.test('animate easing easeOutSine', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutSine === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutSine
    });
  });

  // easeInOutSine: easeInOutSine,
  QUnit.test('animate easing easeInOutSine', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutSine === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutSine
    });
  });

  // easeInExpo: easeInExpo,
  QUnit.test('animate easing easeInExpo', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInExpo === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInExpo
    });
  });

  // easeOutExpo: easeOutExpo,
  QUnit.test('animate easing easeOutExpo', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutExpo === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutExpo
    });
  });

  // easeInOutExpo: easeInOutExpo,
  QUnit.test('animate easing easeInOutExpo', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutExpo === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutExpo
    });
  });

  // easeInCirc: easeInCirc,
  QUnit.test('animate easing easeInCirc', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInCirc === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInCirc
    });
  });

  // easeOutCirc: easeOutCirc,
  QUnit.test('animate easing easeOutCirc', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutCirc === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutCirc
    });
  });

  // easeInOutCirc: easeInOutCirc,
  QUnit.test('animate easing easeInOutCirc', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutCirc === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutCirc
    });
  });

  // easeInElastic: easeInElastic,
  QUnit.test('animate easing easeInElastic', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInElastic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInElastic
    });
  });

  // easeOutElastic: easeOutElastic,
  QUnit.test('animate easing easeOutElastic', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutElastic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutElastic
    });
  });

  // easeInOutElastic: easeInOutElastic,
  QUnit.test('animate easing easeInOutElastic', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutElastic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutElastic
    });
  });

  // easeInBack: easeInBack,
  QUnit.test('animate easing easeInBack', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInBack === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInBack
    });
  });

  // easeOutBack: easeOutBack,
  QUnit.test('animate easing easeOutBack', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutBack === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutBack
    });
  });

  // easeInOutBack: easeInOutBack,
  QUnit.test('animate easing easeInOutBack', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutBack === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutBack
    });
  });

  // easeInBounce: easeInBounce,
  QUnit.test('animate easing easeInBounce', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInBounce === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInBounce
    });
  });

  // easeOutBounce: easeOutBounce,
  QUnit.test('animate easing easeOutBounce', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeOutBounce === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutBounce
    });
  });

  // easeInOutBounce: easeInOutBounce
  QUnit.test('animate easing easeInOutBounce', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.ease.easeInOutBounce === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        assert.equal(Math.round(object.left), 100, 'animation ended correctly');
        done();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutBounce
    });
  });

})();
