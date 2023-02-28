//@ts-nocheck
// TODO this file needs to go away, cross browser style support is not fabricjs domain.

/**
 * wrapper for setting element's style
 * @param {HTMLElement} element
 * @param {Object | string} styles
 */
export function setStyle(element, styles) {
  const elementStyle = element.style;
  if (!elementStyle) {
    return;
  } else if (typeof styles === 'string') {
    element.style.cssText += ';' + styles;
  } else {
    Object.entries(styles).forEach(([property, value]) =>
      elementStyle.setProperty(property, value)
    );
  }
}
