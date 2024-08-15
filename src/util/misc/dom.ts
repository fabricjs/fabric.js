import { getFabricDocument } from '../../env';
import type { ImageFormat } from '../../typedefs';
import { FabricError } from '../internals/console';
/**
 * Creates canvas element
 * @return {CanvasElement} initialized canvas element
 */
export const createCanvasElement = (): HTMLCanvasElement => {
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
export const createImage = (): HTMLImageElement =>
  getFabricDocument().createElement('img');

/**
 * Creates a canvas element that is a copy of another and is also painted
 * @param {CanvasElement} canvas to copy size and content of
 * @return {CanvasElement} initialized canvas element
 */
export const copyCanvasElement = (
  canvas: HTMLCanvasElement,
): HTMLCanvasElement => {
  const newCanvas = createCanvasElement();
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  newCanvas.getContext('2d')?.drawImage(canvas, 0, 0);
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
export const toDataURL = (
  canvasEl: HTMLCanvasElement,
  format: ImageFormat,
  quality: number,
) => canvasEl.toDataURL(`image/${format}`, quality);

export const isHTMLCanvas = (
  canvas?: HTMLCanvasElement | string,
): canvas is HTMLCanvasElement => {
  return !!canvas && (canvas as HTMLCanvasElement).getContext !== undefined;
};
