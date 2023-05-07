import { iMatrix } from '../constants';
import { reNum } from './constants';
import { multiplyTransformMatrices } from '../util/misc/matrix';
import { rotateMatrix } from './rotateMatrix';
import { scaleMatrix } from './scaleMatrix';
import { translateMatrix } from './translateMatrix';
import { TMat2D } from '../typedefs';
import { cleanupSvgAttribute } from '../util/internals/cleanupSvAttribute';
import { skewXMatrix, skewYMatrix } from './skewMatrix';

// == begin transform regexp
const p = `(${reNum})`;
const skewX = String.raw`(skewX)\(${p}\)`;
const skewY = String.raw`(skewY)\(${p}\)`;
const rotate = String.raw`(rotate)\(${p}(?: ${p} ${p})?\)`;
const scale = String.raw`(scale)\(${p}(?: ${p})?\)`;
const translate = String.raw`(translate)\(${p}(?: ${p})?\)`;
const matrix = String.raw`(matrix)\(${p} ${p} ${p} ${p} ${p} ${p}\)`;
const transform = `(?:${matrix}|${translate}|${rotate}|${scale}|${skewX}|${skewY})`;
const transforms = `(?:${transform}*)`;
const transformList = String.raw`^\s*(?:${transforms}?)\s*$`;
// http://www.w3.org/TR/SVG/coords.html#TransformAttribute
const reTransformList = new RegExp(transformList);
// == end transform regexp
const reTransform = new RegExp(transform, 'g');

/**
 * Parses "transform" attribute, returning an array of values
 * @static
 * @function
 * @memberOf fabric
 * @param {String} attributeValue String containing attribute value
 * @return {TTransformMatrix} Array of 6 elements representing transformation matrix
 */
export function parseTransformAttribute(attributeValue: string): TMat2D {
  // first we clean the string
  attributeValue = cleanupSvgAttribute(attributeValue)
    // remove spaces around front parentheses
    .replace(/\s*([()])\s*/gi, '$1');

  // start with identity matrix
  const matrices: TMat2D[] = [];

  // return if no argument was given or
  // an argument does not match transform attribute regexp
  if (
    !attributeValue ||
    (attributeValue && !reTransformList.test(attributeValue))
  ) {
    return [...iMatrix];
  }

  for (const match of attributeValue.matchAll(reTransform)) {
    const transformMatch = new RegExp(transform).exec(match[0]);
    if (!transformMatch) {
      continue;
    }
    let matrix: TMat2D = iMatrix;
    const matchedParams = transformMatch.filter((m) => !!m);
    const [, operation, ...rawArgs] = matchedParams;
    const [arg0, arg1, arg2, arg3, arg4, arg5] = rawArgs.map((arg) =>
      parseFloat(arg)
    );

    switch (operation) {
      case 'translate':
        matrix = translateMatrix(arg0, arg1);
        break;
      case 'rotate':
        matrix = rotateMatrix(arg0, arg1, arg2);
        break;
      case 'scale':
        matrix = scaleMatrix(arg0, arg1);
        break;
      case 'skewX':
        matrix = skewXMatrix(arg0);
        break;
      case 'skewY':
        matrix = skewYMatrix(arg0);
        break;
      case 'matrix':
        matrix = [arg0, arg1, arg2, arg3, arg4, arg5];
        break;
    }

    // snapshot current matrix into matrices array
    matrices.push(matrix);
  }

  return matrices.reduce(
    (acc, matrix) => multiplyTransformMatrices(acc, matrix),
    iMatrix
  );
}
