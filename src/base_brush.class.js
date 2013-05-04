/**
 * BaseBrush class
 * @class fabric.BaseBrush
 */
fabric.BaseBrush = fabric.util.createClass(/** @lends fabric.BaseBrush.prototype */ {

  /**
   * Color of a brush
   * @type String
   */
  color:       'rgb(0, 0, 0)',

  /**
   * Width of a brush
   * @type Number
   */
  width:        1,

  /**
   * Shadow blur of a brush
   * @type Number
   */
  shadowBlur:   0,

  /**
   * Shadow color of a brush
   * @type String
   */
  shadowColor:  '',

  /**
   * Shadow offset x of a brush
   * @type Number
   */
  shadowOffsetX: 0,

  /**
   * Shadow offset y of a brush
   * @type Number
   */
  shadowOffsetY: 0,

  /**
   * Sets brush styles
   */
  setBrushStyles: function() {
    var ctx = this.canvas.contextTop;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = ctx.lineJoin = 'round';
  },

  /**
   * Sets brush shadow styles
   */
  setShadowStyles: function() {
    var ctx = this.canvas.contextTop;

    ctx.shadowBlur = this.shadowBlur;
    ctx.shadowColor = this.shadowColor || this.color;
    ctx.shadowOffsetX = this.shadowOffsetX;
    ctx.shadowOffsetY = this.shadowOffsetY;
  },

  /**
   * Remove brush shadow styles
   */
  removeShadowStyles: function() {
    var ctx = this.canvas.contextTop;

    ctx.shadowColor = '';
    ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
  }
});
