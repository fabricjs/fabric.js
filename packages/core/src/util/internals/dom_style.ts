// TODO this file needs to go away, cross browser style support is not fabricjs domain.

/**
 * wrapper for setting element's style
 * @param {HTMLElement} element an HTMLElement
 * @param {Object} styles to apply to element
 */
export function setStyle(element: HTMLElement, styles: Record<string, string>) {
  const elementStyle = element.style;
  if (!elementStyle) {
    return;
  }
  Object.entries(styles).forEach(([property, value]) =>
    elementStyle.setProperty(property, value),
  );
}
