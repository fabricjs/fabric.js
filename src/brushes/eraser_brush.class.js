(function () {
  var _proto = fabric.util.object.clone(fabric.StaticCanvas.prototype);
  fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    /**
     * See {@link fabric.EraserBrush#prepareCanvas}
     * @param {string} key 
     * @returns 
     */
    get: function (key) {
      var drawableKey = key;
      switch (key) {
        case "backgroundImage":
          return this[drawableKey] && this[drawableKey].isType('group') ?
            this[drawableKey].getObjects('image')[0] :
            _proto.get.call(this, key);
        case "backgroundColor":
          drawableKey = "backgroundImage";
          return this[drawableKey] && this[drawableKey].isType('group') ?
            this[drawableKey].getObjects('rect')[0] :
            _proto.get.call(this, key);
        case "overlayImage":
          return this[drawableKey] && this[drawableKey].isType('group') ?
            this[drawableKey].getObjects('image')[0] :
            _proto.get.call(this, key);
        case "overlayColor":
          drawableKey = "overlayImage";
          return this[drawableKey] && this[drawableKey].isType('group') ?
            this[drawableKey].getObjects('rect')[0] :
            _proto.get.call(this, key);
        default:
          return _proto.get.call(this, key);
      }
    },

    _shouldRenderOverlay: true,

    /**
     * See {@link fabric.EraserBrush#_render}
     * @param {CanvasRenderingContext2D} ctx 
     */
    _renderOverlay111: function (ctx) {
      if (this._shouldRenderOverlay) _proto._renderOverlay.call(this, ctx);
    }
  });

  /**
   * EraserBrush class
   * Supports selective erasing meaning that only erasable objects are affected by the eraser brush.
   * In order to support selective erasing all non erasable objects are rendered on the main/bottom ctx using a clone of the main canvas
   * while the entire canvas is rendered on the top ctx. Canvas bakground/overlay image/color is handled as well, see {@link fabric.EraserBrush#prepareCanvasForDrawingBottomLayer}.
   * When erasing occurs, the path clips the top ctx and reveals the bottom ctx.
   * This achieves the desired effect of seeming to erase only erasable objects.
   * After erasing is done the created path is added to all intersected objects' `clipPath` property.
   * 
   * @class fabric.EraserBrush
   * @extends fabric.PencilBrush
   */
  fabric.EraserBrush = fabric.util.createClass(
    fabric.PencilBrush,
    /** @lends fabric.EraserBrush.prototype */ {
      type: "eraser",

      limitedToCanvasSize: true,

      /**
       * Indicates that the ctx is ready and rendering can begin.
       * Used to prevent a race condition caused by {@link fabric.EraserBrush#onMouseMove} firing before {@link fabric.EraserBrush#onMouseDown} has completed
       * 
       * @private
       */
      _ready: false,

      /**
       * @private
       */
      _drawOverlayOnTop: false,

      /**
       * @private
       */
      _isErasing: false,

      initialize: function (canvas) {
        this.callSuper('initialize', canvas);
        this._renderBound = this._render.bind(this);
        this.render = this.render.bind(this);
        this._prepareCanvasForOriginalRendering = this._prepareCanvasForOriginalRendering.bind(this);
      },

      /**
       * @private
       * @param {Function} callback 
       * @returns 
       */
      forCanvasDrawables: function (callback) {
        var _this = this;
        callback.call(_this, 'background', 'backgroundImage', 'setBackgroundImage', 'backgroundColor', 'setBackgroundColor');
        callback.call(_this, 'overlay', 'overlayImage', 'setOverlayImage', 'overlayColor', 'setOverlayColor');
      },

      /**
       * In order to be able to clip out the canvas' overlay/background color
       * we group background/overlay image and color and assign the group to the canvas' image property
       * @param {fabric.Canvas} canvas
       */
      prepareCanvas: function (canvas) {
        this.forCanvasDrawables(
          function (drawable, imgProp, imgSetter, colorProp, colorSetter) {
            var image = canvas[imgProp], color = canvas[colorProp];
            if ((image || color) && (!image || !image.isType('group'))) {
              var mergedGroup = new fabric.Group([], {
                width: canvas.width,
                height: canvas.height,
                erasable: false
              });
              if (image) {
                mergedGroup.addWithUpdate(image);
                mergedGroup._image = image;
              }
              if (color) {
                color = new fabric.Rect({
                  width: canvas.width,
                  height: canvas.height,
                  fill: color,
                  erasable: typeof color === 'object' && color.erasable
                });
                mergedGroup.addWithUpdate(color);
                mergedGroup._color = color;
              }
              canvas[imgSetter](mergedGroup);
              canvas[colorSetter](null);
            }
          });
        this._ready = true;
      },

      hideObject(object) {
        if (object) {
          object._originalOpacity = object.opacity;
          object.set({ opacity: 0 });
        }
      },

      restoreObjectVisibility(object) {
        if (object && object._originalOpacity) {
          object.set({ opacity: object._originalOpacity });
          object._originalOpacity = undefined;
        }
      },

      /**
       * 
       * @param {'bottom' | 'top' | 'overlay'} layer
       */
      prepareCanvasBackgroundForLayer: function (layer) {
        if (layer === "overlay") return;
        var canvas = this.canvas;
        var image = canvas.get('backgroundImage');
        var color = canvas.get('backgroundColor');
        var erasablesOnLayer = layer === "top";
        if (image && image.erasable === !erasablesOnLayer) {
          this.hideObject(image);
        }
        if (color && color.erasable === !erasablesOnLayer) {
          this.hideObject(color);
        }
      },

      /**
       * 
       * @param {'bottom' | 'top' | 'overlay'} layer
       * @returns boolean render overlay above brush
       */
      prepareCanvasOverlayForLayer: function (layer) {
        var canvas = this.canvas;
        var image = canvas.get('overlayImage');
        var color = canvas.get('overlayColor');
        if (layer === "bottom") {
          this.hideObject(image);
          this.hideObject(color);
          return false;
        };
        var erasablesOnLayer = layer === "top";
        var renderOverlayOnTop = (image && !image.erasable) || (color && !color.erasable);
        if (image && image.erasable === !erasablesOnLayer) {
          this.hideObject(image);
        }
        if (color && color.erasable === !erasablesOnLayer) {
          this.hideObject(color);
        }
        return renderOverlayOnTop;
      },

      /**
       * 
       * @param {'bottom' | 'top' | 'overlay'} layer 
       * @returns boolean render overlay above brush
       */
      prepareCanvasForLayer: function (layer) {
        this.prepareCanvasBackgroundForLayer(layer);
        return this.prepareCanvasOverlayForLayer(layer);
      },

      restoreCanvasDrawables: function () {
        var canvas = this.canvas;
        this.restoreObjectVisibility(canvas.get('backgroundImage'));
        this.restoreObjectVisibility(canvas.get('backgroundColor'));
        this.restoreObjectVisibility(canvas.get('overlayImage'));
        this.restoreObjectVisibility(canvas.get('overlayColor'));
        canvas._shouldRenderOverlay = true;
      },

      renderBottomLayer: function () {
        var canvas = this.canvas;
        this.prepareCanvasForLayer('bottom');
        canvas.renderCanvas(
          canvas.getContext(),
          canvas.getObjects().filter(function (obj) {
            return !obj.erasable;
          })
        );
        this.restoreCanvasDrawables();
      },

      renderTopLayer: function () {
        var canvas = this.canvas;
        this._drawOverlayOnTop = this.prepareCanvasForLayer('top');
        canvas.renderCanvas(
          canvas.contextTop,
          canvas.getObjects()
        );
        this.callSuper('_render');
        this.restoreCanvasDrawables();
      },

      renderOverlay: function () {
        this.prepareCanvasForLayer('overlay');
        var canvas = this.canvas;
        var ctx = canvas.contextTop;
        this._saveAndTransform(ctx);
        canvas._renderOverlay(ctx);
        ctx.restore();
        this.restoreCanvasDrawables();
      },

      /**
       * @extends @class fabric.BaseBrush
       * @param {CanvasRenderingContext2D} ctx
       */
      _saveAndTransform: function (ctx) {
        this.callSuper("_saveAndTransform", ctx);
        ctx.globalCompositeOperation = "destination-out";
      },

      needsFullRender: function () {
        var needsFullRender = this._needsFullRenderOnce;
        this._needsFullRenderOnce = false;
        return this.callSuper("needsFullRender") || this._drawOverlayOnTop || needsFullRender;
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
        // capture coordinates immediately
        // this allows to draw dots (when movement never occurs)
        this._captureDrawingPath(pointer);

        this._isErasing = true;
        this.prepareCanvas(this.canvas);
        this._render();
      },

      _prepareCanvasForOriginalRendering: function () {
        if (this._isErasing) {
          //this.canvas._shouldRenderOverlay = !this._drawOverlayOnTop;
        }
      },

      /**
       *
       * Drawable logic is as follows:
       * For background drawables:
       * 1. erasable = true:
       *    we need to remove the drawable from the bottom ctx so when the brush is erasing it will clip the top ctx and reveal white space underneath
       * 2. erasable = false:
       *    we need to draw the drawable only on the bottom ctx so the brush won't affect it
       *
       * For overlay drawables:
       * Must draw on top ctx to be on top of visible canvas that is drawn on top ctx
       * 1. erasable = true:
       *    we need to draw the drawable on the top ctx as a normal object
       * 2. erasable = false:
       *    we need to draw the drawable on top of the brush, meaning we need to repaint for every stroke
       *
       * @param {fabric.Canvas} canvas
       */
      _render: function () {
        if (!this._ready) return;
        this.isRendering = 1;
        this.renderBottomLayer();
        this.renderTopLayer();
        this.renderOverlay();
        this.isRendering = 0;
      },

      render: function ({ ctx }) {
        /*this._isErasing*/
        /*
                if (ctx !== this.canvas.contextTop) {
                  if (this.isRendering) {
                    this.isRendering = fabric.util.requestAnimFrame(this._renderBound);
                  } else {
                    this._render();
                  }
                }
                */
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
       * Add the eraser path the the objects clip path
       * @param {fabric.Canvas} source
       * @param {fabric.Canvas} path
       */
      applyEraserToCanvas: function (path) {
        var canvas = this.canvas;
        this.forCanvasDrawables(
          function (drawable, imgProp, _, colorProp) {
            var sourceImage = canvas.get(imgProp);
            var sourceColor = canvas.get(colorProp);
            if (sourceImage && sourceImage.erasable) {
              this._addPathToObjectEraser(sourceImage, path);
            }
            if (sourceColor && sourceColor.erasable) {
              this._addPathToObjectEraser(sourceColor, path);
            }
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

        canvas.clearContext(canvas.contextTop);
        this.canvas.off('before:render', this._prepareCanvasForOriginalRendering);
        this.canvas.off('after:render', this.render);
        this._isErasing = false;

        var pathData = this._points && this._points.length > 1 ? this.convertPointsToSVGPath(this._points).join("") : "M 0 0 Q 0 0 0 0 L 0 0";
        if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
          // do not create 0 width/height paths, as they are
          // rendered inconsistently across browsers
          // Firefox 4, for example, renders a dot,
          // whereas Chrome 10 renders nothing
          canvas.requestRenderAll();
          return;
        }

        var path = this.createPath(pathData);
        canvas.fire("before:path:created", { path: path });

        this.applyEraserToCanvas(path);
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
   * EraserPath class
   * Used by {@link fabric.EraserBrush}
   * 
   * {@link fabric.EraserPath} is a workaround for clipping paths that are strokes and not fills.
   * Clipping is done with the fill of the clip path, so to enable clipping out paths by their stroke and achieving an eraser effect, 
   * {@link fabric.EraserPath} fills a rect where the object that it needs to clip is drawn.
   * Then it draws the paths drawn by {@link fabric.EraserBrush} onto the rect in `globalCompositionMode = "destination-out"`. 
   * This removes the paths from the drawn rect resulting is a rect that has been erased.
   * 
   * {@link fabric.EraserPath} is attached to it's owning object as a clip path. 
   * Basically it achieves what the `inverted` prop achieves, only for stroked objects.
   * 
   * Can be used regardless of {@link fabric.EraserBrush} to create an inverted clip path that contains strokes, unclosed paths or unfilled paths.
   * 
   * Without this workaround a clip path containing unclosed paths clips an object as if the path was closed and filled or disregards it.
   * 
   * It is possible to provide a clip path to this object, clipping out the drawn rect.
   * 
   * @private
   * @class fabric.EraserPath
   * @extends fabric.Rect
   */
  fabric.EraserPath = fabric.util.createClass(fabric.Rect, fabric.Collection, {

    type: 'eraserPath',

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

    /**
     * Used to set options when erasing
     * @param {fabric.Object} parent The object that owns this clip path
     */
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
