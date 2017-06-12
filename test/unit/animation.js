(function() {
  QUnit.module('fabric.util.animate');

  asyncTest('animateColor', function() {
    function testing(val) {
      notEqual(val, 'rgba(0,0,255,1)', 'color is not blue');
    }
    ok(typeof fabric.util.animateColor === 'function', 'animateColor is a function');
    fabric.util.animateColor('red', 'blue', 16, {
      onComplete: function() {
        // animate color need some fixing
        // equal(val, 'rgba(0,0,255,1)', 'color is blue')
        start();
      },
      onChange: testing,
    });
  });

  asyncTest('animate', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    ok(typeof object.animate == 'function');

    object.animate('left', 40);
    ok(true, 'animate without options does not crash');

    setTimeout(function() {

      equal(40, Math.round(object.getLeft()), 'left has been animated to 40');
      start();

    }, 1000);
  });

  asyncTest('animate with increment', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    object.animate('left', '+=40');
    ok(true, 'animate without options does not crash');

    setTimeout(function() {

      equal(Math.round(object.getLeft()), 60, 'left has been increased by 40');
      start();

    }, 1000);
  });

  asyncTest('animate with keypath', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43, shadow: { offsetX: 20 } });

    object.animate('shadow.offsetX', 100);
    ok(true, 'animate without options does not crash');

    setTimeout(function() {

      equal(Math.round(object.shadow.offsetX), 100, 'property has been animated');
      start();

    }, 1000);
  });

  asyncTest('animate with decrement', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    object.animate('left', '-=40');
    ok(true, 'animate without options does not crash');

    setTimeout(function() {

      equal(Math.round(object.getLeft()), -20, 'left has been decreased by 40');
      start();

    }, 1000);
  });

  asyncTest('animate with object', function() {
    var object = new fabric.Object({ left: 20, top: 30, width: 40, height: 50, angle: 43 });

    ok(typeof object.animate == 'function');

    object.animate({ left: 40});
    ok(true, 'animate without options does not crash');

    setTimeout(function() {

      equal(40, Math.round(object.getLeft()));
      start();

    }, 1000);
  });

  asyncTest('animate multiple properties', function() {
    var object = new fabric.Object({ left: 123, top: 124 });

    object.animate({ left: 223, top: 224 });

    setTimeout(function() {

      equal(223, Math.round(object.get('left')));
      equal(224, Math.round(object.get('top')));

      start();

    }, 1000);
  });

  asyncTest('animate multiple properties with callback', function() {

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

      equal(Math.round(object.get('left')), 1);
      equal(Math.round(object.get('top')), 1);

      //equal(changedInvocations, 2);
      equal(completeInvocations, 1);

      start();

    }, 1000);
  });

  asyncTest('animate with abort', function() {
    var object = new fabric.Object({ left: 123, top: 124 });

    var context;
    object.animate({ left: 223, top: 224 }, {
      abort: function() {
        context = this;
        return true;
      }
    });

    setTimeout(function() {

      equal(123, Math.round(object.get('left')));
      equal(124, Math.round(object.get('top')));

      equal(context, object, 'abort should be called in context of an object');

      start();

    }, 100);
  });

  asyncTest('animate easing easeInQuad', function() {
    ok(typeof fabric.util.ease.easeInQuad === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInQuad
    });
  });

  asyncTest('animate easing easeOutQuad', function() {
    ok(typeof fabric.util.ease.easeOutQuad === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutQuad
    });
  });

  asyncTest('animate easing easeInOutQuad', function() {
    ok(typeof fabric.util.ease.easeInOutQuad === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutQuad
    });
  });

  asyncTest('animate easing easeInCubic', function() {
    ok(typeof fabric.util.ease.easeInCubic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInCubic
    });
  });

  asyncTest('animate easing easeOutCubic', function() {
    ok(typeof fabric.util.ease.easeOutCubic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutCubic
    });
  });

  asyncTest('animate easing easeInOutCubic', function() {
    ok(typeof fabric.util.ease.easeInOutCubic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutCubic
    });
  });

  asyncTest('animate easing easeInQuart', function() {
    ok(typeof fabric.util.ease.easeInQuart === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInQuart
    });
  });

  asyncTest('animate easing easeOutQuart', function() {
    ok(typeof fabric.util.ease.easeOutQuart === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutQuart
    });
  });

  asyncTest('animate easing easeInOutQuart', function() {
    ok(typeof fabric.util.ease.easeInOutQuart === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutQuart
    });
  });

  asyncTest('animate easing easeInQuint', function() {
    ok(typeof fabric.util.ease.easeInQuint === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInQuint
    });
  });

  asyncTest('animate easing easeOutQuint', function() {
    ok(typeof fabric.util.ease.easeOutQuint === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutQuint
    });
  });


  // easeInOutQuint: easeInOutQuint,
  asyncTest('animate easing easeInOutQuint', function() {
    ok(typeof fabric.util.ease.easeInOutQuint === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutQuint
    });
  });

  // easeInSine: easeInSine,
  asyncTest('animate easing easeInSine', function() {
    ok(typeof fabric.util.ease.easeInSine === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInSine
    });
  });

  // easeOutSine: easeOutSine,
  asyncTest('animate easing easeOutSine', function() {
    ok(typeof fabric.util.ease.easeOutSine === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutSine
    });
  });

  // easeInOutSine: easeInOutSine,
  asyncTest('animate easing easeInOutSine', function() {
    ok(typeof fabric.util.ease.easeInOutSine === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutSine
    });
  });

  // easeInExpo: easeInExpo,
  asyncTest('animate easing easeInExpo', function() {
    ok(typeof fabric.util.ease.easeInExpo === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInExpo
    });
  });

  // easeOutExpo: easeOutExpo,
  asyncTest('animate easing easeOutExpo', function() {
    ok(typeof fabric.util.ease.easeOutExpo === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutExpo
    });
  });

  // easeInOutExpo: easeInOutExpo,
  asyncTest('animate easing easeInOutExpo', function() {
    ok(typeof fabric.util.ease.easeInOutExpo === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutExpo
    });
  });

  // easeInCirc: easeInCirc,
  asyncTest('animate easing easeInCirc', function() {
    ok(typeof fabric.util.ease.easeInCirc === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInCirc
    });
  });

  // easeOutCirc: easeOutCirc,
  asyncTest('animate easing easeOutCirc', function() {
    ok(typeof fabric.util.ease.easeOutCirc === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutCirc
    });
  });

  // easeInOutCirc: easeInOutCirc,
  asyncTest('animate easing easeInOutCirc', function() {
    ok(typeof fabric.util.ease.easeInOutCirc === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutCirc
    });
  });

  // easeInElastic: easeInElastic,
  asyncTest('animate easing easeInElastic', function() {
    ok(typeof fabric.util.ease.easeInElastic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInElastic
    });
  });

  // easeOutElastic: easeOutElastic,
  asyncTest('animate easing easeOutElastic', function() {
    ok(typeof fabric.util.ease.easeOutElastic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutElastic
    });
  });

  // easeInOutElastic: easeInOutElastic,
  asyncTest('animate easing easeInOutElastic', function() {
    ok(typeof fabric.util.ease.easeInOutElastic === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutElastic
    });
  });

  // easeInBack: easeInBack,
  asyncTest('animate easing easeInBack', function() {
    ok(typeof fabric.util.ease.easeInBack === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInBack
    });
  });

  // easeOutBack: easeOutBack,
  asyncTest('animate easing easeOutBack', function() {
    ok(typeof fabric.util.ease.easeOutBack === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutBack
    });
  });

  // easeInOutBack: easeInOutBack,
  asyncTest('animate easing easeInOutBack', function() {
    ok(typeof fabric.util.ease.easeInOutBack === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutBack
    });
  });

  // easeInBounce: easeInBounce,
  asyncTest('animate easing easeInBounce', function() {
    ok(typeof fabric.util.ease.easeInBounce === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInBounce
    });
  });

  // easeOutBounce: easeOutBounce,
  asyncTest('animate easing easeOutBounce', function() {
    ok(typeof fabric.util.ease.easeOutBounce === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeOutBounce
    });
  });

  // easeInOutBounce: easeInOutBounce
  asyncTest('animate easing easeInOutBounce', function() {
    ok(typeof fabric.util.ease.easeInOutBounce === 'function');
    var object = new fabric.Object({ left: 0 });
    object.animate({ left: 100 }, {
      onComplete: function() {
        equal(Math.round(object.left), 100, 'animation ended correctly');
        start();
      },
      duration: 160,
      easing: fabric.util.ease.easeInOutBounce
    });
  });

})();
