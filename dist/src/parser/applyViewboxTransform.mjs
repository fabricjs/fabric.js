import { svgViewBoxElementsRegEx, reViewBoxAttrValue, svgNS } from './constants.mjs';
import { parseUnit, parsePreserveAspectRatioAttribute } from '../util/misc/svgParsing.mjs';
import { NONE } from '../constants.mjs';

/**
 * Add a <g> element that envelop all child elements and makes the viewbox transformMatrix descend on all elements
 */
function applyViewboxTransform(element) {
  if (!svgViewBoxElementsRegEx.test(element.nodeName)) {
    return {};
  }
  const viewBoxAttr = element.getAttribute('viewBox');
  let scaleX = 1;
  let scaleY = 1;
  let minX = 0;
  let minY = 0;
  let matrix;
  let el;
  const widthAttr = element.getAttribute('width');
  const heightAttr = element.getAttribute('height');
  const x = element.getAttribute('x') || 0;
  const y = element.getAttribute('y') || 0;
  const goodViewbox = viewBoxAttr && reViewBoxAttrValue.test(viewBoxAttr);
  const missingViewBox = !goodViewbox;
  const missingDimAttr = !widthAttr || !heightAttr || widthAttr === '100%' || heightAttr === '100%';
  let translateMatrix = '';
  let widthDiff = 0;
  let heightDiff = 0;
  if (missingViewBox) {
    if ((x || y) && element.parentNode && element.parentNode.nodeName !== '#document') {
      translateMatrix = ' translate(' + parseUnit(x || '0') + ' ' + parseUnit(y || '0') + ') ';
      matrix = (element.getAttribute('transform') || '') + translateMatrix;
      element.setAttribute('transform', matrix);
      element.removeAttribute('x');
      element.removeAttribute('y');
    }
  }
  if (missingViewBox && missingDimAttr) {
    return {
      width: 0,
      height: 0
    };
  }
  const parsedDim = {
    width: 0,
    height: 0
  };
  if (missingViewBox) {
    parsedDim.width = parseUnit(widthAttr);
    parsedDim.height = parseUnit(heightAttr);
    // set a transform for elements that have x y and are inner(only) SVGs
    return parsedDim;
  }
  const pasedViewBox = viewBoxAttr.match(reViewBoxAttrValue);
  minX = -parseFloat(pasedViewBox[1]);
  minY = -parseFloat(pasedViewBox[2]);
  const viewBoxWidth = parseFloat(pasedViewBox[3]);
  const viewBoxHeight = parseFloat(pasedViewBox[4]);
  parsedDim.minX = minX;
  parsedDim.minY = minY;
  parsedDim.viewBoxWidth = viewBoxWidth;
  parsedDim.viewBoxHeight = viewBoxHeight;
  if (!missingDimAttr) {
    parsedDim.width = parseUnit(widthAttr);
    parsedDim.height = parseUnit(heightAttr);
    scaleX = parsedDim.width / viewBoxWidth;
    scaleY = parsedDim.height / viewBoxHeight;
  } else {
    parsedDim.width = viewBoxWidth;
    parsedDim.height = viewBoxHeight;
  }

  // default is to preserve aspect ratio
  const preserveAspectRatio = parsePreserveAspectRatioAttribute(element.getAttribute('preserveAspectRatio') || '');
  if (preserveAspectRatio.alignX !== NONE) {
    //translate all container for the effect of Mid, Min, Max
    if (preserveAspectRatio.meetOrSlice === 'meet') {
      scaleY = scaleX = scaleX > scaleY ? scaleY : scaleX;
      // calculate additional translation to move the viewbox
    }
    if (preserveAspectRatio.meetOrSlice === 'slice') {
      scaleY = scaleX = scaleX > scaleY ? scaleX : scaleY;
      // calculate additional translation to move the viewbox
    }
    widthDiff = parsedDim.width - viewBoxWidth * scaleX;
    heightDiff = parsedDim.height - viewBoxHeight * scaleX;
    if (preserveAspectRatio.alignX === 'Mid') {
      widthDiff /= 2;
    }
    if (preserveAspectRatio.alignY === 'Mid') {
      heightDiff /= 2;
    }
    if (preserveAspectRatio.alignX === 'Min') {
      widthDiff = 0;
    }
    if (preserveAspectRatio.alignY === 'Min') {
      heightDiff = 0;
    }
  }
  if (scaleX === 1 && scaleY === 1 && minX === 0 && minY === 0 && x === 0 && y === 0) {
    return parsedDim;
  }
  if ((x || y) && element.parentNode.nodeName !== '#document') {
    translateMatrix = ' translate(' + parseUnit(x || '0') + ' ' + parseUnit(y || '0') + ') ';
  }
  matrix = translateMatrix + ' matrix(' + scaleX + ' 0' + ' 0 ' + scaleY + ' ' + (minX * scaleX + widthDiff) + ' ' + (minY * scaleY + heightDiff) + ') ';
  // seems unused.
  // parsedDim.viewboxTransform = parseTransformAttribute(matrix);
  if (element.nodeName === 'svg') {
    el = element.ownerDocument.createElementNS(svgNS, 'g');
    // element.firstChild != null
    while (element.firstChild) {
      el.appendChild(element.firstChild);
    }
    element.appendChild(el);
  } else {
    el = element;
    el.removeAttribute('x');
    el.removeAttribute('y');
    matrix = el.getAttribute('transform') + matrix;
  }
  el.setAttribute('transform', matrix);
  return parsedDim;
}

export { applyViewboxTransform };
//# sourceMappingURL=applyViewboxTransform.mjs.map
