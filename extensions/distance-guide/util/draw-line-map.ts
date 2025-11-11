import type { DistanceGuide } from '..';
import type { DrawLineMapProps } from '../typedefs';

export function drawLineMap(this: DistanceGuide, props: DrawLineMapProps) {
  const { target, ctx, xPoint, yPoint } = props;
  const scale = 1 / this.canvas.getZoom();

  // solid
  ctx.setLineDash([]);
  ctx.beginPath();
  // h
  ctx.moveTo(xPoint.x, xPoint.y);
  ctx.lineTo(target.x, xPoint.y);
  ctx.stroke();
  // v
  ctx.beginPath();
  ctx.moveTo(yPoint.x, yPoint.y);
  ctx.lineTo(yPoint.x, target.y);
  ctx.stroke();

  // dash
  const lineDash = this.lineDash.map((x) => x * scale);
  const lineDashOffset = this.lineDashOffset * scale;
  ctx.setLineDash(lineDash);
  ctx.lineDashOffset = lineDashOffset;
  ctx.beginPath();
  ctx.moveTo(target.x, xPoint.y);
  ctx.lineTo(target.x, target.y);
  ctx.lineTo(yPoint.x, target.y);
  ctx.stroke();

  const disX = target.x - xPoint.x;
  const disY = target.y - yPoint.y;
  const xTxt = (+Math.abs(disX).toFixed(1)).toString();
  const yTxt = (+Math.abs(disY).toFixed(1)).toString();
  const height = this.fontSize * scale;
  ctx.font = this.fontSize + 'px ' + this.fontFamily;
  const xTxtWidth = ctx.measureText(xTxt).width * scale;
  const yTxtWidth = ctx.measureText(yTxt).width * scale;
  const space = this.space * scale;
  const padding = this.padding * scale;

  if (disX != 0) {
    this.drawText({
      ctx,
      text: xTxt,
      x: xPoint.x + disX / 2 - xTxtWidth / 2 - padding,
      y: xPoint.y + space,
      width: xTxtWidth,
      height,
    });
  }
  if (disY != 0) {
    this.drawText({
      ctx,
      text: yTxt,
      x: yPoint.x + space,
      y: yPoint.y + disY / 2 - height / 2 - padding,
      width: yTxtWidth,
      height,
    });
  }
}
