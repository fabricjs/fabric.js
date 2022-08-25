//@ts-nocheck

import { fabric } from "../../HEADER";
import { Color } from "../color";
import { Point } from "../point.class";
import { getRandomInt } from "../util";
import { BaseBrush } from "./base_brush.class";


/**
 * @todo remove transient
 */
const { Circle, Group, Shadow } = fabric;


export class CircleBrush extends BaseBrush {

  /**
   * Width of a brush
   * @type Number
   * @default
   */
  width = 10

  /**
   * Constructor
   * @param {Canvas} canvas
   * @return {CircleBrush} Instance of a circle brush
   */
  constructor(canvas) {
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

  dot(ctx, point) {
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
    this.points.length = 0;
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();
    this.drawDot(pointer);
  }

  /**
   * Render the full state of the brush
   * @private
   */
  _render() {
    const ctx = this.canvas.contextTop, points = this.points;
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
    }
    else {
      this.drawDot(pointer);
    }
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;

    const circles = [];

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i],
        circle = new Circle({
          radius: point.radius,
          left: point.x,
          top: point.y,
          originX: 'center',
          originY: 'center',
          fill: point.fill
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
  addPoint(pointer: Point) {
    const pointerPoint = new Point(pointer),

      circleRadius = getRandomInt(
        Math.max(0, this.width - 20), this.width + 20) / 2,

      circleColor = new Color(this.color)
        .setAlpha(getRandomInt(0, 100) / 100)
        .toRgba();

    pointerPoint.radius = circleRadius;
    pointerPoint.fill = circleColor;

    this.points.push(pointerPoint);

    return pointerPoint;
  }
}

fabric.CircleBrush = CircleBrush;