/**
 * @namespace
 */
fabric.Observable = {

  /**
   * Observes specified event
   * @method observe
   * @depracated Since 0.8.34. Use `on` instead.
   * @param {String} eventName
   * @param {Function} handler
   */
  observe: function(eventName, handler) {
    if (!this.__eventListeners) {
      this.__eventListeners = { };
    }
    // one object with key/value pairs was passed
    if (arguments.length === 1) {
      for (var prop in eventName) {
        this.on(prop, eventName[prop]);
      }
    }
    else {
      if (!this.__eventListeners[eventName]) {
        this.__eventListeners[eventName] = [ ];
      }
      this.__eventListeners[eventName].push(handler);
    }
  },

  /**
   * Stops event observing for a particular event handler
   * @method stopObserving
   * @depracated Since 0.8.34. Use `off` instead.
   * @param {String} eventName
   * @param {Function} handler
   */
  stopObserving: function(eventName, handler) {
    if (!this.__eventListeners) {
      this.__eventListeners = { };
    }
    if (this.__eventListeners[eventName]) {
      fabric.util.removeFromArray(this.__eventListeners[eventName], handler);
    }
  },

  /**
   * Fires event with an optional options object
   * @method fire
   * @param {String} eventName
   * @param {Object} [options]
   */
  fire: function(eventName, options) {
    if (!this.__eventListeners) {
      this.__eventListeners = { };
    }
    var listenersForEvent = this.__eventListeners[eventName];
    if (!listenersForEvent) return;
    for (var i = 0, len = listenersForEvent.length; i < len; i++) {
      // avoiding try/catch for perf. reasons
      listenersForEvent[i](options || { });
    }
  }
};

/**
 * Alias for observe
 * @method observe
 * @memberOf fabric.Observable
 */
fabric.Observable.on = fabric.Observable.observe;

/**
 * Alias for stopObserving
 * @method off
 */
fabric.Observable.off = fabric.Observable.stopObserving;