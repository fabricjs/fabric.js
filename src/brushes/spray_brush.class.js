/**
 * SprayBrush class
 * @class fabric.SprayBrush
 */
fabric.SprayBrush = fabric.util.createClass( fabric.BaseBrush, /** @lends fabric.SprayBrush.prototype */ {

  /**
   * Width of a spray
   * @type Number
   * @default
   */
  width:              10,

  /**
   * Density of a spray (number of dots per chunk)
   * @type Number
   * @default
   */
  density:            20,

  /**
   * Width of spray dots
   * @type Number
   * @default
   */
  dotWidth:           1,

  /**
   * Width variance of spray dots
   * @type Number
   * @default
   */
  dotWidthVariance:   1,

  /**
   * Whether opacity of a dot should be random
   * @type Boolean
   * @default
   */
  randomOpacity:        false,

  /**
   * Whether overlapping dots (rectangles) should be removed (for performance reasons)
   * @type Boolean
   * @default
   */
  optimizeOverlapping:  true,
  
  /**
   * Performance enhancement
   * Threshold of dots before creating a new buffering group
   * @type number
   */
  bufferThreshold: 75,

  /**
   * Constructor
   * @param {fabric.Canvas} canvas
   * @return {fabric.SprayBrush} Instance of a spray brush
   */
  initialize: function(canvas) {
    this.canvas = canvas;
    this.sprayChunks = [];
  },

  /**
   * @private
   * @returns {fabric.Group}
   */
  _createBufferingGroup: function () {
    return new fabric.Group([], {
      objectCaching: true,
      layout: 'none',
      subTargetCheck: false,
      originX: 'center',
      originY: 'center',
      width: this.canvas.width,
      height: this.canvas.height,
      canvas: this.canvas
    });
  },

  /**
   * @private
   * @param {fabric.Group} group 
   */
  _layoutBufferingGroup: function (group) {
    group.triggerLayout({ layout: 'fit-content' });
    group.triggerLayout({ layout: 'fixed' });
  },

  /**
   * Invoked on mouse down
   * @param {Object} pointer
   */
  onMouseDown: function(pointer) {
    this.sprayChunks = [];
    this._buffer = this._createBufferingGroup();
    this._buffer.set({ layout: 'fit-content-lazy' });
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();

    this.addSprayChunk(pointer);
    this.renderChunck(this.sprayChunkPoints);
  },

  /**
   * Invoked on mouse move
   * @param {Object} pointer
   */
  onMouseMove: function(pointer) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    this.addSprayChunk(pointer);
    this.renderChunck(this.sprayChunkPoints);
  },

  /**
   * Invoked on mouse up
   */
  onMouseUp: function() {
    var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;
    var group = this._buffer;
    if (this._tempBuffer) {
      this._layoutBufferingGroup(this._tempBuffer);
      group.add(this._tempBuffer);
    }
    this._buffer = undefined;
    this._tempBuffer = undefined;
    this.shadow && group.set('shadow', new fabric.Shadow(this.shadow));
    this.canvas.fire('before:path:created', { path: group });
    this.canvas.add(group);
    this.canvas.fire('path:created', { path: group });

    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  },

  /**
   * Render new chunk of spray brush
   */
  renderChunck: function(sprayChunk) {
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
  },

  /**
   * Render all spray chunks
   */
  _render: function() {
    var ctx = this.canvas.contextTop, i, ilen;
    ctx.fillStyle = this.color;

    this._saveAndTransform(ctx);

    for (i = 0, ilen = this.sprayChunks.length; i < ilen; i++) {
      this.renderChunck(this.sprayChunks[i]);
    }
    ctx.restore();
  },

  /**
   * @param {Object} pointer
   */
  addSprayChunk: function(pointer) {
    this.sprayChunkPoints = [];
    var i, x, y, key, width, radius = this.width / 2, hits = {};

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

      if (this.optimizeOverlapping) {
        key = x + ',' + y;
        // avoid creating duplicate rects at the same coordinates
        if (hits[key]) {
          continue;
        }
        else {
          hits[key] = true;
        }
      }

      var point = new fabric.Point(x, y);
      point.width = width;

      if (this.randomOpacity) {
        point.opacity = fabric.util.getRandomInt(0, 100) / 100;
      }

      this.sprayChunkPoints.push(point);
      var rect = new fabric.Rect({
        width: point.width,
        height: point.width,
        left: point.x + 1,
        top: point.y + 1,
        originX: 'center',
        originY: 'center',
        fill: this.color,
        objectCaching: false
      });
      if (this._tempBuffer && this._tempBuffer.size() > this.bufferThreshold) {
        this._layoutBufferingGroup(this._tempBuffer);
        this._buffer.add(this._tempBuffer);
        this._tempBuffer.renderCache();
        this._tempBuffer = undefined;
      }
      if (!this._tempBuffer) {
        this._tempBuffer = this._createBufferingGroup();
      }
      this._tempBuffer.addRelativeToGroup(rect);
    }

    this.sprayChunks.push(this.sprayChunkPoints);
  }
});
