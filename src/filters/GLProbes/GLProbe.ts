export enum GLPrecision {
  low = 'lowp',
  medium = 'mediump',
  high = 'highp',
}

export abstract class GLProbe {
  declare GLPrecision: GLPrecision | undefined;
  abstract queryWebGL(): void;
  abstract isSupported(textureSize: number): boolean;
}
