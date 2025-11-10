import type { DistanceGuide } from '..';

export type DrawTextProps = {
  ctx: CanvasRenderingContext2D;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
export function drawText(this: DistanceGuide, props: DrawTextProps) {
  const { text, x, y, ctx, width, height } = props;
  const scale = 1 / this.canvas.getZoom();

  const fontSize = this.fontSize * scale;
  const padding = this.padding * scale;
  ctx.font = fontSize + 'px ' + this.fontFamily;

  ctx.fillStyle = this.color;
  ctx.fillRect(x, y, padding * 2 + width, padding * 2 + height);
  ctx.fillStyle = this.fillStyle;
  ctx.fillText(text, x + padding, y + padding + height / 2);
}
