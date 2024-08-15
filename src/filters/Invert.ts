import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../ClassRegistry';
import { fragmentSource } from './shaders/invert';

export type InvertOwnProps = {
  alpha: boolean;
  invert: boolean;
};

export const invertDefaultValues: InvertOwnProps = {
  alpha: false,
  invert: true,
};

/**
 * @example
 * const filter = new Invert();
 * object.filters.push(filter);
 * object.applyFilters(canvas.renderAll.bind(canvas));
 */
export class Invert extends BaseFilter<'Invert', InvertOwnProps> {
  /**
   * Invert also alpha.
   * @param {Boolean} alpha
   * @default
   **/
  declare alpha: InvertOwnProps['alpha'];

  /**
   * Filter invert. if false, does nothing
   * @param {Boolean} invert
   * @default
   */
  declare invert: InvertOwnProps['invert'];

  static type = 'Invert';

  static defaults = invertDefaultValues;

  static uniformLocations = ['uInvert', 'uAlpha'];

  /**
   * Apply the Invert operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];

      if (this.alpha) {
        data[i + 3] = 255 - data[i + 3];
      }
    }
  }

  protected getFragmentSource(): string {
    return fragmentSource;
  }

  /**
   * Invert filter isNeutralState implementation
   * Used only in image applyFilters to discard filters that will not have an effect
   * on the image
   * @param {Object} options
   **/
  isNeutralState() {
    return !this.invert;
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
    gl.uniform1i(uniformLocations.uInvert, Number(this.invert));
    gl.uniform1i(uniformLocations.uAlpha, Number(this.alpha));
  }
}

classRegistry.setClass(Invert);
