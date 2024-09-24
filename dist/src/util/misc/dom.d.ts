import type { ImageFormat } from '../../typedefs';
/**
 * Creates canvas element
 * @return {CanvasElement} initialized canvas element
 */
export declare const createCanvasElement: () => HTMLCanvasElement;
/**
 * Creates image element (works on client and node)
 * @return {HTMLImageElement} HTML image element
 */
export declare const createImage: () => HTMLImageElement;
/**
 * Creates a canvas element that is a copy of another and is also painted
 * @param {CanvasElement} canvas to copy size and content of
 * @return {CanvasElement} initialized canvas element
 */
export declare const copyCanvasElement: (canvas: HTMLCanvasElement) => HTMLCanvasElement;
/**
 * since 2.6.0 moved from canvas instance to utility.
 * possibly useless
 * @param {CanvasElement} canvasEl to copy size and content of
 * @param {String} format 'jpeg' or 'png', in some browsers 'webp' is ok too
 * @param {Number} quality <= 1 and > 0
 * @return {String} data url
 */
export declare const toDataURL: (canvasEl: HTMLCanvasElement, format: ImageFormat, quality: number) => string;
export declare const isHTMLCanvas: (canvas?: HTMLCanvasElement | string) => canvas is HTMLCanvasElement;
//# sourceMappingURL=dom.d.ts.map