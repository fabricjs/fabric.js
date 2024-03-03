import { getFabricDocument } from '../../env';
import type { TSize } from '../../typedefs';
import { FabricError } from '../../util/internals/console';
import { createCanvasElement, isHTMLCanvas } from '../../util/misc/dom';
import type { ItemMap } from './DOMManager';
import { DOMManager } from './DOMManager';

export class StaticCanvasDOMManager<
  T extends ItemMap = {
    main: HTMLCanvasElement;
  }
> extends DOMManager<T> {
  static build(arg0?: string | HTMLCanvasElement) {
    return new this({ main: this.createLowerCanvas(arg0) });
  }

  static createLowerCanvas(arg0?: HTMLCanvasElement | string) {
    // canvasEl === 'HTMLCanvasElement' does not work on jsdom/node
    const el = isHTMLCanvas(arg0)
      ? arg0
      : (arg0 &&
          (getFabricDocument().getElementById(arg0) as HTMLCanvasElement)) ||
        createCanvasElement();
    if (el.hasAttribute('data-fabric')) {
      throw new FabricError(
        'Trying to initialize a canvas that has already been initialized. Did you forget to dispose the canvas?'
      );
    }
    el.setAttribute('data-fabric', 'main');
    el.classList.add('lower-canvas');
    return el;
  }

  cleanupDOM(size: TSize) {
    const { el } = this.items.main;
    super.cleanupDOM(size);
    // restore canvas style and attributes
    el.classList.remove('lower-canvas');
    el.removeAttribute('data-fabric');
    // restore canvas size to original size in case retina scaling was applied
    el.setAttribute('width', `${size.width}`);
    el.setAttribute('height', `${size.height}`);
  }
}
