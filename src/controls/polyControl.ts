import { Point } from '../Point';
import { Control } from './Control';
import { TMat2D } from '../typedefs';
import type { Polyline } from '../shapes/Polyline';
import {
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { sendPointToPlane } from '../util';

type TTransformAnchor = Transform & { pointIndex: number };

const getSize = (poly: Polyline) => {
  return new Point(poly.width, poly.height);
};

/**
 * This function locates the controls.
 * It'll be used both for drawing and for interaction.
 */
const factoryPolyPositionHandler = (pointIndex: number) => {
  return function (dim: Point, finalMatrix: TMat2D, polyObject: Polyline) {
    return new Point(polyObject.points[pointIndex])
      .subtract(polyObject.pathOffset)
      .transform(polyObject.calcTransformMatrixInViewport());
  };
};

/**
 * This function defines what the control does.
 * It'll be called on every mouse move after a control has been clicked and is being dragged.
 * The function receives as argument the mouse event, the current transform object
 * and the current position in canvas coordinate `transform.target` is a reference to the
 * current object being transformed.
 */
const polyActionHandler = (
  eventData: TPointerEvent,
  transform: TTransformAnchor,
  x: number,
  y: number
) => {
  const poly = transform.target as Polyline,
    pointIndex = transform.pointIndex,
    positionInPlane = sendPointToPlane(
      new Point(x, y),
      undefined,
      poly.calcTransformMatrixInViewport()
    );

  poly.points[pointIndex] = positionInPlane.add(poly.pathOffset);
  poly.setDimensions();

  return true;
};

/**
 * Keep the polygon in the same position when we change its `width`/`height`/`top`/`left`.
 */
const anchorWrapper = (
  pointIndex: number,
  fn: TransformActionHandler<TTransformAnchor>
) => {
  return function (
    eventData: TPointerEvent,
    transform: Transform,
    x: number,
    y: number
  ) {
    const poly = transform.target as Polyline,
      anchorIndex = (pointIndex > 0 ? pointIndex : poly.points.length) - 1,
      pointInCanvasPlane = new Point(
        poly.points[anchorIndex].x - poly.pathOffset.x,
        poly.points[anchorIndex].y - poly.pathOffset.y
      ).transform(poly.calcTransformMatrix()),
      actionPerformed = fn(eventData, { ...transform, pointIndex }, x, y),
      polygonBaseSize = getSize(poly),
      adjustFlip = new Point(poly.flipX ? -1 : 1, poly.flipY ? -1 : 1);

    const newPosition = new Point(
      poly.points[anchorIndex].x,
      poly.points[anchorIndex].y
    )
      .subtract(poly.pathOffset)
      .divide(polygonBaseSize)
      .multiply(adjustFlip);

    poly.setXY(pointInCanvasPlane, newPosition.x + 0.5, newPosition.y + 0.5);
    return actionPerformed;
  };
};

export function createPolyControls(
  poly: Polyline,
  options?: Partial<Control>
): Record<string, Control>;
export function createPolyControls(
  numOfControls: number,
  options?: Partial<Control>
): Record<string, Control>;
export function createPolyControls(
  arg0: number | Polyline,
  options: Partial<Control> = {}
) {
  const controls = {} as Record<string, Control>;
  for (
    let idx = 0;
    idx < (typeof arg0 === 'number' ? arg0 : arg0.points.length);
    idx++
  ) {
    controls[`p${idx}`] = new Control({
      actionName: 'modifyPoly',
      positionHandler: factoryPolyPositionHandler(idx),
      actionHandler: anchorWrapper(idx, polyActionHandler),
      ...options,
    });
  }
  return controls;
}
