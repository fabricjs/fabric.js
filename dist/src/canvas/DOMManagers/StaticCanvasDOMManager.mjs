import { defineProperty as _defineProperty } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { getFabricDocument, getEnv } from '../../env/index.mjs';
import { setCanvasDimensions, setCSSDimensions, getElementOffset } from './util.mjs';
import { isHTMLCanvas, createCanvasElement } from '../../util/misc/dom.mjs';
import { FabricError } from '../../util/internals/console.mjs';

class StaticCanvasDOMManager {
  constructor(arg0) {
    /**
     * Keeps a copy of the canvas style before setting retina scaling and other potions
     * in order to return it to original state on dispose
     * @type string
     */
    _defineProperty(this, "_originalCanvasStyle", void 0);
    _defineProperty(this, "lower", void 0);
    const el = this.createLowerCanvas(arg0);
    this.lower = {
      el,
      ctx: el.getContext('2d')
    };
  }
  createLowerCanvas(arg0) {
    // canvasEl === 'HTMLCanvasElement' does not work on jsdom/node
    const el = isHTMLCanvas(arg0) ? arg0 : arg0 && getFabricDocument().getElementById(arg0) || createCanvasElement();
    if (el.hasAttribute('data-fabric')) {
      throw new FabricError('Trying to initialize a canvas that has already been initialized. Did you forget to dispose the canvas?');
    }
    this._originalCanvasStyle = el.style.cssText;
    el.setAttribute('data-fabric', 'main');
    el.classList.add('lower-canvas');
    return el;
  }
  cleanupDOM(_ref) {
    let {
      width,
      height
    } = _ref;
    const {
      el
    } = this.lower;
    // restore canvas style and attributes
    el.classList.remove('lower-canvas');
    el.removeAttribute('data-fabric');
    // restore canvas size to original size in case retina scaling was applied
    el.setAttribute('width', "".concat(width));
    el.setAttribute('height', "".concat(height));
    el.style.cssText = this._originalCanvasStyle || '';
    this._originalCanvasStyle = undefined;
  }
  setDimensions(size, retinaScaling) {
    const {
      el,
      ctx
    } = this.lower;
    setCanvasDimensions(el, ctx, size, retinaScaling);
  }
  setCSSDimensions(size) {
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

export { StaticCanvasDOMManager };
//# sourceMappingURL=StaticCanvasDOMManager.mjs.map
