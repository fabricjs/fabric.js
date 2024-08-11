import { GLProbe } from './GLProbe';
/**
 * Lazy initialize WebGL constants
 */
export declare class WebGLProbe extends GLProbe {
    maxTextureSize?: number;
    /**
     * Tests if webgl supports certain precision
     * @param {WebGL} Canvas WebGL context to test on
     * @param {GLPrecision} Precision to test can be any of following
     * @returns {Boolean} Whether the user's browser WebGL supports given precision.
     */
    private testPrecision;
    /**
     * query browser for WebGL
     */
    queryWebGL(canvas: HTMLCanvasElement): void;
    isSupported(textureSize: number): boolean;
}
//# sourceMappingURL=WebGLProbe.d.ts.map