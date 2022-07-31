//@ts-nocheck

type EventRegistryObject = { [eventName: string]: Function };


/**
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#events}
 * @see {@link http://fabricjs.com/events|Events demo}
 */
export class Observable {

  private __eventListeners: { [eventName: string]: Function[] } = {};

  /**
   * Observes specified event
   * @alias on
   * @param {String|Object} eventName Event name (eg. 'after:render') or object with key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Function} disposer
   */
  on(eventName: string, handler: Function): Function
  on(handlers: EventRegistryObject): Function
  on(arg0: string | EventRegistryObject, handler?: Function): Function {
    if (!this.__eventListeners) {
      this.__eventListeners = {};
    }
    // one object with key/value pairs was passed
    if (typeof arg0 === 'object') {
      for (var prop in arg0) {
        this.on(prop, arg0[prop]);
      }
    }
    else {
      if (!this.__eventListeners[arg0]) {
        this.__eventListeners[arg0] = [];
      }
      this.__eventListeners[arg0].push(handler!);
    }
    return () => this.off(arg0, handler);
  }

  /**
   * Observes specified event **once**
   * @alias once
   * @param {String|Object} arg0 Event name (eg. 'after:render') or object with key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Function} disposer
   */
  once(eventName: string, handler: Function): Function
  once(handlers: EventRegistryObject): Function
  once(arg0: string | EventRegistryObject, handler?: Function): Function {
    // one object with key/value pairs was passed
    if (typeof arg0 === 'object') {
      const disposers: Function[] = [];
      for (let prop in arg0) {
        const _handler = arg0[prop];
        const disposer = this.on(prop, (...args: any[]) => {
          _handler.apply(this, args);
          this.off(prop, disposer);
        });
        disposers.push(disposer);
      }
      return () => disposers.forEach(d => d());
    }
    else {
      const disposer = this.on(arg0, (...args: any[]) => {
        handler!.apply(this, args);
        this.off(arg0, disposer);
      });
      return disposer;
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
      eventListener.splice(index, 1);
    }
    else {
      this.__eventListeners[eventName] = [];
    }
  }

  /**
   * Stops event observing for a particular event handler. Calling this method
   * without arguments removes all handlers for all events
   * @param {String|Object} eventName Event name (eg. 'after:render') or object with key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function to be deleted from EventListeners
   */
  off(eventName: string, handler: Function): void
  off(handlers: EventRegistryObject): void
  off(arg0?: string | EventRegistryObject, handler?: Function) {
    if (!this.__eventListeners) {
      return;
    }

    // remove all key/value pairs (event name -> event handler)
    if (typeof arg0 === 'undefined') {
      for (arg0 in this.__eventListeners) {
        this._removeEventListener(arg0);
      }
    }
    // one object with key/value pairs was passed
    else if (typeof arg0 === 'object') {
      for (var prop in arg0) {
        this._removeEventListener(prop, arg0[prop]);
      }
    }
    else {
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

    var listenersForEvent = this.__eventListeners[eventName]?.concat();
    if (!listenersForEvent) {
      return;
    }
    for (var i = 0, len = listenersForEvent.length; i < len; i++) {
      listenersForEvent[i].call(this, options || {});
    }
  }
}
