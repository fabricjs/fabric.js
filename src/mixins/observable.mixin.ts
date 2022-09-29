//@ts-nocheck

import { fabric } from '../../HEADER';

type EventRegistryObject = Record<string, Function>;

/**
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#events}
 * @see {@link http://fabricjs.com/events|Events demo}
 */
export class Observable {
  private __eventListeners: Record<Function[]> = {};

  /**
   * Observes specified event
   * @alias on
   * @param {string} eventName Event name (eg. 'after:render')
   * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Function} disposer
   */
  on(eventName: string, handler: Function): Function;
  on(handlers: EventRegistryObject): Function;
  on(arg0: string | EventRegistryObject, handler?: Function): Function {
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
  once(eventName: string, handler: Function): Function;
  once(handlers: EventRegistryObject): Function;
  once(arg0: string | EventRegistryObject, handler?: Function): Function {
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      const disposers: Function[] = [];
      for (const eventName in arg0) {
        disposers.push(this.once(eventName, arg0[eventName]));
      }
      return () => disposers.forEach((d) => d());
    } else if (handler) {
      const disposer = this.on(arg0, (...args: any[]) => {
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
  private _removeEventListener(eventName: string, handler?: Function) {
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
  off(eventName: string, handler: Function): void;
  off(handlers: EventRegistryObject): void;
  off(arg0?: string | EventRegistryObject, handler?: Function) {
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
  fire(eventName: string, options: object) {
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
