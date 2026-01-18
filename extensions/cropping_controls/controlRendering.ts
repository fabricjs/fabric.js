import {
  type ControlRenderingStyleOverride,
  type InteractiveFabricObject,
  util,
  type Control,
} from 'fabric';

const { degreesToRadians } = util;

/**
 * Render a line control for middle edge handles.
 * Uses Control.angle for orientation, cornerStrokeColor outline and cornerColor fill.
 * @param {CanvasRenderingContext2D} ctx context to render on
 * @param {Number} left x coordinate where the control center should be
 * @param {Number} top y coordinate where the control center should be
 * @param {Object} styleOverride override for FabricObject controls style
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 */
export function renderEdgeControl(
  this: Control,
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  styleOverride: ControlRenderingStyleOverride,
  fabricObject: InteractiveFabricObject,
) {
  ctx.save();
  const { stroke, xSize, ySize } = this.commonRenderProps(
      ctx,
      left,
      top,
      fabricObject,
      styleOverride,
    ),
    length = Math.max(xSize, ySize),
    thickness = Math.min(xSize, ySize),
    halfLength = length / 2;

  const borderOffset = (fabricObject.borderScaleFactor || 1) / 2;
  if (this.x === -0.5) ctx.translate(-borderOffset, 0);
  else if (this.x === 0.5) ctx.translate(borderOffset, 0);
  if (this.y === -0.5) ctx.translate(0, -borderOffset);
  else if (this.y === 0.5) ctx.translate(0, borderOffset);

  ctx.rotate(degreesToRadians(this.angle));
  ctx.lineCap = 'round';

  if (stroke) {
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(-halfLength, 0);
    ctx.lineTo(halfLength, 0);
    ctx.stroke();
  }

  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = stroke ? thickness - 4 : thickness;
  ctx.beginPath();
  ctx.moveTo(-halfLength, 0);
  ctx.lineTo(halfLength, 0);
  ctx.stroke();
  ctx.restore();
}

/**
 * Render an L-shaped control for cropping corners.
 * Same style as renderEdgeControl but draws two perpendicular lines.
 * @param {CanvasRenderingContext2D} ctx context to render on
 * @param {Number} left x coordinate where the control center should be
 * @param {Number} top y coordinate where the control center should be
 * @param {Object} styleOverride override for FabricObject controls style
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 */
export function renderCornerControl(
  this: Control,
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  styleOverride: ControlRenderingStyleOverride,
  fabricObject: InteractiveFabricObject,
) {
  ctx.save();
  const { stroke, xSize, ySize } = this.commonRenderProps(
      ctx,
      left,
      top,
      fabricObject,
      styleOverride,
    ),
    length = Math.max(xSize, ySize),
    thickness = Math.min(xSize, ySize);

  const borderOffset = (fabricObject.borderScaleFactor || 1) / 2;
  if (this.x === -0.5) ctx.translate(-borderOffset, 0);
  else if (this.x === 0.5) ctx.translate(borderOffset, 0);
  if (this.y === -0.5) ctx.translate(0, -borderOffset);
  else if (this.y === 0.5) ctx.translate(0, borderOffset);

  ctx.rotate(degreesToRadians(this.angle));
  ctx.lineCap = 'round';

  if (stroke) {
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, length);
    ctx.stroke();
  }

  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = stroke ? thickness - 4 : thickness;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, length);
  ctx.stroke();

  ctx.restore();
}
