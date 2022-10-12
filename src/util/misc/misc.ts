import { fabric } from '../../../HEADER';
import {
  animate,
  animateColor,
  cancelAnimFrame,
  ease,
  requestAnimFrame,
} from '../animation';
import {
  addListener,
  getPointer,
  isTouchEvent,
  removeListener,
} from '../dom_event';
import {
  cleanUpJsdomNode,
  getElementOffset,
  getNodeCanvas,
  getScrollLeftTop,
  makeElementSelectable,
  makeElementUnselectable,
  wrapElement,
} from '../dom_misc';
import { request } from '../dom_request';
import { setStyle } from '../dom_style';
import { getRandomInt, removeFromArray } from '../internals';
import { createClass } from '../lang_class';
import { clone, extend } from '../lang_object';
import { camelize, capitalize, escapeXml, graphemeSplit } from '../lang_string';
import {
  getBoundsOfCurve,
  getPathSegmentsInfo,
  getPointOnPath,
  getRegularPolygonPath,
  getSmoothPathFromPoints,
  joinPath,
  makePathSimpler,
  parsePath,
  transformPath,
} from '../path';
import { makeBoundingBoxFromPoints } from './boundingBoxFromPoints';
import { capValue } from './capValue';
import { cos } from './cos';
import {
  copyCanvasElement,
  createCanvasElement,
  createImage,
  toDataURL,
} from './dom';
import { findScaleToCover, findScaleToFit } from './findScaleTo';
import { isTransparent } from './isTransparent';
import {
  calcDimensionsMatrix,
  calcRotateMatrix,
  composeMatrix,
  invertTransform,
  multiplyTransformMatrices,
  qrDecompose,
  transformPoint,
} from './matrix';
import { mergeClipPaths } from './mergeClipPaths';
import {
  enlivenObjectEnlivables,
  enlivenObjects,
  getKlass,
  loadImage,
} from './objectEnlive';
import {
  addTransformToObject,
  applyTransformToObject,
  removeTransformFromObject,
  resetObjectTransform,
  saveObjectTransform,
  sizeAfterTransform,
} from './objectTransforms';
import { pick } from './pick';
import {
  calcPlaneChangeMatrix,
  sendObjectToPlane,
  sendPointToPlane,
  transformPointRelativeToCanvas,
} from './planeChange';
import { projectStrokeOnPoints } from './projectStroke';
import { degreesToRadians, radiansToDegrees } from './radiansDegreesConversion';
import { rotatePoint } from './rotatePoint';
import { sin } from './sin';
import {
  getSvgAttributes,
  groupSVGElements,
  matrixToSVG,
  parsePreserveAspectRatioAttribute,
  parseUnit,
} from './svgParsing';
import { hasStyleChanged, stylesFromArray, stylesToArray } from './textStyles';
import { toFixed } from './toFixed';
import {
  calcAngleBetweenVectors,
  createVector,
  getBisector,
  getHatVector,
  rotateVector,
} from './vectors';
/**
 * @namespace fabric.util
 */
fabric.util = {
  cos,
  sin,
  rotateVector,
  createVector,
  calcAngleBetweenVectors,
  getHatVector,
  getBisector,
  degreesToRadians,
  radiansToDegrees,
  rotatePoint,
  // probably we should stop exposing this from the interface
  getRandomInt,
  removeFromArray,
  projectStrokeOnPoints,
  // matrix.ts file
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
  // textStyles.ts file
  stylesFromArray,
  stylesToArray,
  hasStyleChanged,
  object: {
    clone,
    extend,
  },
  createCanvasElement,
  createImage,
  copyCanvasElement,
  toDataURL,
  toFixed,
  matrixToSVG,
  parsePreserveAspectRatioAttribute,
  groupSVGElements,
  parseUnit,
  getSvgAttributes,
  findScaleToFit,
  findScaleToCover,
  capValue,
  saveObjectTransform,
  resetObjectTransform,
  addTransformToObject,
  applyTransformToObject,
  removeTransformFromObject,
  makeBoundingBoxFromPoints,
  calcPlaneChangeMatrix,
  sendPointToPlane,
  transformPointRelativeToCanvas,
  sendObjectToPlane,
  string: {
    camelize,
    capitalize,
    escapeXml,
    graphemeSplit,
  },
  getKlass,
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
  pick,
  joinPath,
  parsePath,
  makePathSimpler,
  getSmoothPathFromPoints,
  getPathSegmentsInfo,
  getBoundsOfCurve,
  getPointOnPath,
  transformPath,
  getRegularPolygonPath,
  request,
  setStyle,
  isTouchEvent,
  getPointer,
  removeListener,
  addListener,
  wrapElement,
  getScrollLeftTop,
  getElementOffset,
  getNodeCanvas,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable,
  isTransparent,
  sizeAfterTransform,
  mergeClipPaths,
  ease,
  animateColor,
  animate,
  requestAnimFrame,
  cancelAnimFrame,
  createClass,
};
