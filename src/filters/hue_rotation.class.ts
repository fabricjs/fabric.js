import type { TClassProperties } from '../typedefs';
import { cos } from '../util/misc/cos';
import { sin } from '../util/misc/sin';
import { ColorMatrix } from './colormatrix_filter.class';
import type { TWebGLPipelineState, T2DPipelineState } from './typedefs';
import { classRegistry } from '../util/class_registry';

/**
 * HueRotation filter class
 * @example
 * const filter = new HueRotation({
 *   rotation: -0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
// @ts-expect-error fromObject
export class HueRotation extends ColorMatrix {
  /**
   * HueRotation value, from -1 to 1.
   */
  rotation: number;

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
    this.calculateMatrix();
    return super.isNeutralState();
  }

  applyTo(options: TWebGLPipelineState | T2DPipelineState) {
    this.calculateMatrix();
    super.applyTo(options);
  }

  static async fromObject(object: any) {
    return new HueRotation(object);
  }
}

export const hueRotationDefaultValues: Partial<TClassProperties<HueRotation>> =
  {
    type: 'HueRotation',
    rotation: 0,
    mainParameter: 'rotation',
  };

Object.assign(HueRotation.prototype, hueRotationDefaultValues);
classRegistry.setClass(HueRotation);
