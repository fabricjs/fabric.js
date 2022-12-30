export declare enum WebGLPrecision {
    low = "lowp",
    medium = "mediump",
    high = "highp"
}
/**
 * Lazy initialize WebGL constants
 */
declare class WebGLProbe {
    maxTextureSize?: number;
    webGLPrecision: WebGLPrecision | undefined;
    /**
     * Tests if webgl supports certain precision
     * @param {WebGL} Canvas WebGL context to test on
     * @param {WebGLPrecision} Precision to test can be any of following
     * @returns {Boolean} Whether the user's browser WebGL supports given precision.
     */
    private testPrecision;
    /**
     * query browser for WebGL
     * @returns config object if true
     */
    queryWebGL(): void;
    isSupported(textureSize: number): boolean | 0 | undefined;
}
export declare const webGLProbe: WebGLProbe;
export {};
//# sourceMappingURL=WebGLProbe.d.ts.map