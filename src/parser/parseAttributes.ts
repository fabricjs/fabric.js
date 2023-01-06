//@ts-nocheck
import { DEFAULT_SVG_FONT_SIZE } from '../constants';
import { parseUnit } from '../util/misc/svgParsing';
import { cPath, fSize, svgValidParentsRegEx } from './constants';
import { getGlobalStylesForElement } from './getGlobalStylesForElement';
import { normalizeAttr } from './normalizeAttr';
import { normalizeValue } from './normalizeValue';
import { parseFontDeclaration } from './parseFontDeclaration';
import { parseStyleAttribute } from './parseStyleAttribute';
import { setStrokeFillOpacity } from './setStrokeFillOpacity';

/**
 * Returns an object of attributes' name/value, given element and an array of attribute names;
 * Parses parent "g" nodes recursively upwards.
 * @param {SVGElement | HTMLElement} element Element to parse
 * @param {Array} attributes Array of attributes to parse
 * @return {Object} object containing parsed attributes' names/values
 */
export function parseAttributes(
  element: SVGElement | HTMLElement,
  attributes: string[],
  svgUid?: string
): Record<string, any> {
  if (!element) {
    return {};
  }

  let value,
    parentAttributes = {},
    fontSize,
    parentFontSize;

  if (typeof svgUid === 'undefined') {
    svgUid = element.getAttribute('svgUid');
  }
  // if there's a parent container (`g` or `a` or `symbol` node), parse its attributes recursively upwards
  if (
    element.parentNode &&
    svgValidParentsRegEx.test(element.parentNode.nodeName)
  ) {
    parentAttributes = parseAttributes(element.parentNode, attributes, svgUid);
  }

  let ownAttributes = attributes.reduce(function (memo, attr) {
    value = element.getAttribute(attr);
    if (value) {
      // eslint-disable-line
      memo[attr] = value;
    }
    return memo;
  }, {});
  // add values parsed from style, which take precedence over attributes
  // (see: http://www.w3.org/TR/SVG/styling.html#UsingPresentationAttributes)
  const cssAttrs = Object.assign(
    getGlobalStylesForElement(element, svgUid),
    parseStyleAttribute(element)
  );
  ownAttributes = Object.assign(ownAttributes, cssAttrs);
  if (cssAttrs[cPath]) {
    element.setAttribute(cPath, cssAttrs[cPath]);
  }
  fontSize = parentFontSize =
    parentAttributes.fontSize || DEFAULT_SVG_FONT_SIZE;
  if (ownAttributes[fSize]) {
    // looks like the minimum should be 9px when dealing with ems. this is what looks like in browsers.
    ownAttributes[fSize] = fontSize = parseUnit(
      ownAttributes[fSize],
      parentFontSize
    );
  }

  const normalizedStyle = {};
  for (const attr in ownAttributes) {
    const normalizedAttr = normalizeAttr(attr);
    const normalizedValue = normalizeValue(
      normalizedAttr,
      ownAttributes[attr],
      parentAttributes,
      fontSize
    );
    normalizedStyle[normalizedAttr] = normalizedValue;
  }
  if (normalizedStyle && normalizedStyle.font) {
    parseFontDeclaration(normalizedStyle.font, normalizedStyle);
  }
  const mergedAttrs = { ...parentAttributes, ...normalizedStyle };
  return svgValidParentsRegEx.test(element.nodeName)
    ? mergedAttrs
    : setStrokeFillOpacity(mergedAttrs);
}
