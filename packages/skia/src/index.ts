import {
  BaseFabricObject as FabricObjectBase,
  Canvas as CanvasBase,
  StaticCanvas as StaticCanvasBase,
  setEnv,
} from '@fabricjs/core';
import type { PngConfig, JpegConfig } from '@napi-rs/canvas/node-canvas.js';
import { getEnv, getNodeCanvas } from './env';
import { createPNGStream, createJPEGStream } from './streams';

setEnv(getEnv());
FabricObjectBase.ownDefaults.objectCaching = false;

export * from '@fabricjs/core';
export { GlobalFonts, setTextRenderer } from '@napi-rs/canvas';
export type { Canvas as SkiaCanvas } from '@napi-rs/canvas';
export type { PngConfig, JpegConfig } from '@napi-rs/canvas/node-canvas.js';

export class StaticCanvas extends StaticCanvasBase {
  /** Returns the native Skia canvas, not a node-canvas compatibility wrapper. */
  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(options?: PngConfig) {
    return createPNGStream(this.getNodeCanvas(), options);
  }
  createJPEGStream(options?: JpegConfig) {
    return createJPEGStream(this.getNodeCanvas(), options);
  }
}

/** Prefer StaticCanvas for non-interactive server-side rendering. */
export class Canvas extends CanvasBase {
  /** Returns the native Skia canvas, not a node-canvas compatibility wrapper. */
  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(options?: PngConfig) {
    return createPNGStream(this.getNodeCanvas(), options);
  }
  createJPEGStream(options?: JpegConfig) {
    return createJPEGStream(this.getNodeCanvas(), options);
  }
}
