(function () {
  fabric.util.object.extend(fabric.Canvas.prototype, {
    /**
     * Sets erasable option on current background objects
     * @param {boolean} value 
     * @returns 
     */
    setErasable(value) {
      let changed = false;
      if (this.backgroundImage) {
        changed = true;
        this.backgroundImage.erasable = value;
      }
      if (this.backgroundColor && this.backgroundColor instanceof fabric.Color) {
        changed = true;
        this.backgroundColor.erasable = value;
      }
      return changed;
    },
  });

  /**
   * EraserBrush class
   * See {@class fabric.EraserBrush#onMouseDown}
   * Supports selective erasing meaning that only erasable objects are affected by the eraser brush.
   * In order to support selective erasing all non erasable objects are rendered on the main ctx using a clone of the main canvas
   * while the entire canvas is rendered on the top ctx.
   * When erasing occurs, the path clips the top ctx and reveals the bottom ctx.
   * This achieves the desired effect of seeming to erase only erasable objects.
   * @class fabric.EraserBrush
   * @extends fabric.PencilBrush
   */
  fabric.EraserBrush = fabric.util.createClass(
    fabric.PencilBrush,
    /** @lends fabric.EraserBrush.prototype */ {
      type: "eraser",

      /**
       * Reserved for canvas background image
       */
      __opacity: 1,

      /**
       * @private
       * @param {string|fabric.Color} color 
       * @returns {fabric.Color}
       */
      toColor: function (color) {
        return color instanceof fabric.Color ? color : new fabric.Color(color);
      },

      /**
       * We need to handle 2 cases:
       * a. If the color is erasable we remove it from the bottom ctx so that when the top ctx is erased white space will be revealed
       * b. If the color isn't erasable we defer to the normal flow: rendering on both top and bottom ctx.
       * We transform opacity so it will appear the same to the user.
       * 
       * @param {fabric.Canvas} source
       * @param {fabric.Canvas} target
       * @param {'backgroundColor'|'overlayColor'} prop
       * @param {'setBackgroundColor'|'setOverlayColor'} setter
       */
      handleCanvasColor: function (source, target, prop, setter) {
        var a = source[prop];
        if (a && a instanceof fabric.Color && a.erasable) {
          target[setter](null);
        } else if (a) {
          var color = this.toColor(a);
          color.setAlpha(Math.pow(color.getAlpha(), 2));
          source[setter](color.toRgba());
          target[setter](color.toRgba());
        }
      },

      /**
       * If we want to erase background/overlay color we need to add an object to the canvas that will mock it
       * Replacing background/overlay image with a group consisting of the image and a filled rect will do the job
       * @param source {fabric.Canvas} source
       */
      restoreCanvasColor: function (source) {
        if (source && source instanceof fabric.Color && source.erasable) {
          source.setAlpha(Math.sqrt(source.getAlpha()));
        }
      },

      /**
       * We need to handle 2 cases:
       * a. If the image is erasable we remove it from the bottom ctx so that when the top ctx is erased white space will be revealed
       * b. If the image isn't erasable we defer to the normal flow: rendering on both top and bottom ctx. 
       * We set opacity to 0 to hide the top image so it won't affect appearance in case opacity of image is different than 1.
       * 
       * @param {fabric.Canvas} source 
       * @param {fabric.Canvas} target
       * @param {'backgroundImage'|'overlayImage'} prop 
       * @param {'setBackgroundImage'|'setOverlayImage'} setter
       */
      handleCanvasImage: function (source, target, prop, setter) {
        var obj = source[prop];
        if (obj && obj.erasable) {
          target[setter](null);
        } else if (obj && obj.opacity < 1) {
          this.__opacity = obj.opacity;
          obj.set({ opacity: 0 });
        }
      },

      /**
       * Restore {handleCanvasImage}
       * @param {fabric.Image} source
       * @param {fabric.Image} target
       * @param {'backgroundImage'|'overlayImage'} prop
       * @param {'setBackgroundImage'|'setOverlayImage'} setter
       */
      restoreCanvasImage: function (source, path, prop, setter) {
        var obj = source[prop];
        if (obj && obj.erasable) {
          this._addPathToObjectEraser(obj, path);
        } else if (obj && obj.opacity < 1) {
          obj.set({ opacity: this.__opacity });
        }
      },

      /**
       * @extends @class fabric.BaseBrush
       * @param {CanvasRenderingContext2D} ctx
       */
      _saveAndTransform: function (ctx) {
        this.callSuper("_saveAndTransform", ctx);
        ctx.globalCompositeOperation = "destination-out";
      },

      /**
       * 
       * @param {fabric.Point} pointer
       * @param {fabric.IEvent} options
       * @returns
       */
      onMouseDown: function (pointer, options) {
        if (!this.canvas._isMainEvent(options.e)) {
          return;
        }
        this._prepareForDrawing(pointer);

        var _this = this;
        this.canvas.clone(function (c) {
          _this._prepareForRendering(c);
        });
      },

      /**
       * @private
       * Prepare bottom ctx
       * Use a clone of the main canvas to render the non-erasable objects on the bottom context
       */
      _prepareForRendering(_canvas) {
        var canvas = this.canvas;
        this.handleCanvasImage(canvas, _canvas, 'backgroundImage', 'setBackgroundImage');
        this.handleCanvasImage(canvas, _canvas, 'overlayImage', 'setOverlayImage');
        this.handleCanvasColor(canvas, _canvas, 'backgroundColor', 'setBackgroundColor');
        this.handleCanvasColor(canvas, _canvas, 'overlayColor', 'setOverlayColor');
        _canvas.renderCanvas(
          canvas.getContext(),
          canvas.getObjects().filter(function (obj) {
            return !obj.erasable;
          })
        );
        this._render();
        _canvas.dispose();
      },

      /**
       * Restore top and bottom ctx after _finalizeAndAddPath is invoked
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
       * Adds path to existing clipPath of object
       * @private
       * @param {fabric.Object} obj
       * @param {fabric.Path} path
       */
      _addPathToObjectEraser: function (obj, path) {
        var clipObject;
        if (!obj.eraser) {
          clipObject = new fabric.EraserPath();
          clipObject.setParent(obj);
        } else {
          clipObject = obj.clipPath;
        }

        var transformMatrix = fabric.util.invertTransform(
          obj.calcTransformMatrix()
        );
        //fabric.util.applyTransformToObject(path, transformMatrix);
        clipObject.addPath(path, transformMatrix);

        obj.set({
          clipPath: clipObject,
          dirty: true,
          eraser: true
        });
      },

      /**
       * On mouseup after drawing the path on contextTop canvas
       * we use the points captured to create an new fabric path object
       * and add it to every intersected erasable object.
       */
      _finalizeAndAddPath: function () {
        var ctx = this.canvas.contextTop, canvas = this.canvas;
        ctx.closePath();
        if (this.decimate) {
          this._points = this.decimatePoints(this._points, this.decimate);
        }
        var pathData = this._points && this._points.length > 1 ? this.convertPointsToSVGPath(this._points).join("") : "M 0 0 Q 0 0 0 0 L 0 0";
        if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
          // do not create 0 width/height paths, as they are
          // rendered inconsistently across browsers
          // Firefox 4, for example, renders a dot,
          // whereas Chrome 10 renders nothing
          this.canvas.requestRenderAll();
          return;
        }

        var path = this.createPath(pathData);
        canvas.clearContext(canvas.contextTop);
        canvas.fire("before:path:created", { path: path });

        this.restoreCanvasImage(canvas, path, 'backgroundImage', 'setBackgroundImage');
        this.restoreCanvasImage(canvas, path, 'overlayImage', 'setOverlayImage');
        this.restoreCanvasColor(canvas, path, 'backgroundColor', 'setBackgroundColor');
        this.restoreCanvasColor(canvas, path, 'overlayColor', 'setOverlayColor');
        var _this = this;
        canvas.forEachObject(function (obj) {
          if (obj.erasable && obj.intersectsWithObject(path)) {
            _this._addPathToObjectEraser(obj, path);
          }
        });
        canvas.requestRenderAll();
        path.setCoords();
        this._resetShadow();

        // fire event 'path' created
        canvas.fire("path:created", { path: path });
      }
    }
  );

  /**
   * Used by @class fabric.EraserBrush
   * Can be used regardless of @class fabric.EraserBrush to create an inverted clip path made of strokes (=unclosed paths)
   * @private
   * @class fabric.EraserPath
   * @extends fabric.Rect
   */
  fabric.EraserPath = fabric.util.createClass(fabric.Rect, {

    type: 'eraserPath',

    stateProperties: fabric.Object.prototype.stateProperties.concat('_paths'),

    cacheProperties: fabric.Object.prototype.cacheProperties.concat('_paths'),

    _paths: [],

    initialize: function (paths, options) {
      this.callSuper('initialize', Object.assign(options || {}, {
        originX: 'center',
        originY: 'center'
      }));
      this._paths = paths || [];
      this._paths.forEach(function (p) {
        p.path.set({ globalCompositeOperation: "destination-out" });
      })
    },

    setParent: function (parent) {
      this.set({
        width: parent.width,
        height: parent.height,
        clipPath: parent.clipPath
      });
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
      this._paths.forEach(({ path, transformMatrix }) => {
        ctx.save();
        ctx.transform(transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3], transformMatrix[4], transformMatrix[5]);
        path.render(ctx);
        ctx.restore();
      })
    },

    addPath(path, transformMatrix) {
      path.set({ globalCompositeOperation: "destination-out" });
      this._paths.push({ path, transformMatrix });
      this.dirty = true;
    },

    toObject: function (propertiesToInclude) {
      var _includeDefaultValues = this.includeDefaultValues;
      var objsToObject = this._paths.map(function ({ path: obj, transformMatrix }) {
        var originalDefaults = obj.includeDefaultValues;
        obj.includeDefaultValues = _includeDefaultValues;
        var _obj = obj.toObject(propertiesToInclude);
        obj.includeDefaultValues = originalDefaults;
        return { path: _obj, transformMatrix };
      });
      var obj = this.callSuper('toObject', propertiesToInclude);
      obj.paths = objsToObject;
      return obj;
    },
  });

  /**
     * Returns {@link fabric.EraserPath} instance from an object representation
     * @static
     * @memberOf fabric.EraserPath
     * @param {Object} object Object to create an instance from
     * @param {Function} [callback] Callback to invoke when an fabric.EraserPath instance is created
     */
  fabric.EraserPath.fromObject = function (object, callback) {
    var paths = object.paths,
      options = fabric.util.object.clone(object, true);
    delete options.paths;
    /*
    if (typeof paths === 'string') {
      // it has to be an url or something went wrong.
      fabric.loadSVGFromURL(objects, function (elements) {
        var group = fabric.util.groupSVGElements(elements, object, objects);
        group.set(options);
        callback && callback(group);
      });
      return;
    }
    */
    fabric.util.enlivenObjects(paths.map(function (p) { return p.path }), function (enlivenedObjects) {
      fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
        options.clipPath = enlivedClipPath[0];
        var objects = paths.map(function (p, i) { return { path: enlivenedObjects[i], transformMatrix: p.transformMatrix } });
        callback && callback(new fabric.EraserPath(objects, options));
      });
    });
  };
})();
