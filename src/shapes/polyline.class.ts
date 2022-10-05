//@ts-nocheck

import { config } from '../config';
import { Point } from '../point.class';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';

(function (global) {
  var fabric = global.fabric || (global.fabric = {}),
    extend = fabric.util.object.extend,
    toFixed = fabric.util.toFixed,
    projectStrokeOnPoints = fabric.util.projectStrokeOnPoints;

  /**
   * Polyline class
   * @class fabric.Polyline
   * @extends fabric.Object
   * @see {@link fabric.Polyline#initialize} for constructor definition
   */
  fabric.Polyline = fabric.util.createClass(
    fabric.Object,
    /** @lends fabric.Polyline.prototype */ {
      /**
       * Type of an object
       * @type String
       * @default
       */
      type: 'polyline',

      /**
       * Points array
       * @type Array
       * @default
       */
      points: null,

      /**
       * WARNING: Feature in progress
       * Calculate the exact bounding box taking in account strokeWidth on acute angles
       * this will be turned to true by default on fabric 6.0
       * maybe will be left in as an optimization since calculations may be slow
       * @deprecated
       * @type Boolean
       * @default false
       */
      exactBoundingBox: false,

      cacheProperties: fabric.Object.prototype.cacheProperties.concat('points'),

      /**
       * Constructor
       * @param {Array} points Array of points (where each point is an object with x and y)
       * @param {Object} [options] Options object
       * @return {fabric.Polyline} thisArg
       * @example
       * var poly = new fabric.Polyline([
       *     { x: 10, y: 10 },
       *     { x: 50, y: 30 },
       *     { x: 40, y: 70 },
       *     { x: 60, y: 50 },
       *     { x: 100, y: 150 },
       *     { x: 40, y: 100 }
       *   ], {
       *   stroke: 'red',
       *   left: 100,
       *   top: 100
       * });
       */
      initialize: function (points, options) {
        options = options || {};
        this.points = points || [];
        this.callSuper('initialize', options);
        this._setPositionDimensions(options);
      },

      /**
       * @private
       */
      _projectStrokeOnPoints: function () {
        return projectStrokeOnPoints(this.points, this, true);
      },

      _setPositionDimensions: function (options) {
        options || (options = {});
        const calcDim = this._calcDimensions(options), 
          correctSize = new Point(
            this.strokeUniform ? this.strokeWidth / this.scaleX : this.strokeWidth,
            this.strokeUniform ? this.strokeWidth / this.scaleY : this.strokeWidth
          );
        let correctLeftTop;
        this.width = calcDim.width - correctSize.x;
        this.height = calcDim.height - correctSize.y;
        if (!options.fromSVG) {
            correctLeftTop = this.translateToGivenOrigin({
                x: this.left,
                y: this.top
            }, 'left', 'top', this.originX, this.originY);
        }
        if (typeof options.left === 'undefined') {
            this.left = options.fromSVG ? calcDim.left : correctLeftTop.x;
        }
        if (typeof options.top === 'undefined') {
            this.top = options.fromSVG ? calcDim.top : correctLeftTop.y;
        }
        const offsetX = calcDim.left + calcDim.width/2,
            offsetY = calcDim.top + calcDim.height/2;
        const pathOffsetX = offsetX - offsetY * Math.tan(degreesToRadians(this.skewX))
        const pathOffsetY = offsetY - pathOffsetX * Math.tan(degreesToRadians(this.skewY))
        this.pathOffset = new Point(pathOffsetX, pathOffsetY);
      },

      /**
       * Calculate the polygon min and max point from points array,
       * returning an object with left, top, width, height to measure the
       * polygon size
       * @return {Object} object.left X coordinate of the polygon leftmost point
       * @return {Object} object.top Y coordinate of the polygon topmost point
       * @return {Object} object.width distance between X coordinates of the polygon leftmost and rightmost point
       * @return {Object} object.height distance between Y coordinates of the polygon topmost and bottommost point
       * @private
       */
      _calcDimensions: function () {
        const points = this._projectStrokeOnPoints().map(elem => elem.projectedPoint);
        if (points.length === 0) {
          return makeBoundingBoxFromPoints([new Point(0, 0)]);
        }
        return makeBoundingBoxFromPoints(points);
      },

      /**
       * Returns object representation of an instance
       * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
       * @return {Object} Object representation of an instance
       */
      toObject: function (propertiesToInclude) {
        return extend(this.callSuper('toObject', propertiesToInclude), {
          points: this.points.concat(),
        });
      },

      /**
       * Changes dimensioning logic when it has skew
       * @private
       */
      _getTransformedDimensions(...args) {
        const noSkew = this.skewX === 0 && this.skewY === 0;
        if (noSkew) {
          return this.callSuper('_getTransformedDimensions', ...args);
        }

        let preScalingStrokeValue, postScalingStrokeValue; 
        const strokeWidth = this.strokeWidth;
        if (this.strokeUniform) {
            preScalingStrokeValue = 0;
            postScalingStrokeValue = strokeWidth;
        }
        else {
            preScalingStrokeValue = strokeWidth;
            postScalingStrokeValue = 0;
        }
        const dimX = this.width + preScalingStrokeValue, 
          dimY = this.height + preScalingStrokeValue, 
          finalDimensions = new Point(dimX * this.scaleX, dimY * this.scaleY);
        return finalDimensions.scalarAdd(postScalingStrokeValue);
      },

      /**
       * Recalculates dimensions when changing skew and scale
       * @private
       */
      _set(key, value) {
        const output = this.callSuper('_set', key, value);
        if ((key === 'scaleX' || key === 'scaleY') && this.strokeUniform && this.strokeLineJoin !== 'round') {
          this._setPositionDimensions();
        } else if (key === 'skewX' || key === 'skewY') { // TODO: check if you really need to recalculate for all cases
          this._setPositionDimensions();
        };
        return output 
      },

      /* _TO_SVG_START_ */
      /**
       * Returns svg representation of an instance
       * @return {Array} an array of strings with the specific svg representation
       * of the instance
       */
      _toSVG: function () {
        var points = [],
          diffX = this.pathOffset.x,
          diffY = this.pathOffset.y,
          NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS;

        for (var i = 0, len = this.points.length; i < len; i++) {
          points.push(
            toFixed(this.points[i].x - diffX, NUM_FRACTION_DIGITS),
            ',',
            toFixed(this.points[i].y - diffY, NUM_FRACTION_DIGITS),
            ' '
          );
        }
        return [
          '<' + this.type + ' ',
          'COMMON_PARTS',
          'points="',
          points.join(''),
          '" />\n',
        ];
      },
      /* _TO_SVG_END_ */

      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      commonRender: function (ctx) {
        var point,
          len = this.points.length,
          x = this.pathOffset.x,
          y = this.pathOffset.y;

        if (!len || isNaN(this.points[len - 1].y)) {
          // do not draw if no points or odd points
          // NaN comes from parseFloat of a empty string in parser
          return false;
        }
        ctx.beginPath();
        ctx.moveTo(this.points[0].x - x, this.points[0].y - y);
        for (var i = 0; i < len; i++) {
          point = this.points[i];
          ctx.lineTo(point.x - x, point.y - y);
        }
        return true;
      },

      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _render: function (ctx) {
        if (!this.commonRender(ctx)) {
          return;
        }
        this._renderPaintInOrder(ctx);
      },

      /**
       * Returns complexity of an instance
       * @return {Number} complexity of this instance
       */
      complexity: function () {
        return this.get('points').length;
      },
    }
  );

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link fabric.Polyline.fromElement})
   * @static
   * @memberOf fabric.Polyline
   * @see: http://www.w3.org/TR/SVG/shapes.html#PolylineElement
   */
  fabric.Polyline.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat();

  /**
   * Returns fabric.Polyline instance from an SVG element
   * @static
   * @memberOf fabric.Polyline
   * @param {SVGElement} element Element to parser
   * @param {Function} callback callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  fabric.Polyline.fromElementGenerator = function (_class) {
    return function (element, callback, options) {
      if (!element) {
        return callback(null);
      }
      options || (options = {});

      var points = fabric.parsePointsAttribute(element.getAttribute('points')),
        parsedAttributes = fabric.parseAttributes(
          element,
          fabric[_class].ATTRIBUTE_NAMES
        );
      parsedAttributes.fromSVG = true;
      callback(new fabric[_class](points, extend(parsedAttributes, options)));
    };
  };

  fabric.Polyline.fromElement =
    fabric.Polyline.fromElementGenerator('Polyline');

  /* _FROM_SVG_END_ */

  /**
   * Returns fabric.Polyline instance from an object representation
   * @static
   * @memberOf fabric.Polyline
   * @param {Object} object Object to create an instance from
   * @returns {Promise<fabric.Polyline>}
   */
  fabric.Polyline.fromObject = function (object) {
    return fabric.Object._fromObject(fabric.Polyline, object, {
      extraParam: 'points',
    });
  };
})(typeof exports !== 'undefined' ? exports : window);
