import {
  type ControlRenderingStyleOverride,
  type InteractiveFabricObject,
  util,
  type Control,
} from 'fabric';

const { degreesToRadians } = util;
const twoMathPi = Math.PI * 2;

/**
 * Render a circle control with explicit stroke width.
 * Uses borderScaleFactor * 2 for consistent stroke across controls.
 */
export function renderTableCircleControl(
  this: Control,
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  styleOverride: ControlRenderingStyleOverride,
  fabricObject: InteractiveFabricObject,
) {
  ctx.save();
  const { stroke, xSize } = this.commonRenderProps(
      ctx,
      left,
      top,
      fabricObject,
      styleOverride,
    ),
    radius = xSize / 2,
    strokeWidth = fabricObject.borderScaleFactor * 2;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, twoMathPi, false);
  ctx.fill();

  if (stroke) {
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render a rounded segment control (pill shape).
 * Draws a thick line with round caps, with border matching borderScaleFactor.
 */
export function renderTableSegmentControl(
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
    halfLength = length / 2,
    strokeWidth = fabricObject.borderScaleFactor * 2;

  ctx.rotate(degreesToRadians(this.angle));
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-halfLength, 0);
  ctx.lineTo(halfLength, 0);

  if (stroke) {
    ctx.lineWidth = thickness;
    ctx.stroke();
  }

  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = stroke ? thickness - strokeWidth * 2 : thickness;
  ctx.stroke();
  ctx.restore();
}
