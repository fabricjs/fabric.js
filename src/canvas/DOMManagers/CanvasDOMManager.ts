import { getEnv, getFabricDocument } from '../../env';
import type { TSize } from '../../typedefs';
import { createCanvasElement, setStyle } from '../../util';
import type { CSSDimensions } from './util';
import {
  allowTouchScrolling,
  makeElementUnselectable,
  setCSSDimensions,
} from './util';
import type { CanvasItem } from './StaticCanvasDOMManager';
import { StaticCanvasDOMManager } from './StaticCanvasDOMManager';
import { setCanvasDimensions } from './util';

export class CanvasDOMManager extends StaticCanvasDOMManager {
  upper: CanvasItem;
  container: HTMLDivElement;

  constructor(
    arg0?: string | HTMLCanvasElement,
    {
      allowTouchScrolling = false,
      containerClass = '',
    }: {
      allowTouchScrolling?: boolean;
      /**
       * @deprecated here only for backward compatibility
       */
      containerClass?: string;
    } = {}
  ) {
    super(arg0);
    const { el: lowerCanvasEl } = this.lower;
    const upperCanvasEl = this.createUpperCanvas();
    this.upper = { el: upperCanvasEl, ctx: upperCanvasEl.getContext('2d')! };
    this.applyCanvasStyle(lowerCanvasEl, {
      allowTouchScrolling,
    });
    this.applyCanvasStyle(upperCanvasEl, {
      allowTouchScrolling,
    });
    const container = this.createContainerElement();
    container.classList.add(containerClass);
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

  protected createContainerElement() {
    const container = getFabricDocument().createElement('div');
    container.setAttribute('data-fabric', 'wrapper');
    setStyle(container, {
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
    { allowTouchScrolling: allow }: { allowTouchScrolling: boolean }
  ) {
    setStyle(element, {
      position: 'absolute',
      left: '0',
      top: '0',
    });
    allowTouchScrolling(element, allow);
    makeElementUnselectable(element);
  }

  setDimensions(size: TSize, retinaScaling: number) {
    super.setDimensions(size, retinaScaling);
    const { el, ctx } = this.upper;
    setCanvasDimensions(el, ctx, size, retinaScaling);
  }

  setCSSDimensions(size: Partial<CSSDimensions>): void {
    super.setCSSDimensions(size);
    setCSSDimensions(this.upper.el, size);
    setCSSDimensions(this.container, size);
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
