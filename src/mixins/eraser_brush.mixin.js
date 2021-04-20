(function () {
  var _get = fabric.StaticCanvas.prototype.get;
  fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    /**
     * See {@link fabric.EraserBrush#prepareCanvas}
     * @param {string} key 
     * @returns 
     */
    get: function (key) {
      var drawableKey = key;
      switch (key) {
        case 'backgroundImage':
          return this[drawableKey] && this[drawableKey].isType('group') ?
            this[drawableKey].getObjects('image')[0] :
            _get.call(this, key);
        case 'backgroundColor':
          drawableKey = 'backgroundImage';
          return this[drawableKey] && this[drawableKey].isType('group') ?
            this[drawableKey].getObjects('rect')[0] :
            _get.call(this, key);
        case 'overlayImage':
          return this[drawableKey] && this[drawableKey].isType('group') ?
            this[drawableKey].getObjects('image')[0] :
            _get.call(this, key);
        case 'overlayColor':
          drawableKey = 'overlayImage';
          return this[drawableKey] && this[drawableKey].isType('group') ?
            this[drawableKey].getObjects('rect')[0] :
            _get.call(this, key);
        default:
          return _get.call(this, key);
      }
    }
  });

  var toObject = fabric.Object.prototype.toObject;
  fabric.util.object.extend(fabric.Object.prototype, {
    /**
     * Indicates whether this object can be erased by {@link fabric.EraserBrush}
     * @type boolean
     * @default true
     */
    erasable: true,

    /**
     * 
     * @returns fabric.EraserPath | null
     */
    getEraser: function () {
      return this.clipPath && this.clipPath.isType('eraserPath') ? this.clipPath : null;
    },

    /**
     * Returns an object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function (additionalProperties) {
      return toObject.call(this, ['erasable'].concat(additionalProperties));
    }
  });

  fabric.util.object.extend(fabric.Canvas.prototype, {
    /**
     * Used by {@link #renderAll}
     * @returns boolean
     */
    isErasing: function () {
      return (
        this.isDrawingMode &&
        this.freeDrawingBrush &&
        this.freeDrawingBrush.type === 'eraser' &&
        this.freeDrawingBrush._isErasing
      );
    },

    /**
     * While erasing, the brush is in charge of rendering the canvas
     * It uses both layers to achieve diserd erasing effect
     * 
     * @returns fabric.Canvas
     */
    renderAll: function () {
      if (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode) {
        this.clearContext(this.contextTop);
        this.contextTopDirty = false;
      }
      // while erasing the brush is in charge of rendering the canvas so we return
      if (this.isErasing()) {
        this.freeDrawingBrush._render();
        return;
      }
      if (this.hasLostContext) {
        this.renderTopLayer(this.contextTop);
      }
      var canvasToDrawOn = this.contextContainer;
      this.renderCanvas(canvasToDrawOn, this._chooseObjectsToRender());
      return this;
    }
  });


  /**
   * EraserBrush class
   * Supports selective erasing meaning that only erasable objects are affected by the eraser brush.
   * In order to support selective erasing all non erasable objects are rendered on the main/bottom ctx
   * while the entire canvas is rendered on the top ctx. 
   * Canvas bakground/overlay image/color are handled as well.
   * When erasing occurs, the path clips the top ctx and reveals the bottom ctx.
   * This achieves the desired effect of seeming to erase only erasable objects.
   * After erasing is done the created path is added to all intersected objects' `clipPath` property.
   * 
   * 
   * @class fabric.EraserBrush
   * @extends fabric.PencilBrush
   */
  fabric.EraserBrush = fabric.util.createClass(
    fabric.PencilBrush,
    /** @lends fabric.EraserBrush.prototype */ {
      type: 'eraser',

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
      },

      /**
       * @private
       * @param {Function} callback 
       * @returns 
       */
      forCanvasDrawables: function (callback) {
        var _this = this;
        callback.call(
          _this,
          'background',
          'backgroundImage',
          'setBackgroundImage',
          'backgroundColor',
          'setBackgroundColor'
        );
        callback.call(
          _this,
          'overlay',
          'overlayImage',
          'setOverlayImage',
          'overlayColor',
          'setOverlayColor'
        );
      },

      /**
       * In order to be able to clip out the canvas' overlay/background color
       * we group background/overlay image and color and assign the group to the canvas' appropriate image property
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

      /**
       * Used to hide a drawable from the rendering process
       * @param {fabric.Object} object 
       */
      hideObject: function (object) {
        if (object) {
          object._originalOpacity = object.opacity;
          object.set({ opacity: 0 });
        }
      },

      /**
       * Restores hiding an object 
       * {@link favric.EraserBrush#hideObject}
       * @param {fabric.Object} object
       */
      restoreObjectVisibility: function (object) {
        if (object && object._originalOpacity) {
          object.set({ opacity: object._originalOpacity });
          object._originalOpacity = undefined;
        }
      },

      /**
       * Drawing Logic For background drawables: (`backgroundImage`, `backgroundColor`)
       * 1. if erasable = true:
       *    we need to hide the drawable on the bottom ctx so when the brush is erasing it will clip the top ctx and reveal white space underneath
       * 2. if erasable = false:
       *    we need to draw the drawable only on the bottom ctx so the brush won't affect it
       * @param {'bottom' | 'top' | 'overlay'} layer
       */
      prepareCanvasBackgroundForLayer: function (layer) {
        if (layer === 'overlay') {
          return;
        }
        var canvas = this.canvas;
        var image = canvas.get('backgroundImage');
        var color = canvas.get('backgroundColor');
        var erasablesOnLayer = layer === 'top';
        if (image && image.erasable === !erasablesOnLayer) {
          this.hideObject(image);
        }
        if (color && color.erasable === !erasablesOnLayer) {
          this.hideObject(color);
        }
      },

      /**
       * Drawing Logic For overlay drawables (`overlayImage`, `overlayColor`)
       * We must draw on top ctx to be on top of visible canvas
       * 1. if erasable = true:
       *    we need to draw the drawable on the top ctx as a normal object
       * 2. if erasable = false:
       *    we need to draw the drawable on top of the brush,
       *    this means we need to repaint for every stroke
       * 
       * @param {'bottom' | 'top' | 'overlay'} layer
       * @returns boolean render overlay above brush
       */
      prepareCanvasOverlayForLayer: function (layer) {
        var canvas = this.canvas;
        var image = canvas.get('overlayImage');
        var color = canvas.get('overlayColor');
        if (layer === 'bottom') {
          this.hideObject(image);
          this.hideObject(color);
          return false;
        };
        var erasablesOnLayer = layer === 'top';
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
       * @private
       */
      restoreCanvasDrawables: function () {
        var canvas = this.canvas;
        this.restoreObjectVisibility(canvas.get('backgroundImage'));
        this.restoreObjectVisibility(canvas.get('backgroundColor'));
        this.restoreObjectVisibility(canvas.get('overlayImage'));
        this.restoreObjectVisibility(canvas.get('overlayColor'));
      },

      /**
       * @private 
       * This is designed to support erasing a group with both erasable and non-erasable objects.
       * Iterates over collections to allow nested selective erasing.
       * Used by {@link fabric.EraserBrush#prepareCanvasObjectsForLayer} 
       * to prepare the bottom layer by hiding erasable nested objects
       * 
       * @param {fabric.Collection} collection 
       */
      prepareCollectionTraversal(collection) {
        var _this = this;
        collection.forEachObject(function (obj) {
          if (obj.forEachObject) {
            _this.prepareCollectionTraversal(obj);
          } else {
            if (obj.erasable) {
              _this.hideObject(obj);
            }
          }
        });
      },

      /**
       * @private
       * Used by {@link fabric.EraserBrush#prepareCanvasObjectsForLayer} 
       * to reverse the action of {@link fabric.EraserBrush#prepareCollectionTraversal}
       * 
       * @param {fabric.Collection} collection
       */
      restoreCollectionTraversal(collection) {
        var _this = this;
        collection.forEachObject(function (obj) {
          if (obj.forEachObject) {
            _this.restoreCollectionTraversal(obj);
          } else {
            _this.restoreObjectVisibility(obj);
          }
        });
      },

      /**
       * @private
       * This is designed to support erasing a group with both erasable and non-erasable objects.
       * 
       * @param {'bottom' | 'top' | 'overlay'} layer
       */
      prepareCanvasObjectsForLayer: function (layer) {
        if (layer !== 'bottom') return;
        this.prepareCollectionTraversal(this.canvas);
      },

      /**
       * @private
       * @param {'bottom' | 'top' | 'overlay'} layer
       */
      restoreCanvasObjectsFromLayer: function (layer) {
        if (layer !== 'bottom') return;
        this.restoreCollectionTraversal(this.canvas);
      },

      /**
       * @private
       * @param {'bottom' | 'top' | 'overlay'} layer 
       * @returns boolean render overlay above brush
       */
      prepareCanvasForLayer: function (layer) {
        this.prepareCanvasBackgroundForLayer(layer);
        this.prepareCanvasObjectsForLayer(layer);
        return this.prepareCanvasOverlayForLayer(layer);
      },

      /**
      * @private
      * @param {'bottom' | 'top' | 'overlay'} layer
      */
      restoreCanvasFromLayer: function (layer) {
        this.restoreCanvasDrawables();
        this.restoreCanvasObjectsFromLayer(layer);
      },

      /**
       * Render all non-erasable objects on bottom layer with the exception of overlays to avoid being clipped by the brush.
       * Groups are rendered for nested selective erasing, non-erasable objects are visible while erasable objects are not.
       */
      renderBottomLayer: function () {
        var canvas = this.canvas;
        this.prepareCanvasForLayer('bottom');
        canvas.renderCanvas(
          canvas.getContext(),
          canvas.getObjects().filter(function (obj) {
            return !obj.erasable || obj.isType('group');
          })
        );
        this.restoreCanvasFromLayer('bottom');
      },

      /**
       * 1. Render all objects on top layer, erasable and non-erasable
       *    This is important for cases such as overlapping objects, the background object erasable and the foreground object not erasable.
       * 2. Render the brush
       */
      renderTopLayer: function () {
        var canvas = this.canvas;
        this._drawOverlayOnTop = this.prepareCanvasForLayer('top');
        canvas.renderCanvas(
          canvas.contextTop,
          canvas.getObjects()
        );
        this.callSuper('_render');
        this.restoreCanvasFromLayer('top');
      },

      /**
       * Render all non-erasable overlays on top of the brush so that they won't get erased
       */
      renderOverlay: function () {
        this.prepareCanvasForLayer('overlay');
        var canvas = this.canvas;
        var ctx = canvas.contextTop;
        this._saveAndTransform(ctx);
        canvas._renderOverlay(ctx);
        ctx.restore();
        this.restoreCanvasFromLayer('overlay');
      },

      /**
       * @extends @class fabric.BaseBrush
       * @param {CanvasRenderingContext2D} ctx
       */
      _saveAndTransform: function (ctx) {
        this.callSuper('_saveAndTransform', ctx);
        ctx.globalCompositeOperation = 'destination-out';
      },

      /**
       * We indicate {@link fabric.PencilBrush} to repaint itself if necessary
       * @returns 
       */
      needsFullRender: function () {
        return this.callSuper('needsFullRender') || this._drawOverlayOnTop;
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
        this.canvas.fire('erasing:start');
        this.prepareCanvas(this.canvas);
        this._render();
      },

      /**
       * Rendering is done in 4 steps:
       * 1. Draw all non-erasable objects on bottom ctx with the exception of overlays {@link fabric.EraserBrush#renderBottomLayer}
       * 2. Draw all objects on top ctx including erasable drawables {@link fabric.EraserBrush#renderTopLayer}
       * 3. Draw eraser {@link fabric.PencilBrush#_render} at {@link fabric.EraserBrush#renderTopLayer}
       * 4. Draw non-erasable overlays {@link fabric.EraserBrush#renderOverlay}
       * 
       * @param {fabric.Canvas} canvas
       */
      _render: function () {
        if (!this._ready) {
          return;
        }
        this.isRendering = 1;
        this.renderBottomLayer();
        this.renderTopLayer();
        this.renderOverlay();
        this.isRendering = 0;
      },

      /**
       * @public
       */
      render: function () {
        if (this._isErasing) {
          if (this.isRendering) {
            this.isRendering = fabric.util.requestAnimFrame(this._renderBound);
          } else {
            this._render();
          }
          return true;
        }
        return false;
      },

      /**
       * Adds path to existing clipPath of object
       * 
       * @todo fix path transform to be applied on it up front instead of by {@link EraserPath}
       * 
       * @param {fabric.Object} obj
       * @param {fabric.Path} path
       */
      _addPathToObjectEraser: function (obj, path) {
        var clipObject;
        var _this = this;
        //  object is collection, i.e group
        if (obj.forEachObject) {
          obj.forEachObject(function (_obj) {
            if (_obj.erasable) {
              _this._addPathToObjectEraser(_obj, path);
            }
          });
          return;
        }
        if (!obj.getEraser()) {
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
        });
      },

      /**
       * Add the eraser path to canvas drawables' clip paths
       * 
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

        // clear
        canvas.clearContext(canvas.contextTop);
        this._isErasing = false;

        var pathData = this._points && this._points.length > 1 ?
          this.convertPointsToSVGPath(this._points).join('') :
          'M 0 0 Q 0 0 0 0 L 0 0';
        if (pathData === 'M 0 0 Q 0 0 0 0 L 0 0') {
          canvas.fire('erasing:end');
          // do not create 0 width/height paths, as they are
          // rendered inconsistently across browsers
          // Firefox 4, for example, renders a dot,
          // whereas Chrome 10 renders nothing
          canvas.requestRenderAll();
          return;
        }

        var path = this.createPath(pathData);
        canvas.fire('before:path:created', { path: path });

        // finalize erasing
        this.applyEraserToCanvas(path);
        var _this = this;
        canvas.forEachObject(function (obj) {
          if (obj.erasable && obj.intersectsWithObject(path)) {
            _this._addPathToObjectEraser(obj, path);
          }
        });

        canvas.fire('erasing:end');

        canvas.requestRenderAll();
        path.setCoords();
        this._resetShadow();

        // fire event 'path' created
        canvas.fire('path:created', { path: path });
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
   * Then it draws the paths drawn by {@link fabric.EraserBrush} onto the rect in `globalCompositionMode = 'destination-out'`. 
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
        p.path.set({ globalCompositeOperation: 'destination-out' });
      });
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
      });
    },

    addPath: function (path, transformMatrix) {
      path.set({ globalCompositeOperation: 'destination-out' });
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
