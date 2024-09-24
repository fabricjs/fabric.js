export type GLPrecision = 'lowp' | 'mediump' | 'highp';
export declare abstract class GLProbe {
    GLPrecision: GLPrecision | undefined;
    abstract queryWebGL(canvas: HTMLCanvasElement): void;
    abstract isSupported(textureSize: number): boolean;
}
//# sourceMappingURL=GLProbe.d.ts.map