import { createCanvasElement } from '../util/misc/dom';
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

  applyTo2d(options: T2DPipelineState) {
    options.imageData = this.simpleBlur(options);
  }

  simpleBlur({
    ctx,
    imageData,
    filterBackend: { resources },
  }: T2DPipelineState) {
    const { width, height } = imageData;
    if (!resources.blurLayer1) {
      resources.blurLayer1 = createCanvasElement();
      resources.blurLayer2 = createCanvasElement();
    }
    const canvas1 = resources.blurLayer1!;
    const canvas2 = resources.blurLayer2!;
    if (canvas1.width !== width || canvas1.height !== height) {
      canvas2.width = canvas1.width = width;
      canvas2.height = canvas1.height = height;
    }
    const ctx1 = canvas1.getContext('2d')!,
      ctx2 = canvas2.getContext('2d')!,
      nSamples = 15,
      blur = this.blur * 0.06 * 0.5;
    let random, percent, j, i;

    // load first canvas
    ctx1.putImageData(imageData, 0, 0);
    ctx2.clearRect(0, 0, width, height);

    for (i = -nSamples; i <= nSamples; i++) {
      random = (Math.random() - 0.5) / 4;
      percent = i / nSamples;
      j = blur * percent * width + random;
      ctx2.globalAlpha = 1 - Math.abs(percent);
      ctx2.drawImage(canvas1, j, random);
      ctx1.drawImage(canvas2, 0, 0);
      ctx2.globalAlpha = 1;
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    }
    for (i = -nSamples; i <= nSamples; i++) {
      random = (Math.random() - 0.5) / 4;
      percent = i / nSamples;
      j = blur * percent * height + random;
      ctx2.globalAlpha = 1 - Math.abs(percent);
      ctx2.drawImage(canvas1, random, j);
      ctx1.drawImage(canvas2, 0, 0);
      ctx2.globalAlpha = 1;
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    }
    ctx.drawImage(canvas1, 0, 0);
    const newImageData = ctx.getImageData(0, 0, canvas1.width, canvas1.height);
    ctx1.globalAlpha = 1;
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    return newImageData;
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

  /**
   * choose right value of image percentage to blur with
   * @returns {Array} a numeric array with delta values
   */
  chooseRightDelta() {
    let blurScale = 1;
    const delta = [0, 0];
    if (this.horizontal) {
      if (this.aspectRatio > 1) {
        // image is wide, i want to shrink radius horizontal
        blurScale = 1 / this.aspectRatio;
      }
    } else {
      if (this.aspectRatio < 1) {
        // image is tall, i want to shrink radius vertical
        blurScale = this.aspectRatio;
      }
    }
    const blur = blurScale * this.blur * 0.12;
    if (this.horizontal) {
      delta[0] = blur;
    } else {
      delta[1] = blur;
    }
    return delta;
  }
}

classRegistry.setClass(Blur);
