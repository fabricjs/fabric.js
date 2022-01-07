(function () {
  /** ERASER_START */
  var __set = fabric.Object.prototype._set;
  var _render = fabric.Object.prototype.render;
  var _toObject = fabric.Object.prototype.toObject;
  var __createBaseSVGMarkup = fabric.Object.prototype._createBaseSVGMarkup;
  /**
   * @fires erasing:end
   */
  fabric.util.object.extend(fabric.Object.prototype, {
    /**
     * Indicates whether this object can be erased by {@link fabric.EraserBrush}
     * The `deep` option introduces fine grained control over a group's `erasable` property.
     * When set to `deep` the eraser will erase nested objects if they are erasable, leaving the group and the other objects untouched.
     * When set to `true` the eraser will erase the entire group. Once the group changes the eraser is propagated to its children for proper functionality.
     * When set to `false` the eraser will leave all objects including the group untouched.
     * @tutorial {@link http://fabricjs.com/erasing#erasable_property}
     * @type boolean | 'deep'
     * @default true
     */
    erasable: true,

    /**
     * @public
     * @returns {fabric.Group | undefined}
     */
    getEraser: function () {
      return this.clipPath && this.clipPath.eraser ? this.clipPath : undefined;
    },

    /**
     * @public
     * Get the object's actual clip path regardless of clipping done by erasing
     * @returns {fabric.Object | undefined}
     */
    getClipPath: function () {
      var eraser = this.getEraser();
      return eraser ? eraser._objects[0].clipPath : this.clipPath;
    },

    /**
     * @public
     * Set the object's actual clip path regardless of clipping done by erasing
     * @param {fabric.Object} [clipPath]
     */
    setClipPath: function (clipPath) {
      var eraser = this.getEraser();
      var target = eraser ? eraser._objects[0] : this;
      target.set('clipPath', clipPath);
      this.set('dirty', true);
    },

    /**
     * Updates eraser size and position to match object's size
     * @private
     * @param {Object} [dimensions] uses object's dimensions if unspecified
     * @param {number} [dimensions.width]
     * @param {number} [dimensions.height]
     * @param {boolean} [center=false] postion the eraser relative to object's center or it's top left corner
     */
    _updateEraserDimensions: function (dimensions, center) {
      var eraser = this.getEraser();
      if (eraser) {
        var rect = eraser._objects[0];
        var eraserSize = { width: rect.width, height: rect.height };
        var size = this._getNonTransformedDimensions();
        var newSize = fabric.util.object.extend({ width: size.x, height: size.y }, dimensions);
        if (eraserSize.width === newSize.width && eraserSize.height === newSize.height) {
          return;
        }
        var offset = new fabric.Point((eraserSize.width - newSize.width) / 2, (eraserSize.height - newSize.height) / 2);
        eraser.set(newSize);
        eraser.setPositionByOrigin(new fabric.Point(0, 0), 'center', 'center');
        rect.set(newSize);
        eraser.set('dirty', true);
        if (!center) {
          eraser.getObjects('path').forEach(function (path) {
            path.setPositionByOrigin(path.getCenterPoint().add(offset), 'center', 'center');
          });
        }
        this.setCoords();
      }
    },

    _set: function (key, value) {
      __set.call(this, key, value);
      if (key === 'width' || key === 'height') {
        this._updateEraserDimensions();
      }
      return this;
    },

    render: function (ctx) {
      this._updateEraserDimensions();
      _render.call(this, ctx);
    },

    /**
     * Returns an object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function (additionalProperties) {
      return _toObject.call(this, ['erasable'].concat(additionalProperties));
    },

    /**
     * use <mask> to achieve erasing for svg
     * credit: https://travishorn.com/removing-parts-of-shapes-in-svg-b539a89e5649
     * @todo support inverted erasing
     * @param {Function} reviver
     * @returns {string} markup
     */
    eraserToSVG: function (options) {
      var eraser = this.getEraser();
      if (eraser) {
        var fill = eraser._objects[0].fill;
        eraser._objects[0].fill = 'white';
        eraser.clipPathId = 'CLIPPATH_' + fabric.Object.__uid++;
        var commons = [
          'id="' + eraser.clipPathId + '"',
          /*options.additionalTransform ? ' transform="' + options.additionalTransform + '" ' : ''*/
        ].join(' ');
        var objectMarkup = ['<defs>', '<mask ' + commons + ' >', eraser.toSVG(options.reviver), '</mask>', '</defs>'];
        eraser._objects[0].fill = fill;
        return objectMarkup.join('\n');
      }
      return '';
    },

    /**
     * use <mask> to achieve erasing for svg, override <clipPath>
     * @param {string[]} objectMarkup
     * @param {Object} options
     * @returns
     */
    _createBaseSVGMarkup: function (objectMarkup, options) {
      var eraser = this.getEraser();
      if (eraser) {
        var eraserMarkup = this.eraserToSVG(options);
        this.clipPath = null;
        var markup = __createBaseSVGMarkup.call(this, objectMarkup, options);
        this.clipPath = eraser;
        return [
          eraserMarkup,
          markup.replace('>', 'mask="url(#' + eraser.clipPathId + ')" >')
        ].join('\n');
      }
      else {
        return __createBaseSVGMarkup.call(this, objectMarkup, options);
      }
    }
  });

  var __restoreObjectsState = fabric.Group.prototype._restoreObjectsState;
  var _groupToObject = fabric.Group.prototype.toObject;
  var __getBounds = fabric.Group.prototype._getBounds;
  fabric.util.object.extend(fabric.Group.prototype, {

    /**
     * If group is an eraser then dimensions should not change when paths are added or removed and should remain the size of the base rect
     * @private
     */
    _getBounds: function (aX, aY, onlyWidthHeight) {
      if (this.eraser) {
        this.width = this._objects[0].width;
        this.height = this._objects[0].height;
        return;
      }
      __getBounds.call(this, aX, aY, onlyWidthHeight);
    },

    /**
     * @private
     * @param {fabric.Path} path
     */
    _addEraserPathToObjects: function (path) {
      this._objects.forEach(function (object) {
        fabric.EraserBrush.prototype._addPathToObjectEraser.call(
          fabric.EraserBrush.prototype,
          object,
          path
        );
      });
    },

    /**
     * Applies the group's eraser to its objects
     * @tutorial {@link http://fabricjs.com/erasing#erasable_property}
     */
    applyEraserToObjects: function () {
      var _this = this;
      if (this.getEraser()) {
        var transform = _this.calcTransformMatrix();
        _this.getEraser().clone(function (eraser) {
          var clipPath = eraser._objects[0].clipPath;
          _this.clipPath = clipPath ? clipPath : undefined;
          eraser.getObjects('path')
            .forEach(function (path) {
              //  first we transform the path from the group's coordinate system to the canvas'
              var originalTransform = fabric.util.multiplyTransformMatrices(
                transform,
                path.calcTransformMatrix()
              );
              fabric.util.applyTransformToObject(path, originalTransform);
              if (clipPath) {
                clipPath.clone(function (_clipPath) {
                  fabric.EraserBrush.prototype.applyClipPathToPath.call(
                    fabric.EraserBrush.prototype,
                    path,
                    _clipPath,
                    transform
                  );
                  _this._addEraserPathToObjects(path);
                });
              }
              else {
                _this._addEraserPathToObjects(path);
              }
            });
        });
      }
    },

    /**
     * Propagate the group's eraser to its objects, crucial for proper functionality of the eraser within the group and nested objects.
     * @private
     */
    _restoreObjectsState: function () {
      this.erasable === true && this.applyEraserToObjects();
      return __restoreObjectsState.call(this);
    },

    /**
     * Returns an object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function (additionalProperties) {
      return _groupToObject.call(this, ['eraser'].concat(additionalProperties));
    }
  });

  var __renderOverlay = fabric.Canvas.prototype._renderOverlay;
  /**
   * @fires erasing:start
   * @fires erasing:end
   */
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
     * While erasing the brush clips out the erasing path from canvas
     * so we need to render it on top of canvas every render
     * @param {CanvasRenderingContext2D} ctx
     */
    _renderOverlay: function (ctx) {
      __renderOverlay.call(this, ctx);
      if (this.isErasing() && !this.freeDrawingBrush.inverted) {
        this.freeDrawingBrush._render();
      }
    }
  });

  /**
   * EraserBrush class
   * Supports selective erasing meaning that only erasable objects are affected by the eraser brush.
   * Supports **inverted** erasing meaning that the brush can "undo" erasing.
   *
   * In order to support selective erasing, the brush clips the entire canvas
   * and then draws all non-erasable objects over the erased path using a pattern brush.
   * If brush is **inverted** there is no need to clip canvas. The brush draws all erasable objects without their eraser.
   * This achieves the desired effect of seeming to erase or unerase only erasable objects.
   * After erasing is done the created path is added to all intersected objects' `clipPath` property.
   *
   * @tutorial {@link http://fabricjs.com/erasing}
   * @class fabric.EraserBrush
   * @extends fabric.PencilBrush
   */
  fabric.EraserBrush = fabric.util.createClass(
    fabric.PencilBrush,
    /** @lends fabric.EraserBrush.prototype */ {
      type: 'eraser',

      /**
       * When set to `true` the brush will create a visual effect of undoing erasing
       */
      inverted: false,

      /**
       * @private
       */
      _drawOverlayOnTop: false,

      /**
       * @private
       */
      _isErasing: false,

      /**
       *
       * @private
       * @param {fabric.Object} object
       * @returns boolean
       */
      _isErasable: function (object) {
        return object.erasable !== false;
      },

      /**
       * @private
       * This is designed to support erasing a collection with both erasable and non-erasable objects.
       * Iterates over collections to allow nested selective erasing.
       * Prepares the pattern brush that will draw on the top context to achieve the desired visual effect.
       * If brush is **NOT** inverted render all non-erasable objects.
       * If brush is inverted render all erasable objects with their clip path inverted.
       * This will render the erased parts as if they were not erased.
       *
       * @param {fabric.Collection} collection
       */
      _prepareCollectionTraversal: function (collection, ctx) {
        collection.forEachObject(function (obj) {
          if (obj.forEachObject && obj.erasable === 'deep') {
            this._prepareCollectionTraversal(obj, ctx);
          }
          else if (!obj.erasable && !this.inverted) {
            obj.render(ctx);
          }
          else if (obj.erasable && this.inverted) {
            var eraser = obj.getEraser();
            if (eraser) {
              eraser.inverted = true;
              obj.dirty = true;
              obj.render(ctx);
              eraser.inverted = false;
              obj.dirty = true;
            }
          }
        }, this);
      },

      /**
       * Prepare the pattern for the erasing brush
       * This pattern will be drawn on the top context, achieving a visual effect of erasing only erasable objects
       * @todo decide how overlay color should behave when `inverted === true`, currently draws over it which is undesirable
       * @private
       * @param {CanvasRenderingContext2D} ctx
       */
      preparePattern: function (ctx) {
        if (!this._patternCanvas) {
          this._patternCanvas = fabric.util.createCanvasElement();
        }
        var canvas = this._patternCanvas;
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;
        var patternCtx = canvas.getContext('2d');
        var backgroundImage = this.canvas.backgroundImage,
            bgErasable = backgroundImage && this._isErasable(backgroundImage),
            overlayImage = this.canvas.overlayImage,
            overlayErasable = overlayImage && this._isErasable(overlayImage);
        if (!this.inverted && ((backgroundImage && !bgErasable) || !!this.canvas.backgroundColor)) {
          if (bgErasable) { this.canvas.backgroundImage = undefined; }
          this.canvas._renderBackground(patternCtx);
          if (bgErasable) { this.canvas.backgroundImage = backgroundImage; }
        }
        else if (this.inverted && (backgroundImage && bgErasable)) {
          var color = this.canvas.backgroundColor;
          this.canvas.backgroundColor = undefined;
          this.canvas._renderBackground(patternCtx);
          this.canvas.backgroundColor = color;
        }
        patternCtx.save();
        patternCtx.transform.apply(patternCtx, this.canvas.viewportTransform);
        this._prepareCollectionTraversal(this.canvas, patternCtx);
        patternCtx.restore();
        if (!this.inverted && ((overlayImage && !overlayErasable) || !!this.canvas.overlayColor)) {
          if (overlayErasable) { this.canvas.overlayImage = undefined; }
          __renderOverlay.call(this.canvas, patternCtx);
          if (overlayErasable) { this.canvas.overlayImage = overlayImage; }
        }
        else if (this.inverted && (overlayImage && overlayErasable)) {
          var color = this.canvas.overlayColor;
          this.canvas.overlayColor = undefined;
          __renderOverlay.call(this.canvas, patternCtx);
          this.canvas.overlayColor = color;
        }
        ctx.strokeStyle = ctx.createPattern(canvas, 'no-repeat');
      },

      /**
       * Sets brush styles
       * @private
       * @param {CanvasRenderingContext2D} [ctx]
       */
      _setBrushStyles: function (ctx) {
        ctx = ctx || this.canvas.contextTop;
        this.callSuper('_setBrushStyles', ctx);
        ctx.strokeStyle = null;
      },

      /**
       * @extends @class fabric.BaseBrush
       * @param {CanvasRenderingContext2D} ctx
       */
      _saveAndTransform: function (ctx) {
        this.callSuper('_saveAndTransform', ctx);
        if (ctx === this.canvas.getContext()) {
          this._setBrushStyles(ctx);
          ctx.globalCompositeOperation = 'destination-out';
        }
        else {
          this.preparePattern(ctx);
        }
      },

      /**
       * We indicate {@link fabric.PencilBrush} to repaint itself if necessary
       * @returns
       */
      needsFullRender: function () {
        return true;
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
        this._render();
      },

      /**
       * Rendering Logic:
       * 1. Use brush to clip canvas by rendering it on top of canvas (unnecessary if `inverted === true`)
       * 2. Render brush with canvas pattern on top context
       *
       */
      _render: function () {
        if (!this.inverted) {
          //  clip canvas
          var ctx = this.canvas.getContext();
          this.callSuper('_render', ctx);
          ctx.restore();
        }
        //  render pattern
        ctx = this.canvas.contextTop;
        this.canvas.clearContext(ctx);
        this.callSuper('_render', ctx);
        ctx.restore();
      },

      createPath: function (pathData) {
        var path = this.callSuper('createPath', pathData);
        path.globalCompositeOperation = this.inverted ? 'source-over' : 'destination-out';
        return path;
      },

      /**
       * Utility to apply a clip path to a path.
       * Used to preserve clipping on eraser paths in nested objects.
       * Called when a group has a clip path that should be applied to the path before applying erasing on the group's objects.
       * @param {fabric.Path} path The eraser path
       * @param {fabric.Object} clipPath The clipPath to apply to the path
       * @param {number[]} clipPathContainerTransformMatrix The transform matrix of the object that the clip path belongs to
       * @returns {fabric.Path} path with clip path
       */
      applyClipPathToPath: function (path, clipPath, clipPathContainerTransformMatrix) {
        var pathTransform = path.calcTransformMatrix();
        var clipPathTransform = clipPath.calcTransformMatrix();
        var transform = fabric.util.multiplyTransformMatrices(
          fabric.util.invertTransform(pathTransform),
          clipPathContainerTransformMatrix
        );
        fabric.util.applyTransformToObject(
          clipPath,
          fabric.util.multiplyTransformMatrices(
            transform,
            clipPathTransform
          )
        );
        path.clipPath = clipPath;
        return path;
      },

      /**
       * Utility to apply a clip path to a path.
       * Used to preserve clipping on eraser paths in nested objects.
       * Called when a group has a clip path that should be applied to the path before applying erasing on the group's objects.
       * @param {fabric.Path} path The eraser path
       * @param {fabric.Object} object The clipPath to apply to path belongs to object
       * @param {Function} callback Callback to be invoked with the cloned path after applying the clip path
       */
      clonePathWithClipPath: function (path, object, callback) {
        var objTransform = object.calcTransformMatrix();
        var clipPath = object.getClipPath();
        var _this = this;
        path.clone(function (_path) {
          clipPath.clone(function (_clipPath) {
            callback(_this.applyClipPathToPath(_path, _clipPath, objTransform));
          });
        });
      },

      /**
       * Adds path to existing clipPath of object
       *
       * @param {fabric.Object} obj
       * @param {fabric.Path} path
       */
      _addPathToObjectEraser: function (obj, path) {
        var clipObject;
        var _this = this;
        //  object is collection, i.e group
        if (obj.forEachObject && obj.erasable === 'deep') {
          var targets = obj._objects.filter(function (_obj) {
            return _obj.erasable;
          });
          if (targets.length > 0 && obj.clipPath) {
            this.clonePathWithClipPath(path, obj, function (_path) {
              targets.forEach(function (_obj) {
                _this._addPathToObjectEraser(_obj, _path);
              });
            });
          }
          else if (targets.length > 0) {
            targets.forEach(function (_obj) {
              _this._addPathToObjectEraser(_obj, path);
            });
          }
          return;
        }
        if (!obj.getEraser()) {
          var size = obj._getNonTransformedDimensions();
          var rect = new fabric.Rect({
            fill: 'rgb(0,0,0)',
            width: size.x,
            height: size.y,
            clipPath: obj.clipPath,
            originX: 'center',
            originY: 'center'
          });
          clipObject = new fabric.Group([rect], {
            eraser: true
          });
        }
        else {
          clipObject = obj.clipPath;
        }

        path.clone(function (path) {
          // http://fabricjs.com/using-transformations
          var desiredTransform = fabric.util.multiplyTransformMatrices(
            fabric.util.invertTransform(
              obj.calcTransformMatrix()
            ),
            path.calcTransformMatrix()
          );
          fabric.util.applyTransformToObject(path, desiredTransform);
          clipObject.addWithUpdate(path);
          obj.set({
            clipPath: clipObject,
            dirty: true
          });
          obj.fire('erasing:end', {
            path: path
          });
          if (obj.group && Array.isArray(_this.__subTargets)) {
            _this.__subTargets.push(obj);
          }
        });
      },

      /**
       * Add the eraser path to canvas drawables' clip paths
       *
       * @param {fabric.Canvas} source
       * @param {fabric.Canvas} path
       * @returns {Object} canvas drawables that were erased by the path
       */
      applyEraserToCanvas: function (path) {
        var canvas = this.canvas;
        var drawables = {};
        [
          'backgroundImage',
          'overlayImage',
        ].forEach(function (prop) {
          var drawable = canvas[prop];
          if (drawable && drawable.erasable) {
            this._addPathToObjectEraser(drawable, path);
            drawables[prop] = drawable;
          }
        }, this);
        return drawables;
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
          this.convertPointsToSVGPath(this._points) :
          null;
        if (!pathData || this._isEmptySVGPath(pathData)) {
          canvas.fire('erasing:end');
          // do not create 0 width/height paths, as they are
          // rendered inconsistently across browsers
          // Firefox 4, for example, renders a dot,
          // whereas Chrome 10 renders nothing
          canvas.requestRenderAll();
          return;
        }

        var path = this.createPath(pathData);
        //  needed for `intersectsWithObject`
        path.setCoords();
        canvas.fire('before:path:created', { path: path });

        // finalize erasing
        var drawables = this.applyEraserToCanvas(path);
        var _this = this;
        this.__subTargets = [];
        var targets = [];
        canvas.forEachObject(function (obj) {
          if (obj.erasable && obj.intersectsWithObject(path, true, true)) {
            _this._addPathToObjectEraser(obj, path);
            targets.push(obj);
          }
        });
        canvas.fire('erasing:end', {
          path: path,
          targets: targets,
          subTargets: this.__subTargets,
          drawables: drawables
        });
        delete this.__subTargets;

        canvas.requestRenderAll();
        path.setCoords();
        this._resetShadow();

        // fire event 'path' created
        canvas.fire('path:created', { path: path });
      }
    }
  );

  /** ERASER_END */
})();
