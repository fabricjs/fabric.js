import { fabric } from '../../HEADER';

export type TEventCallback<T = any> = (options: T) => any;

type EventRegistryObject<T = any> = Record<string, TEventCallback<T>>;

/**
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#events}
 * @see {@link http://fabricjs.com/events|Events demo}
 */
export class Observable {
  private __eventListeners: Record<string, TEventCallback[]> = {};

  /**
   * Observes specified event
   * @alias on
   * @param {string} eventName Event name (eg. 'after:render')
   * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Function} disposer
   */
  on<T>(eventName: string, handler: TEventCallback<T>): VoidFunction;
  on<T>(handlers: EventRegistryObject<T>): VoidFunction;
  on<T>(
    arg0: string | EventRegistryObject<T>,
    handler?: TEventCallback<T>
  ): VoidFunction {
    if (!this.__eventListeners) {
      this.__eventListeners = {};
    }
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      for (const eventName in arg0) {
        this.on(eventName, arg0[eventName]);
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
  once<T>(eventName: string, handler: TEventCallback<T>): VoidFunction;
  once<T>(handlers: EventRegistryObject<T>): VoidFunction;
  once<T>(
    arg0: string | EventRegistryObject<T>,
    handler?: TEventCallback<T>
  ): VoidFunction {
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      const disposers: VoidFunction[] = [];
      for (const eventName in arg0) {
        disposers.push(this.once(eventName, arg0[eventName]));
      }
      return () => disposers.forEach((d) => d());
    } else if (handler) {
      const disposer = this.on<T>(arg0, (...args) => {
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
  private _removeEventListener(eventName: string, handler?: TEventCallback) {
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
   * Stops event observing for a particular event handler. Calling this method
   * without arguments removes all handlers for all events
   * @param {string} eventName Event name (eg. 'after:render')
   * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function to be deleted from EventListeners
   */
  off(eventName: string, handler: TEventCallback): void;
  off(handlers: EventRegistryObject): void;
  off(arg0?: string | EventRegistryObject, handler?: TEventCallback) {
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
        this._removeEventListener(eventName, arg0[eventName]);
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
  fire(eventName: string, options?: object) {
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

fabric.Observable = Observable;
