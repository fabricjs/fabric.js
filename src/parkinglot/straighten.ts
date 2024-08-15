// @ts-nocheck
import { noop } from '../constants';
import { FabricObject } from '../shapes/Object/FabricObject';
import { TDegree } from '../typedefs';
import { animate } from '../util/animation/animate';

Object.assign(FabricObject.prototype, {
  /**
   * Animation duration (in ms) for fx* methods
   * @type Number
   * @default
   */
  FX_DURATION: 500,

  /**
   * @private
   * @return {Number} angle value
   */
  _getAngleValueForStraighten(this: FabricObject) {
    const angle = this.angle % 360;
    if (angle > 0) {
      return Math.round((angle - 1) / 90) * 90;
    }
    return Math.round(angle / 90) * 90;
  },

  /**
   * Straightens an object (rotating it from current angle to one of 0, 90, 180, 270, etc. depending on which is closer)
   */
  straighten(this: FabricObject) {
    this.rotate(this._getAngleValueForStraighten());
  },

  /**
   * Same as {@link straighten} but with animation
   * @param {Object} callbacks Object with callback functions
   * @param {Function} [callbacks.onComplete] Invoked on completion
   * @param {Function} [callbacks.onChange] Invoked on every step of animation
   */
  fxStraighten(
    this: FabricObject,
    callbacks: {
      onChange?(value: TDegree): any;
      onComplete?(): any;
    } = {},
  ) {
    const onComplete = callbacks.onComplete || noop,
      onChange = callbacks.onChange || noop;

    return animate({
      target: this,
      startValue: this.angle,
      endValue: this._getAngleValueForStraighten(),
      duration: this.FX_DURATION,
      onChange: (value: TDegree) => {
        this.rotate(value);
        onChange(value);
      },
      onComplete: () => {
        this.setCoords();
        onComplete();
      },
    });
  },
});
