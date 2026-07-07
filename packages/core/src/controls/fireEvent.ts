import type {
  ObjectModificationEvents,
  TModificationEvents,
} from '../EventTypeDefs';

export const fireEvent = (
  eventName: TModificationEvents,
  options: ObjectModificationEvents[typeof eventName],
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
