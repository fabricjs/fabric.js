import { TPointerEvent, Transform } from '../EventTypeDefs';
import { Point } from '../Point';
import { TAxis } from '../typedefs';
import { sendVectorToPlane } from '../util/misc/planeChange';
import { resolveOrigin, resolveOriginPoint } from '../util/misc/resolveOrigin';
import { dotProduct, magnitude } from '../util/misc/vectors';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';

const UNIT_VECTOR = {
  x: new Point(1, 0),
  y: new Point(0, 1),
};

const AXIS_KEYS = {
  x: { size: 'width', origin: 'originX' },
  y: { size: 'height', origin: 'originY' },
} as const;

/**
 * Action handler to change object's axis size
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {TAxis} axis axis to change
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const resize = (
  axis: TAxis,
  eventData: TPointerEvent,
  { target, originX, originY }: Transform,
  x: number,
  y: number
) => {
  const offset = target.bbox
    .pointToOrigin(new Point(x, y))
    .subtract(resolveOriginPoint(originX, originY));
  const sideVector = UNIT_VECTOR[axis];
  const factor = dotProduct(offset, sideVector);
  const viewportSide = target.bbox.vectorFromOrigin(
    sideVector.scalarMultiply(Math.abs(factor))
  );
  const origin = resolveOrigin({ originX, originY }[AXIS_KEYS[axis].origin]);

  //  make sure the control changes size from it's side of target
  if (
    origin === 0 ||
    (origin > 0 && factor < 0) ||
    (origin < 0 && factor > 0)
  ) {
    const size = sendVectorToPlane(
      viewportSide.scalarMultiply(
        1 -
          (target.strokeUniform
            ? target.strokeWidth / magnitude(viewportSide)
            : 0)
      ),
      undefined,
      target.calcTransformMatrixInViewport()
    ).scalarSubtract(!target.strokeUniform ? target.strokeWidth : 0);
    const sizeKey = AXIS_KEYS[axis].size;
    const valueBefore = target[sizeKey];
    target.set(sizeKey, size[axis]);
    //  check against actual value in case it was rejected by the setter
    return valueBefore !== target[sizeKey];
  }

  return false;
};

export const changeWidth = wrapWithFireEvent(
  'resizing',
  wrapWithFixedAnchor(resize.bind(null, 'x'))
);

export const changeHeight = wrapWithFireEvent(
  'resizing',
  wrapWithFixedAnchor(resize.bind(null, 'y'))
);
