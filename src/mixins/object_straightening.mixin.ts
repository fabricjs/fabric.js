import { noop } from '../constants';
import type { FabricObject } from '../shapes/fabricObject.class';
import { TDegree } from '../typedefs';
import { animate } from '../util/animate';

export class FabricObjectObjectStraighteningMixin {
  /**
   * Animation duration (in ms) for fx* methods
   * @type Number
   * @default
   */
  FX_DURATION = 500;

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
  }

  /**
   * Straightens an object (rotating it from current angle to one of 0, 90, 180, 270, etc. depending on which is closer)
   * @return {FabricObject} thisArg
   * @chainable
   */
  straighten(this: FabricObject & this) {
    this.rotate(this._getAngleValueForStraighten());
  }

  /**
   * Same as {@link FabricObject.prototype.straighten} but with animation
   * @param {Object} callbacks Object with callback functions
   * @param {Function} [callbacks.onComplete] Invoked on completion
   * @param {Function} [callbacks.onChange] Invoked on every step of animation
   * @return {FabricObject} thisArg
   */
  fxStraighten(
    this: FabricObject & this,
    callbacks: {
      onChange?(value: TDegree): any;
      onComplete?(): any;
    } = {}
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
  }
}
