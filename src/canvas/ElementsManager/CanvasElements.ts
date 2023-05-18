import { getEnv, getFabricDocument } from '../../env';
import type { TSize } from '../../typedefs';
import {
  createCanvasElement,
  makeElementUnselectable,
  setStyle,
} from '../../util';
import { StaticCanvasElements } from './StaticCanvasElements';
import type { CanvasItem, TCanvasSizeOptions } from './types';
import { setCanvasDimensions } from './util';

export class CanvasElements extends StaticCanvasElements {
  upper: CanvasItem;
  container: HTMLDivElement;

  constructor(
    arg0: string | HTMLCanvasElement,
    { allowTouchScrolling = false }: { allowTouchScrolling?: boolean } = {}
  ) {
    super(arg0);
    const { el: lowerCanvasEl } = this.lower;
    const upperCanvasEl = this.createUpperCanvas();
    this.upper = { el: upperCanvasEl, ctx: upperCanvasEl.getContext('2d')! };
    this.applyCanvasStyle(lowerCanvasEl, {
      position: 'relative',
      allowTouchScrolling,
    });
    this.applyCanvasStyle(upperCanvasEl, {
      position: 'absolute',
      allowTouchScrolling,
    });
    const container = this.createContainerElement();
    if (lowerCanvasEl.parentNode) {
      lowerCanvasEl.parentNode.replaceChild(container, lowerCanvasEl);
    }
    container.append(lowerCanvasEl, upperCanvasEl);
    this.container = container;
  }

  protected createUpperCanvas() {
    const { el: lowerCanvasEl } = this.lower;
    const el = createCanvasElement();
    // we assign the same classname of the lowerCanvas
    el.className = lowerCanvasEl.className;
    // but then we remove the lower-canvas specific className
    el.classList.remove('lower-canvas');
    // we add the specific upper-canvas class
    el.classList.add('upper-canvas');
    el.setAttribute('data-fabric', 'top');
    el.style.cssText = lowerCanvasEl.style.cssText;
    el.setAttribute('draggable', 'true');
    return el;
  }

  protected createContainerElement(/*{ width, height }: TSize*/) {
    const container = getFabricDocument().createElement('div');
    // container.classList.add(this.containerClass);
    container.setAttribute('data-fabric', 'wrapper');
    setStyle(container, {
      // width: `${width}px`,
      // height: `${height}px`,
      position: 'relative',
    });
    makeElementUnselectable(container);
    return container;
  }

  /**
   * @private
   * @param {HTMLCanvasElement} element canvas element to apply styles on
   */
  protected applyCanvasStyle(
    element: HTMLCanvasElement,
    {
      position,
      allowTouchScrolling,
    }: { position: 'relative' | 'absolute'; allowTouchScrolling: boolean }
  ) {
    const touchAction = allowTouchScrolling ? 'manipulation' : 'none';
    setStyle(element, {
      position,
      left: 0,
      top: 0,
      'touch-action': touchAction,
      '-ms-touch-action': touchAction,
    });

    makeElementUnselectable(element);
  }

  setDimensions(size: TSize, options: TCanvasSizeOptions = {}) {
    super.setDimensions(size, options);
    setCanvasDimensions(this.upper, size, options);
    // this.wrapperEl.style[prop] = value;css dims
  }

  cleanupDOM(size: TSize) {
    const container = this.container,
      { el: lowerCanvasEl } = this.lower,
      { el: upperCanvasEl } = this.upper;
    super.cleanupDOM(size);
    container.removeChild(upperCanvasEl);
    container.removeChild(lowerCanvasEl);
    if (container.parentNode) {
      container.parentNode.replaceChild(lowerCanvasEl, container);
    }
  }

  dispose() {
    super.dispose();
    getEnv().dispose(this.upper.el);
    // @ts-expect-error disposing
    delete this.upper;
    // @ts-expect-error disposing
    delete this.container;
  }
}
