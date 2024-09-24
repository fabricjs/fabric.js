import type { TSize } from '../../typedefs';
export declare const setCanvasDimensions: (el: HTMLCanvasElement, ctx: CanvasRenderingContext2D, { width, height }: TSize, retinaScaling?: number) => void;
export type CSSDimensions = {
    width: number | string;
    height: number | string;
};
export declare const setCSSDimensions: (el: HTMLElement, { width, height }: Partial<CSSDimensions>) => void;
/**
 * Returns offset for a given element
 * @param {HTMLElement} element Element to get offset for
 * @return {Object} Object with "left" and "top" properties
 */
export declare function getElementOffset(element: HTMLElement): {
    left: number;
    top: number;
};
/**
 * Makes element unselectable
 * @param {HTMLElement} element Element to make unselectable
 * @return {HTMLElement} Element that was passed in
 */
export declare function makeElementUnselectable(element: HTMLElement): HTMLElement;
//# sourceMappingURL=util.d.ts.map