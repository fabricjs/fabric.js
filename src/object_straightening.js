fabric.util.object.extend(fabric.Object.prototype, {

  /**
   * @method _getAngleValueForStraighten
   * @return {Number} angle value
   * @private
   */
  _getAngleValueForStraighten: function() {
      return (Math.ceil((this.get('angle') - 45) / 90)) * 90;
  },

  /**
   * @method straighten
   * @return {fabric.Object} thisArg
   * @chainable
   */
  straighten: function() {
    var angle = this._getAngleValueForStraighten();
    this.setAngle(angle);
    return this;
  },

  /**
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
   * Same as `fabric.Canvas#straightenObject`, but animated
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