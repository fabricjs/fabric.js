import { getMultipleNodes } from './getMultipleNodes.mjs';
import { recursivelyParseGradientsXlink } from './recursivelyParseGradientsXlink.mjs';

const tagArray = ['linearGradient', 'radialGradient', 'svg:linearGradient', 'svg:radialGradient'];

/**
 * Parses an SVG document, returning all of the gradient declarations found in it
 * @param {SVGDocument} doc SVG document to parse
 * @return {Object} Gradient definitions; key corresponds to element id, value -- to gradient definition element
 */
function getGradientDefs(doc) {
  const elList = getMultipleNodes(doc, tagArray);
  const gradientDefs = {};
  let j = elList.length;
  while (j--) {
    const el = elList[j];
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

export { getGradientDefs };
//# sourceMappingURL=getGradientDefs.mjs.map
