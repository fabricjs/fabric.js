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
    /**
     * Sends a point from the source coordinate plane to the destination coordinate plane.\
     * From the canvas/viewer's perspective the point remains unchanged.
     *
     * @example <caption>Send point from canvas plane to group plane</caption>
     * var obj = new fabric.Rect({ left: 20, top: 20, width: 60, height: 60, strokeWidth: 0 });
     * var group = new fabric.Group([obj], { strokeWidth: 0 });
     * var sentPoint1 = fabric.util.sendPointToPlane(new Point(50, 50), null, group.calcTransformMatrix());
     * var sentPoint2 = fabric.util.sendPointToPlane(new Point(50, 50), fabric.iMatrix, group.calcTransformMatrix());
     * console.log(sentPoint1, sentPoint2) //  both points print (0,0) which is the center of group
     *
     * @static
     * @memberOf fabric.util
     * @see {fabric.util.transformPointRelativeToCanvas} for transforming relative to canvas
     * @param {Point} point
     * @param {Matrix} [from] plane matrix containing object. Passing `null` is equivalent to passing the identity matrix, which means `point` exists in the canvas coordinate plane.
     * @param {Matrix} [to] destination plane matrix to contain object. Passing `null` means `point` should be sent to the canvas coordinate plane.
     * @returns {Point} transformed point
     */
    sendPointToPlane: function (point, from, to) {
      //  we are actually looking for the transformation from the destination plane to the source plane (which is a linear mapping)
      //  the object will exist on the destination plane and we want it to seem unchanged by it so we reverse the destination matrix (to) and then apply the source matrix (from)
      var inv = fabric.util.invertTransform(to || fabric.iMatrix);
      var t = fabric.util.multiplyTransformMatrices(inv, from || fabric.iMatrix);
      return fabric.util.transformPoint(point, t);
    },

    /**
     * Transform point relative to canvas.
     * From the viewport/viewer's perspective the point remains unchanged.
     *
     * `child` relation means `point` exists in the coordinate plane created by `canvas`.
     * In other words point is measured acoording to canvas' top left corner
     * meaning that if `point` is equal to (0,0) it is positioned at canvas' top left corner.
     *
     * `sibling` relation means `point` exists in the same coordinate plane as canvas.
     * In other words they both relate to the same (0,0) and agree on every point, which is how an event relates to canvas.
     *
     * @static
     * @memberOf fabric.util
     * @param {Point} point
     * @param {fabric.StaticCanvas} canvas
     * @param {'sibling'|'child'} relationBefore current relation of point to canvas
     * @param {'sibling'|'child'} relationAfter desired relation of point to canvas
     * @returns {Point} transformed point
     */
    transformPointRelativeToCanvas: function (point, canvas, relationBefore, relationAfter) {
      if (relationBefore !== 'child' && relationBefore !== 'sibling') {
        throw new Error('fabric.js: received bad argument ' + relationBefore);
      }
      if (relationAfter !== 'child' && relationAfter !== 'sibling') {
        throw new Error('fabric.js: received bad argument ' + relationAfter);
      }
      if (relationBefore === relationAfter) {
        return point;
      }
      var t = canvas.viewportTransform;
      return fabric.util.transformPoint(point, relationAfter === 'child' ? fabric.util.invertTransform(t) : t);
    },

    /**
     * Returns klass "Class" object of given namespace
     * @memberOf fabric.util
     * @param {String} type Type of object (eg. 'circle')
     * @param {object} namespace Namespace to get klass "Class" object from
     * @return {Object} klass "Class"
     */
    getKlass: function(type, namespace) {
      // capitalize first letter only
      type = fabric.util.string.camelize(type.charAt(0).toUpperCase() + type.slice(1));
      return (namespace || fabric)[type];
    },

    /**
     * Loads image element from given url and resolve it, or catch.
     * @memberOf fabric.util
     * @param {String} url URL representing an image
     * @param {Object} [options] image loading options
     * @param {string} [options.crossOrigin] cors value for the image loading, default to anonymous
     * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     * @param {Promise<fabric.Image>} img the loaded image.
     */
    loadImage: function (url, options) {
      var abort, signal = options && options.signal;
      return new Promise(function (resolve, reject) {
        if (signal && signal.aborted) {
          return reject(new Error('`options.signal` is in `aborted` state'));
        }
        else if (signal) {
          abort = function (err) {
            img.src = '';
            reject(err);
          };
          signal.addEventListener('abort', abort, { once: true });
        }
        var img = fabric.util.createImage();
        var done = function() {
          img.onload = img.onerror = null;
          signal && abort && signal.removeEventListener('abort', abort);
          resolve(img);
        };
        if (!url) {
          done();
        }
        else {
          img.onload = done;
          img.onerror = function () {
            signal && abort && signal.removeEventListener('abort', abort);
            reject(new Error('Error loading ' + img.src));
          };
          options && options.crossOrigin && (img.crossOrigin = options.crossOrigin);
          img.src = url;
        }
      });
    },

    /**
     * Creates corresponding fabric instances from their object representations
     * @static
     * @memberOf fabric.util
     * @param {Object[]} objects Objects to enliven
     * @param {object} [options]
     * @param {object} [options.namespace] Namespace to get klass "Class" object from
     * @param {(serializedObj: object, instance: fabric.Object) => any} [options.reviver] Method for further parsing of object elements,
     * called after each fabric object created.
     * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     * @returns {Promise<fabric.Object[]>}
     */
    enlivenObjects: function(objects, options) {
      options = options || {};
      var instances = [], signal = options && options.signal;
      return new Promise(function (resolve, reject) {
        signal && signal.addEventListener('abort', reject, { once: true });
        Promise.all(objects.map(function (obj) {
          var klass = fabric.util.getKlass(obj.type, options.namespace || fabric);
          return klass.fromObject(obj, options).then(function (fabricInstance) {
            options.reviver && options.reviver(obj, fabricInstance);
            instances.push(fabricInstance);
            return fabricInstance;
          });
        }))
          .then(resolve)
          .catch(function (error) {
            // cleanup
            instances.forEach(function (instance) {
              instance.dispose && instance.dispose();
            });
            reject(error);
          })
          .finally(function () {
            signal && signal.removeEventListener('abort', reject);
          });
      });
    },

    /**
     * Creates corresponding fabric instances residing in an object, e.g. `clipPath`
     * @static
     * @memberOf fabric.util
     * @param {Object} object with properties to enlive ( fill, stroke, clipPath, path )
     * @param {object} [options]
     * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     * @returns {Promise<{[key:string]:fabric.Object|fabric.Pattern|fabric.Gradient|null}>} the input object with enlived values
     */
    enlivenObjectEnlivables: function (serializedObject, options) {
      var instances = [], signal = options && options.signal;
      return new Promise(function (resolve, reject) {
        signal && signal.addEventListener('abort', reject, { once: true });
        // enlive every possible property
        var promises = Object.values(serializedObject).map(function (value) {
          if (!value) {
            return value;
          }
          if (value.colorStops) {
            return new fabric.Gradient(value);
          }
          if (value.type) {
            return fabric.util.enlivenObjects([value], options).then(function (enlived) {
              var instance = enlived[0];
              instances.push(instance);
              return instance;
            });
          }
          if (value.source) {
            return fabric.Pattern.fromObject(value, options).then(function (pattern) {
              instances.push(pattern);
              return pattern;
            });
          }
          return value;
        });
        var keys = Object.keys(serializedObject);
        Promise.all(promises).then(function (enlived) {
          return enlived.reduce(function (acc, instance, index) {
            acc[keys[index]] = instance;
            return acc;
          }, {});
        })
          .then(resolve)
          .catch(function (error) {
            // cleanup
            instances.forEach(function (instance) {
              instance.dispose && instance.dispose();
            });
            reject(error);
          })
          .finally(function () {
            signal && signal.removeEventListener('abort', reject);
          });
      });
    },

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
     * Clear char widths cache for the given font family or all the cache if no
     * fontFamily is specified.
     * Use it if you know you are loading fonts in a lazy way and you are not waiting
     * for custom fonts to load properly when adding text objects to the canvas.
     * If a text object is added when its own font is not loaded yet, you will get wrong
     * measurement and so wrong bounding boxes.
     * After the font cache is cleared, either change the textObject text content or call
     * initDimensions() to trigger a recalculation
     * @memberOf fabric.util
     * @param {String} [fontFamily] font family to clear
     */
    clearFabricFontCache: function(fontFamily) {
      fontFamily = (fontFamily || '').toLowerCase();
      if (!fontFamily) {
        fabric.charWidthsCache = { };
      }
      else if (fabric.charWidthsCache[fontFamily]) {
        delete fabric.charWidthsCache[fontFamily];
      }
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
     *
     * A util that abstracts applying transform to objects.\
     * Sends `object` to the destination coordinate plane by applying the relevant transformations.\
     * Changes the space/plane where `object` is drawn.\
     * From the canvas/viewer's perspective `object` remains unchanged.
     *
     * @example <caption>Move clip path from one object to another while preserving it's appearance as viewed by canvas/viewer</caption>
     * let obj, obj2;
     * let clipPath = new fabric.Circle({ radius: 50 });
     * obj.clipPath = clipPath;
     * // render
     * fabric.util.sendObjectToPlane(clipPath, obj.calcTransformMatrix(), obj2.calcTransformMatrix());
     * obj.clipPath = undefined;
     * obj2.clipPath = clipPath;
     * // render, clipPath now clips obj2 but seems unchanged from the eyes of the viewer
     *
     * @example <caption>Clip an object's clip path with an existing object</caption>
     * let obj, existingObj;
     * let clipPath = new fabric.Circle({ radius: 50 });
     * obj.clipPath = clipPath;
     * let transformTo = fabric.util.multiplyTransformMatrices(obj.calcTransformMatrix(), clipPath.calcTransformMatrix());
     * fabric.util.sendObjectToPlane(existingObj, existingObj.group?.calcTransformMatrix(), transformTo);
     * clipPath.clipPath = existingObj;
     *
     * @static
     * @memberof fabric.util
     * @param {fabric.Object} object
     * @param {Matrix} [from] plane matrix containing object. Passing `null` is equivalent to passing the identity matrix, which means `object` is a direct child of canvas.
     * @param {Matrix} [to] destination plane matrix to contain object. Passing `null` means `object` should be sent to the canvas coordinate plane.
     * @returns {Matrix} the transform matrix that was applied to `object`
     */
    sendObjectToPlane: function (object, from, to) {
      //  we are actually looking for the transformation from the destination plane to the source plane (which is a linear mapping)
      //  the object will exist on the destination plane and we want it to seem unchanged by it so we reverse the destination matrix (to) and then apply the source matrix (from)
      var inv = fabric.util.invertTransform(to || fabric.iMatrix);
      var t = fabric.util.multiplyTransformMatrices(inv, from || fabric.iMatrix);
      fabric.util.applyTransformToObject(
        object,
        fabric.util.multiplyTransformMatrices(t, object.calcOwnMatrix())
      );
      return t;
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
