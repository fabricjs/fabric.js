import type { TClassProperties } from '../typedefs';
import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../ClassRegistry';
import { fragmentSource } from './shaders/vibrance';

export const vibranceDefaultValues: Partial<TClassProperties<Vibrance>> = {
  vibrance: 0,
  mainParameter: 'vibrance',
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
export class Vibrance extends BaseFilter {
  /**
   * Vibrance value, from -1 to 1.
   * Increases/decreases the saturation of more muted colors with less effect on saturated colors.
   * A value of 0 has no effect.
   *
   * @param {Number} vibrance
   * @default
   */
  declare vibrance: number;

  static defaults = vibranceDefaultValues;

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
    if (this.vibrance === 0) {
      return;
    }
    const adjust = -this.vibrance;
    for (let i = 0; i < data.length; i += 4) {
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const amt = ((Math.abs(max - avg) * 2) / 255) * adjust;
      data[i] += max !== data[i] ? (max - data[i]) * amt : 0;
      data[i + 1] += max !== data[i + 1] ? (max - data[i + 1]) * amt : 0;
      data[i + 2] += max !== data[i + 2] ? (max - data[i + 2]) * amt : 0;
    }
  }

  /**
   * Return WebGL uniform locations for this filter's shader.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {WebGLShaderProgram} program This filter's compiled shader program.
   */
  getUniformLocations(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ): TWebGLUniformLocationMap {
    return {
      uVibrance: gl.getUniformLocation(program, 'uVibrance'),
    };
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(
    gl: WebGLRenderingContext,
    uniformLocations: TWebGLUniformLocationMap
  ) {
    gl.uniform1f(uniformLocations.uVibrance, -this.vibrance);
  }
}

classRegistry.setClass(Vibrance);
