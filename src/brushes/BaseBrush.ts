import type { Canvas } from '../canvas/Canvas';
import { Color } from '../color/Color';
import { CanvasEvents, TEvent } from '../EventTypeDefs';
import { Observable } from '../Observable';
import type { Point } from '../Point';
import { Shadow } from '../Shadow';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { TCachedFabricObject } from '../shapes/Object/Object';
import {
  invertTransform,
  multiplyTransformMatrices,
} from '../util/misc/matrix';
import { sendObjectToPlane } from '../util/misc/planeChange';

export type TBrushEventData = TEvent & { pointer: Point };

/**
 * @see {@link http://fabricjs.com/freedrawing|Freedrawing demo}
 */
export abstract class BaseBrush<
  T extends FabricObject = FabricObject,
  EventSpec extends CanvasEvents = CanvasEvents
> extends Observable<EventSpec> {
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
   * Same as FabricObject `clipPath` property.
   * The clip path is positioned relative to the top left corner of the viewport.
   * The `absolutePositioned` property renders the clip path w/o viewport transform.
   * The clip path is prone to the `setCoords` gotcha.
   */
  clipPath?: FabricObject;

  /**
   * Cursor value used during free drawing
   * @type String
   * @default crosshair
   */
  cursor: CSSStyleDeclaration['cursor'] = 'crosshair';

  declare readonly canvas: Canvas;

  active = false;

  enabled = true;

  private _disposer?: () => void;

  constructor(canvas: Canvas) {
    super();
    this.canvas = canvas;
    const subscribers = this.subscribe();
    this._disposer = () => {
      subscribers.forEach((d) => d());
      this._disposer = undefined;
    };
  }

  /**
   * This method wires the internal lifecycle to canvas events,
   * making it very easy to change the hooks that the brush responds to.
   * @returns an array of disposers
   */
  protected subscribe(): VoidFunction[] {
    return [this.on('resize', () => this._setBrushStyles())];
  }

  protected unsubscribe() {
    this._disposer && this._disposer();
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    if (this.active) {
      this.canvas.clearContext(this.canvas.contextTop);
      this.active = false;
    }
  }

  protected abstract _render(ctx: CanvasRenderingContext2D): void;

  protected abstract finalizeShape(): T | undefined;

  protected start() {
    this.active = true;
    this.canvas.setCursor(this.cursor);
    this._setBrushStyles();
    this._setShadow();
  }

  /**
   * Sets brush styles
   * @private
   * @param {CanvasRenderingContext2D} ctx
   */
  protected _setBrushStyles(
    ctx: CanvasRenderingContext2D = this.canvas.contextTop
  ) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = this.strokeLineCap;
    ctx.miterLimit = this.strokeMiterLimit;
    ctx.lineJoin = this.strokeLineJoin;
    ctx.setLineDash(this.strokeDashArray || []);
  }

  transform(ctx: CanvasRenderingContext2D) {
    // noop
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
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {FabricObject} clipPath
   */
  private drawClipPathOnCache(
    ctx: CanvasRenderingContext2D,
    clipPath: TCachedFabricObject
  ) {
    ctx.save();
    ctx.globalCompositeOperation = clipPath.inverted
      ? 'destination-out'
      : 'destination-in';
    if (!clipPath.absolutePositioned) {
      ctx.transform(...this.canvas.viewportTransform);
    }
    clipPath.transform(ctx);
    ctx.scale(1 / clipPath.zoomX, 1 / clipPath.zoomY);
    ctx.drawImage(
      clipPath._cacheCanvas,
      -clipPath.cacheTranslationX,
      -clipPath.cacheTranslationY
    );
    ctx.restore();
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {FabricObject} clipPath
   */
  protected _drawClipPath(
    ctx: CanvasRenderingContext2D,
    clipPath?: FabricObject
  ) {
    if (!clipPath) {
      return;
    }
    // needed to setup a couple of variables
    // path canvas gets overridden with this one.
    // TODO find a better solution?
    clipPath._set('canvas', this.canvas);
    clipPath.shouldCache();
    clipPath._transformDone = true;
    clipPath.renderCache({ forClipping: true });
    this.drawClipPathOnCache(ctx, clipPath as TCachedFabricObject);
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
      !this.clipPath.absolutePositioned
        ? multiplyTransformMatrices(
            invertTransform(this.canvas.viewportTransform),
            t
          )
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
    this.active = false;
    this._resetShadow();
    const shape = this.finalizeShape();
    if (shape) {
      shape.set({
        canvas: this.canvas,
        shadow: this.shadow ? new Shadow(this.shadow) : undefined,
        clipPath: await this.createClipPath(shape),
      });
      sendObjectToPlane(shape, undefined, this.canvas.viewportTransform);
      shape.setCoords();
    }
    this.onEnd(shape);
  }
}
