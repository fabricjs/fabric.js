import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { BaseFilter } from './BaseFilter.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { fragmentSource } from './shaders/constrast.mjs';

const contrastDefaultValues = {
  contrast: 0
};

/**
 * Contrast filter class
 * @example
 * const filter = new Contrast({
 *   contrast: 0.25
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Contrast extends BaseFilter {
  getFragmentSource() {
    return fragmentSource;
  }
  isNeutralState() {
    return this.contrast === 0;
  }

  /**
   * Apply the Contrast operation to a Uint8Array representing the pixels of an image.
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
    const contrast = Math.floor(this.contrast * 255),
      contrastF = 259 * (contrast + 255) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = contrastF * (data[i] - 128) + 128;
      data[i + 1] = contrastF * (data[i + 1] - 128) + 128;
      data[i + 2] = contrastF * (data[i + 2] - 128) + 128;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uContrast, this.contrast);
  }
}
/**
 * contrast value, range from -1 to 1.
 * @param {Number} contrast
 * @default 0
 */
_defineProperty(Contrast, "type", 'Contrast');
_defineProperty(Contrast, "defaults", contrastDefaultValues);
_defineProperty(Contrast, "uniformLocations", ['uContrast']);
classRegistry.setClass(Contrast);

export { Contrast, contrastDefaultValues };
//# sourceMappingURL=Contrast.mjs.map
