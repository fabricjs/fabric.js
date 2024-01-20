export type GLPrecision = 'lowp' | 'mediump' | 'highp';

export abstract class GLProbe {
  declare GLPrecision: GLPrecision | undefined;
  abstract queryWebGL(canvas: HTMLCanvasElement): void;
  abstract isSupported(textureSize: number): boolean;
}
