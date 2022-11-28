import { fabric } from '../../HEADER';
import { Color } from '../color';
import { Point } from '../point.class';
import { Circle } from '../shapes/circle.class';
import { FabricObject } from '../shapes/fabricObject.class';
import { Group } from '../shapes/group.class';
import { getRandomInt } from '../util/internals';
import { Canvas } from '../__types__';
import { BaseBrush } from './base_brush.class';

export type CircleBrushPoint = {
  x: number;
  y: number;
  radius: number;
  fill: string;
};

export class CircleBrush extends BaseBrush<FabricObject> {
  /**
   * Width of a brush
   * @type Number
   * @default
   */
  width = 10;

  points: CircleBrushPoint[];

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

  /**
   * Invoked on mouse down
   */
  onMouseDown(pointer: Point) {
    this.points = [];
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();
    this.drawDot(pointer);
  }

  /**
   * Render the full state of the brush
   * @private
   */
  protected _render(ctx: CanvasRenderingContext2D) {
    const points = this.points;
    for (let i = 0; i < points.length; i++) {
      this.dot(ctx, points[i]);
    }
  }

  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(pointer: Point) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    if (this.needsFullRender()) {
      this.addPoint(pointer);
      this.render();
    } else {
      this.drawDot(pointer);
    }
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    this.finalize();
  }
}

fabric.CircleBrush = CircleBrush;
