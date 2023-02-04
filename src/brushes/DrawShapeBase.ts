import { Point } from '../Point';
import { Shadow } from '../Shadow';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { SimpleBrush } from './SimpleBrush';

/**
 * Declarative shape drawing using pointer events
 */
export abstract class DrawShapeBase<
  T extends FabricObject
> extends SimpleBrush<T> {
  shape: T | undefined;
  stroke = '';
  fill = '';

  abstract create(): T;

  protected build() {
    this.shape = this.create();
    this.shape.set('canvas', this.canvas);
    this.setStyles();
  }

  setStyles() {
    this.shape?.set({
      stroke: this.stroke || this.color,
      fill: this.fill || this.color,
      strokeWidth: this.width,
      strokeLineCap: this.strokeLineCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeLineJoin: this.strokeLineJoin,
      strokeDashArray: this.strokeDashArray,
      shadow: this.shadow ? new Shadow(this.shadow) : undefined,
    });
  }

  protected finalizeShape() {
    const shape = this.shape;
    // we release the ref here and not in `finalize` (async) to avoid a race condition
    this.shape = undefined;
    return shape;
  }

  protected _setBrushStyles() {
    this.setStyles();
  }

  protected _render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.shape!.transform(ctx);
    this.shape!._render(ctx);
    ctx.restore();
  }
}
