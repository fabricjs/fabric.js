import { defineProperty as _defineProperty } from '../_virtual/_rollupPluginBabelHelpers.mjs';

/**
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#events}
 * @see {@link http://fabricjs.com/events|Events demo}
 */
class Observable {
  constructor() {
    _defineProperty(this, "__eventListeners", {});
  }
  /**
   * Observes specified event
   * @alias on
   * @param {string} eventName Event name (eg. 'after:render')
   * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Function} disposer
   */
  on(arg0, handler) {
    if (!this.__eventListeners) {
      this.__eventListeners = {};
    }
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      Object.entries(arg0).forEach(_ref => {
        let [eventName, handler] = _ref;
        this.on(eventName, handler);
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

  once(arg0, handler) {
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      const disposers = [];
      Object.entries(arg0).forEach(_ref2 => {
        let [eventName, handler] = _ref2;
        disposers.push(this.once(eventName, handler));
      });
      return () => disposers.forEach(d => d());
    } else if (handler) {
      const disposer = this.on(arg0, function onceHandler() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        handler.call(this, ...args);
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
  _removeEventListener(eventName, handler) {
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

  /**
   * unsubscribe an event listener
   * @param {string} eventName event name (eg. 'after:render')
   * @param {TEventCallback} handler event listener to unsubscribe
   */

  /**
   * unsubscribe event listeners
   * @param handlers handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   */

  /**
   * unsubscribe all event listeners
   */

  off(arg0, handler) {
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
      Object.entries(arg0).forEach(_ref3 => {
        let [eventName, handler] = _ref3;
        this._removeEventListener(eventName, handler);
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
  fire(eventName, options) {
    var _this$__eventListener;
    if (!this.__eventListeners) {
      return;
    }
    const listenersForEvent = (_this$__eventListener = this.__eventListeners[eventName]) === null || _this$__eventListener === void 0 ? void 0 : _this$__eventListener.concat();
    if (listenersForEvent) {
      for (let i = 0; i < listenersForEvent.length; i++) {
        listenersForEvent[i].call(this, options || {});
      }
    }
  }
}

export { Observable };
//# sourceMappingURL=Observable.mjs.map
