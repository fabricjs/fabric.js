// first we set the env variable by importing the node env file
import { getNodeCanvas, dispose } from './src/env/node';

import type { JpegConfig, PngConfig } from 'canvas';
import {
  Canvas as CanvasBase,
  StaticCanvas as StaticCanvasBase,
  Image as ImageBase,
  classRegistry,
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
  destroy(): void {
    const canvasElement = this.lowerCanvasEl!;
    super.destroy();
    dispose(canvasElement);
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
    return getNodeCanvas(this.lowerCanvasEl);
  }
  createPNGStream(opts?: PngConfig) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
  destroy(): void {
    const upperCanvasEl = this.upperCanvasEl!;
    const pixelFindCanvasEl = this.pixelFindCanvasEl!;
    super.destroy();
    dispose(upperCanvasEl);
    dispose(pixelFindCanvasEl);
  }
}

export class Image extends ImageBase {
  dispose() {
    const elements = [
      this._originalElement,
      this._element,
      this._filteredEl,
      this._cacheCanvas,
    ];
    super.dispose();
    elements.forEach((el) => el && dispose(el));
  }
}

classRegistry.setClass(Image);
classRegistry.setSVGClass(Image);
