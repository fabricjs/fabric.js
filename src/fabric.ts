// FILTERS
import { BaseFilter } from './filters/BaseFilter';
import { BlendColor } from './filters/BlendColor';
import { BlendImage } from './filters/BlendImage';
import { Blur } from './filters/Blur';
import { Brightness } from './filters/Brightness';
import { ColorMatrix } from './filters/ColorMatrix';
import { Composed } from './filters/Composed';
import { Contrast } from './filters/Contrast';
import { Convolute } from './filters/Convolute';
import {
  Sepia,
  Brownie,
  Vintage,
  Kodachrome,
  Technicolor,
  Polaroid,
  BlackWhite,
} from './filters/ColorMatrixFilters';
import { Gamma } from './filters/Gamma';
import { Grayscale } from './filters/Grayscale';
import { HueRotation } from './filters/HueRotation';
import { Invert } from './filters/Invert';
import { Noise } from './filters/Noise';
import { Pixelate } from './filters/Pixelate';
import { RemoveColor } from './filters/RemoveColor';
import { Resize } from './filters/Resize';
import { Saturation } from './filters/Saturation';
import { Vibrance } from './filters/Vibrance';

const filters = {
  BaseFilter,
  BlendColor,
  BlendImage,
  Blur,
  Brightness,
  ColorMatrix,
  Composed,
  Contrast,
  Convolute,
  Sepia,
  Brownie,
  Vintage,
  Kodachrome,
  Technicolor,
  Polaroid,
  BlackWhite,
  Gamma,
  Grayscale,
  HueRotation,
  Invert,
  Noise,
  Pixelate,
  RemoveColor,
  Resize,
  Saturation,
  Vibrance,
};

// UTILS

import { cos } from './util/misc/cos';
import { sin } from './util/misc/sin';
import {
  rotateVector,
  createVector,
  calcAngleBetweenVectors,
  getUnitVector,
  getBisector,
} from './util/misc/vectors';
import {
  degreesToRadians,
  radiansToDegrees,
} from './util/misc/radiansDegreesConversion';
import { rotatePoint } from './util/misc/rotatePoint';
import { projectStrokeOnPoints } from './util/misc/projectStroke';
import {
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
  isIdentityMatrix,
} from './util/misc/matrix';
import {
  stylesFromArray,
  stylesToArray,
  hasStyleChanged,
} from './util/misc/textStyles';
import {
  createCanvasElement,
  createImage,
  copyCanvasElement,
  toDataURL,
} from './util/misc/dom';
import { toFixed } from './util/misc/toFixed';
import {
  matrixToSVG,
  parsePreserveAspectRatioAttribute,
  parseUnit,
  getSvgAttributes,
} from './util/misc/svgParsing';
import { groupSVGElements } from './util/misc/groupSVGElements';
import { findScaleToFit, findScaleToCover } from './util/misc/findScaleTo';
import { capValue } from './util/misc/capValue';
import {
  saveObjectTransform,
  resetObjectTransform,
  addTransformToObject,
  applyTransformToObject,
  removeTransformFromObject,
  sizeAfterTransform,
} from './util/misc/objectTransforms';
import { makeBoundingBoxFromPoints } from './util/misc/boundingBoxFromPoints';
import {
  calcPlaneChangeMatrix,
  sendPointToPlane,
  transformPointRelativeToCanvas,
  sendObjectToPlane,
} from './util/misc/planeChange';
import { graphemeSplit, escapeXml, capitalize } from './util/lang_string';
import {
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
} from './util/misc/objectEnlive';
import { pick } from './util/misc/pick';
import {
  joinPath,
  parsePath,
  makePathSimpler,
  getSmoothPathFromPoints,
  getPathSegmentsInfo,
  getBoundsOfCurve,
  getPointOnPath,
  transformPath,
  getRegularPolygonPath,
} from './util/path';
import { setStyle } from './util/dom_style';
import { isTouchEvent, getPointer } from './util/dom_event';
import {
  // getScrollLeftTop,
  getElementOffset,
  getNodeCanvas,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable,
} from './util/dom_misc';
import { isTransparent } from './util/misc/isTransparent';
import { mergeClipPaths } from './util/misc/mergeClipPaths';
import { animate, animateColor } from './util/animation/animate';
import * as ease from './util/animation/easing';
import {
  requestAnimFrame,
  cancelAnimFrame,
} from './util/animation/AnimationFrameProvider';
import { classRegistry } from './util/class_registry';
import { removeFromArray } from './util/internals/removeFromArray';
import { getRandomInt } from './util/internals/getRandomInt';
import { wrapElement } from './util/dom_misc';
import { request } from './util/dom_request';
import { removeTransformMatrixForSvgParsing } from './util/transform_matrix_removal';
import { parseFontDeclaration } from './parser/parseFontDeclaration';

const util = {
  rotatePoint,
  removeFromArray,
  getRandomInt,
  wrapElement,
  parsePreserveAspectRatioAttribute,
  pick,
  setStyle,
  getSvgAttributes,
  cos,
  sin,
  rotateVector,
  createVector,
  calcAngleBetweenVectors,
  getUnitVector,
  getBisector,
  degreesToRadians,
  radiansToDegrees,
  projectStrokeOnPoints,
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
  isIdentityMatrix,
  stylesFromArray,
  stylesToArray,
  hasStyleChanged,
  getElementOffset,
  createCanvasElement,
  createImage,
  copyCanvasElement,
  toDataURL,
  toFixed,
  matrixToSVG,
  groupSVGElements,
  parseUnit,
  // is anyone using it?
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
    graphemeSplit,
    capitalize,
    escapeXml,
  },
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
  joinPath,
  parsePath,
  makePathSimpler,
  getSmoothPathFromPoints,
  getPathSegmentsInfo,
  getBoundsOfCurve,
  getPointOnPath,
  transformPath,
  getRegularPolygonPath,
  isTouchEvent,
  getPointer,
  // getScrollLeftTop,
  getNodeCanvas,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable,
  isTransparent,
  sizeAfterTransform,
  mergeClipPaths,
  request,
  ease, // those are a lot of functions
  animateColor,
  animate,
  requestAnimFrame,
  cancelAnimFrame,
  classRegistry,
  // for test compatibility. We don't want to export it.
  removeTransformMatrixForSvgParsing,
};

// CONTROLS UTILS

import { changeWidth } from './controls/changeWidth';
import {
  renderCircleControl,
  renderSquareControl,
} from './controls/controls.render';
import { dragHandler } from './controls/drag';
import { createPolyControls } from './controls/polyControl';
import {
  rotationStyleHandler,
  rotationWithSnapping,
} from './controls/rotate';
import {
  scaleCursorStyleHandler,
  scalingEqually,
  scalingX,
  scalingY,
} from './controls/scale';
import {
  scaleOrSkewActionName,
  scaleSkewCursorStyleHandler,
  scalingXOrSkewingY,
  scalingYOrSkewingX,
} from './controls/scaleSkew';
import {
  skewCursorStyleHandler,
  skewHandlerX,
  skewHandlerY,
} from './controls/skew';
import { getLocalPoint } from './controls/util';
import { wrapWithFireEvent } from './controls/wrapWithFireEvent';
import { wrapWithFixedAnchor } from './controls/wrapWithFixedAnchor';

/**
 * @todo remove as unused
 */
const controlsUtils = {
  scaleCursorStyleHandler,
  skewCursorStyleHandler,
  scaleSkewCursorStyleHandler,
  rotationWithSnapping,
  scalingEqually,
  scalingX,
  scalingY,
  scalingYOrSkewingX,
  scalingXOrSkewingY,
  changeWidth,
  skewHandlerX,
  skewHandlerY,
  dragHandler,
  createPolyControls,
  scaleOrSkewActionName,
  rotationStyleHandler,
  wrapWithFixedAnchor,
  wrapWithFireEvent,
  getLocalPoint,
  renderCircleControl,
  renderSquareControl,
};

// EXPORTS

import { cache } from './cache';
import { VERSION as version, iMatrix } from './constants';
import { StaticCanvas } from './canvas/StaticCanvas';
import { Canvas } from './canvas/Canvas';
import { config } from './config';
import { loadSVGFromURL } from './parser/loadSVGFromURL';
import { loadSVGFromString } from './parser/loadSVGFromString';
import { initFilterBackend } from './filters/FilterBackend';
import { Canvas2dFilterBackend } from './filters/Canvas2dFilterBackend';
import { WebGLFilterBackend } from './filters/WebGLFilterBackend';
import { runningAnimations } from './util/animation/AnimationRegistry';
import { Observable } from './Observable';
import { Point } from './Point';
import { Intersection } from './Intersection';
import { Color } from './color/Color';
import { Control } from './controls/Control';
import { Gradient } from './gradient/Gradient';
import { Pattern } from './Pattern';
import { Shadow } from './Shadow';
import { BaseBrush } from './brushes/BaseBrush';
import { PencilBrush } from './brushes/PencilBrush';
import { CircleBrush } from './brushes/CircleBrush';
import { SprayBrush } from './brushes/SprayBrush';
import { PatternBrush } from './brushes/PatternBrush';
import { FabricObject as Object } from './shapes/Object/FabricObject';
import { Line } from './shapes/Line';
import { Circle } from './shapes/Circle';
import { Triangle } from './shapes/Triangle';
import { Ellipse } from './shapes/Ellipse';
import { Rect } from './shapes/Rect';
import { Path } from './shapes/Path';
import { Polyline } from './shapes/Polyline';
import { Polygon } from './shapes/Polygon';
import { Text } from './shapes/Text/Text';
import { IText } from './shapes/IText/IText';
import { Textbox } from './shapes/Textbox';
import { Group } from './shapes/Group';
import { ActiveSelection } from './shapes/ActiveSelection';
import { Image } from './shapes/Image';
import { getEnv, getDocument, getWindow, setEnvForTests } from './env';
import { createCollectionMixin } from './Collection';
import { parseAttributes } from './parser/parseAttributes';
import { parseElements } from './parser/parseElements';
import { getFilterBackend } from './filters/FilterBackend';
import { parseStyleAttribute } from './parser/parseStyleAttribute';
import { parsePointsAttribute } from './parser/parsePointsAttribute';
import { parseTransformAttribute } from './parser/parseTransformAttribute';
import { getCSSRules } from './parser/getCSSRules';

import './controls/default_controls';

export {
  parseElements,
  parseAttributes,
  cache,
  version,
  iMatrix,
  createCollectionMixin,
  StaticCanvas,
  Canvas,
  config,
  loadSVGFromURL,
  loadSVGFromString,
  initFilterBackend,
  Canvas2dFilterBackend,
  WebGLFilterBackend,
  runningAnimations,
  Point,
  Intersection,
  Color,
  Control,
  Observable,
  Gradient,
  Pattern,
  Shadow,
  BaseBrush,
  PencilBrush,
  CircleBrush,
  SprayBrush,
  PatternBrush,
  Object,
  Line,
  Circle,
  Triangle,
  Ellipse,
  Rect,
  Path,
  Polyline,
  Polygon,
  Text,
  IText,
  Textbox,
  Group,
  ActiveSelection,
  Image,
  controlsUtils,
  util,
  filters,
  getFilterBackend,
  getEnv,
  getDocument,
  getWindow,
  setEnvForTests,
  parseStyleAttribute,
  parsePointsAttribute,
  parseFontDeclaration,
  parseTransformAttribute,
  getCSSRules,
};
