import { Color } from '../../color';
import type { Point } from '../../point.class';
import { FabricObject } from '../../shapes/fabricObject.class';
import type { Group } from '../../shapes/group.class';
import type { Path } from '../../shapes/path.class';
import { capitalize } from '../../util/lang_string';
import { createCanvasElement } from '../../util/misc/dom';
import { isCollection } from '../../util/types';
import type { Canvas } from '../../__types__';
import { TBrushEventData } from '../base_brush.class';
import { PencilBrush } from '../pencil_brush.class';
import type { Eraser } from './Eraser';
import { ErasingEventContext, ErasingEventContextData } from './types';
import { addPathToObjectEraser, isObjectErasable } from './util';

type RestorationContext = {
  visibility: [FabricObject, number][];
  eraser: [FabricObject, Eraser][];
  collection: FabricObject[];
};

/**
 * Supports **selective** erasing: only erasable objects are affected by the eraser brush.
 *
 * Supports **inverted** erasing: the brush can "undo" erasing.
 *
 * Supports **alpha** erasing: setting the alpha channel of the `color` property controls the eraser intensity.
 *
 * In order to support selective erasing, the brush clips the entire canvas
 * and then draws all non-erasable objects over the erased path using a pattern brush so to speak (masking).
 * If brush is **inverted** it draws all objects, erasable objects without their eraser, over the erased path.
 * This achieves the desired effect of seeming to erase or undo erasing only on erasable objects.
 * After erasing is done the created path is added to all intersected objects' `eraser` property.
 *
 * In order to update the EraserBrush's pattern while drawing call `preparePattern`.
 * You will need to redraw the brush for it to properly update visuals, refer to {@link needsFullRender}.
 * It may come in handy when canvas changes during erasing (i.e animations) and you want the eraser to reflect the changes (performance may suffer).
 *
 * @tutorial http://fabricjs.com/erasing
 */
export class EraserBrush extends PencilBrush {
  /**
   * When set to `true` the brush will create a visual effect of undoing erasing
   * @type boolean
   */
  inverted = false;

  /**
   * Used to fix #7984
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
    const alpha = 1 - new Color(this.color).getAlpha();
    objects.forEach((object) => {
      let dirty = false;
      if (isCollection(object) && (object as Group).erasable === 'deep') {
        //  traverse
        this.prepareCollectionTraversal(
          object,
          object._objects,
          ctx,
          restorationContext
        );
      } else if (!this.inverted && object.erasable && !object.isNotVisible()) {
        //  render only non-erasable objects
        const opacity = object.opacity;
        object.opacity *= alpha;
        restorationContext.visibility.push([object, opacity]);
        dirty = true;
      } else if (
        this.inverted &&
        object.erasable &&
        object.eraser &&
        !object.isNotVisible()
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

  protected renderObjectsOnPattern(
    ctx: CanvasRenderingContext2D,
    objects: FabricObject[]
  ) {
    ctx.save();
    ctx.transform(...this.canvas.viewportTransform);
    const restorationContext: RestorationContext = {
      visibility: [],
      eraser: [],
      collection: [],
    };
    this.prepareCollectionTraversal(
      this.canvas,
      objects,
      ctx,
      restorationContext
    );
    this.canvas._renderObjects(ctx, objects);
    restorationContext.visibility.forEach(([obj, opacity]) => {
      obj.opacity = opacity;
    });
    restorationContext.eraser.forEach(([obj, eraser]) => {
      obj.eraser = eraser;
      obj.dirty = true;
    });
    restorationContext.collection.forEach((obj) => {
      obj.dirty = true;
    });
    ctx.restore();
  }

  protected renderDrawableOnPattern(
    ctx: CanvasRenderingContext2D,
    key: 'background' | 'overlay'
  ) {
    const drawableKey = `${key}Image` as const;
    const method = `_render${capitalize(key)}` as const;
    const drawable = this.canvas[drawableKey],
      bgErasable = drawable && isObjectErasable(drawable);
    if (
      !this.inverted &&
      ((drawable && !bgErasable) || !!this.canvas[`${key}Color`])
    ) {
      if (bgErasable) {
        this.canvas[drawableKey] = undefined;
      }
      this.canvas[method](ctx);
      if (bgErasable) {
        this.canvas[drawableKey] = drawable;
      }
    } else if (this.inverted) {
      const eraser = drawable && drawable.eraser;
      if (eraser) {
        drawable.eraser = undefined;
        drawable.dirty = true;
      }
      this.canvas[method](ctx);
      if (eraser) {
        drawable.eraser = eraser;
        drawable.dirty = true;
      }
    }
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
    this.renderDrawableOnPattern(patternCtx, 'background');
    this.renderObjectsOnPattern(patternCtx, objects);
    this.renderDrawableOnPattern(patternCtx, 'overlay');
  }

  protected renderPattern(ctx: CanvasRenderingContext2D) {
    const s = 1 / this.canvas.getRetinaScaling();
    ctx.save();
    ctx.scale(s, s);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(this.patternCanvas, 0, 0);
    ctx.restore();
  }

  /**
   * @override
   */
  _setBrushStyles(ctx: CanvasRenderingContext2D) {
    super._setBrushStyles(ctx);
    ctx.strokeStyle = 'black';
    if (ctx === this.canvas.getContext()) {
      ctx.globalCompositeOperation = 'destination-out';
      //  a hack that fixes #7984 by reducing path width
      //  the case seems to be aliasing of paths
      ctx.lineWidth = Math.max(
        this.width - this.erasingWidthAliasing / this.canvas.getRetinaScaling(),
        0
      );
    }
  }

  protected needsFullRender() {
    return super.needsFullRender(false);
  }

  protected _reset() {
    super._reset();
    this._setBrushStyles(this.canvas.getContext());
  }

  protected _prepareForDrawing(pointer: Point) {
    super._prepareForDrawing(pointer);
    this.canvas.getContext().moveTo(pointer.x, pointer.y);
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

  protected onPointAdded() {
    if (this.needsFullRender()) {
      // when drawing a straight line we need to redraw canvas so it won't be clipped by the previous straight line
      this.drawStraightLine && this.canvas.renderAll();
      this.render();
    } else {
      this._renderCurve();
    }
  }

  protected _renderCurve(
    ctx: CanvasRenderingContext2D = this.canvas.contextTop
  ) {
    const oldEnd = this.oldEnd;
    // clip main context
    super._renderCurve(this.canvas.getContext());
    // restore the value for rendering to occur
    this.oldEnd = oldEnd;
    // render brush and mask it with pattern
    super._renderCurve(ctx);
    this.renderPattern(ctx);
  }

  /**
   * Rendering Logic:
   * 1. Use brush to clip canvas by rendering it on top of canvas
   * 2. Render brush with canvas pattern on top context
   */
  render(ctx: CanvasRenderingContext2D = this.canvas.contextTop) {
    //  clip main context
    super.render(this.canvas.getContext(), false);
    //  render brush and mask it with pattern
    super.render(ctx);
    this.renderPattern(ctx);
  }

  finalizeShape() {
    const path = super.finalizeShape();
    path?.set(
      this.inverted
        ? {
            globalCompositeOperation: 'source-over',
            stroke: 'white',
          }
        : {
            globalCompositeOperation: 'destination-out',
            stroke: 'black',
            opacity: new Color(this.color).getAlpha(),
          }
    );
    return path;
  }

  /**
   * Add the eraser path to a canvas drawable's eraser
   *
   * @param {Path} path
   * @param {ErasingEventContext} [context] context to assign erased objects to
   * @returns {Promise<Path[]|void>} eraser paths
   */
  protected addPathToDrawableEraser(
    key: 'background' | 'overlay',
    path: Path,
    context: ErasingEventContext
  ) {
    const drawableKey = `${key}Image` as const;
    const drawable = this.canvas[drawableKey];
    const dContext: ErasingEventContextData = {
      targets: [],
      subTargets: [],
      paths: new Map(),
    };
    return (
      drawable &&
      drawable.erasable &&
      addPathToObjectEraser(drawable, path, dContext).then(() => {
        context.drawables[drawableKey] = dContext;
      })
    );
  }

  protected async finalizeErasing(path: Path) {
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
        addPathToObjectEraser(obj, path, context)
    );
    tasks.push(
      this.addPathToDrawableEraser('background', path, context),
      this.addPathToDrawableEraser('overlay', path, context)
    );
    await Promise.all(tasks);
    return context;
  }

  protected async onEnd(result?: Path) {
    this.canvas.fire(
      'erasing:end',
      result ? await this.finalizeErasing(result) : undefined
    );
    super.onEnd(result);
  }
}
