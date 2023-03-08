import {
  Transform,
  TransformAction,
  TransformActionHandler,
} from '../EventTypeDefs';
import { isLocked, TLockingKey } from './util';

/**
 * Wrap an action handler with a disabling guard.
 */
export function wrapWithDisableAction<T extends Transform>(
  actionHandler: TransformActionHandler<T>,
  lockingKey: TLockingKey
): TransformActionHandler<T>;
export function wrapWithDisableAction<T extends Transform>(
  actionHandler: TransformActionHandler<T>,
  /**
   * @returns true if action should be disabled
   */
  guard: TransformAction<Transform, boolean>
): TransformActionHandler<T>;
export function wrapWithDisableAction<T extends Transform>(
  actionHandler: TransformActionHandler<T>,
  arg1: TLockingKey | TransformAction<Transform, boolean>
): TransformActionHandler<T> {
  return (eventData, transform, x, y) => {
    const locked =
      typeof arg1 === 'string'
        ? isLocked(transform.target, arg1)
        : arg1(eventData, transform, x, y);
    return !locked && actionHandler(eventData, transform, x, y);
  };
}
