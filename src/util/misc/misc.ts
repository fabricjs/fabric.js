//@ts-nocheck
import { fabric } from '../../../HEADER';
import { Point } from '../../point.class';
import { cos } from './cos';
import { sin } from './sin';
import { rotateVector, createVector, calcAngleBetweenVectors, getHatVector, getBisector } from './vectors';
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
import { createCanvasElement, createImage, copyCanvasElement, toDataURL } from './dom';
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
} from './objectTransforms';
import { makeBoundingBoxFromPoints } from './boundingBoxFromPoints';
import {
  sendPointToPlane,
  transformPointRelativeToCanvas,
  sendObjectToPlane,
} from './planeChange';
import {
  camelize,
  capitalize,
  escapeXml,
  graphemeSplit,
} from '../lang_string';
import {
  getKlass,
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
} from './objectEnlive';
import {
  min,
  max,
} from '../lang_array';
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
    array: {
      min,
      max,
    },
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
    /**
     * Populates an object with properties of another object
     * @static
     * @memberOf fabric.util
     * @param {Object} source Source object
     * @param {Object} destination Destination object
     * @return {Array} properties Properties names to include
     */
    populateWithProperties: function(source, destination, properties) {
      if (properties && Array.isArray(properties)) {
        for (var i = 0, len = properties.length; i < len; i++) {
          if (properties[i] in source) {
            destination[properties[i]] = source[properties[i]];
          }
        }
      }
    },

    /**
     * Returns true if context has transparent pixel
     * at specified location (taking tolerance into account)
     * @param {CanvasRenderingContext2D} ctx context
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Number} tolerance Tolerance
     */
    isTransparent: function(ctx, x, y, tolerance) {

      // If tolerance is > 0 adjust start coords to take into account.
      // If moves off Canvas fix to 0
      if (tolerance > 0) {
        if (x > tolerance) {
          x -= tolerance;
        }
        else {
          x = 0;
        }
        if (y > tolerance) {
          y -= tolerance;
        }
        else {
          y = 0;
        }
      }

      var _isTransparent = true, i, temp,
          imageData = ctx.getImageData(x, y, (tolerance * 2) || 1, (tolerance * 2) || 1),
          l = imageData.data.length;

      // Split image data - for tolerance > 1, pixelDataSize = 4;
      for (i = 3; i < l; i += 4) {
        temp = imageData.data[i];
        _isTransparent = temp <= 0;
        if (_isTransparent === false) {
          break; // Stop if colour found
        }
      }

      imageData = null;

      return _isTransparent;
    },

    /**
     * Given current aspect ratio, determines the max width and height that can
     * respect the total allowed area for the cache.
     * @memberOf fabric.util
     * @param {Number} ar aspect ratio
     * @param {Number} maximumArea Maximum area you want to achieve
     * @return {Object.x} Limited dimensions by X
     * @return {Object.y} Limited dimensions by Y
     */
    limitDimsByArea: function(ar, maximumArea) {
      var roughWidth = Math.sqrt(maximumArea * ar),
          perfLimitSizeY = Math.floor(maximumArea / roughWidth);
      return { x: Math.floor(roughWidth), y: perfLimitSizeY };
    },

    /**
     * given a width and height, return the size of the bounding box
     * that can contains the box with width/height with applied transform
     * described in options.
     * Use to calculate the boxes around objects for controls.
     * @memberOf fabric.util
     * @param {Number} width
     * @param {Number} height
     * @param {Object} options
     * @param {Number} options.scaleX
     * @param {Number} options.scaleY
     * @param {Number} options.skewX
     * @param {Number} options.skewY
     * @returns {Point} size
     */
    sizeAfterTransform: function(width, height, options) {
      var dimX = width / 2, dimY = height / 2,
          points = [
            {
              x: -dimX,
              y: -dimY
            },
            {
              x: dimX,
              y: -dimY
            },
            {
              x: -dimX,
              y: dimY
            },
            {
              x: dimX,
              y: dimY
            }],
          transformMatrix = fabric.util.calcDimensionsMatrix(options),
          bbox = fabric.util.makeBoundingBoxFromPoints(points, transformMatrix);
      return new Point(bbox.width, bbox.height);
    },

    /**
     * Merges 2 clip paths into one visually equal clip path
     *
     * **IMPORTANT**:\
     * Does **NOT** clone the arguments, clone them proir if necessary.
     *
     * Creates a wrapper (group) that contains one clip path and is clipped by the other so content is kept where both overlap.
     * Use this method if both the clip paths may have nested clip paths of their own, so assigning one to the other's clip path property is not possible.
     *
     * In order to handle the `inverted` property we follow logic described in the following cases:\
     * **(1)** both clip paths are inverted - the clip paths pass the inverted prop to the wrapper and loose it themselves.\
     * **(2)** one is inverted and the other isn't - the wrapper shouldn't become inverted and the inverted clip path must clip the non inverted one to produce an identical visual effect.\
     * **(3)** both clip paths are not inverted - wrapper and clip paths remain unchanged.
     *
     * @memberOf fabric.util
     * @param {fabric.Object} c1
     * @param {fabric.Object} c2
     * @returns {fabric.Object} merged clip path
     */
    mergeClipPaths: function (c1, c2) {
      var a = c1, b = c2;
      if (a.inverted && !b.inverted) {
        //  case (2)
        a = c2;
        b = c1;
      }
      //  `b` becomes `a`'s clip path so we transform `b` to `a` coordinate plane
      fabric.util.applyTransformToObject(
        b,
        fabric.util.multiplyTransformMatrices(
          fabric.util.invertTransform(a.calcTransformMatrix()),
          b.calcTransformMatrix()
        )
      );
      //  assign the `inverted` prop to the wrapping group
      var inverted = a.inverted && b.inverted;
      if (inverted) {
        //  case (1)
        a.inverted = b.inverted = false;
      }
      return new fabric.Group([a], { clipPath: b, inverted: inverted });
    },
  };
