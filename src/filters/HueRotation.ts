import { cos } from '../util/misc/cos';
import { sin } from '../util/misc/sin';
import {
  ColorMatrix,
  type ColorMatrixOwnProps,
  colorMatrixDefaultValues,
} from './ColorMatrix';
import type { TWebGLPipelineState, T2DPipelineState } from './typedefs';
import { classRegistry } from '../ClassRegistry';

export type HueRotationOwnProps = ColorMatrixOwnProps & {
  rotation: number;
};

export type HueRotationSerializedProps = {
  rotation: number;
};

export const hueRotationDefaultValues: HueRotationOwnProps = {
  ...colorMatrixDefaultValues,
  rotation: 0,
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
export class HueRotation extends ColorMatrix<
  'HueRotation',
  HueRotationOwnProps,
  HueRotationSerializedProps
> {
  /**
   * HueRotation value, from -1 to 1.
   */
  declare rotation: HueRotationOwnProps['rotation'];

  static type = 'HueRotation';

  static defaults = hueRotationDefaultValues;

  calculateMatrix() {
    const rad = this.rotation * Math.PI,
      cosine = cos(rad),
      sine = sin(rad),
      aThird = 1 / 3,
      aThirdSqtSin = Math.sqrt(aThird) * sine,
      OneMinusCos = 1 - cosine;
    this.matrix = [
      cosine + OneMinusCos / 3,
      aThird * OneMinusCos - aThirdSqtSin,
      aThird * OneMinusCos + aThirdSqtSin,
      0,
      0,
      aThird * OneMinusCos + aThirdSqtSin,
      cosine + aThird * OneMinusCos,
      aThird * OneMinusCos - aThirdSqtSin,
      0,
      0,
      aThird * OneMinusCos - aThirdSqtSin,
      aThird * OneMinusCos + aThirdSqtSin,
      cosine + aThird * OneMinusCos,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ];
  }

  isNeutralState() {
    return this.rotation === 0;
  }

  applyTo(options: TWebGLPipelineState | T2DPipelineState) {
    this.calculateMatrix();
    super.applyTo(options);
  }

  toObject() {
    return {
      type: this.type,
      rotation: this.rotation,
    };
  }
}

classRegistry.setClass(HueRotation);
