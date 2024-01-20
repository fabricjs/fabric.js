// First we set the env variable

import { setEnv } from './src/env';
import { getEnv, getNodeCanvas } from './src/env/node';

setEnv(getEnv());

// After the env is set we can export everything and expose specific node functionality

import type { JpegConfig, PngConfig } from 'canvas';
import {
  Canvas as CanvasBase,
  StaticCanvas as StaticCanvasBase,
} from './fabric';
import { FabricObject } from './src/shapes/Object/Object';

FabricObject.ownDefaults.objectCaching = false;

export * from './fabric';

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
