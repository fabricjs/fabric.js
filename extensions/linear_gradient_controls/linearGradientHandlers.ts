import type {
  TMat2D,
  FabricImage,
  TransformActionHandler,
  Control,
  ControlRenderingStyleOverride,
  InteractiveFabricObject,
  Gradient,
} from 'fabric';
import { Point, util, controlsUtils, iMatrix } from 'fabric';

export const linearGradientColorPositionHandlerGenerator = (
  gradient: Gradient<'linear'>,
  stopIndex: number,
) =>
  function gradientPositionHandler(
    this: Control,
    dim: Point, // currentDimension
    finalMatrix: TMat2D,
    fabricObject: FabricImage,
    // currentControl: Control,) => {};
  ) {
    const matrix = fabricObject.calcTransformMatrix();
    const vpt = fabricObject.getViewportTransform();
    const _finalMatrix = util.multiplyTransformMatrices(vpt, matrix);
    const { width, height } = fabricObject;
    const isPerc = gradient.gradientUnits === 'percentage';
    const { colorStops, coords } = gradient;
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

export const linearGradientCoordPositionHandler = (
  gradient: Gradient<'linear'>,
  pointNumber: 1 | 2,
) =>
  function gradientPositionHandler(
    this: Control,
    dim: Point, // currentDimension
    finalMatrix: TMat2D,
    fabricObject: FabricImage,
    // currentControl: Control,) => {};
  ) {
    const matrix = fabricObject.calcTransformMatrix();
    const vpt = fabricObject.getViewportTransform();
    const _finalMatrix = util.multiplyTransformMatrices(vpt, matrix);
    const { width, height } = fabricObject;
    const isPerc = gradient.gradientUnits === 'percentage';
    const { coords } = gradient;

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

export const linearGradientColorActionHandler =
  (gradient: Gradient<'linear'>, colorIndex: number): TransformActionHandler =>
  (eventData, { target }, x, y) => {
    // find point in the space inside the object.
    const point = util
      .sendPointToPlane(
        new Point(x, y),
        undefined,
        target.calcTransformMatrix(),
      )
      .add(new Point(target.width / 2, target.height / 2));
    // create the linear gradient vector
    const isPerc = gradient.gradientUnits === 'percentage';

    const {
      coords: { x1, x2, y1, y2 },
    } = gradient;
    const p1 = new Point(
      x1 * (isPerc ? target.width : 1),
      y1 * (isPerc ? target.height : 1),
    );
    const v = util.createVector(
      p1,
      new Point(
        x2 * (isPerc ? target.width : 1),
        y2 * (isPerc ? target.height : 1),
      ),
    );
    const u = util.createVector(p1, point);
    const t = util.dotProduct(u, v) / util.dotProduct(v, v);
    gradient.colorStops[colorIndex].offset = util.capValue(0, t, 1);
    target.set('dirty', true);
    return true;
  };

export const linearGradientCoordsActionHandler =
  (gradient: Gradient<'linear'>, pointIndex: 1 | 2): TransformActionHandler =>
  (eventData, { target }, x, y) => {
    // find point in the space inside the object.
    const point = util
      .sendPointToPlane(
        new Point(x, y),
        undefined,
        target.calcTransformMatrix(),
      )
      .add(new Point(target.width / 2, target.height / 2));
    const isPerc = gradient.gradientUnits === 'percentage';
    if (pointIndex === 1) {
      gradient.coords.x1 = point.x / (isPerc ? target.width : 1);
      gradient.coords.y1 = point.y / (isPerc ? target.height : 1);
    }

    if (pointIndex === 2) {
      gradient.coords.x2 = point.x / (isPerc ? target.width : 1);
      gradient.coords.y2 = point.y / (isPerc ? target.height : 1);
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
    // this.commonRenderProps(ctx, left, top, fabricObject, styleOverride);
    const { width, height } = fabricObject;
    const { coords } = gradient;
    const isPerc = gradient.gradientUnits === 'percentage';
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
