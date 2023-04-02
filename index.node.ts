// first we set the env variable by importing the node env file
import './src/env/node';

import type { Canvas as NodeCanvas, JpegConfig, PngConfig } from 'canvas';
import {
  Canvas as CanvasBase,
  StaticCanvas as StaticCanvasBase,
} from './fabric';
import { FabricObject } from './src/shapes/Object/Object';

FabricObject.ownDefaults.objectCaching = false;

export * from './fabric';

export class StaticCanvas extends StaticCanvasBase {
  declare lowerCanvasEl: NodeCanvas;
  createPNGStream(opts?: PngConfig) {
    return this.lowerCanvasEl.createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.lowerCanvasEl.createJPEGStream(opts);
  }
}

export class Canvas extends CanvasBase {
  declare lowerCanvasEl: NodeCanvas;
  createPNGStream(opts?: PngConfig) {
    return this.lowerCanvasEl.createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.lowerCanvasEl.createJPEGStream(opts);
  }
}
