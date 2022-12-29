import type { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../util/class_registry';

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
  vibrance: number;

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

  static async fromObject(object: any) {
    return new Vibrance(object);
  }
}

export const vibranceDefaultValues: Partial<TClassProperties<Vibrance>> = {
  type: 'Vibrance',
  fragmentSource: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uVibrance;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      float max = max(color.r, max(color.g, color.b));
      float avg = (color.r + color.g + color.b) / 3.0;
      float amt = (abs(max - avg) * 2.0) * uVibrance;
      color.r += max != color.r ? (max - color.r) * amt : 0.00;
      color.g += max != color.g ? (max - color.g) * amt : 0.00;
      color.b += max != color.b ? (max - color.b) * amt : 0.00;
      gl_FragColor = color;
    }
  `,
  vibrance: 0,
  mainParameter: 'vibrance',
};

Object.assign(Vibrance.prototype, vibranceDefaultValues);
classRegistry.setClass(Vibrance);
