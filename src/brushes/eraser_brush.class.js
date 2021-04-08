(function () {
  var ClipPathGroup = fabric.util.createClass(fabric.Group, {
    _transformMatrix: null,

    initialize: function (objects, transformMatrix, options) {
      this.callSuper("initialize", objects, options);
      this._transformMatrix = transformMatrix;
    },

    transform: function (ctx) {
      var m = this._transformMatrix;
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      this.callSuper("transform", ctx);
    }
  });

  /**
   * EraserBrush class
   * @class fabric.EraserBrush
   * @extends fabric.PencilBrush
   */
  fabric.EraserBrush = fabric.util.createClass(
    fabric.PencilBrush,
    /** @lends fabric.EraserBrush.prototype */ {
      type: "eraser",

      /**
       * @extends @class fabric.BaseBrush
       * @param {CanvasRenderingContext2D} ctx
       */
      _saveAndTransform: function (ctx) {
        this.callSuper("_saveAndTransform", ctx);
        ctx.globalCompositeOperation = "destination-out";
      },

      /**
       * Supports selective erasing: Only erasable objects will be visibly affected by the eraser brush.
       * In order to support selective erasing all non erasable objects are rendered on the main ctx
       * while the entire canvas is rendered on the top ctx.
       * When erasing occurs, the path clips the top ctx and reveals the main ctx.
       * This achieves the desired effect of seeming to erase only erasable objects.
       * @param {fabric.Point} pointer
       * @param {fabric.IEvent} options
       * @returns
       */
      onMouseDown: function (pointer, options) {
        if (!this.canvas._isMainEvent(options.e)) {
          return;
        }
        this.canvas.clone((c) => {
          if (c.backgroundImage && c.backgroundImage.erasable) {
            c.setBackgroundImage(null);
          }
          if (
            c.backgroundColor &&
            c.backgroundColor instanceof fabric.Object &&
            c.erasable
          ) {
            c.setBackgroundColor(null);
          }
          c.renderCanvas(
            this.canvas.getContext(),
            this.canvas.getObjects().filter(function (obj) {
              return !obj.erasable;
            })
          );
          c.dispose();
          this.callSuper("onMouseDown", pointer, options);
        });
      },

      /**
       * Restore ctx after _finalizeAndAddPath is invoked
       * @param {fabric.Point} pointer
       * @param {fabric.IEvent} options
       * @returns
       */
      onMouseUp: function (pointer, options) {
        var retVal = this.callSuper("onMouseUp", pointer, options);
        this.canvas.renderAll();
        return retVal;
      },

      _render: function () {
        this.canvas.renderCanvas(
          this.canvas.contextTop,
          this.canvas.getObjects()
        );
        this.callSuper("_render");
      },

      /**
       * Creates fabric.Path object to add on canvas
       * @param {String} pathData Path data
       * @return {fabric.Path} Path to add on canvas
       */
      createPath: function (pathData) {
        var path = this.callSuper("createPath", pathData);
        path.set({
          globalCompositeOperation: "destination-out",
          selectable: false,
          evented: false
        });
        return path;
      },

      /**
       * Adds path to existing eraser paths on object
       * @private
       * @param {fabric.Object} obj
       * @param {fabric.Path} path
       */
      _addPathToObjectEraser: function (obj, path) {
        var points = obj.eraser ? obj.eraser.path : [];
        var mergedEraserPaths = this.createPath(points.concat(path.path));
        var rect = new fabric.Rect({
          top: 0,
          left: 0,
          width: this.canvas.width,
          height: this.canvas.height
        });
        var transformMatrix = fabric.util.invertTransform(
          obj.calcTransformMatrix()
        );
        var clipObject = new ClipPathGroup(
          [rect, mergedEraserPaths],
          transformMatrix,
          { globalCompositeOperation: "destination-out" }
        );
        obj.set({
          clipPath: clipObject,
          inverted: true,
          dirty: true,
          eraser: mergedEraserPaths
        });
      },

      /**
       * On mouseup after drawing the path on contextTop canvas
       * we use the points captured to create an new fabric path object
       * and add it to every intersected erasable object.
       */
      _finalizeAndAddPath: function () {
        var ctx = this.canvas.contextTop;
        ctx.closePath();
        if (this.decimate) {
          this._points = this.decimatePoints(this._points, this.decimate);
        }
        var pathData = this.convertPointsToSVGPath(this._points).join("");
        if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
          // do not create 0 width/height paths, as they are
          // rendered inconsistently across browsers
          // Firefox 4, for example, renders a dot,
          // whereas Chrome 10 renders nothing
          this.canvas.requestRenderAll();
          return;
        }

        var path = this.createPath(pathData);
        this.canvas.clearContext(this.canvas.contextTop);
        this.canvas.fire("before:path:created", { path: path });

        if (
          this.canvas.erasable ||
          (this.canvas.backgroundImage && this.canvas.backgroundImage.erasable)
        ) {
          this._addPathToObjectEraser(this.canvas.backgroundImage, path);
        }
        if (
          this.canvas.erasable ||
          (this.canvas.backgroundColor &&
            this.canvas.backgroundColor instanceof fabric.Object &&
            this.canvas.backgroundColor.erasable)
        ) {
          this._addPathToObjectEraser(this.canvas.backgroundColor, path);
        }
        var _this = this;
        this.canvas.forEachObject(function (obj) {
          if (obj.erasable && obj.intersectsWithObject(path)) {
            _this._addPathToObjectEraser(obj, path);
          }
        });
        this.canvas.requestRenderAll();
        path.setCoords();
        this._resetShadow();

        // fire event 'path' created
        this.canvas.fire("path:created", { path: path });
      }
    }
  );
})();
