import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { cos } from '../util/misc/cos.mjs';
import { sin } from '../util/misc/sin.mjs';
import { ColorMatrix } from './ColorMatrix.mjs';
import { classRegistry } from '../ClassRegistry.mjs';

const hueRotationDefaultValues = {
  rotation: 0
};

/**
 * HueRotation filter class
 * @example
 * const filter = new HueRotation({
 *   rotation: -0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class HueRotation extends ColorMatrix {
  calculateMatrix() {
    const rad = this.rotation * Math.PI,
      cosine = cos(rad),
      sine = sin(rad),
      aThird = 1 / 3,
      aThirdSqtSin = Math.sqrt(aThird) * sine,
      OneMinusCos = 1 - cosine;
    this.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
    this.matrix[0] = cosine + OneMinusCos / 3;
    this.matrix[1] = aThird * OneMinusCos - aThirdSqtSin;
    this.matrix[2] = aThird * OneMinusCos + aThirdSqtSin;
    this.matrix[5] = aThird * OneMinusCos + aThirdSqtSin;
    this.matrix[6] = cosine + aThird * OneMinusCos;
    this.matrix[7] = aThird * OneMinusCos - aThirdSqtSin;
    this.matrix[10] = aThird * OneMinusCos - aThirdSqtSin;
    this.matrix[11] = aThird * OneMinusCos + aThirdSqtSin;
    this.matrix[12] = cosine + aThird * OneMinusCos;
  }
  isNeutralState() {
    return this.rotation === 0;
  }
  applyTo(options) {
    this.calculateMatrix();
    super.applyTo(options);
  }

  //@ts-expect-error TS and classes with different methods
  toObject() {
    return {
      type: this.type,
      rotation: this.rotation
    };
  }
}
/**
 * HueRotation value, from -1 to 1.
 */
_defineProperty(HueRotation, "type", 'HueRotation');
_defineProperty(HueRotation, "defaults", hueRotationDefaultValues);
classRegistry.setClass(HueRotation);

export { HueRotation, hueRotationDefaultValues };
//# sourceMappingURL=HueRotation.mjs.map
