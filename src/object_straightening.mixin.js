fabric.util.object.extend(fabric.Object.prototype, /** @scope fabric.Object.prototype */ {

  /**
   * @private
   * @method _getAngleValueForStraighten
   * @return {Number} angle value
   */
  _getAngleValueForStraighten: function() {
    var angle = this.getAngle() % 360;
    if (angle > 0) {
      return Math.round((angle-1)/90) * 90;
    }
    return Math.round(angle/90) * 90;
  },

  /**
   * Straightens an object (rotating it from current angle to one of 0, 90, 180, 270, etc. depending on which is closer)
   * @method straighten
   * @return {fabric.Object} thisArg
   * @chainable
   */
  straighten: function() {
    this.setAngle(this._getAngleValueForStraighten());
    return this;
  },

  /**
   * Same as {@link fabric.Object.prototype.straghten} but with animation
   * @method fxStraighten
   * @param {Object} callbacks
   *                  - onComplete: invoked on completion
   *                  - onChange: invoked on every step of animation
   *
   * @return {fabric.Object} thisArg
   * @chainable
   */
  fxStraighten: function(callbacks) {
    callbacks = callbacks || { };

    var empty = function() { },
        onComplete = callbacks.onComplete || empty,
        onChange = callbacks.onChange || empty,
        _this = this;

    fabric.util.animate({
      startValue: this.get('angle'),
      endValue: this._getAngleValueForStraighten(),
      duration: this.FX_DURATION,
      onChange: function(value) {
        _this.setAngle(value);
        onChange();
      },
      onComplete: function() {
        _this.setCoords();
        onComplete();
      },
      onStart: function() {
        _this.setActive(false);
      }
    });

    return this;
  }
});

fabric.util.object.extend(fabric.StaticCanvas.prototype, {

  /**
   * Straightens object, then rerenders canvas
   * @method straightenObject
   * @param {fabric.Object} object Object to straighten
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  straightenObject: function (object) {
    object.straighten();
    this.renderAll();
    return this;
  },

  /**
   * Same as {@link fabric.Canvas.prototype.straightenObject}, but animated
   * @method fxStraightenObject
   * @param {fabric.Object} object Object to straighten
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  fxStraightenObject: function (object) {
    object.fxStraighten({
      onChange: this.renderAll.bind(this)
    });
    return this;
  }
});