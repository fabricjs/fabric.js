import { fabric } from '../../HEADER';
import { config } from '../config';
import { createCanvasElement } from '../util/misc/dom';
import { Canvas2dFilterBackend } from './2d_backend.class';
import { WebGLFilterBackend } from './webgl_backend.class';

export const enum WebGLPrecision {
  low = 'lowp',
  medium = 'mediump',
  high = 'highp',
}

/**
 * Lazy initialize WebGL contants
 */
class WebGLProbe {
  private initialized = false;

  private _maxTextureSize?: number;

  private _webGLPrecision: WebGLPrecision;

  get maxTextureSize() {
    this.queryWebGL();
    return this._maxTextureSize;
  }

  get webGLPrecision() {
    this.queryWebGL();
    return this._webGLPrecision;
  }

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
  private queryWebGL() {
    if (this.initialized || fabric.isLikelyNode) {
      return;
    }
    const canvas = createCanvasElement();
    const gl = canvas.getContext('webgl');
    if (gl) {
      this._maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      this._webGLPrecision = WebGLPrecision.find((key) =>
        this.testPrecision(gl, key)
      );
      console.log(`fabric: max texture size ${this._maxTextureSize}`);
    }
    this.initialized = true;
  }

  isSupported(textureSize: number) {
    return this.maxTextureSize && this.maxTextureSize >= textureSize;
  }
}

export const webGLProbe = new WebGLProbe();

export function initFilterBackend():
  | WebGLFilterBackend
  | Canvas2dFilterBackend {
  if (config.enableGLFiltering && webGLProbe.isSupported(config.textureSize)) {
    return new WebGLFilterBackend({ tileSize: config.textureSize });
  } else {
    return new Canvas2dFilterBackend();
  }
}

fabric.Canvas2dFilterBackend = Canvas2dFilterBackend;
fabric.WebglFilterBackend = WebGLFilterBackend;
fabric.initFilterBackend = initFilterBackend;
