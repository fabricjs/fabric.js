//@ts-nocheck
import { FabricObject } from '../shapes/fabricObject.class';

(function (global) {
  var fabric = global.fabric;
  fabric.util.object.extend(
    FabricObject.prototype,
    /** @lends FabricObject.prototype */ {
      /**
       * @private
       * @return {Number} angle value
       */
      _getAngleValueForStraighten: function () {
        var angle = this.angle % 360;
        if (angle > 0) {
          return Math.round((angle - 1) / 90) * 90;
        }
        return Math.round(angle / 90) * 90;
      },

      /**
       * Straightens an object (rotating it from current angle to one of 0, 90, 180, 270, etc. depending on which is closer)
       * @return {fabric.Object} thisArg
       * @chainable
       */
      straighten: function () {
        return this.rotate(this._getAngleValueForStraighten());
      },

      /**
       * Same as {@link FabricObject.prototype.straighten} but with animation
       * @param {Object} callbacks Object with callback functions
       * @param {Function} [callbacks.onComplete] Invoked on completion
       * @param {Function} [callbacks.onChange] Invoked on every step of animation
       * @return {fabric.Object} thisArg
       */
      fxStraighten: function (callbacks) {
        callbacks = callbacks || {};

        var empty = function () {},
          onComplete = callbacks.onComplete || empty,
          onChange = callbacks.onChange || empty,
          _this = this;

        return fabric.util.animate({
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
      },
    }
  );
})(typeof exports !== 'undefined' ? exports : window);
