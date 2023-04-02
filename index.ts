import {
  Canvas as CanvasBase,
  StaticCanvas as StaticCanvasBase,
  Image as ImageBase,
} from './fabric';
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
}
