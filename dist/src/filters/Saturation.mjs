import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { BaseFilter } from './BaseFilter.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { fragmentSource } from './shaders/saturation.mjs';

const saturationDefaultValues = {
  saturation: 0
};

/**
 * Saturate filter class
 * @example
 * const filter = new Saturation({
 *   saturation: 1
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Saturation extends BaseFilter {
  getFragmentSource() {
    return fragmentSource;
  }

  /**
   * Apply the Saturation operation to a Uint8ClampedArray representing the pixels of an image.
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
    const adjust = -this.saturation;
    for (let i = 0; i < data.length; i += 4) {
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      data[i] += max !== data[i] ? (max - data[i]) * adjust : 0;
      data[i + 1] += max !== data[i + 1] ? (max - data[i + 1]) * adjust : 0;
      data[i + 2] += max !== data[i + 2] ? (max - data[i + 2]) * adjust : 0;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uSaturation, -this.saturation);
  }
  isNeutralState() {
    return this.saturation === 0;
  }
}
/**
 * Saturation value, from -1 to 1.
 * Increases/decreases the color saturation.
 * A value of 0 has no effect.
 *
 * @param {Number} saturation
 * @default
 */
_defineProperty(Saturation, "type", 'Saturation');
_defineProperty(Saturation, "defaults", saturationDefaultValues);
_defineProperty(Saturation, "uniformLocations", ['uSaturation']);
classRegistry.setClass(Saturation);

export { Saturation, saturationDefaultValues };
//# sourceMappingURL=Saturation.mjs.map
