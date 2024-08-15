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

export function recursivelyParseGradientsXlink(
  doc: Document,
  gradient: Element,
) {
  const xLink = gradient.getAttribute(xlinkAttr)?.slice(1) || '',
    referencedGradient = doc.getElementById(xLink);
  if (referencedGradient && referencedGradient.getAttribute(xlinkAttr)) {
    recursivelyParseGradientsXlink(doc, referencedGradient as Element);
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
}
