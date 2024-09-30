// TODO this file needs to go away, cross browser style support is not fabricjs domain.

/**
 * wrapper for setting element's style
 * @param {HTMLElement} element
 * @param {Object | string} styles
 */
export function setStyle(
  element: HTMLElement,
  styles: string | Record<string, string>,
) {
  const elementStyle = element.style;
  if (!elementStyle || !styles) {
    return;
  } else if (typeof styles === 'string') {
    elementStyle.cssText += ';' + styles;
  } else {
    Object.entries(styles).forEach(([property, value]) =>
      elementStyle.setProperty(property, value),
    );
  }
}
