/**
 * BaseBrush class
 * @class fabric.BaseBrush
 */
fabric.BaseBrush = fabric.util.createClass({

  /**
   * Color of a brush
   * @property
   * @type String
   */
  color:       'rgb(0, 0, 0)',

  /**
   * Width of a brush
   * @property
   * @type Number
   */
  width:        1,

  /**
   * Shadow blur of a brush
   * @property
   * @type Number
   */
  shadowBlur:   0,

  /**
   * Shadow color of a brush
   * @property
   * @type String
   */
  shadowColor:  '',

  /**
   * Shadow offset x of a brush
   * @property
   * @type Number
   */
  shadowOffsetX: 0,

  /**
   * Shadow offset y of a brush
   * @property
   * @type Number
   */
  shadowOffsetY: 0,

  /**
   * Sets brush styles
   * @method setBrushStyles
   */
  setBrushStyles: function() {
    var ctx = this.canvas.contextTop;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = ctx.lineJoin = 'round';
  },

  /**
   * Sets brush shadow styles
   * @method setShadowStyles
   */
  setShadowStyles: function() {
    var ctx = this.canvas.contextTop;

    ctx.shadowBlur = this.shadowBlur;
    ctx.shadowColor = this.shadowColor || this.color;
    ctx.shadowOffsetX = this.shadowOffsetX;
    ctx.shadowOffsetY = this.shadowOffsetY;
  }
});