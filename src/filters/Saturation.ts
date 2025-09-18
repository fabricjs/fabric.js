import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../ClassRegistry';
import { fragmentSource } from './shaders/saturation';

export type SaturationOwnProps = {
  saturation: number;
};

export const saturationDefaultValues: SaturationOwnProps = {
  saturation: 0,
};

/**
 * Saturate filter class
 * @example
 * const filter = new Saturation({
 *   saturation: 1
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export class Saturation extends BaseFilter<'Saturation', SaturationOwnProps> {
  /**
   * Saturation value, from -1 to 1.
   * Increases/decreases the color saturation.
   * A value of 0 has no effect.
   *
   * @param {Number} saturation
   */
  declare saturation: SaturationOwnProps['saturation'];

  static type = 'Saturation';

  static defaults = saturationDefaultValues;

  static uniformLocations = ['uSaturation'];

  getFragmentSource() {
    return fragmentSource;
  }

  /**
   * Apply the Saturation operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    const adjust = -this.saturation;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      data[i] += max !== r ? (max - r) * adjust : 0;
      data[i + 1] += max !== g ? (max - g) * adjust : 0;
      data[i + 2] += max !== b ? (max - b) * adjust : 0;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(
    gl: WebGLRenderingContext,
    uniformLocations: TWebGLUniformLocationMap,
  ) {
    gl.uniform1f(uniformLocations.uSaturation, -this.saturation);
  }

  isNeutralState() {
    return this.saturation === 0;
  }
}

classRegistry.setClass(Saturation);
