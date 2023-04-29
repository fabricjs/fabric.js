import { iMatrix } from '../constants';
import { reNum } from './constants';
import { multiplyTransformMatrices } from '../util/misc/matrix';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { rotateMatrix } from './rotateMatrix';
import { scaleMatrix } from './scaleMatrix';
import { skewMatrix } from './skewMatrix';
import { translateMatrix } from './translateMatrix';
import { TMat2D } from '../typedefs';

// == begin transform regexp
const p = String.raw`(${reNum})`;
const skewX = String.raw`(skewX)\(${p})`;
const skewY = String.raw`(skewY)\(${p})`;
const rotate = String.raw`(rotate)\(${p}(?: ${p} ${p})?\)`;
const scale = String.raw`(scale)\(${p}(?: ${p})\)`;
const translate = String.raw`(translate)\(${p}(?: ${p})\)`;
const matrix = String.raw`(matrix)\(${p} ${p} ${p} ${p} ${p} ${p}\)`;
const transform = String.raw`(?:${matrix}|${translate}|${rotate}|${scale}|${skewX}|${skewY})`;
const transforms = String.raw`(?:${transform}*)`;
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
  attributeValue = attributeValue
    .replace(new RegExp(`(${reNum})`, 'gi'), ' $1 ')
    // replace annoying commas and arbitrary whitespace with single spaces
    .replace(/,/gi, ' ')
    .replace(/\s+/gi, ' ')
    // remove spaces around parentheses
    .replace(/\s*([()])\s*/gi, '$1');

  // start with identity matrix
  let matrix: TMat2D = [...iMatrix];
  const matrices: TMat2D[] = [];

  // return if no argument was given or
  // an argument does not match transform attribute regexp
  if (
    !attributeValue ||
    (attributeValue && !reTransformList.test(attributeValue))
  ) {
    return matrix;
  }

  for (const match in attributeValue.matchAll(reTransform)) {
    const transformMatch = new RegExp(transform).exec(match);
    if (!transformMatch) {
      continue;
    }
    const matchedParams = transformMatch.filter((m) => !!m);
    const operation = matchedParams[1];
    const args = matchedParams.slice(2).map(parseFloat);

    switch (operation) {
      case 'translate':
        translateMatrix(matrix, args);
        break;
      case 'rotate':
        args[0] = degreesToRadians(args[0]);
        rotateMatrix(matrix, args);
        break;
      case 'scale':
        scaleMatrix(matrix, args);
        break;
      case 'skewX':
        skewMatrix(matrix, args, 2);
        break;
      case 'skewY':
        skewMatrix(matrix, args, 1);
        break;
      case 'matrix':
        matrix = args as TMat2D;
        break;
    }

    // snapshot current matrix into matrices array
    matrices.push([...matrix]);
    // reset
    matrix = [...iMatrix];
  }

  let combinedMatrix = matrices[0];
  while (matrices.length > 1) {
    matrices.shift();
    combinedMatrix = multiplyTransformMatrices(combinedMatrix, matrices[0]);
  }
  return combinedMatrix;
}
