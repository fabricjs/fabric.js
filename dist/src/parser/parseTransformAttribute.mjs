import { taggedTemplateLiteral as _taggedTemplateLiteral } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { iMatrix, ROTATE, SKEW_Y, SKEW_X, SCALE } from '../constants.mjs';
import { reNum } from './constants.mjs';
import { cleanupSvgAttribute } from '../util/internals/cleanupSvgAttribute.mjs';
import { createRotateMatrix, multiplyTransformMatrixArray, createSkewYMatrix, createSkewXMatrix, createScaleMatrix, createTranslateMatrix } from '../util/misc/matrix.mjs';

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;

// == begin transform regexp
const p = "(".concat(reNum, ")");
const skewX = String.raw(_templateObject || (_templateObject = _taggedTemplateLiteral(["(skewX)(", ")"], ["(skewX)\\(", "\\)"])), p);
const skewY = String.raw(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["(skewY)(", ")"], ["(skewY)\\(", "\\)"])), p);
const rotate = String.raw(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["(rotate)(", "(?: ", " ", ")?)"], ["(rotate)\\(", "(?: ", " ", ")?\\)"])), p, p, p);
const scale = String.raw(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["(scale)(", "(?: ", ")?)"], ["(scale)\\(", "(?: ", ")?\\)"])), p, p);
const translate = String.raw(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["(translate)(", "(?: ", ")?)"], ["(translate)\\(", "(?: ", ")?\\)"])), p, p);
const matrix = String.raw(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["(matrix)(", " ", " ", " ", " ", " ", ")"], ["(matrix)\\(", " ", " ", " ", " ", " ", "\\)"])), p, p, p, p, p, p);
const transform = "(?:".concat(matrix, "|").concat(translate, "|").concat(rotate, "|").concat(scale, "|").concat(skewX, "|").concat(skewY, ")");
const transforms = "(?:".concat(transform, "*)");
const transformList = String.raw(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["^s*(?:", "?)s*$"], ["^\\s*(?:", "?)\\s*$"])), transforms);
// http://www.w3.org/TR/SVG/coords.html#TransformAttribute
const reTransformList = new RegExp(transformList);
const reTransform = new RegExp(transform);
const reTransformAll = new RegExp(transform, 'g');
// == end transform regexp

/**
 * Parses "transform" attribute, returning an array of values
 * @static
 * @function
 * @memberOf fabric
 * @param {String} attributeValue String containing attribute value
 * @return {TTransformMatrix} Array of 6 elements representing transformation matrix
 */
function parseTransformAttribute(attributeValue) {
  // first we clean the string
  attributeValue = cleanupSvgAttribute(attributeValue)
  // remove spaces around front parentheses
  .replace(/\s*([()])\s*/gi, '$1');

  // start with identity matrix
  const matrices = [];

  // return if no argument was given or
  // an argument does not match transform attribute regexp
  if (!attributeValue || attributeValue && !reTransformList.test(attributeValue)) {
    return [...iMatrix];
  }
  for (const match of attributeValue.matchAll(reTransformAll)) {
    const transformMatch = reTransform.exec(match[0]);
    if (!transformMatch) {
      continue;
    }
    let matrix = iMatrix;
    const matchedParams = transformMatch.filter(m => !!m);
    const [, operation, ...rawArgs] = matchedParams;
    const [arg0, arg1, arg2, arg3, arg4, arg5] = rawArgs.map(arg => parseFloat(arg));
    switch (operation) {
      case 'translate':
        matrix = createTranslateMatrix(arg0, arg1);
        break;
      case ROTATE:
        matrix = createRotateMatrix({
          angle: arg0
        }, {
          x: arg1,
          y: arg2
        });
        break;
      case SCALE:
        matrix = createScaleMatrix(arg0, arg1);
        break;
      case SKEW_X:
        matrix = createSkewXMatrix(arg0);
        break;
      case SKEW_Y:
        matrix = createSkewYMatrix(arg0);
        break;
      case 'matrix':
        matrix = [arg0, arg1, arg2, arg3, arg4, arg5];
        break;
    }

    // snapshot current matrix into matrices array
    matrices.push(matrix);
  }
  return multiplyTransformMatrixArray(matrices);
}

export { parseTransformAttribute };
//# sourceMappingURL=parseTransformAttribute.mjs.map
