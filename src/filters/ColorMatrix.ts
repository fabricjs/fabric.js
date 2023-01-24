import type { TClassProperties } from '../typedefs';
import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../util/class_registry';
/**
   * Color Matrix filter class
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @see {@Link http://phoboslab.org/log/2013/11/fast-image-filters-with-webgl demo}
   * @example <caption>Kodachrome filter</caption>
   * const filter = new ColorMatrix({
   *  matrix: [
       1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502,
       -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203,
       -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946,
       0, 0, 0, 1, 0
      ]
   * });
   * object.filters.push(filter);
   * object.applyFilters();
   */
export class ColorMatrix extends BaseFilter {
  /**
   * Colormatrix for pixels.
   * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
   * outside the -1, 1 range.
   * 0.0039215686 is the part of 1 that get translated to 1 in 2d
   * @param {Array} matrix array of 20 numbers.
   * @default
   */
  declare matrix: number[];

  /**
   * Lock the colormatrix on the color part, skipping alpha, mainly for non webgl scenario
   * to save some calculation
   * @type Boolean
   * @default true
   */
  declare colorsOnly: boolean;

  setOptions({ matrix, ...options }: Record<string, any>) {
    if (matrix) {
      // safeguard against mutation
      this.matrix = [...matrix];
    }
    Object.assign(this, options);
  }

  /**
   * Apply the ColorMatrix operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d(options: T2DPipelineState) {
    const imageData = options.imageData,
      data = imageData.data,
      m = this.matrix,
      colorsOnly = this.colorsOnly;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (colorsOnly) {
        data[i] = r * m[0] + g * m[1] + b * m[2] + m[4] * 255;
        data[i + 1] = r * m[5] + g * m[6] + b * m[7] + m[9] * 255;
        data[i + 2] = r * m[10] + g * m[11] + b * m[12] + m[14] * 255;
      } else {
        const a = data[i + 3];
        data[i] = r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4] * 255;
        data[i + 1] = r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9] * 255;
        data[i + 2] =
          r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14] * 255;
        data[i + 3] =
          r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19] * 255;
      }
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
      uColorMatrix: gl.getUniformLocation(program, 'uColorMatrix'),
      uConstants: gl.getUniformLocation(program, 'uConstants'),
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
    const m = this.matrix,
      matrix = [
        m[0],
        m[1],
        m[2],
        m[3],
        m[5],
        m[6],
        m[7],
        m[8],
        m[10],
        m[11],
        m[12],
        m[13],
        m[15],
        m[16],
        m[17],
        m[18],
      ],
      constants = [m[4], m[9], m[14], m[19]];
    gl.uniformMatrix4fv(uniformLocations.uColorMatrix, false, matrix);
    gl.uniform4fv(uniformLocations.uConstants, constants);
  }

  static async fromObject(object: any) {
    return new ColorMatrix(object);
  }
}

export const colorMatrixDefaultValues: Partial<TClassProperties<ColorMatrix>> =
  {
    type: 'ColorMatrix',
    fragmentSource: `
      precision highp float;
      uniform sampler2D uTexture;
      varying vec2 vTexCoord;
      uniform mat4 uColorMatrix;
      uniform vec4 uConstants;
      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        color *= uColorMatrix;
        color += uConstants;
        gl_FragColor = color;
      }`,
    matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    mainParameter: 'matrix',
    colorsOnly: true,
  };

Object.assign(ColorMatrix.prototype, colorMatrixDefaultValues);
classRegistry.setClass(ColorMatrix);
