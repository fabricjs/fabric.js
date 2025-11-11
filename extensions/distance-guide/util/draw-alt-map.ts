import type { DistanceGuide } from '..';

export function drawAltMap(this: DistanceGuide) {
  const altMap = this.altMap;
  if (!altMap) return;
  const { points, origin, target } = altMap;

  const ctx = this.canvas.getTopContext();
  const vpt = this.canvas.viewportTransform;
  ctx.save();
  ctx.transform(...vpt);
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.lineWidth / this.canvas.getZoom();
  ctx.textBaseline = 'middle';

  ctx.strokeRect(origin.left, origin.top, origin.width, origin.height);
  ctx.strokeRect(target.left, target.top, target.width, target.height);

  for (const item of points) {
    this.drawLineMap({ ctx, ...item });
  }

  ctx.restore();
}
