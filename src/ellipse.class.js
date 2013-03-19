(function(global){

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      piBy2   = Math.PI * 2,
      extend = fabric.util.object.extend;

  if (fabric.Ellipse) {
    fabric.warn('fabric.Ellipse is already defined.');
    return;
  }

  /**
   * Ellipse class
   * @class Ellipse
   * @extends fabric.Object
   */
  fabric.Ellipse = fabric.util.createClass(fabric.Object, /** @scope fabric.Ellipse.prototype */ {

    /**
     * Type of an object
     * @property
     * @type String
     */
    type: 'ellipse',

    /**
     * Horizontal radius
     * @property
     * @type Number
     */
    rx: 0,

    /**
     * Vertical radius
     * @property
     * @type Number
     */
    ry: 0,

    /**
     * Constructor
     * @method initialize
     * @param {Object} [options] Options object
     * @return {fabric.Ellipse} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this.callSuper('initialize', options);

      this.set('rx', options.rx || 0);
      this.set('ry', options.ry || 0);

      this.set('width', this.get('rx') * 2);
      this.set('height', this.get('ry') * 2);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} propertiesToInclude
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        rx: this.get('rx'),
        ry: this.get('ry')
      });
    },

    /**
     * Returns svg representation of an instance
     * @method toSVG
     * @return {String} svg representation of an instance
     */
    toSVG: function() {
      var markup = [];

      if (this.fill && this.fill.toLive) {
        markup.push(this.fill.toSVG(this, false));
      }
      if (this.stroke && this.stroke.toLive) {
        markup.push(this.stroke.toSVG(this, false));
      }

      markup.push(
        '<ellipse ',
          'rx="', this.get('rx'),
          '" ry="', this.get('ry'),
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
        '"/>'
      );

      return markup.join('');
    },

    /**
     * Renders this instance on a given context
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render on
     * @param noTransform {Boolean} context is not transformed when set to true
     */
    render: function(ctx, noTransform) {
      // do not use `get` for perf. reasons
      if (this.rx === 0 || this.ry === 0) return;
      return this.callSuper('render', ctx, noTransform);
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx, noTransform) {
      ctx.beginPath();
      ctx.save();
      ctx.globalAlpha = this.group ? (ctx.globalAlpha * this.opacity) : this.opacity;
      if (this.transformMatrix && this.group) {
        ctx.translate(this.cx, this.cy);
      }
      ctx.transform(1, 0, 0, this.ry/this.rx, 0, 0);
      ctx.arc(noTransform ? this.left : 0, noTransform ? this.top : 0, this.rx, 0, piBy2, false);
      if (this.stroke) {
        ctx.stroke();
      }
      this._removeShadow(ctx);
      if (this.fill) {
        ctx.fill();
      }
      ctx.restore();
    },

    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link fabric.Ellipse.fromElement})
   * @static
   * @see http://www.w3.org/TR/SVG/shapes.html#EllipseElement
   */
  fabric.Ellipse.ATTRIBUTE_NAMES = 'cx cy rx ry fill fill-opacity opacity stroke stroke-width transform'.split(' ');

  /**
   * Returns {@link fabric.Ellipse} instance from an SVG element
   * @static
   * @method fabric.Ellipse.fromElement
   * @param {SVGElement} element Element to parse
   * @param {Object} [options] Options object
   * @return {fabric.Ellipse}
   */
  fabric.Ellipse.fromElement = function(element, options) {
    options || (options = { });

    var parsedAttributes = fabric.parseAttributes(element, fabric.Ellipse.ATTRIBUTE_NAMES);
    var cx = parsedAttributes.left;
    var cy = parsedAttributes.top;

    if ('left' in parsedAttributes) {
      parsedAttributes.left -= (options.width / 2) || 0;
    }
    if ('top' in parsedAttributes) {
      parsedAttributes.top -= (options.height / 2) || 0;
    }

    var ellipse = new fabric.Ellipse(extend(parsedAttributes, options));

    ellipse.cx = cx || 0;
    ellipse.cy = cy || 0;

    return ellipse;
  };

  /**
   * Returns {@link fabric.Ellipse} instance from an object representation
   * @static
   * @method fabric.Ellipse.fromObject
   * @param {Object} object Object to create an instance from
   * @return {fabric.Ellipse}
   */
  fabric.Ellipse.fromObject = function(object) {
    return new fabric.Ellipse(object);
  };

})(typeof exports !== 'undefined' ? exports : this);