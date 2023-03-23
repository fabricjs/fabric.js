export enum GLPrecision {
  low = 'lowp',
  medium = 'mediump',
  high = 'highp',
}

export abstract class GLProbe {
  declare GLPrecision: GLPrecision | undefined;
  abstract queryWebGL(canvas: HTMLCanvasElement): void;
  abstract isSupported(textureSize: number): boolean;
}
