//@ts-nocheck
import { Point } from '../Point';
import { FabricObject } from '../shapes/Object/FabricObject';
import { uid } from '../util/internals/uid';

(function (global) {
  /** ERASER_START */

  var fabric = global.fabric,
    __drawClipPath = fabric.Object.prototype._drawClipPath;
  var _needsItsOwnCache = fabric.Object.prototype.needsItsOwnCache;
  var _toObject = fabric.Object.prototype.toObject;
  var _getSvgCommons = fabric.Object.prototype.getSvgCommons;
  var __createBaseClipPathSVGMarkup =
    fabric.Object.prototype._createBaseClipPathSVGMarkup;
  var __createBaseSVGMarkup = fabric.Object.prototype._createBaseSVGMarkup;

  fabric.Object.prototype.cacheProperties.push('eraser');
  fabric.Object.prototype.stateProperties.push('eraser');

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
     * @see {@link http://fabric5.fabricjs.com/erasing#erasable_property}
     * @type boolean | 'deep'
     * @default true
     */
    erasable: true,

    /**
     * @see {@link http://fabric5.fabricjs.com/erasing#eraser}
     * @type fabric.Eraser
     */
    eraser: undefined,

    /**
     * @override
     * @returns Boolean
     */
    needsItsOwnCache: function () {
      return _needsItsOwnCache.call(this) || !!this.eraser;
    },

    /**
     * draw eraser above clip path
     * @override
     * @private
     * @param {CanvasRenderingContext2D} ctx
     * @param {fabric.Object} clipPath
     */
    _drawClipPath: function (ctx, clipPath) {
      __drawClipPath.call(this, ctx, clipPath);
      if (this.eraser) {
        //  update eraser size to match instance
        var size = this._getNonTransformedDimensions();
        this.eraser.isType('eraser') &&
          this.eraser.set({
            width: size.x,
            height: size.y,
          });
        __drawClipPath.call(this, ctx, this.eraser);
      }
    },

    /**
     * Returns an object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function (propertiesToInclude) {
      var object = _toObject.call(
        this,
        ['erasable'].concat(propertiesToInclude),
      );
      if (this.eraser && !this.eraser.excludeFromExport) {
        object.eraser = this.eraser.toObject(propertiesToInclude);
      }
      return object;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns id attribute for svg output
     * @override
     * @return {String}
     */
    getSvgCommons: function () {
      return (
        _getSvgCommons.call(this) +
        (this.eraser ? 'mask="url(#' + this.eraser.clipPathId + ')" ' : '')
      );
    },

    /**
     * create svg markup for eraser
     * use <mask> to achieve erasing for svg, credit: https://travishorn.com/removing-parts-of-shapes-in-svg-b539a89e5649
     * must be called before object markup creation as it relies on the `clipPathId` property of the mask
     * @param {Function} [reviver]
     * @returns
     */
    _createEraserSVGMarkup: function (reviver) {
      if (this.eraser) {
        this.eraser.clipPathId = 'MASK_' + uid();
        return [
          '<mask id="',
          this.eraser.clipPathId,
          '" >',
          this.eraser.toSVG(reviver),
          '</mask>',
          '\n',
        ].join('');
      }
      return '';
    },

    /**
     * @private
     */
    _createBaseClipPathSVGMarkup: function (objectMarkup, options) {
      return [
        this._createEraserSVGMarkup(options && options.reviver),
        __createBaseClipPathSVGMarkup.call(this, objectMarkup, options),
      ].join('');
    },

    /**
     * @private
     */
    _createBaseSVGMarkup: function (objectMarkup, options) {
      return [
        this._createEraserSVGMarkup(options && options.reviver),
        __createBaseSVGMarkup.call(this, objectMarkup, options),
      ].join('');
    },
    /* _TO_SVG_END_ */
  });

  fabric.util.object.extend(fabric.Group.prototype, {
    /**
     * @private
     * @param {fabric.Path} path
     * @returns {Promise<fabric.Path[]>}
     */
    _addEraserPathToObjects: function (path) {
      return Promise.all(
        this._objects.map(function (object) {
          return fabric.EraserBrush.prototype._addPathToObjectEraser.call(
            fabric.EraserBrush.prototype,
            object,
            path,
          );
        }),
      );
    },

    /**
     * Applies the group's eraser to its objects
     * @see {@link http://fabric5.fabricjs.com/erasing#erasable_property}
     * @returns {Promise<fabric.Path[]|fabric.Path[][]|void>}
     */
    applyEraserToObjects: function () {
      var _this = this,
        eraser = this.eraser;
      return Promise.resolve().then(function () {
        if (eraser) {
          delete _this.eraser;
          var transform = _this.calcTransformMatrix();
          return eraser.clone().then(function (eraser) {
            var clipPath = _this.clipPath;
            return Promise.all(
              eraser.getObjects('path').map(function (path) {
                //  first we transform the path from the group's coordinate system to the canvas'
                var originalTransform = fabric.util.multiplyTransformMatrices(
                  transform,
                  path.calcTransformMatrix(),
                );
                fabric.util.applyTransformToObject(path, originalTransform);
                return clipPath
                  ? clipPath.clone().then(
                      function (_clipPath) {
                        var eraserPath =
                          fabric.EraserBrush.prototype.applyClipPathToPath.call(
                            fabric.EraserBrush.prototype,
                            path,
                            _clipPath,
                            transform,
                          );
                        return _this._addEraserPathToObjects(eraserPath);
                      },
                      ['absolutePositioned', 'inverted'],
                    )
                  : _this._addEraserPathToObjects(path);
              }),
            );
          });
        }
      });
    },
  });

  /**
   * An object's Eraser
   * @private
   * @class fabric.Eraser
   */
  fabric.Eraser = fabric.util.createClass(fabric.Group, {
    /**
     * @readonly
     */
    type: 'eraser',

    /**
     */
    originX: 'center',

    /**
     */
    originY: 'center',

    /**
     * eraser should retain size
     * dimensions should not change when paths are added or removed
     * handled by {@link fabric.Object#_drawClipPath}
     * @override
     * @private
     */
    layout: 'fixed',

    drawObject: function (ctx) {
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
      this.callSuper('drawObject', ctx);
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * use <mask> to achieve erasing for svg, credit: https://travishorn.com/removing-parts-of-shapes-in-svg-b539a89e5649
     * for masking we need to add a white rect before all paths
     *
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    _toSVG: function (reviver) {
      var svgString = ['<g ', 'COMMON_PARTS', ' >\n'];
      var x = -this.width / 2,
        y = -this.height / 2;
      var rectSvg = [
        '<rect ',
        'fill="white" ',
        'x="',
        x,
        '" y="',
        y,
        '" width="',
        this.width,
        '" height="',
        this.height,
        '" />\n',
      ].join('');
      svgString.push('\t\t', rectSvg);
      for (var i = 0, len = this._objects.length; i < len; i++) {
        svgString.push('\t\t', this._objects[i].toSVG(reviver));
      }
      svgString.push('</g>\n');
      return svgString;
    },
    /* _TO_SVG_END_ */
  });

  /**
   * Returns instance from an object representation
   * @memberOf fabric.Eraser
   * @param {Object} object Object to create an Eraser from
   * @returns {Promise<fabric.Eraser>}
   */
  fabric.Eraser.fromObject = function (object) {
    var objects = object.objects || [],
      options = fabric.util.object.clone(object, true);
    delete options.objects;
    return Promise.all([
      fabric.util.enlivenObjects<FabricObject>(objects),
      fabric.util.enlivenObjectEnlivables(options),
    ]).then(function (enlivedProps) {
      return new fabric.Eraser(
        enlivedProps[0],
        Object.assign(options, enlivedProps[1]),
        true,
      );
    });
  };

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
      this.isErasing() && this.freeDrawingBrush._render();
    },
  });

  /**
   * EraserBrush class
   * Supports selective erasing meaning that only erasable objects are affected by the eraser brush.
   * Supports **inverted** erasing meaning that the brush can "undo" erasing.
   *
   * In order to support selective erasing, the brush clips the entire canvas
   * and then draws all non-erasable objects over the erased path using a pattern brush so to speak (masking).
   * If brush is **inverted** there is no need to clip canvas. The brush draws all erasable objects without their eraser.
   * This achieves the desired effect of seeming to erase or unerase only erasable objects.
   * After erasing is done the created path is added to all intersected objects' `eraser` property.
   *
   * In order to update the EraserBrush call `preparePattern`.
   * It may come in handy when canvas changes during erasing (i.e animations) and you want the eraser to reflect the changes.
   *
   * @see {@link http://fabric5.fabricjs.com/erasing}
   * @class fabric.EraserBrush
   * @extends fabric.PencilBrush
   * @memberof fabric
   */
  fabric.EraserBrush = fabric.util.createClass(
    fabric.PencilBrush,
    /** @lends fabric.EraserBrush.prototype */ {
      type: 'eraser',

      /**
       * When set to `true` the brush will create a visual effect of undoing erasing
       * @type boolean
       */
      inverted: false,

      /**
       * Used to fix https://github.com/fabricjs/fabric.js/issues/7984
       * Reduces the path width while clipping the main context, resulting in a better visual overlap of both contexts
       * @type number
       */
      erasingWidthAliasing: 4,

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
       * This is designed to support erasing a collection with both erasable and non-erasable objects while maintaining object stacking.\
       * Iterates over collections to allow nested selective erasing.\
       * Prepares objects before rendering the pattern brush.\
       * If brush is **NOT** inverted render all non-erasable objects.\
       * If brush is inverted render all objects, erasable objects without their eraser.
       * This will render the erased parts as if they were not erased in the first place, achieving an undo effect.
       *
       * @param {fabric.Collection} collection
       * @param {fabric.Object[]} objects
       * @param {CanvasRenderingContext2D} ctx
       * @param {{ visibility: fabric.Object[], eraser: fabric.Object[], collection: fabric.Object[] }} restorationContext
       */
      _prepareCollectionTraversal: function (
        collection,
        objects,
        ctx,
        restorationContext,
      ) {
        objects.forEach(function (obj) {
          var dirty = false;
          if (obj.forEachObject && obj.erasable === 'deep') {
            //  traverse
            this._prepareCollectionTraversal(
              obj,
              obj._objects,
              ctx,
              restorationContext,
            );
          } else if (!this.inverted && obj.erasable && obj.visible) {
            //  render only non-erasable objects
            obj.visible = false;
            restorationContext.visibility.push(obj);
            dirty = true;
          } else if (
            this.inverted &&
            obj.erasable &&
            obj.eraser &&
            obj.visible
          ) {
            //  render all objects without eraser
            var eraser = obj.eraser;
            obj.eraser = undefined;
            obj.dirty = true;
            restorationContext.eraser.push([obj, eraser]);
            dirty = true;
          }
          if (dirty && collection instanceof fabric.Object) {
            collection.dirty = true;
            restorationContext.collection.push(collection);
          }
        }, this);
      },

      /**
       * Prepare the pattern for the erasing brush
       * This pattern will be drawn on the top context after clipping the main context,
       * achieving a visual effect of erasing only erasable objects
       * @private
       * @param {fabric.Object[]} [objects]  override default behavior by passing objects to render on pattern
       */
      preparePattern: function (objects) {
        if (!this._patternCanvas) {
          this._patternCanvas = fabric.util.createCanvasElement();
        }
        var canvas = this._patternCanvas;
        objects =
          objects || this.canvas._objectsToRender || this.canvas._objects;
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;
        var patternCtx = canvas.getContext('2d');
        if (this.canvas._isRetinaScaling()) {
          var retinaScaling = this.canvas.getRetinaScaling();
          this.canvas.__initRetinaScaling(retinaScaling, canvas, patternCtx);
        }
        var backgroundImage = this.canvas.backgroundImage,
          bgErasable = backgroundImage && this._isErasable(backgroundImage),
          overlayImage = this.canvas.overlayImage,
          overlayErasable = overlayImage && this._isErasable(overlayImage);
        if (
          !this.inverted &&
          ((backgroundImage && !bgErasable) || !!this.canvas.backgroundColor)
        ) {
          if (bgErasable) {
            this.canvas.backgroundImage = undefined;
          }
          this.canvas._renderBackground(patternCtx);
          if (bgErasable) {
            this.canvas.backgroundImage = backgroundImage;
          }
        } else if (this.inverted) {
          var eraser = backgroundImage && backgroundImage.eraser;
          if (eraser) {
            backgroundImage.eraser = undefined;
            backgroundImage.dirty = true;
          }
          this.canvas._renderBackground(patternCtx);
          if (eraser) {
            backgroundImage.eraser = eraser;
            backgroundImage.dirty = true;
          }
        }
        patternCtx.save();
        patternCtx.transform.apply(patternCtx, this.canvas.viewportTransform);
        var restorationContext = { visibility: [], eraser: [], collection: [] };
        this._prepareCollectionTraversal(
          this.canvas,
          objects,
          patternCtx,
          restorationContext,
        );
        this.canvas._renderObjects(patternCtx, objects);
        restorationContext.visibility.forEach(function (obj) {
          obj.visible = true;
        });
        restorationContext.eraser.forEach(function (entry) {
          var obj = entry[0],
            eraser = entry[1];
          obj.eraser = eraser;
          obj.dirty = true;
        });
        restorationContext.collection.forEach(function (obj) {
          obj.dirty = true;
        });
        patternCtx.restore();
        if (
          !this.inverted &&
          ((overlayImage && !overlayErasable) || !!this.canvas.overlayColor)
        ) {
          if (overlayErasable) {
            this.canvas.overlayImage = undefined;
          }
          __renderOverlay.call(this.canvas, patternCtx);
          if (overlayErasable) {
            this.canvas.overlayImage = overlayImage;
          }
        } else if (this.inverted) {
          var eraser = overlayImage && overlayImage.eraser;
          if (eraser) {
            overlayImage.eraser = undefined;
            overlayImage.dirty = true;
          }
          __renderOverlay.call(this.canvas, patternCtx);
          if (eraser) {
            overlayImage.eraser = eraser;
            overlayImage.dirty = true;
          }
        }
      },

      /**
       * Sets brush styles
       * @private
       * @param {CanvasRenderingContext2D} ctx
       */
      _setBrushStyles: function (ctx) {
        this.callSuper('_setBrushStyles', ctx);
        ctx.strokeStyle = 'black';
      },

      /**
       * **Customiztion**
       *
       * if you need the eraser to update on each render (i.e animating during erasing) override this method by **adding** the following (performance may suffer):
       * @example
       * ```
       * if(ctx === this.canvas.contextTop) {
       *  this.preparePattern();
       * }
       * ```
       *
       * @override fabric.BaseBrush#_saveAndTransform
       * @param {CanvasRenderingContext2D} ctx
       */
      _saveAndTransform: function (ctx) {
        this.callSuper('_saveAndTransform', ctx);
        this._setBrushStyles(ctx);
        ctx.globalCompositeOperation =
          ctx === this.canvas.getContext()
            ? 'destination-out'
            : 'destination-in';
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
       * @param {Point} pointer
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

        //  prepare for erasing
        this.preparePattern();
        this._isErasing = true;
        this.canvas.fire('erasing:start');
        this._render();
      },

      /**
       * Rendering Logic:
       * 1. Use brush to clip canvas by rendering it on top of canvas (unnecessary if `inverted === true`)
       * 2. Render brush with canvas pattern on top context
       *
       * @todo provide a better solution to https://github.com/fabricjs/fabric.js/issues/7984
       */
      _render: function () {
        var ctx,
          lineWidth = this.width;
        var t = this.canvas.getRetinaScaling(),
          s = 1 / t;
        //  clip canvas
        ctx = this.canvas.getContext();
        //  a hack that fixes https://github.com/fabricjs/fabric.js/issues/7984 by reducing path width
        //  the issue's cause is unknown at time of writing (@ShaMan123 06/2022)
        if (lineWidth - this.erasingWidthAliasing > 0) {
          this.width = lineWidth - this.erasingWidthAliasing;
          this.callSuper('_render', ctx);
          this.width = lineWidth;
        }
        //  render brush and mask it with pattern
        ctx = this.canvas.contextTop;
        this.canvas.clearContext(ctx);
        ctx.save();
        ctx.scale(s, s);
        ctx.drawImage(this._patternCanvas, 0, 0);
        ctx.restore();
        this.callSuper('_render', ctx);
      },

      /**
       * Creates fabric.Path object
       * @override
       * @private
       * @param {(string|number)[][]} pathData Path data
       * @return {fabric.Path} Path to add on canvas
       * @returns
       */
      createPath: function (pathData) {
        var path = this.callSuper('createPath', pathData);
        path.globalCompositeOperation = this.inverted
          ? 'source-over'
          : 'destination-out';
        path.stroke = this.inverted ? 'white' : 'black';
        return path;
      },

      /**
       * Utility to apply a clip path to a path.
       * Used to preserve clipping on eraser paths in nested objects.
       * Called when a group has a clip path that should be applied to the path before applying erasing on the group's objects.
       * @param {fabric.Path} path The eraser path in canvas coordinate plane
       * @param {fabric.Object} clipPath The clipPath to apply to the path
       * @param {number[]} clipPathContainerTransformMatrix The transform matrix of the object that the clip path belongs to
       * @returns {fabric.Path} path with clip path
       */
      applyClipPathToPath: function (
        path,
        clipPath,
        clipPathContainerTransformMatrix,
      ) {
        var pathInvTransform = fabric.util.invertTransform(
            path.calcTransformMatrix(),
          ),
          clipPathTransform = clipPath.calcTransformMatrix(),
          transform = clipPath.absolutePositioned
            ? pathInvTransform
            : fabric.util.multiplyTransformMatrices(
                pathInvTransform,
                clipPathContainerTransformMatrix,
              );
        //  when passing down a clip path it becomes relative to the parent
        //  so we transform it acoordingly and set `absolutePositioned` to false
        clipPath.absolutePositioned = false;
        fabric.util.applyTransformToObject(
          clipPath,
          fabric.util.multiplyTransformMatrices(transform, clipPathTransform),
        );
        //  We need to clip `path` with both `clipPath` and it's own clip path if existing (`path.clipPath`)
        //  so in turn `path` erases an object only where it overlaps with all it's clip paths, regardless of how many there are.
        //  this is done because both clip paths may have nested clip paths of their own (this method walks down a collection => this may reccur),
        //  so we can't assign one to the other's clip path property.
        path.clipPath = path.clipPath
          ? fabric.util.mergeClipPaths(clipPath, path.clipPath)
          : clipPath;
        return path;
      },

      /**
       * Utility to apply a clip path to a path.
       * Used to preserve clipping on eraser paths in nested objects.
       * Called when a group has a clip path that should be applied to the path before applying erasing on the group's objects.
       * @param {fabric.Path} path The eraser path
       * @param {fabric.Object} object The clipPath to apply to path belongs to object
       * @returns {Promise<fabric.Path>}
       */
      clonePathWithClipPath: function (path, object) {
        var objTransform = object.calcTransformMatrix();
        var clipPath = object.clipPath;
        var _this = this;
        return Promise.all([
          path.clone(),
          clipPath.clone(['absolutePositioned', 'inverted']),
        ]).then(function (clones) {
          return _this.applyClipPathToPath(clones[0], clones[1], objTransform);
        });
      },

      /**
       * Adds path to object's eraser, walks down object's descendants if necessary
       *
       * @public
       * @fires erasing:end on object
       * @param {fabric.Object} obj
       * @param {fabric.Path} path
       * @param {Object} [context] context to assign erased objects to
       * @returns {Promise<fabric.Path | fabric.Path[]>}
       */
      _addPathToObjectEraser: function (obj, path, context) {
        var _this = this;
        //  object is collection, i.e group
        if (obj.forEachObject && obj.erasable === 'deep') {
          var targets = obj._objects.filter(function (_obj) {
            return _obj.erasable;
          });
          if (targets.length > 0 && obj.clipPath) {
            return this.clonePathWithClipPath(path, obj).then(function (_path) {
              return Promise.all(
                targets.map(function (_obj) {
                  return _this._addPathToObjectEraser(_obj, _path, context);
                }),
              );
            });
          } else if (targets.length > 0) {
            return Promise.all(
              targets.map(function (_obj) {
                return _this._addPathToObjectEraser(_obj, path, context);
              }),
            );
          }
          return;
        }
        //  prepare eraser
        var eraser = obj.eraser;
        if (!eraser) {
          eraser = new fabric.Eraser();
          obj.eraser = eraser;
        }
        //  clone and add path
        return path.clone().then(function (path) {
          // http://fabricjs.com/using-transformations
          var desiredTransform = fabric.util.multiplyTransformMatrices(
            fabric.util.invertTransform(obj.calcTransformMatrix()),
            path.calcTransformMatrix(),
          );
          fabric.util.applyTransformToObject(path, desiredTransform);
          eraser.add(path);
          obj.set('dirty', true);
          obj.fire('erasing:end', {
            path: path,
          });
          if (context) {
            (obj.group ? context.subTargets : context.targets).push(obj);
            //context.paths.set(obj, path);
          }
          return path;
        });
      },

      /**
       * Add the eraser path to canvas drawables' clip paths
       *
       * @param {fabric.Canvas} source
       * @param {fabric.Canvas} path
       * @param {Object} [context] context to assign erased objects to
       * @returns {Promise<fabric.Path[]|void>} eraser paths
       */
      applyEraserToCanvas: function (path, context) {
        var canvas = this.canvas;
        return Promise.all(
          ['backgroundImage', 'overlayImage'].map(function (prop) {
            var drawable = canvas[prop];
            return (
              drawable &&
              drawable.erasable &&
              this._addPathToObjectEraser(drawable, path).then(function (path) {
                if (context) {
                  context.drawables[prop] = drawable;
                  //context.paths.set(drawable, path);
                }
                return path;
              })
            );
          }, this),
        );
      },

      /**
       * On mouseup after drawing the path on contextTop canvas
       * we use the points captured to create an new fabric path object
       * and add it to every intersected erasable object.
       */
      _finalizeAndAddPath: function () {
        var ctx = this.canvas.contextTop,
          canvas = this.canvas;
        ctx.closePath();
        if (this.decimate) {
          this._points = this.decimatePoints(this._points, this.decimate);
        }

        // clear
        canvas.clearContext(canvas.contextTop);
        this._isErasing = false;

        var pathData =
          this._points && this._points.length > 1
            ? this.convertPointsToSVGPath(this._points)
            : null;
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
        //  commense event sequence
        canvas.fire('before:path:created', { path: path });

        // finalize erasing
        var _this = this;
        var context = {
          targets: [],
          subTargets: [],
          //paths: new Map(),
          drawables: {},
        };
        var tasks = canvas._objects.map(function (obj) {
          return (
            obj.erasable &&
            obj.intersectsWithObject(path, true, true) &&
            _this._addPathToObjectEraser(obj, path, context)
          );
        });
        tasks.push(_this.applyEraserToCanvas(path, context));
        return Promise.all(tasks).then(function () {
          //  fire erasing:end
          canvas.fire(
            'erasing:end',
            Object.assign(context, {
              path: path,
            }),
          );

          canvas.requestRenderAll();
          _this._resetShadow();

          // fire event 'path' created
          canvas.fire('path:created', { path: path });
        });
      },
    },
  );

  /** ERASER_END */
})(typeof exports !== 'undefined' ? exports : window);
