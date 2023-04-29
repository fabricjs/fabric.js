import { Image } from '../shapes/Image';
import type { TClassProperties } from '../typedefs';
import { createCanvasElement } from '../util/misc/dom';
import { BaseFilter } from './BaseFilter';
import type {
  T2DPipelineState,
  TWebGLPipelineState,
  TWebGLUniformLocationMap,
} from './typedefs';
import { WebGLFilterBackend } from './WebGLFilterBackend';
import { classRegistry } from '../ClassRegistry';
import { fragmentSource } from './shaders/blendImage';

export type TBlendImageMode = 'multiply' | 'mask';

export const blendImageDefaultValues: Partial<TClassProperties<BlendImage>> = {
  mode: 'multiply',
  alpha: 1,
  vertexSource: `
    attribute vec2 aPosition;
    varying vec2 vTexCoord;
    varying vec2 vTexCoord2;
    uniform mat3 uTransformMatrix;
    void main() {
      vTexCoord = aPosition;
      vTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;
      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
    }
    `,
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
 *  mode: 'multiply',
 *  alpha: 0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export class BlendImage extends BaseFilter {
  /**
   * Color to make the blend operation with. default to a reddish color since black or white
   * gives always strong result.
   **/
  declare image: Image;

  declare mode: TBlendImageMode;

  /**
   * alpha value. represent the strength of the blend image operation.
   * not implemented.
   **/
  declare alpha: number;

  static defaults = blendImageDefaultValues;

  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }

  getFragmentSource(): string {
    return fragmentSource[this.mode];
  }

  applyToWebGL(options: TWebGLPipelineState) {
    const gl = options.context,
      texture = this.createTexture(options.filterBackend, this.image);
    this.bindAdditionalTexture(gl, texture, gl.TEXTURE1);
    super.applyToWebGL(options);
    this.unbindAdditionalTexture(gl, gl.TEXTURE1);
  }

  createTexture(backend: WebGLFilterBackend, image: Image) {
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
      { width, height } = image.getElement();
    return [
      1 / image.scaleX,
      0,
      0,
      0,
      1 / image.scaleY,
      0,
      -image.left / width,
      -image.top / height,
      1,
    ];
  }

  /**
   * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({
    imageData: { data, width, height },
    filterBackend: { resources },
  }: T2DPipelineState) {
    const image = this.image;
    if (!resources.blendImage) {
      resources.blendImage = createCanvasElement();
    }
    const canvas1 = resources.blendImage;
    const context = canvas1.getContext('2d')!;
    if (canvas1.width !== width || canvas1.height !== height) {
      canvas1.width = width;
      canvas1.height = height;
    } else {
      context.clearRect(0, 0, width, height);
    }
    context.setTransform(
      image.scaleX,
      0,
      0,
      image.scaleY,
      image.left,
      image.top
    );
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
          data[i] = (r * tr) / 255;
          data[i + 1] = (g * tg) / 255;
          data[i + 2] = (b * tb) / 255;
          data[i + 3] = (a * ta) / 255;
          break;
        case 'mask':
          data[i + 3] = ta;
          break;
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
      uTransformMatrix: gl.getUniformLocation(program, 'uTransformMatrix'),
      uImage: gl.getUniformLocation(program, 'uImage'),
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
    const matrix = this.calculateMatrix();
    gl.uniform1i(uniformLocations.uImage, 1); // texture unit 1.
    gl.uniformMatrix3fv(uniformLocations.uTransformMatrix, false, matrix);
  }

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return {
      type: this.type,
      image: this.image && this.image.toObject(),
      mode: this.mode,
      alpha: this.alpha,
    };
  }

  /**
   * Create filter instance from an object representation
   * @static
   * @param {object} object Object to create an instance from
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting image loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<BlendImage>}
   */
  static fromObject(
    { type, image, ...filterOptions }: Record<string, any>,
    options: { signal: AbortSignal }
  ) {
    return Image.fromObject(image, options).then(
      (enlivedImage) =>
        new this({ ...filterOptions, image: enlivedImage }) as BaseFilter
    );
  }
}

classRegistry.setClass(BlendImage);
