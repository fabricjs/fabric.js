import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { BaseFilter } from './BaseFilter.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { fragmentSource } from './shaders/pixelate.mjs';

const pixelateDefaultValues = {
  blocksize: 4
};

/**
 * Pixelate filter class
 * @example
 * const filter = new Pixelate({
 *   blocksize: 8
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Pixelate extends BaseFilter {
  /**
   * Apply the Pixelate operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data,
        width,
        height
      }
    } = _ref;
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
  getFragmentSource() {
    return fragmentSource;
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uBlocksize, this.blocksize);
  }
}
_defineProperty(Pixelate, "type", 'Pixelate');
_defineProperty(Pixelate, "defaults", pixelateDefaultValues);
_defineProperty(Pixelate, "uniformLocations", ['uBlocksize']);
classRegistry.setClass(Pixelate);

export { Pixelate, pixelateDefaultValues };
//# sourceMappingURL=Pixelate.mjs.map
