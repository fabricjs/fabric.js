import type { Canvas } from 'fabric';
import { Point } from 'fabric';
import type { LineProps } from '../typedefs';
import { aligningLineConfig } from '../constant';

function drawLine(canvas: Canvas, origin: Point, target: Point) {
  const { width, color } = aligningLineConfig;
  const ctx = canvas.getSelectionContext();
  const viewportTransform = canvas.viewportTransform;
  const zoom = canvas.getZoom();
  ctx.save();
  ctx.transform(...viewportTransform);
  ctx.lineWidth = width / zoom;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(target.x, target.y);
  ctx.stroke();
  drawX(ctx, zoom, origin);
  drawX(ctx, zoom, target);
  ctx.restore();
}

const xSize = 2.4;
function drawX(ctx: CanvasRenderingContext2D, zoom: number, point: Point) {
  const size = xSize / zoom;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.beginPath();
  ctx.moveTo(-size, -size);
  ctx.lineTo(size, size);
  ctx.moveTo(size, -size);
  ctx.lineTo(-size, size);
  ctx.stroke();
  ctx.restore();
}
function drawPoint(canvas: Canvas, arr: Point[]) {
  const { width, color } = aligningLineConfig;
  const ctx = canvas.getSelectionContext();
  const viewportTransform = canvas.viewportTransform;
  const zoom = canvas.getZoom();
  ctx.save();
  ctx.transform(...viewportTransform);
  ctx.lineWidth = width / zoom;
  ctx.strokeStyle = color;
  for (const item of arr) drawX(ctx, zoom, item);
  ctx.restore();
}
export function drawPointList(canvas: Canvas, list: LineProps[]) {
  const arr = list.map((item) => item.target);
  drawPoint(canvas, arr);
}

export function drawVerticalLine(canvas: Canvas, options: LineProps) {
  const { origin, target } = options;
  const o = new Point(target.x, origin.y);
  drawLine(canvas, o, target);
}

export function drawHorizontalLine(canvas: Canvas, options: LineProps) {
  const { origin, target } = options;
  const o = new Point(origin.x, target.y);
  drawLine(canvas, o, target);
}
