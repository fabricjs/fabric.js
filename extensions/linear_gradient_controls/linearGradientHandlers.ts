import type { TMat2D, FabricImage } from 'fabric';
import { type Control, Point, type Gradient, util } from 'fabric';

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
