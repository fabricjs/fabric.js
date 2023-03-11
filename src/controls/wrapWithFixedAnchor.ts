import { Transform, TransformActionHandler } from '../EventTypeDefs';

/**
 * Wrap an action handler with saving/restoring object position on the transform.
 * this is the code that permits to objects to keep their position while transforming.
 * @param {Function} actionHandler the function to wrap
 * @return {Function} a function with an action handler signature
 */
export function wrapWithFixedAnchor<T extends Transform>(
  actionHandler: TransformActionHandler<T>
) {
  return ((eventData, transform, x, y) => {
    const { target, originX, originY } = transform,
      constraint = target.bbox.pointFromOrigin({ x: originX, y: originY }),
      actionPerformed = actionHandler(eventData, transform, x, y),
      delta = target.bbox
        .pointFromOrigin({ x: originX, y: originY })
        .subtract(constraint),
      originDiff = target.bbox.sendToParent().vectorToOrigin(delta);
    target.set({ left: target.left + delta.x, top: target.top + delta.y });
    return actionPerformed;
  }) as TransformActionHandler<T>;
}
