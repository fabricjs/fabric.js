import type { Canvas } from 'fabric';
import { Point } from 'fabric';
import type { HorizontalLine, VerticalLine } from '../typedefs';
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
export function drawPointList(
  canvas: Canvas,
  list: Array<VerticalLine | HorizontalLine>,
) {
  const arr = list.map((item) => {
    const isVertical = 'y2' in item;
    const x = isVertical ? item.x : item.x1;
    const y = isVertical ? item.y1 : item.y;
    return new Point(x, y);
  });
  drawPoint(canvas, arr);
}

export function drawVerticalLine(canvas: Canvas, coords: VerticalLine) {
  const x = coords.x;
  const origin = new Point(x, coords.y1);
  const target = new Point(x, coords.y2);
  drawLine(canvas, origin, target);
}

export function drawHorizontalLine(canvas: Canvas, coords: HorizontalLine) {
  const y = coords.y;
  const origin = new Point(coords.x1, y);
  const target = new Point(coords.x2, y);
  drawLine(canvas, origin, target);
}
