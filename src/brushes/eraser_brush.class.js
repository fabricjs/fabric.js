(function () {
  fabric.util.object.extend(fabric.Canvas.prototype, {
    /**
     * Sets erasable option on current background objects
     * @param {boolean} value 
     * @returns 
     */
    setErasable: function (value) {
      var changed = false;
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
       * @param {string | fabric.Color} color color property of @argument source
       * @param {'setBackgroundColor'|'setOverlayColor'} setter
       */
      prepareCanvasColor: function (source, target, color, setter) {
        if (color && color instanceof fabric.Color && color.erasable) {
          target[setter](null);
        } else if (color) {
          var color = this.toColor(color);
          color.setAlpha(Math.pow(color.getAlpha(), 2));
          source[setter](color.toRgba());
          target[setter](color.toRgba());
        }
      },

      /**
       * If we want to erase background/overlay color we need to add an object to the canvas that will mock it
       * Replacing background/overlay image with a group consisting of the image and a filled rect will do the job
       * @param {fabric.Canvas} source
       * @param {fabric.Path} path
       * @param {'backgroundColor'|'overlayColor'} prop
       * @param {'setBackgroundColor'|'setOverlayColor'} setter
       */
      restoreCanvasColor: function (source, path, prop, setter) {
        var a = source[prop];
        if (a && a instanceof fabric.Color && a.erasable) {
          a.setAlpha(Math.sqrt(a.getAlpha()));
        }
        if (a && a.erasable) {
          return new fabric.Rect({
            width: source.width,
            height: source.height,
            fill: a
          });
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
       * @param {fabric.Image | undefined} image image property of source
       * @param {'setBackgroundImage'|'setOverlayImage'} setter
       */
      prepareCanvasImage: function (source, target, image, setter) {
        if (image && image.erasable) {
          target[setter](null);
        } else if (image && image.opacity < 1) {
          this.__opacity = image.opacity;
          image.set({ opacity: 0 });
        }
      },

      /**
       * Restore {prepareCanvasImage}
       * @param {fabric.Image} source
       * @param {fabric.Path} path
       * @param {'backgroundImage'|'overlayImage'} prop
       * @param {'setBackgroundImage'|'setOverlayImage'} setter
       */
      restoreCanvasImage: function (source, path, prop, setter) {
        var obj = source[prop];
        if (obj && obj.erasable) {
          this._addPathToObjectEraser(obj, path);
          return obj;
        } else if (obj && obj.opacity < 1) {
          obj.set({ opacity: this.__opacity });
        }
      },

      prepareCanvas: function (source, target, imgProp, imgSetter, colorProp, colorSetter) {
        var image = source[imgProp], color = source[colorProp];
        // in case canvas has been erased image object will be a fabric.Group([image, color]) so we restore state
        if (image && image.isType('group')) {
          image = image._objects[1];
          color = image._objects[0];
          source[imgSetter](image);
          source[colorSetter](color);
        }
        this.prepareCanvasImage(source, target, image, imgSetter);
        this.prepareCanvasColor(source, target, color, colorSetter);
      },

      /**
       * 
       * @param {fabric.Image} source
       * @param {fabric.Path} path
       * @param {'backgroundImage'|'overlayImage'} imgProp
       * @param {'setBackgroundImage'|'setOverlayImage'} imgSetter
       * @param {'backgroundColor'|'overlayColor'} colorProp
       * @param {'setBackgroundColor'|'setOverlayColor'} colorSetter
       */
      applyEraserToCanvas: function (canvas, path, imgProp, imgSetter, colorProp, colorSetter) {
        var image = this.restoreCanvasImage(canvas, path, imgProp, imgSetter),
          color = this.restoreCanvasColor(canvas, path, colorProp, colorSetter);
        if (image && color) {
          var mergedGroup = new fabric.Group([color, image]);
          canvas[imgSetter](mergedGroup);
          canvas[colorSetter](null);
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
      _prepareForRendering: function (_canvas) {
        var canvas = this.canvas;
        this.prepareCanvas(canvas, _canvas, 'backgroundImage', 'setBackgroundImage', 'backgroundColor', 'setBackgroundColor');
        this.prepareCanvas(canvas, _canvas, 'overlayImage', 'setOverlayImage', 'overlayColor', 'setOverlayColor');
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

        this.applyEraserToCanvas(canvas, path, 'backgroundImage', 'setBackgroundImage', 'backgroundColor', 'setBackgroundColor');
        this.applyEraserToCanvas(canvas, path, 'overlayImage', 'setOverlayImage', 'overlayColor', 'setOverlayColor');
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
   * It paints a rect and clips out the paths given to it so it can be used as a clip path for other objects
   * This makes it possible using unclosed paths for clipping, without this a clip path containing unclosed paths clips an object as if the path was closed and filled
   * 
   * @private
   * @class fabric.EraserPath
   * @extends fabric.Rect
   */
  fabric.EraserPath = fabric.util.createClass(fabric.Rect, fabric.Collection, {

    type: 'eraserPath',

    stateProperties: fabric.Object.prototype.stateProperties.concat('_objects'),

    cacheProperties: fabric.Object.prototype.cacheProperties.concat('_objects'),

    _objects: [],

    initialize: function (objects, options) {
      this.callSuper('initialize', Object.assign(options || {}, {
        originX: 'center',
        originY: 'center'
      }));
      this._objects = objects || [];
      this._objects.forEach(function (p) {
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
      this._objects.forEach(function (o) {
        ctx.save();
        var m = o.transformMatrix;
        m && ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        o.path.render(ctx);
        ctx.restore();
      })
    },

    addPath: function (path, transformMatrix) {
      path.set({ globalCompositeOperation: "destination-out" });
      this._objects.push({ path: path, transformMatrix: transformMatrix });
      this.dirty = true;
    },

    toObject: function (propertiesToInclude) {
      var _includeDefaultValues = this.includeDefaultValues;
      var objsToObject = this._objects.map(function (o) {
        var obj = o.path, transformMatrix = o.transformMatrix;
        var originalDefaults = obj.includeDefaultValues;
        obj.includeDefaultValues = _includeDefaultValues;
        var _obj = obj.toObject(propertiesToInclude);
        obj.includeDefaultValues = originalDefaults;
        return { path: _obj, transformMatrix: transformMatrix };
      });
      var obj = this.callSuper('toObject', propertiesToInclude);
      obj.objects = objsToObject;
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
    var objects = object.objects,
      options = fabric.util.object.clone(object, true);
    delete options.objects;
    /*
    if (typeof objects === 'string') {
      // it has to be an url or something went wrong.
      fabric.loadSVGFromURL(objects, function (elements) {
        var group = fabric.util.groupSVGElements(elements, object, objects);
        group.set(options);
        callback && callback(group);
      });
      return;
    }
    */
    fabric.util.enlivenObjects(
      objects.map(function (p) {
        return p.path;
      }),
      function (enlivenedObjects) {
        fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
          options.clipPath = enlivedClipPath[0];
          var _objects = objects.map(function (p, i) {
            return {
              path: enlivenedObjects[i],
              transformMatrix: p.transformMatrix
            };
          });
          callback && callback(new fabric.EraserPath(_objects, options));
        });
      }
    );
  };
})();
