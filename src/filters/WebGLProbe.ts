import { getEnv } from '../env';
import { createCanvasElement } from '../util/misc/dom';

export enum WebGLPrecision {
  low = 'lowp',
  medium = 'mediump',
  high = 'highp',
}

/**
 * Lazy initialize WebGL constants
 */
class WebGLProbe {
  maxTextureSize?: number;

  webGLPrecision: WebGLPrecision | undefined;

  /**
   * Tests if webgl supports certain precision
   * @param {WebGL} Canvas WebGL context to test on
   * @param {WebGLPrecision} Precision to test can be any of following
   * @returns {Boolean} Whether the user's browser WebGL supports given precision.
   */
  private testPrecision(
    gl: WebGLRenderingContext,
    precision: WebGLPrecision
  ): boolean {
    const fragmentSource = `precision ${precision} float;\nvoid main(){}`;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      return false;
    }
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    return !!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
  }

  /**
   * query browser for WebGL
   * @returns config object if true
   */
  queryWebGL() {
    if (getEnv().isLikelyNode) {
      return;
    }
    const canvas = createCanvasElement();
    const gl = canvas.getContext('webgl');
    if (gl) {
      this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      this.webGLPrecision = Object.values(WebGLPrecision).find((precision) =>
        this.testPrecision(gl, precision)
      );
      console.log(`fabric: max texture size ${this.maxTextureSize}`);
    }
  }

  isSupported(textureSize: number) {
    return this.maxTextureSize && this.maxTextureSize >= textureSize;
  }
}

export const webGLProbe = new WebGLProbe();
