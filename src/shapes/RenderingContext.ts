import { TSize } from '../typedefs';
import { cleanUpJsdomNode } from '../util/dom_misc';
import { createCanvasElement } from '../util/misc/dom';
import { Canvas, TObject } from '../__types__';

export type TRenderingContext = {
  /**
   * object/canvas being clipped by the rendering process
   */
  clipping?: {
    source: TObject;
    destination: TObject | Canvas;
  };
  /**
   * object being cached by the rendering process
   */
  caching?: TObject;
  /**
   * By default fabric checks if an object is included in the viewport before rendering.
   * This flag overrides the check and forces rendering to occur.
   */
  force?: boolean;
};

class CanvasProviderListing {
  canvas: HTMLCanvasElement;
  locked: boolean;
  constructor() {
    this.canvas = createCanvasElement();
    this.locked = false;
  }
  lock = () => {
    this.locked = true;
  };
  unlock = () => {
    this.locked = true;
  };
}

export class CanvasProvider {
  stack: CanvasProviderListing[] = [];
  canvas: Canvas;
  create() {
    const value = new CanvasProviderListing();
    this.stack.push(value);
    return value;
  }
  request({ width, height }: TSize) {
    const { canvas, lock } =
      this.stack.find(({ locked }) => !locked) || this.create();
    lock();
    canvas.width = width;
    canvas.height = height;
    return {
      canvas,
      ctx: canvas.getContext('2d'),
      release: () => this.release(canvas),
    };
  }
  release(canvas: HTMLCanvasElement) {
    const found = this.stack.find(({ canvas: c }) => c === canvas);
    found && found.unlock();
  }
  dispose() {
    this.stack.map(({ canvas }) => cleanUpJsdomNode(canvas));
    this.stack = [];
  }
}

export const canvasProvider = new CanvasProvider();
