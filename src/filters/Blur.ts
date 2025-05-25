import { BaseFilter } from './BaseFilter';
import type {
  TWebGLPipelineState,
  T2DPipelineState,
  TWebGLUniformLocationMap,
} from './typedefs';
import { isWebGLPipelineState } from './utils';
import { classRegistry } from '../ClassRegistry';
import { fragmentSource } from './shaders/blur';

type BlurOwnProps = {
  blur: number;
};

export const blurDefaultValues: BlurOwnProps = {
  blur: 0,
};

/**
 * Blur filter class
 * @example
 * const filter = new Blur({
 *   blur: 0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export class Blur extends BaseFilter<'Blur', BlurOwnProps> {
  /**
   * blur value, in percentage of image dimensions.
   * specific to keep the image blur constant at different resolutions
   * range between 0 and 1.
   * @type Number
   * @default
   */
  declare blur: BlurOwnProps['blur'];

  declare horizontal: boolean;
  declare aspectRatio: number;

  static type = 'Blur';

  static defaults = blurDefaultValues;

  static uniformLocations = ['uDelta'];

  getFragmentSource(): string {
    return fragmentSource;
  }

  applyTo(options: TWebGLPipelineState | T2DPipelineState) {
    if (isWebGLPipelineState(options)) {
      // this aspectRatio is used to give the same blur to vertical and horizontal
      this.aspectRatio = options.sourceWidth / options.sourceHeight;
      options.passes++;
      this._setupFrameBuffer(options);
      this.horizontal = true;
      this.applyToWebGL(options);
      this._swapTextures(options);
      this._setupFrameBuffer(options);
      this.horizontal = false;
      this.applyToWebGL(options);
      this._swapTextures(options);
    } else {
      this.applyTo2d(options);
    }
  }

  applyTo2d({ imageData: { data, width, height } }: T2DPipelineState) {
    // this code mimic the shader for output consistency
    // it samples 31 pixels across the image over a distance that depends from the blur value.
    this.aspectRatio = width / height;
    this.horizontal = true;
    let blurValue = this.getBlurValue() * width;
    const samples = 15;
    for (let i = 0; i < data.length; i += 4) {
      let r = 0.0,
        g = 0.0,
        b = 0.0,
        a = 0.0;
      const minIRow = i - (i % (width * 4));
      const maxIRow = minIRow + 4 * width;
      for (let j = -samples + 1; j < samples; j += 1) {
        const percent = j / samples;
        const distance = Math.floor(blurValue * percent) * 4;
        const weight = 1 - Math.abs(percent);
        let displacement = i + distance;
        // try to implement edge mirroring
        if (displacement < minIRow) {
          displacement += minIRow - displacement;
        } else if (displacement > maxIRow) {
          displacement -= displacement - maxIRow;
        }
        const localAlpha = (data[displacement + 3] * weight) / 255 / samples;
        r += data[displacement] * localAlpha;
        g += data[displacement + 1] * localAlpha;
        b += data[displacement + 2] * localAlpha;
        a += localAlpha;
      }
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a * 255;
    }
    for (let i = 0; i < data.length; i += 4) {
      let r = 0.0,
        g = 0.0,
        b = 0.0,
        a = 0.0;
      const minIRow = 0;
      const maxIRow = data.length;
      for (let j = -samples + 1; j < samples; j += 1) {
        const percent = j / samples;
        const distance = Math.floor(blurValue * percent) * 4 * width;
        const weight = 1 - Math.abs(percent);
        let displacement = i + distance;
        // try to implement edge mirroring
        if (displacement < minIRow) {
          displacement += minIRow - displacement;
        } else if (displacement > maxIRow) {
          displacement -= displacement - maxIRow;
        }
        const localAlpha = (data[displacement + 3] * weight) / samples;
        r += data[displacement] * localAlpha;
        g += data[displacement + 1] * localAlpha;
        b += data[displacement + 2] * localAlpha;
        a += localAlpha;
      }
      data[i] = r / 255;
      data[i + 1] = g / 255;
      data[i + 2] = b / 255;
      data[i + 3] = a;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(
    gl: WebGLRenderingContext,
    uniformLocations: TWebGLUniformLocationMap,
  ) {
    const delta = this.chooseRightDelta();
    gl.uniform2fv(uniformLocations.uDelta, delta);
  }

  isNeutralState() {
    return this.blur === 0;
  }

  getBlurValue(): number {
    let blurScale = 1;
    const { horizontal, aspectRatio } = this;
    if (horizontal) {
      if (aspectRatio > 1) {
        // image is wide, i want to shrink radius horizontal
        blurScale = 1 / aspectRatio;
      }
    } else {
      if (aspectRatio < 1) {
        // image is tall, i want to shrink radius vertical
        blurScale = aspectRatio;
      }
    }
    return blurScale * this.blur * 0.12;
  }

  /**
   * choose right value of image percentage to blur with
   * @returns {Array} a numeric array with delta values
   */
  chooseRightDelta() {
    const blur = this.getBlurValue();
    return this.horizontal ? [blur, 0] : [0, blur];
  }
}

classRegistry.setClass(Blur);
