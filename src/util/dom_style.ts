//@ts-nocheck
/* this file needs to go away, cross browser style support is not fabricjs domain.
/**
 * wrapper for setting element's style
 * @memberOf fabric.util
 * @param {HTMLElement} element
 * @param {Object | string} styles
 * @return {HTMLElement} Element that was passed as a first argument
 */
export function setStyle(element, styles) {
  const elementStyle = element.style;
  if (!elementStyle) {
    return element;
  }
  if (typeof styles === 'string') {
    element.style.cssText += ';' + styles;
    return element;
  }
  Object.entries(styles).forEach(
    ([property, value]) => elementStyle.setProperty(property, value)
  );
  return element;
}
