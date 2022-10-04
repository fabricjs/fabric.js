import { TSize } from '../typedefs';
import { cleanUpJsdomNode } from './dom_misc';
import { createCanvasElement } from './misc/dom';
import { Canvas } from '../__types__';

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
  request({ width = 0, height = 0 }: Partial<TSize> = {}) {
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
