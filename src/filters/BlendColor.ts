import { Color } from '../color/Color';
import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../ClassRegistry';
import { blendColorFragmentSource } from './shaders/blendColor';

export type TBlendMode =
  | 'multiply'
  | 'add'
  | 'difference'
  | 'screen'
  | 'subtract'
  | 'darken'
  | 'lighten'
  | 'overlay'
  | 'exclusion'
  | 'tint';

type BlendColorOwnProps = {
  color: string;
  mode: TBlendMode;
  alpha: number;
};

export const blendColorDefaultValues: BlendColorOwnProps = {
  color: '#F95C63',
  mode: 'multiply',
  alpha: 1,
};

/**
 * Color Blend filter class
 * @example
 * const filter = new BlendColor({
 *  color: '#000',
 *  mode: 'multiply'
 * });
 *
 * const filter = new BlendImage({
 *  image: fabricImageObject,
 *  mode: 'multiply'
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export class BlendColor extends BaseFilter<'BlendColor', BlendColorOwnProps> {
  /**
   * Color to make the blend operation with. default to a reddish color since black or white
   * gives always strong result.
   * @type String
   **/
  declare color: BlendColorOwnProps['color'];

  /**
   * Blend mode for the filter: one of multiply, add, difference, screen, subtract,
   * darken, lighten, overlay, exclusion, tint.
   * @type String
   **/
  declare mode: BlendColorOwnProps['mode'];
  /**
   * alpha value. represent the strength of the blend color operation.
   * @type Number
   **/
  declare alpha: BlendColorOwnProps['alpha'];

  static defaults = blendColorDefaultValues;

  static type = 'BlendColor';

  static uniformLocations = ['uColor'];

  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }

  protected getFragmentSource(): string {
    return `
      precision highp float;
      uniform sampler2D uTexture;
      uniform vec4 uColor;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        gl_FragColor = color;
        if (color.a > 0.0) {
          ${blendColorFragmentSource[this.mode]}
        }
      }
      `;
  }

  /**
   * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    const source = new Color(this.color).getSource();
    const alpha = this.alpha;
    const tr = source[0] * alpha;
    const tg = source[1] * alpha;
    const tb = source[2] * alpha;
    const alpha1 = 1 - alpha;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      let oR, oG, oB;
      switch (this.mode) {
        case 'multiply':
          oR = (r * tr) / 255;
          oG = (g * tg) / 255;
          oB = (b * tb) / 255;
          break;
        case 'screen':
          oR = 255 - ((255 - r) * (255 - tr)) / 255;
          oG = 255 - ((255 - g) * (255 - tg)) / 255;
          oB = 255 - ((255 - b) * (255 - tb)) / 255;
          break;
        case 'add':
          oR = r + tr;
          oG = g + tg;
          oB = b + tb;
          break;
        case 'difference':
          oR = Math.abs(r - tr);
          oG = Math.abs(g - tg);
          oB = Math.abs(b - tb);
          break;
        case 'subtract':
          oR = r - tr;
          oG = g - tg;
          oB = b - tb;
          break;
        case 'darken':
          oR = Math.min(r, tr);
          oG = Math.min(g, tg);
          oB = Math.min(b, tb);
          break;
        case 'lighten':
          oR = Math.max(r, tr);
          oG = Math.max(g, tg);
          oB = Math.max(b, tb);
          break;
        case 'overlay':
          oR =
            tr < 128
              ? (2 * r * tr) / 255
              : 255 - (2 * (255 - r) * (255 - tr)) / 255;
          oG =
            tg < 128
              ? (2 * g * tg) / 255
              : 255 - (2 * (255 - g) * (255 - tg)) / 255;
          oB =
            tb < 128
              ? (2 * b * tb) / 255
              : 255 - (2 * (255 - b) * (255 - tb)) / 255;
          break;
        case 'exclusion':
          oR = tr + r - (2 * tr * r) / 255;
          oG = tg + g - (2 * tg * g) / 255;
          oB = tb + b - (2 * tb * b) / 255;
          break;
        case 'tint':
          oR = tr + r * alpha1;
          oG = tg + g * alpha1;
          oB = tb + b * alpha1;
      }
      data[i] = oR;
      data[i + 1] = oG;
      data[i + 2] = oB;
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
    const source = new Color(this.color).getSource();
    source[0] = (this.alpha * source[0]) / 255;
    source[1] = (this.alpha * source[1]) / 255;
    source[2] = (this.alpha * source[2]) / 255;
    source[3] = this.alpha;
    gl.uniform4fv(uniformLocations.uColor, source);
  }
}

classRegistry.setClass(BlendColor);
