import { NONE } from '../../constants';
import type { TSize } from '../../typedefs';
import {
  getDocumentFromElement,
  getWindowFromElement,
  getScrollLeftTop,
} from '../../util/dom_misc';

export const setCanvasDimensions = (
  el: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  { width, height }: TSize,
  retinaScaling = 1,
) => {
  el.width = width;
  el.height = height;
  if (retinaScaling > 1) {
    el.setAttribute('width', (width * retinaScaling).toString());
    el.setAttribute('height', (height * retinaScaling).toString());
    ctx.scale(retinaScaling, retinaScaling);
  }
};

export type CSSDimensions = {
  width: number | string;
  height: number | string;
};

export const setCSSDimensions = (
  el: HTMLElement,
  { width, height }: Partial<CSSDimensions>,
) => {
  width && (el.style.width = typeof width === 'number' ? `${width}px` : width);
  height &&
    (el.style.height = typeof height === 'number' ? `${height}px` : height);
};

/**
 * Returns offset for a given element
 * @param {HTMLElement} element Element to get offset for
 * @return {Object} Object with "left" and "top" properties
 */
export function getElementOffset(element: HTMLElement) {
  const doc = element && getDocumentFromElement(element),
    offset = { left: 0, top: 0 };

  if (!doc) {
    return offset;
  }
  const elemStyle: CSSStyleDeclaration =
    getWindowFromElement(element)?.getComputedStyle(element, null) ||
    ({} as CSSStyleDeclaration);
  offset.left += parseInt(elemStyle.borderLeftWidth, 10) || 0;
  offset.top += parseInt(elemStyle.borderTopWidth, 10) || 0;
  offset.left += parseInt(elemStyle.paddingLeft, 10) || 0;
  offset.top += parseInt(elemStyle.paddingTop, 10) || 0;

  let box = { left: 0, top: 0 };

  const docElem = doc.documentElement;
  if (typeof element.getBoundingClientRect !== 'undefined') {
    box = element.getBoundingClientRect();
  }

  const scrollLeftTop = getScrollLeftTop(element);

  return {
    left:
      box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
    top: box.top + scrollLeftTop.top - (docElem.clientTop || 0) + offset.top,
  };
}

/**
 * Makes element unselectable
 * @param {HTMLElement} element Element to make unselectable
 * @return {HTMLElement} Element that was passed in
 */
export function makeElementUnselectable(element: HTMLElement) {
  if (typeof element.onselectstart !== 'undefined') {
    element.onselectstart = () => false;
  }
  element.style.userSelect = NONE;
  return element;
}
