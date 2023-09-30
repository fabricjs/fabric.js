import { parseStyleObject } from './parseStyleObject';
import { parseStyleString } from './parseStyleString';

/**
 * Parses "style" attribute, retuning an object with values
 * @static
 * @memberOf fabric
 * @param {SVGElement} element Element to parse
 * @return {Object} Objects with values parsed from style attribute of an element
 */
export function parseStyleAttribute(element: HTMLElement): Record<string, any> {
  const oStyle: Record<string, any> = {},
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
