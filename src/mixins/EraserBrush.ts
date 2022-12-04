import { fabric } from '../../HEADER';
import { FabricObject } from '../shapes/fabricObject.class';

/**
 * EraserBrush class
 * Supports selective erasing meaning that only erasable objects are affected by the eraser brush.
 * Supports **inverted** erasing meaning that the brush can "undo" erasing.
 *
 * In order to support selective erasing, the brush clips the entire canvas
 * and then draws all non-erasable objects over the erased path using a pattern brush so to speak (masking).
 * If brush is **inverted** there is no need to clip canvas. The brush draws all erasable objects without their eraser.
 * This achieves the desired effect of seeming to erase or uneraser only erasable objects.
 * After erasing is done the created path is added to all intersected objects' `eraser` property.
 *
 * In order to update the EraserBrush call `preparePattern`.
 * It may come in handy when canvas changes during erasing (i.e animations) and you want the eraser to reflect the changes (performance may suffer).
 *
 * @tutorial {@link http://fabricjs.com/erasing}
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
     * @param {FabricObject} object
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
     * @param {FabricObject[]} objects
     * @param {CanvasRenderingContext2D} ctx
     * @param {{ visibility: FabricObject[], eraser: FabricObject[], collection: FabricObject[] }} restorationContext
     */
    _prepareCollectionTraversal: function (
      collection,
      objects,
      ctx,
      restorationContext
    ) {
      objects.forEach(function (obj) {
        var dirty = false;
        if (obj.forEachObject && obj.erasable === 'deep') {
          //  traverse
          this._prepareCollectionTraversal(
            obj,
            obj._objects,
            ctx,
            restorationContext
          );
        } else if (!this.inverted && obj.erasable && obj.visible) {
          //  render only non-erasable objects
          obj.visible = false;
          restorationContext.visibility.push(obj);
          dirty = true;
        } else if (this.inverted && obj.erasable && obj.eraser && obj.visible) {
          //  render all objects without eraser
          var eraser = obj.eraser;
          obj.eraser = undefined;
          obj.dirty = true;
          restorationContext.eraser.push([obj, eraser]);
          dirty = true;
        }
        if (dirty && collection instanceof FabricObject) {
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
     * @param {FabricObject[]} [objects]  override default behavior by passing objects to render on pattern
     */
    preparePattern: function (objects) {
      if (!this._patternCanvas) {
        this._patternCanvas = fabric.util.createCanvasElement();
      }
      var canvas = this._patternCanvas;
      objects = objects || this.canvas._objectsToRender || this.canvas._objects;
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
        restorationContext
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
      ctx.globalCompositeOperation =
        ctx === this.canvas.getContext() ? 'destination-out' : 'destination-in';
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
      this.render();
    },

    /**
     * Rendering Logic:
     * 1. Use brush to clip canvas by rendering it on top of canvas (unnecessary if `inverted === true`)
     * 2. Render brush with canvas pattern on top context
     *
     * @todo provide a better solution to https://github.com/fabricjs/fabric.js/issues/7984
     */
    render: function (ctx) {
      var lineWidth = this.width;
      var t = this.canvas.getRetinaScaling(),
        s = 1 / t;
      //  clip canvas
      //  a hack that fixes https://github.com/fabricjs/fabric.js/issues/7984 by reducing path width
      //  the issue's cause is unknown at time of writing (@ShaMan123 06/2022)
      if (lineWidth - this.erasingWidthAliasing > 0) {
        this.width = lineWidth - this.erasingWidthAliasing;
        this.callSuper('render', this.canvas.getContext());
        this.width = lineWidth;
      }
      //  render brush and mask it with pattern
      this.canvas.clearContext(ctx);
      ctx.save();
      ctx.scale(s, s);
      ctx.drawImage(this._patternCanvas, 0, 0);
      ctx.restore();
      this.callSuper('render', ctx);
    },

    finalizeShape: function () {
      var path = this.callSuper('finalizeShape');
      path?.set({
        globalCompositeOperation: this.inverted
          ? 'source-over'
          : 'destination-out',
        stroke: this.inverted ? 'white' : 'black',
      });
      return path;
    },

    /**
     * Utility to apply a clip path to a path.
     * Used to preserve clipping on eraser paths in nested objects.
     * Called when a group has a clip path that should be applied to the path before applying erasing on the group's objects.
     * @param {fabric.Path} path The eraser path in canvas coordinate plane
     * @param {FabricObject} clipPath The clipPath to apply to the path
     * @param {number[]} clipPathContainerTransformMatrix The transform matrix of the object that the clip path belongs to
     * @returns {fabric.Path} path with clip path
     */
    applyClipPathToPath: function (
      path,
      clipPath,
      clipPathContainerTransformMatrix
    ) {
      var pathInvTransform = fabric.util.invertTransform(
          path.calcTransformMatrix()
        ),
        clipPathTransform = clipPath.calcTransformMatrix(),
        transform = clipPath.absolutePositioned
          ? pathInvTransform
          : fabric.util.multiplyTransformMatrices(
              pathInvTransform,
              clipPathContainerTransformMatrix
            );
      //  when passing down a clip path it becomes relative to the parent
      //  so we transform it acoordingly and set `absolutePositioned` to false
      clipPath.absolutePositioned = false;
      fabric.util.applyTransformToObject(
        clipPath,
        fabric.util.multiplyTransformMatrices(transform, clipPathTransform)
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
     * @param {FabricObject} object The clipPath to apply to path belongs to object
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
     * @param {FabricObject} obj
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
              })
            );
          });
        } else if (targets.length > 0) {
          return Promise.all(
            targets.map(function (_obj) {
              return _this._addPathToObjectEraser(_obj, path, context);
            })
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
          path.calcTransformMatrix()
        );
        fabric.util.applyTransformToObject(path, desiredTransform);
        eraser.add(path);
        obj.set('dirty', true);
        obj.fire('erasing:end', {
          path: path,
        });
        if (context) {
          (obj.group ? context.subTargets : context.targets).push(obj);
          context.paths.set(obj, path);
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
                context.paths.set(drawable, path);
              }
              return path;
            })
          );
        }, this)
      );
    },

    finalizeErasing: async function (path) {
      // finalize erasing
      const context = {
        targets: [],
        subTargets: [],
        paths: new Map(),
        drawables: {},
        path,
      };
      const tasks = canvas._objects.map(
        (obj) =>
          obj.erasable &&
          obj.intersectsWithObject(path, true, true) &&
          this._addPathToObjectEraser(obj, path, context)
      );
      tasks.push(this.applyEraserToCanvas(path, context));
      await Promise.all(tasks);
      return context;
    },

    /**
     * On mouseup after drawing the path on contextTop canvas
     * we use the points captured to create an new fabric path object
     * and add it to every intersected erasable object.
     */
    finalize: async function () {
      this._isErasing = false;
      const shape = await this.callSuper('finalize');
      canvas.fire(
        'erasing:end',
        shape ? await this.finalizeErasing(shape) : undefined
      );
      return shape;
    },
  }
);
