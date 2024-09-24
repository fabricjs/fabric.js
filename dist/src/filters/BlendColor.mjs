import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Color } from '../color/Color.mjs';
import { BaseFilter } from './BaseFilter.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { blendColorFragmentSource } from './shaders/blendColor.mjs';

const blendColorDefaultValues = {
  color: '#F95C63',
  mode: 'multiply',
  alpha: 1
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
class BlendColor extends BaseFilter {
  getCacheKey() {
    return "".concat(this.type, "_").concat(this.mode);
  }
  getFragmentSource() {
    return "\n      precision highp float;\n      uniform sampler2D uTexture;\n      uniform vec4 uColor;\n      varying vec2 vTexCoord;\n      void main() {\n        vec4 color = texture2D(uTexture, vTexCoord);\n        gl_FragColor = color;\n        if (color.a > 0.0) {\n          ".concat(blendColorFragmentSource[this.mode], "\n        }\n      }\n      ");
  }

  /**
   * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
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
          data[i] = r * tr / 255;
          data[i + 1] = g * tg / 255;
          data[i + 2] = b * tb / 255;
          break;
        case 'screen':
          data[i] = 255 - (255 - r) * (255 - tr) / 255;
          data[i + 1] = 255 - (255 - g) * (255 - tg) / 255;
          data[i + 2] = 255 - (255 - b) * (255 - tb) / 255;
          break;
        case 'add':
          data[i] = r + tr;
          data[i + 1] = g + tg;
          data[i + 2] = b + tb;
          break;
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
          data[i] = tr < 128 ? 2 * r * tr / 255 : 255 - 2 * (255 - r) * (255 - tr) / 255;
          data[i + 1] = tg < 128 ? 2 * g * tg / 255 : 255 - 2 * (255 - g) * (255 - tg) / 255;
          data[i + 2] = tb < 128 ? 2 * b * tb / 255 : 255 - 2 * (255 - b) * (255 - tb) / 255;
          break;
        case 'exclusion':
          data[i] = tr + r - 2 * tr * r / 255;
          data[i + 1] = tg + g - 2 * tg * g / 255;
          data[i + 2] = tb + b - 2 * tb * b / 255;
          break;
        case 'tint':
          data[i] = tr + r * alpha1;
          data[i + 1] = tg + g * alpha1;
          data[i + 2] = tb + b * alpha1;
      }
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    const source = new Color(this.color).getSource();
    source[0] = this.alpha * source[0] / 255;
    source[1] = this.alpha * source[1] / 255;
    source[2] = this.alpha * source[2] / 255;
    source[3] = this.alpha;
    gl.uniform4fv(uniformLocations.uColor, source);
  }
}
/**
 * Color to make the blend operation with. default to a reddish color since black or white
 * gives always strong result.
 * @type String
 * @default
 **/
/**
 * Blend mode for the filter: one of multiply, add, difference, screen, subtract,
 * darken, lighten, overlay, exclusion, tint.
 * @type String
 * @default
 **/
/**
 * alpha value. represent the strength of the blend color operation.
 * @type Number
 * @default
 **/
_defineProperty(BlendColor, "defaults", blendColorDefaultValues);
_defineProperty(BlendColor, "type", 'BlendColor');
_defineProperty(BlendColor, "uniformLocations", ['uColor']);
classRegistry.setClass(BlendColor);

export { BlendColor, blendColorDefaultValues };
//# sourceMappingURL=BlendColor.mjs.map
