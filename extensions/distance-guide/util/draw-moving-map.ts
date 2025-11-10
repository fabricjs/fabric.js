import type { DistanceGuide } from '..';
import type { MovingMapLine } from '../typedefs';

export function drawMovingMap(this: DistanceGuide) {
  const movingMap = this.movingMap;
  if (!movingMap) return;
  const { xLines, yLines } = movingMap;
  const ctx = this.canvas.getTopContext();
  const vpt = this.canvas.viewportTransform;
  const scale = 1 / this.canvas.getZoom();

  ctx.save();
  ctx.transform(...vpt);
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.lineWidth * scale;
  ctx.textBaseline = 'middle';

  const space = this.space * scale;
  const height = this.fontSize * scale;
  const padding = this.padding * scale;
  for (const item of xLines) {
    const text = Math.abs(item.target.x - item.origin.x).toFixed(0);
    ctx.font = this.fontSize + 'px ' + this.fontFamily;
    const width = ctx.measureText(text).width * scale;
    const x = (item.origin.x + item.target.x - width) / 2 - padding;
    const y = item.origin.y + space;

    drawLine(ctx, item);
    this.drawText({ text, x, y, ctx, width, height });
  }
  for (const item of yLines) {
    const text = Math.abs(item.target.y - item.origin.y).toFixed(0);
    ctx.font = this.fontSize + 'px ' + this.fontFamily;
    const width = ctx.measureText(text).width * scale;
    const x = item.origin.x + space;
    const y = (item.origin.y + item.target.y - height) / 2 - padding;

    drawLine(ctx, item);
    this.drawText({ text, x, y, ctx, width, height });
  }

  ctx.restore();
}

function drawLine(ctx: CanvasRenderingContext2D, line: MovingMapLine) {
  const { origin, target } = line;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(target.x, target.y);
  ctx.stroke();
}
