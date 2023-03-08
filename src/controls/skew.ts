import {
  ControlCursorCallback,
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { Point } from '../Point';
import { TAxis, TAxisKey } from '../typedefs';
import {
  composeMatrix,
  isMatrixEqual,
  multiplyTransformMatrixChain,
} from '../util/misc/matrix';
import { applyTransformToObject } from '../util/misc/objectTransforms';
import { calcBaseChangeMatrix } from '../util/misc/planeChange';
import { resolveOrigin } from '../util/misc/resolveOrigin';
import {
  findCornerQuadrant,
  getLocalPoint,
  isLocked,
  NOT_ALLOWED_CURSOR,
} from './util';
import { wrapWithDisableAction } from './wrapWithDisableAction';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';
import { wrapWithTransformAdaptor } from './wrapWithTransformAdaptor';

export type SkewTransform = Transform & { skewingSide: -1 | 1 };

const AXIS_KEYS: Record<
  TAxis,
  {
    counterAxis: TAxis;
    scale: TAxisKey<'scale'>;
    skew: TAxisKey<'skew'>;
    lockSkewing: TAxisKey<'lockSkewing'>;
    origin: TAxisKey<'origin'>;
    flip: TAxisKey<'flip'>;
  }
> = {
  x: {
    counterAxis: 'y',
    scale: 'scaleX',
    skew: 'skewX',
    lockSkewing: 'lockSkewingX',
    origin: 'originX',
    flip: 'flipX',
  },
  y: {
    counterAxis: 'x',
    scale: 'scaleY',
    skew: 'skewY',
    lockSkewing: 'lockSkewingY',
    origin: 'originY',
    flip: 'flipY',
  },
};

const skewMap = ['ns', 'nesw', 'ew', 'nwse'];

/**
 * return the correct cursor style for the skew action
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
export const skewCursorStyleHandler: ControlCursorCallback = (
  eventData,
  control,
  fabricObject
) => {
  if (control.x !== 0 && isLocked(fabricObject, 'lockSkewingY')) {
    return NOT_ALLOWED_CURSOR;
  }
  if (control.y !== 0 && isLocked(fabricObject, 'lockSkewingX')) {
    return NOT_ALLOWED_CURSOR;
  }
  const n = findCornerQuadrant(fabricObject, control) % 4;
  return `${skewMap[n]}-resize`;
};

/**
 * Since skewing is applied before scaling, calculations are done in a scaleless plane
 * @see https://github.com/fabricjs/fabric.js/pull/8380
 */
function skewObject(
  axis: TAxis,
  eventData: TPointerEvent,
  { target, ex, ey, original, skewingSide }: SkewTransform,
  x: number,
  y: number
) {
  const ownMatrix = composeMatrix(original);
  const d = new Point(x, y).subtract(new Point(ex, ey));

  const shearingChange = calcBaseChangeMatrix(
    [new Point(1, 0), new Point(0, 1)],
    [
      new Point(
        1,
        axis === 'y' ? (d.y * skewingSide) / (target.height * 0.5) : 0
      ),
      new Point(
        axis === 'x' ? (d.x * skewingSide) / (target.width * 0.5) : 0,
        1
      ),
    ]
  );

  applyTransformToObject(
    target,
    multiplyTransformMatrixChain([
      ownMatrix,
      shearingChange,
      // [
      //   axis === 'y' ? (1 + shearX * shearY) / (1 + shearX * shearing) : 1,
      //   0,
      //   0,
      //   1,
      //   0,
      //   0,
      // ],
    ])
  );

  return !isMatrixEqual(target.calcOwnMatrix(), ownMatrix);
}

/**
 * Wrapped transform adaptor for skewing on a given axis.
 * Takes care of the skew direction and determines the correct transform origin for the anchor point
 */
function skewTransformAdaptor(
  axis: TAxis,
  eventData: TPointerEvent,
  transform: Transform,
  x: number,
  y: number
) {
  const { target } = transform,
    {
      counterAxis,
      origin: originKey,
      skew: skewKey,
      flip: flipKey,
    } = AXIS_KEYS[axis],
    { origin: counterOriginKey, flip: counterFlipKey } = AXIS_KEYS[counterAxis],
    counterOriginFactor =
      resolveOrigin(transform[counterOriginKey]) *
      (target[counterFlipKey] ? -1 : 1),
    // if the counter origin is top/left (= -0.5) then we are skewing x/y values on the bottom/right side of target respectively.
    // if the counter origin is bottom/right (= 0.5) then we are skewing x/y values on the top/left side of target respectively.
    // skewing direction on the top/left side of target is OPPOSITE to the direction of the movement of the pointer,
    // so we factor skewing direction by this value.
    skewingSide = (-Math.sign(counterOriginFactor) *
      (target[flipKey] ? -1 : 1)) as 1 | -1,
    skewingDirection =
      ((target[skewKey] === 0 &&
        // in case skewing equals 0 we use the pointer offset from target center to determine the direction of skewing
        getLocalPoint(transform, 'center', 'center', x, y)[axis] > 0) ||
      // in case target has skewing we use that as the direction
      target[skewKey] > 0
        ? 1
        : -1) * skewingSide,
    // anchor to the opposite side of the skewing direction
    // normalize value from [-1, 1] to origin value [0, 1]
    origin = -skewingDirection * 0.5 + 0.5;

  return {
    ...transform,
    [originKey]: origin,
    skewingSide,
  };
}

function createSkewHandler(axis: TAxis) {
  return wrapWithDisableAction(
    wrapWithTransformAdaptor(
      wrapWithFireEvent<SkewTransform>(
        'skewing',
        wrapWithFixedAnchor(skewObject.bind(null, axis))
      ),
      skewTransformAdaptor.bind(null, axis)
    ),
    AXIS_KEYS[axis].lockSkewing
  );
}

/**
 * Wrapped Action handler for skewing on the X axis, takes care of the
 * skew direction and determines the correct transform origin for the anchor point
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const skewHandlerX: TransformActionHandler = createSkewHandler('x');

/**
 * Wrapped Action handler for skewing on the Y axis, takes care of the
 * skew direction and determines the correct transform origin for the anchor point
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const skewHandlerY: TransformActionHandler = createSkewHandler('y');
