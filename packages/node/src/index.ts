import type { JpegConfig, PngConfig } from 'canvas';
import {
  BaseFabricObject as FabricObjectBase,
  Canvas as CanvasBase,
  StaticCanvas as StaticCanvasBase,
  setEnv,
} from '@fabricjs/core';
import { getEnv, getNodeCanvas } from './env';

// Node owns its runtime env and can eagerly install the JSDOM/canvas-backed
// implementation at import time.
setEnv(getEnv());

FabricObjectBase.ownDefaults.objectCaching = false;

export * from '@fabricjs/core';
export class StaticCanvas extends StaticCanvasBase {
  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(opts?: PngConfig) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
}

/**
 * **NOTICE**:
 * {@link Canvas} is designed for interactivity.
 * Therefore, using it in node has no benefit.
 * Use {@link StaticCanvas} instead.
 */
export class Canvas extends CanvasBase {
  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(opts?: PngConfig) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
}
