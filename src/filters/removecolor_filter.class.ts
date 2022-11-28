import { Color } from '../color';
import { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';

/**
 * Remove white filter class
 * @example
 * const filter = new RemoveColor({
 *   threshold: 0.2,
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export class RemoveColor extends BaseFilter {
  /**
   * Color to remove, in any format understood by fabric.Color.
   * @param {String} type
   * @default
   */
  color: string;

  /**
   * distance to actual color, as value up or down from each r,g,b
   * between 0 and 1
   **/
  distance: number;

  /**
   * For color to remove inside distance, use alpha channel for a smoother deletion
   * NOT IMPLEMENTED YET
   **/
  useAlpha: boolean;

  /**
   * Applies filter to canvas element
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    const distance = this.distance * 255,
      source = new Color(this.color).getSource(),
      lowC = [source[0] - distance, source[1] - distance, source[2] - distance],
      highC = [
        source[0] + distance,
        source[1] + distance,
        source[2] + distance,
      ];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (
        r > lowC[0] &&
        g > lowC[1] &&
        b > lowC[2] &&
        r < highC[0] &&
        g < highC[1] &&
        b < highC[2]
      ) {
        data[i + 3] = 0;
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
      uLow: gl.getUniformLocation(program, 'uLow'),
      uHigh: gl.getUniformLocation(program, 'uHigh'),
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
    const source = new Color(this.color).getSource(),
      distance = this.distance,
      lowC = [
        0 + source[0] / 255 - distance,
        0 + source[1] / 255 - distance,
        0 + source[2] / 255 - distance,
        1,
      ],
      highC = [
        source[0] / 255 + distance,
        source[1] / 255 + distance,
        source[2] / 255 + distance,
        1,
      ];
    gl.uniform4fv(uniformLocations.uLow, lowC);
    gl.uniform4fv(uniformLocations.uHigh, highC);
  }

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return { ...super.toObject(), color: this.color, distance: this.distance };
  }

  static async fromObject(object: any) {
    return new RemoveColor(object);
  }
}

export const removeColorDefaultValues: Partial<TClassProperties<RemoveColor>> =
  {
    type: 'RemoveColor',
    color: '#FFFFFF',
    fragmentSource: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform vec4 uLow;
      uniform vec4 uHigh;
      varying vec2 vTexCoord;
      void main() {
        gl_FragColor = texture2D(uTexture, vTexCoord);
        if(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {
          gl_FragColor.a = 0.0;
        }
      }
      `,
    distance: 0.02,
    useAlpha: false,
  };

Object.assign(RemoveColor.prototype, removeColorDefaultValues);
