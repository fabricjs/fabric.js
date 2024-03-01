import { getFabricDocument } from '../../env';
import type { TSize } from '../../typedefs';
import { createCanvasElement, setStyle } from '../../util';
import { allowTouchScrolling, makeElementUnselectable } from './util';
import { StaticCanvasDOMManager } from './StaticCanvasDOMManager';

export class CanvasDOMManager extends StaticCanvasDOMManager<{
  main: HTMLCanvasElement;
  top: HTMLCanvasElement;
}> {
  /**
   * Keeps a copy of the canvas style before setting retina scaling and other potions
   * in order to return it to original state on dispose
   * @type string
   */
  private _originalCanvasStyle?: string;

  static build(
    arg0?: string | HTMLCanvasElement,
    {
      allowTouchScrolling: touchScrollingEnabled = false,
      containerClass = '',
    }: {
      allowTouchScrolling?: boolean;
      /**
       * @deprecated here only for backward compatibility
       */
      containerClass?: string;
    } = {}
  ) {
    const lowerCanvasEl = this.createLowerCanvas(arg0);
    const style = lowerCanvasEl.style.cssText;
    allowTouchScrolling(lowerCanvasEl, touchScrollingEnabled);
    makeElementUnselectable(lowerCanvasEl);

    const upperCanvasEl = this.createUpperCanvas(lowerCanvasEl);

    setStyle(upperCanvasEl, {
      position: 'absolute',
      left: '0',
      top: '0',
    });
    allowTouchScrolling(upperCanvasEl, touchScrollingEnabled);
    makeElementUnselectable(upperCanvasEl);

    const container = this.createContainerElement();
    container.classList.add(containerClass);
    lowerCanvasEl.parentNode &&
      lowerCanvasEl.parentNode.replaceChild(container, lowerCanvasEl);
    container.append(lowerCanvasEl, upperCanvasEl);

    const manager = new this({ main: lowerCanvasEl, top: upperCanvasEl });
    manager._originalCanvasStyle = style;
    return manager;
  }

  static createUpperCanvas(lowerCanvasEl: HTMLCanvasElement) {
    const el = createCanvasElement();
    // we assign the same classname of the lowerCanvas
    el.className = lowerCanvasEl.className;
    // but then we remove the lower-canvas specific className
    el.classList.remove('lower-canvas');
    // we add the specific upper-canvas class
    el.classList.add('upper-canvas');
    el.setAttribute('data-fabric', 'top');
    el.style.cssText = lowerCanvasEl.style.cssText;
    return el;
  }

  static createContainerElement() {
    const container = getFabricDocument().createElement('div');
    container.setAttribute('data-fabric', 'wrapper');
    setStyle(container, {
      position: 'relative',
    });
    makeElementUnselectable(container);
    return container;
  }

  cleanupDOM(size: TSize) {
    const container = this.items.main.el.parentNode,
      {
        main: { el: lowerCanvasEl },
        top: { el: upperCanvasEl },
      } = this.items;

    super.cleanupDOM(size);
    if (container) {
      container.removeChild(upperCanvasEl);
      container.removeChild(lowerCanvasEl);
      container.parentNode &&
        container.parentNode.replaceChild(lowerCanvasEl, container);
    }
    lowerCanvasEl.style.cssText = this._originalCanvasStyle || '';
    delete this._originalCanvasStyle;
  }
}
