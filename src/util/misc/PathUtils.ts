import { Point } from '../../point.class';
import { TObject } from '../../__types__';
import { degreesToRadians } from './radiansDegreesConversion';

export const calcPathBBox = (
  object: TObject,
  { left, top }: { left?: number; top?: number } = {}
) => {
  const bbox = object._calcDimensions(),
    strokeCorrection = new Point()
      .scalarAdd(object.strokeWidth)
      .divide(
        object.strokeUniform
          ? new Point(object.scaleX, object.scaleY)
          : new Point(1, 1)
      );
  const position: { left?: number; top?: number } = {};
  if (typeof left === 'undefined' || typeof top === 'undefined') {
    const origin = object.translateToGivenOrigin(
      new Point(left || 0, top || 0),
      'left',
      'top',
      object.originX,
      object.originY
    );
    if (typeof left === 'undefined') {
      position.left = origin.x;
    }
    if (typeof top === 'undefined') {
      position.top = origin.y;
    }
  }
  const offsetX = bbox.left + bbox.width / 2,
    offsetY = bbox.top + bbox.height / 2;
  const pathOffsetX =
    offsetX - offsetY * Math.tan(degreesToRadians(object.skewX));
  const pathOffsetY =
    offsetY - pathOffsetX * Math.tan(degreesToRadians(object.skewY));
  return {
    ...position,
    width: bbox.width - strokeCorrection.x,
    height: bbox.height - strokeCorrection.y,
    pathOffset: new Point(pathOffsetX, pathOffsetY),
  };
};
