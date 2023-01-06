import { Color } from '../color/color.class';
import { TClassProperties } from '../typedefs';
import { AbstractBaseFilter } from './base_filter.class';
import { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { classRegistry } from '../util/class_registry';

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
 *  mode: 'multiply',
 *  alpha: 0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export class BlendColor extends AbstractBaseFilter<Record<string, string>> {
  /**
   * Color to make the blend operation with. default to a reddish color since black or white
   * gives always strong result.
   * @type String
   * @default
   **/
  color: string;

  mode:
    | 'multiply'
    | 'add'
    | 'diff'
    | 'difference'
    | 'screen'
    | 'subtract'
    | 'darken'
    | 'lighten'
    | 'overlay'
    | 'exclusion'
    | 'tint';

  /**
   * alpha value. represent the strength of the blend color operation.
   * @type Number
   * @default
   **/
  alpha: number;

  /**
   * build the fragment source for the filters, joining the common part with
   * the specific one.
   * @param {String} mode the mode of the filter, a key of this.fragmentSource
   * @return {String} the source to be compiled
   * @private
   */
  buildSource(mode: string) {
    return `
      precision highp float;
      uniform sampler2D uTexture;
      uniform vec4 uColor;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        gl_FragColor = color;
        if (color.a > 0.0) {
          ${this.fragmentSource[mode]}
        }
      }
      `;
  }

  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }

  getFragmentSource(): string {
    return this.buildSource(this.mode);
  }

  /**
   * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    const source = new Color(this.color).getSource();
    const tr = source[0] * this.alpha;
    const tg = source[1] * this.alpha;
    const tb = source[2] * this.alpha;
    const alpha1 = 1 - this.alpha;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      switch (this.mode) {
        case 'multiply':
          data[i] = (r * tr) / 255;
          data[i + 1] = (g * tg) / 255;
          data[i + 2] = (b * tb) / 255;
          break;
        case 'screen':
          data[i] = 255 - ((255 - r) * (255 - tr)) / 255;
          data[i + 1] = 255 - ((255 - g) * (255 - tg)) / 255;
          data[i + 2] = 255 - ((255 - b) * (255 - tb)) / 255;
          break;
        case 'add':
          data[i] = r + tr;
          data[i + 1] = g + tg;
          data[i + 2] = b + tb;
          break;
        case 'diff':
        case 'difference':
          data[i] = Math.abs(r - tr);
          data[i + 1] = Math.abs(g - tg);
          data[i + 2] = Math.abs(b - tb);
          break;
        case 'subtract':
          data[i] = r - tr;
          data[i + 1] = g - tg;
          data[i + 2] = b - tb;
          break;
        case 'darken':
          data[i] = Math.min(r, tr);
          data[i + 1] = Math.min(g, tg);
          data[i + 2] = Math.min(b, tb);
          break;
        case 'lighten':
          data[i] = Math.max(r, tr);
          data[i + 1] = Math.max(g, tg);
          data[i + 2] = Math.max(b, tb);
          break;
        case 'overlay':
          data[i] =
            tr < 128
              ? (2 * r * tr) / 255
              : 255 - (2 * (255 - r) * (255 - tr)) / 255;
          data[i + 1] =
            tg < 128
              ? (2 * g * tg) / 255
              : 255 - (2 * (255 - g) * (255 - tg)) / 255;
          data[i + 2] =
            tb < 128
              ? (2 * b * tb) / 255
              : 255 - (2 * (255 - b) * (255 - tb)) / 255;
          break;
        case 'exclusion':
          data[i] = tr + r - (2 * tr * r) / 255;
          data[i + 1] = tg + g - (2 * tg * g) / 255;
          data[i + 2] = tb + b - (2 * tb * b) / 255;
          break;
        case 'tint':
          data[i] = tr + r * alpha1;
          data[i + 1] = tg + g * alpha1;
          data[i + 2] = tb + b * alpha1;
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
      uColor: gl.getUniformLocation(program, 'uColor'),
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
    const source = new Color(this.color).getSource();
    source[0] = (this.alpha * source[0]) / 255;
    source[1] = (this.alpha * source[1]) / 255;
    source[2] = (this.alpha * source[2]) / 255;
    source[3] = this.alpha;
    gl.uniform4fv(uniformLocations.uColor, source);
  }

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return {
      type: this.type,
      color: this.color,
      mode: this.mode,
      alpha: this.alpha,
    };
  }

  static async fromObject(object: any) {
    return new BlendColor(object);
  }
}

export const blendColorDefaultValues: Partial<TClassProperties<BlendColor>> = {
  type: 'BlendColor',
  color: '#F95C63',
  mode: 'multiply',
  alpha: 1,
  fragmentSource: {
    multiply: 'gl_FragColor.rgb *= uColor.rgb;\n',
    screen:
      'gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n',
    add: 'gl_FragColor.rgb += uColor.rgb;\n',
    diff: 'gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n',
    subtract: 'gl_FragColor.rgb -= uColor.rgb;\n',
    lighten: 'gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n',
    darken: 'gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n',
    exclusion:
      'gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n',
    overlay: `
      if (uColor.r < 0.5) {
        gl_FragColor.r *= 2.0 * uColor.r;
      } else {
        gl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);
      }
      if (uColor.g < 0.5) {
        gl_FragColor.g *= 2.0 * uColor.g;
      } else {
        gl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);
      }
      if (uColor.b < 0.5) {
        gl_FragColor.b *= 2.0 * uColor.b;
      } else {
        gl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);
      }
      `,
    tint: `
      gl_FragColor.rgb *= (1.0 - uColor.a);
      gl_FragColor.rgb += uColor.rgb;
      `,
  },
};

Object.assign(BlendColor.prototype, blendColorDefaultValues);
classRegistry.setClass(BlendColor);
