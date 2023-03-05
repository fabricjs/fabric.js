import { getDocument } from '../env';

/**
 * Wraps element with another element
 * @param {HTMLElement} element Element to wrap
 * @param {HTMLElement|String} wrapper Element to wrap with
 * @param {Object} [attributes] Attributes to set on a wrapper
 * @return {HTMLElement} wrapper
 */
export function wrapElement(element: HTMLElement, wrapper: HTMLDivElement) {
  if (element.parentNode) {
    element.parentNode.replaceChild(wrapper, element);
  }
  wrapper.appendChild(element);
  return wrapper;
}

/**
 * Returns offset for a given element
 * @param {HTMLElement} element Element to get offset for
 * @return {Object} Object with "left" and "top" properties
 * TODO convert to getBoundingClientRect + window.scrollX/Y
 */
export function getElementOffset(element: HTMLElement) {

  let box = { left: 0, top: 0 };
  const doc = element && element.ownerDocument,
    offset = { left: 0, top: 0 },
    offsetAttributes = {
      borderLeftWidth: 'left',
      borderTopWidth: 'top',
      paddingLeft: 'left',
      paddingTop: 'top',
    } as const;

  if (!doc) {
    return offset;
  }
  const elemStyle = getDocument().defaultView!.getComputedStyle(element, null);
  for (const attr in offsetAttributes) {
    // @ts-expect-error TS learn to iterate!
    offset[offsetAttributes[attr]] += parseInt(elemStyle[attr], 10) || 0;
  }

  const docElem = doc.documentElement;
  if (typeof element.getBoundingClientRect !== 'undefined') {
    box = element.getBoundingClientRect();
  }

  return {
    left:
      box.left - (docElem.clientLeft || 0) + offset.left,
    top: box.top - (docElem.clientTop || 0) + offset.top,
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
  element.style.userSelect = 'none';
  return element;
}

/**
 * Makes element selectable
 * @param {HTMLElement} element Element to make selectable
 * @return {HTMLElement} Element that was passed in
 */
export function makeElementSelectable(element: HTMLElement) {
  if (typeof element.onselectstart !== 'undefined') {
    element.onselectstart = null;
  }
  element.style.userSelect = '';
  return element;
}
