import type { Canvas } from '../../canvas/Canvas';
import { Color } from '../../color/Color';
import { TPointerEventInfo } from '../../EventTypeDefs';
import { TFabricEvent } from '../../FabricEvent';
import { Point } from '../../Point';
import type { Group } from '../../shapes/Group';
import { FabricObject } from '../../shapes/Object/FabricObject';
import type { Path } from '../../shapes/Path';
import { createCanvasElement } from '../../util/misc/dom';
import { multiplyTransformMatrices2 } from '../../util/misc/matrix';
import { setRetinaScaling } from '../../util/misc/setRetinaScaling';
import { isCollection } from '../../util/types';
import { PencilBrush } from '../PencilBrush';
import type { Eraser } from './Eraser';
import { ErasingEventContext, ErasingEventContextData } from './types';
import { addPathToObjectEraser } from './util';

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
 * after drawing all non-erasable objects over the erased path using a pattern {@link preparePattern} brush so to speak (masking).
 * Rendering Logic:
 * 1. Render brush with pattern on top context
 * 2. Use the top context to clip the main context
 *
 * If **{@link inverted}** draws all objects, erasable objects without their eraser, over the erased path.
 * This achieves the desired effect of seeming to erase or undo erasing only on erasable objects.
 *
 * After erasing is done the created path is added to all intersected objects' `eraser` property {@link finalizeErasing}.
 *
 * The {@link updating} flag controls whether the pattern updates while drawing (performance may suffer).
 * It is crucial in order to reflect visual changes made to canvas after erasing started (i.e animations).
 *
 * @tutorial http://fabricjs.com/erasing
 */
export class EraserBrush extends PencilBrush {
  /**
   * When set to `true` the brush will create a visual effect of undoing erasing
   */
  inverted = false;

  /**
   * Indicates whether the eraser updates continuously on canvas rendering
   * Performance may suffer, handle manually if so
   */
  updating = true;

  protected patternCanvas: HTMLCanvasElement;

  private __disposer?: VoidFunction;
  private blockUpdating = false;
  private dirty: boolean;

  protected setImageSmoothing(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

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
    restorationContext: RestorationContext
  ) {
    const alpha = 1 - new Color(this.color).getAlpha();
    objects.forEach((object) => {
      let dirty = false;
      if (isCollection(object) && (object as Group).erasable === 'deep') {
        //  traverse
        this.prepareCollectionTraversal(
          object,
          object._objects as FabricObject[],
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
    this.setImageSmoothing(patternCtx);
    // retina
    if (this.canvas._isRetinaScaling()) {
      setRetinaScaling(canvas, patternCtx, this.canvas);
    }
    // prepare tree
    const restorationContext: RestorationContext = {
      visibility: [],
      eraser: [],
      collection: [],
    };
    this.prepareCollectionTraversal(
      this.canvas,
      [
        ...objects,
        ...([this.canvas.backgroundImage, this.canvas.overlayImage].filter(
          (d) => !!d
        ) as FabricObject[]),
      ],
      restorationContext
    );
    // render
    this.canvas.renderCanvas(patternCtx, objects, {
      fireEvents: false,
      drawControls: false,
    });
    // restore
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
    // mark as dirty
    this.dirty = true;
  }

  /**
   * @override
   */
  protected _setBrushStyles(
    ctx: CanvasRenderingContext2D = this.canvas.contextTop
  ) {
    super._setBrushStyles(ctx);
    ctx.strokeStyle = 'black';
  }

  /**
   * @override eraser isn't degraded by the alpha channel of {@link color}
   */
  protected needsFullRender() {
    return this.dirty || super.needsFullRender(false);
  }

  /**
   * called from the `after:render` event subscriber
   */
  protected onUpdate() {
    this.preparePattern();
    this.render();
  }

  /**
   * @override prepare pattern, subscribe for updates and fire `erasing:start`
   */
  down(ev: TFabricEvent<TPointerEventInfo>) {
    //  prepare for erasing
    this.preparePattern();
    this.__disposer = this.canvas.on('after:render', () => {
      this.updating && !this.blockUpdating && this.onUpdate();
    });
    this.canvas.fire('erasing:start');
    super.down(ev);
  }

  /**
   * @override when drawing a straight line we need to redraw canvas so it won't be clipped by the previous straight line
   */
  protected onPointAdded() {
    if (this.drawStraightLine) {
      this.blockUpdating = true;
      this.canvas.renderAll();
      this.blockUpdating = false;
    }
    super.onPointAdded();
  }

  /**
   * @override dispose of update subscriber {@link __disposer}
   */
  up(ev: TFabricEvent<TPointerEventInfo>) {
    super.up(ev);
    if (this.__disposer) {
      this.__disposer();
      this.__disposer = undefined;
    }
  }

  /**
   * render pattern on top context
   */
  protected renderPattern(
    ctx: CanvasRenderingContext2D = this.canvas.contextTop
  ) {
    const s = 1 / this.canvas.getRetinaScaling();
    ctx.save();
    this.setImageSmoothing(ctx);
    ctx.scale(s, s);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(this.patternCanvas, 0, 0);
    ctx.restore();
  }

  /**
   * clip main context with top context after brush has been drawn onto it
   */
  protected clipContext(
    destination = this.canvas.getContext(),
    source = this.canvas.contextTop
  ) {
    const s = 1 / this.canvas.getRetinaScaling();
    destination.save();
    this.setImageSmoothing(destination);
    destination.scale(s, s);
    destination.globalCompositeOperation = 'destination-out';
    destination.drawImage(source.canvas, 0, 0);
    destination.restore();
  }

  protected finalizeRendering(ctx?: CanvasRenderingContext2D) {
    // mask brush
    this.renderPattern(ctx);
    //  clip main context
    this.clipContext(this.canvas.getContext(), ctx);
  }

  /**
   * @override mask brush with pattern and clip main context
   */
  protected _renderCurve(ctx?: CanvasRenderingContext2D) {
    super._renderCurve(ctx);
    this.finalizeRendering(ctx);
  }

  /**
   * @override mask brush with pattern and clip main context
   */
  render(ctx?: CanvasRenderingContext2D) {
    this.dirty = false;
    super.render(ctx);
    this.finalizeRendering(ctx);
  }

  protected finalizeShape() {
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
    const drawableVpt = this.canvas[`${key}Vpt` as const];
    const drawable = this.canvas[drawableKey] as FabricObject;
    const dContext: ErasingEventContextData = {
      targets: [],
      subTargets: [],
      paths: new Map(),
    };
    return (
      !!drawable &&
      drawable.erasable &&
      addPathToObjectEraser(drawable, path, dContext, (t) => {
        if (!drawableVpt) {
          const d = drawable.translateToOriginPoint(
            new Point(),
            drawable.originX,
            drawable.originY
          );
          return multiplyTransformMatrices2([
            [1, 0, 0, 1, d.x, d.y],
            // apply vpt from center of drawable
            this.canvas.viewportTransform,
            [1, 0, 0, 1, -d.x, -d.y],
            t,
          ]);
        }
        return t;
      }).then(() => {
        context.drawables[drawableKey] = dContext;
      })
    );
  }

  /**
   * propagate eraser path to all affected {@link FabricObject}
   * @param path eraser path
   */
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

  /**
   * @override finalize erasing and fire `erasing:end`
   */
  protected async onEnd(result?: Path) {
    this.canvas.fire(
      'erasing:end',
      result ? await this.finalizeErasing(result) : undefined
    );
    super.onEnd(result);
  }
}
