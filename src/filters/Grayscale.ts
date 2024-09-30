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
      switch (this.mode) {
        case 'average':
          value = (data[i] + data[i + 1] + data[i + 2]) / 3;
          break;
        case 'lightness':
          value =
            (Math.min(data[i], data[i + 1], data[i + 2]) +
              Math.max(data[i], data[i + 1], data[i + 2])) /
            2;
          break;
        case 'luminosity':
          value = 0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2];
          break;
      }

      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
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
