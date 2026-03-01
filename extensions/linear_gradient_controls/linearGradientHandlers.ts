import type {
  TMat2D,
  FabricObject,
  TransformActionHandler,
  Control,
  ControlRenderingStyleOverride,
  InteractiveFabricObject,
  Gradient,
} from 'fabric';
import { Point, util, controlsUtils, iMatrix } from 'fabric';

/** A deduping code block */
const commonGradientInfo = (
  fabricObject: FabricObject,
  gradient: Gradient<'linear'>,
) => {
  const { width, height } = fabricObject;
  const { colorStops, coords, gradientUnits } = gradient;
  const isPerc = gradientUnits === 'percentage';
  const matrix = fabricObject.calcTransformMatrix();
  const vpt = fabricObject.getViewportTransform();
  const _finalMatrix = util.multiplyTransformMatrixArray([vpt, matrix]);
  return {
    width,
    height,
    colorStops,
    coords,
    isPerc,
    _finalMatrix,
  };
};

export const linearGradientColorPositionHandlerGenerator = (
  gradient: Gradient<'linear'>,
  stopIndex: number,
) =>
  function linearGradientColorPositionHandler(
    this: Control,
    dim: Point, // currentDimension
    finalMatrix: TMat2D,
    fabricObject: FabricObject,
    // currentControl: Control,) => {};
  ) {
    const { width, height, isPerc, coords, colorStops, _finalMatrix } =
      commonGradientInfo(fabricObject, gradient);
    const p1 = new Point(
      coords.x1 * (isPerc ? width : 1) - width / 2,
      coords.y1 * (isPerc ? height : 1) - height / 2,
    );
    const p2 = new Point(
      coords.x2 * (isPerc ? width : 1) - width / 2,
      coords.y2 * (isPerc ? height : 1) - height / 2,
    );
    const offset = colorStops[stopIndex].offset;
    return p1.lerp(p2, offset).transform(_finalMatrix);
  };

export const linearGradientCoordPositionHandlerGenerator = (
  gradient: Gradient<'linear'>,
  pointNumber: 1 | 2,
) =>
  function linearGradientCoordPositionHandler(
    this: Control,
    dim: Point, // currentDimension
    finalMatrix: TMat2D,
    fabricObject: FabricObject,
    // currentControl: Control,) => {};
  ) {
    const { width, height, isPerc, coords, _finalMatrix } = commonGradientInfo(
      fabricObject,
      gradient,
    );

    return (
      pointNumber === 1
        ? new Point(
            coords.x1 * (isPerc ? width : 1) - width / 2,
            coords.y1 * (isPerc ? height : 1) - height / 2,
          )
        : new Point(
            coords.x2 * (isPerc ? width : 1) - width / 2,
            coords.y2 * (isPerc ? height : 1) - height / 2,
          )
    ).transform(_finalMatrix);
  };

export const linearGradientColorActionHandlerGenerator =
  (gradient: Gradient<'linear'>, colorIndex: number): TransformActionHandler =>
  (eventData, { target }, x, y) => {
    const {
      width,
      height,
      isPerc,
      coords: { x1, x2, y1, y2 },
      colorStops,
    } = commonGradientInfo(target, gradient);

    // find point in the space inside the object.
    const point = util
      .sendPointToPlane(
        new Point(x, y),
        undefined,
        target.calcTransformMatrix(),
      )
      .add(new Point(width / 2, height / 2));

    const p1 = new Point(x1 * (isPerc ? width : 1), y1 * (isPerc ? height : 1));
    const v = util.createVector(
      p1,
      new Point(x2 * (isPerc ? width : 1), y2 * (isPerc ? height : 1)),
    );
    const u = util.createVector(p1, point);
    const t = util.dotProduct(u, v) / util.dotProduct(v, v);
    colorStops[colorIndex].offset = util.capValue(0, t, 1);
    target.set('dirty', true);
    return true;
  };

export const linearGradientCoordsActionHandlerGenerator =
  (gradient: Gradient<'linear'>, pointIndex: 1 | 2): TransformActionHandler =>
  (eventData, { target }, x, y) => {
    const { width, height, isPerc, coords } = commonGradientInfo(
      target,
      gradient,
    );
    // find point in the space inside the object.
    const point = util
      .sendPointToPlane(
        new Point(x, y),
        undefined,
        target.calcTransformMatrix(),
      )
      .add(new Point(width / 2, height / 2));
    if (pointIndex === 1) {
      coords.x1 = point.x / (isPerc ? width : 1);
      coords.y1 = point.y / (isPerc ? height : 1);
    }

    if (pointIndex === 2) {
      coords.x2 = point.x / (isPerc ? width : 1);
      coords.y2 = point.y / (isPerc ? height : 1);
    }
    target.set('dirty', true);
    return true;
  };

export const linearGradientControlLineRender = (gradient: Gradient<'linear'>) =>
  function renderCircleControlWithLine(
    this: Control,
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: ControlRenderingStyleOverride,
    fabricObject: InteractiveFabricObject,
  ) {
    // we are position in center of coords.x1/y1
    ctx.save();
    const { width, height, isPerc, coords } = commonGradientInfo(
      fabricObject as FabricObject,
      gradient,
    );
    const finalP = util.sendPointToPlane(
      new Point(
        coords.x2 * (isPerc ? width : 1) - width / 2,
        coords.y2 * (isPerc ? height : 1) - height / 2,
      ),
      util.multiplyTransformMatrices(
        fabricObject.canvas?.viewportTransform ?? iMatrix,
        fabricObject.calcTransformMatrix(),
      ),
    );
    ctx.lineWidth = fabricObject.borderScaleFactor;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(finalP.x, finalP.y);
    ctx.stroke();
    controlsUtils.renderCircleControl.call(
      this,
      ctx,
      left,
      top,
      styleOverride,
      fabricObject,
    );
    ctx.restore();
  };
