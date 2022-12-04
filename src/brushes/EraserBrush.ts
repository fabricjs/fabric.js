import { fabric } from '../../HEADER';
import { FabricObject } from '../shapes/fabricObject.class';
import { Group } from '../shapes/group.class';
import type { Path } from '../shapes/path.class';
import { TMat2D } from '../typedefs';
import { createCanvasElement } from '../util/misc/dom';
import {
  invertTransform,
  multiplyTransformMatrices,
} from '../util/misc/matrix';
import { mergeClipPaths } from '../util/misc/mergeClipPaths';
import { applyTransformToObject } from '../util/misc/objectTransforms';
import { Canvas } from '../__types__';
import { Eraser } from './Eraser';
import { PencilBrush } from './pencil_brush.class';

function isObjectErasable(object: FabricObject) {
  return object.erasable !== false;
}

function isCollection(what: FabricObject | Canvas) {
  return what instanceof Group || what instanceof fabric.Canvas;
}

type RestorationContext = {
  visibility: FabricObject[];
  eraser: [FabricObject, Eraser][];
  collection: FabricObject[];
};

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
export class EraserBrush extends PencilBrush {
  readonly type = 'eraser';

  /**
   * When set to `true` the brush will create a visual effect of undoing erasing
   * @type boolean
   */
  inverted = false;

  /**
   * Used to fix https://github.com/fabricjs/fabric.js/issues/7984
   * Reduces the path width while clipping the main context, resulting in a better visual overlap of both contexts
   * @type number
   */
  erasingWidthAliasing = 4;

  private _isErasing = false;

  private _patternCanvas: HTMLCanvasElement;

  _isErasable(object: FabricObject) {
    return object.erasable !== false;
  }

  /**
   * @private
   * This is designed to support erasing a collection with both erasable and non-erasable objects while maintaining object stacking.\
   * Iterates over collections to allow nested selective erasing.\
   * Prepares objects before rendering the pattern brush.\
   * If brush is **NOT** inverted render all non-erasable objects.\
   * If brush is inverted render all objects, erasable objects without their eraser.
   * This will render the erased parts as if they were not erased in the first place, achieving an undo effect.
   *
   * @param {Canvas | Group} collection
   * @param {FabricObject[]} objects
   * @param {CanvasRenderingContext2D} ctx
   * @param {RestorationContext} restorationContext
   */
  _prepareCollectionTraversal(
    collection: Canvas | Group,
    objects: FabricObject[],
    ctx: CanvasRenderingContext2D,
    restorationContext: RestorationContext
  ) {
    objects.forEach((obj) => {
      let dirty = false;
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
    });
  }

  /**
   * Prepare the pattern for the erasing brush
   * This pattern will be drawn on the top context after clipping the main context,
   * achieving a visual effect of erasing only erasable objects
   * @param {FabricObject[]} [objects]  override default behavior by passing objects to render on pattern
   */
  preparePattern(
    objects?: FabricObject[] = this.canvas._objectsToRender ||
      this.canvas._objects
  ) {
    if (!this._patternCanvas) {
      this._patternCanvas = createCanvasElement();
    }
    const canvas = this._patternCanvas;
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    const patternCtx = canvas.getContext('2d')!;
    if (this.canvas._isRetinaScaling()) {
      this.canvas.__initRetinaScaling(
        this.canvas.getRetinaScaling(),
        canvas,
        patternCtx
      );
    }
    const backgroundImage = this.canvas.backgroundImage,
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
    const restorationContext: RestorationContext = {
      visibility: [],
      eraser: [],
      collection: [],
    };
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
    restorationContext.eraser.forEach(([obj, eraser]) => {
      obj.eraser = eraser;
      obj.dirty = true;
    });
    restorationContext.collection.forEach((obj) => {
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
  }

  /**
   * Sets brush styles
   * @private
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles(ctx: CanvasRenderingContext2D) {
    super._setBrushStyles(ctx);
    ctx.strokeStyle = 'black';
    ctx.globalCompositeOperation =
      ctx === this.canvas.getContext() ? 'destination-out' : 'destination-in';
  }

  /**
   * We indicate {@link fabric.PencilBrush} to repaint itself if necessary
   * @returns
   */
  needsFullRender() {
    return true;
  }

  /**
   *
   * @param {Point} pointer
   * @param {fabric.IEvent} options
   * @returns
   */
  onMouseDown(pointer, options) {
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
  }

  /**
   * Rendering Logic:
   * 1. Use brush to clip canvas by rendering it on top of canvas (unnecessary if `inverted === true`)
   * 2. Render brush with canvas pattern on top context
   *
   * @todo provide a better solution to https://github.com/fabricjs/fabric.js/issues/7984
   */
  render(ctx: CanvasRenderingContext2D) {
    var lineWidth = this.width;
    var t = this.canvas.getRetinaScaling(),
      s = 1 / t;
    //  clip canvas
    //  a hack that fixes https://github.com/fabricjs/fabric.js/issues/7984 by reducing path width
    //  the issue's cause is unknown at time of writing (@ShaMan123 06/2022)
    if (lineWidth - this.erasingWidthAliasing > 0) {
      this.width = lineWidth - this.erasingWidthAliasing;
      super.render(this.canvas.getContext());
      this.width = lineWidth;
    }
    //  render brush and mask it with pattern
    this.canvas.clearContext(ctx);
    ctx.save();
    ctx.scale(s, s);
    ctx.drawImage(this._patternCanvas, 0, 0);
    ctx.restore();
    super.render(ctx);
  }

  finalizeShape() {
    const path = super.finalizeShape();
    path?.set({
      globalCompositeOperation: this.inverted
        ? 'source-over'
        : 'destination-out',
      stroke: this.inverted ? 'white' : 'black',
    });
    return path;
  }

  /**
   * Utility to apply a clip path to a path.
   * Used to preserve clipping on eraser paths in nested objects.
   * Called when a group has a clip path that should be applied to the path before applying erasing on the group's objects.
   * @param {Path} path The eraser path in canvas coordinate plane
   * @param {FabricObject} clipPath The clipPath to apply to the path
   * @param {number[]} clipPathContainerTransformMatrix The transform matrix of the object that the clip path belongs to
   * @returns {Path} path with clip path
   */
  applyClipPathToPath(
    path: Path,
    clipPath: FabricObject,
    clipPathContainerTransformMatrix: TMat2D
  ) {
    var pathInvTransform = invertTransform(path.calcTransformMatrix()),
      clipPathTransform = clipPath.calcTransformMatrix(),
      transform = clipPath.absolutePositioned
        ? pathInvTransform
        : multiplyTransformMatrices(
            pathInvTransform,
            clipPathContainerTransformMatrix
          );
    //  when passing down a clip path it becomes relative to the parent
    //  so we transform it accordingly and set `absolutePositioned` to false
    clipPath.absolutePositioned = false;
    applyTransformToObject(
      clipPath,
      multiplyTransformMatrices(transform, clipPathTransform)
    );
    //  We need to clip `path` with both `clipPath` and it's own clip path if existing (`path.clipPath`)
    //  so in turn `path` erases an object only where it overlaps with all it's clip paths, regardless of how many there are.
    //  this is done because both clip paths may have nested clip paths of their own (this method walks down a collection => this may reccur),
    //  so we can't assign one to the other's clip path property.
    path.clipPath = path.clipPath
      ? mergeClipPaths(clipPath, path.clipPath)
      : clipPath;
    return path;
  }

  /**
   * Utility to apply a clip path to a path.
   * Used to preserve clipping on eraser paths in nested objects.
   * Called when a group has a clip path that should be applied to the path before applying erasing on the group's objects.
   * @param {Path} path The eraser path
   * @param {FabricObject} object The clipPath to apply to path belongs to object
   * @returns {Promise<Path>}
   */
  clonePathWithClipPath(path: Path, object: FabricObject) {
    const objTransform = object.calcTransformMatrix();
    const clipPath = object.clipPath;
    return Promise.all([
      path.clone(),
      clipPath.clone(['absolutePositioned', 'inverted']),
    ]).then(([clonedPath, clonedClipPath]) =>
      this.applyClipPathToPath(clonedPath, clonedClipPath, objTransform)
    );
  }

  /**
   * Adds path to object's eraser, walks down object's descendants if necessary
   *
   * @public
   * @fires erasing:end on object
   * @param {FabricObject} obj
   * @param {Path} path
   * @param {Object} [context] context to assign erased objects to
   * @returns {Promise<Path | Path[]>}
   */
  _addPathToObjectEraser(obj, path, context) {
    //  object is collection, i.e group
    if (obj.forEachObject && obj.erasable === 'deep') {
      const targets = obj._objects.filter((_obj) => _obj.erasable);
      if (targets.length > 0 && obj.clipPath) {
        return this.clonePathWithClipPath(path, obj).then((_path) => {
          return Promise.all(
            targets.map((_obj) =>
              this._addPathToObjectEraser(_obj, _path, context)
            )
          );
        });
      } else if (targets.length > 0) {
        return Promise.all(
          targets.map((_obj) =>
            this._addPathToObjectEraser(_obj, path, context)
          )
        );
      }
      return;
    }
    //  prepare eraser
    let eraser = obj.eraser;
    if (!eraser) {
      eraser = new Eraser();
      obj.eraser = eraser;
    }
    //  clone and add path
    return path.clone().then((path) => {
      // http://fabricjs.com/using-transformations
      const desiredTransform = multiplyTransformMatrices(
        invertTransform(obj.calcTransformMatrix()),
        path.calcTransformMatrix()
      );
      applyTransformToObject(path, desiredTransform);
      eraser.add(path);
      obj.set('dirty', true);
      obj.fire('erasing:end', { path });
      if (context) {
        (obj.group ? context.subTargets : context.targets).push(obj);
        context.paths.set(obj, path);
      }
      return path;
    });
  }

  /**
   * Add the eraser path to canvas drawables' clip paths
   *
   * @param {Path} path
   * @param {Object} [context] context to assign erased objects to
   * @returns {Promise<Path[]|void>} eraser paths
   */
  applyEraserToCanvas(path: Path, context) {
    return Promise.all(
      (['backgroundImage', 'overlayImage'] as const).map((prop) => {
        var drawable = this.canvas[prop];
        return (
          drawable &&
          drawable.erasable &&
          this._addPathToObjectEraser(drawable, path).then((path) => {
            if (context) {
              context.drawables[prop] = drawable;
              context.paths.set(drawable, path);
            }
            return path;
          })
        );
      })
    );
  }

  async finalizeErasing(path: Path) {
    const context = {
      targets: [],
      subTargets: [],
      paths: new Map(),
      drawables: {},
      path,
    };
    const tasks = this.canvas._objects.map(
      (obj) =>
        obj.erasable &&
        obj.intersectsWithObject(path, true, true) &&
        this._addPathToObjectEraser(obj, path, context)
    );
    tasks.push(this.applyEraserToCanvas(path, context));
    await Promise.all(tasks);
    return context;
  }

  /**
   * On mouseup after drawing the path on contextTop canvas
   * we use the points captured to create an new fabric path object
   * and add it to every intersected erasable object.
   */
  async finalize() {
    this._isErasing = false;
    const shape = await super.finalize();
    this.canvas.fire(
      'erasing:end',
      shape ? await this.finalizeErasing(shape) : undefined
    );
    return shape;
  }
}
