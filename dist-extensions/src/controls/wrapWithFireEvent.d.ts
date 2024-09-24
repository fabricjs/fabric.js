import type { TModificationEvents, Transform, TransformActionHandler } from '../EventTypeDefs';
/**
 * Wrap an action handler with firing an event if the action is performed
 * @param {TModificationEvents} eventName the event we want to fire
 * @param {TransformActionHandler<T>} actionHandler the function to wrap
 * @param {object} extraEventInfo extra information to pas to the event handler
 * @return {TransformActionHandler<T>} a function with an action handler signature
 */
export declare const wrapWithFireEvent: <T extends Transform, P extends object = Record<string, never>>(eventName: TModificationEvents, actionHandler: TransformActionHandler<T>, extraEventInfo?: P) => TransformActionHandler<T>;
//# sourceMappingURL=wrapWithFireEvent.d.ts.map