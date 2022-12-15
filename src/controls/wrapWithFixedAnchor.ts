import {
  Transform,
  TransformAction,
  TransformActionHandler,
} from '../EventTypeDefs';
import { TOriginX, TOriginY } from '../typedefs';

/**
 * Wrap an action handler with saving/restoring object position on the transform.
 * this is the code that permits to objects to keep their position while transforming.
 */
export function wrapWithFixedAnchor<T extends Transform>(
  actionHandler: TransformActionHandler<T>,
  originAdaptor?: TransformAction<
    T,
    {
      x: TOriginX;
      y: TOriginY;
      /**
       * propagate the new origin values to {@link actionHandler}
       * consider using {@link wrapWithTransformAdaptor}
       * @default true
       */
      propagate?: boolean;
    }
  >
) {
  return ((eventData, transform, x, y) => {
    const {
        target,
        originX: incomingOriginX,
        originY: incomingOriginY,
      } = transform,
      {
        x: originX,
        y: originY,
        propagate = true,
      } = originAdaptor
        ? originAdaptor(eventData, transform, x, y)
        : { x: incomingOriginX, y: incomingOriginY };
    if (propagate) {
      transform.originX = originX;
      transform.originY = originY;
    }
    const centerPoint = target.getRelativeCenterPoint(),
      constraint = target.translateToOriginPoint(centerPoint, originX, originY),
      actionPerformed = actionHandler(eventData, transform, x, y);
    target.setPositionByOrigin(constraint, originX, originY);
    return actionPerformed;
  }) as TransformActionHandler<T>;
}
