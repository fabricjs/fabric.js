//@ts-nocheck
import { fabric } from '../../../HEADER';
import { cos } from './cos';
import { sin } from './sin';
import {
  rotateVector,
  createVector,
  calcAngleBetweenVectors,
  getHatVector,
  getBisector,
} from './vectors';
import { degreesToRadians, radiansToDegrees } from './radiansDegreesConversion';
import { rotatePoint } from './rotatePoint';
import { getRandomInt, removeFromArray } from '../internals';
import { projectStrokeOnPoints } from './projectStroke';
import {
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
} from './matrix';
import { stylesFromArray, stylesToArray, hasStyleChanged } from './textStyles';
import { clone, extend } from '../lang_object';
import {
  createCanvasElement,
  createImage,
  copyCanvasElement,
  toDataURL,
} from './dom';
import { toFixed } from './toFixed';
import {
  matrixToSVG,
  parsePreserveAspectRatioAttribute,
  groupSVGElements,
  parseUnit,
  getSvgAttributes,
} from './svgParsing';
import { findScaleToFit, findScaleToCover } from './findScaleTo';
import { capValue } from './capValue';
import {
  saveObjectTransform,
  resetObjectTransform,
  addTransformToObject,
  applyTransformToObject,
  removeTransformFromObject,
  sizeAfterTransform,
} from './objectTransforms';
import { makeBoundingBoxFromPoints } from './boundingBoxFromPoints';
import {
  calcPlaneChangeMatrix,
  sendPointToPlane,
  transformPointRelativeToCanvas,
  sendObjectToPlane,
} from './planeChange';
import { camelize, capitalize, escapeXml, graphemeSplit } from '../lang_string';
import {
  getKlass,
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
} from './objectEnlive';
import { pick } from './pick';
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
} from '../path';
import { setStyle } from '../dom_style';
import { request } from '../dom_request';
import {
  isTouchEvent,
  getPointer,
  removeListener,
  addListener,
} from '../dom_event';
import {
  wrapElement,
  getScrollLeftTop,
  getElementOffset,
  getNodeCanvas,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable,
} from '../dom_misc';
import { isTransparent } from './isTransparent';
import { mergeClipPaths } from './mergeClipPaths';
import * as ease from '../anim_ease';
import { animateColor } from '../animate_color';
import { animate, requestAnimFrame, cancelAnimFrame } from '../animate';
import { createClass } from '../lang_class';
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


/* Putting some tests here so i m sure i m in this build environemnt */

// a MIXIN

const sumMixin = {
  sum() {
    console.log('result is 2');
  }
}


// NORMAL CLASSES

class testObject {
  constructor(opts) {
    Object.assign(this, opts);
  }
  log() {
    console.log(this.prop);
  }
}

Object.assign(testObject.prototype, {
  type: 'objectClass',
  color: 'blue',
  stroke: 'red',
  prop: 'logging base clas',
});
Object.assign(testObject.prototype, sumMixin);


class testRect extends testObject {
  constructor(opts = {}) {
    super(opts);
  }
  test() {
    console.log('break?')
  }
  log() {
    super.log();
  }
}

Object.assign(testRect.prototype, {
  type: 'fRect',
  color: 'yellow',
  prop: 'a rect thing to log',
  height: 100,
});

class testCube extends testRect {
  log() {
    console.log('pre');
    super.test();
    super.log();
    console.log('post');
  }
}

Object.assign(testCube.prototype, {
  type: 'fCube',
  color: 'yellow',
  prop: 'a cube thing to log',
  depth: 300,
});

Object.assign(fabric, {
	testObject,
  testRect,
  testCube,
});
