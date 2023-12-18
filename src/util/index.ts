export { cos } from './misc/cos';
export { sin } from './misc/sin';
export {
  rotateVector,
  createVector,
  calcAngleBetweenVectors,
  getUnitVector,
  calcVectorRotation,
  crossProduct,
  dotProduct,
  getOrthonormalVector,
  isBetweenVectors,
  magnitude,
} from './misc/vectors';
export {
  degreesToRadians,
  radiansToDegrees,
} from './misc/radiansDegreesConversion';
export { rotatePoint } from './misc/rotatePoint';
export * from './misc/projectStroke';
export type {
  TComposeMatrixArgs,
  TQrDecomposeOut,
  TRotateMatrixArgs,
  TScaleMatrixArgs,
  TTranslateMatrixArgs,
} from './misc/matrix';
export {
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  createTranslateMatrix,
  createRotateMatrix,
  createScaleMatrix,
  createSkewXMatrix,
  createSkewYMatrix,
  calcDimensionsMatrix,
  multiplyTransformMatrices,
  multiplyTransformMatrixArray,
  isIdentityMatrix,
} from './misc/matrix';
export type { TextStyleArray } from './misc/textStyles';
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
  sendVectorToPlane,
  sendObjectToPlane,
} from './misc/planeChange';
export * as string from './lang_string';
export type {
  EnlivenObjectOptions,
  LoadImageOptions,
} from './misc/objectEnlive';
export {
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
} from './misc/objectEnlive';
export { pick } from './misc/pick';
export * from './path/typedefs';
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
export { isTransparent } from './misc/isTransparent';
export { mergeClipPaths } from './misc/mergeClipPaths';
export * from './animation';
export * as ease from './animation/easing';
export {
  requestAnimFrame,
  cancelAnimFrame,
} from './animation/AnimationFrameProvider';
export { removeFromArray } from './internals/removeFromArray';
export { getRandomInt } from './internals/getRandomInt';
export { request } from './internals/dom_request';

// for test compatibility. We don't want to export it
export { removeTransformMatrixForSvgParsing } from './transform_matrix_removal';
