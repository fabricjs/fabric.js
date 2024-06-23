import { cos } from '../util/misc/cos';
import { sin } from '../util/misc/sin';
import { ColorMatrix } from './ColorMatrix';
import type { TWebGLPipelineState, T2DPipelineState } from './typedefs';
import { classRegistry } from '../ClassRegistry';

export type HueRotationOwnProps = {
  rotation: number;
};

export const hueRotationDefaultValues: HueRotationOwnProps = {
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
  HueRotationOwnProps
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

  applyTo(options: TWebGLPipelineState | T2DPipelineState) {
    this.calculateMatrix();
    super.applyTo(options);
  }

  //@ts-expect-error TS and classes with different methods
  toObject(): { type: 'HueRotation'; rotation: number } {
    return {
      type: this.type,
      rotation: this.rotation,
    };
  }
}

classRegistry.setClass(HueRotation);
