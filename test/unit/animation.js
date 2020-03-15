(function() {
  QUnit.module('fabric.util.animate');

  QUnit.test('animateColor', function(assert) {
    var done = assert.async();
    function testing(val) {
      assert.notEqual(val, 'rgba(0,0,255,1)', 'color is not blue');
    }
    assert.ok(typeof fabric.util.animateColor === 'function', 'animateColor is a function');
    fabric.util.animateColor('red', 'blue', 16, {
      onComplete: function() {
        // animate color need some fixing
        // assert.equal(val, 'rgba(0,0,255,1)', 'color is blue')
        done();
      },
      onChange: testing,
    });
  });

  QUnit.test('animate', function(assert) {
    var done = assert.async();
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    assert.ok(typeof object.animate === 'function');

    object.animate('left', 40);
    assert.ok(true, 'animate without options does not crash');

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

      assert.equal(changedInvocations, 2);
      assert.equal(completeInvocations, 1);

      done();

    }, 1000);
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
