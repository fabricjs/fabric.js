import { getEnv } from '../env';
import type { TSize } from '../typedefs';
import { createCanvasElement } from '../util/misc/dom';

class CanvasProviderItem {
  private locked: boolean;

  constructor(readonly canvas: HTMLCanvasElement) {
    this.locked = false;
  }

  isLocked() {
    return this.locked;
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }
}

export class CanvasProvider {
  stack: CanvasProviderItem[] = [];

  create(canvas = createCanvasElement()) {
    const value = new CanvasProviderItem(canvas);
    this.stack.push(value);
    return value;
  }

  request({ width, height }: TSize) {
    const item = this.stack.find((item) => !item.isLocked()) || this.create();
    item.lock();
    const { canvas } = item;
    canvas.width = width;
    canvas.height = height;
    return {
      ctx: canvas.getContext('2d')!,
      release: () => this.release(canvas),
    };
  }

  release(canvas: HTMLCanvasElement) {
    const found = this.stack.find(({ canvas: c }) => c === canvas);
    found && found.unlock();
  }

  dispose() {
    this.stack.map(({ canvas }) => getEnv().dispose(canvas));
    this.stack = [];
  }
}
