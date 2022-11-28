import { TClassProperties } from '../typedefs';
import { AbstractBaseFilter } from './base_filter.class';
import { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';

/**
 * Grayscale image filter class
 * @example
 * const filter = new Grayscale();
 * object.filters.push(filter);
 * object.applyFilters();
 */
export class Grayscale extends AbstractBaseFilter<Record<string, string>> {
  mode: 'average' | 'lightness' | 'luminosity';

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
    return this.fragmentSource[this.mode];
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
      uMode: gl.getUniformLocation(program, 'uMode'),
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

  static async fromObject(object: any) {
    return new Grayscale(object);
  }
}

export const grayscaleDefaultValues: Partial<TClassProperties<Grayscale>> = {
  type: 'Grayscale',
  fragmentSource: {
    average: `
      precision highp float;
      uniform sampler2D uTexture;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        float average = (color.r + color.b + color.g) / 3.0;
        gl_FragColor = vec4(average, average, average, color.a);
      }
      `,
    lightness: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform int uMode;
      varying vec2 vTexCoord;
      void main() {
        vec4 col = texture2D(uTexture, vTexCoord);
        float average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;
        gl_FragColor = vec4(average, average, average, col.a);
      }
      `,
    luminosity: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform int uMode;
      varying vec2 vTexCoord;
      void main() {
        vec4 col = texture2D(uTexture, vTexCoord);
        float average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;
        gl_FragColor = vec4(average, average, average, col.a);
      }
      `,
  },
  mode: 'average',
  mainParameter: 'mode',
};

Object.assign(Grayscale.prototype, grayscaleDefaultValues);
