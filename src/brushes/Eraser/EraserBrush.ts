import type { Point } from '../../point.class';
import type { Group } from '../../shapes/group.class';
import { FabricObject } from '../../shapes/object.class';
import type { Path } from '../../shapes/path.class';
import { createCanvasElement } from '../../util/misc/dom';
import { isCollection } from '../../util/types';
import type { Canvas } from '../../__types__';
import { TBrushEventData } from '../base_brush.class';
import { PencilBrush } from '../pencil_brush.class';
import type { Eraser } from './Eraser';
import { isObjectErasable } from './util';
import { ErasingEventContext, ErasingEventContextData } from './types';

type RestorationContext = {
  visibility: FabricObject[];
  eraser: [FabricObject, Eraser][];
  collection: FabricObject[];
};

/**
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

  protected _isErasing = false;

  protected patternCanvas: HTMLCanvasElement;

  /**
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
  protected prepareCollectionTraversal(
    collection: Canvas | Group,
    objects: FabricObject[],
    ctx: CanvasRenderingContext2D,
    restorationContext: RestorationContext
  ) {
    objects.forEach((object) => {
      let dirty = false;
      if (isCollection(object) && object.erasable === 'deep') {
        //  traverse
        this.prepareCollectionTraversal(
          object,
          object._objects,
          ctx,
          restorationContext
        );
      } else if (!this.inverted && object.erasable && object.visible) {
        //  render only non-erasable objects
        object.visible = false;
        restorationContext.visibility.push(object);
        dirty = true;
      } else if (
        this.inverted &&
        object.erasable &&
        object.eraser &&
        object.visible
      ) {
        //  render all objects without eraser
        const eraser = object.eraser;
        object.eraser = undefined;
        object.dirty = true;
        restorationContext.eraser.push([object, eraser]);
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
    objects: FabricObject[] = this.canvas._objectsToRender ||
      this.canvas._objects
  ) {
    if (!this.patternCanvas) {
      this.patternCanvas = createCanvasElement();
    }
    const canvas = this.patternCanvas;
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
      bgErasable = backgroundImage && isObjectErasable(backgroundImage),
      overlayImage = this.canvas.overlayImage,
      overlayErasable = overlayImage && isObjectErasable(overlayImage);
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
      const eraser = backgroundImage && backgroundImage.eraser;
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
    patternCtx.transform(...this.canvas.viewportTransform);
    const restorationContext: RestorationContext = {
      visibility: [],
      eraser: [],
      collection: [],
    };
    this.prepareCollectionTraversal(
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
      this.canvas._renderOverlay(patternCtx);
      if (overlayErasable) {
        this.canvas.overlayImage = overlayImage;
      }
    } else if (this.inverted) {
      const eraser = overlayImage && overlayImage.eraser;
      if (eraser) {
        overlayImage.eraser = undefined;
        overlayImage.dirty = true;
      }
      this.canvas._renderOverlay(patternCtx);
      if (eraser) {
        overlayImage.eraser = eraser;
        overlayImage.dirty = true;
      }
    }
  }

  /**
   * @override
   */
  _setBrushStyles(ctx: CanvasRenderingContext2D) {
    super._setBrushStyles(ctx);
    ctx.strokeStyle = 'black';
    ctx.globalCompositeOperation =
      ctx === this.canvas.getContext() ? 'destination-out' : 'destination-in';
  }

  /**
   * @override We indicate {@link PencilBrush} to repaint itself if necessary
   */
  needsFullRender() {
    return true;
  }

  onMouseDown(pointer: Point, ev: TBrushEventData) {
    if (this.canvas._isMainEvent(ev.e)) {
      //  prepare for erasing
      this.preparePattern();
      this._isErasing = true;
      this.canvas.fire('erasing:start');
    }
    super.onMouseDown(pointer, ev);
  }

  /**
   * Rendering Logic:
   * 1. Use brush to clip canvas by rendering it on top of canvas (unnecessary if `inverted === true`)
   * 2. Render brush with canvas pattern on top context
   *
   * @todo provide a better solution to https://github.com/fabricjs/fabric.js/issues/7984
   */
  render(ctx: CanvasRenderingContext2D) {
    const lineWidth = this.width;
    const t = this.canvas.getRetinaScaling(),
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
    ctx.drawImage(this.patternCanvas, 0, 0);
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
   * Add the eraser path to a canvas drawable's eraser
   *
   * @param {Path} path
   * @param {ErasingEventContext} [context] context to assign erased objects to
   * @returns {Promise<Path[]|void>} eraser paths
   */
  protected applyEraserToDrawable(
    key: 'backgroundImage' | 'overlayImage',
    path: Path,
    context: ErasingEventContext
  ) {
    const drawable = this.canvas[key];
    const dContext: ErasingEventContextData = {
      targets: [],
      subTargets: [],
      paths: new Map(),
    };
    return (
      drawable &&
      drawable.erasable &&
      EraserBrush.addPathToObjectEraser(drawable, path, dContext).then(() => {
        context.drawables[key] = dContext;
      })
    );
  }

  async finalizeErasing(path: Path) {
    const context: ErasingEventContext = {
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
        EraserBrush.addPathToObjectEraser(obj, path, context)
    );
    tasks.push(
      this.applyEraserToDrawable('backgroundImage', path, context),
      this.applyEraserToDrawable('overlayImage', path, context)
    );
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
