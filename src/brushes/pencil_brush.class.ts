//@ts-nocheck

import { Point } from "../point.class";
import { Shadow } from "../shadow.class";
import { Path } from "../shapes";
import { getSmoothPathFromPoints, joinPath } from "../util";
import { BaseBrush } from "./base_brush.class";

/**
 * @private
 * @param {(string|number)[][]} pathData SVG path commands
 * @returns {boolean}
 */
export function isEmptySVGPath(pathData) {
  return joinPath(pathData) === 'M 0 0 Q 0 0 0 0 L 0 0';
}

/**
 * PencilBrush class
 * @class PencilBrush
 * @extends BaseBrush
 */
export class PencilBrush extends BaseBrush {

  /**
   * Discard points that are less than `decimate` pixel distant from each other
   * @type Number
   * @default 0.4
   */
  decimate = 0.4

  /**
   * Draws a straight line between last recorded point to current pointer
   * Used for `shift` functionality
   *
   * @type boolean
   * @default false
   */
  drawStraightLine = false

  /**
   * The event modifier key that makes the brush draw a straight line.
   * If `null` or 'none' or any other string that is not a modifier key the feature is disabled.
   * @type {'altKey' | 'shiftKey' | 'ctrlKey' | 'none' | undefined | null}
   */
  straightLineKey = 'shiftKey'

  private _points: Point[]

  /**
   * Constructor
   * @param {Canvas} canvas
   * @return {PencilBrush} Instance of a pencil brush
   */
  constructor(canvas) {
    super(canvas);
    this._points = [];
  }

  needsFullRender() {
    return super.needsFullRender() || this._hasStraightLine;
  }

  /**
   * Invoked inside on mouse down and mouse move
   * @param {Object} pointer
   */
  static _drawSegment(ctx, p1, p2) {
    const midPoint = p1.midPointFrom(p2);
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    return midPoint;
  }

  /**
   * Invoked on mouse down
   * @param {Object} pointer
   */
  onMouseDown(pointer, options) {
    if (!this.canvas._isMainEvent(options.e)) {
      return;
    }
    this.drawStraightLine = options.e[this.straightLineKey];
    this._prepareForDrawing(pointer);
    // capture coordinates immediately
    // this allows to draw dots (when movement never occurs)
    this._captureDrawingPath(pointer);
    this._render();
  }

  /**
   * Invoked on mouse move
   * @param {Object} pointer
   */
  onMouseMove(pointer, options) {
    if (!this.canvas._isMainEvent(options.e)) {
      return;
    }
    this.drawStraightLine = options.e[this.straightLineKey];
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    if (this._captureDrawingPath(pointer) && this._points.length > 1) {
      if (this.needsFullRender()) {
        // redraw curve
        // clear top canvas
        this.canvas.clearContext(this.canvas.contextTop);
        this._render();
      }
      else {
        const points = this._points, length = points.length, ctx = this.canvas.contextTop;
        // draw the curve update
        this._saveAndTransform(ctx);
        if (this.oldEnd) {
          ctx.beginPath();
          ctx.moveTo(this.oldEnd.x, this.oldEnd.y);
        }
        this.oldEnd = PencilBrush._drawSegment(ctx, points[length - 2], points[length - 1], true);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp(options) {
    if (!this.canvas._isMainEvent(options.e)) {
      return true;
    }
    this.drawStraightLine = false;
    this.oldEnd = undefined;
    this._finalizeAndAddPath();
    return false;
  }

  /**
   * @private
   * @param {Object} pointer Actual mouse position related to the canvas.
   */
  _prepareForDrawing(pointer) {

    const p = new Point(pointer);

    this._reset();
    this._addPoint(p);
    this.canvas.contextTop.moveTo(p.x, p.y);
  }

  /**
   * @private
   * @param {Point} point Point to be added to points array
   */
  _addPoint(point) {
    if (this._points.length > 1 && point.eq(this._points[this._points.length - 1])) {
      return false;
    }
    if (this.drawStraightLine && this._points.length > 1) {
      this._hasStraightLine = true;
      this._points.pop();
    }
    this._points.push(point);
    return true;
  }

  /**
   * Clear points array and set contextTop canvas style.
   * @private
   */
  _reset() {
    this._points = [];
    this._setBrushStyles(this.canvas.contextTop);
    this._setShadow();
    this._hasStraightLine = false;
  }

  /**
   * @private
   * @param {Object} pointer Actual mouse position related to the canvas.
   */
  _captureDrawingPath(pointer) {
    const pointerPoint = new Point(pointer);
    return this._addPoint(pointerPoint);
  }

  /**
   * Draw a smooth path on the topCanvas using quadraticCurveTo
   * @private
   * @param {CanvasRenderingContext2D} [ctx]
   */
  _render(ctx) {
    let i, len,
      p1 = this._points[0],
      p2 = this._points[1];
    ctx = ctx || this.canvas.contextTop;
    this._saveAndTransform(ctx);
    ctx.beginPath();
    //if we only have 2 points in the path and they are the same
    //it means that the user only clicked the canvas without moving the mouse
    //then we should be drawing a dot. A path isn't drawn between two identical dots
    //that's why we set them apart a bit
    if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
      const width = this.width / 1000;
      p1 = new Point(p1);
      p2 = new Point(p2);
      p1.x -= width;
      p2.x += width;
    }
    ctx.moveTo(p1.x, p1.y);

    for (i = 1, len = this._points.length; i < len; i++) {
      // we pick the point between pi + 1 & pi + 2 as the
      // end point and p1 as our control point.
      PencilBrush._drawSegment(ctx, p1, p2);
      p1 = this._points[i];
      p2 = this._points[i + 1];
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Converts points to SVG path
   * @param {Array} points Array of points
   * @return {(string|number)[][]} SVG path commands
   */
  convertPointsToSVGPath(points) {
    const correction = this.width / 1000;
    return getSmoothPathFromPoints(points, correction);
  }

  /**
   * Creates a Path object to add on canvas
   * @param {(string|number)[][]} pathData Path data
   * @return {Path} Path to add on canvas
   */
  createPath(pathData) {
    const path = new Path(pathData, {
      fill: null,
      stroke: this.color,
      strokeWidth: this.width,
      strokeLineCap: this.strokeLineCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeLineJoin: this.strokeLineJoin,
      strokeDashArray: this.strokeDashArray,
    });
    if (this.shadow) {
      this.shadow.affectStroke = true;
      path.shadow = new Shadow(this.shadow);
    }

    return path;
  }

  /**
   * Decimate points array with the decimate value
   */
  decimatePoints(points, distance) {
    if (points.length <= 2) {
      return points;
    }
    let zoom = this.canvas.getZoom(), adjustedDistance = Math.pow(distance / zoom, 2),
      i, l = points.length - 1, lastPoint = points[0], newPoints = [lastPoint],
      cDistance;
    for (i = 1; i < l - 1; i++) {
      cDistance = Math.pow(lastPoint.x - points[i].x, 2) + Math.pow(lastPoint.y - points[i].y, 2);
      if (cDistance >= adjustedDistance) {
        lastPoint = points[i];
        newPoints.push(lastPoint);
      }
    }
    /**
     * Add the last point from the original line to the end of the array.
     * This ensures decimate doesn't delete the last point on the line, and ensures the line is > 1 point.
     */
    newPoints.push(points[l]);
    return newPoints;
  }

  /**
   * On mouseup after drawing the path on contextTop canvas
   * we use the points captured to create an new fabric path object
   * and add it to the fabric canvas.
   */
  _finalizeAndAddPath() {
    const ctx = this.canvas.contextTop;
    ctx.closePath();
    if (this.decimate) {
      this._points = this.decimatePoints(this._points, this.decimate);
    }
    const pathData = this.convertPointsToSVGPath(this._points);
    if (isEmptySVGPath(pathData)) {
      // do not create 0 width/height paths, as they are
      // rendered inconsistently across browsers
      // Firefox 4, for example, renders a dot,
      // whereas Chrome 10 renders nothing
      this.canvas.requestRenderAll();
      return;
    }

    const path = this.createPath(pathData);
    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.fire('before:path:created', { path: path });
    this.canvas.add(path);
    this.canvas.requestRenderAll();
    path.setCoords();
    this._resetShadow();


    // fire event 'path' created
    this.canvas.fire('path:created', { path: path });
  }
}
