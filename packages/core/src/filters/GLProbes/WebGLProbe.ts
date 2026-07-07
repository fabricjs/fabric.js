import { log } from '../../util/internals/console';
import { GLProbe } from './GLProbe';
import type { GLPrecision } from './GLProbe';

/**
 * Lazy initialize WebGL constants
 */
export class WebGLProbe extends GLProbe {
  declare maxTextureSize?: number;

  /**
   * Tests if webgl supports certain precision
   * @param {WebGL} Canvas WebGL context to test on
   * @param {GLPrecision} Precision to test can be any of following
   * @returns {Boolean} Whether the user's browser WebGL supports given precision.
   */
  private testPrecision(
    gl: WebGLRenderingContext,
    precision: GLPrecision,
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
   */
  queryWebGL(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl');
    if (gl) {
      this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      this.GLPrecision = (['highp', 'mediump', 'lowp'] as const).find(
        (precision) => this.testPrecision(gl, precision),
      );
      gl.getExtension('WEBGL_lose_context')!.loseContext();
      log('log', `WebGL: max texture size ${this.maxTextureSize}`);
    }
  }

  isSupported(textureSize: number) {
    return !!this.maxTextureSize && this.maxTextureSize >= textureSize;
  }
}
