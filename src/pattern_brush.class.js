/**
 * PatternBrush class
 * @class fabric.PatternBrush
 * @extends fabric.BaseBrush
 */
fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, /** @scope fabric.PatternBrush.prototype */ {

  createPattern: function(patternCanvas) {

    var dotWidth = 20,
        dotDistance = 5,
        patternCtx = patternCanvas.getContext('2d');

    patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;

    patternCtx.fillStyle = this.color;
    patternCtx.beginPath();
    patternCtx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
    patternCtx.closePath();
    patternCtx.fill();
  },

  /**
   * Creates "pattern" instance property
   * @method createPattern
   */
  getPattern: function() {
    var patternCanvas = fabric.document.createElement('canvas');
    this.createPattern(patternCanvas);
    return this.canvas.contextTop.createPattern(patternCanvas, 'repeat');
  },

  /**
   * Sets brush styles
   * @method setBrushStyles
   */
  setBrushStyles: function() {
    this.callSuper('setBrushStyles');
    this.canvas.contextTop.strokeStyle = this.getPattern();
  }
});