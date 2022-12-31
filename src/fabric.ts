/**
 *
 * ['document', 'window', 'isTouchSupported', 'isLikelyNode',
 * 'isWebglSupported', ,
 *  '_measuringContext', 'maxTextureSize',
 * 'webGlPrecision', 'isSupported', 'filterBackend']
 *
 *  */

// FILTERS
import { BaseFilter } from './filters/base_filter.class';
import { BlendColor } from './filters/blendcolor_filter.class';
import { BlendImage } from './filters/blendimage_filter.class';
import { Blur } from './filters/blur_filter.class';
import { Brightness } from './filters/brightness_filter.class';
import { ColorMatrix } from './filters/colormatrix_filter.class';
import { Composed } from './filters/composed_filter.class';
import { Contrast } from './filters/contrast_filter.class';
import { Convolute } from './filters/convolute_filter.class';
import { Sepia, Brownie, Vintage, Kodachrome, Technicolor, Polaroid, BlackWhite } from './filters/filter_generator';
import { Gamma } from './filters/gamma_filter.class';
import { Grayscale } from './filters/grayscale_filter.class';
import { HueRotation } from './filters/hue_rotation.class';
import { Invert } from './filters/invert_filter.class';
import { Noise } from './filters/noise_filter.class';
import { Pixelate } from './filters/pixelate_filter.class';
import { RemoveColor } from './filters/removecolor_filter.class';
import { Resize } from './filters/resize_filter.class';
import { Saturation } from './filters/saturate_filter.class';
import { Vibrance } from './filters/vibrance_filter.class';

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
import { degreesToRadians, radiansToDegrees } from './util/misc/radiansDegreesConversion';
// import { rotatePoint } from './util/misc/rotatePoint';
import { projectStrokeOnPoints } from './util/misc/projectStroke';
import {
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
} from './util/misc/matrix';
import { stylesFromArray, stylesToArray, hasStyleChanged } from './util/misc/textStyles';
import { clone, extend } from './util/lang_object';
import {
  createCanvasElement,
  createImage,
  copyCanvasElement,
  toDataURL,
} from './util/misc/dom';
import { toFixed } from './util/misc/toFixed';
import {
  matrixToSVG,
//  parsePreserveAspectRatioAttribute,
  parseUnit,
//  getSvgAttributes,
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
import { graphemeSplit } from './util/lang_string';
import {
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
} from './util/misc/objectEnlive';
// import { pick } from './util/misc/pick';
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
// import { setStyle } from './util/dom_style';
import {
  isTouchEvent,
  getPointer,
} from './util/dom_event';
import {
  // getScrollLeftTop,
  // getElementOffset,
  getNodeCanvas,
  cleanUpJsdomNode,
  // makeElementUnselectable,
  // makeElementSelectable,
} from './util/dom_misc';
import { isTransparent } from './util/misc/isTransparent';
import { mergeClipPaths } from './util/misc/mergeClipPaths';
import {
  animate,
  animateColor,
  ease,
  requestAnimFrame,
  cancelAnimFrame,
} from './util/animation';
import { classRegistry } from './util/class_registry';

const util = {
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
  // parsePreserveAspectRatioAttribute,
  groupSVGElements,
  parseUnit,
  // is anyone using it?
  // getSvgAttributes,
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
  },
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
  // pick,
  joinPath,
  parsePath,
  makePathSimpler,
  getSmoothPathFromPoints,
  getPathSegmentsInfo,
  getBoundsOfCurve,
  getPointOnPath,
  transformPath,
  getRegularPolygonPath,
  // setStyle,
  isTouchEvent,
  getPointer,
  // getScrollLeftTop,
  // getElementOffset,
  getNodeCanvas,
  cleanUpJsdomNode,
  // makeElementUnselectable,
  // makeElementSelectable,
  isTransparent,
  sizeAfterTransform,
  mergeClipPaths,
  ease, // those are a lot of functions
  animateColor,
  animate,
  requestAnimFrame,
  cancelAnimFrame,
  classRegistry,
};

// CONTROLS UTILS

import { changeWidth } from './controls/changeWidth';
import { renderCircleControl, renderSquareControl } from './controls/controls.render';
import { dragHandler } from './controls/drag';
import { rotationStyleHandler, rotationWithSnapping } from './controls/rotate';
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
import { skewCursorStyleHandler, skewHandlerX, skewHandlerY } from './controls/skew';
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
  scaleOrSkewActionName,
  rotationStyleHandler,
  wrapWithFixedAnchor,
  wrapWithFireEvent,
  getLocalPoint,
  renderCircleControl,
  renderSquareControl,
};

// EXPORTS

export { cache } from './cache';
export { VERSION as version, iMatrix } from './constants';
export { StaticCanvas } from './canvas/static_canvas.class';
export { Canvas } from './canvas/canvas_events';
export { config } from './config';
export { loadSVGFromURL } from './parser/loadSVGFromURL';
export { loadSVGFromString } from './parser/loadSVGFromString';
export { initFilterBackend } from './filters/FilterBackend';
export { Canvas2dFilterBackend } from './filters/2d_backend.class';
export { WebGLFilterBackend } from './filters/webgl_backend.class';
export { runningAnimations } from './util/animation/AnimationRegistry';
export { Point } from './point.class';
export { Intersection } from './intersection.class';
export { Color } from './color/color.class';
export { Control } from './controls/control.class'
export { Gradient } from './gradient/gradient.class';
export { Pattern } from './pattern.class';
export { Shadow } from './shadow.class';
export { BaseBrush } from './brushes/base_brush.class';
export { PencilBrush } from './brushes/pencil_brush.class';
export { CircleBrush } from './brushes/circle_brush.class';
export { SprayBrush } from './brushes/spray_brush.class';
export { PatternBrush } from './brushes/pattern_brush.class';
export { FabricObject as Object } from './shapes/Object/FabricObject';
export { Line } from './shapes/line.class';
export { Circle } from './shapes/circle.class';
export { Triangle } from './shapes/triangle.class';
export { Ellipse } from './shapes/ellipse.class';
export { Rect } from './shapes/rect.class';
export { Path } from './shapes/path.class';
export { Polyline } from './shapes/polyline.class';
export { Polygon } from './shapes/polygon.class';
export { Text } from './shapes/text.class';
export { IText } from './shapes/itext.class';
export { Textbox } from './shapes/textbox.class';
export { Group } from './shapes/group.class';
export { ActiveSelection } from './shapes/active_selection.class';
export { Image } from './shapes/image.class';
export { filters }
export { util }
export { controlsUtils }
import './controls/default_controls';
