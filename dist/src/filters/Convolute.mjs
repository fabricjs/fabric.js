import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { BaseFilter } from './BaseFilter.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { fragmentSource } from './shaders/convolute.mjs';

const convoluteDefaultValues = {
  opaque: false,
  matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0]
};

/**
 * Adapted from <a href="http://www.html5rocks.com/en/tutorials/canvas/imagefilters/">html5rocks article</a>
 * @example <caption>Sharpen filter</caption>
 * const filter = new Convolute({
 *   matrix: [ 0, -1,  0,
 *            -1,  5, -1,
 *             0, -1,  0 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 * @example <caption>Blur filter</caption>
 * const filter = new Convolute({
 *   matrix: [ 1/9, 1/9, 1/9,
 *             1/9, 1/9, 1/9,
 *             1/9, 1/9, 1/9 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 * @example <caption>Emboss filter</caption>
 * const filter = new Convolute({
 *   matrix: [ 1,   1,  1,
 *             1, 0.7, -1,
 *            -1,  -1, -1 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 * @example <caption>Emboss filter with opaqueness</caption>
 * const filter = new Convolute({
 *   opaque: true,
 *   matrix: [ 1,   1,  1,
 *             1, 0.7, -1,
 *            -1,  -1, -1 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
class Convolute extends BaseFilter {
  getCacheKey() {
    return "".concat(this.type, "_").concat(Math.sqrt(this.matrix.length), "_").concat(this.opaque ? 1 : 0);
  }
  getFragmentSource() {
    return fragmentSource[this.getCacheKey()];
  }

  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(options) {
    const imageData = options.imageData,
      data = imageData.data,
      weights = this.matrix,
      side = Math.round(Math.sqrt(weights.length)),
      halfSide = Math.floor(side / 2),
      sw = imageData.width,
      sh = imageData.height,
      output = options.ctx.createImageData(sw, sh),
      dst = output.data,
      // go through the destination image pixels
      alphaFac = this.opaque ? 1 : 0;
    let r, g, b, a, dstOff, scx, scy, srcOff, wt, x, y, cx, cy;
    for (y = 0; y < sh; y++) {
      for (x = 0; x < sw; x++) {
        dstOff = (y * sw + x) * 4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        r = 0;
        g = 0;
        b = 0;
        a = 0;
        for (cy = 0; cy < side; cy++) {
          for (cx = 0; cx < side; cx++) {
            scy = y + cy - halfSide;
            scx = x + cx - halfSide;

            // eslint-disable-next-line max-depth
            if (scy < 0 || scy >= sh || scx < 0 || scx >= sw) {
              continue;
            }
            srcOff = (scy * sw + scx) * 4;
            wt = weights[cy * side + cx];
            r += data[srcOff] * wt;
            g += data[srcOff + 1] * wt;
            b += data[srcOff + 2] * wt;
            // eslint-disable-next-line max-depth
            if (!alphaFac) {
              a += data[srcOff + 3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff + 1] = g;
        dst[dstOff + 2] = b;
        if (!alphaFac) {
          dst[dstOff + 3] = a;
        } else {
          dst[dstOff + 3] = data[dstOff + 3];
        }
      }
    }
    options.imageData = output;
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1fv(uniformLocations.uMatrix, this.matrix);
  }

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return _objectSpread2(_objectSpread2({}, super.toObject()), {}, {
      opaque: this.opaque,
      matrix: [...this.matrix]
    });
  }
}
/*
 * Opaque value (true/false)
 */
/*
 * matrix for the filter, max 9x9
 */
_defineProperty(Convolute, "type", 'Convolute');
_defineProperty(Convolute, "defaults", convoluteDefaultValues);
_defineProperty(Convolute, "uniformLocations", ['uMatrix', 'uOpaque', 'uHalfSize', 'uSize']);
classRegistry.setClass(Convolute);

export { Convolute, convoluteDefaultValues };
//# sourceMappingURL=Convolute.mjs.map
