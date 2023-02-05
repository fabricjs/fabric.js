export { cos } from './misc/cos';
export { sin } from './misc/sin';
export {
  rotateVector,
  createVector,
  calcAngleBetweenVectors,
  getUnitVector,
  getBisector,
} from './misc/vectors';
export {
  degreesToRadians,
  radiansToDegrees,
} from './misc/radiansDegreesConversion';
export { rotatePoint } from './misc/rotatePoint';
export { projectStrokeOnPoints } from './misc/projectStroke';
export {
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
  isIdentityMatrix,
} from './misc/matrix';
export {
  stylesFromArray,
  stylesToArray,
  hasStyleChanged,
} from './misc/textStyles';
export {
  createCanvasElement,
  createImage,
  copyCanvasElement,
  toDataURL,
} from './misc/dom';
export { toFixed } from './misc/toFixed';
export {
  matrixToSVG,
  parsePreserveAspectRatioAttribute,
  parseUnit,
  getSvgAttributes,
} from './misc/svgParsing';
export { groupSVGElements } from './misc/groupSVGElements';
export { findScaleToFit, findScaleToCover } from './misc/findScaleTo';
export { capValue } from './misc/capValue';
export {
  saveObjectTransform,
  resetObjectTransform,
  addTransformToObject,
  applyTransformToObject,
  removeTransformFromObject,
  sizeAfterTransform,
} from './misc/objectTransforms';
export { makeBoundingBoxFromPoints } from './misc/boundingBoxFromPoints';
export {
  calcPlaneChangeMatrix,
  sendPointToPlane,
  transformPointRelativeToCanvas,
  sendObjectToPlane,
} from './misc/planeChange';
export * as string from './lang_string';
export {
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
} from './misc/objectEnlive';
export { pick } from './misc/pick';
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
} from './path';
export { setStyle } from './dom_style';
export { isTouchEvent, getPointer } from './dom_event';
export {
  // getScrollLeftTop,
  getElementOffset,
  makeElementUnselectable,
  makeElementSelectable,
} from './dom_misc';
export { isTransparent } from './misc/isTransparent';
export { mergeClipPaths } from './misc/mergeClipPaths';
export { animate, animateColor } from './animation/animate';
export * as ease from './animation/easing';
export {
  requestAnimFrame,
  cancelAnimFrame,
} from './animation/AnimationFrameProvider';
export { removeFromArray } from './internals/removeFromArray';
export { getRandomInt } from './internals/getRandomInt';
export { wrapElement } from './dom_misc';
export { request } from './dom_request';

// for test compatibility. We don't want to export it
export { removeTransformMatrixForSvgParsing } from './transform_matrix_removal';
