export { cos } from './src/util/misc/cos';
export { sin } from './src/util/misc/sin';
export {
  rotateVector,
  createVector,
  calcAngleBetweenVectors,
  getUnitVector,
  getBisector,
} from './src/util/misc/vectors';
export {
  degreesToRadians,
  radiansToDegrees,
} from './src/util/misc/radiansDegreesConversion';
export { rotatePoint } from './src/util/misc/rotatePoint';
export { projectStrokeOnPoints } from './src/util/misc/projectStroke';
export {
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
  isIdentityMatrix,
} from './src/util/misc/matrix';
export {
  stylesFromArray,
  stylesToArray,
  hasStyleChanged,
} from './src/util/misc/textStyles';
export {
  createCanvasElement,
  createImage,
  copyCanvasElement,
  toDataURL,
} from './src/util/misc/dom';
export { toFixed } from './src/util/misc/toFixed';
export {
  matrixToSVG,
  parsePreserveAspectRatioAttribute,
  parseUnit,
  getSvgAttributes,
} from './src/util/misc/svgParsing';
export { groupSVGElements } from './src/util/misc/groupSVGElements';
export { findScaleToFit, findScaleToCover } from './src/util/misc/findScaleTo';
export { capValue } from './src/util/misc/capValue';
export {
  saveObjectTransform,
  resetObjectTransform,
  addTransformToObject,
  applyTransformToObject,
  removeTransformFromObject,
  sizeAfterTransform,
} from './src/util/misc/objectTransforms';
export { makeBoundingBoxFromPoints } from './src/util/misc/boundingBoxFromPoints';
export {
  calcPlaneChangeMatrix,
  sendPointToPlane,
  transformPointRelativeToCanvas,
  sendObjectToPlane,
} from './src/util/misc/planeChange';
export { graphemeSplit, escapeXml, capitalize } from './src/util/lang_string';
export {
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
} from './src/util/misc/objectEnlive';
export { pick } from './src/util/misc/pick';
export {
  joinPath,
  parsePath,
  makePathSimpler,
  getSmoothPathFromPoints,
  getPathSegmentsInfo,
  getBoundsOfCurve,
  getPointOnPath,
  transformPath,
  getRegularPolygonPath,
} from './src/util/path';
export { setStyle } from './src/util/dom_style';
export { isTouchEvent, getPointer } from './src/util/dom_event';
export {
  // getScrollLeftTop,
  getElementOffset,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable,
} from './src/util/dom_misc';
export { isTransparent } from './src/util/misc/isTransparent';
export { mergeClipPaths } from './src/util/misc/mergeClipPaths';
export { animate, animateColor } from './src/util/animation/animate';
export * as ease from './src/util/animation/easing';
export {
  requestAnimFrame,
  cancelAnimFrame,
} from './src/util/animation/AnimationFrameProvider';
export { classRegistry } from './src/util/class_registry';
export { removeFromArray } from './src/util/internals/removeFromArray';
export { getRandomInt } from './src/util/internals/getRandomInt';
export { wrapElement } from './src/util/dom_misc';
export { request } from './src/util/dom_request';
export { removeTransformMatrixForSvgParsing } from './src/util/transform_matrix_removal';

// const util = {
//   rotatePoint,
//   removeFromArray,
//   getRandomInt,
//   wrapElement,
//   parsePreserveAspectRatioAttribute,
//   pick,
//   setStyle,
//   getSvgAttributes,
//   cos,
//   sin,
//   rotateVector,
//   createVector,
//   calcAngleBetweenVectors,
//   getUnitVector,
//   getBisector,
//   degreesToRadians,
//   radiansToDegrees,
//   projectStrokeOnPoints,
//   transformPoint,
//   invertTransform,
//   composeMatrix,
//   qrDecompose,
//   calcDimensionsMatrix,
//   calcRotateMatrix,
//   multiplyTransformMatrices,
//   isIdentityMatrix,
//   stylesFromArray,
//   stylesToArray,
//   hasStyleChanged,
//   getElementOffset,
//   createCanvasElement,
//   createImage,
//   copyCanvasElement,
//   toDataURL,
//   toFixed,
//   matrixToSVG,
//   groupSVGElements,
//   parseUnit,
//   // is anyone using it?
//   findScaleToFit,
//   findScaleToCover,
//   capValue,
//   saveObjectTransform,
//   resetObjectTransform,
//   addTransformToObject,
//   applyTransformToObject,
//   removeTransformFromObject,
//   makeBoundingBoxFromPoints,
//   calcPlaneChangeMatrix,
//   sendPointToPlane,
//   transformPointRelativeToCanvas,
//   sendObjectToPlane,
//   string: {
//     graphemeSplit,
//     capitalize,
//     escapeXml,
//   },
//   loadImage,
//   enlivenObjects,
//   enlivenObjectEnlivables,
//   joinPath,
//   parsePath,
//   makePathSimpler,
//   getSmoothPathFromPoints,
//   getPathSegmentsInfo,
//   getBoundsOfCurve,
//   getPointOnPath,
//   transformPath,
//   getRegularPolygonPath,
//   isTouchEvent,
//   getPointer,
//   // getScrollLeftTop,
//   cleanUpJsdomNode,
//   makeElementUnselectable,
//   makeElementSelectable,
//   isTransparent,
//   sizeAfterTransform,
//   mergeClipPaths,
//   request,
//   ease,
//   animateColor,
//   animate,
//   requestAnimFrame,
//   cancelAnimFrame,
//   classRegistry,
//   // for test compatibility. We don't want to export it.
//   removeTransformMatrixForSvgParsing,
// };
