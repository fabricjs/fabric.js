import { resolveOrigin } from '../mixins/object_origin.mixin';
import { TAxis, Transform } from '../typedefs';
import { AXIS_KEYS } from './constants';
import { getLocalPoint, isTransformCentered } from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';

/**
 * Action handler to change object's width/height
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {TAxis} axis
 * @param {Transform} transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if changed
 */
const changeObjectSize = (
  axis: TAxis,
  transform: Transform,
  x: number,
  y: number
) => {
  const { target } = transform;
  const offset = getLocalPoint(
    transform,
    transform.originX,
    transform.originY,
    x,
    y
  )[axis];
  const { origin: originKey, scale: scaleKey, size: sizeKey } = AXIS_KEYS[axis];
  const origin = resolveOrigin(transform[originKey]);
  const scale = target[scaleKey];
  //  make sure the control changes width/height ONLY from its side of target
  if (
    origin === 0 ||
    (origin > 0 && offset < 0) ||
    (origin < 0 && offset > 0)
  ) {
    const strokePadding =
        target.strokeWidth / (target.strokeUniform ? scale : 1),
      multiplier = isTransformCentered(transform) ? 2 : 1,
      prevSize = target[sizeKey],
      size = Math.max(
        Math.ceil(Math.abs((offset * multiplier) / scale) - strokePadding),
        0
      );
    target.set(sizeKey, size);
    //  check against actual target width/height in case `newWidth` was rejected
    return prevSize !== target[sizeKey];
  }
  return false;
};

export const changeWidth = wrapWithFireEvent(
  'resizing',
  wrapWithFixedAnchor((eventData, transform, x, y) =>
    changeObjectSize('x', transform, x, y)
  )
);

export const changeHeight = wrapWithFireEvent(
  'resizing',
  wrapWithFixedAnchor((eventData, transform, x, y) =>
    changeObjectSize('y', transform, x, y)
  )
);
