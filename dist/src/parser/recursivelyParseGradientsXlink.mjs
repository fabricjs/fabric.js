const gradientsAttrs = ['gradientTransform', 'x1', 'x2', 'y1', 'y2', 'gradientUnits', 'cx', 'cy', 'r', 'fx', 'fy'];
const xlinkAttr = 'xlink:href';
function recursivelyParseGradientsXlink(doc, gradient) {
  var _gradient$getAttribut;
  const xLink = ((_gradient$getAttribut = gradient.getAttribute(xlinkAttr)) === null || _gradient$getAttribut === void 0 ? void 0 : _gradient$getAttribut.slice(1)) || '',
    referencedGradient = doc.getElementById(xLink);
  if (referencedGradient && referencedGradient.getAttribute(xlinkAttr)) {
    recursivelyParseGradientsXlink(doc, referencedGradient);
  }
  if (referencedGradient) {
    gradientsAttrs.forEach(attr => {
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

export { recursivelyParseGradientsXlink };
//# sourceMappingURL=recursivelyParseGradientsXlink.mjs.map
