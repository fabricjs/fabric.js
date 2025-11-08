import { Point } from 'fabric';
import type { AligningGuidelines } from '..';

export function drawLine(
  this: AligningGuidelines,
  origin: Point,
  target: Point,
) {
  const ctx = this.canvas.getTopContext();
  const viewportTransform = this.canvas.viewportTransform;
  const zoom = this.canvas.getZoom();
  ctx.save();
  ctx.transform(...viewportTransform);
  ctx.lineWidth = this.width / zoom;
  if (this.lineDash) ctx.setLineDash(this.lineDash);
  ctx.strokeStyle = this.color;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(target.x, target.y);
  ctx.stroke();
  if (this.lineDash) ctx.setLineDash([]);

  this.drawX(origin, -1);
  this.drawX(target, 1);
  ctx.restore();
}

export function drawX(this: AligningGuidelines, point: Point, _: number) {
  const ctx = this.canvas.getTopContext();
  const zoom = this.canvas.getZoom();
  const size = this.xSize / zoom;
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
function drawPoint(this: AligningGuidelines, arr: Point[]) {
  const ctx = this.canvas.getTopContext();
  const viewportTransform = this.canvas.viewportTransform;
  const zoom = this.canvas.getZoom();
  ctx.save();
  ctx.transform(...viewportTransform);
  ctx.lineWidth = this.width / zoom;
  ctx.strokeStyle = this.color;
  for (const item of arr) this.drawX(item, 0);
  ctx.restore();
}

export function drawPointList(this: AligningGuidelines) {
  const list = [];
  if (!this.closeVLine) {
    for (const v of this.verticalLines) list.push(JSON.parse(v));
  }
  if (!this.closeHLine) {
    for (const h of this.horizontalLines) list.push(JSON.parse(h));
  }
  const arr = list.map((item) => item.target);
  drawPoint.call(this, arr);
}

export function drawVerticalLine(this: AligningGuidelines) {
  if (this.closeVLine) return;

  for (const v of this.verticalLines) {
    const { origin, target } = JSON.parse(v);
    const o = new Point(target.x, origin.y);
    this.drawLine(o, target);
  }
}

export function drawHorizontalLine(this: AligningGuidelines) {
  if (this.closeHLine) return;

  for (const v of this.horizontalLines) {
    const { origin, target } = JSON.parse(v);
    const o = new Point(origin.x, target.y);
    this.drawLine(o, target);
  }
}
