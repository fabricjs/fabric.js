(function () {

  var extend = fabric.util.object.extend,
      clone = fabric.util.object.clone;

  /**
   * @typedef {Object} AnimationOptions
   * @property {Function} [options.onChange] Callback; invoked on every value change
   * @property {Function} [options.onComplete] Callback; invoked when value change is completed
   * @property {Number} [options.startValue=0] Starting value
   * @property {Number} [options.endValue=100] Ending value
   * @property {Number} [options.byValue=100] Value to modify the property by
   * @property {Function} [options.easing] Easing function
   * @property {Number} [options.duration=500] Duration of change (in ms)
   * @property {Function} [options.abort] Additional function with logic. If returns true, animation aborts.
   *
   * @typedef {() => void} CancelFunction
   *
   * @typedef {Object} AnimationCurrentState
   * @property {number} currentValue value in range [`startValue`, `endValue`]
   * @property {number} completionRate value in range [0, 1]
   * @property {number} durationRate value in range [0, 1]
   *
   * @typedef {(AnimationOptions & AnimationCurrentState & { cancel: CancelFunction }} AnimationContext
   */

  /**
   * Array holding all running animations
   * @memberof fabric
   * @type {AnimationContext[]}
   */
  var RUNNING_ANIMATIONS = [];
  fabric.util.object.extend(RUNNING_ANIMATIONS, {

    /**
     * cancel all running animations at the next requestAnimFrame
     * @returns {AnimationContext[]}
     */
    cancelAll: function () {
      var animations = this.splice(0);
      animations.forEach(function (animation) {
        animation.cancel();
      });
      return animations;
    },

    /**
     * cancel all running animations attached to canvas at the next requestAnimFrame
     * @param {fabric.Canvas} canvas
     * @returns {AnimationContext[]}
     */
    cancelByCanvas: function (canvas) {
      if (!canvas) {
        return [];
      }
      var cancelled = this.filter(function (animation) {
        return typeof animation.target === 'object' && animation.target.canvas === canvas;
      });
      cancelled.forEach(function (animation) {
        animation.cancel();
      });
      return cancelled;
    },

    /**
     * cancel all running animations for target at the next requestAnimFrame
     * @param {*} target
     * @returns {AnimationContext[]}
     */
    cancelByTarget: function (target) {
      var cancelled = this.findAnimationsByTarget(target);
      cancelled.forEach(function (animation) {
        animation.cancel();
      });
      return cancelled;
    },

    /**
     *
     * @param {CancelFunction} cancelFunc the function returned by animate
     * @returns {number}
     */
    findAnimationIndex: function (cancelFunc) {
      return this.indexOf(this.findAnimation(cancelFunc));
    },

    /**
     *
     * @param {CancelFunction} cancelFunc the function returned by animate
     * @returns {AnimationContext | undefined} animation's options object
     */
    findAnimation: function (cancelFunc) {
      return this.find(function (animation) {
        return animation.cancel === cancelFunc;
      });
    },

    /**
     *
     * @param {*} target the object that is assigned to the target property of the animation context
     * @returns {AnimationContext[]} array of animation options object associated with target
     */
    findAnimationsByTarget: function (target) {
      if (!target) {
        return [];
      }
      return this.filter(function (animation) {
        return animation.target === target;
      });
    }
  });

  function noop() {
    return false;
  }

  function defaultEasing(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  }

  /**
   * Changes value from one to another within certain period of time, invoking callbacks as value is being changed.
   * @memberOf fabric.util
   * @param {AnimationOptions} [options] Animation options
   * @returns {CancelFunction} cancel function
   */
  function animate(options) {
    options || (options = {});
    var cancel = false,
        context,
        removeFromRegistry = function () {
          var index = fabric.runningAnimations.indexOf(context);
          return index > -1 && fabric.runningAnimations.splice(index, 1)[0];
        };

    context = extend(clone(options), {
      cancel: function () {
        cancel = true;
        return removeFromRegistry();
      },
      currentValue: 'startValue' in options ? options.startValue : 0,
      completionRate: 0,
      durationRate: 0
    });
    fabric.runningAnimations.push(context);

    requestAnimFrame(function(timestamp) {
      var start = timestamp || +new Date(),
          duration = options.duration || 500,
          finish = start + duration, time,
          onChange = options.onChange || noop,
          abort = options.abort || noop,
          onComplete = options.onComplete || noop,
          easing = options.easing || defaultEasing,
          startValue = 'startValue' in options ? options.startValue : 0,
          endValue = 'endValue' in options ? options.endValue : 100,
          byValue = options.byValue || endValue - startValue;

      options.onStart && options.onStart();

      (function tick(ticktime) {
        time = ticktime || +new Date();
        var currentTime = time > finish ? duration : (time - start),
            timePerc = currentTime / duration,
            current = easing(currentTime, startValue, byValue, duration),
            valuePerc = Math.abs((current - startValue) / byValue);
        //  update context
        context.currentValue = current;
        context.completionRate = valuePerc;
        context.durationRate = timePerc;
        if (cancel) {
          return;
        }
        if (abort(current, valuePerc, timePerc)) {
          removeFromRegistry();
          return;
        }
        if (time > finish) {
          //  update context
          context.currentValue = endValue;
          context.completionRate = 1;
          context.durationRate = 1;
          //  execute callbacks
          onChange(endValue, 1, 1);
          onComplete(endValue, 1, 1);
          removeFromRegistry();
          return;
        }
        else {
          onChange(current, valuePerc, timePerc);
          requestAnimFrame(tick);
        }
      })(start);
    });

    return context.cancel;
  }

  var _requestAnimFrame = fabric.window.requestAnimationFrame       ||
                          fabric.window.webkitRequestAnimationFrame ||
                          fabric.window.mozRequestAnimationFrame    ||
                          fabric.window.oRequestAnimationFrame      ||
                          fabric.window.msRequestAnimationFrame     ||
                          function(callback) {
                            return fabric.window.setTimeout(callback, 1000 / 60);
                          };

  var _cancelAnimFrame = fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;

  /**
   * requestAnimationFrame polyfill based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   * In order to get a precise start time, `requestAnimFrame` should be called as an entry into the method
   * @memberOf fabric.util
   * @param {Function} callback Callback to invoke
   * @param {DOMElement} element optional Element to associate with animation
   */
  function requestAnimFrame() {
    return _requestAnimFrame.apply(fabric.window, arguments);
  }

  function cancelAnimFrame() {
    return _cancelAnimFrame.apply(fabric.window, arguments);
  }

  fabric.util.animate = animate;
  fabric.util.requestAnimFrame = requestAnimFrame;
  fabric.util.cancelAnimFrame = cancelAnimFrame;
  fabric.runningAnimations = RUNNING_ANIMATIONS;
})();
