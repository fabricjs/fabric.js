import { classRegistry } from '../ClassRegistry';
import { Color } from '../color/Color';
import { BaseFilter } from './BaseFilter';
import { fragmentShader } from './shaders/removeColor';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';

export type RemoveColorOwnProps = {
  color: string;
  distance: number;
  useAlpha: boolean;
};

export const removeColorDefaultValues: RemoveColorOwnProps = {
  color: '#FFFFFF',
  distance: 0.02,
  useAlpha: false,
};

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
export class RemoveColor extends BaseFilter<
  'RemoveColor',
  RemoveColorOwnProps
> {
  /**
   * Color to remove, in any format understood by {@link Color}.
   * @param {String} type
   * @default
   */
  declare color: RemoveColorOwnProps['color'];

  /**
   * distance to actual color, as value up or down from each r,g,b
   * between 0 and 1
   **/
  declare distance: RemoveColorOwnProps['distance'];

  /**
   * For color to remove inside distance, use alpha channel for a smoother deletion
   * NOT IMPLEMENTED YET
   **/
  declare useAlpha: RemoveColorOwnProps['useAlpha'];

  static type = 'RemoveColor';

  static defaults = removeColorDefaultValues;

  static uniformLocations = ['uLow', 'uHigh'];

  getFragmentSource() {
    return fragmentShader;
  }

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
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(
    gl: WebGLRenderingContext,
    uniformLocations: TWebGLUniformLocationMap,
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
}

classRegistry.setClass(RemoveColor);
