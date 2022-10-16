import { svgNS } from './constants';
import {
  parsePreserveAspectRatioAttribute,
  parseUnit,
} from '../util/misc/svgParsing';
import { svgViewBoxElementsRegEx, reViewBoxAttrValue } from './constants';

export type TParsedViewBoxDims = {
  /**
   * If the viewbox is not parsed
   */
  toBeParsed?: boolean;
  /**
   * Viewbox left x bound
   */
  minX?: number;
  /**
   * Viewbox top y bound
   */
  minY?: number;
  /**
   * Width/height as defined by the VB
   */
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  /**
   * Element width/height
   */
  width?: number;
  height?: number;
};

/**
 * Add a <g> element that envelop all child elements and makes the viewbox transformMatrix descend on all elements
 * @param element
 */
export function applyViewboxTransform(element: Element): TParsedViewBoxDims {
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
    viewBoxAttr = viewBoxAttributeFull?.match(reViewBoxAttrValue),
    widthAttr = element.getAttribute('width'),
    heightAttr = element.getAttribute('height'),
    xAttr = element.getAttribute('x') ?? '0',
    yAttr = element.getAttribute('y') ?? '0',
    missingViewBox = !viewBoxAttr,
    missingDimAttr =
      !widthAttr ||
      !heightAttr ||
      widthAttr === '100%' ||
      heightAttr === '100%',
    toBeParsed = missingViewBox && missingDimAttr,
    parsedDim: TParsedViewBoxDims = {};

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
