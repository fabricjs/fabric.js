//@ts-nocheck
import { svgNS } from './constants';
import {
  parsePreserveAspectRatioAttribute,
  parseUnit,
} from '../util/misc/svgParsing';
import { svgViewBoxElementsRegEx, reViewBoxAttrValue } from './constants';

/**
 * Add a <g> element that envelop all child elements and makes the viewbox transformMatrix descend on all elements
 */

export function applyViewboxTransform(element) {
  if (!svgViewBoxElementsRegEx.test(element.nodeName)) {
    return {};
  }
  let viewBoxAttr = element.getAttribute('viewBox');
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
  let preserveAspectRatio = element.getAttribute('preserveAspectRatio') || '';
  const missingViewBox =
    !viewBoxAttr || !(viewBoxAttr = viewBoxAttr.match(reViewBoxAttrValue));
  const missingDimAttr =
    !widthAttr || !heightAttr || widthAttr === '100%' || heightAttr === '100%';
  const toBeParsed = missingViewBox && missingDimAttr;
  const parsedDim = {};
  let translateMatrix = '';
  let widthDiff = 0;
  let heightDiff = 0;

  parsedDim.width = 0;
  parsedDim.height = 0;
  parsedDim.toBeParsed = toBeParsed;

  if (missingViewBox) {
    if (
      (x || y) &&
      element.parentNode &&
      element.parentNode.nodeName !== '#document'
    ) {
      translateMatrix =
        ' translate(' + parseUnit(x) + ' ' + parseUnit(y) + ') ';
      matrix = (element.getAttribute('transform') || '') + translateMatrix;
      element.setAttribute('transform', matrix);
      element.removeAttribute('x');
      element.removeAttribute('y');
    }
  }

  if (toBeParsed) {
    return parsedDim;
  }

  if (missingViewBox) {
    parsedDim.width = parseUnit(widthAttr);
    parsedDim.height = parseUnit(heightAttr);
    // set a transform for elements that have x y and are inner(only) SVGs
    return parsedDim;
  }
  minX = -parseFloat(viewBoxAttr[1]);
  minY = -parseFloat(viewBoxAttr[2]);
  const viewBoxWidth = parseFloat(viewBoxAttr[3]);
  const viewBoxHeight = parseFloat(viewBoxAttr[4]);
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
  preserveAspectRatio = parsePreserveAspectRatioAttribute(preserveAspectRatio);
  if (preserveAspectRatio.alignX !== 'none') {
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

  if (
    scaleX === 1 &&
    scaleY === 1 &&
    minX === 0 &&
    minY === 0 &&
    x === 0 &&
    y === 0
  ) {
    return parsedDim;
  }
  if ((x || y) && element.parentNode.nodeName !== '#document') {
    translateMatrix = ' translate(' + parseUnit(x) + ' ' + parseUnit(y) + ') ';
  }

  matrix =
    translateMatrix +
    ' matrix(' +
    scaleX +
    ' 0' +
    ' 0 ' +
    scaleY +
    ' ' +
    (minX * scaleX + widthDiff) +
    ' ' +
    (minY * scaleY + heightDiff) +
    ') ';
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
