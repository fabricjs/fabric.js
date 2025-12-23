import type { TransformActionHandler } from '../EventTypeDefs';
import { HEIGHT, RESIZING } from '../constants';
import { resolveOrigin } from '../util/misc/resolveOrigin';
import { getLocalPoint, isTransformCentered } from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';

export const changeObjectHeight: TransformActionHandler = (eventData, transform, x, y) => {
  const localPoint = getLocalPoint(
    transform,
    transform.originX,
    transform.originY,
    x,
    y,
  );

  const originY = resolveOrigin(transform.originY);
  if (originY === 0 || (originY > 0 && localPoint.y < 0) || (originY < 0 && localPoint.y > 0)) {
    const { target } = transform;
    const strokePadding =
      target.strokeWidth / (target.strokeUniform ? target.scaleY : 1);
    const multiplier = isTransformCentered(transform) ? 2 : 1;
    const oldHeight = target.height;
    const newHeight =
      Math.abs((localPoint.y * multiplier) / target.scaleY) - strokePadding;

    target.set(HEIGHT, Math.max(newHeight, 1));
    return oldHeight !== target.height;
  }

  return false;
};

export const changeHeight = wrapWithFireEvent(
  RESIZING,
  wrapWithFixedAnchor(changeObjectHeight),
);