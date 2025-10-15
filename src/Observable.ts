export type TEventCallback<T = any> = (options: T) => any;

type EventRegistryObject<E> = {
  [K in keyof E]?: TEventCallback<E[K]>;
};

/**
 * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-2#events}
 * @see {@link http://fabric5.fabricjs.com/events|Events demo}
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
    handler: TEventCallback<E>,
  ): VoidFunction;
  on(handlers: EventRegistryObject<EventSpec>): VoidFunction;
  on<K extends keyof EventSpec, E extends EventSpec[K]>(
    arg0: K | EventRegistryObject<EventSpec>,
    handler?: TEventCallback<E>,
  ): VoidFunction {
    if (!this.__eventListeners) {
      this.__eventListeners = {} as Record<keyof EventSpec, TEventCallback[]>;
    }
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      Object.entries(arg0).forEach(([eventName, handler]) => {
        this.on(eventName as K, handler as TEventCallback);
      });
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
    handler: TEventCallback<E>,
  ): VoidFunction;
  once(handlers: EventRegistryObject<EventSpec>): VoidFunction;
  once<K extends keyof EventSpec, E extends EventSpec[K]>(
    arg0: K | EventRegistryObject<EventSpec>,
    handler?: TEventCallback<E>,
  ): VoidFunction {
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      const disposers: VoidFunction[] = [];
      Object.entries(arg0).forEach(([eventName, handler]) => {
        disposers.push(this.once(eventName as K, handler as TEventCallback));
      });
      return () => disposers.forEach((d) => d());
    } else if (handler) {
      const disposer = this.on<K, E>(
        arg0,
        function onceHandler(this: Observable<EventSpec>, ...args) {
          handler.call(this, ...args);
          disposer();
        },
      );
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
    handler?: TEventCallback,
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
  off<K extends keyof EventSpec>(
    arg0?: K | EventRegistryObject<EventSpec>,
    handler?: TEventCallback,
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
      Object.entries(arg0).forEach(([eventName, handler]) => {
        this._removeEventListener(eventName as K, handler as TEventCallback);
      });
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
