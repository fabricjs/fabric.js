import type {
  TMat2D,
  FabricImage,
  TransformActionHandler,
  Control,
} from 'fabric';
import { Point, type Gradient, util } from 'fabric';

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
    const { colorStops, coords } = gradient;
    const p1 = new Point(
      coords.x1 - fabricObject.width / 2,
      coords.y1 - fabricObject.height / 2,
    );
    const p2 = new Point(
      coords.x2 - fabricObject.width / 2,
      coords.y2 - fabricObject.height / 2,
    );
    const offset = colorStops[stopIndex].offset;
    if (gradient.gradientUnits === 'pixels') {
      return p1.lerp(p2, offset).transform(_finalMatrix);
    }
    return new Point(0, 0);
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
    const { coords } = gradient;
    if (gradient.gradientUnits === 'pixels') {
      return (
        pointNumber === 1
          ? new Point(
              coords.x1 - fabricObject.width / 2,
              coords.y1 - fabricObject.height / 2,
            )
          : new Point(
              coords.x2 - fabricObject.width / 2,
              coords.y2 - fabricObject.height / 2,
            )
      ).transform(_finalMatrix);
    }
    return new Point(0, 0);
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
    const {
      coords: { x1, x2, y1, y2 },
    } = gradient;
    const p1 = new Point(x1, y1);
    const v = util.createVector(p1, new Point(x2, y2));
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

    if (pointIndex === 1) {
      gradient.coords.x1 = point.x;
      gradient.coords.y1 = point.y;
    }

    if (pointIndex === 2) {
      gradient.coords.x2 = point.x;
      gradient.coords.y2 = point.y;
    }
    target.set('dirty', true);
    return true;
  };
