// FILTERS
import { BaseFilter } from './src/filters/BaseFilter';
import { BlendColor } from './src/filters/BlendColor';
import { BlendImage } from './src/filters/BlendImage';
import { Blur } from './src/filters/Blur';
import { Brightness } from './src/filters/Brightness';
import { ColorMatrix } from './src/filters/ColorMatrix';
import { Composed } from './src/filters/Composed';
import { Contrast } from './src/filters/Contrast';
import { Convolute } from './src/filters/Convolute';
import {
  Sepia,
  Brownie,
  Vintage,
  Kodachrome,
  Technicolor,
  Polaroid,
  BlackWhite,
} from './src/filters/ColorMatrixFilters';
import { Gamma } from './src/filters/Gamma';
import { Grayscale } from './src/filters/Grayscale';
import { HueRotation } from './src/filters/HueRotation';
import { Invert } from './src/filters/Invert';
import { Noise } from './src/filters/Noise';
import { Pixelate } from './src/filters/Pixelate';
import { RemoveColor } from './src/filters/RemoveColor';
import { Resize } from './src/filters/Resize';
import { Saturation } from './src/filters/Saturation';
import { Vibrance } from './src/filters/Vibrance';

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

import { cos } from './src/util/misc/cos';
import { sin } from './src/util/misc/sin';
import {
  rotateVector,
  createVector,
  calcAngleBetweenVectors,
  getUnitVector,
  getBisector,
} from './src/util/misc/vectors';
import {
  degreesToRadians,
  radiansToDegrees,
} from './src/util/misc/radiansDegreesConversion';
import { rotatePoint } from './src/util/misc/rotatePoint';
import { projectStrokeOnPoints } from './src/util/misc/projectStroke';
import {
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
  isIdentityMatrix,
} from './src/util/misc/matrix';
import {
  stylesFromArray,
  stylesToArray,
  hasStyleChanged,
} from './src/util/misc/textStyles';
import {
  createCanvasElement,
  createImage,
  copyCanvasElement,
  toDataURL,
} from './src/util/misc/dom';
import { toFixed } from './src/util/misc/toFixed';
import {
  matrixToSVG,
  parsePreserveAspectRatioAttribute,
  parseUnit,
  getSvgAttributes,
} from './src/util/misc/svgParsing';
import { groupSVGElements } from './src/util/misc/groupSVGElements';
import { findScaleToFit, findScaleToCover } from './src/util/misc/findScaleTo';
import { capValue } from './src/util/misc/capValue';
import {
  saveObjectTransform,
  resetObjectTransform,
  addTransformToObject,
  applyTransformToObject,
  removeTransformFromObject,
  sizeAfterTransform,
} from './src/util/misc/objectTransforms';
import { makeBoundingBoxFromPoints } from './src/util/misc/boundingBoxFromPoints';
import {
  calcPlaneChangeMatrix,
  sendPointToPlane,
  transformPointRelativeToCanvas,
  sendObjectToPlane,
} from './src/util/misc/planeChange';
import { graphemeSplit, escapeXml, capitalize } from './src/util/lang_string';
import {
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
} from './src/util/misc/objectEnlive';
import { pick } from './src/util/misc/pick';
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
} from './src/util/path';
import { setStyle } from './src/util/dom_style';
import { isTouchEvent, getPointer } from './src/util/dom_event';
import {
  // getScrollLeftTop,
  getElementOffset,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable,
} from './src/util/dom_misc';
import { isTransparent } from './src/util/misc/isTransparent';
import { mergeClipPaths } from './src/util/misc/mergeClipPaths';
import { animate, animateColor } from './src/util/animation/animate';
import * as ease from './src/util/animation/easing';
import {
  requestAnimFrame,
  cancelAnimFrame,
} from './src/util/animation/AnimationFrameProvider';
import { classRegistry } from './src/util/class_registry';
import { removeFromArray } from './src/util/internals/removeFromArray';
import { getRandomInt } from './src/util/internals/getRandomInt';
import { wrapElement } from './src/util/dom_misc';
import { request } from './src/util/dom_request';
import { removeTransformMatrixForSvgParsing } from './src/util/transform_matrix_removal';
import { parseFontDeclaration } from './src/parser/parseFontDeclaration';

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

import { changeWidth } from './src/controls/changeWidth';
import {
  renderCircleControl,
  renderSquareControl,
} from './src/controls/controls.render';
import { dragHandler } from './src/controls/drag';
import { createPolyControls } from './src/controls/polyControl';
import {
  rotationStyleHandler,
  rotationWithSnapping,
} from './src/controls/rotate';
import {
  scaleCursorStyleHandler,
  scalingEqually,
  scalingX,
  scalingY,
} from './src/controls/scale';
import {
  scaleOrSkewActionName,
  scaleSkewCursorStyleHandler,
  scalingXOrSkewingY,
  scalingYOrSkewingX,
} from './src/controls/scaleSkew';
import {
  skewCursorStyleHandler,
  skewHandlerX,
  skewHandlerY,
} from './src/controls/skew';
import { getLocalPoint } from './src/controls/util';
import { wrapWithFireEvent } from './src/controls/wrapWithFireEvent';
import { wrapWithFixedAnchor } from './src/controls/wrapWithFixedAnchor';

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

import { cache } from './src/cache';
import { VERSION as version, iMatrix } from './src/constants';
import { StaticCanvas } from './src/canvas/StaticCanvas';
import { Canvas } from './src/canvas/Canvas';
import { config } from './src/config';
import { loadSVGFromURL } from './src/parser/loadSVGFromURL';
import { loadSVGFromString } from './src/parser/loadSVGFromString';
import { initFilterBackend } from './src/filters/FilterBackend';
import { Canvas2dFilterBackend } from './src/filters/Canvas2dFilterBackend';
import { WebGLFilterBackend } from './src/filters/WebGLFilterBackend';
import { runningAnimations } from './src/util/animation/AnimationRegistry';
import { Observable } from './src/Observable';
import { Point } from './src/Point';
import { Intersection } from './src/Intersection';
import { Color } from './src/color/Color';
import { Control } from './src/controls/Control';
import { Gradient } from './src/gradient/Gradient';
import { Pattern } from './src/Pattern';
import { Shadow } from './src/Shadow';
import { BaseBrush } from './src/brushes/BaseBrush';
import { PencilBrush } from './src/brushes/PencilBrush';
import { CircleBrush } from './src/brushes/CircleBrush';
import { SprayBrush } from './src/brushes/SprayBrush';
import { PatternBrush } from './src/brushes/PatternBrush';
import { FabricObject as Object } from './src/shapes/Object/FabricObject';
import { Line } from './src/shapes/Line';
import { Circle } from './src/shapes/Circle';
import { Triangle } from './src/shapes/Triangle';
import { Ellipse } from './src/shapes/Ellipse';
import { Rect } from './src/shapes/Rect';
import { Path } from './src/shapes/Path';
import { Polyline } from './src/shapes/Polyline';
import { Polygon } from './src/shapes/Polygon';
import { Text } from './src/shapes/Text/Text';
import { IText } from './src/shapes/IText/IText';
import { Textbox } from './src/shapes/Textbox';
import { Group } from './src/shapes/Group';
import { ActiveSelection } from './src/shapes/ActiveSelection';
import { Image } from './src/shapes/Image';
import { getEnv, getDocument, getWindow, setEnvForTests } from './src/env';
import { createCollectionMixin } from './src/Collection';
import { parseAttributes } from './src/parser/parseAttributes';
import { parseElements } from './src/parser/parseElements';
import { getFilterBackend } from './src/filters/FilterBackend';
import { parseStyleAttribute } from './src/parser/parseStyleAttribute';
import { parsePointsAttribute } from './src/parser/parsePointsAttribute';
import { parseTransformAttribute } from './src/parser/parseTransformAttribute';
import { getCSSRules } from './src/parser/getCSSRules';

import './src/controls/default_controls';

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
