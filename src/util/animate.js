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
   * @typedef {(AnimationOptions & { cancel: CancelFunction }} AnimationContext
   */

  /**
   * Array holding all running animations
   * @memberof fabric
   * @type {AnimationContext[]}
   */
  var RUNNING_ANIMATIONS = [];
  fabric.util.object.extend(RUNNING_ANIMATIONS, {

    /**
     * cancel all running animations
     */
    cancelAll: function () {
      this.forEach(function (animation) {
        animation.cancel();
      });
    },

    /**
     *
     * @param {CancelFunction} cancelFunc the function returned by animate
     * @returns {number}
     */
    findAnimationIndex: function (cancelFunc) {
      return this.findIndex(function (animation) {
        return animation.cancel === cancelFunc;
      });
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
   * @returns {CancelFunction} cencel function
   */
  function animate(options) {
    options || (options = {});
    var cancel = false,
        context,
        removeFromRegistry = function () {
          var index = fabric.runningAnimations.indexOf(context);
          index > -1 && fabric.runningAnimations.splice(index, 1);
        };

    context = extend(clone(options), {
      cancel: function () {
        cancel = true;
        removeFromRegistry();
      }
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
        if (cancel) {
          return;
        }
        if (abort(current, valuePerc, timePerc)) {
          removeFromRegistry();
          return;
        }
        if (time > finish) {
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
