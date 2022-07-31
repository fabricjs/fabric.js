//@ts-nocheck
import { animate } from "../util";

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
     * @return {FabricObject} thisArg
     * @chainable
     */
    straighten() {
      return this.rotate(this._getAngleValueForStraighten());
    }

    /**
     * Same as {@link FabricObject#straighten} but with animation
     * @param {Object} callbacks Object with callback functions
     * @param {Function} [callbacks.onComplete] Invoked on completion
     * @param {Function} [callbacks.onChange] Invoked on every step of animation
     * @return {FabricObject} thisArg
     */
    fxStraighten(callbacks) {
      callbacks = callbacks || {};

      var empty = function () { },
        onComplete = callbacks.onComplete || empty,
        onChange = callbacks.onChange || empty,
        _this = this;

      return animate({
        target: this,
        startValue: this.get('angle'),
        endValue: this._getAngleValueForStraighten(),
        duration: this.FX_DURATION,
        onChange: function (value) {
          _this.rotate(value);
          onChange();
        },
        onComplete: function () {
          _this.setCoords();
          onComplete();
        },
      });
    }
  }
}


