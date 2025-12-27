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
  styleOverride = styleOverride || {};
  const xSize =
      this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize,
    ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize,
    transparentCorners =
      typeof styleOverride.transparentCorners !== 'undefined'
        ? styleOverride.transparentCorners
        : fabricObject.transparentCorners,
    stroke =
      !transparentCorners &&
      (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor),
    xSizeBy2 = xSize / 2,
    ySizeBy2 = ySize / 2;
  ctx.save();
  ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor || '';
  ctx.strokeStyle =
    styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor || '';
  ctx.translate(left, top);
  //  angle is relative to canvas plane
  const angle = fabricObject.getTotalAngle();
  ctx.rotate(degreesToRadians(angle + this.angle));
  ctx.beginPath();
  ctx.moveTo(-ySizeBy2, 0);
  ctx.lineTo(-ySizeBy2, xSizeBy2);
  ctx.lineTo(ySizeBy2, xSizeBy2);
  ctx.lineTo(ySizeBy2, ySizeBy2);
  ctx.lineTo(xSizeBy2, ySizeBy2);
  ctx.lineTo(xSizeBy2, -ySizeBy2);
  ctx.lineTo(-ySizeBy2, -ySizeBy2);
  ctx.closePath();
  transparentCorners || ctx.fill();
  stroke && ctx.stroke();
  ctx.restore();
}
