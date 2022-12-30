export type TEventCallback<T = any> = (options: T) => any;
type EventRegistryObject<K extends string | number | symbol = string, E = any> = Record<K, TEventCallback<E>>;
/**
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#events}
 * @see {@link http://fabricjs.com/events|Events demo}
 */
export declare class Observable<EventSpec> {
    private __eventListeners;
    /**
     * Observes specified event
     * @alias on
     * @param {string} eventName Event name (eg. 'after:render')
     * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
     * @param {Function} handler Function that receives a notification when an event of the specified type occurs
     * @return {Function} disposer
     */
    on<K extends keyof EventSpec, E extends EventSpec[K]>(eventName: K, handler: TEventCallback<E>): VoidFunction;
    on<K extends string, E>(eventName: K, handler: TEventCallback<E>): VoidFunction;
    on<K extends keyof EventSpec, E extends EventSpec[K]>(handlers: EventRegistryObject<K, E>): VoidFunction;
    /**
     * Observes specified event **once**
     * @alias once
     * @param {string} eventName Event name (eg. 'after:render')
     * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
     * @param {Function} handler Function that receives a notification when an event of the specified type occurs
     * @return {Function} disposer
     */
    once<K extends keyof EventSpec, E extends EventSpec[K]>(eventName: K, handler: TEventCallback<E>): VoidFunction;
    once<K extends string, E>(eventName: K, handler: TEventCallback<E>): VoidFunction;
    once<K extends keyof EventSpec, E extends EventSpec[K]>(handlers: EventRegistryObject<K, E>): VoidFunction;
    /**
     * @private
     * @param {string} eventName
     * @param {Function} [handler]
     */
    private _removeEventListener;
    /**
     * Stops event observing for a particular event handler. Calling this method
     * without arguments removes all handlers for all events
     * @param {string} eventName Event name (eg. 'after:render')
     * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
     * @param {Function} handler Function to be deleted from EventListeners
     */
    off<K extends keyof EventSpec>(eventName: K, handler: TEventCallback): void;
    off(handlers: EventRegistryObject): void;
    /**
     * Fires event with an optional options object
     * @param {String} eventName Event name to fire
     * @param {Object} [options] Options object
     */
    fire<K extends keyof EventSpec>(eventName: K, options?: EventSpec[K]): void;
}
export {};
//# sourceMappingURL=observable.mixin.d.ts.map