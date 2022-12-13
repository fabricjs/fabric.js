import { fabric } from '../../HEADER';
import { Color } from '../color';
import { ModifierKey, TEvent } from '../EventTypeDefs';
import { Point } from '../point.class';
import { Path } from '../shapes/path.class';
import { PathData } from '../typedefs';
import { getSmoothPathFromPoints, joinPath } from '../util/path';
import { Canvas } from '../__types__';
import { BaseBrush, TBrushEventData } from './base_brush.class';

/**
 * @param {PathData} pathData
 * @returns {boolean}
 */
function isEmptyPath(pathData: PathData): boolean {
  return joinPath(pathData) === 'M 0 0 Q 0 0 0 0 L 0 0';
}

export class PencilBrush extends BaseBrush<Path> {
  /**
   * Discard points that are less than `decimate` pixel distant from each other
   * @type Number
   * @default 0.4
   */
  decimate = 0.4;

  /**
   * Draws a straight line between last recorded point to current pointer
   * Used for `shift` functionality
   *
   * @type boolean
   * @default false
   */
  drawStraightLine = false;

  /**
   * The event modifier key that makes the brush draw a straight line.
   * If `null` or 'none' or any other string that is not a modifier key the feature is disabled.
   * @type {ModifierKey | undefined | null}
   */
  straightLineKey: ModifierKey | undefined | null = 'shiftKey';

  private _points: Point[];
  protected oldEnd?: Point;

  constructor(canvas: Canvas) {
    super(canvas);
    this._points = [];
  }

  protected needsFullRender(alphaShouldRedraw = true) {
    return (
      super.needsFullRender() ||
      (alphaShouldRedraw && new Color(this.color).getAlpha() < 1) ||
      (this.drawStraightLine && this._points.length > 1)
    );
  }

  /**
   * we pick the point between p1 & p2 as the end point and p1 as our control point.
   */
  static drawSegment(ctx: CanvasRenderingContext2D, p1: Point, p2: Point) {
    const midPoint = p1.midPointFrom(p2);
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    return midPoint;
  }

  /**
   * Invoked on mouse down
   * @param {Point} pointer
   */
  onMouseDown(pointer: Point, ev: TBrushEventData) {
    super.onMouseDown(pointer, ev);
    if (!this.canvas._isMainEvent(ev.e)) {
      return;
    }
    this.drawStraightLine =
      !!this.straightLineKey && ev.e[this.straightLineKey];
    this._prepareForDrawing(pointer);
    // capture coordinates immediately
    // this allows to draw dots (when movement never occurs)
    this._addPoint(pointer);
    this.render();
  }

  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(pointer: Point, { e }: TEvent) {
    if (!this.canvas._isMainEvent(e)) {
      return;
    }
    this.drawStraightLine = !!this.straightLineKey && e[this.straightLineKey];
    this.drawStraightLine && (this.oldEnd = undefined);
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    this._addPoint(pointer) && this._points.length > 1 && this.onPointAdded();
  }

  onMouseUp({ e }: TEvent) {
    if (!this.canvas._isMainEvent(e)) {
      return true;
    }
    this.drawStraightLine = false;
    this.oldEnd = undefined;
    this.canvas.contextTop.closePath();
    this.finalize();
  }

  /**
   * @param {Point} pointer Actual mouse position related to the canvas.
   */
  protected _prepareForDrawing(pointer: Point) {
    this._reset();
    this._addPoint(pointer);
    this.canvas.contextTop.moveTo(pointer.x, pointer.y);
  }

  /**
   * @param {Point} point Point to be added to points array
   */
  protected _addPoint(point: Point) {
    if (
      this._points.length > 1 &&
      point.eq(this._points[this._points.length - 1])
    ) {
      return false;
    }
    if (this.drawStraightLine && this._points.length > 1) {
      this._points.pop();
    }
    this._points.push(point);
    return true;
  }

  protected onPointAdded() {
    if (this.needsFullRender()) {
      this.render();
    } else {
      this._renderCurve();
    }
  }

  /**
   * Clear points array and set contextTop canvas style.
   */
  protected _reset() {
    this._points = [];
    this._setBrushStyles(this.canvas.contextTop);
    this._setShadow();
  }

  /**
   * draw the curve update
   */
  protected _renderCurve(
    ctx: CanvasRenderingContext2D = this.canvas.contextTop
  ) {
    const points = this._points,
      length = points.length;
    ctx.save();
    this.transform(ctx);
    if (this.oldEnd) {
      ctx.beginPath();
      ctx.moveTo(this.oldEnd.x, this.oldEnd.y);
    }
    this.oldEnd = PencilBrush.drawSegment(
      ctx,
      points[length - 2],
      points[length - 1]
    );
    ctx.stroke();
    this._drawClipPath(ctx, this.clipPath);
    ctx.restore();
  }

  /**
   * Draw a smooth path on the topCanvas using quadraticCurveTo
   * @private
   * @param {CanvasRenderingContext2D} ctx
   */
  protected _render(ctx: CanvasRenderingContext2D) {
    let p1 = this._points[0],
      p2 = this._points[1];
    ctx.beginPath();
    //if we only have 2 points in the path and they are the same
    //it means that the user only clicked the canvas without moving the mouse
    //then we should be drawing a dot. A path isn't drawn between two identical dots
    //that's why we set them apart a bit
    if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
      const width = this.width / 1000;
      p1.x -= width;
      p2.x += width;
    }
    ctx.moveTo(p1.x, p1.y);

    for (let i = 1; i < this._points.length; i++) {
      PencilBrush.drawSegment(ctx, p1, p2);
      p1 = this._points[i];
      p2 = this._points[i + 1];
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  /**
   * Decimate points array with the decimate value
   */
  decimatePoints(points: Point[], distance: number) {
    if (points.length <= 2) {
      return points;
    }
    let lastPoint = points[0],
      cDistance;
    const zoom = this.canvas.getZoom(),
      adjustedDistance = Math.pow(distance / zoom, 2),
      l = points.length - 1,
      newPoints = [lastPoint];
    for (let i = 1; i < l - 1; i++) {
      cDistance =
        Math.pow(lastPoint.x - points[i].x, 2) +
        Math.pow(lastPoint.y - points[i].y, 2);
      if (cDistance >= adjustedDistance) {
        lastPoint = points[i];
        newPoints.push(lastPoint);
      }
    }
    // Add the last point from the original line to the end of the array.
    // This ensures decimate doesn't delete the last point on the line, and ensures the line is > 1 point.
    newPoints.push(points[l]);
    return newPoints;
  }

  /**
   * Converts points to path
   * @param {Point[]} points Array of points
   * @return {PathData} path commands
   */
  getPathFromPoints(points: Point[]): PathData {
    const correction = this.width / 1000;
    return getSmoothPathFromPoints(points, correction);
  }

  /**
   * Creates a Path object to add on canvas
   * @return {Path} Path to add on canvas
   */
  protected finalizeShape() {
    const pathData = this.getPathFromPoints(
      this.decimate
        ? this.decimatePoints(this._points, this.decimate)
        : this._points
    );
    if (isEmptyPath(pathData)) {
      // do not create 0 width/height paths, as they are
      // rendered inconsistently across browsers
      // Firefox 4, for example, renders a dot,
      // whereas Chrome 10 renders nothing
      return;
    }
    return new Path(pathData, {
      fill: null,
      stroke: this.color,
      strokeWidth: this.width,
      strokeLineCap: this.strokeLineCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeLineJoin: this.strokeLineJoin,
      strokeDashArray: this.strokeDashArray,
    });
  }

  protected async finalize() {
    if (this.shadow) {
      this.shadow.affectStroke = true;
    }
    return super.finalize();
  }
}

fabric.PencilBrush = PencilBrush;
