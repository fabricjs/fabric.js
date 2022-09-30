//@ts-nocheck

import { svgNS } from './constants';
import {
  parsePreserveAspectRatioAttribute,
  parseUnit,
} from '../util/misc/svgParsing';
import { svgViewBoxElementsRegEx, reViewBoxAttrValue } from './constants';

export type TViewBoxDims = {
  width?: number;
  height?: number;
  toBeParsed?: boolean;
  minX?: number;
  minY?: number;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
};

/**
 * Add a <g> element that envelop all child elements and makes the viewbox transformMatrix descend on all elements
 */

function __applyViewboxTransform(element: Element): TViewBoxDims {
  if (!svgViewBoxElementsRegEx.test(element.nodeName)) {
    return {};
  }
  let scaleX = 1,
    scaleY = 1,
    el: Element,
    translateMatrix = '',
    widthDiff = 0,
    heightDiff = 0,
    matrix: string;
  const preserveAspectRatioAttr =
      element.getAttribute('preserveAspectRatio') || '',
    viewBoxAttributeFull = element.getAttribute('viewBox'),
    viewBoxAttr = viewBoxAttributeFull
      ? viewBoxAttributeFull.match(reViewBoxAttrValue)
      : null,
    widthAttr = element.getAttribute('width'),
    heightAttr = element.getAttribute('height'),
    xAttr = element.getAttribute('x'),
    yAttr = element.getAttribute('y'),
    missingViewBox = !viewBoxAttr,
    missingDimAttr =
      !widthAttr ||
      !heightAttr ||
      widthAttr === '100%' ||
      heightAttr === '100%',
    toBeParsed = missingViewBox && missingDimAttr,
    parsedDim: TViewBoxDims = {};

  parsedDim.width = 0;
  parsedDim.height = 0;
  parsedDim.toBeParsed = toBeParsed;

  if (missingViewBox) {
    if (
      (xAttr || yAttr) &&
      element.parentNode &&
      element.parentNode.nodeName !== '#document'
    ) {
      translateMatrix =
        ' translate(' + parseUnit(xAttr) + ' ' + parseUnit(yAttr) + ') ';
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
  const minX = -parseFloat(viewBoxAttr[1]);
  const minY = -parseFloat(viewBoxAttr[2]);
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
  const preserveAspectRatio = parsePreserveAspectRatioAttribute(
    preserveAspectRatioAttr
  );
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
    xAttr === '0' &&
    yAttr === '0'
  ) {
    return parsedDim;
  }
  if ((xAttr || yAttr) && element.parentNode?.nodeName !== '#document') {
    translateMatrix =
      ' translate(' + parseUnit(xAttr) + ' ' + parseUnit(yAttr) + ') ';
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

function applyViewboxTransform2(element) {
  if (!svgViewBoxElementsRegEx.test(element.nodeName)) {
    return {};
  }
  let viewBoxAttr = element.getAttribute('viewBox'),
    scaleX = 1,
    scaleY = 1,
    minX = 0,
    minY = 0,
    viewBoxWidth,
    viewBoxHeight,
    matrix,
    el,
    widthAttr = element.getAttribute('width'),
    heightAttr = element.getAttribute('height'),
    x = element.getAttribute('x') || 0,
    y = element.getAttribute('y') || 0,
    preserveAspectRatio = element.getAttribute('preserveAspectRatio') || '',
    missingViewBox =
      !viewBoxAttr || !(viewBoxAttr = viewBoxAttr.match(reViewBoxAttrValue)),
    missingDimAttr =
      !widthAttr ||
      !heightAttr ||
      widthAttr === '100%' ||
      heightAttr === '100%',
    toBeParsed = missingViewBox && missingDimAttr,
    parsedDim = {},
    translateMatrix = '',
    widthDiff = 0,
    heightDiff = 0;

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
  viewBoxWidth = parseFloat(viewBoxAttr[3]);
  viewBoxHeight = parseFloat(viewBoxAttr[4]);
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

let i = 0;

export function applyViewboxTransform(element: Element): TViewBoxDims {
  const id = i++;
  console.log(id, "BEFORE", JSON.stringify(element));
  // const res = __applyViewboxTransform(element);
  const res2 = applyViewboxTransform2(element);
  console.log(id, "AFTER", JSON.stringify(res2));
  return res2;
}
