import { getEnv, getFabricDocument } from '../../env';
import type { TSize } from '../../typedefs';
import type { CSSDimensions } from './util';
import { setCSSDimensions, getElementOffset } from './util';
import { createCanvasElement, isHTMLCanvas } from '../../util/misc/dom';
import { setCanvasDimensions } from './util';
import { FabricError } from '../../util/internals/console';

export type CanvasItem = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export class StaticCanvasDOMManager {
  /**
   * Keeps a copy of the canvas style before setting retina scaling and other potions
   * in order to return it to original state on dispose
   * @type string
   */
  private _originalCanvasStyle?: string;

  lower: CanvasItem;

  constructor(arg0?: string | HTMLCanvasElement) {
    const el = this.createLowerCanvas(arg0);
    this.lower = { el, ctx: el.getContext('2d')! };
  }

  protected createLowerCanvas(arg0?: HTMLCanvasElement | string) {
    // canvasEl === 'HTMLCanvasElement' does not work on jsdom/node
    const el = isHTMLCanvas(arg0)
      ? arg0
      : (arg0 &&
          (getFabricDocument().getElementById(arg0) as HTMLCanvasElement)) ||
        createCanvasElement();
    if (el.hasAttribute('data-fabric')) {
      throw new FabricError(
        'Trying to initialize a canvas that has already been initialized. Did you forget to dispose the canvas?',
      );
    }
    this._originalCanvasStyle = el.style.cssText;
    el.setAttribute('data-fabric', 'main');
    el.classList.add('lower-canvas');
    return el;
  }

  cleanupDOM({ width, height }: TSize) {
    const { el } = this.lower;
    // restore canvas style and attributes
    el.classList.remove('lower-canvas');
    el.removeAttribute('data-fabric');
    // restore canvas size to original size in case retina scaling was applied
    el.setAttribute('width', `${width}`);
    el.setAttribute('height', `${height}`);
    el.style.cssText = this._originalCanvasStyle || '';
    this._originalCanvasStyle = undefined;
  }

  setDimensions(size: TSize, retinaScaling: number) {
    const { el, ctx } = this.lower;
    setCanvasDimensions(el, ctx, size, retinaScaling);
  }

  setCSSDimensions(size: Partial<CSSDimensions>) {
    setCSSDimensions(this.lower.el, size);
  }

  /**
   * Calculates canvas element offset relative to the document
   */
  calcOffset() {
    return getElementOffset(this.lower.el);
  }

  dispose() {
    getEnv().dispose(this.lower.el);
    // @ts-expect-error disposing
    delete this.lower;
  }
}
