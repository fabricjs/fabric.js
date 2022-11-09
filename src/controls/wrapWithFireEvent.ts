import {
  TModificationEvents,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { fireEvent } from '../util/fireEvent';
import { commonEventInfo } from './util';

/**
 * Wrap an action handler with firing an event if the action is performed
 * @param {Function} actionHandler the function to wrap
 * @return {Function} a function with an action handler signature
 */
export const wrapWithFireEvent = <T extends Transform>(
  eventName: TModificationEvents,
  actionHandler: TransformActionHandler<T>
) => {
  return ((eventData, transform, x, y) => {
    const actionPerformed = actionHandler(eventData, transform, x, y);
    if (actionPerformed) {
      fireEvent(eventName, commonEventInfo(eventData, transform, x, y));
    }
    return actionPerformed;
  }) as TransformActionHandler<T>;
};
