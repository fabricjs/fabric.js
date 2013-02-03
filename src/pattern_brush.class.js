/**
 * PatternBrush class
 * @class fabric.PatternBrush
 * @extends fabric.BaseBrush
 */
fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, /** @scope fabric.PatternBrush.prototype */ {

  getPatternSrc: function() {

    var dotWidth = 20,
        dotDistance = 5,
        patternCanvas = fabric.document.createElement('canvas'),
        patternCtx = patternCanvas.getContext('2d');

    patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;

    patternCtx.fillStyle = this.color;
    patternCtx.beginPath();
    patternCtx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
    patternCtx.closePath();
    patternCtx.fill();

    return patternCanvas;
  },

  getPatternSrcBody: function() {
    return String(this.getPatternSrc)
      .match(/function\s+\w*\s*\(.*\)\s+\{([\s\S]*)\}/)[1]
      .replace('this.color', '"' + this.color + '"');
  },

  /**
   * Creates "pattern" instance property
   * @method getPattern
   */
  getPattern: function() {
    return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), 'repeat');
  },

  /**
   * Sets brush styles
   * @method setBrushStyles
   */
  setBrushStyles: function() {
    this.callSuper('setBrushStyles');
    this.canvas.contextTop.strokeStyle = this.getPattern();
  },

  /**
   * Creates path
   * @method createPath
   */
  createPath: function(pathData) {
    var path = this.callSuper('createPath', pathData);
    path.stroke = new fabric.Pattern({
      source: this.source || this.getPatternSrcBody()
    });
    return path;
  }
});