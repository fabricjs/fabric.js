import { TransformEvent } from '../typedefs';

export const fireEvent = (eventName: string, options: TransformEvent) => {
  const {
    transform: { target },
  } = options;
  target.canvas?.fire(`object:${eventName}`, { ...options, target });
  target.fire(eventName, options);
};
