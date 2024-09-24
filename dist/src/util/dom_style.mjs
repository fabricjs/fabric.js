// TODO this file needs to go away, cross browser style support is not fabricjs domain.

/**
 * wrapper for setting element's style
 * @param {HTMLElement} element
 * @param {Object | string} styles
 */
function setStyle(element, styles) {
  const elementStyle = element.style;
  if (!elementStyle || !styles) {
    return;
  } else if (typeof styles === 'string') {
    elementStyle.cssText += ';' + styles;
  } else {
    Object.entries(styles).forEach(_ref => {
      let [property, value] = _ref;
      return elementStyle.setProperty(property, value);
    });
  }
}

export { setStyle };
//# sourceMappingURL=dom_style.mjs.map
