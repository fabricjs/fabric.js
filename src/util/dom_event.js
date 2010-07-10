(function (global) {
  
  /* EVENT HANDLING */
  
  function areHostMethods(object) {
    var methodNames = Array.prototype.slice.call(arguments, 1), 
        t, i, len = methodNames.length;
    for (i = 0; i < len; i++) {
      t = typeof object[methodNames[i]];
      if (!(/^(?:function|object|unknown)$/).test(t)) return false;
    }
    return true;
  }
  var getUniqueId = (function () {
    if (typeof document.documentElement.uniqueID !== 'undefined') {
      return function (element) {
        return element.uniqueID;
      };
    }
    var uid = 0;
    return function (element) {
      return element.__uniqueID || (element.__uniqueID = 'uniqueID__' + uid++);
    };
  })();

  var getElement, setElement;

  (function () {
    var elements = { };
    getElement = function (uid) {
      return elements[uid];
    };
    setElement = function (uid, element) {
      elements[uid] = element;
    };
  })();

  function createListener(uid, handler) {
    return {
      handler: handler,
      wrappedHandler: createWrappedHandler(uid, handler)
    };
  }

  function createWrappedHandler(uid, handler) {
    return function (e) {
      handler.call(getElement(uid), e || window.event);
    };
  }

  function createDispatcher(uid, eventName) {
    return function (e) {
      if (handlers[uid] && handlers[uid][eventName]) {
        var handlersForEvent = handlers[uid][eventName];
        for (var i = 0, len = handlersForEvent.length; i < len; i++) {
          handlersForEvent[i].call(this, e || window.event);
        }
      }
    };
  }

  var shouldUseAddListenerRemoveListener = (
        areHostMethods(document.documentElement, 'addEventListener', 'removeEventListener') &&
        areHostMethods(window, 'addEventListener', 'removeEventListener')),

      shouldUseAttachEventDetachEvent = (
        areHostMethods(document.documentElement, 'attachEvent', 'detachEvent') &&
        areHostMethods(window, 'attachEvent', 'detachEvent')),

      // IE branch
      listeners = { },

      // DOM L0 branch
      handlers = { };

  if (shouldUseAddListenerRemoveListener) {
    addListener = function (element, eventName, handler) {
      element.addEventListener(eventName, handler, false);
    };
    removeListener = function (element, eventName, handler) {
      element.removeEventListener(eventName, handler, false);
    };
  }

  else if (shouldUseAttachEventDetachEvent) {
    addListener = function (element, eventName, handler) { 
      var uid = getUniqueId(element);
      setElement(uid, element);
      if (!listeners[uid]) {
        listeners[uid] = { };
      }
      if (!listeners[uid][eventName]) {
        listeners[uid][eventName] = [ ];

      }
      var listener = createListener(uid, handler);
      listeners[uid][eventName].push(listener);
      element.attachEvent('on' + eventName, listener.wrappedHandler);
    };

    removeListener = function (element, eventName, handler) {
      var uid = getUniqueId(element), listener;
      if (listeners[uid] && listeners[uid][eventName]) {
        for (var i = 0, len = listeners[uid][eventName].length; i < len; i++) {
          listener = listeners[uid][eventName][i];
          if (listener && listener.handler === handler) {
            element.detachEvent('on' + eventName, listener.wrappedHandler);
            listeners[uid][eventName][i] = null;
          }
        }
      }        
    };
  }
  else {
    addListener = function (element, eventName, handler) {
      var uid = getUniqueId(element);
      if (!handlers[uid]) {
        handlers[uid] = { };
      }
      if (!handlers[uid][eventName]) {
        handlers[uid][eventName] = [ ];
        var existingHandler = element['on' + eventName];
        if (existingHandler) {
          handlers[uid][eventName].push(existingHandler);
        }
        element['on' + eventName] = createDispatcher(uid, eventName);
      }
      handlers[uid][eventName].push(handler);
    };
    removeListener = function (element, eventName, handler) {
      var uid = getUniqueId(element);
      if (handlers[uid] && handlers[uid][eventName]) {
        var handlersForEvent = handlers[uid][eventName];
        for (var i = 0, len = handlersForEvent.length; i < len; i++) {
          if (handlersForEvent[i] === handler) {
            handlersForEvent.splice(i, 1);
          }
        }
      }
    };
  }
  
  fabric.util.addListener = addListener;
  fabric.util.removeListener = removeListener;
  
  
  var customEventListeners = { };
  
  function observeEvent(eventName, handler) {
    if (!customEventListeners[eventName]) {
      customEventListeners[eventName] = [ ];
    }
    customEventListeners[eventName].push(handler);
  }
  
  function fireEvent(eventName, memo) {
    if (!customEventListeners[eventName]) return;
    for (var i = 0, len = customEventListeners[eventName].length; i < len; i++) {
      try {
        customEventListeners[eventName][i]({ memo: memo });
      }
      catch(err) {
        setTimeout(function () {
          throw err;
        }, 0);
      }
    }
  }
  
  fabric.util.observeEvent = observeEvent;
  fabric.util.fireEvent = fireEvent;
  
  // TODO (kangax): this method needs fixing
  function getPointer(event) {
    return { x: pointerX(event), y: pointerY(event) };
  }

  function pointerX(event) {
    var docElement = document.documentElement,
        body = document.body || { scrollLeft: 0 };

    return event.pageX || (event.clientX +
      (docElement.scrollLeft || body.scrollLeft) -
      (docElement.clientLeft || 0));
  }

  function pointerY(event) {
    var docElement = document.documentElement,
        body = document.body || { scrollTop: 0 };

    return  event.pageY || (event.clientY +
       (docElement.scrollTop || body.scrollTop) -
       (docElement.clientTop || 0));
  }
  
  fabric.util.getPointer = getPointer;
})(this);