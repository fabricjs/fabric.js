import { Color } from '../color/Color';
import type { Point } from '../Point';
import type { Shadow } from '../Shadow';
import type { Canvas } from '../canvas/Canvas';
import type { TBrushEventData } from './typedefs';

/**
 * @see {@link http://fabric5.fabricjs.com/freedrawing|Freedrawing demo}
 */
export abstract class BaseBrush {
  /**
   * Color of a brush
   * @type String
   */
  color = 'rgb(0, 0, 0)';

  /**
   * Width of a brush, has to be a Number, no string literals
   * @type Number
   */
  width = 1;

  /**
   * Shadow object representing shadow of this shape.
   * <b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
   * "shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12
   * @type Shadow
   */
  shadow: Shadow | null = null;

  /**
   * Line endings style of a brush (one of "butt", "round", "square")
   * @type String
   */
  strokeLineCap: CanvasLineCap = 'round';

  /**
   * Corner style of a brush (one of "bevel", "round", "miter")
   * @type String
   */
  strokeLineJoin: CanvasLineJoin = 'round';

  /**
   * Maximum miter length (used for strokeLineJoin = "miter") of a brush's
   * @type Number
   */
  strokeMiterLimit = 10;

  /**
   * Stroke Dash Array.
   * @type Array
   */
  strokeDashArray: number[] | null = null;

  /**
   * When `true`, the free drawing is limited to the whiteboard size. Default to false.
   * @type Boolean
   * @default false
   */

  limitedToCanvasSize = false;

  /**
   * @todo add type
   */
  declare canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  abstract _render(): void;
  abstract onMouseDown(pointer: Point, ev: TBrushEventData): void;
  abstract onMouseMove(pointer: Point, ev: TBrushEventData): void;
  /**
   * @returns true if brush should continue blocking interaction
   */
  abstract onMouseUp(ev: TBrushEventData): boolean | void;

  /**
   * Sets brush styles
   * @private
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = this.strokeLineCap;
    ctx.miterLimit = this.strokeMiterLimit;
    ctx.lineJoin = this.strokeLineJoin;
    ctx.setLineDash(this.strokeDashArray || []);
  }

  /**
   * Sets the transformation on given context
   * @param {CanvasRenderingContext2D} ctx context to render on
   * @private
   */
  protected _saveAndTransform(ctx: CanvasRenderingContext2D) {
    const v = this.canvas.viewportTransform;
    ctx.save();
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
  }

  protected needsFullRender() {
    const color = new Color(this.color);
    return color.getAlpha() < 1 || !!this.shadow;
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
  protected _resetShadow() {
    const ctx = this.canvas.contextTop;

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
}
