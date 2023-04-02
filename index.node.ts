// first we set the env variable by importing the node env file
import './src/env/node';

import type { Canvas as NodeCanvas, JpegConfig, PngConfig } from 'canvas';
import {
  StaticCanvas as StaticCanvasBase,
  Canvas as CanvasBase,
} from './fabric';
import { FabricObject } from './src/shapes/Object/Object';
import { TSize } from './src/typedefs';

FabricObject.ownDefaults.objectCaching = false;

export * from './fabric';

export class StaticCanvas extends StaticCanvasBase {
  declare lowerCanvasEl: NodeCanvas;
  protected _setDimensionsImpl(dimensions: Partial<TSize>): void {
    super._setDimensionsImpl(dimensions, {
      cssOnly: false,
      backstoreOnly: true,
    });
  }
  createPNGStream(opts?: PngConfig) {
    return this.lowerCanvasEl.createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.lowerCanvasEl.createJPEGStream(opts);
  }
}

export class Canvas extends CanvasBase {
  declare lowerCanvasEl: NodeCanvas;
  protected _setDimensionsImpl(dimensions: Partial<TSize>): void {
    super._setDimensionsImpl(dimensions, {
      cssOnly: false,
      backstoreOnly: true,
    });
  }
  createPNGStream(opts?: PngConfig) {
    return this.lowerCanvasEl.createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.lowerCanvasEl.createJPEGStream(opts);
  }
}
