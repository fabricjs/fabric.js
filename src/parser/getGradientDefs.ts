import { getMultipleNodes } from './getMultipleNodes';
import { recursivelyParseGradientsXlink } from './recursivelyParseGradientsXlink';

const tagArray = [
  'linearGradient',
  'radialGradient',
  'svg:linearGradient',
  'svg:radialGradient',
];

export type TGradientDefs = Record<string, Element>;

/**
 * Parses an SVG document, returning all of the gradient declarations found in it
 * @param {SVGDocument} doc SVG document to parse
 * @return {TGradientDefs} Gradient definitions; key corresponds to element id, value -- to gradient definition element
 */
export function getGradientDefs(doc: Document): TGradientDefs {
  const gradientDefs: TGradientDefs = {};
  for (const el of getMultipleNodes(doc, tagArray)) {
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
