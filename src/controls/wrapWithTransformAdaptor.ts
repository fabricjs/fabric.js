import {
  Transform,
  TransformAction,
  TransformActionHandler,
} from '../EventTypeDefs';

/**
 * Wraps an action handler with a transform adapter.
 */
export function wrapWithTransformAdaptor<T extends Transform>(
  actionHandler: TransformActionHandler<T>,
  adaptor: TransformAction<Transform, T>
): TransformActionHandler {
  return (eventData, transform, x, y) =>
    actionHandler(eventData, adaptor(eventData, transform, x, y), x, y);
}
