import {
  type ControlRenderingStyleOverride,
  type InteractiveFabricObject,
  type TCornerPoint,
  Intersection,
  Point,
  util,
  type Control,
} from 'fabric';

const { degreesToRadians } = util;

const {
  createRotateMatrix,
  createTranslateMatrix,
  multiplyTransformMatrixArray,
} = util;

/**
 * Custom shouldActivate for L-shaped corner controls.
 * Checks if pointer is within either arm of the L.
 */
export function shouldActivateCorner(
  this: Control,
  controlKey: string,
  fabricObject: InteractiveFabricObject,
  pointer: Point,
  corner: TCornerPoint,
) {
  if (
    fabricObject.canvas?.getActiveObject() !== fabricObject ||
    !fabricObject.isControlVisible(controlKey)
  ) {
    return false;
  }

  const { tl, tr, br, bl } = corner;
  const center = new Point(
    (tl.x + tr.x + br.x + bl.x) / 4,
    (tl.y + tr.y + br.y + bl.y) / 4,
  );

  const sizeX = this.sizeX || fabricObject.cornerSize;
  const sizeY = this.sizeY || fabricObject.cornerSize;
  const length = sizeX;
  const thickness = sizeY;
  const halfT = thickness / 2;

  const objectAngle = fabricObject.angle || 0;
  const totalAngle = objectAngle + (this.angle || 0);
  const t = multiplyTransformMatrixArray([
    createTranslateMatrix(center.x, center.y),
    createRotateMatrix({ angle: totalAngle }),
  ]);

  const hArm = [
    new Point(-halfT, -halfT).transform(t),
    new Point(length + halfT, -halfT).transform(t),
    new Point(length + halfT, halfT).transform(t),
    new Point(-halfT, halfT).transform(t),
  ];

  const vArm = [
    new Point(-halfT, -halfT).transform(t),
    new Point(halfT, -halfT).transform(t),
    new Point(halfT, length + halfT).transform(t),
    new Point(-halfT, length + halfT).transform(t),
  ];

  return (
    Intersection.isPointInPolygon(pointer, hArm) ||
    Intersection.isPointInPolygon(pointer, vArm)
  );
}

/**
 * Render a rounded segment control (line with round caps).
 * Useful for edge resize handles.
 * @param {CanvasRenderingContext2D} ctx context to render on
 * @param {Number} left x coordinate where the control center should be
 * @param {Number} top y coordinate where the control center should be
 * @param {Object} styleOverride override for FabricObject controls style
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 */
export function renderRoundedSegmentControl(
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
  ctx.lineWidth = stroke ? thickness - strokeWidth : thickness;
  ctx.stroke();
  ctx.restore();
}

/**
 * Render an L-shaped corner control using two rounded segments.
 * Matches the style of renderRoundedSegmentControl.
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
    length = xSize,
    thickness = ySize,
    strokeWidth = fabricObject.borderScaleFactor * 2;

  ctx.rotate(degreesToRadians(this.angle));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const drawL = () => {
    ctx.beginPath();
    ctx.moveTo(length, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, length);
  };

  if (stroke) {
    ctx.lineWidth = thickness;
    drawL();
    ctx.stroke();
  }

  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = stroke ? thickness - strokeWidth : thickness;
  drawL();
  ctx.stroke();

  ctx.restore();
}
