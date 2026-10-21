import { getMultipleNodes } from './getMultipleNodes';
import {
  getGradientHref,
  recursivelyParseGradientsXlink,
} from './recursivelyParseGradientsXlink';

const tagArray = [
  'linearGradient',
  'radialGradient',
  'svg:linearGradient',
  'svg:radialGradient',
];

/**
 * Parses an SVG document, returning all of the gradient declarations found in it
 * @param {SVGDocument} doc SVG document to parse
 * @return {Object} Gradient definitions; key corresponds to element id, value -- to gradient definition element
 */
export function getGradientDefs(
  doc: Document,
): Record<string, SVGGradientElement> {
  const elList = getMultipleNodes(doc, tagArray);
  const gradientDefs: Record<string, SVGGradientElement> = {};
  let j = elList.length;
  while (j--) {
    const el = elList[j];
    if (getGradientHref(el)) {
      recursivelyParseGradientsXlink(doc, el);
    }
    const id = el.getAttribute('id');
    if (id) {
      gradientDefs[id] = el as SVGGradientElement;
    }
  }
  return gradientDefs;
}
