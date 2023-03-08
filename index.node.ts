// first we set the env variable by importing the node env file
import { getNodeCanvas } from './src/env/node';

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
