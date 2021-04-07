(function () {
  /**
   * EraserBrush class
   * @class fabric.EraserBrush
   * @extends fabric.PencilBrush
   */
  fabric.EraserBrush = fabric.util.createClass(fabric.PencilBrush, /** @lends fabric.EraserBrush.prototype */ {

    type: 'eraser',

    /**
     * Get the context on which the erasing should occur
     * Uses different drawing context than PencilBrush to erase objects
     */
    getContext: function () {
      return this.canvas.getContext();
      //return this.canvas.contextTop;
    },

    /**
     * Use different drawing context to erase objects
     * @override @class fabric.BaseBrush
     */
    _setBrushStyles: function () {
      var ctx = this.getContext();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.width;
      ctx.lineCap = this.strokeLineCap;
      ctx.miterLimit = this.strokeMiterLimit;
      ctx.lineJoin = this.strokeLineJoin;
      if (fabric.StaticCanvas.supports('setLineDash')) {
        ctx.setLineDash(this.strokeDashArray || []);
      }
    },

    /**
     * @extends @class fabric.BaseBrush
     * @param {*} ctx 
     */
    _saveAndTransform: function (ctx) {
      this.callSuper('_saveAndTransform', ctx);
      ctx.globalCompositeOperation = 'destination-out';
    },

    /**
     * Use different drawing context to erase objects
     * @override @class fabric.BaseBrush
     */
    _setShadow: function () {
      if (!this.shadow) {
        return;
      }

      var canvas = this.canvas,
        shadow = this.shadow,
        ctx = this.getContext(),
        zoom = canvas.getZoom();
      if (canvas && canvas._isRetinaScaling()) {
        zoom *= fabric.devicePixelRatio;
      }

      ctx.shadowColor = shadow.color;
      ctx.shadowBlur = shadow.blur * zoom;
      ctx.shadowOffsetX = shadow.offsetX * zoom;
      ctx.shadowOffsetY = shadow.offsetY * zoom;
    },

    /**
     * Use different drawing context to erase objects
     * @override @class fabric.PencilBrush
     */
    onMouseMove: function (pointer, options) {
      if (!this.canvas._isMainEvent(options.e)) {
        return;
      }
      if (this._captureDrawingPath(pointer) && this._points.length > 1) {
        if (this.needsFullRender()) {
          // redraw curve
          // clear top canvas
          this.canvas.clearContext(this.canvas.contextTop);
          this._render();
        }
        else {
          var points = this._points, length = points.length, ctx = this.getContext();
          // draw the curve update
          this._saveAndTransform(ctx);
          if (this.oldEnd) {
            ctx.beginPath();
            ctx.moveTo(this.oldEnd.x, this.oldEnd.y);
          }
          this.oldEnd = this._drawSegment(ctx, points[length - 2], points[length - 1], true);
          ctx.stroke();
          ctx.restore();
        }
      }
    },

    /**
     * Use different drawing context to erase objects
     * @private
     * @param {Object} pointer Actual mouse position related to the canvas.
     */
    _prepareForDrawing: function (pointer) {

      var p = new fabric.Point(pointer.x, pointer.y);

      this._reset();
      this._addPoint(p);
      this.getContext().moveTo(p.x, p.y);
    },

    /**
     * Creates fabric.Path object to add on canvas
     * @param {String} pathData Path data
     * @return {fabric.Path} Path to add on canvas
     */
    createPath: function (pathData) {
      var path = this.callSuper('createPath', pathData);
      path.globalCompositeOperation = 'destination-out';
      path.inverted = true;
      path.selectable = false;
      path.evented = false;
      path.absolutePositioned = true;
      return path;
    },

    /**
     * Adds path to existing eraser paths on object
     * @param {fabric.Object} obj
     * @param {fabric.Path} path
     */
    _addPathToObjectEraser: function(obj, path) {
      var points = obj.eraser ? obj.eraser.path : [];
      var mergedEraserPaths = this.createPath(points.concat(path.path));
      var rect = new fabric.Rect({ top: 0, left: 0, width: this.canvas.width, height: this.canvas.height });
      var clipObject = new fabric.Group([rect, mergedEraserPaths], { absolutePositioned: true });
      clipObject.globalCompositeOperation = "destination-out";
      obj.set({
        clipPath: clipObject,
        inverted: true,
        dirty: true,
        eraser: mergedEraserPaths
      })
    },

    /**
     * On mouseup after drawing the path on contextTop canvas
     * we use the points captured to create an new fabric path object
     * and add it to the fabric canvas.
     */
    _finalizeAndAddPath: function () {

      var ctx = this.getContext();
      ctx.closePath();
      if (this.decimate) {
        this._points = this.decimatePoints(this._points, this.decimate);
      }
      var pathData = this.convertPointsToSVGPath(this._points).join('');
      if (pathData === 'M 0 0 Q 0 0 0 0 L 0 0') {
        // do not create 0 width/height paths, as they are
        // rendered inconsistently across browsers
        // Firefox 4, for example, renders a dot,
        // whereas Chrome 10 renders nothing
        this.canvas.requestRenderAll();
        return;
      }

      var path = this.createPath(pathData);
      //this.canvas.clearContext(this.canvas.contextTop);
      this.canvas.fire('before:path:created', { path: path });

      if (this.canvas.backgroundImage && this.canvas.backgroundImage.erasable) {
        this._addPathToObjectEraser(this.canvas.backgroundImage, path);
      }
      var _this = this;
      this.canvas.getObjects()
        .forEach(function (obj) {
          if (obj.erasable && obj.intersectsWithObject(path)) {
            _this._addPathToObjectEraser(obj, path);
          }
        });
      this.canvas.requestRenderAll();
      path.setCoords();
      this._resetShadow();

      // fire event 'path' created
      this.canvas.fire('path:created', { path: path });
    }
  });
})();
