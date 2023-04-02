import {
  Canvas as CanvasBase,
  StaticCanvas as StaticCanvasBase,
  Image as ImageBase,
  classRegistry,
} from './fabric';
import { TDestroyedCanvas } from './src/canvas/SelectableCanvas';
import { ImageSource } from './src/shapes/Image';

export * from './fabric';

export class Image extends ImageBase {
  constructor(elementId: string, options?: any);
  constructor(element: ImageSource, options?: any);
  constructor(arg0: ImageSource | string, options?: any) {
    super(
      // eslint-disable-next-line no-restricted-globals
      typeof arg0 === 'string' ? document.getElementById(arg0) : arg0,
      options
    );
  }
}

classRegistry.setClass(Image);

function markCanvasElement(el: HTMLCanvasElement) {
  if (el.hasAttribute('data-fabric')) {
    /* _DEV_MODE_START_ */
    throw new Error(
      'fabric.js: trying to initialize a canvas that has already been initialized'
    );
    /* _DEV_MODE_END_ */
  }
  el.classList.add('lower-canvas');
  el.setAttribute('data-fabric', 'main');
  el.setAttribute('data-style', el.style.cssText);
}

function cleanupCanvasElement(
  el: HTMLCanvasElement,
  width: number,
  height: number
) {
  // restore canvas style and attributes
  el.classList.remove('lower-canvas');
  el.removeAttribute('data-fabric');
  // restore canvas size to original size in case retina scaling was applied
  el.setAttribute('width', `${width}`);
  el.setAttribute('height', `${height}`);
  el.style.cssText = el.getAttribute('data-style') || '';
  el.removeAttribute('data-style');
}

export class StaticCanvas extends StaticCanvasBase {
  protected _createLowerCanvas(canvasEl?: string | HTMLCanvasElement): void {
    super._createLowerCanvas(
      typeof canvasEl === 'string'
        ? // eslint-disable-next-line no-restricted-globals
          (document.getElementById(canvasEl) as HTMLCanvasElement)
        : canvasEl
    );
    markCanvasElement(this.lowerCanvasEl);
  }

  destroy(): void {
    const el = this.lowerCanvasEl;
    super.destroy();
    cleanupCanvasElement(el, this.width, this.height);
  }
}

export class Canvas extends CanvasBase {
  protected _createLowerCanvas(canvasEl?: string | HTMLCanvasElement): void {
    super._createLowerCanvas(
      typeof canvasEl === 'string'
        ? // eslint-disable-next-line no-restricted-globals
          (document.getElementById(canvasEl) as HTMLCanvasElement)
        : canvasEl
    );
    markCanvasElement(this.lowerCanvasEl);
  }

  destroy(this: TDestroyedCanvas<this>): void {
    const el = this.lowerCanvasEl!;
    super.destroy();
    cleanupCanvasElement(el, this.width, this.height);
  }
}
