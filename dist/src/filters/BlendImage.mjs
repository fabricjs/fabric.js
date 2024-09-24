import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2, objectWithoutProperties as _objectWithoutProperties } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { FabricImage } from '../shapes/Image.mjs';
import { createCanvasElement } from '../util/misc/dom.mjs';
import { BaseFilter } from './BaseFilter.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { fragmentSource, vertexSource } from './shaders/blendImage.mjs';

const _excluded = ["type", "image"];
const blendImageDefaultValues = {
  mode: 'multiply',
  alpha: 1
};

/**
 * Image Blend filter class
 * @example
 * const filter = new filters.BlendColor({
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
class BlendImage extends BaseFilter {
  getCacheKey() {
    return "".concat(this.type, "_").concat(this.mode);
  }
  getFragmentSource() {
    return fragmentSource[this.mode];
  }
  getVertexSource() {
    return vertexSource;
  }
  applyToWebGL(options) {
    const gl = options.context,
      texture = this.createTexture(options.filterBackend, this.image);
    this.bindAdditionalTexture(gl, texture, gl.TEXTURE1);
    super.applyToWebGL(options);
    this.unbindAdditionalTexture(gl, gl.TEXTURE1);
  }
  createTexture(backend, image) {
    return backend.getCachedTexture(image.cacheKey, image.getElement());
  }

  /**
   * Calculate a transformMatrix to adapt the image to blend over
   * @param {Object} options
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  calculateMatrix() {
    const image = this.image,
      {
        width,
        height
      } = image.getElement();
    return [1 / image.scaleX, 0, 0, 0, 1 / image.scaleY, 0, -image.left / width, -image.top / height, 1];
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
        data,
        width,
        height
      },
      filterBackend: {
        resources
      }
    } = _ref;
    const image = this.image;
    if (!resources.blendImage) {
      resources.blendImage = createCanvasElement();
    }
    const canvas1 = resources.blendImage;
    const context = canvas1.getContext('2d');
    if (canvas1.width !== width || canvas1.height !== height) {
      canvas1.width = width;
      canvas1.height = height;
    } else {
      context.clearRect(0, 0, width, height);
    }
    context.setTransform(image.scaleX, 0, 0, image.scaleY, image.left, image.top);
    context.drawImage(image.getElement(), 0, 0, width, height);
    const blendData = context.getImageData(0, 0, width, height).data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const tr = blendData[i];
      const tg = blendData[i + 1];
      const tb = blendData[i + 2];
      const ta = blendData[i + 3];
      switch (this.mode) {
        case 'multiply':
          data[i] = r * tr / 255;
          data[i + 1] = g * tg / 255;
          data[i + 2] = b * tb / 255;
          data[i + 3] = a * ta / 255;
          break;
        case 'mask':
          data[i + 3] = ta;
          break;
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
    const matrix = this.calculateMatrix();
    gl.uniform1i(uniformLocations.uImage, 1); // texture unit 1.
    gl.uniformMatrix3fv(uniformLocations.uTransformMatrix, false, matrix);
  }

  /**
   * Returns object representation of an instance
   * TODO: Handle the possibility of missing image better.
   * As of now a BlendImage filter without image can't be used with fromObject
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return _objectSpread2(_objectSpread2({}, super.toObject()), {}, {
      image: this.image && this.image.toObject()
    });
  }

  /**
   * Create filter instance from an object representation
   * @static
   * @param {object} object Object to create an instance from
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting image loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<BlendImage>}
   */
  static async fromObject(_ref2, options) {
    let {
        type,
        image
      } = _ref2,
      filterOptions = _objectWithoutProperties(_ref2, _excluded);
    return FabricImage.fromObject(image, options).then(enlivedImage => new this(_objectSpread2(_objectSpread2({}, filterOptions), {}, {
      image: enlivedImage
    })));
  }
}
/**
 * Image to make the blend operation with.
 **/
/**
 * Blend mode for the filter: either 'multiply' or 'mask'. 'multiply' will
 * multiply the values of each channel (R, G, B, and A) of the filter image by
 * their corresponding values in the base image. 'mask' will only look at the
 * alpha channel of the filter image, and apply those values to the base
 * image's alpha channel.
 * @type String
 * @default
 **/
/**
 * alpha value. represent the strength of the blend image operation.
 * not implemented.
 **/
_defineProperty(BlendImage, "type", 'BlendImage');
_defineProperty(BlendImage, "defaults", blendImageDefaultValues);
_defineProperty(BlendImage, "uniformLocations", ['uTransformMatrix', 'uImage']);
classRegistry.setClass(BlendImage);

export { BlendImage, blendImageDefaultValues };
//# sourceMappingURL=BlendImage.mjs.map
