//@ts-nocheck

import { config } from '../config';
import { parseAttributes } from '../parser/parseAttributes';
import { parsePointsAttribute } from '../parser/parsePointsAttribute';
import { Point } from '../point.class';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { projectStrokeOnPoints } from '../util/misc/projectStroke';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';

(function (global) {
  var fabric = global.fabric || (global.fabric = {}),
    extend = fabric.util.object.extend,
    toFixed = fabric.util.toFixed;

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
       * @todo set default to true and remove flag and related logic
       */
      exactBoundingBox: false,

      initialized: false,

      cacheProperties: fabric.Object.prototype.cacheProperties.concat('points'),

      /**
       * A list of properties that if changed trigger a recalculation of dimensions
       * @todo check if you really need to recalculate for all cases
       */
      strokeBBoxAffectingProperties: [
        'skewX',
        'skewY',
        'strokeLineCap',
        'strokeLineJoin',
        'strokeMiterLimit',
        'strokeWidth',
        'strokeUniform',
        'points',
      ],

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
      initialize: function (points, options = {}) {
        this.points = points || [];
        this.callSuper('initialize', options);
        this.initialized = true;
        const bboxTL = this.setDimensions();
        const origin = this.translateToGivenOrigin(
          new Point(options.left ?? bboxTL.x, options.top ?? bboxTL.y),
          typeof options.left === 'number' ? this.originX : 'left',
          typeof options.top === 'number' ? this.originY : 'top',
          this.originX,
          this.originY
        );
        this.setPositionByOrigin(origin, this.originX, this.originY);
      },

      /**
       * @private
       */
      _projectStrokeOnPoints: function () {
        return projectStrokeOnPoints(this.points, this, true);
      },

      /**
       * Calculate the polygon bounding box
       * @private
       */
      _calcDimensions: function () {
        const points = this.exactBoundingBox
          ? this._projectStrokeOnPoints().map(
              (projection) => projection.projectedPoint
            )
          : this.points;
        if (points.length === 0) {
          return {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            pathOffset: new Point(),
          };
        }
        const bbox = makeBoundingBoxFromPoints(points);
        const bboxNoStroke = makeBoundingBoxFromPoints(this.points);
        const offsetX = bbox.left + bbox.width / 2,
          offsetY = bbox.top + bbox.height / 2;
        const pathOffsetX =
          offsetX - offsetY * Math.tan(degreesToRadians(this.skewX));
        const pathOffsetY =
          offsetY - pathOffsetX * Math.tan(degreesToRadians(this.skewY));
        // TODO: remove next line
        const legacyCorrection =
          !this.fromSVG && !this.exactBoundingBox ? this.strokeWidth / 2 : 0;
        return {
          ...bbox,
          left: bbox.left - legacyCorrection,
          top: bbox.top - legacyCorrection,
          pathOffset: new Point(pathOffsetX, pathOffsetY),
          strokeOffset: new Point(bboxNoStroke.left, bboxNoStroke.top).subtract(
            bbox.left,
            bbox.top
          ),
        };
      },

      /**
       * @returns {Point} top left position of the bounding box, useful for complementary positioning
       */
      setDimensions: function () {
        const { left, top, width, height, pathOffset, strokeOffset } =
          this._calcDimensions();
        this.set({ width, height, pathOffset, strokeOffset });
        return new Point(left, top);
      },

      /**
       * @override stroke is taken in account in size
       */
      _getNonTransformedDimensions: function () {
        return this.exactBoundingBox
          ? new Point(this.width, this.height)
          : this.callSuper('_getNonTransformedDimensions');
      },

      /**
       * @override stroke and skewing are taken into account when projecting stroke on points,
       * therefore we don't want the default calculation to account for skewing as well
       *
       * @private
       */
      _getTransformedDimensions: function (options) {
        return this.exactBoundingBox
          ? this.callSuper('_getTransformedDimensions', {
              ...(options || {}),
              // disable stroke bbox calculations
              strokeWidth: 0,
              // disable skewing bbox calculations
              skewX: 0,
              skewY: 0,
            })
          : this.callSuper('_getTransformedDimensions', options);
      },

      /**
       * Recalculates dimensions when changing skew and scale
       * @private
       */
      _set: function (key, value) {
        const changed = this.initialized && this[key] !== value;
        const output = this.callSuper('_set', key, value);
        if (
          changed &&
          (((key === 'scaleX' || key === 'scaleY') &&
            this.strokeUniform &&
            this.strokeBBoxAffectingProperties.includes('strokeUniform') &&
            this.strokeLineJoin !== 'round') ||
            this.strokeBBoxAffectingProperties.includes(key))
        ) {
          this.setDimensions();
        }
        return output;
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
    return function (element, callback, options = {}) {
      if (!element) {
        return callback(null);
      }
      const points = parsePointsAttribute(element.getAttribute('points')),
        // we omit left and top to instruct the constructor to position the object using the bbox
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        { left, top, ...parsedAttributes } = parseAttributes(
          element,
          fabric[_class].ATTRIBUTE_NAMES
        );
      callback(
        new fabric[_class](points, {
          ...parsedAttributes,
          ...options,
          fromSVG: true,
        })
      );
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
