import { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';

/**
 * @example
 * const filter = new Invert();
 * object.filters.push(filter);
 * object.applyFilters(canvas.renderAll.bind(canvas));
 */
export class Invert extends BaseFilter {
  /**
   * Invert also alpha.
   * @param {Boolean} alpha
   * @default
   **/
  alpha: boolean;

  /**
   * Filter invert. if false, does nothing
   * @param {Boolean} invert
   * @default
   */
  invert: boolean;

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
      uInvert: gl.getUniformLocation(program, 'uInvert'),
      uAlpha: gl.getUniformLocation(program, 'uAlpha'),
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
    gl.uniform1i(uniformLocations.uInvert, Number(this.invert));
    gl.uniform1i(uniformLocations.uAlpha, Number(this.alpha));
  }

  static async fromObject(object: any) {
    return new Invert(object);
  }
}

export const invertDefaultValues: Partial<TClassProperties<Invert>> = {
  type: 'Invert',
  alpha: false,
  fragmentSource: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform int uInvert;
    uniform int uAlpha;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      if (uInvert == 1) {
        if (uAlpha == 1) {
          gl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,1.0 -color.a);
        } else {
          gl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);
        }
      } else {
        gl_FragColor = color;
      }
    }
    `,
  invert: true,
  mainParameter: 'invert',
};

Object.assign(Invert.prototype, invertDefaultValues);
