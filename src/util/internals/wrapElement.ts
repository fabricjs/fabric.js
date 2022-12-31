/**
 * Wraps element with another element
 * @param {HTMLElement} element Element to wrap
 * @param {HTMLElement} wrapper Element to wrap with
 * @param {Object} [attributes] Attributes to set on a wrapper
 * @return {HTMLElement} wrapper
 */
export function wrapElement<T extends HTMLElement>(
  element: HTMLElement,
  wrapper: T
) {
  if (element.parentNode) {
    element.parentNode.replaceChild(wrapper, element);
  }
  wrapper.appendChild(element);
  return wrapper;
}
