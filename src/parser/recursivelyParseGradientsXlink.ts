import { elementById } from "./elementById";


export function recursivelyParseGradientsXlink(doc, gradient) {
  var gradientsAttrs = ['gradientTransform', 'x1', 'x2', 'y1', 'y2', 'gradientUnits', 'cx', 'cy', 'r', 'fx', 'fy'], xlinkAttr = 'xlink:href', xLink = gradient.getAttribute(xlinkAttr).slice(1), referencedGradient = elementById(doc, xLink);
  if (referencedGradient && referencedGradient.getAttribute(xlinkAttr)) {
    recursivelyParseGradientsXlink(doc, referencedGradient);
  }
  gradientsAttrs.forEach(function (attr) {
    if (referencedGradient && !gradient.hasAttribute(attr) && referencedGradient.hasAttribute(attr)) {
      gradient.setAttribute(attr, referencedGradient.getAttribute(attr));
    }
  });
  if (!gradient.children.length) {
    var referenceClone = referencedGradient.cloneNode(true);
    while (referenceClone.firstChild) {
      gradient.appendChild(referenceClone.firstChild);
    }
  }
  gradient.removeAttribute(xlinkAttr);
}
