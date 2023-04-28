import type { WebGLFilterBackend } from './WebGLFilterBackend';
import type { Canvas2dFilterBackend } from './Canvas2dFilterBackend';

export type TProgramCache = any;

export type TTextureCache = any;

export type TPipelineResources = {
  blendImage?: HTMLCanvasElement;
  blurLayer1?: HTMLCanvasElement;
  blurLayer2?: HTMLCanvasElement;
} & Record<string, unknown>;

export type TWebGLPipelineState = {
  filterBackend: WebGLFilterBackend;
  originalWidth: number;
  originalHeight: number;
  sourceWidth: number;
  sourceHeight: number;
  destinationWidth: number;
  destinationHeight: number;
  context: WebGLRenderingContext;
  sourceTexture: WebGLTexture | null;
  targetTexture: WebGLTexture | null;
  originalTexture: WebGLTexture;
  passes: number;
  webgl: boolean;
  aPosition: Float32Array;
  programCache: TProgramCache;
  pass: number;
  targetCanvas: HTMLCanvasElement;
};

export type T2DPipelineState = {
  sourceWidth: number;
  sourceHeight: number;
  filterBackend: Canvas2dFilterBackend;
  canvasEl: HTMLCanvasElement;
  imageData: ImageData;
  originalEl: CanvasImageSource;
  originalImageData?: ImageData;
  ctx: CanvasRenderingContext2D;
  helpLayer?: HTMLCanvasElement;
};

export type TWebGLUniformLocationMap = Record<
  string,
  WebGLUniformLocation | null
>;

export type TWebGLAttributeLocationMap = Record<string, number>;

export type TWebGLProgramCacheItem = {
  program: WebGLProgram;
  attributeLocations: TWebGLAttributeLocationMap;
  uniformLocations: TWebGLUniformLocationMap;
};

export type TApplyFilterArgs = {};

export const isWebGLPipelineState = (
  options: TWebGLPipelineState | T2DPipelineState
): options is TWebGLPipelineState => {
  return (options as TWebGLPipelineState).webgl !== undefined;
};
