import { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';

/**
 * Pixelate filter class
 * @example
 * const filter = new Pixelate({
 *   blocksize: 8
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export class Pixelate extends BaseFilter {
  blocksize: number;

  /**
   * Apply the Pixelate operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data, width, height } }: T2DPipelineState) {
    for (let i = 0; i < height; i += this.blocksize) {
      for (let j = 0; j < width; j += this.blocksize) {
        const index = i * 4 * width + j * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        for (let _i = i; _i < Math.min(i + this.blocksize, height); _i++) {
          for (let _j = j; _j < Math.min(j + this.blocksize, width); _j++) {
            const index = _i * 4 * width + _j * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
          }
        }
      }
    }
  }

  /**
   * Indicate when the filter is not gonna apply changes to the image
   **/
  isNeutralState() {
    return this.blocksize === 1;
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
      uBlocksize: gl.getUniformLocation(program, 'uBlocksize'),
      uStepW: gl.getUniformLocation(program, 'uStepW'),
      uStepH: gl.getUniformLocation(program, 'uStepH'),
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
    gl.uniform1f(uniformLocations.uBlocksize, this.blocksize);
  }

  static async fromObject(object: any) {
    return new Pixelate(object);
  }
}

export const pixelateDefaultValues: Partial<TClassProperties<Pixelate>> = {
  type: 'Pixelate',
  blocksize: 4,
  mainParameter: 'blocksize',
  fragmentSource:
    'precision highp float;\n' +
    'uniform sampler2D uTexture;\n' +
    'uniform float uBlocksize;\n' +
    'uniform float uStepW;\n' +
    'uniform float uStepH;\n' +
    'varying vec2 vTexCoord;\n' +
    'void main() {\n' +
    'float blockW = uBlocksize * uStepW;\n' +
    'float blockH = uBlocksize * uStepW;\n' +
    'int posX = int(vTexCoord.x / blockW);\n' +
    'int posY = int(vTexCoord.y / blockH);\n' +
    'float fposX = float(posX);\n' +
    'float fposY = float(posY);\n' +
    'vec2 squareCoords = vec2(fposX * blockW, fposY * blockH);\n' +
    'vec4 color = texture2D(uTexture, squareCoords);\n' +
    'gl_FragColor = color;\n' +
    '}',
};

Object.assign(Pixelate.prototype, pixelateDefaultValues);
