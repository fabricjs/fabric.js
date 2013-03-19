(function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  if (fabric.Rect) {
    console.warn('fabric.Rect is already defined');
    return;
  }

  /**
   * Rectangle class
   * @class Rect
   * @extends fabric.Object
   */
  fabric.Rect = fabric.util.createClass(fabric.Object, /** @scope fabric.Rect.prototype */ {

    /**
     * Type of an object
     * @property
     * @type String
     */
    type: 'rect',

    /**
     * Horizontal border radius
     * @property
     * @type Number
     */
    rx: 0,

    /**
     * Vertical border radius
     * @property
     * @type Number
     */
    ry: 0,

    /**
     * Constructor
     * @method initialize
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this._initStateProperties();
      this.callSuper('initialize', options);
      this._initRxRy();

      this.x = 0;
      this.y = 0;
    },

    /**
     * Creates `stateProperties` list on an instance, and adds `fabric.Rect` -specific ones to it
     * (such as "rx", "ry", etc.)
     * @private
     * @method _initStateProperties
     */
    _initStateProperties: function() {
      this.stateProperties = this.stateProperties.concat(['rx', 'ry']);
    },

    /**
     * Initializes rx/ry attributes
     * @private
     * @method _initRxRy
     */
    _initRxRy: function() {
      if (this.rx && !this.ry) {
        this.ry = this.rx;
      }
      else if (this.ry && !this.rx) {
        this.rx = this.ry;
      }
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var rx = this.rx || 0,
          ry = this.ry || 0,
          x = -this.width / 2,
          y = -this.height / 2,
          w = this.width,
          h = this.height;

      ctx.beginPath();
      ctx.globalAlpha = this.group ? (ctx.globalAlpha * this.opacity) : this.opacity;

      if (this.transformMatrix && this.group) {
        ctx.translate(
          this.width / 2 + this.x,
          this.height / 2 + this.y);
      }
      if (!this.transformMatrix && this.group) {
        ctx.translate(
          -this.group.width / 2 + this.width / 2 + this.x,
          -this.group.height / 2 + this.height / 2 + this.y);
      }

      ctx.moveTo(x+rx, y);
      ctx.lineTo(x+w-rx, y);
      ctx.quadraticCurveTo(x+w, y, x+w, y+ry, x+w, y+ry);
      ctx.lineTo(x+w, y+h-ry);
      ctx.quadraticCurveTo(x+w,y+h,x+w-rx,y+h,x+w-rx,y+h);
      ctx.lineTo(x+rx,y+h);
      ctx.quadraticCurveTo(x,y+h,x,y+h-ry,x,y+h-ry);
      ctx.lineTo(x,y+ry);
      ctx.quadraticCurveTo(x,y,x+rx,y,x+rx,y);
      ctx.closePath();

      if (this.fill) {
        ctx.fill();
      }

      this._removeShadow(ctx);

      if (this.strokeDashArray) {
        this._renderDashedStroke(ctx);
      }
      else if (this.stroke) {
        ctx.stroke();
      }
    },

    /**
     * @private
     * @method _renderDashedStroke
     */
    _renderDashedStroke: function(ctx) {

      if (1 & this.strokeDashArray.length /* if odd number of items */) {
        /* duplicate items */
        this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
      }

      var i = 0,
          x = -this.width/2, y = -this.height/2,
          _this = this,
          padding = this.padding,
          dashedArrayLength = this.strokeDashArray.length;

      ctx.save();
      ctx.beginPath();

      /** @ignore */
      function renderSide(xMultiplier, yMultiplier) {

        var lineLength = 0,
            lengthDiff = 0,
            sideLength = (yMultiplier ? _this.height : _this.width) + padding * 2;

        while (lineLength < sideLength) {

          var lengthOfSubPath = _this.strokeDashArray[i++];
          lineLength += lengthOfSubPath;

          if (lineLength > sideLength) {
            lengthDiff = lineLength - sideLength;
          }

          // track coords
          if (xMultiplier) {
            x += (lengthOfSubPath * xMultiplier) - (lengthDiff * xMultiplier || 0);
          }
          else {
            y += (lengthOfSubPath * yMultiplier) - (lengthDiff * yMultiplier || 0);
          }

          ctx[1 & i /* odd */ ? 'moveTo' : 'lineTo'](x, y);
          if (i >= dashedArrayLength) {
            i = 0;
          }
        }
      }

      renderSide(1, 0);
      renderSide(0, 1);
      renderSide(-1, 0);
      renderSide(0, -1);

      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },

    /**
     * @method _normalizeLeftTopProperties
     * @private
     * Since coordinate system differs from that of SVG
     */
    _normalizeLeftTopProperties: function(parsedAttributes) {
      if (parsedAttributes.left) {
        this.set('left', parsedAttributes.left + this.getWidth() / 2);
      }
      this.set('x', parsedAttributes.left || 0);
      if (parsedAttributes.top) {
        this.set('top', parsedAttributes.top + this.getHeight() / 2);
      }
      this.set('y', parsedAttributes.top || 0);
      return this;
    },

    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} propertiesToInclude
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        rx: this.get('rx') || 0,
        ry: this.get('ry') || 0
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
        '<rect ',
          'x="', (-1 * this.width / 2), '" y="', (-1 * this.height / 2),
          '" rx="', this.get('rx'), '" ry="', this.get('ry'),
          '" width="', this.width, '" height="', this.height,
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
        '"/>'
      );

      return markup.join('');
    }
  });

  /**
   * List of attribute names to account for when parsing SVG element (used by `fabric.Rect.fromElement`)
   * @static
   */
  fabric.Rect.ATTRIBUTE_NAMES = 'x y width height rx ry fill fill-opacity opacity stroke stroke-width transform'.split(' ');

  /**
   * @private
   */
  function _setDefaultLeftTopValues(attributes) {
    attributes.left = attributes.left || 0;
    attributes.top  = attributes.top  || 0;
    return attributes;
  }

  /**
   * Returns {@link fabric.Rect} instance from an SVG element
   * @static
   * @method fabric.Rect.fromElement
   * @param {SVGElement} element Element to parse
   * @param {Object} [options] Options object
   * @return {fabric.Rect} Instance of fabric.Rect
   */
  fabric.Rect.fromElement = function(element, options) {
    if (!element) {
      return null;
    }

    var parsedAttributes = fabric.parseAttributes(element, fabric.Rect.ATTRIBUTE_NAMES);
    parsedAttributes = _setDefaultLeftTopValues(parsedAttributes);

    var rect = new fabric.Rect(extend((options ? fabric.util.object.clone(options) : { }), parsedAttributes));
    rect._normalizeLeftTopProperties(parsedAttributes);

    return rect;
  };

  /**
   * Returns {@link fabric.Rect} instance from an object representation
   * @static
   * @method fabric.Rect.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Rect
   */
  fabric.Rect.fromObject = function(object) {
    return new fabric.Rect(object);
  };

})(typeof exports !== 'undefined' ? exports : this);