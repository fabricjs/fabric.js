(function() {
  QUnit.module('fabric.util.animate', {
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
    fabric.util.animateColor('red', 'blue', 16, {
      onComplete: function(val, changePerc, timePerc) {
        // animate color need some fixing
        assert.equal(val, 'rgba(0,0,255,1)', 'color is blue');
        assert.equal(changePerc, 1, 'change percentage is 100%');
        assert.equal(timePerc, 1, 'time percentage is 100%');
        done();
      },
      onChange: testing,
    });
  });

  // QUnit.test('fabric.util.animate', function(assert) {
  //   var done = assert.async();
  //   function testing(val) {
  //     assert.notEqual(val, 'rgba(0,0,255,1)', 'color is not blue');
  //     assert.ok(typeof val === 'String');
  //   }
  //   assert.ok(typeof fabric.util.animate === 'function', 'fabric.util.animate is a function');
  //   fabric.util.animate('red', 'blue', 16, {
  //     onComplete: function() {
  //       // animate color need some fixing
  //       // assert.equal(val, 'rgba(0,0,255,1)', 'color is blue')
  //       done();
  //     },
  //     onChange: testing,
  //   });
  // });

  QUnit.test('animation context', function (assert) {
    var done = assert.async();
    var options = { foo: 'bar' };
    fabric.util.animate(options);
    assert.propEqual(options, { foo: 'bar' }, 'options were mutated');
    setTimeout(() => {
      assert.equal(fabric.runningAnimations.length, 0, 'animation should exist in registry');
      done();
    }, 1000);
  });

  QUnit.test('fabric.runningAnimations', function (assert) {
    var done = assert.async();
    assert.ok(fabric.runningAnimations instanceof Array);
    assert.ok(typeof fabric.runningAnimations.cancelAll === 'function');
    assert.ok(typeof fabric.runningAnimations.cancelByTarget === 'function');
    assert.ok(typeof fabric.runningAnimations.findAnimationIndex === 'function');
    assert.ok(typeof fabric.runningAnimations.findAnimation === 'function');
    assert.ok(typeof fabric.runningAnimations.findAnimationsByTarget === 'function');
    assert.equal(fabric.runningAnimations.length, 0, 'should have registered animation');
    var abort, target = { foo: 'bar' };
    var options = {
      target,
      onChange(currentValue, completionRate, durationRate) {
        var context = fabric.runningAnimations.findAnimation(abort);
        assert.equal(context.currentValue, currentValue, 'context.currentValue is wrong');
        assert.equal(context.completionRate, completionRate, 'context.completionRate is wrong');
        assert.equal(context.durationRate, durationRate, 'context.durationRate is wrong');
        assert.equal(fabric.runningAnimations.findAnimationIndex(abort), 0, 'animation should exist in registry');
      },
      onComplete() {
        setTimeout(() => {
          assert.equal(fabric.runningAnimations.length, 0, 'should have unregistered animation');
          done();
        }, 0);
      }
    };
    abort = fabric.util.animate(options);
    var context = fabric.runningAnimations.findAnimation(abort);
    assert.equal(fabric.runningAnimations.length, 1, 'should have registered animation');
    assert.equal(fabric.runningAnimations.findAnimationIndex(abort), 0, 'animation should exist in registry');
    assert.equal(context.cancel, abort, 'animation should exist in registry');
    assert.equal(context.currentValue, 0, 'context.currentValue is wrong');
    assert.equal(context.completionRate, 0, 'context.completionRate is wrong');
    assert.equal(context.durationRate, 0, 'context.durationRate is wrong');
    var byTarget = fabric.runningAnimations.findAnimationsByTarget(target);
    assert.equal(byTarget.length, 1, 'should have found registered animation by target');
    assert.deepEqual(byTarget[0], context, 'should have found registered animation by target');
    delete byTarget[0].target;
    assert.equal(fabric.runningAnimations.findAnimationsByTarget(target), 0, 'should not have found registered animation by target');
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
        assert.equal(fabric.runningAnimations.findAnimationIndex(abort), 0, 'animation should exist in registry');
        return _abort;
      }
    };
    var abort = fabric.util.animate(options);
    assert.equal(fabric.runningAnimations.length, 1, 'should have registered animation');
    assert.equal(fabric.runningAnimations.findAnimationIndex(abort), 0, 'animation should exist in registry');
    assert.equal(fabric.runningAnimations.findAnimation(abort).cancel, abort, 'animation should exist in registry');
  });

  QUnit.test('fabric.runningAnimations with imperative abort', function (assert) {
    var options = { foo: 'bar' };
    var abort = fabric.util.animate(options);
    assert.equal(fabric.runningAnimations.length, 1, 'should have registered animation');
    assert.equal(fabric.runningAnimations.findAnimationIndex(abort), 0, 'animation should exist in registry');
    assert.equal(fabric.runningAnimations.findAnimation(abort).cancel, abort, 'animation should exist in registry');
    var context = abort();
    assert.equal(fabric.runningAnimations.length, 0, 'should have unregistered animation');
    assert.equal(context.foo, 'bar', 'should return animation context');
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
    assert.ok(typeof fabric.runningAnimations.findAnimationIndex === 'function');
    assert.ok(typeof fabric.runningAnimations.findAnimation === 'function');
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
    fabric.util.animate(opt2);
    assert.equal(fabric.runningAnimations.length, 4, 'should have registered animations');
    var cancelledAnimations = fabric.runningAnimations.cancelByTarget();
    assert.equal(cancelledAnimations.length, 0, 'should return empty array');
    assert.equal(fabric.runningAnimations.length, 4, 'should have registered animations');
    cancelledAnimations = fabric.runningAnimations.cancelByTarget('pip');
    assert.equal(cancelledAnimations.length, 3, 'should return cancelled animations');
    assert.equal(fabric.runningAnimations.length, 1, 'should have left 1 registered animation');
    assert.equal(fabric.runningAnimations[0].bar, opt2.bar, 'should have left 1 registered animation');
    setTimeout(() => {
      done();
    }, 1000);
  });

  QUnit.test('animate', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    assert.ok(typeof object.animate === 'function');

    object.animate('left', 40);
    assert.ok(true, 'animate without options does not crash');
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

    object.animate('left', '+=40');
    assert.ok(true, 'animate without options does not crash');

    setTimeout(function() {

      assert.equal(Math.round(object.left), 60, 'left has been increased by 40');
      done();
    }, 1000);
  });

  QUnit.test('animate with keypath', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43, shadow: { offsetX: 20 } });

    object.animate('shadow.offsetX', 100);
    assert.ok(true, 'animate without options does not crash');

    setTimeout(function() {
      assert.equal(Math.round(object.shadow.offsetX), 100, 'property has been animated');
      done();
    }, 1000);
  });

  QUnit.test('animate with color', function(assert) {
    var done = assert.async(), properties = fabric.Object.prototype.colorProperties,
        object = new fabric.Object();

    properties.forEach(function (prop, index) {
      object.set(prop, 'red');
      object.animate(prop, 'blue');
      assert.ok(true, 'animate without options does not crash');
      assert.equal(fabric.runningAnimations.length, index + 1, 'should have 1 registered animation');
      assert.equal(fabric.runningAnimations.findAnimationsByTarget(object).length, index + 1, 'animation.target should be set');

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

    object.animate('left', '-=40');
    assert.ok(true, 'animate without options does not crash');

    setTimeout(function() {

      assert.equal(Math.round(object.left), -20, 'left has been decreased by 40');
      done();
    }, 1000);
  });

  QUnit.test('animate with object', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    assert.ok(typeof object.animate === 'function');

    object.animate({ left: 40});
    assert.ok(true, 'animate without options does not crash');
    assert.equal(fabric.runningAnimations.length, 1, 'should have 1 registered animation');
    assert.equal(fabric.runningAnimations.findAnimationsByTarget(object).length, 1, 'animation.target should be set');

    setTimeout(function() {
      assert.equal(40, Math.round(object.left));
      done();
    }, 1000);
  });

  QUnit.test('animate multiple properties', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 123, top: 124 });
    object.animate({ left: 223, top: 224 });
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
      assert.equal(completeInvocations, 1);

      done();

    }, 1000);
  });

  QUnit.test('animate with list of values', function(assert) {
    var done = assert.async();

    fabric.util.animate({
      startValue: [1, 2, 3],
      endValue: [2, 4, 6],
      byValue: [1, 2, 3],
      duration: 96,
      onChange: function(currentValue) {
        assert.equal(fabric.runningAnimations.length, 1, 'runningAnimations should not be empty');
        assert.deepEqual(fabric.runningAnimations[0]['currentValue'], currentValue)
        assert.equal(currentValue.length, 3);
        currentValue.forEach(function(v) {
          assert.ok(v > 0, 'confirm values are not invalid numbers');
        })
        // Make sure mutations are not kept
        assert.ok(currentValue[0] <= 2, 'mutating callback values must not persist');
        currentValue[0] = 200;
      },
      onComplete: function(endValue) {
        assert.equal(endValue.length, 3);
        assert.deepEqual(endValue, [2, 4, 6]);
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

    var context;
    var abort = object._animate('left', 223, {
      abort: function () {
        context = this;
        return false;
      }
    });

    assert.ok(typeof abort === 'function');
    abort();

    setTimeout(function () {
      assert.equal(123, Math.round(object.get('left')));
      assert.equal(context, undefined, 'declarative abort should not be called after imperative abort was called');
      done();
    }, 100);
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
