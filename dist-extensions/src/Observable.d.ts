export type TEventCallback<T = any> = (options: T) => any;
type EventRegistryObject<E> = {
    [K in keyof E]?: TEventCallback<E[K]>;
};
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
    on(handlers: EventRegistryObject<EventSpec>): VoidFunction;
    /**
     * Observes specified event **once**
     * @alias once
     * @param {string} eventName Event name (eg. 'after:render')
     * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
     * @param {Function} handler Function that receives a notification when an event of the specified type occurs
     * @return {Function} disposer
     */
    once<K extends keyof EventSpec, E extends EventSpec[K]>(eventName: K, handler: TEventCallback<E>): VoidFunction;
    once(handlers: EventRegistryObject<EventSpec>): VoidFunction;
    /**
     * @private
     * @param {string} eventName
     * @param {Function} [handler]
     */
    private _removeEventListener;
    /**
     * Unsubscribe all event listeners for eventname.
     * Do not use this pattern. You could kill internal fabricJS events.
     * We know we should have protected events for internal flows, but we don't have yet
     * @deprecated
     * @param {string} eventName event name (eg. 'after:render')
     */
    off<K extends keyof EventSpec>(eventName: K): void;
    /**
     * unsubscribe an event listener
     * @param {string} eventName event name (eg. 'after:render')
     * @param {TEventCallback} handler event listener to unsubscribe
     */
    off<K extends keyof EventSpec>(eventName: K, handler: TEventCallback): void;
    /**
     * unsubscribe event listeners
     * @param handlers handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
     */
    off(handlers: EventRegistryObject<EventSpec>): void;
    /**
     * unsubscribe all event listeners
     */
    off(): void;
    /**
     * Fires event with an optional options object
     * @param {String} eventName Event name to fire
     * @param {Object} [options] Options object
     */
    fire<K extends keyof EventSpec>(eventName: K, options?: EventSpec[K]): void;
}
export {};
//# sourceMappingURL=Observable.d.ts.map