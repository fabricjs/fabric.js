import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { BaseFilter } from './BaseFilter.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { fragmentSource } from './shaders/brightness.mjs';

const brightnessDefaultValues = {
  brightness: 0
};

/**
 * Brightness filter class
 * @example
 * const filter = new Brightness({
 *   brightness: 0.05
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Brightness extends BaseFilter {
  getFragmentSource() {
    return fragmentSource;
  }

  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
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
    const brightness = Math.round(this.brightness * 255);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] + brightness;
      data[i + 1] = data[i + 1] + brightness;
      data[i + 2] = data[i + 2] + brightness;
    }
  }
  isNeutralState() {
    return this.brightness === 0;
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uBrightness, this.brightness);
  }
}
/**
 * Brightness value, from -1 to 1.
 * translated to -255 to 255 for 2d
 * 0.0039215686 is the part of 1 that get translated to 1 in 2d
 * @param {Number} brightness
 * @default
 */
_defineProperty(Brightness, "type", 'Brightness');
_defineProperty(Brightness, "defaults", brightnessDefaultValues);
_defineProperty(Brightness, "uniformLocations", ['uBrightness']);
classRegistry.setClass(Brightness);

export { Brightness, brightnessDefaultValues };
//# sourceMappingURL=Brightness.mjs.map
