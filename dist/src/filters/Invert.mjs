import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { BaseFilter } from './BaseFilter.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { fragmentSource } from './shaders/invert.mjs';

const invertDefaultValues = {
  alpha: false,
  invert: true
};

/**
 * @example
 * const filter = new Invert();
 * object.filters.push(filter);
 * object.applyFilters(canvas.renderAll.bind(canvas));
 */
class Invert extends BaseFilter {
  /**
   * Apply the Invert operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
      if (this.alpha) {
        data[i + 3] = 255 - data[i + 3];
      }
    }
  }
  getFragmentSource() {
    return fragmentSource;
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
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1i(uniformLocations.uInvert, Number(this.invert));
    gl.uniform1i(uniformLocations.uAlpha, Number(this.alpha));
  }
}
/**
 * Invert also alpha.
 * @param {Boolean} alpha
 * @default
 **/
/**
 * Filter invert. if false, does nothing
 * @param {Boolean} invert
 * @default
 */
_defineProperty(Invert, "type", 'Invert');
_defineProperty(Invert, "defaults", invertDefaultValues);
_defineProperty(Invert, "uniformLocations", ['uInvert', 'uAlpha']);
classRegistry.setClass(Invert);

export { Invert, invertDefaultValues };
//# sourceMappingURL=Invert.mjs.map
