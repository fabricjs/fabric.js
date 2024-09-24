import { getFabricDocument } from '../../env/index.mjs';
import { FabricError } from '../internals/console.mjs';

/**
 * Creates canvas element
 * @return {CanvasElement} initialized canvas element
 */
const createCanvasElement = () => {
  const element = getFabricDocument().createElement('canvas');
  if (!element || typeof element.getContext === 'undefined') {
    throw new FabricError('Failed to create `canvas` element');
  }
  return element;
};

/**
 * Creates image element (works on client and node)
 * @return {HTMLImageElement} HTML image element
 */
const createImage = () => getFabricDocument().createElement('img');

/**
 * Creates a canvas element that is a copy of another and is also painted
 * @param {CanvasElement} canvas to copy size and content of
 * @return {CanvasElement} initialized canvas element
 */
const copyCanvasElement = canvas => {
  var _newCanvas$getContext;
  const newCanvas = createCanvasElement();
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  (_newCanvas$getContext = newCanvas.getContext('2d')) === null || _newCanvas$getContext === void 0 || _newCanvas$getContext.drawImage(canvas, 0, 0);
  return newCanvas;
};

/**
 * since 2.6.0 moved from canvas instance to utility.
 * possibly useless
 * @param {CanvasElement} canvasEl to copy size and content of
 * @param {String} format 'jpeg' or 'png', in some browsers 'webp' is ok too
 * @param {Number} quality <= 1 and > 0
 * @return {String} data url
 */
const toDataURL = (canvasEl, format, quality) => canvasEl.toDataURL("image/".concat(format), quality);
const isHTMLCanvas = canvas => {
  return !!canvas && canvas.getContext !== undefined;
};

export { copyCanvasElement, createCanvasElement, createImage, isHTMLCanvas, toDataURL };
//# sourceMappingURL=dom.mjs.map
