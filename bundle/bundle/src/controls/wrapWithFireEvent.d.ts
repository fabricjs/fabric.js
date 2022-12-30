import { TModificationEvents, Transform, TransformActionHandler } from '../EventTypeDefs';
/**
 * Wrap an action handler with firing an event if the action is performed
 * @param {Function} actionHandler the function to wrap
 * @return {Function} a function with an action handler signature
 */
export declare const wrapWithFireEvent: <T extends Transform>(eventName: TModificationEvents, actionHandler: TransformActionHandler<T>) => TransformActionHandler<T>;
//# sourceMappingURL=wrapWithFireEvent.d.ts.map