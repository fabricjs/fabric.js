fabric.util.object.extend(fabric.Object.prototype, /** @scope fabric.Object.prototype */ {

  /**
   * @private
   * @method _getAngleValueForStraighten
   * @param {Int} angleSteps
   * @return {Number} angle value
   */
  _getAngleValueForStraighten: function(angleSteps) {
    var angle = this.getAngle() % 360;
    if (angle > 0) {
      return Math.round((angle-1)/angleSteps) * angleSteps;
    }
    return Math.round(angle/angleSteps) * angleSteps;
  },

  /**
   * Straightens an object with angleSteps of x degrees, for example passing 45 to the function will rotate it from current angle to one of 0, 45, 90, 135, 180, 225, 270, etc. depending on which is closer. Default is 90.
   * @method straighten
   * @param {Int} angleSteps
   * @return {fabric.Object} thisArg
   * @chainable
   */
  straighten: function(angleSteps) {
    if(!angleSteps){
      var angleSteps = 90;
    }
    this.setAngle(this._getAngleValueForStraighten(angleSteps));
    return this;
  },

  /**
   * Same as {@link fabric.Object.prototype.straighten} but with animation
   * @method fxStraighten
   * @param {Object} callbacks
   *                  - onComplete: invoked on completion
   *                  - onChange: invoked on every step of animation
   * @param {Int} angleSteps
   * @return {fabric.Object} thisArg
   * @chainable
   */
  fxStraighten: function(callbacks, angleSteps) {
    callbacks = callbacks || { };
    if(!angleSteps){
      var angleSteps = 90;
    }
    
    var empty = function() { },
        onComplete = callbacks.onComplete || empty,
        onChange = callbacks.onChange || empty,
        _this = this;

    fabric.util.animate({
      startValue: this.get('angle'),
      endValue: this._getAngleValueForStraighten(angleSteps),
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
   * @param {Int} angleSteps
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  straightenObject: function (object, angleSteps) {
    if(!angleSteps){
      var angleSteps = 90;
    }
    object.straighten(angleSteps);
    this.renderAll();
    return this;
  },

  /**
   * Same as {@link fabric.Canvas.prototype.straightenObject}, but animated
   * @method fxStraightenObject
   * @param {fabric.Object} object Object to straighten
   * @param {Int} angleSteps
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  fxStraightenObject: function (object, angleSteps) {
    if(!angleSteps){
      var angleSteps = 90;
    }
    object.fxStraighten({
      onChange: this.renderAll.bind(this)
    }, angleSteps);
    return this;
  }
});
