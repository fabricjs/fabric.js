(function () {

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
    var uid = 0;
    return function (element) {
      return element.__uniqueID || (element.__uniqueID = 'uniqueID__' + uid++);
    };
  })();

  /** @ignore */
  var getElement, setElement;

  (function () {
    var elements = { };
    /** @ignore */
    getElement = function (uid) {
      return elements[uid];
    };
    /** @ignore */
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
      handler.call(getElement(uid), e || fabric.window.event);
    };
  }

  function createDispatcher(uid, eventName) {
    return function (e) {
      if (handlers[uid] && handlers[uid][eventName]) {
        var handlersForEvent = handlers[uid][eventName];
        for (var i = 0, len = handlersForEvent.length; i < len; i++) {
          handlersForEvent[i].call(this, e || fabric.window.event);
        }
      }
    };
  }

  var shouldUseAddListenerRemoveListener = (
        areHostMethods(fabric.document.documentElement, 'addEventListener', 'removeEventListener') &&
        areHostMethods(fabric.window, 'addEventListener', 'removeEventListener')),

      shouldUseAttachEventDetachEvent = (
        areHostMethods(fabric.document.documentElement, 'attachEvent', 'detachEvent') &&
        areHostMethods(fabric.window, 'attachEvent', 'detachEvent')),

      // IE branch
      listeners = { },

      // DOM L0 branch
      handlers = { },

      addListener, removeListener;

  if (shouldUseAddListenerRemoveListener) {
    /** @ignore */
    addListener = function (element, eventName, handler) {
      element.addEventListener(eventName, handler, false);
    };
    /** @ignore */
    removeListener = function (element, eventName, handler) {
      element.removeEventListener(eventName, handler, false);
    };
  }

  else if (shouldUseAttachEventDetachEvent) {
    /** @ignore */
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
    /** @ignore */
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
    /** @ignore */
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
    /** @ignore */
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

  /**
   * Adds an event listener to an element
   * @mthod addListener
   * @memberOf fabric.util
   * @function
   * @param {HTMLElement} element
   * @param {String} eventName
   * @param {Function} handler
   */
  fabric.util.addListener = addListener;

  /**
   * Removes an event listener from an element
   * @mthod removeListener
   * @memberOf fabric.util
   * @function
   * @param {HTMLElement} element
   * @param {String} eventName
   * @param {Function} handler
   */
  fabric.util.removeListener = removeListener;

  /**
   * Cross-browser wrapper for getting event's coordinates
   * @method getPointer
   * @memberOf fabric.util
   * @param {Event} event
   * @param {HTMLCanvasElement} upperCanvasEl &lt;canvas> element on which object selection is drawn
   */
  function getPointer(event, upperCanvasEl) {
    event || (event = fabric.window.event);

    var element = event.target || (typeof event.srcElement !== 'unknown' ? event.srcElement : null),
        body = fabric.document.body || {scrollLeft: 0, scrollTop: 0},
        docElement = fabric.document.documentElement,
        orgElement = element,
        scrollLeft = 0,
        scrollTop = 0,
        firstFixedAncestor;

    while (element && element.parentNode && !firstFixedAncestor) {
      element = element.parentNode;

      if (element !== fabric.document && fabric.util.getElementPosition(element) === 'fixed') firstFixedAncestor = element;

      if (element !== fabric.document && orgElement !== upperCanvasEl && fabric.util.getElementPosition(element) === 'absolute') {
        scrollLeft = 0;
        scrollTop = 0;
      }
      else if (element === fabric.document && orgElement !== upperCanvasEl) {
        scrollLeft = body.scrollLeft || docElement.scrollLeft || 0;
        scrollTop = body.scrollTop ||  docElement.scrollTop || 0;
      }
      else {
        scrollLeft += element.scrollLeft || 0;
        scrollTop += element.scrollTop || 0;
      }
    }

    return {
      x: pointerX(event) + scrollLeft,
      y: pointerY(event) + scrollTop
    };
  }

  var pointerX = function(event) {
    // looks like in IE (<9) clientX at certain point (apparently when mouseup fires on VML element)
    // is represented as COM object, with all the consequences, like "unknown" type and error on [[Get]]
    // need to investigate later
    return (typeof event.clientX !== 'unknown' ? event.clientX : 0);
  };

  var pointerY = function(event) {
    return (typeof event.clientY !== 'unknown' ? event.clientY : 0);
  };

  if (fabric.isTouchSupported) {
    pointerX = function(event) {
      if (event.type !== 'touchend') {
        return (event.touches && event.touches[0] ? (event.touches[0].pageX - (event.touches[0].pageX - event.touches[0].clientX)) || event.clientX : event.clientX);
      }
      return (event.changedTouches && event.changedTouches[0] ? (event.changedTouches[0].pageX - (event.changedTouches[0].pageX - event.changedTouches[0].clientX)) || event.clientX : event.clientX);
    };
    pointerY = function(event) {
      if (event.type !== 'touchend') {
        return (event.touches && event.touches[0] ? (event.touches[0].pageY - (event.touches[0].pageY - event.touches[0].clientY)) || event.clientY : event.clientY);
      }
      return (event.changedTouches && event.changedTouches[0] ? (event.changedTouches[0].pageY - (event.changedTouches[0].pageY - event.changedTouches[0].clientY)) || event.clientY : event.clientY);
    };
  }

  fabric.util.getPointer = getPointer;

  fabric.util.object.extend(fabric.util, fabric.Observable);

})();
