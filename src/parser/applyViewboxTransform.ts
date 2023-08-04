import { svgNS } from './constants';
import {
  parsePreserveAspectRatioAttribute,
  parseUnit,
} from '../util/misc/svgParsing';
import { svgViewBoxElementsRegEx, reViewBoxAttrValue } from './constants';
import { NONE } from '../constants';

export type ParsedViewboxTransform = Partial<{
  width: number;
  height: number;
  minX: number;
  minY: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
}>;

/**
 * Add a <g> element that envelop all child elements and makes the viewbox transformMatrix descend on all elements
 */
export function applyViewboxTransform(
  element: Element
): ParsedViewboxTransform {
  if (!svgViewBoxElementsRegEx.test(element.nodeName)) {
    return {};
  }
  const viewBoxAttr: string | null = element.getAttribute('viewBox');
  const widthAttr = element.getAttribute('width');
  const heightAttr = element.getAttribute('height');
  const x = element.getAttribute('x') || 0;
  const y = element.getAttribute('y') || 0;
  const goodViewbox = viewBoxAttr && reViewBoxAttrValue.test(viewBoxAttr);
  const missingViewBox = !goodViewbox;
  const missingDimAttr =
    !widthAttr || !heightAttr || widthAttr === '100%' || heightAttr === '100%';

  let matrix: string;
  let translateMatrix = '';
  let widthDiff = 0;
  let heightDiff = 0;

  if (missingViewBox) {
    if (
      (x || y) &&
      element.parentNode &&
      element.parentNode.nodeName !== '#document'
    ) {
      translateMatrix =
        ' translate(' + parseUnit(x || '0') + ' ' + parseUnit(y || '0') + ') ';
      matrix = (element.getAttribute('transform') || '') + translateMatrix;
      element.setAttribute('transform', matrix);
      element.removeAttribute('x');
      element.removeAttribute('y');
    }
  }

  if (missingViewBox && missingDimAttr) {
    return {
      width: 0,
      height: 0,
    };
  }

  if (missingViewBox) {
    // set a transform for elements that have x y and are inner(only) SVGs
    return {
      width: parseUnit(widthAttr!),
      height: parseUnit(heightAttr!),
    };
  }

  const passedViewBox = viewBoxAttr.match(reViewBoxAttrValue)!;
  const minX = -parseFloat(passedViewBox[1]);
  const minY = -parseFloat(passedViewBox[2]);
  const viewBoxWidth = parseFloat(passedViewBox[3]);
  const viewBoxHeight = parseFloat(passedViewBox[4]);
  let width: number;
  let height: number;
  let scaleX: number;
  let scaleY: number;
  if (!missingDimAttr) {
    width = parseUnit(widthAttr);
    height = parseUnit(heightAttr);
    scaleX = width / viewBoxWidth;
    scaleY = height / viewBoxHeight;
  } else {
    width = viewBoxWidth;
    height = viewBoxHeight;
    scaleX = 1;
    scaleY = 1;
  }
  const parsedDim: ParsedViewboxTransform = {
    width,
    height,
    minX,
    minY,
    viewBoxWidth,
    viewBoxHeight,
  };

  // default is to preserve aspect ratio
  const preserveAspectRatio = parsePreserveAspectRatioAttribute(
    element.getAttribute('preserveAspectRatio') || ''
  );
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
    widthDiff = width - viewBoxWidth * scaleX;
    heightDiff = height - viewBoxHeight * scaleX;
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
  if ((x || y) && element.parentNode!.nodeName !== '#document') {
    translateMatrix =
      ' translate(' + parseUnit(x || '0') + ' ' + parseUnit(y || '0') + ') ';
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

  let el: Element;
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
