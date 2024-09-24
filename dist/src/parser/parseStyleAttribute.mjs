import { parseStyleObject } from './parseStyleObject.mjs';
import { parseStyleString } from './parseStyleString.mjs';

/**
 * Parses "style" attribute, retuning an object with values
 * @static
 * @memberOf fabric
 * @param {SVGElement} element Element to parse
 * @return {Object} Objects with values parsed from style attribute of an element
 */
function parseStyleAttribute(element) {
  const oStyle = {},
    style = element.getAttribute('style');
  if (!style) {
    return oStyle;
  }
  if (typeof style === 'string') {
    parseStyleString(style, oStyle);
  } else {
    parseStyleObject(style, oStyle);
  }
  return oStyle;
}

export { parseStyleAttribute };
//# sourceMappingURL=parseStyleAttribute.mjs.map
