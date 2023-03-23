export type TEventCallback<T = any> = (options: T) => any;

type EventRegistryObject<
  K extends string | number | symbol = string,
  E = any
> = Record<K, TEventCallback<E>>;

/**
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#events}
 * @see {@link http://fabricjs.com/events|Events demo}
 */
export class Observable<EventSpec> {
  private __eventListeners: Record<keyof EventSpec, TEventCallback[]> =
    {} as Record<keyof EventSpec, TEventCallback[]>;

  /**
   * Observes specified event
   * @alias on
   * @param {string} eventName Event name (eg. 'after:render')
   * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Function} disposer
   */
  on<K extends keyof EventSpec, E extends EventSpec[K]>(
    eventName: K,
    handler: TEventCallback<E>
  ): VoidFunction;
  on<K extends string, E>(
    eventName: K,
    handler: TEventCallback<E>
  ): VoidFunction;
  on<K extends keyof EventSpec, E extends EventSpec[K]>(
    handlers: EventRegistryObject<K, E>
  ): VoidFunction;
  on<K extends keyof EventSpec, E extends EventSpec[K]>(
    arg0: K | EventRegistryObject<K, E>,
    handler?: TEventCallback<E>
  ): VoidFunction {
    if (!this.__eventListeners) {
      this.__eventListeners = {} as Record<keyof EventSpec, TEventCallback[]>;
    }
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      for (const eventName in arg0) {
        this.on(eventName as K, arg0[eventName]);
      }
      return () => this.off(arg0);
    } else if (handler) {
      const eventName = arg0;
      if (!this.__eventListeners[eventName]) {
        this.__eventListeners[eventName] = [];
      }
      this.__eventListeners[eventName].push(handler);
      return () => this.off(eventName, handler);
    } else {
      // noop
      return () => false;
    }
  }

  /**
   * Observes specified event **once**
   * @alias once
   * @param {string} eventName Event name (eg. 'after:render')
   * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Function} disposer
   */
  once<K extends keyof EventSpec, E extends EventSpec[K]>(
    eventName: K,
    handler: TEventCallback<E>
  ): VoidFunction;
  once<K extends string, E>(
    eventName: K,
    handler: TEventCallback<E>
  ): VoidFunction;
  once<K extends keyof EventSpec, E extends EventSpec[K]>(
    handlers: EventRegistryObject<K, E>
  ): VoidFunction;
  once<K extends keyof EventSpec, E extends EventSpec[K]>(
    arg0: K | EventRegistryObject<K, E>,
    handler?: TEventCallback<E>
  ): VoidFunction {
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      const disposers: VoidFunction[] = [];
      for (const eventName in arg0) {
        disposers.push(this.once(eventName as K, arg0[eventName]));
      }
      return () => disposers.forEach((d) => d());
    } else if (handler) {
      const disposer = this.on<K, E>(arg0, (...args) => {
        handler(...args);
        disposer();
      });
      return disposer;
    } else {
      // noop
      return () => false;
    }
  }

  /**
   * @private
   * @param {string} eventName
   * @param {Function} [handler]
   */
  private _removeEventListener<K extends keyof EventSpec>(
    eventName: K,
    handler?: TEventCallback
  ) {
    if (!this.__eventListeners[eventName]) {
      return;
    }

    if (handler) {
      const eventListener = this.__eventListeners[eventName];
      const index = eventListener.indexOf(handler);
      index > -1 && eventListener.splice(index, 1);
    } else {
      this.__eventListeners[eventName] = [];
    }
  }

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
  off(handlers: EventRegistryObject): void;
  /**
   * unsubscribe all event listeners
   */
  off(): void;
  off<K extends keyof EventSpec>(
    arg0?: K | EventRegistryObject,
    handler?: TEventCallback
  ) {
    if (!this.__eventListeners) {
      return;
    }

    // remove all key/value pairs (event name -> event handler)
    if (typeof arg0 === 'undefined') {
      for (const eventName in this.__eventListeners) {
        this._removeEventListener(eventName);
      }
    }
    // one object with key/value pairs was passed
    else if (typeof arg0 === 'object') {
      for (const eventName in arg0) {
        this._removeEventListener(eventName as K, arg0[eventName]);
      }
    } else {
      this._removeEventListener(arg0, handler);
    }
  }

  /**
   * Fires event with an optional options object
   * @param {String} eventName Event name to fire
   * @param {Object} [options] Options object
   */
  fire<K extends keyof EventSpec>(eventName: K, options?: EventSpec[K]) {
    if (!this.__eventListeners) {
      return;
    }

    const listenersForEvent = this.__eventListeners[eventName]?.concat();
    if (listenersForEvent) {
      for (let i = 0; i < listenersForEvent.length; i++) {
        listenersForEvent[i].call(this, options || {});
      }
    }
  }
}
