import {
  type ControlRenderingStyleOverride,
  type InteractiveFabricObject,
  util,
  type Control,
} from 'fabric';

const { degreesToRadians } = util;

/**
 * Render a control for the main corners of a cropping image
 * This function is written to respect object properties like transparentCorners, cornerSize
 * cornerColor, cornerStrokeColor
 * plus the addition of offsetY and offsetX.
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
  const { stroke, xSize, ySize, opName } = this.commonRenderProps(
      ctx,
      left,
      top,
      fabricObject,
      styleOverride,
    ),
    xSizeBy2 = xSize / 2,
    ySizeBy2 = ySize / 2;
  //  angle is relative to canvas plane
  ctx.rotate(degreesToRadians(this.angle));
  ctx.beginPath();
  ctx.moveTo(-ySizeBy2, 0);
  ctx.lineTo(-ySizeBy2, xSizeBy2);
  ctx.lineTo(ySizeBy2, xSizeBy2);
  ctx.lineTo(ySizeBy2, ySizeBy2);
  ctx.lineTo(xSizeBy2, ySizeBy2);
  ctx.lineTo(xSizeBy2, -ySizeBy2);
  ctx.lineTo(-ySizeBy2, -ySizeBy2);
  ctx.closePath();
  ctx[opName]();
  stroke && ctx.stroke();
  ctx.restore();
}
