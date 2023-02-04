import type { Canvas } from '../canvas/Canvas';
import { Color } from '../color/Color';
import { TPointerEventInfo } from '../EventTypeDefs';
import { TFabricEvent } from '../FabricEvent';
import { Point } from '../Point';
import { Circle } from '../shapes/Circle';
import { Group } from '../shapes/Group';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { getRandomInt } from '../util/internals';
import { SimpleBrush } from './SimpleBrush';

export type CircleBrushPoint = {
  x: number;
  y: number;
  radius: number;
  fill: string;
};

export class CircleBrush extends SimpleBrush<FabricObject> {
  /**
   * Width of a brush
   * @type Number
   * @default
   */
  width = 10;

  declare points: CircleBrushPoint[];

  constructor(canvas: Canvas) {
    super(canvas);
    this.points = [];
  }

  /**
   * @param {Object} pointer
   * @return {Point} Just added pointer point
   */
  addPoint({ x, y }: Point) {
    const pointerPoint: CircleBrushPoint = {
      x,
      y,
      radius: getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
      fill: new Color(this.color).setAlpha(getRandomInt(0, 100) / 100).toRgba(),
    };

    this.points.push(pointerPoint);

    return pointerPoint;
  }

  /**
   * Invoked inside on mouse down and mouse move
   * @param {Point} pointer
   */
  drawDot(pointer: Point) {
    const point = this.addPoint(pointer),
      ctx = this.canvas.contextTop;
    ctx.save();
    this.transform(ctx);
    this.dot(ctx, point);
    this._drawClipPath(ctx, this.clipPath);
    ctx.restore();
  }

  dot(ctx: CanvasRenderingContext2D, point: CircleBrushPoint) {
    ctx.fillStyle = point.fill;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  protected finalizeShape() {
    const circles = [];
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      circles.push(
        new Circle({
          radius: point.radius,
          left: point.x,
          top: point.y,
          originX: 'center',
          originY: 'center',
          fill: point.fill,
        })
      );
    }
    return new Group(circles);
  }

  down(ev: TFabricEvent<TPointerEventInfo>) {
    super.down(ev);
    this.points = [];
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();
    this.drawDot(ev.pointer);
  }

  protected _render(ctx: CanvasRenderingContext2D) {
    const points = this.points;
    for (let i = 0; i < points.length; i++) {
      this.dot(ctx, points[i]);
    }
  }

  move(ev: TFabricEvent<TPointerEventInfo>) {
    super.move(ev);
    const { pointer } = ev;
    if (this.needsFullRender()) {
      this.addPoint(pointer);
      this.render();
    } else {
      this.drawDot(pointer);
    }
  }

  up(ev: TFabricEvent<TPointerEventInfo>) {
    super.up(ev);
    this.finalize();
  }
}
