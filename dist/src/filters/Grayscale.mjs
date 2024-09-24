import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { BaseFilter } from './BaseFilter.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { fragmentSource } from './shaders/grayscale.mjs';

const grayscaleDefaultValues = {
  mode: 'average'
};

/**
 * Grayscale image filter class
 * @example
 * const filter = new Grayscale();
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Grayscale extends BaseFilter {
  /**
   * Apply the Grayscale operation to a Uint8Array representing the pixels of an image.
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
    for (let i = 0, value; i < data.length; i += 4) {
      switch (this.mode) {
        case 'average':
          value = (data[i] + data[i + 1] + data[i + 2]) / 3;
          break;
        case 'lightness':
          value = (Math.min(data[i], data[i + 1], data[i + 2]) + Math.max(data[i], data[i + 1], data[i + 2])) / 2;
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
    return "".concat(this.type, "_").concat(this.mode);
  }
  getFragmentSource() {
    return fragmentSource[this.mode];
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
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
}
_defineProperty(Grayscale, "type", 'Grayscale');
_defineProperty(Grayscale, "defaults", grayscaleDefaultValues);
_defineProperty(Grayscale, "uniformLocations", ['uMode']);
classRegistry.setClass(Grayscale);

export { Grayscale, grayscaleDefaultValues };
//# sourceMappingURL=Grayscale.mjs.map
