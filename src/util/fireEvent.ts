import { TModificationEvents, TransformEvent } from '../EventTypeDefs';

export const fireEvent = (
  eventName: TModificationEvents,
  options: TransformEvent
) => {
  const {
    transform: { target },
  } = options;
  target.canvas?.fire(`object:${eventName}`, { ...options, target });
  target.fire(eventName, options);
};
