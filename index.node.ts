import './src/env/node';

import type { Canvas as NodeCanvas, JpegConfig, PngConfig } from 'canvas';
import {
  Canvas as CanvasBase,
  getEnv,
  StaticCanvas as StaticCanvasBase,
} from './fabric';
import { FabricObject } from './src/shapes/Object/Object';

// TODO: move back to default values when refactoring to method
FabricObject.prototype.objectCaching = false;

export * from './fabric';

function getNodeCanvas(canvasEl: HTMLCanvasElement) {
  const impl = getEnv().jsdomImplForWrapper(canvasEl);
  return (impl._canvas || impl._image) as NodeCanvas;
}

export class StaticCanvas extends StaticCanvasBase {
  getNodeCanvas() {
    return getNodeCanvas(this.lowerCanvasEl);
  }
  createPNGStream(opts?: PngConfig) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
}

export class Canvas extends CanvasBase {
  getNodeCanvas() {
    return getNodeCanvas(this.lowerCanvasEl);
  }
  createPNGStream(opts?: PngConfig) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
}
