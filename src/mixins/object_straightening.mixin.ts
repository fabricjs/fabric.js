//@ts-nocheck

export function ObjectStraighteningMixinGenerator(Klass) {
  return class ObjectStraighteningMixin extends Klass {

  /**
   * @private
   * @return {Number} angle value
   */
  _getAngleValueForStraighten() {
    var angle = this.angle % 360;
    if (angle > 0) {
      return Math.round((angle - 1) / 90) * 90;
    }
    return Math.round(angle / 90) * 90;
  }

  /**
   * Straightens an object (rotating it from current angle to one of 0, 90, 180, 270, etc. depending on which is closer)
   * @return {fabric.Object} thisArg
   * @chainable
   */
  straighten() {
    return this.rotate(this._getAngleValueForStraighten());
  }

  /**
   * Same as {@link fabric.Object.prototype.straighten} but with animation
   * @param {Object} callbacks Object with callback functions
   * @param {Function} [callbacks.onComplete] Invoked on completion
   * @param {Function} [callbacks.onChange] Invoked on every step of animation
   * @return {fabric.Object} thisArg
   */
  fxStraighten(callbacks) {
    callbacks = callbacks || { };

    var empty = function() { },
        onComplete = callbacks.onComplete || empty,
        onChange = callbacks.onChange || empty,
        _this = this;

    return fabric.util.animate({
      target: this,
      startValue: this.get('angle'),
      endValue: this._getAngleValueForStraighten(),
      duration: this.FX_DURATION,
      onChange: function(value) {
        _this.rotate(value);
        onChange();
      },
      onComplete: function() {
        _this.setCoords();
        onComplete();
      },
    });
  }
}
}

fabric.Object = ObjectStraighteningMixinGenerator(fabric.Object);



export function StaticCanvasObjectStraighteningMixinGenerator(Klass) {
  return class StaticCanvasObjectStraighteningMixin extends Klass {

  /**
   * Straightens object, then rerenders canvas
   * @param {fabric.Object} object Object to straighten
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  straightenObject(object) {
    object.straighten();
    this.requestRenderAll();
    return this;
  }

  /**
   * Same as {@link fabric.Canvas.prototype.straightenObject}, but animated
   * @param {fabric.Object} object Object to straighten
   * @return {fabric.Canvas} thisArg
   */
  fxStraightenObject(object) {
    return object.fxStraighten({
      onChange: this.requestRenderAllBound
    });
  }
}
}

fabric.StaticCanvas = StaticCanvasObjectStraighteningMixinGenerator(fabric.StaticCanvas);

