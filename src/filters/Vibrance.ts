import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../ClassRegistry';
import { fragmentSource } from './shaders/vibrance';

export type VibranceOwnProps = {
  vibrance: number;
};

export const vibranceDefaultValues: VibranceOwnProps = {
  vibrance: 0,
};

/**
 * Vibrance filter class
 * @example
 * const filter = new Vibrance({
 *   vibrance: 1
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export class Vibrance extends BaseFilter<'Vibrance', VibranceOwnProps> {
  /**
   * Vibrance value, from -1 to 1.
   * Increases/decreases the saturation of more muted colors with less effect on saturated colors.
   * A value of 0 has no effect.
   *
   * @param {Number} vibrance
   */
  declare vibrance: VibranceOwnProps['vibrance'];

  static type = 'Vibrance';

  static defaults = vibranceDefaultValues;

  static uniformLocations = ['uVibrance'];

  getFragmentSource() {
    return fragmentSource;
  }

  /**
   * Apply the Vibrance operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    const adjust = -this.vibrance;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const avg = (r + g + b) / 3;
      const amt = ((Math.abs(max - avg) * 2) / 255) * adjust;
      data[i] += max !== r ? (max - r) * amt : 0;
      data[i + 1] += max !== g ? (max - g) * amt : 0;
      data[i + 2] += max !== b ? (max - b) * amt : 0;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {TWebGLUniformLocationMap} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(
    gl: WebGLRenderingContext,
    uniformLocations: TWebGLUniformLocationMap,
  ) {
    gl.uniform1f(uniformLocations.uVibrance, -this.vibrance);
  }

  isNeutralState() {
    return this.vibrance === 0;
  }
}

classRegistry.setClass(Vibrance);
