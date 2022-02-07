/**
 * PatternBrush class
 * @class fabric.PatternBrush
 * @extends fabric.BaseBrush
 */
fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, /** @lends fabric.PatternBrush.prototype */ {

  getPatternSrc: function() {

    var dotWidth = 20,
        dotDistance = 5,
        patternCanvas = fabric.util.createCanvasElement(),
        patternCtx = patternCanvas.getContext('2d');

    patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;

    patternCtx.fillStyle = this.color;
    patternCtx.beginPath();
    patternCtx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
    patternCtx.closePath();
    patternCtx.fill();

    return patternCanvas;
  },

  getPatternSrcFunction: function() {
    return String(this.getPatternSrc).replace('this.color', '"' + this.color + '"');
  },

  /**
   * Creates "pattern" instance property
   * @param {CanvasRenderingContext2D} ctx
   */
  getPattern: function(ctx) {
    return ctx.createPattern(this.source || this.getPatternSrc(), 'repeat');
  },

  /**
   * Sets brush styles
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles: function(ctx) {
    this.callSuper('_setBrushStyles', ctx);
    ctx.strokeStyle = this.getPattern(ctx);
  },

  /**
   * Creates path
   */
  createPath: function(pathData) {
    var path = this.callSuper('createPath', pathData),
        topLeft = path._getLeftTopCoords().scalarAdd(path.strokeWidth / 2);

    path.stroke = new fabric.Pattern({
      source: this.source || this.getPatternSrcFunction(),
      offsetX: -topLeft.x,
      offsetY: -topLeft.y
    });
    return path;
  }
});
