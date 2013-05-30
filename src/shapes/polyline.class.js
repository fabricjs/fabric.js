(function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      toFixed = fabric.util.toFixed,
      min = fabric.util.array.min;

  if (fabric.Polyline) {
    fabric.warn('fabric.Polyline is already defined');
    return;
  }

  /**
   * Polyline class
   * @class fabric.Polyline
   * @extends fabric.Object
   */
  fabric.Polyline = fabric.util.createClass(fabric.Object, /** @lends fabric.Polyline.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'polyline',

    /**
     * Constructor
     * @param {Array} points Array of points
     * @param {Object} [options] Options object
     * @param {Boolean} [skipOffset] Whether points offsetting should be skipped
     * @return {fabric.Polyline} thisArg
     */
    initialize: function(points, options, skipOffset) {
      options = options || { };
      this.set('points', points);
      this.callSuper('initialize', options);
      this._calcDimensions(skipOffset);
    },

    /**
     * @private
     * @param {Boolean} [skipOffset] Whether points offsetting should be skipped
     */
    _calcDimensions: function(skipOffset) {
      return fabric.Polygon.prototype._calcDimensions.call(this, skipOffset);
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return fabric.Polygon.prototype.toObject.call(this, propertiesToInclude);
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @return {String} svg representation of an instance
     */
    toSVG: function() {
      var points = [],
          markup = [];

      for (var i = 0, len = this.points.length; i < len; i++) {
        points.push(toFixed(this.points[i].x, 2), ',', toFixed(this.points[i].y, 2), ' ');
      }

      if (this.fill && this.fill.toLive) {
        markup.push(this.fill.toSVG(this, false));
      }
      if (this.stroke && this.stroke.toLive) {
        markup.push(this.stroke.toSVG(this, false));
      }

      markup.push(
        '<polyline ',
          'points="', points.join(''),
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
        '"/>'
      );

      return markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      var point;
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (var i = 0, len = this.points.length; i < len; i++) {
        point = this.points[i];
        ctx.lineTo(point.x, point.y);
      }

      this._renderFill(ctx);
      this._renderStroke(ctx);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderDashedStroke: function(ctx) {
      var p1, p2;

      ctx.beginPath();
      for (var i = 0, len = this.points.length; i < len; i++) {
        p1 = this.points[i];
        p2 = this.points[i+1] || p1;
        fabric.util.drawDashedLine(ctx, p1.x, p1.y, p2.x, p2.y, this.strokeDashArray);
      }
    },

    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return this.get('points').length;
    }
  });

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link fabric.Polyline.fromElement})
   * @static
   * @see: http://www.w3.org/TR/SVG/shapes.html#PolylineElement
   */
  fabric.Polyline.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat();

  /**
   * Returns fabric.Polyline instance from an SVG element
   * @static
   * @param {SVGElement} element Element to parse
   * @param {Object} [options] Options object
   * @return {fabric.Polyline} Instance of fabric.Polyline
   */
  fabric.Polyline.fromElement = function(element, options) {
    if (!element) {
      return null;
    }
    options || (options = { });

    var points = fabric.parsePointsAttribute(element.getAttribute('points')),
        parsedAttributes = fabric.parseAttributes(element, fabric.Polyline.ATTRIBUTE_NAMES),
        minX = min(points, 'x'),
        minY = min(points, 'y');

    minX = minX < 0 ? minX : 0;
    minY = minX < 0 ? minY : 0;

    for (var i = 0, len = points.length; i < len; i++) {
      // normalize coordinates, according to containing box (dimensions of which are passed via `options`)
      points[i].x -= (options.width / 2 + minX) || 0;
      points[i].y -= (options.height / 2 + minY) || 0;
    }

    return new fabric.Polyline(points, fabric.util.object.extend(parsedAttributes, options), true);
  };
  /* _FROM_SVG_END_ */

  /**
   * Returns fabric.Polyline instance from an object representation
   * @static
   * @param object {Object} object Object to create an instance from
   * @return {fabric.Polyline} Instance of fabric.Polyline
   */
  fabric.Polyline.fromObject = function(object) {
    var points = object.points;
    return new fabric.Polyline(points, object, true);
  };

})(typeof exports !== 'undefined' ? exports : this);
