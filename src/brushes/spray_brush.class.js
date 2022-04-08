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
  bufferThreshold: 500,

  /**
   * Constructor
   * @param {fabric.Canvas} canvas
   * @return {fabric.SprayBrush} Instance of a spray brush
   */
  initialize: function(canvas) {
    this.canvas = canvas;
    this.sprayChunks = [];
    this.memo = {};
  },

  /**
   * create a group to contain some of the spray chunks, acting as a buffer
   * position group center at canvas 0,0 so we can add objects relative to group, reducing calculations to a minimum
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
   * layout once and disable future layouting by setting to `fixed`
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
    this.memo = {};
    this._buffer = this._createBufferingGroup();
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();

    var chunk = this.addSprayChunk(pointer);
    this.renderChunk(chunk);
  },

  /**
   * Invoked on mouse move
   * @param {Object} pointer
   */
  onMouseMove: function(pointer) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    var chunk = this.addSprayChunk(pointer);
    this.renderChunk(chunk);
  },

  /**
   * Invoked on mouse up
   */
  onMouseUp: function() {
    var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;
    var group = this._buffer;
    if (this._tempBuffer) {
      //  add last buffer to main buffer
      this._layoutBufferingGroup(this._tempBuffer);
      group.addRelative(this._tempBuffer);
    }
    this._layoutBufferingGroup(group);
    this.shadow && group.set('shadow', new fabric.Shadow(this.shadow));
    // fire events and add
    this.canvas.fire('before:path:created', { path: group });
    this.canvas.add(group);
    this.canvas.fire('path:created', { path: group });
    //  render
    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
    //  deallocate
    this._buffer = undefined;
    this._tempBuffer = undefined;
    this.memo = {};
  },

  /**
   * Render new chunk of spray brush
   */
  renderChunk: function(sprayChunk) {
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
      this.renderChunk(this.sprayChunks[i]);
    }
    ctx.restore();
  },

  /**
   * @param {Object} pointer
   */
  addSprayChunk: function(pointer) {
    var sprayChunkPoints = [];
    var i, x, y, key, width, radius = this.width / 2, r;

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
        // avoid creating duplicate rects at the same coordinates
        key = x + ',' + y;
        if (this.memo[key]) {
          continue;
        }
        else {
          this.memo[key] = true;
        }
      }

      var point = new fabric.Point(x, y);
      point.width = width;

      if (this.randomOpacity) {
        point.opacity = fabric.util.getRandomInt(0, 100) / 100;
      }

      sprayChunkPoints.push(point);
      r = point.width / 2;
      var rect = new fabric.Rect({
        width: point.width,
        height: point.width,
        left: point.x + r,
        top: point.y + r,
        originX: 'center',
        originY: 'center',
        fill: this.color,
        objectCaching: false,
        canvas: this.canvas
      });
      if (this._tempBuffer && this._tempBuffer.size() > this.bufferThreshold) {
        this._layoutBufferingGroup(this._tempBuffer);
        this._buffer.addRelative(this._tempBuffer);
        this._tempBuffer.renderCache();
        this._tempBuffer = undefined;
      }
      if (!this._tempBuffer) {
        this._tempBuffer = this._createBufferingGroup();
      }
      this._tempBuffer.addRelative(rect);
    }

    this.sprayChunks.push(sprayChunkPoints);
    return sprayChunkPoints;
  }
});
