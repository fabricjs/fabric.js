//@ts-nocheck

import { config } from '../config';
import { parseAttributes } from '../parser/parseAttributes';
import { Point } from '../point.class';
import { PathData } from '../typedefs';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { getBoundsOfCurve, makePathSimpler, parsePath } from '../util/path';

(function (global) {
  var fabric = global.fabric || (global.fabric = {}),
    extend = fabric.util.object.extend,
    clone = fabric.util.object.clone,
    toFixed = fabric.util.toFixed;

  /**
   * Path class
   * @class fabric.Path
   * @extends fabric.Object
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#path_and_pathgroup}
   * @see {@link fabric.Path#initialize} for constructor definition
   */
  fabric.Path = fabric.util.createClass(
    fabric.Object,
    /** @lends fabric.Path.prototype */ {
      /**
       * Type of an object
       * @type String
       * @default
       */
      type: 'path',

      /**
       * Array of path points
       * @type Array
       * @default
       */
      path: null,

      cacheProperties: fabric.Object.prototype.cacheProperties.concat(
        'path',
        'fillRule'
      ),

      stateProperties: fabric.Object.prototype.stateProperties.concat('path'),

      /**
       * Constructor
       * @param {Array|String} path Path data (sequence of coordinates and corresponding "command" tokens)
       * @param {Object} [options] Options object
       * @return {fabric.Path} thisArg
       */
      initialize: function (path, options) {
        options = clone(options || {});
        delete options.path;
        this.callSuper('initialize', options);
        const pathTL = this._setPath(path || []);
        const origin = this.translateToGivenOrigin(
          new Point(options.left ?? pathTL.x, options.top ?? pathTL.y),
          typeof options.left === 'number' ? this.originX : 'left',
          typeof options.top === 'number' ? this.originY : 'top',
          this.originX,
          this.originY
        );
        this.setPositionByOrigin(origin, this.originX, this.originY);
      },

      /**
       * @private
       * @param {PathData | string} path Path data (sequence of coordinates and corresponding "command" tokens)
       * @returns {Point} top left position of the bounding box, useful for complementary positioning
       */
      _setPath: function (path: PathData | string) {
        this.path = makePathSimpler(
          Array.isArray(path) ? path : parsePath(path)
        );
        return this.setDimensions();
      },

      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx context to render path on
       */
      _renderPathCommands: function (ctx) {
        var current, // current instruction
          subpathStartX = 0,
          subpathStartY = 0,
          x = 0, // current x
          y = 0, // current y
          controlX = 0, // current control point x
          controlY = 0, // current control point y
          l = -this.pathOffset.x,
          t = -this.pathOffset.y;

        ctx.beginPath();

        for (var i = 0, len = this.path.length; i < len; ++i) {
          current = this.path[i];

          switch (
            current[0] // first letter
          ) {
            case 'L': // lineto, absolute
              x = current[1];
              y = current[2];
              ctx.lineTo(x + l, y + t);
              break;

            case 'M': // moveTo, absolute
              x = current[1];
              y = current[2];
              subpathStartX = x;
              subpathStartY = y;
              ctx.moveTo(x + l, y + t);
              break;

            case 'C': // bezierCurveTo, absolute
              x = current[5];
              y = current[6];
              controlX = current[3];
              controlY = current[4];
              ctx.bezierCurveTo(
                current[1] + l,
                current[2] + t,
                controlX + l,
                controlY + t,
                x + l,
                y + t
              );
              break;

            case 'Q': // quadraticCurveTo, absolute
              ctx.quadraticCurveTo(
                current[1] + l,
                current[2] + t,
                current[3] + l,
                current[4] + t
              );
              x = current[3];
              y = current[4];
              controlX = current[1];
              controlY = current[2];
              break;

            case 'z':
            case 'Z':
              x = subpathStartX;
              y = subpathStartY;
              ctx.closePath();
              break;
          }
        }
      },

      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx context to render path on
       */
      _render: function (ctx) {
        this._renderPathCommands(ctx);
        this._renderPaintInOrder(ctx);
      },

      /**
       * Returns string representation of an instance
       * @return {String} string representation of an instance
       */
      toString: function () {
        return (
          '#<fabric.Path (' +
          this.complexity() +
          '): { "top": ' +
          this.top +
          ', "left": ' +
          this.left +
          ' }>'
        );
      },

      /**
       * Returns object representation of an instance
       * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
       * @return {Object} object representation of an instance
       */
      toObject: function (propertiesToInclude) {
        return extend(this.callSuper('toObject', propertiesToInclude), {
          path: this.path.map(function (item) {
            return item.slice();
          }),
        });
      },

      /**
       * Returns dataless object representation of an instance
       * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
       * @return {Object} object representation of an instance
       */
      toDatalessObject: function (propertiesToInclude) {
        var o = this.toObject(['sourcePath'].concat(propertiesToInclude));
        if (o.sourcePath) {
          delete o.path;
        }
        return o;
      },

      /* _TO_SVG_START_ */
      /**
       * Returns svg representation of an instance
       * @return {Array} an array of strings with the specific svg representation
       * of the instance
       */
      _toSVG: function () {
        var path = fabric.util.joinPath(this.path);
        return [
          '<path ',
          'COMMON_PARTS',
          'd="',
          path,
          '" stroke-linecap="round" ',
          '/>\n',
        ];
      },

      _getOffsetTransform: function () {
        var digits = config.NUM_FRACTION_DIGITS;
        return (
          ' translate(' +
          toFixed(-this.pathOffset.x, digits) +
          ', ' +
          toFixed(-this.pathOffset.y, digits) +
          ')'
        );
      },

      /**
       * Returns svg clipPath representation of an instance
       * @param {Function} [reviver] Method for further parsing of svg representation.
       * @return {String} svg representation of an instance
       */
      toClipPathSVG: function (reviver) {
        var additionalTransform = this._getOffsetTransform();
        return (
          '\t' +
          this._createBaseClipPathSVGMarkup(this._toSVG(), {
            reviver: reviver,
            additionalTransform: additionalTransform,
          })
        );
      },

      /**
       * Returns svg representation of an instance
       * @param {Function} [reviver] Method for further parsing of svg representation.
       * @return {String} svg representation of an instance
       */
      toSVG: function (reviver) {
        var additionalTransform = this._getOffsetTransform();
        return this._createBaseSVGMarkup(this._toSVG(), {
          reviver: reviver,
          additionalTransform: additionalTransform,
        });
      },
      /* _TO_SVG_END_ */

      /**
       * Returns number representation of an instance complexity
       * @return {Number} complexity of this instance
       */
      complexity: function () {
        return this.path.length;
      },

      /**
       * @returns {Point} top left position of the bounding box, useful for complementary positioning
       */
      setDimensions: function () {
        const { left, top, width, height, pathOffset } = this._calcDimensions();
        this.set({ width, height, pathOffset });
        return new Point(left, top);
      },

      /**
       * @private
       */
      _calcDimensions: function () {
        const bounds: Point[] = [];
        let subpathStartX = 0,
          subpathStartY = 0,
          x = 0, // current x
          y = 0; // current y

        for (let i = 0; i < this.path.length; ++i) {
          const current = this.path[i]; // current instruction
          switch (
            current[0] // first letter
          ) {
            case 'L': // lineto, absolute
              x = current[1];
              y = current[2];
              bounds.push(
                new Point(subpathStartX, subpathStartY),
                new Point(x, y)
              );
              break;

            case 'M': // moveTo, absolute
              x = current[1];
              y = current[2];
              subpathStartX = x;
              subpathStartY = y;
              break;

            case 'C': // bezierCurveTo, absolute
              bounds.push(
                ...getBoundsOfCurve(
                  x,
                  y,
                  current[1],
                  current[2],
                  current[3],
                  current[4],
                  current[5],
                  current[6]
                )
              );
              x = current[5];
              y = current[6];
              break;

            case 'Q': // quadraticCurveTo, absolute
              bounds.push(
                ...getBoundsOfCurve(
                  x,
                  y,
                  current[1],
                  current[2],
                  current[1],
                  current[2],
                  current[3],
                  current[4]
                )
              );
              x = current[3];
              y = current[4];
              break;

            case 'z':
            case 'Z':
              x = subpathStartX;
              y = subpathStartY;
              break;
          }
        }

        const bbox = makeBoundingBoxFromPoints(bounds);
        const strokeCorrection = this.fromSVG ? 0 : this.strokeWidth / 2;

        return {
          ...bbox,
          left: bbox.left - strokeCorrection,
          top: bbox.top - strokeCorrection,
          pathOffset: new Point(
            bbox.left + bbox.width / 2,
            bbox.top + bbox.height / 2
          ),
        };
      },
    }
  );

  /**
   * Creates an instance of fabric.Path from an object
   * @static
   * @memberOf fabric.Path
   * @param {Object} object
   * @returns {Promise<fabric.Path>}
   */
  fabric.Path.fromObject = function (object) {
    return fabric.Object._fromObject(fabric.Path, object, {
      extraParam: 'path',
    });
  };

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by `fabric.Path.fromElement`)
   * @static
   * @memberOf fabric.Path
   * @see http://www.w3.org/TR/SVG/paths.html#PathElement
   */
  fabric.Path.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat(['d']);

  /**
   * Creates an instance of fabric.Path from an SVG <path> element
   * @static
   * @memberOf fabric.Path
   * @param {SVGElement} element to parse
   * @param {Function} callback Callback to invoke when an fabric.Path instance is created
   * @param {Object} [options] Options object
   * @param {Function} [callback] Options callback invoked after parsing is finished
   */
  fabric.Path.fromElement = function (element, callback, options) {
    const parsedAttributes = parseAttributes(
      element,
      fabric.Path.ATTRIBUTE_NAMES
    );
    callback(
      new fabric.Path(parsedAttributes.d, {
        ...parsedAttributes,
        ...options,
        // we pass undefined to instruct the constructor to position the object using the bbox
        left: undefined,
        top: undefined,
        fromSVG: true,
      })
    );
  };
  /* _FROM_SVG_END_ */
})(typeof exports !== 'undefined' ? exports : window);
