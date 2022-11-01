import type { WebGLFilterBackend } from './webgl_backend.class';
import type { Canvas2dFilterBackend } from './2d_backend.class';

export type TProgramCache = any;

export type TTextureCache = any;

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
}

export type T2DPipelineState = {
  sourceWidth: number;
  sourceHeight: number;
  filterBackend: Canvas2dFilterBackend;
  canvasEl: HTMLCanvasElement;
  imageData: ImageData;
  originalEl: HTMLCanvasElement | HTMLImageElement;
  originalImageData?: ImageData;
  ctx: CanvasRenderingContext2D;
}

export type TApplyFilterArgs = {

}
