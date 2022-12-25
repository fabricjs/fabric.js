import { fabric } from '../../HEADER';
import { Color } from '../color';
import { TEvent } from '../EventTypeDefs';
import type { Point } from '../point.class';
import { Shadow } from '../shadow.class';
import { FabricObject } from '../shapes/Object/FabricObject';
import { multiplyTransformMatrices } from '../util/misc/matrix';
import { sendObjectToPlane } from '../util/misc/planeChange';
import { Canvas } from '../__types__';

export type TBrushEventData = TEvent & { pointer: Point };

/**
 * @see {@link http://fabricjs.com/freedrawing|Freedrawing demo}
 */
export abstract class BaseBrush<T extends FabricObject = FabricObject> {
  /**
   * Color of a brush
   * @type String
   * @default
   */
  color = 'rgb(0, 0, 0)';

  /**
   * Width of a brush, has to be a Number, no string literals
   * @type Number
   * @default
   */
  width = 1;

  /**
   * Shadow object representing shadow of this shape.
   * <b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
   * "shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12
   * @type Shadow
   * @default
   */
  shadow: Shadow | null = null;

  /**
   * Line endings style of a brush (one of "butt", "round", "square")
   * @type String
   * @default
   */
  strokeLineCap: CanvasLineCap = 'round';

  /**
   * Corner style of a brush (one of "bevel", "round", "miter")
   * @type String
   * @default
   */
  strokeLineJoin: CanvasLineJoin = 'round';

  /**
   * Maximum miter length (used for strokeLineJoin = "miter") of a brush's
   * @type Number
   * @default
   */
  strokeMiterLimit = 10;

  /**
   * Stroke Dash Array.
   * @type Array
   * @default
   */
  strokeDashArray: number[] | null = null;

  /**
   * When `true`, the free drawing is limited to the whiteboard size. Default to false.
   * @type Boolean
   * @default false
   */

  limitedToCanvasSize = false;

  /**
   * Same as FabricObject `clipPath` property.
   * The clip path is positioned relative to the top left corner of the viewport.
   * The `absolutePositioned` property renders the clip path w/o viewport transform.
   */
  clipPath?: FabricObject;

  /**
   * @todo add type
   */
  canvas: Canvas;

  active = false;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  protected abstract _render(ctx: CanvasRenderingContext2D): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMouseDown(pointer: Point, ev: TBrushEventData) {
    this.canvas._isCurrentlyDrawing = this.active = true;
  }

  abstract onMouseMove(pointer: Point, ev: TBrushEventData): void;

  /**
   * @returns true if brush should continue blocking interaction
   */
  abstract onMouseUp(ev: TBrushEventData): void;

  protected abstract finalizeShape(): T | undefined;

  /**
   * Sets brush styles
   * @private
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles(ctx: CanvasRenderingContext2D = this.canvas.contextTop) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = this.strokeLineCap;
    ctx.miterLimit = this.strokeMiterLimit;
    ctx.lineJoin = this.strokeLineJoin;
    ctx.setLineDash(this.strokeDashArray || []);
  }

  transform(ctx: CanvasRenderingContext2D) {
    ctx.transform(...this.canvas.viewportTransform);
  }

  protected needsFullRender() {
    const color = new Color(this.color);
    return (
      color.getAlpha() < 1 ||
      !!this.shadow ||
      (this.clipPath && this.clipPath.isCacheDirty())
    );
  }

  /**
   * Sets brush shadow styles
   * @private
   */
  protected _setShadow() {
    if (!this.shadow || !this.canvas) {
      return;
    }

    const canvas = this.canvas,
      shadow = this.shadow,
      ctx = canvas.contextTop,
      zoom = canvas.getZoom() * canvas.getRetinaScaling();

    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur * zoom;
    ctx.shadowOffsetX = shadow.offsetX * zoom;
    ctx.shadowOffsetY = shadow.offsetY * zoom;
  }

  /**
   * Removes brush shadow styles
   * @private
   */
  protected _resetShadow(
    ctx: CanvasRenderingContext2D = this.canvas.contextTop
  ) {
    ctx.shadowColor = '';
    ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
  }

  /**
   * Check is pointer is outside canvas boundaries
   * @param {Object} pointer
   * @private
   */
  protected _isOutSideCanvas(pointer: Point) {
    return (
      pointer.x < 0 ||
      pointer.x > this.canvas.getWidth() ||
      pointer.y < 0 ||
      pointer.y > this.canvas.getHeight()
    );
  }

  /**
   * needed for `absolutePositioned` `clipPath`
   * @private
   */
  calcTransformMatrix() {
    return this.canvas.viewportTransform;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {FabricObject} clipPath
   */
  drawClipPathOnCache(ctx: CanvasRenderingContext2D, clipPath: FabricObject) {
    // TODO: no proto calls
    FabricObject.prototype.drawClipPathOnCache.call(this, ctx, clipPath);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {FabricObject} clipPath
   */
  _drawClipPath(ctx: CanvasRenderingContext2D, clipPath?: FabricObject) {
    if (!clipPath) {
      return;
    }
    ctx.save();
    // TODO: no proto calls
    FabricObject.prototype._drawClipPath.call(this, ctx, clipPath);
    ctx.restore();
  }

  /**
   * clones the brush's clip path and prepares it for the resulting object
   */
  protected async createClipPath(result: FabricObject) {
    if (!this.clipPath) {
      return;
    }
    const t = result.calcTransformMatrix();
    const clipPath = await this.clipPath.clone(['inverted']);
    sendObjectToPlane(
      clipPath,
      undefined,
      this.clipPath.absolutePositioned
        ? multiplyTransformMatrices(this.calcTransformMatrix(), t)
        : t
    );
    return clipPath;
  }

  /**
   * Render the full state of the brush
   */
  render(ctx: CanvasRenderingContext2D = this.canvas.contextTop) {
    this.canvas.clearContext(ctx);
    ctx.save();
    this.transform(ctx);
    this._render(ctx);
    this._drawClipPath(ctx, this.clipPath);
    ctx.restore();
  }

  protected onEnd(result?: T) {
    // in case 'interaction:completed' changes canvas visuals (which is likely to happen in 99% of the time)
    // we request rendering so that there won't be a visual gap (flickering) between clearing the top context and the updated main context
    this.canvas.shouldClearContextTop = true;
    this.canvas.requestRenderAll();
    this.canvas.fire('interaction:completed', { result });
  }

  protected async finalize() {
    // TODO: once canvas is migrated refactor `_isCurrentlyDrawing` to a method
    this.canvas._isCurrentlyDrawing = this.active = false;
    this._resetShadow();
    const shape = this.finalizeShape();
    if (shape) {
      shape.set({
        canvas: this.canvas,
        shadow: this.shadow ? new Shadow(this.shadow) : undefined,
        clipPath: await this.createClipPath(shape),
      });
      shape.setCoords();
    }
    this.onEnd(shape);
  }
}

fabric.BaseBrush = BaseBrush;
