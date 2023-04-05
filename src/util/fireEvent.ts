import { BasicTransformEvent, TModificationEvents } from '../EventTypeDefs';

export const fireEvent = (
  eventName: TModificationEvents,
  options: BasicTransformEvent
) => {
  const {
    transform: { target },
  } = options;
  target.canvas?.fire(`object:${eventName}`, {
    ...options,
    target,
  });
  target.fire(eventName, options);
};
