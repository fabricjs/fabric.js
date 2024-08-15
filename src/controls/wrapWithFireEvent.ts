import type {
  TModificationEvents,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { fireEvent } from './fireEvent';
import { commonEventInfo } from './util';

/**
 * Wrap an action handler with firing an event if the action is performed
 * @param {TModificationEvents} eventName the event we want to fire
 * @param {TransformActionHandler<T>} actionHandler the function to wrap
 * @param {object} extraEventInfo extra information to pas to the event handler
 * @return {TransformActionHandler<T>} a function with an action handler signature
 */
export const wrapWithFireEvent = <
  T extends Transform,
  P extends object = Record<string, never>,
>(
  eventName: TModificationEvents,
  actionHandler: TransformActionHandler<T>,
  extraEventInfo?: P,
) => {
  return ((eventData, transform, x, y) => {
    const actionPerformed = actionHandler(eventData, transform, x, y);
    if (actionPerformed) {
      fireEvent(eventName, {
        ...commonEventInfo(eventData, transform, x, y),
        ...extraEventInfo,
      });
    }
    return actionPerformed;
  }) as TransformActionHandler<T>;
};
