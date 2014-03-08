/**
 * CircleBrush class
 * @class fabric.CircleBrush
 */
fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, /** @lends fabric.CircleBrush.prototype */ {

  /**
   * Width of a brush
   * @type Number
   * @default
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
  * Invoked inside on mouse down and mouse move
  * @param {Object} pointer
  */
  drawDot: function(pointer) {
    var point = this.addPoint(pointer);
    var ctx = this.canvas.contextTop;

    ctx.fillStyle = point.fill;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  /**
   * Invoked on mouse down
   */
  onMouseDown: function(pointer) {
    this.points.length = 0;
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();
    this.drawDot(pointer);
  },

  /**
   * Invoked on mouse move
   * @param {Object} pointer
   */
  onMouseMove: function(pointer) {
    this.drawDot(pointer);
  },

  /**
   * Invoked on mouse up
   */
  onMouseUp: function() {
    var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;

    var circles = [ ];

    for (var i = 0, len = this.points.length; i < len; i++) {
      var point = this.points[i];
      var circle = new fabric.Circle({
        radius: point.radius,
        left: point.x,
        top: point.y,
        originX: 'center',
        originY: 'center',
        fill: point.fill
      });

      this.shadow && circle.setShadow(this.shadow);

      circles.push(circle);
    }
    var group = new fabric.Group(circles, { originX: 'center', originY: 'center' });

    this.canvas.add(group);
    this.canvas.fire('path:created', { path: group });

    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
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
