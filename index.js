// FILTERS
import { BaseFilter } from './src/filters/base_filter.class';
import { BlendColor } from './src/filters/blendcolor_filter.class';
import { BlendImage } from './src/filters/blendimage_filter.class';
import { Blur } from './src/filters/blur_filter.class';
import { Brightness } from './src/filters/brightness_filter.class';
import { ColorMatrix } from './src/filters/colormatrix_filter.class';
import { Composed } from './src/filters/composed_filter.class';
import { Contrast } from './src/filters/contrast_filter.class';
import { Convolute } from './src/filters/convolute_filter.class';
import {
  Sepia,
  Brownie,
  Vintage,
  Kodachrome,
  Technicolor,
  Polaroid,
  BlackWhite,
} from './src/filters/filter_generator';
import { Gamma } from './src/filters/gamma_filter.class';
import { Grayscale } from './src/filters/grayscale_filter.class';
import { HueRotation } from './src/filters/hue_rotation.class';
import { Invert } from './src/filters/invert_filter.class';
import { Noise } from './src/filters/noise_filter.class';
import { Pixelate } from './src/filters/pixelate_filter.class';
import { RemoveColor } from './src/filters/removecolor_filter.class';
import { Resize } from './src/filters/resize_filter.class';
import { Saturation } from './src/filters/saturate_filter.class';
import { Vibrance } from './src/filters/vibrance_filter.class';

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
} from './src/util/misc/matrix';
import {
  stylesFromArray,
  stylesToArray,
  hasStyleChanged,
} from './src/util/misc/textStyles';
import { clone, extend } from './src/util/lang_object';
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
  getNodeCanvas,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable,
} from './src/util/dom_misc';
import { isTransparent } from './src/util/misc/isTransparent';
import { mergeClipPaths } from './src/util/misc/mergeClipPaths';
import {
  animate,
  animateColor,
  ease,
  requestAnimFrame,
  cancelAnimFrame,
} from './src/util/animation';
import { classRegistry } from './src/util/class_registry';
import { removeFromArray } from './src/util/internals/removeFromArray';
import { getRandomInt } from './src/util/internals/getRandomInt';
import { wrapElement } from './src/util/dom_misc';
import { request } from './src/util/dom_request';
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
  stylesFromArray,
  stylesToArray,
  hasStyleChanged,
  getElementOffset,
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
};

// CONTROLS UTILS

import { changeWidth } from './src/controls/changeWidth';
import {
  renderCircleControl,
  renderSquareControl,
} from './src/controls/controls.render';
import { dragHandler } from './src/controls/drag';
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
import { StaticCanvas } from './src/canvas/static_canvas.class';
import { Canvas } from './src/canvas/canvas_events';
import { config } from './src/config';
import { loadSVGFromURL } from './src/parser/loadSVGFromURL';
import { loadSVGFromString } from './src/parser/loadSVGFromString';
import { initFilterBackend } from './src/filters/FilterBackend';
import { Canvas2dFilterBackend } from './src/filters/2d_backend.class';
import { WebGLFilterBackend } from './src/filters/webgl_backend.class';
import { runningAnimations } from './src/util/animation/AnimationRegistry';
import { Observable } from './src/mixins/observable.mixin';
import { Point } from './src/point.class';
import { Intersection } from './src/intersection.class';
import { Color } from './src/color/color.class';
import { Control } from './src/controls/control.class';
import { Gradient } from './src/gradient/gradient.class';
import { Pattern } from './src/pattern.class';
import { Shadow } from './src/shadow.class';
import { BaseBrush } from './src/brushes/base_brush.class';
import { PencilBrush } from './src/brushes/pencil_brush.class';
import { CircleBrush } from './src/brushes/circle_brush.class';
import { SprayBrush } from './src/brushes/spray_brush.class';
import { PatternBrush } from './src/brushes/pattern_brush.class';
import { FabricObject as Object } from './src/shapes/Object/FabricObject';
import { Line } from './src/shapes/line.class';
import { Circle } from './src/shapes/circle.class';
import { Triangle } from './src/shapes/triangle.class';
import { Ellipse } from './src/shapes/ellipse.class';
import { Rect } from './src/shapes/rect.class';
import { Path } from './src/shapes/path.class';
import { Polyline } from './src/shapes/polyline.class';
import { Polygon } from './src/shapes/polygon.class';
import { Text } from './src/shapes/text.class';
import { IText } from './src/shapes/itext.class';
import { Textbox } from './src/shapes/textbox.class';
import { Group } from './src/shapes/group.class';
import { ActiveSelection } from './src/shapes/active_selection.class';
import { Image } from './src/shapes/image.class';
import { getEnv, getDocument, getWindow, setEnvForTests } from './src/env';
import { createCollectionMixin } from './src/mixins/collection.mixin';
import { parseAttributes } from './src/parser/parseAttributes';
import { parseElements } from './src/parser/parseElements';
import { getFilterBackend } from './src/filters/FilterBackend';
import { parseStyleAttribute } from './src/parser/parseStyleAttribute';
import { parsePointsAttribute } from './src/parser/parsePointsAttribute';
import { parseTransformAttribute } from './src/parser/parseTransformAttribute';
import { getCSSRules } from './src/parser/getCSSRules';

import './src/controls/default_controls';

const fabric = {
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

if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
} else if (typeof define === 'function' && define.amd) {
  /* _AMD_START_ */
  define([], function () {
    return fabric;
  });
} else if (typeof window !== 'undefined') {
  window.fabric = fabric;
}
