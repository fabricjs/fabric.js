import { Point } from '../Point';
import { Control } from './Control';
import type { TMat2D } from '../typedefs';
import type { Polyline } from '../shapes/Polyline';
import { multiplyTransformMatrices } from '../util/misc/matrix';
import type {
  TModificationEvents,
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { sendPointToPlane } from '../util/misc/planeChange';
import { MODIFY_POLY } from '../constants';

const ACTION_NAME: TModificationEvents = MODIFY_POLY;

type TTransformAnchor = Transform & { pointIndex: number };

/**
 * This function locates the controls.
 * It'll be used both for drawing and for interaction.
 */
export const createPolyPositionHandler = (pointIndex: number) => {
  return function (dim: Point, finalMatrix: TMat2D, polyObject: Polyline) {
    const { points, pathOffset } = polyObject;
    return new Point(points[pointIndex])
      .subtract(pathOffset)
      .transform(
        multiplyTransformMatrices(
          polyObject.getViewportTransform(),
          polyObject.calcTransformMatrix(),
        ),
      );
  };
};

/**
 * This function defines what the control does.
 * It'll be called on every mouse move after a control has been clicked and is being dragged.
 * The function receives as argument the mouse event, the current transform object
 * and the current position in canvas coordinate `transform.target` is a reference to the
 * current object being transformed.
 */
export const polyActionHandler = (
  eventData: TPointerEvent,
  transform: TTransformAnchor,
  x: number,
  y: number,
) => {
  const { target, pointIndex } = transform;
  const poly = target as Polyline;
  const mouseLocalPosition = sendPointToPlane(
    new Point(x, y),
    undefined,
    poly.calcOwnMatrix(),
  );

  poly.points[pointIndex] = mouseLocalPosition.add(poly.pathOffset);
  poly.setDimensions();

  return true;
};

/**
 * Keep the polygon in the same position when we change its `width`/`height`/`top`/`left`.
 */
export const factoryPolyActionHandler = (
  pointIndex: number,
  fn: TransformActionHandler<TTransformAnchor>,
) => {
  return function (
    eventData: TPointerEvent,
    transform: Transform,
    x: number,
    y: number,
  ) {
    const poly = transform.target as Polyline,
      anchorPoint = new Point(
        poly.points[(pointIndex > 0 ? pointIndex : poly.points.length) - 1],
      ),
      anchorPointInParentPlane = anchorPoint
        .subtract(poly.pathOffset)
        .transform(poly.calcOwnMatrix()),
      actionPerformed = fn(eventData, { ...transform, pointIndex }, x, y);

    const newAnchorPointInParentPlane = anchorPoint
      .subtract(poly.pathOffset)
      .transform(poly.calcOwnMatrix());

    const diff = newAnchorPointInParentPlane.subtract(anchorPointInParentPlane);
    poly.left -= diff.x;
    poly.top -= diff.y;

    return actionPerformed;
  };
};

export const createPolyActionHandler = (pointIndex: number) =>
  wrapWithFireEvent(
    ACTION_NAME,
    factoryPolyActionHandler(pointIndex, polyActionHandler),
  );

export function createPolyControls(
  poly: Polyline,
  options?: Partial<Control>,
): Record<string, Control>;
export function createPolyControls(
  numOfControls: number,
  options?: Partial<Control>,
): Record<string, Control>;
export function createPolyControls(
  arg0: number | Polyline,
  options: Partial<Control> = {},
) {
  const controls = {} as Record<string, Control>;
  for (
    let idx = 0;
    idx < (typeof arg0 === 'number' ? arg0 : arg0.points.length);
    idx++
  ) {
    controls[`p${idx}`] = new Control({
      actionName: ACTION_NAME,
      positionHandler: createPolyPositionHandler(idx),
      actionHandler: createPolyActionHandler(idx),
      ...options,
    });
  }
  return controls;
}
