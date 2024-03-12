import { LEFT, NONE, TOP } from '../../constants';
import type { TSize } from '../../typedefs';
import {
  getDocumentFromElement,
  getWindowFromElement,
  getScrollLeftTop,
} from '../../util/dom_misc';
import { setStyle } from '../../util/dom_style';

export const setCanvasDimensions = (
  el: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  { width, height }: TSize,
  retinaScaling = 1
) => {
  el.width = width;
  el.height = height;
  if (retinaScaling > 1) {
    el.setAttribute('width', (width * retinaScaling).toString());
    el.setAttribute('height', (height * retinaScaling).toString());
    ctx.scale(retinaScaling, retinaScaling);
  }
};

export function allowTouchScrolling(element: HTMLElement, allow: boolean) {
  const touchAction = allow ? 'manipulation' : NONE;
  setStyle(element, {
    'touch-action': touchAction,
    '-ms-touch-action': touchAction,
  });
}

export type CSSDimensions = {
  width: number | string;
  height: number | string;
};

export const setCSSDimensions = (
  el: HTMLElement,
  { width, height }: Partial<CSSDimensions>
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
  let box = { left: 0, top: 0 };
  const doc = element && getDocumentFromElement(element),
    offset = { left: 0, top: 0 },
    offsetAttributes = {
      borderLeftWidth: LEFT,
      borderTopWidth: TOP,
      paddingLeft: LEFT,
      paddingTop: TOP,
    } as const;

  if (!doc) {
    return offset;
  }
  const elemStyle =
    getWindowFromElement(element)?.getComputedStyle(element, null) || {};
  for (const attr in offsetAttributes) {
    // @ts-expect-error TS learn to iterate!
    offset[offsetAttributes[attr]] += parseInt(elemStyle[attr], 10) || 0;
  }

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
