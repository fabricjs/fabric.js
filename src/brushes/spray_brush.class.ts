//@ts-nocheck
/**
 * SprayBrush class
 * @class fabric.SprayBrush
 */
export class SprayBrush extends fabric.BaseBrush {

  /**
   * Width of a spray
   * @type Number
   * @default
   */
  width = 10

  /**
   * Density of a spray (number of dots per chunk)
   * @type Number
   * @default
   */
  density = 20

  /**
   * Width of spray dots
   * @type Number
   * @default
   */
  dotWidth = 1

  /**
   * Width variance of spray dots
   * @type Number
   * @default
   */
  dotWidthVariance = 1

  /**
   * Whether opacity of a dot should be random
   * @type Boolean
   * @default
   */
  randomOpacity = false

  /**
   * Whether overlapping dots (rectangles) should be removed (for performance reasons)
   * @type Boolean
   * @default
   */
  optimizeOverlapping = true

  /**
   * Constructor
   * @param {fabric.Canvas} canvas
   * @return {fabric.SprayBrush} Instance of a spray brush
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.sprayChunks = [];
  }

  /**
   * Invoked on mouse down
   * @param {Object} pointer
   */
  onMouseDown(pointer) {
    this.sprayChunks.length = 0;
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();

    this.addSprayChunk(pointer);
    this.render(this.sprayChunkPoints);
  }

  /**
   * Invoked on mouse move
   * @param {Object} pointer
   */
  onMouseMove(pointer) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    this.addSprayChunk(pointer);
    this.render(this.sprayChunkPoints);
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;

    var rects = [];

    for (var i = 0, ilen = this.sprayChunks.length; i < ilen; i++) {
      var sprayChunk = this.sprayChunks[i];

      for (var j = 0, jlen = sprayChunk.length; j < jlen; j++) {

        var rect = new fabric.Rect({
          width: sprayChunk[j].width,
          height: sprayChunk[j].width,
          left: sprayChunk[j].x + 1,
          top: sprayChunk[j].y + 1,
          originX: 'center',
          originY: 'center',
          fill: this.color
        });
        rects.push(rect);
      }
    }

    if (this.optimizeOverlapping) {
      rects = this._getOptimizedRects(rects);
    }

    var group = new fabric.Group(rects, {
      objectCaching: true,
      layout: 'fixed',
      subTargetCheck: false,
      interactive: false
    });
    this.shadow && group.set('shadow', new fabric.Shadow(this.shadow));
    this.canvas.fire('before:path:created', { path: group });
    this.canvas.add(group);
    this.canvas.fire('path:created', { path: group });

    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  }

  /**
   * @private
   * @param {Array} rects
   */
  _getOptimizedRects(rects) {

    // avoid creating duplicate rects at the same coordinates
    var uniqueRects = { }, key, i, len;

    for (i = 0, len = rects.length; i < len; i++) {
      key = rects[i].left + '' + rects[i].top;
      if (!uniqueRects[key]) {
        uniqueRects[key] = rects[i];
      }
    }
    var uniqueRectsArray = [];
    for (key in uniqueRects) {
      uniqueRectsArray.push(uniqueRects[key]);
    }

    return uniqueRectsArray;
  }

  /**
   * Render new chunk of spray brush
   */
  render(sprayChunk) {
    var ctx = this.canvas.contextTop, i, len;
    ctx.fillStyle = this.color;

    this._saveAndTransform(ctx);

    for (i = 0, len = sprayChunk.length; i < len; i++) {
      var point = sprayChunk[i];
      if (typeof point.opacity !== 'undefined') {
        ctx.globalAlpha = point.opacity;
      }
      ctx.fillRect(point.x, point.y, point.width, point.width);
    }
    ctx.restore();
  }

  /**
   * Render all spray chunks
   */
  _render() {
    var ctx = this.canvas.contextTop, i, ilen;
    ctx.fillStyle = this.color;

    this._saveAndTransform(ctx);

    for (i = 0, ilen = this.sprayChunks.length; i < ilen; i++) {
      this.render(this.sprayChunks[i]);
    }
    ctx.restore();
  }

  /**
   * @param {Object} pointer
   */
  addSprayChunk(pointer) {
    this.sprayChunkPoints = [];

    var x, y, width, radius = this.width / 2, i;

    for (i = 0; i < this.density; i++) {

      x = fabric.util.getRandomInt(pointer.x - radius, pointer.x + radius);
      y = fabric.util.getRandomInt(pointer.y - radius, pointer.y + radius);

      if (this.dotWidthVariance) {
        width = fabric.util.getRandomInt(
          // bottom clamp width to 1
          Math.max(1, this.dotWidth - this.dotWidthVariance),
          this.dotWidth + this.dotWidthVariance);
      }
      else {
        width = this.dotWidth;
      }

      var point = new fabric.Point(x, y);
      point.width = width;

      if (this.randomOpacity) {
        point.opacity = fabric.util.getRandomInt(0, 100) / 100;
      }

      this.sprayChunkPoints.push(point);
    }

    this.sprayChunks.push(this.sprayChunkPoints);
  }
}
