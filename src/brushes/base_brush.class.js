/**
 * BaseBrush class
 * @class fabric.BaseBrush
 * @see {@link http://fabricjs.com/freedrawing/|Freedrawing demo}
 */
fabric.BaseBrush = fabric.util.createClass(/** @lends fabric.BaseBrush.prototype */ {

  /**
   * Color of a brush
   * @type String
   * @default
   */
  color:            'rgb(0, 0, 0)',

  /**
   * Width of a brush
   * @type Number
   * @default
   */
  width:            1,

  /**
   * Shadow object representing shadow of this shape.
   * <b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
   * "shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12
   * @type fabric.Shadow
   * @default
   */
  shadow:          null,

  /**
   * Line endings style of a brush (one of "butt", "round", "square")
   * @type String
   * @default
   */
  strokeLineCap:    'round',

  /**
   * Corner style of a brush (one of "bevil", "round", "miter")
   * @type String
   * @default
   */
  strokeLineJoin:   'round',

  /**
   * Stroke Dash Array.
   * @type Array
   * @default
   */
  strokeDashArray:   null,

  /**
   * Sets shadow of an object
   * @param {Object|String} [options] Options object or string (e.g. "2px 2px 10px rgba(0,0,0,0.2)")
   * @return {fabric.Object} thisArg
   * @chainable
   */
  setShadow: function(options) {
    this.shadow = new fabric.Shadow(options);
    return this;
  },

  /**
   * Sets brush styles
   * @private
   */
  _setBrushStyles: function() {
    var ctx = this.canvas.contextTop;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = this.strokeLineCap;
    ctx.lineJoin = this.strokeLineJoin;
    if (this.strokeDashArray && fabric.StaticCanvas.supports('setLineDash')) {
      ctx.setLineDash(this.strokeDashArray);
    }
  },

  /**
   * Sets brush shadow styles
   * @private
   */
  _setShadow: function() {
    if (!this.shadow) {
      return;
    }

    var ctx = this.canvas.contextTop;

    ctx.shadowColor = this.shadow.color;
    ctx.shadowBlur = this.shadow.blur;
    ctx.shadowOffsetX = this.shadow.offsetX;
    ctx.shadowOffsetY = this.shadow.offsetY;
  },

  /**
   * Removes brush shadow styles
   * @private
   */
  _resetShadow: function() {
    var ctx = this.canvas.contextTop;

    ctx.shadowColor = '';
    ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
  }
});
