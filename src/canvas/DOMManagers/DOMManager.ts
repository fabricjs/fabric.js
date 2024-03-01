import { getEnv } from '../../env';
import { TSize } from '../../typedefs';
import {
  CSSDimensions,
  getElementOffset,
  setCSSDimensions,
  setCanvasDimensions,
} from './util';

export type CanvasItem = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export type ItemMap<T = HTMLCanvasElement> =
  | {
      main: T;
      [x: string]: T;
    }
  | {
      main: T;
      top: T;
      [x: string]: T;
    };

export type StaticDOMManagerType = DOMManager<{
  main: HTMLCanvasElement;
  [x: string]: HTMLCanvasElement;
}>;
export type DOMManagerType = DOMManager<{
  main: HTMLCanvasElement;
  top: HTMLCanvasElement;
  [x: string]: HTMLCanvasElement;
}>;

export class DOMManager<T extends ItemMap> {
  readonly items: Record<keyof T, CanvasItem>;

  constructor(items: T) {
    this.items = Object.fromEntries(
      Object.entries(items).map(([key, canvas]) => [
        key,
        { el: canvas, ctx: canvas.getContext('2d')! },
      ])
    ) as Record<keyof T, CanvasItem>;
  }

  setDimensions(size: TSize, retinaScaling: number) {
    Object.values(this.items).forEach(({ el, ctx }) =>
      setCanvasDimensions(el, ctx, size, retinaScaling)
    );
  }

  setCSSDimensions(size: Partial<CSSDimensions>) {
    Object.values(this.items).forEach(({ el }) => setCSSDimensions(el, size));
  }

  /**
   * Calculates canvas element offset relative to the document
   */
  calcOffset() {
    return getElementOffset(this.items.main.el);
  }

  cleanupDOM(size: TSize) {}

  dispose() {
    Object.values(this.items).forEach(({ el }) => {
      getEnv().dispose(el);
    });
    // @ts-expect-error disposing
    this.items = {};
  }
}
