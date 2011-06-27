fabric.Observable = {
  
  /**
   * @mthod observe
   * @param {String} eventName
   * @param {Function} handler
   */
  observe: function(eventName, handler) {
    if (!this.__eventListeners) {
      this.__eventListeners = { };
    }
    if (!this.__eventListeners[eventName]) {
      this.__eventListeners[eventName] = [ ];
    }
    this.__eventListeners[eventName].push(handler);
  },
  
  /**
   * @mthod stopObserving
   * @memberOf fabric.util
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
   * Fires event with an optional memo object
   * @mthod fire
   * @memberOf fabric.util
   * @param {String} eventName
   * @param {Object} [memo]
   */
  fire: function(eventName, memo) {
    if (!this.__eventListeners) {
      this.__eventListeners = { }
    }
    var listenersForEvent = this.__eventListeners[eventName];
    if (!listenersForEvent) return;
    for (var i = 0, len = listenersForEvent.length; i < len; i++) {
      // avoiding try/catch for perf. reasons
      listenersForEvent[i]({ memo: memo });
    }
  }
};