/**
 * CircleBrush class
 * @class fabric.CircleBrush
 */
fabric.CircleBrush = fabric.util.createClass( fabric.BaseBrush, /** @lends fabric.CircleBrush.prototype */ {

  /**
   * Width of a brush
   * @type Number
   */
  width: 10,

  /**
   * Constructor
   * @param {fabric.Canvas} canvas
   * @return {fabric.CircleBrush} Instance of a circle brush
   */
  initialize: function(canvas) {
    this.canvas = canvas;
    this.points = [ ];
  },

  /**
   * Invoked on mouse down
   * @param {Object} pointer
   */
  onMouseDown: function() {
    this.points.length = 0;
    this.canvas.clearContext(this.canvas.contextTop);
    this.setShadowStyles();
  },

  /**
   * Invoked on mouse move
   * @param {Object} pointer
   */
  onMouseMove: function(pointer) {
    var point = this.addPoint(pointer);
    var ctx = this.canvas.contextTop;

    ctx.fillStyle = point.fill;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  /**
   * Invoked on mouse up
   */
  onMouseUp: function() {
    var originalRenderOnAddition = this.canvas.renderOnAddition;
    this.canvas.renderOnAddition = false;

    for (var i = 0, len = this.points.length; i < len; i++) {
      var point = this.points[i];
      var circle = new fabric.Circle({
        radius: point.radius,
        left: point.x,
        top: point.y,
        fill: point.fill,
        shadow: {
          color: this.shadowColor || this.color,
          blur: this.shadowBlur,
          offsetX: this.shadowOffsetX,
          offsetY: this.shadowOffsetY
        }
      });
      this.canvas.add(circle);
    }

    this.canvas.clearContext(this.canvas.contextTop);
    this.removeShadowStyles();
    this.canvas.renderOnAddition = originalRenderOnAddition;
    this.canvas.renderAll();
  },

  /**
   * @param {Object} pointer
   * @return {fabric.Point} Just added pointer point
   */
  addPoint: function(pointer) {
    var pointerPoint = new fabric.Point(pointer.x, pointer.y);

    var circleRadius = fabric.util.getRandomInt(
                        Math.max(0, this.width - 20), this.width + 20) / 2;

    var circleColor = new fabric.Color(this.color)
                        .setAlpha(fabric.util.getRandomInt(0, 100) / 100)
                        .toRgba();

    pointerPoint.radius = circleRadius;
    pointerPoint.fill = circleColor;

    this.points.push(pointerPoint);

    return pointerPoint;
  }
});
