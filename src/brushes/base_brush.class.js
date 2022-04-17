/**
 * BaseBrush class
 * @class fabric.BaseBrush
 * @see {@link http://fabricjs.com/freedrawing|Freedrawing demo}
 */
fabric.BaseBrush = fabric.util.createClass(/** @lends fabric.BaseBrush.prototype */ {

  /**
   * Color of a brush
   * @type String
   * @default
   */
  color: 'rgb(0, 0, 0)',

  /**
   * Width of a brush, has to be a Number, no string literals
   * @type Number
   * @default
   */
  width: 1,

  /**
   * Shadow object representing shadow of this shape.
   * <b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
   * "shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12
   * @type fabric.Shadow
   * @default
   */
  shadow: null,

  /**
   * Line endings style of a brush (one of "butt", "round", "square")
   * @type String
   * @default
   */
  strokeLineCap: 'round',

  /**
   * Corner style of a brush (one of "bevel", "round", "miter")
   * @type String
   * @default
   */
  strokeLineJoin: 'round',

  /**
   * Maximum miter length (used for strokeLineJoin = "miter") of a brush's
   * @type Number
   * @default
   */
  strokeMiterLimit:         10,

  /**
   * Stroke Dash Array.
   * @type Array
   * @default
   */
  strokeDashArray: null,

  /**
   * When `true`, the free drawing is limited to the whiteboard size. Default to false.
   * @type Boolean
   * @default false
  */

  limitedToCanvasSize: false,

  initialize: function (layer) {
    this.layer = layer;
    this.canvas = this.layer.canvas;
    var ctx = this.getContext();
    ctx.save();
    ctx.translate(-this.layer.width / 2, -this.layer.height / 2);
  },

  _isMainEvent: function (e) {
    return this.canvas._isMainEvent(e);
  },

  getContext: function () {
    if (!this.layer._cacheCanvas || !this.layer._cacheContext) {
      this.layer._createCacheCanvas();
    }
    return this.layer._cacheContext;
  },

  resetContext: function () {
    var canvas = this.layer._cacheCanvas, ctx = this.layer._cacheContext;
    //console.log('reset')
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  /**
   * Sets brush styles
   * @private
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles: function () {
    ctx = this.getContext();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = this.strokeLineCap;
    ctx.miterLimit = this.strokeMiterLimit;
    ctx.lineJoin = this.strokeLineJoin;
    ctx.setLineDash(this.strokeDashArray || []);
  },

  /**
   * Sets the transformation on given context
   * @param {RenderingContext2d} ctx context to render on
   * @private
   */
  _saveAndTransform: function(ctx) {
    var v = this.canvas.viewportTransform;

    this.layer._updateCacheCanvas();
    ctx.save();
    //ctx.translate(-this.layer.width / 2, -this.layer.height / 2);
   // ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
  },

  /**
   * Sets brush shadow styles
   * @private
   */
  _setShadow: function() {
    if (!this.shadow) {
      return;
    }

    var canvas = this.canvas,
        shadow = this.shadow,
        ctx = canvas.contextTop,
        zoom = canvas.getZoom();
    if (canvas && canvas._isRetinaScaling()) {
      zoom *= fabric.devicePixelRatio;
    }

    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur * zoom;
    ctx.shadowOffsetX = shadow.offsetX * zoom;
    ctx.shadowOffsetY = shadow.offsetY * zoom;
  },

  needsFullRender: function() {
    var color = new fabric.Color(this.color);
    return color.getAlpha() < 1 || !!this.shadow;
  },

  /**
   * Removes brush shadow styles
   * @private
   */
  _resetShadow: function() {
    var ctx = this.canvas.contextTop;

    ctx.shadowColor = '';
    ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
  },

  /**
   * Check is pointer is outside canvas boundaries
   * @param {Object} pointer
   * @private
  */
  _isOutSideCanvas: function(pointer) {
    return pointer.x < 0 || pointer.x > this.canvas.getWidth() || pointer.y < 0 || pointer.y > this.canvas.getHeight();
  }
});
