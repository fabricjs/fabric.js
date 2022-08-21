//@ts-nocheck
import { fabric } from '../../../HEADER'
import { DEFAULT_SVG_FONT_SIZE } from '../../constants';
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

  /**
   * @typedef {[number,number,number,number,number,number]} Matrix
   */

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
     * Returns coordinates of points's bounding rectangle (left, top, width, height)
     * @static
     * @memberOf fabric.util
     * @param {Array} points 4 points array
     * @param {Array} [transform] an array of 6 numbers representing a 2x3 transform matrix
     * @return {Object} Object with left, top, width, height properties
     */
    makeBoundingBoxFromPoints: function(points, transform) {
      if (transform) {
        for (var i = 0; i < points.length; i++) {
          points[i] = fabric.util.transformPoint(points[i], transform);
        }
      }
      var xPoints = [points[0].x, points[1].x, points[2].x, points[3].x],
          minX = fabric.util.array.min(xPoints),
          maxX = fabric.util.array.max(xPoints),
          width = maxX - minX,
          yPoints = [points[0].y, points[1].y, points[2].y, points[3].y],
          minY = fabric.util.array.min(yPoints),
          maxY = fabric.util.array.max(yPoints),
          height = maxY - minY;

      return {
        left: minX,
        top: minY,
        width: width,
        height: height
      };
    },

    /**
     * A wrapper around Number#toFixed, which contrary to native method returns number, not string.
     * @static
     * @memberOf fabric.util
     * @param {Number|String} number number to operate on
     * @param {Number} fractionDigits number of fraction digits to "leave"
     * @return {Number}
     */
    toFixed: function(number, fractionDigits) {
      return parseFloat(Number(number).toFixed(fractionDigits));
    },

    /**
     * Converts from attribute value to pixel value if applicable.
     * Returns converted pixels or original value not converted.
     * @param {Number|String} value number to operate on
     * @param {Number} fontSize
     * @return {Number|String}
     */
    parseUnit: function(value, fontSize) {
      var unit = /\D{0,2}$/.exec(value),
          number = parseFloat(value);
      if (!fontSize) {
        fontSize = DEFAULT_SVG_FONT_SIZE;
      }
      switch (unit[0]) {
        case 'mm':
          return number * fabric.DPI / 25.4;

        case 'cm':
          return number * fabric.DPI / 2.54;

        case 'in':
          return number * fabric.DPI;

        case 'pt':
          return number * fabric.DPI / 72; // or * 4 / 3

        case 'pc':
          return number * fabric.DPI / 72 * 12; // or * 16

        case 'em':
          return number * fontSize;

        default:
          return number;
      }
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
     * Returns array of attributes for given svg that fabric parses
     * @memberOf fabric.util
     * @param {String} type Type of svg element (eg. 'circle')
     * @return {Array} string names of supported attributes
     */
    getSvgAttributes: function(type) {
      var attributes = [
        'instantiated_by_use',
        'style',
        'id',
        'class'
      ];
      switch (type) {
        case 'linearGradient':
          attributes = attributes.concat(['x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform']);
          break;
        case 'radialGradient':
          attributes = attributes.concat(['gradientUnits', 'gradientTransform', 'cx', 'cy', 'r', 'fx', 'fy', 'fr']);
          break;
        case 'stop':
          attributes = attributes.concat(['offset', 'stop-color', 'stop-opacity']);
          break;
      }
      return attributes;
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
     * Groups SVG elements (usually those retrieved from SVG document)
     * @static
     * @memberOf fabric.util
     * @param {Array} elements SVG elements to group
     * @return {fabric.Object|fabric.Group}
     */
    groupSVGElements: function(elements) {
      if (elements && elements.length === 1) {
        return elements[0];
      }
      return new fabric.Group(elements);
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
     * Creates canvas element
     * @static
     * @memberOf fabric.util
     * @return {CanvasElement} initialized canvas element
     */
    createCanvasElement: function() {
      return fabric.document.createElement('canvas');
    },

    /**
     * Creates a canvas element that is a copy of another and is also painted
     * @param {CanvasElement} canvas to copy size and content of
     * @static
     * @memberOf fabric.util
     * @return {CanvasElement} initialized canvas element
     */
    copyCanvasElement: function(canvas) {
      var newCanvas = fabric.util.createCanvasElement();
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;
      newCanvas.getContext('2d').drawImage(canvas, 0, 0);
      return newCanvas;
    },

    /**
     * since 2.6.0 moved from canvas instance to utility.
     * @param {CanvasElement} canvasEl to copy size and content of
     * @param {String} format 'jpeg' or 'png', in some browsers 'webp' is ok too
     * @param {Number} quality <= 1 and > 0
     * @static
     * @memberOf fabric.util
     * @return {String} data url
     */
    toDataURL: function(canvasEl, format, quality) {
      return canvasEl.toDataURL('image/' + format, quality);
    },

    /**
     * Creates image element (works on client and node)
     * @static
     * @memberOf fabric.util
     * @return {HTMLImageElement} HTML image element
     */
    createImage: function() {
      return fabric.document.createElement('img');
    },

    /**
     * reset an object transform state to neutral. Top and left are not accounted for
     * @static
     * @memberOf fabric.util
     * @param  {fabric.Object} target object to transform
     */
    resetObjectTransform: function (target) {
      target.scaleX = 1;
      target.scaleY = 1;
      target.skewX = 0;
      target.skewY = 0;
      target.flipX = false;
      target.flipY = false;
      target.rotate(0);
    },

    /**
     * Extract Object transform values
     * @static
     * @memberOf fabric.util
     * @param  {fabric.Object} target object to read from
     * @return {Object} Components of transform
     */
    saveObjectTransform: function (target) {
      return {
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        skewX: target.skewX,
        skewY: target.skewY,
        angle: target.angle,
        left: target.left,
        flipX: target.flipX,
        flipY: target.flipY,
        top: target.top
      };
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
     * Parse preserveAspectRatio attribute from element
     * @param {string} attribute to be parsed
     * @return {Object} an object containing align and meetOrSlice attribute
     */
    parsePreserveAspectRatioAttribute: function(attribute) {
      var meetOrSlice = 'meet', alignX = 'Mid', alignY = 'Mid',
          aspectRatioAttrs = attribute.split(' '), align;

      if (aspectRatioAttrs && aspectRatioAttrs.length) {
        meetOrSlice = aspectRatioAttrs.pop();
        if (meetOrSlice !== 'meet' && meetOrSlice !== 'slice') {
          align = meetOrSlice;
          meetOrSlice = 'meet';
        }
        else if (aspectRatioAttrs.length) {
          align = aspectRatioAttrs.pop();
        }
      }
      //divide align in alignX and alignY
      alignX = align !== 'none' ? align.slice(1, 4) : 'none';
      alignY = align !== 'none' ? align.slice(5, 8) : 'none';
      return {
        meetOrSlice: meetOrSlice,
        alignX: alignX,
        alignY: alignY
      };
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

    capValue: function(min, value, max) {
      return Math.max(min, Math.min(value, max));
    },

    /**
     * Finds the scale for the object source to fit inside the object destination,
     * keeping aspect ratio intact.
     * respect the total allowed area for the cache.
     * @memberOf fabric.util
     * @param {Object | fabric.Object} source
     * @param {Number} source.height natural unscaled height of the object
     * @param {Number} source.width natural unscaled width of the object
     * @param {Object | fabric.Object} destination
     * @param {Number} destination.height natural unscaled height of the object
     * @param {Number} destination.width natural unscaled width of the object
     * @return {Number} scale factor to apply to source to fit into destination
     */
    findScaleToFit: function(source, destination) {
      return Math.min(destination.width / source.width, destination.height / source.height);
    },

    /**
     * Finds the scale for the object source to cover entirely the object destination,
     * keeping aspect ratio intact.
     * respect the total allowed area for the cache.
     * @memberOf fabric.util
     * @param {Object | fabric.Object} source
     * @param {Number} source.height natural unscaled height of the object
     * @param {Number} source.width natural unscaled width of the object
     * @param {Object | fabric.Object} destination
     * @param {Number} destination.height natural unscaled height of the object
     * @param {Number} destination.width natural unscaled width of the object
     * @return {Number} scale factor to apply to source to cover destination
     */
    findScaleToCover: function(source, destination) {
      return Math.max(destination.width / source.width, destination.height / source.height);
    },

    /**
     * given an array of 6 number returns something like `"matrix(...numbers)"`
     * @memberOf fabric.util
     * @param {Array} transform an array with 6 numbers
     * @return {String} transform matrix for svg
     * @return {Object.y} Limited dimensions by Y
     */
    matrixToSVG: function(transform) {
      return 'matrix(' + transform.map(function(value) {
        return fabric.util.toFixed(value, fabric.Object.NUM_FRACTION_DIGITS);
      }).join(' ') + ')';
    },

    /**
     * given an object and a transform, apply the inverse transform to the object,
     * this is equivalent to remove from that object that transformation, so that
     * added in a space with the removed transform, the object will be the same as before.
     * Removing from an object a transform that scale by 2 is like scaling it by 1/2.
     * Removing from an object a transform that rotate by 30deg is like rotating by 30deg
     * in the opposite direction.
     * This util is used to add objects inside transformed groups or nested groups.
     * @memberOf fabric.util
     * @param {fabric.Object} object the object you want to transform
     * @param {Array} transform the destination transform
     */
    removeTransformFromObject: function(object, transform) {
      var inverted = fabric.util.invertTransform(transform),
          finalTransform = fabric.util.multiplyTransformMatrices(inverted, object.calcOwnMatrix());
      fabric.util.applyTransformToObject(object, finalTransform);
    },

    /**
     * given an object and a transform, apply the transform to the object.
     * this is equivalent to change the space where the object is drawn.
     * Adding to an object a transform that scale by 2 is like scaling it by 2.
     * This is used when removing an object from an active selection for example.
     * @memberOf fabric.util
     * @param {fabric.Object} object the object you want to transform
     * @param {Array} transform the destination transform
     */
    addTransformToObject: function(object, transform) {
      fabric.util.applyTransformToObject(
        object,
        fabric.util.multiplyTransformMatrices(transform, object.calcOwnMatrix())
      );
    },

    /**
     * discard an object transform state and apply the one from the matrix.
     * @memberOf fabric.util
     * @param {fabric.Object} object the object you want to transform
     * @param {Array} transform the destination transform
     */
    applyTransformToObject: function(object, transform) {
      var options = fabric.util.qrDecompose(transform),
          center = new Point(options.translateX, options.translateY);
      object.flipX = false;
      object.flipY = false;
      object.set('scaleX', options.scaleX);
      object.set('scaleY', options.scaleY);
      object.skewX = options.skewX;
      object.skewY = options.skewY;
      object.angle = options.angle;
      object.setPositionByOrigin(center, 'center', 'center');
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
