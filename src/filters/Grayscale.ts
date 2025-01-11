import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../ClassRegistry';
import { fragmentSource } from './shaders/grayscale';

export type TGrayscaleMode = 'average' | 'lightness' | 'luminosity';

type GrayscaleOwnProps = {
  mode: TGrayscaleMode;
};

export const grayscaleDefaultValues: GrayscaleOwnProps = {
  mode: 'average',
};

/**
 * Grayscale image filter class
 * @example
 * const filter = new Grayscale();
 * object.filters.push(filter);
 * object.applyFilters();
 */
export class Grayscale extends BaseFilter<'Grayscale', GrayscaleOwnProps> {
  declare mode: TGrayscaleMode;

  static type = 'Grayscale';

  static defaults = grayscaleDefaultValues;

  static uniformLocations = ['uMode'];

  /**
   * Apply the Grayscale operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    for (let i = 0, value: number; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      switch (this.mode) {
        case 'average':
          value = (r + g + b) / 3;
          break;
        case 'lightness':
          value = (Math.min(r, g, b) + Math.max(r, g, b)) / 2;
          break;
        case 'luminosity':
          value = 0.21 * r + 0.72 * g + 0.07 * b;
          break;
      }

      data[i + 2] = data[i + 1] = data[i] = value;
    }
  }

  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }

  getFragmentSource() {
    return fragmentSource[this.mode];
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
    const mode = 1;
    gl.uniform1i(uniformLocations.uMode, mode);
  }

  /**
   * Grayscale filter isNeutralState implementation
   * The filter is never neutral
   * on the image
   **/
  isNeutralState() {
    return false;
  }
}

classRegistry.setClass(Grayscale);
