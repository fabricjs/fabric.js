import { getMultipleNodes } from './getMultipleNodes';
import { recursivelyParseGradientsXlink } from './recursivelyParseGradientsXlink';

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
export function getGradientDefs(doc: HTMLElement): Record<string, Element> {
  const elList = getMultipleNodes(doc, tagArray);
  let el;
  const gradientDefs: Record<string, Element> = {};
  let j = elList.length;
  while (j--) {
    el = elList[j];
    if (el.getAttribute('xlink:href')) {
      recursivelyParseGradientsXlink(doc, el);
    }
    const id = el.getAttribute('id');
    if (id) {
      gradientDefs[id] = el;
    }
  }
  return gradientDefs;
}
