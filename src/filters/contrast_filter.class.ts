import type { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../util/class_registry';

/**
 * Contrast filter class
 * @example
 * const filter = new Contrast({
 *   contrast: 0.25
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export class Contrast extends BaseFilter {
  /**
   * contrast value, range from -1 to 1.
   * @param {Number} contrast
   * @default 0
   */
  contrast: number;

  /**
   * Apply the Contrast operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    if (this.contrast === 0) {
      return;
    }
    const contrast = Math.floor(this.contrast * 255),
      contrastF = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = contrastF * (data[i] - 128) + 128;
      data[i + 1] = contrastF * (data[i + 1] - 128) + 128;
      data[i + 2] = contrastF * (data[i + 2] - 128) + 128;
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
      uContrast: gl.getUniformLocation(program, 'uContrast'),
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
    gl.uniform1f(uniformLocations.uContrast, this.contrast);
  }

  static async fromObject(object: any) {
    return new Contrast(object);
  }
}

export const contrastDefaultValues: Partial<TClassProperties<Contrast>> = {
  type: 'Contrast',
  fragmentSource: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uContrast;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      float contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));
      color.rgb = contrastF * (color.rgb - 0.5) + 0.5;
      gl_FragColor = color;
    }`,
  contrast: 0,
  mainParameter: 'contrast',
};

Object.assign(Contrast.prototype, contrastDefaultValues);
classRegistry.setClass(Contrast);
