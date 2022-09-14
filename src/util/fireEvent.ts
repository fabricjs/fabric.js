import { TransformEvent } from '../typedefs';

export const fireEvent = <T>(eventName: string, options: TransformEvent<T>) => {
  const target = options.transform.target;
  target.canvas?.fire('object:' + eventName, { ...options, target });
  target.fire(eventName, options);
};
