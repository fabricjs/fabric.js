(function() {

  var degreesToRadians = fabric.util.degreesToRadians,
      radiansToDegrees = fabric.util.radiansToDegrees;

  fabric.util.object.extend(fabric.Canvas.prototype, /** @lends fabric.Canvas.prototype */ {

    /**
     * Method that defines actions when an Event.js gesture is detected on an object. Currently only supports
     * 2 finger gestures.
     *
     * @param {Event} e Event object by Event.js
     * @param {Event} self Event proxy object by Event.js
     */
    __onTransformGesture: function(e, self) {

      if (this.isDrawingMode || !e.touches || e.touches.length !== 2 || 'gesture' !== self.gesture) {
        return;
      }

      var target = this.findTarget(e);
      if ('undefined' !== typeof target) {
        this.onBeforeScaleRotate(target);
        this._rotateObjectByAngle(self.rotation);
        this._scaleObjectBy(self.scale);
      }

      this.fire('touch:gesture', { target: target, e: e, self: self });
    },

    /**
     * Method that defines actions when an Event.js drag is detected.
     *
     * @param {Event} e Event object by Event.js
     * @param {Event} self Event proxy object by Event.js
     */
    __onDrag: function(e, self) {
      this.fire('touch:drag', { e: e, self: self });
    },

    /**
     * Method that defines actions when an Event.js orientation event is detected.
     *
     * @param {Event} e Event object by Event.js
     * @param {Event} self Event proxy object by Event.js
     */
    __onOrientationChange: function(e, self) {
      this.fire('touch:orientation', { e: e, self: self });
    },

    /**
     * Method that defines actions when an Event.js shake event is detected.
     *
     * @param {Event} e Event object by Event.js
     * @param {Event} self Event proxy object by Event.js
     */
    __onShake: function(e, self) {
      this.fire('touch:shake', { e: e, self: self });
    },

    /**
     * Scales an object by a factor
     * @param {Number} s The scale factor to apply to the current scale level
     * @param {String} by Either 'x' or 'y' - specifies dimension constraint by which to scale an object.
     *                    When not provided, an object is scaled by both dimensions equally
     */
    _scaleObjectBy: function(s, by) {
      var t = this._currentTransform,
          target = t.target,
          lockScalingX = target.get('lockScalingX'),
          lockScalingY = target.get('lockScalingY');

      if (lockScalingX && lockScalingY) {
        return;
      }

      target._scaling = true;

      if (!by) {
        if (!lockScalingX) {
          target.set('scaleX', t.scaleX * s);
        }
        if (!lockScalingY) {
          target.set('scaleY', t.scaleY * s);
        }
      }
      else if (by === 'x' && !target.get('lockUniScaling')) {
        lockScalingX || target.set('scaleX', t.scaleX * s);
      }
      else if (by === 'y' && !target.get('lockUniScaling')) {
        lockScalingY || target.set('scaleY', t.scaleY * s);
      }
    },

    /**
     * Rotates object by an angle
     * @param {Number} curAngle The angle of rotation in degrees
     */
    _rotateObjectByAngle: function(curAngle) {
      var t = this._currentTransform;

      if (t.target.get('lockRotation')) {
        return;
      }
      t.target.angle = radiansToDegrees(degreesToRadians(curAngle) + t.theta);
    }
  });
})();
