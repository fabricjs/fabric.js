const gradientsAttrs = [
  'gradientTransform',
  'x1',
  'x2',
  'y1',
  'y2',
  'gradientUnits',
  'cx',
  'cy',
  'r',
  'fx',
  'fy',
];
const xlinkAttr = 'xlink:href';
const hrefAttr = 'href';

/**
 * SVG2 plain `href` takes precedence over the deprecated `xlink:href`
 * @see https://www.w3.org/TR/SVG2/linking.html#XLinkRefAttrs
 */
export const getGradientHref = (gradient: Element) =>
  gradient.getAttribute(hrefAttr) || gradient.getAttribute(xlinkAttr);

export function recursivelyParseGradientsXlink(
  doc: Document,
  gradient: Element,
) {
  const xLink = getGradientHref(gradient)?.slice(1) || '',
    referencedGradient = doc.getElementById(xLink);
  if (referencedGradient && getGradientHref(referencedGradient)) {
    recursivelyParseGradientsXlink(doc, referencedGradient);
  }
  if (referencedGradient) {
    gradientsAttrs.forEach((attr) => {
      const value = referencedGradient.getAttribute(attr);
      if (!gradient.hasAttribute(attr) && value) {
        gradient.setAttribute(attr, value);
      }
    });
    if (!gradient.children.length) {
      const referenceClone = referencedGradient.cloneNode(true);
      while (referenceClone.firstChild) {
        gradient.appendChild(referenceClone.firstChild);
      }
    }
  }
  gradient.removeAttribute(xlinkAttr);
  gradient.removeAttribute(hrefAttr);
}
