import { TModificationEvents, BasicTransformEvent } from '../EventTypeDefs';
import type { Canvas } from '../canvas/canvas_events';

export const fireEvent = (
  eventName: TModificationEvents,
  options: BasicTransformEvent
) => {
  const {
    transform: { target },
  } = options;
  (target.canvas as Canvas)?.fire(`object:${eventName}`, {
    ...options,
    target,
  });
  target.fire(eventName, options);
};
