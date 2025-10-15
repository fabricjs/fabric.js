import { Color } from '../color/Color';
import type { Point } from '../Point';
import { Shadow } from '../Shadow';
import { Circle } from '../shapes/Circle';
import { Group } from '../shapes/Group';
import { getRandomInt } from '../util/internals/getRandomInt';
import type { Canvas } from '../canvas/Canvas';
import { BaseBrush } from './BaseBrush';
import type { CircleBrushPoint } from './typedefs';
import { CENTER } from '../constants';

export class CircleBrush extends BaseBrush {
  /**
   * Width of a brush
   * @type Number
   */
  width = 10;

  declare points: CircleBrushPoint[];

  constructor(canvas: Canvas) {
    super(canvas);
    this.points = [];
  }

  /**
   * Invoked inside on mouse down and mouse move
   * @param {Point} pointer
   */
  drawDot(pointer: Point) {
    const point = this.addPoint(pointer),
      ctx = this.canvas.contextTop;
    this._saveAndTransform(ctx);
    this.dot(ctx, point);
    ctx.restore();
  }

  dot(ctx: CanvasRenderingContext2D, point: CircleBrushPoint) {
    ctx.fillStyle = point.fill;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
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
  _render() {
    const ctx = this.canvas.contextTop,
      points = this.points;
    this._saveAndTransform(ctx);
    for (let i = 0; i < points.length; i++) {
      this.dot(ctx, points[i]);
    }
    ctx.restore();
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
      this.canvas.clearContext(this.canvas.contextTop);
      this.addPoint(pointer);
      this._render();
    } else {
      this.drawDot(pointer);
    }
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;

    const circles: Circle[] = [];

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i],
        circle = new Circle({
          radius: point.radius,
          left: point.x,
          top: point.y,
          originX: CENTER,
          originY: CENTER,
          fill: point.fill,
        });

      this.shadow && (circle.shadow = new Shadow(this.shadow));

      circles.push(circle);
    }
    const group = new Group(circles, { canvas: this.canvas });

    this.canvas.fire('before:path:created', { path: group });
    this.canvas.add(group);
    this.canvas.fire('path:created', { path: group });

    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
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
}
