//@ts-nocheck

import { elementById } from './elementById';

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

export function recursivelyParseGradientsXlink(doc, gradient) {
  const xLink = gradient.getAttribute(xlinkAttr).slice(1),
    referencedGradient = elementById(doc, xLink);
  if (referencedGradient && referencedGradient.getAttribute(xlinkAttr)) {
    recursivelyParseGradientsXlink(doc, referencedGradient);
  }
  gradientsAttrs.forEach(function (attr) {
    if (
      referencedGradient &&
      !gradient.hasAttribute(attr) &&
      referencedGradient.hasAttribute(attr)
    ) {
      gradient.setAttribute(attr, referencedGradient.getAttribute(attr));
    }
  });
  if (!gradient.children.length) {
    const referenceClone = referencedGradient.cloneNode(true);
    while (referenceClone.firstChild) {
      gradient.appendChild(referenceClone.firstChild);
    }
  }
  gradient.removeAttribute(xlinkAttr);
}
