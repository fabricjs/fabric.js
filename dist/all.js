/*! Fabric.js Copyright 2010, Bitsonnet (Juriy Zaytsev, Maxim Chernyak) */

if (typeof console == 'undefined') {
  var console = {
    log: function() { },
    warn: function() { }
  };
}

/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:


            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/



if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {


        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {


        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];


        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }


        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }


        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':


            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':


            return String(value);


        case 'object':


            if (!value) {
                return 'null';
            }


            gap += indent;
            partial = [];


            if (Object.prototype.toString.apply(value) === '[object Array]') {


                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }


                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }


            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {


                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }


            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }


    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {


            var i;
            gap = '';
            indent = '';


            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }


            } else if (typeof space === 'string') {
                indent = space;
            }


            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }


            return str('', {'': value});
        };
    }



    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {


            var j;

            function walk(holder, key) {


                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }



            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }



            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');


                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }


            throw new SyntaxError('JSON.parse');
        };
    }
}());

(function (global) {

  var fabric = this.fabric || (this.fabric = { }),
      slice = Array.prototype.slice;

  fabric.util = { };

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(value, from) {
    var len = this.length >>> 0;
    from = Number(from) || 0;
    from = Math[from < 0 ? 'ceil' : 'floor'](from);
    if (from < 0) {
      from += len;
    }
    for (; from < len; from++) {
      if (from in this && this[from] === value) {
        return from;
      }
    }
    return -1;
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fn, context) {
    for (var i = 0, len = this.length >>> 0; i < len; i++) {
      if (i in this) {
        fn.call(context, this[i], i, this);
      }
    }
  };
}

if (!Array.prototype.map) {
  Array.prototype.map = function(fn, context) {
    var result = [ ];
    for (var i = 0, len = this.length >>> 0; i < len; i++) {
      if (i in this) {
        result[i] = fn.call(context, this[i], i, this);
      }
    }
    return result;
  };
}

if (!Array.prototype.every) {
  Array.prototype.every = function(fn, context) {
    for (var i = 0, len = this.length >>> 0; i < len; i++) {
      if (i in this && !fn.call(context, this[i], i, this)) {
        return false;
      }
    }
    return true;
  };
}

if (!Array.prototype.some) {
  Array.prototype.some = function(fn, context) {
    for (var i = 0, len = this.length >>> 0; i < len; i++) {
      if (i in this && fn.call(context, this[i], i, this)) {
        return true;
      }
    }
    return false;
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fn, context) {
    var result = [ ], val;
    for (var i = 0, len = this.length >>> 0; i < len; i++) {
      if (i in this) {
        val = this[i]; // in case fn mutates this
        if (fn.call(context, val, i, this)) {
          result.push(val);
        }
      }
    }
    return res;
  };
}

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(fn /*, initial*/) {
    var len = this.length >>> 0,
        i = 0,
        rv;

    if (arguments.length > 1) {
      rv = arguments[1];
    }
    else {
      do {
        if (i in this) {
          rv = this[i++];
          break;
        }
        if (++i >= len) {
          throw new TypeError();
        }
      }
      while (true);
    }
    for (; i < len; i++) {
      if (i in this) {
        rv = fn.call(null, rv, this[i], i, this);
      }
    }
    return rv;
  };
}

function invoke(array, method) {
  var args = slice.call(arguments, 2), result = [ ];
  for (var i = 0, len = array.length; i < len; i++) {
    result[i] = args.length ? array[i][method].apply(array[i], args) : array[i][method].call(array[i]);
  }
  return result;
}

function max(array, byProperty) {
  var i = array.length - 1,
      result = byProperty ? array[i][byProperty] : array[i];
  if (byProperty) {
    while (i--) {
      if (array[i][byProperty] >= result) {
        result = array[i][byProperty];
      }
    }
  }
  else {
    while (i--) {
      if (array[i] >= result) {
        result = array[i];
      }
    }
  }
  return result;
}

function min(array, byProperty) {
  var i = array.length - 1,
      result = byProperty ? array[i][byProperty] : array[i];

  if (byProperty) {
    while (i--) {
      if (array[i][byProperty] < result) {
        result = array[i][byProperty];
      }
    }
  }
  else {
    while (i--) {
      if (array[i] < result) {
        result = array[i];
      }
    }
  }
  return result;
}

fabric.util.array = {
  invoke: invoke,
  min: min,
  max: max
};
function extend(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

function clone(object) {
  return extend({ }, object);
}

fabric.util.object = {
  extend: extend,
  clone: clone
};
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  };
}

function camelize(string) {
  return string.replace(/-+(.)?/g, function(match, character) {
    return character ? character.toUpperCase() : '';
  });
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

fabric.util.string = {
  camelize: camelize,
  capitalize: capitalize
};
if (!Function.prototype.bind) {
  Function.prototype.bind = function(thisArg) {
    var fn = this, args = Array.prototype.slice.call(arguments, 1);
    return function() {
      return fn.apply(thisArg, args.concat(Array.prototype.slice.call(arguments)));
    };
  };
}

(function() {

  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })();

  var addMethods;
  if (IS_DONTENUM_BUGGY) {
    addMethods = function(klass, source) {
      if (source.toString !== Object.prototype.toString) {
        klass.prototype.toString = source.toString;
      }
      if (source.valueOf !== Object.prototype.valueOf) {
        klass.prototype.valueOf = source.valueOf;
      }
      for (var property in source) {
        klass.prototype[property] = source[property];
      }
    };
  }
  else {
    addMethods = function(klass, source) {
      for (var property in source) {
        klass.prototype[property] = source[property];
      }
    };
  }

  function subclass() { };
  function createClass() {
    var parent = null,
        properties = slice.call(arguments, 0);

    if (typeof properties[0] === 'function') {
      parent = properties.shift();
    }
    function klass() {
      this.initialize.apply(this, arguments);
    }

    klass.superclass = parent;
    klass.subclasses = [ ];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }
    for (var i = 0, length = properties.length; i < length; i++) {
      addMethods(klass, properties[i]);
    }
    if (!klass.prototype.initialize) {
      klass.prototype.initialize = emptyFunction;
    }
    klass.prototype.constructor = klass;
    return klass;
  }

  fabric.util.createClass = createClass;
})();

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

      listeners = { },

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
    var listenersForEvent = customEventListeners[eventName];
    if (!listenersForEvent) return;
    for (var i = 0, len = listenersForEvent.length; i < len; i++) {
      listenersForEvent[i]({ memo: memo });
    }
  }

  fabric.util.observeEvent = observeEvent;
  fabric.util.fireEvent = fireEvent;

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
(function () {

  function setStyle(element, styles) {
    var elementStyle = element.style, match;
    if (typeof styles === 'string') {
      element.style.cssText += ';' + styles;
      return styles.indexOf('opacity') > -1
        ? setOpacity(element, styles.match(/opacity:\s*(\d?\.?\d*)/)[1])
        : element;
    }
    for (var property in styles) {
      if (property === 'opacity') {
        setOpacity(element, styles[property]);
      }
      else {
        var normalizedProperty = (property === 'float' || property === 'cssFloat')
          ? (typeof elementStyle.styleFloat === 'undefined' ? 'cssFloat' : 'styleFloat')
          : property;
        elementStyle[normalizedProperty] = styles[property];
      }
    }
    return element;
  }

  var parseEl = document.createElement('div'),
      supportsOpacity = typeof parseEl.style.opacity === 'string',
      supportsFilters = typeof parseEl.style.filter === 'string',
      view = document.defaultView,
      supportsGCS = view && typeof view.getComputedStyle !== 'undefined',
      reOpacity = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
      setOpacity = function (element) { return element; };

  if (supportsOpacity) {
    setOpacity = function(element, value) {
      element.style.opacity = value;
      return element;
    };
  }
  else if (supportsFilters) {
    setOpacity = function(element, value) {
      var es = element.style;
      if (element.currentStyle && !element.currentStyle.hasLayout) {
        es.zoom = 1;
      }
      if (reOpacity.test(es.filter)) {
        value = value >= 0.9999 ? '' : ('alpha(opacity=' + (value * 100) + ')');
        es.filter = es.filter.replace(reOpacity, value);
      }
      else {
        es.filter += ' alpha(opacity=' + (value * 100) + ')';
      }
      return element;
    };
  }

  fabric.util.setStyle = setStyle;

})();
function getById(id) {
  return typeof id === 'string' ? document.getElementById(id) : id;
}

function toArray(arrayLike) {
  var arr = [ ], i = arrayLike.length;
  while (i--) {
    arr[i] = arrayLike[i];
  }
  return arr;
}

function makeElement(tagName, attributes) {
  var el = document.createElement(tagName);
  for (var prop in attributes) {
    if (prop === 'class') {
      el.className = attributes[prop];
    }
    else if (prop === 'for') {
      el.htmlFor = attributes[prop];
    }
    else {
      el.setAttribute(prop, attributes[prop]);
    }
  }
  return el;
}

function addClass(element, className) {
  if ((' ' + element.className + ' ').indexOf(' ' + className + ' ') === -1) {
    element.className += (element.className ? ' ' : '') + className;
  }
}

function wrapElement(element, wrapper, attributes) {
  if (typeof wrapper === 'string') {
    wrapper = makeElement(wrapper, attributes);
  }
  if (element.parentNode) {
    element.parentNode.replaceChild(wrapper, element);
  }
  wrapper.appendChild(element);
  return wrapper;
}

function getElementOffset(element) {
  var valueT = 0, valueL = 0;
  do {
    valueT += element.offsetTop  || 0;
    valueL += element.offsetLeft || 0;
    element = element.offsetParent;
  }
  while (element);
  return ({ left: valueL, top: valueT });
}

function falseFunction() { return false; };

(function () {
  var style = document.documentElement.style;

  var selectProp = 'userSelect' in style
    ? 'userSelect'
    : 'MozUserSelect' in style
      ? 'MozUserSelect'
      : 'WebkitUserSelect' in style
        ? 'WebkitUserSelect'
        : 'KhtmlUserSelect' in style
          ? 'KhtmlUserSelect'
          : '';

  function makeElementUnselectable(element) {
    if (typeof element.onselectstart !== 'undefined') {
      element.onselectstart = falseFunction;
    }
    if (selectProp) {
      element.style[selectProp] = 'none';
    }
    else if (typeof element.unselectable == 'string') {
      element.unselectable = 'on';
    }
    return element;
  }

  fabric.util.makeElementUnselectable = makeElementUnselectable
})();

(function(){

  function getScript(url, callback) {
  	var headEl = document.getElementsByTagName("head")[0],
  	    scriptEl = document.createElement('script'),
  	    loading = true;

  	scriptEl.type = 'text/javascript';
  	scriptEl.setAttribute('runat', 'server');
  	scriptEl.onload = scriptEl.onreadystatechange = function(e) {
  	  if (loading) {
  	    if (typeof this.readyState == 'string' &&
  	        this.readyState !== 'loaded' &&
  	        this.readyState !== 'complete') return;
    	  loading = false;
    		callback(e || window.event);
    		scriptEl = scriptEl.onload = scriptEl.onreadystatechange = null;
    	}
  	};
  	scriptEl.src = url;
  	headEl.appendChild(scriptEl);
  }

  function getScriptJaxer(url, callback) {
    Jaxer.load(url);
    callback();
  }

  fabric.util.getScript = getScript;

  var Jaxer = this.Jaxer;
  if (Jaxer && Jaxer.load) {
    fabric.util.getScript = getScriptJaxer;
  }
})();

function animate(options) {
  options || (options = { });
  var start = +new Date(),
      duration = options.duration || 500,
      finish = start + duration, time, pos,
      onChange = options.onChange || function() { },
      easing = options.easing || function(pos) { return (-Math.cos(pos * Math.PI) / 2) + 0.5; },
      startValue = 'startValue' in options ? options.startValue : 0,
      endValue = 'endValue' in options ? options.endValue : 100,
      isReversed = startValue > endValue

  options.onStart && options.onStart();

  var interval = setInterval(function() {
    time = +new Date();
    pos = time > finish ? 1 : (time - start) / duration;
    onChange(isReversed
      ? (startValue - (startValue - endValue) * easing(pos))
      : (startValue + (endValue - startValue) * easing(pos)));
    if (time > finish) {
      clearInterval(interval);
      options.onComplete && options.onComplete();
    }
  }, 10);
}

fabric.util.getById = getById;
fabric.util.toArray = toArray;
fabric.util.makeElement = makeElement;
fabric.util.addClass = addClass;
fabric.util.wrapElement = wrapElement;
fabric.util.getElementOffset = getElementOffset;
fabric.util.animate = animate;

(function(){

  function addParamToUrl(url, param) {
    return url + (/\?/.test(url) ? '&' : '?') + param;
  }

  var makeXHR = (function() {
    var factories = [
      function() { return new ActiveXObject("Microsoft.XMLHTTP"); },
      function() { return new ActiveXObject("Msxml2.XMLHTTP"); },
      function() { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); },
      function() { return new XMLHttpRequest(); }
    ];
    for (var i = factories.length; i--; ) {
      try {
        var req = factories[i]();
        if (req) {
          return factories[i];
        }
      }
      catch (err) { }
    }
  })();

  function emptyFn() { };

  function request(url, options) {

    options || (options = { });

    var method = options.method ? options.method.toUpperCase() : 'GET',
        onComplete = options.onComplete || function() { },
        request = makeXHR(),
        body;

    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        onComplete(request);
        request.onreadystatechange = emptyFn;
      }
    };

    if (method === 'GET') {
      body = null;
      if (typeof options.parameters == 'string') {
        url = addParamToUrl(url, options.parameters);
      }
    }

    request.open(method, url, true);

    if (method === 'POST' || method === 'PUT') {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    request.send(body);
    return request;
  };

  fabric.util.request = request;
})();

(function(){

  /**
   * @static
   * Removes value from an array.
   * Presence of value (and its position in an array) is determined via `Array.prototype.indexOf`
   * @param {Array} array
   * @param {Any} value
   * @return {Array} original array
   */
  function removeFromArray(array, value) {
    var idx = array.indexOf(value);
    if (idx !== -1) {
      array.splice(idx, 1);
    }
    return array;
  };

  /**
   * @static
   * @method getRandomInt
   * @param {Number} min lower limit
   * @param {Number} max upper limit
   * @return {Number} random value (between min and max)
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * @static
   * Transforms degrees to radians
   * @param {Number} degrees value in degrees
   * @return {Number} value in radians
   */
  var PiBy180 = Math.PI / 180;
  function degreesToRadians(degrees) {
    return degrees * PiBy180;
  }

  /**
   * A wrapper around Number#toFixed,
   * which contrary to native method returns number, not string
   * @param {Number | String} number number to operate on
   * @param {Number} fractionDigits number of fraction digits to "leave"
   * @return {Number}
   */
   function toFixed(number, fractionDigits) {
     return parseFloat(Number(number).toFixed(fractionDigits));
   }

   fabric.util.removeFromArray = removeFromArray;
   fabric.util.degreesToRadians = degreesToRadians;
   fabric.util.toFixed = toFixed;
   fabric.util.getRandomInt = getRandomInt;
})();

})(this);
(function(){

  var fabric = this.fabric || (this.fabric = { }),
      extend = fabric.util.object.extend,
      capitalize = fabric.util.string.capitalize,
      clone = fabric.util.object.clone;

  var attributesMap = {
    'cx':             'left',
    'x':              'left',
    'cy':             'top',
    'y':              'top',
    'r':              'radius',
    'fill-opacity':   'opacity',
    'fill-rule':      'fillRule',
    'stroke-width':   'strokeWidth',
    'transform':      'transformMatrix'
  };

  /**
   * Returns an object of attributes' name/value, given element and an array of attribute names
   * Parses parent "g" nodes recursively upwards
   * @param {DOMElement} element Element to parse
   * @param {Array} attributes Array of attributes to parse
   * @return {Object} object containing parsed attributes' names/values
   */
  function parseAttributes(element, attributes) {

    if (!element) {
      return;
    }

    var value,
        parsed,
        parentAttributes = { };

    if (element.parentNode && /^g$/i.test(element.parentNode.nodeName)) {
      parentAttributes = fabric.parseAttributes(element.parentNode, attributes);
    }

    var ownAttributes = attributes.reduce(function(memo, attr) {
      value = element.getAttribute(attr);
      parsed = parseFloat(value);
      if (value) {
        if ((attr === 'fill' || attr === 'stroke') && value === 'none') {
          value = '';
        }
        if (attr === 'fill-rule') {
          value = (value === 'evenodd') ? 'destination-over' : value;
        }
        if (attr === 'transform') {
          value = fabric.parseTransformAttribute(value);
        }
        if (attr in attributesMap) {
          attr = attributesMap[attr];
        }
        memo[attr] = isNaN(parsed) ? value : parsed;
      }
      return memo;
    }, { });

    ownAttributes = extend(fabric.parseStyleAttribute(element), ownAttributes);
    return extend(parentAttributes, ownAttributes);
  };

  /**
   * @static
   * @method fabric.parseTransformAttribute
   * @param attributeValue {String} string containing attribute value
   * @return {Array} array of 6 elements representing transformation matrix
   */
  fabric.parseTransformAttribute = (function() {
    function rotateMatrix(matrix, args) {
      var angle = args[0];

      matrix[0] = Math.cos(angle);
      matrix[1] = Math.sin(angle);
      matrix[2] = -Math.sin(angle);
      matrix[3] = Math.cos(angle);
    }

    function scaleMatrix(matrix, args) {
      var multiplierX = args[0],
          multiplierY = (args.length === 2) ? args[1] : args[0];

      matrix[0] = multiplierX;
      matrix[3] = multiplierY;
    }

    function skewXMatrix(matrix, args) {
      matrix[2] = args[0];
    }

    function skewYMatrix(matrix, args) {
      matrix[1] = args[0];
    }

    function translateMatrix(matrix, args) {
      matrix[4] = args[0];
      if (args.length === 2) {
        matrix[5] = args[1];
      }
    }

    var iMatrix = [
          1, // a
          0, // b
          0, // c
          1, // d
          0, // e
          0  // f
        ],

        number = '(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)',
        comma_wsp = '(?:\\s+,?\\s*|,\\s*)',

        skewX = '(?:(skewX)\\s*\\(\\s*(' + number + ')\\s*\\))',
        skewY = '(?:(skewY)\\s*\\(\\s*(' + number + ')\\s*\\))',
        rotate = '(?:(rotate)\\s*\\(\\s*(' + number + ')(?:' + comma_wsp + '(' + number + ')' + comma_wsp + '(' + number + '))?\\s*\\))',
        scale = '(?:(scale)\\s*\\(\\s*(' + number + ')(?:' + comma_wsp + '(' + number + '))?\\s*\\))',
        translate = '(?:(translate)\\s*\\(\\s*(' + number + ')(?:' + comma_wsp + '(' + number + '))?\\s*\\))',

        matrix = '(?:(matrix)\\s*\\(\\s*' +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' + comma_wsp +
                  '(' + number + ')' +
                  '\\s*\\))',

        transform = '(?:' +
                    matrix + '|' +
                    translate + '|' +
                    scale + '|' +
                    rotate + '|' +
                    skewX + '|' +
                    skewY +
                    ')',

        transforms = '(?:' + transform + '(?:' + comma_wsp + transform + ')*' + ')',

        transform_list = '^\\s*(?:' + transforms + '?)\\s*$',

        reTransformList = new RegExp(transform_list),

        reTransform = new RegExp(transform);

    return function(attributeValue) {

      var matrix = iMatrix.concat();

      if (!attributeValue || (attributeValue && !reTransformList.test(attributeValue))) {
        return matrix;
      }

      attributeValue.replace(reTransform, function(match) {

        var m = new RegExp(transform).exec(match).filter(function (match) {
              return (match !== '' && match != null);
            }),
            operation = m[1],
            args = m.slice(2).map(parseFloat);

        switch(operation) {
          case 'translate':
            translateMatrix(matrix, args);
            break;
          case 'rotate':
            rotateMatrix(matrix, args);
            break;
          case 'scale':
            scaleMatrix(matrix, args);
            break;
          case 'skewX':
            skewXMatrix(matrix, args);
            break;
          case 'skewY':
            skewYMatrix(matrix, args);
            break;
          case 'matrix':
            matrix = args;
            break;
        }
      })
      return matrix;
    }
  })();

  /**
   * @static
   * @method fabric.parsePointsAttribute
   * @param points {String} points attribute string
   * @return {Array} array of points
   */
  function parsePointsAttribute(points) {
    if (!points) return null;
    points = points.trim().split(/\s+/);
    var parsedPoints = points.reduce(function(memo, pair) {
      pair = pair.split(',');
      memo.push({ x: parseFloat(pair[0]), y: parseFloat(pair[1]) });
      return memo;
    }, [ ]);

    if (parsedPoints.length % 2 !== 0) {
      return null;
    }
    return parsedPoints;
  };

  /**
   * @static
   * @method fabric.parseStyleAttribute
   * @param element {SVGElement} element to parse
   * @return {Object} objects with values parsed from style attribute of an element
   */
  function parseStyleAttribute(element) {
    var oStyle = { },
        style = element.getAttribute('style');
    if (style) {
      if (typeof style == 'string') {
        style = style.split(';');
        style.pop();
        oStyle = style.reduce(function(memo, current) {
          var attr = current.split(':'),
              key = attr[0].trim(),
              value = attr[1].trim();
          memo[key] = value;
          return memo;
        }, { });
      }
      else {
        for (var prop in style) {
          if (typeof style[prop] !== 'undefined') {
            oStyle[prop] = style[prop];
          }
        }
      }
    }
    return oStyle;
  };

  /**
   * @static
   * @method fabric.parseElements
   * @param elements {Array} array of elements to parse
   * @param options {Object} options object
   * @return {Array} array of corresponding instances (transformed from SVG elements)
   */
   function parseElements(elements, options) {
    var _elements = elements.map(function(el) {
      var klass = fabric[capitalize(el.tagName)];
      if (klass && klass.fromElement) {
        try {
          return klass.fromElement(el, options);
        }
        catch(e) {
          console.log(e.message || e);
        }
      }
    });
    _elements = _elements.filter(function(el) {
      return el != null;
    });
    return _elements;
  };

  /**
   * @static
   * @method fabric.parseSVGDocument
   * @param doc {SVGDocument} SVG document to parse
   * @param callback {Function} callback to call when parsing is finished.
   * Callback is being passed array of elements (parsed from a document)
   */
  fabric.parseSVGDocument = (function(){

    var reAllowedSVGTagNames = /^(path|circle|polygon|polyline|ellipse|rect|line)$/;


    var reNum = '(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)';

    var reViewBoxAttrValue = new RegExp(
      '^' +
      '\\s*(' + reNum + '+)\\s*,?' +
      '\\s*(' + reNum + '+)\\s*,?' +
      '\\s*(' + reNum + '+)\\s*,?' +
      '\\s*(' + reNum + '+)\\s*' +
      '$'
    );

    function hasParentWithNodeName(element, parentNodeName) {
      while (element && (element = element.parentNode)) {
        if (element.nodeName === parentNodeName) {
          return true;
        }
      }
      return false;
    }

    return function(doc, callback) {
      if (!doc) return;
      var descendants = fabric.util.toArray(doc.getElementsByTagName('*'));

      var elements = descendants.filter(function(el) {
        return reAllowedSVGTagNames.test(el.tagName) &&
          !hasParentWithNodeName(el, 'pattern');
      });

      if (!elements || (elements && !elements.length)) return;

      var viewBoxAttr = doc.getAttribute('viewBox'),
          widthAttr = doc.getAttribute('width'),
          heightAttr = doc.getAttribute('height'),
          width = null,
          height = null,
          minX,
          minY;

      if (viewBoxAttr && (viewBoxAttr = viewBoxAttr.match(reViewBoxAttrValue))) {
        minX = parseInt(viewBoxAttr[1], 10);
        minY = parseInt(viewBoxAttr[2], 10);
        width = parseInt(viewBoxAttr[3], 10);
        height = parseInt(viewBoxAttr[4], 10);
      }

      width = widthAttr ? parseFloat(widthAttr) : width;
      height = heightAttr ? parseFloat(heightAttr) : height;

      var options = {
        width: width,
        height: height
      };

      var elements = fabric.parseElements(elements, clone(options));
      if (!elements || (elements && !elements.length)) return;

      if (callback) {
        callback(elements, options);
      }
    };
  })();

  extend(fabric, {
    parseAttributes:        parseAttributes,
    parseElements:          parseElements,
    parseStyleAttribute:    parseStyleAttribute,
    parsePointsAttribute:   parsePointsAttribute
  });

})();

(function() {

  /* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

  var fabric = this.fabric || (this.fabric = { });

  if (fabric.Point) {
    console.warn('fabric.Point is already defined');
    return;
  }

  function Point(x, y) {
    if (arguments.length > 0) {
      this.init(x, y);
    }
  }

  Point.prototype = {
    constructor: Point,
    init: function (x, y) {
      this.x = x;
      this.y = y;
    },
    add: function (that) {
      return new Point(this.x + that.x, this.y + that.y);
    },
    addEquals: function (that) {
      this.x += that.x;
      this.y += that.y;
      return this;
    },
    scalarAdd: function (scalar) {
      return new Point(this.x + scalar, this.y + scalar);
    },
    scalarAddEquals: function (scalar) {
      this.x += scalar;
      this.y += scalar;
      return this;
    },
    subtract: function (that) {
      return new Point(this.x - that.x, this.y - that.y);
    },
    subtractEquals: function (that) {
      this.x -= that.x;
      this.y -= that.y;
      return this;
    },
    scalarSubtract: function (scalar) {
      return new Point(this.x - scalar, this.y - scalar);
    },
    scalarSubtractEquals: function (scalar) {
      this.x -= scalar;
      this.y -= scalar;
      return this;
    },
    multiply: function (scalar) {
      return new Point(this.x * scalar, this.y * scalar);
    },
    multiplyEquals: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },
    divide: function (scalar) {
      return new Point(this.x / scalar, this.y / scalar);
    },
    divideEquals: function (scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    },
    eq: function (that) {
      return (this.x == that.x && this.y == that.y);
    },
    lt: function (that) {
      return (this.x < that.x && this.y < that.y);
    },
    lte: function (that) {
      return (this.x <= that.x && this.y <= that.y);
    },
    gt: function (that) {
      return (this.x > that.x && this.y > that.y);
    },
    gte: function (that) {
      return (this.x >= that.x && this.y >= that.y);
    },
    lerp: function (that, t) {
      return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
    },
    distanceFrom: function (that) {
      var dx = this.x - that.x,
          dy = this.y - that.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    min: function (that) {
      return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
    },
    max: function (that) {
      return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
    },
    toString: function () {
      return this.x + "," + this.y;
    },
    setXY: function (x, y) {
      this.x = x;
      this.y = y;
    },
    setFromPoint: function (that) {
      this.x = that.x;
      this.y = that.y;
    },
    swap: function (that) {
      var x = this.x,
          y = this.y;
      this.x = that.x;
      this.y = that.y;
      that.x = x;
      that.y = y;
    }
  };

  fabric.Point = Point;

})();

(function() {

  /* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

  var global = this,
      fabric = global.fabric || (global.fabric = { });

  if (fabric.Intersection) {
    console.warn('fabric.Intersection is already defined');
    return;
  }

  function Intersection(status) {
    if (arguments.length > 0) {
      this.init(status);
    }
  }

  Intersection.prototype.init = function (status) {
    this.status = status;
    this.points = [];
  };
  Intersection.prototype.appendPoint = function (point) {
    this.points.push(point);
  };
  Intersection.prototype.appendPoints = function (points) {
    this.points = this.points.concat(points);
  };

  Intersection.intersectLineLine = function (a1, a2, b1, b2) {
    var result,
        ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
        ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
        u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (u_b != 0) {
      var ua = ua_t / u_b,
          ub = ub_t / u_b;
      if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
        result = new Intersection("Intersection");
        result.points.push(new fabric.Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
      }
      else {
        result = new Intersection("No Intersection");
      }
    }
    else {
      if (ua_t == 0 || ub_t == 0) {
        result = new Intersection("Coincident");
      }
      else {
        result = new Intersection("Parallel");
      }
    }
    return result;
  };

  Intersection.intersectLinePolygon = function(a1,a2,points){
    var result = new Intersection("No Intersection"),
        length = points.length;

    for (var i = 0; i < length; i++) {
      var b1 = points[i],
          b2 = points[(i+1) % length],
          inter = Intersection.intersectLineLine(a1, a2, b1, b2);

      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = "Intersection";
    }
    return result;
  };

  Intersection.intersectPolygonPolygon = function (points1, points2) {
    var result = new Intersection("No Intersection"),
        length = points1.length;

    for (var i = 0; i < length; i++) {
      var a1 = points1[i],
          a2 = points1[(i+1) % length],
          inter = Intersection.intersectLinePolygon(a1, a2, points2);

      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = "Intersection";
    }
    return result;
  };

  Intersection.intersectPolygonRectangle = function (points, r1, r2) {
    var min = r1.min(r2),
        max = r1.max(r2),
        topRight = new fabric.Point(max.x, min.y),
        bottomLeft = new fabric.Point(min.x, max.y),
        inter1 = Intersection.intersectLinePolygon(min, topRight, points),
        inter2 = Intersection.intersectLinePolygon(topRight, max, points),
        inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points),
        inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points),
        result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    if (result.points.length > 0) {
      result.status="Intersection";
    }
    return result;
  };

  fabric.Intersection = Intersection;

})();

(function() {

  var fabric = this.fabric || (this.fabric = { });

  if (fabric.Color) {
    console.warn('fabric.Color is already defined.');
    return;
  }

  fabric.Color = Color;

  /**
   * @constructor
   * @param {String} color (optional) in hex or rgb(a) format
   */
  function Color(color) {
    if (!color) {
      this.setSource([0, 0, 0, 1]);
    }
    else {
      this._tryParsingColor(color);
    }
  }

  /**
   * @private
   * @method _tryParsingColor
   */
  Color.prototype._tryParsingColor = function(color) {
    var source = Color.sourceFromHex(color);
    if (!source) {
      source = Color.sourceFromRgb(color);
    }
    if (source) {
      this.setSource(source);
    }
  }

  /**
   * @method getSource
   * @return {Array}
   */
  Color.prototype.getSource = function() {
    return this._source;
  };

  /**
   * @method setSource
   * @param {Array} source
   */
  Color.prototype.setSource = function(source) {
    this._source = source;
  };

  /**
   * @method toRgb
   * @return {String} ex: rgb(0-255,0-255,0-255)
   */
  Color.prototype.toRgb = function() {
    var source = this.getSource();
    return 'rgb(' + source[0] + ',' + source[1] + ',' + source[2] + ')';
  };

  /**
   * @method toRgba
   * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
   */
  Color.prototype.toRgba = function() {
    var source = this.getSource();
    return 'rgba(' + source[0] + ',' + source[1] + ',' + source[2] + ',' + source[3] + ')';
  };

  /**
   * @method toHex
   * @return {String} ex: FF5555
   */
  Color.prototype.toHex = function() {
    var source = this.getSource();

    var r = source[0].toString(16);
    r = (r.length == 1) ? ('0' + r) : r;

    var g = source[1].toString(16);
    g = (g.length == 1) ? ('0' + g) : g;

    var b = source[2].toString(16);
    b = (b.length == 1) ? ('0' + b) : b;

    return r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
  };

  /**
   * @method getAlpha
   * @return {Number} 0-1
   */
  Color.prototype.getAlpha = function() {
    return this.getSource()[3];
  };

  /**
   * @method setAlpha
   * @param {Number} 0-1
   * @return {Color} thisArg
   */
  Color.prototype.setAlpha = function(alpha) {
    var source = this.getSource();
    source[3] = alpha;
    this.setSource(source);
    return this;
  };

  /**
   * Transforms color to its grayscale representation
   * @method toGrayscale
   * @return {Color} thisArg
   */
  Color.prototype.toGrayscale = function() {
    var source = this.getSource(),
        average = parseInt((source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0), 10),
        currentAlpha = source[3];
    this.setSource([average, average, average, currentAlpha]);
    return this;
  };

  /**
   * Transforms color to its black and white representation
   * @method toGrayscale
   * @return {Color} thisArg
   */
  Color.prototype.toBlackWhite = function(threshold) {
    var source = this.getSource(),
        average = (source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0),
        currentAlpha = source[3],
        threshold = threshold || 127;

    average = (Number(average) < Number(threshold)) ? 0 : 255;
    this.setSource([average, average, average, currentAlpha]);
    return this;
  };

  /**
   * Overlays color with another color
   * @method overlayWith
   * @param {Color} otherColor
   * @return {Color} thisArg
   */
  Color.prototype.overlayWith = function(otherColor) {
    otherColor = new Color(otherColor);

    var result = [],
        alpha = this.getAlpha(),
        otherAlpha = 0.5,
        source = this.getSource(),
        otherSource = otherColor.getSource();

    for (var i = 0; i < 3; i++) {
      result.push(Math.round((source[i] * (1 - otherAlpha)) + (otherSource[i] * otherAlpha)));
    }

    result[4] = alpha;
    this.setSource(result);
    return this;
  };

  /**
   * @static
   * @field reRGBa
   */
  Color.reRGBa = /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d+(?:\.\d+)?))?\)$/;

  /**
   * @static
   * @field reHex
   */
  Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;

  /**
   * @method fromRgb
   * @param {String} color ex: rgb(0-255,0-255,0-255)
   * @return {Color}
   */
  Color.fromRgb = function(color) {
    return Color.fromSource(Color.sourceFromRgb(color));
  };

  /**
   * @method sourceFromRgb
   * @param {String} color ex: rgb(0-255,0-255,0-255)
   * @return {Array} source
   */
  Color.sourceFromRgb = function(color) {
    var match = color.match(Color.reRGBa);
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        match[4] ? parseFloat(match[4]) : 1
      ];
    }
  };

  /**
   * @static
   * @method fromRgba
   * @return {Color}
   */
  Color.fromRgba = Color.fromRgb;

  /**
   * @static
   * @method fromHex
   * @return {Color}
   */
  Color.fromHex = function(color) {
    return Color.fromSource(Color.sourceFromHex(color));
  };

  /**
   * @static
   * @method sourceFromHex
   * @param {String} ex: FF5555
   * @return {Array} source
   */
  Color.sourceFromHex = function(color) {
    if (color.match(Color.reHex)) {
      var value = color.slice(color.indexOf('#') + 1),
          isShortNotation = (value.length === 3),
          r = isShortNotation ? (value.charAt(0) + value.charAt(0)) : value.substring(0, 2),
          g = isShortNotation ? (value.charAt(1) + value.charAt(1)) : value.substring(2, 4),
          b = isShortNotation ? (value.charAt(2) + value.charAt(2)) : value.substring(4, 6);

      return [
        parseInt(r, 16),
        parseInt(g, 16),
        parseInt(b, 16),
        1
      ];
    }
  };

  /**
   * @static
   * @method fromSource
   * @return {Color}
   */
  Color.fromSource = function(source) {
    var oColor = new Color();
    oColor.setSource(source);
    return oColor;
  };
})();

(function () {

  if (fabric.Element) {
    console.warn('fabric.Element is already defined.');
    return;
  }

  var global = this,
      window = global.window,
      document = window.document,

      extend = fabric.util.object.extend,
      capitalize = fabric.util.string.capitalize,
      camelize = fabric.util.string.camelize,
      fireEvent = fabric.util.fireEvent,
      getPointer = fabric.util.getPointer,
      getElementOffset = fabric.util.getElementOffset,
      removeFromArray = fabric.util.removeFromArray,
      addListener = fabric.util.addListener,
      removeListener = fabric.util.removeListener,

      CANVAS_INIT_ERROR = new Error('Could not initialize `canvas` element'),
      FX_DURATION = 500,
      STROKE_OFFSET = 0.5,
      FX_TRANSITION = 'decel',

      cursorMap = {
        'tr': 'ne-resize',
        'br': 'se-resize',
        'bl': 'sw-resize',
        'tl': 'nw-resize',
        'ml': 'w-resize',
        'mt': 'n-resize',
        'mr': 'e-resize',
        'mb': 's-resize'
      };

  var fastestClearingMethod = (function () {
    var el = document.createElement('canvas'),
        t, t1, t2, i,
        numIterations = 200,
        canvasLength = 300;

    el.width = el.height = canvasLength;

    if (!el.getContext) {
      return;
    }

    var ctx = el.getContext('2d');
    if (!ctx) {
      return;
    }

    t = new Date();
    for (i = numIterations; i--; ) {
      ctx.clearRect(0, 0, canvasLength, canvasLength);
    }
    t1 = new Date() - t;

    t = new Date();
    for (i = numIterations; i--; ) {
      el.width = el.height;
    }
    t2 = new Date() - t;

    if (t2 < t1) {
      return 'width';
    }
  })();

  function clearContext(ctx) {
    ctx.clearRect(0, 0, this._oConfig.width, this._oConfig.height);
    return this;
  }

  /*
  if (fastestClearingMethod === 'width') {
    clearContext = function (ctx) {
      ctx.canvas.width = ctx.canvas.width;
      return this;
    }
  }
  */

  var CAN_SET_TRANSPARENT_FILL = (function () {


    var canvasEl = document.createElement('canvas');
    if (!canvasEl || !canvasEl.getContext) {
      return;
    }

    var context = canvasEl.getContext('2d');
    if (!context) {
      return;
    }

    try {
      context.fillStyle = 'transparent';
      return true;
    }
    catch(err) { }

    return false;
  })();

  /**
   * @class fabric.Element
   * @constructor
   * @param {HTMLElement | String} el Container element for the canvas.
   */
  fabric.Element = function (el, oConfig) {

    /**
     * The object literal containing mouse position if clicked in an empty area (no image)
     * @property _groupSelector
     * @type object
     */
    this._groupSelector = null;

    /**
     * The array literal containing all objects on canvas
     * @property _aObjects
     * @type array
     */
    this._aObjects = [];

    /**
     * The element that references the canvas interface implementation
     * @property _oContext
     * @type object
     */
    this._oContext = null;

    /**
     * The main element that contains the canvas
     * @property _oElement
     * @type object
     */
    this._oElement = null;

    /**
     * The object literal containing the current x,y params of the transformation
     * @property _currentTransform
     * @type object
     */
    this._currentTransform = null;

    /**
     * References instance of fabric.Group - when multiple objects are selected
     * @property _activeGroup
     * @type object
     */
    this._activeGroup = null;

     /**
      * An object containing config parameters
      * @property _oConfig
      * @type object
      */
    this._oConfig = {
      width: 300,
      height: 150
    };

    oConfig = oConfig || { };

    this._initElement(el);
    this._initConfig(oConfig);

    if (oConfig.overlayImage) {
      this.setOverlayImage(oConfig.overlayImage);
    }

    if (oConfig.afterRender) {
      this.afterRender = oConfig.afterRender;
    }

    this._createCanvasBackground();
    this._createCanvasContainer();
    this._initEvents();
    this.calcOffset();
  };

  extend(fabric.Element.prototype, {

    selectionColor:         'rgba(100,100,255,0.3)', // blue
    selectionBorderColor:   'rgba(255,255,255,0.3)',
    selectionLineWidth:     1,
    backgroundColor:        'rgba(255,255,255,1)',
    includeDefaultValues:   true,

    shouldCacheImages:      false,

    CANVAS_WIDTH:           600,
    CANVAS_HEIGHT:          600,

    onBeforeScaleRotate: function () {
      /* NOOP */
    },

    /**
     * Calculates canvas element offset relative to the document
     * This method is also attached as "resize" event handler of window
     * @method calcOffset
     * @return {fabric.Element} instance
     * @chainable
     */
    calcOffset: function () {
      this._offset = getElementOffset(this.getElement());
      return this;
    },

    /**
     * @method setOverlayImage
     * @param {String} url url of an image to set background to
     * @param {Function} callback callback to invoke when image is loaded and set as an overlay one
     * @return {fabric.Element} thisArg
     * @chainable
     */
    setOverlayImage: function (url, callback) {
      if (url) {
        var _this = this, img = new Image();
        img.onload = function () {
          _this.overlayImage = img;
          if (callback) {
            callback();
          }
          img = img.onload = null;
        };
        img.src = url;
      }
      return this;
    },

    /**
     * canvas class's initialization method. This method is automatically
     * called by constructor, and sets up all DOM references for
     * pre-existing markup, and creates required markup if it is not
     * already present.
     * @method _initElement
     * @param canvasEl {HTMLElement|String} canvasEl canvas element
     *
     */
    _initElement: function (canvasEl) {
      var el = fabric.util.getById(canvasEl);
      this._oElement = el || document.createElement('canvas');

      if (typeof this._oElement.getContext === 'undefined') {
        G_vmlCanvasManager.initElement(this._oElement);
      }
      if (typeof this._oElement.getContext === 'undefined') {
        throw CANVAS_INIT_ERROR;
      }
      if (!(this._oContextTop = this._oElement.getContext('2d'))) {
        throw CANVAS_INIT_ERROR;
      }

      var width = this._oElement.width || 0,
          height = this._oElement.height || 0;

      this._initWrapperElement(width, height);
      this._setElementStyle(width, height);
    },

    /**
     * @private
     * @method _initWrapperElement
     */
    _initWrapperElement: function (width, height) {
      var wrapper = fabric.util.wrapElement(this.getElement(), 'div', { 'class': 'canvas_container' });
      fabric.util.setStyle(wrapper, {
        width: width + 'px',
        height: height + 'px'
      });
      fabric.util.makeElementUnselectable(wrapper);
      this.wrapper = wrapper;
    },

    /**
     * @private
     * @method _setElementStyle
     */
    _setElementStyle: function (width, height) {
      fabric.util.setStyle(this.getElement(), {
        position: 'absolute',
        width: width + 'px',
        height: height + 'px',
        left: 0,
        top: 0
      });
    },

    /**
       * For now we use an object literal without methods to store the config params
       * @method _initConfig
       * @param oConfig {Object} userConfig The configuration Object literal
       * containing the configuration that should be set for this module.
       * See configuration documentation for more details.
       */
    _initConfig: function (oConfig) {
      extend(this._oConfig, oConfig || { });

      this._oConfig.width = parseInt(this._oElement.width, 10) || 0;
      this._oConfig.height = parseInt(this._oElement.height, 10) || 0;

      this._oElement.style.width = this._oConfig.width + 'px';
      this._oElement.style.height = this._oConfig.height + 'px';
    },

    /**
     * Adds main mouse listeners to the whole canvas
     * @method _initEvents
     * @private
     * See configuration documentation for more details.
     */
    _initEvents: function () {

      var _this = this;

      this._onMouseDown = function (e) { _this.__onMouseDown(e); };
      this._onMouseUp = function (e) { _this.__onMouseUp(e); };
      this._onMouseMove = function (e) { _this.__onMouseMove(e); };
      this._onResize = function (e) { _this.calcOffset() };

      addListener(this._oElement, 'mousedown', this._onMouseDown);
      addListener(document, 'mousemove', this._onMouseMove);
      addListener(document, 'mouseup', this._onMouseUp);
      addListener(window, 'resize', this._onResize);
    },

    /**
     * Creates canvas elements
     * @method _createCanvasElement
     * @private
     */
    _createCanvasElement: function (className) {

      var element = document.createElement('canvas');
      if (!element) {
        return;
      }

      element.className = className;
      var oContainer = this._oElement.parentNode.insertBefore(element, this._oElement);

      oContainer.width = this.getWidth();
      oContainer.height = this.getHeight();
      oContainer.style.width = this.getWidth() + 'px';
      oContainer.style.height = this.getHeight() + 'px';
      oContainer.style.position = 'absolute';
      oContainer.style.left = 0;
      oContainer.style.top = 0;

      if (typeof element.getContext === 'undefined') {
        G_vmlCanvasManager.initElement(element);
      }
      if (typeof element.getContext === 'undefined') {
        throw CANVAS_INIT_ERROR;
      }
      fabric.util.makeElementUnselectable(oContainer);
      return oContainer;
    },

    /**
     * Creates a secondary canvas to contain all the images are not being translated/rotated/scaled
     * @method _createCanvasContainer
     */
    _createCanvasContainer: function () {
      var canvas = this._createCanvasElement('canvas-container');
      this._oContextContainerEl = canvas;
      this._oContextContainer = canvas.getContext('2d');
    },

    /**
     * Creates a "background" canvas
     * @method _createCanvasBackground
     */
    _createCanvasBackground: function () {
      var canvas = this._createCanvasElement('canvas-container');
      this._oContextBackgroundEl = canvas;
      this._oContextBackground = canvas.getContext('2d');
    },

    /**
     * Returns canvas width
     * @method getWidth
     * @return {Number}
     */
    getWidth: function () {
      return this._oConfig.width;
    },

    /**
     * Returns canvas height
     * @method getHeight
     * @return {Number}
     */
    getHeight: function () {
      return this._oConfig.height;
    },

    /**
     * @method setWidth
     * @param {Number} width value to set width to
     * @return {fabric.Element} instance
     * @chainable true
     */
    setWidth: function (value) {
      return this._setDimension('width', value);
    },

    /**
     * @method setHeight
     * @param {Number} height value to set height to
     * @return {fabric.Element} instance
     * @chainable true
     */
    setHeight: function (value) {
      return this._setDimension('height', value);
    },

    setDimensions: function(dimensions) {
      for (var prop in dimensions) {
        this._setDimension(prop, dimensions[prop]);
      }
      return this;
    },

    /**
     * private helper for setting width/height
     * @method _setDimensions
     * @private
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     * @return {fabric.Element} instance
     * @chainable true
     */
    _setDimension: function (prop, value) {
      this._oContextContainerEl[prop] = value;
      this._oContextContainerEl.style[prop] = value + 'px';

      this._oContextBackgroundEl[prop] = value;
      this._oContextBackgroundEl.style[prop] = value + 'px';

      this._oElement[prop] = value;
      this._oElement.style[prop] = value + 'px';

      this._oElement.parentNode.style[prop] = value + 'px';

      this._oConfig[prop] = value;
      this.calcOffset();
      this.renderAll();

      return this;
    },

    /**
     * Method that defines the actions when mouse is released on canvas.
     * The method resets the currentTransform parameters, store the image corner
     * position in the image object and render the canvas on top.
     * @method __onMouseUp
     * @param {Event} e Event object fired on mouseup
     *
     */
    __onMouseUp: function (e) {
      if (this._currentTransform) {

        var transform = this._currentTransform,
            target = transform.target;

        if (target.__scaling) {
          fireEvent('object:scaled', { target: target });
          target.__scaling = false;
        }

        for (var i=0, l=this._aObjects.length; i<l; ++i) {
          this._aObjects[i].setCoords();
        }

        if (target.hasStateChanged()) {
          target.isMoving = false;
          fireEvent('object:modified', { target: target });
        }
      }

      this._currentTransform = null;

      if (this._groupSelector) {
        this._findSelectedObjects(e);
      }
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        if (activeGroup.hasStateChanged() &&
            activeGroup.containsPoint(this.getPointer(e))) {
          fireEvent('group:modified', { target: activeGroup });
        }
        activeGroup.setObjectsCoords();
        activeGroup.set('isMoving', false);
        this._setCursor('default');
      }

      this._groupSelector = null;
      this.renderAll();

      this._setCursorFromEvent(e, target);
      this._setCursor('');

      var _this = this;
      setTimeout(function () {
        _this._setCursorFromEvent(e, target);
      }, 50);
    },

    shouldClearSelection: function (e) {
      var target = this.findTarget(e),
          activeGroup = this.getActiveGroup();
      return (
        !target || (
          target &&
          activeGroup &&
          !activeGroup.contains(target) &&
          activeGroup !== target &&
          !e.shiftKey
        )
      );
    },

    /**
     * Method that defines the actions when mouse is clic ked on canvas.
     * The method inits the currentTransform parameters and renders all the
     * canvas so the current image can be placed on the top canvas and the rest
     * in on the container one.
     * @method __onMouseDown
     * @param e {Event} Event object fired on mousedown
     *
     */
    __onMouseDown: function (e) {

      if (this._currentTransform) return;

      var target = this.findTarget(e),
          pointer = this.getPointer(e),
          activeGroup = this.getActiveGroup(),
          corner;

      if (this.shouldClearSelection(e)) {

        this._groupSelector = {
          ex: pointer.x,
          ey: pointer.y,
          top: 0,
          left: 0
        };

        this.deactivateAllWithDispatch();
      }
      else {
        target.saveState();

        if (corner = target._findTargetCorner(e, this._offset)) {
          this.onBeforeScaleRotate(target);
        }

        this._setupCurrentTransform(e, target);

        var shouldHandleGroupLogic = e.shiftKey && (activeGroup || this.getActiveObject());
        if (shouldHandleGroupLogic) {
          this._handleGroupLogic(e, target);
        }
        else {
          if (target !== this.getActiveGroup()) {
            this.deactivateAll();
          }
          this.setActiveObject(target);
        }
      }
      this.renderAll();
    },

    /**
     * @method getElement
     * @return {HTMLCanvasElement}
     */
    getElement: function () {
      return this._oElement;
    },

    /**
     * Deactivates all objects and dispatches appropriate events
     * @method deactivateAllWithDispatch
     * @return {fabric.Element} thisArg
     */
    deactivateAllWithDispatch: function () {
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        fireEvent('before:group:destroyed', {
          target: activeGroup
        });
      }
      this.deactivateAll();
      if (activeGroup) {
        fireEvent('after:group:destroyed');
      }
      fireEvent('selection:cleared');
      return this;
    },

    /**
     * @private
     * @method _setupCurrentTransform
     */
    _setupCurrentTransform: function (e, target) {
      var action = 'drag',
          corner,
          pointer = getPointer(e);

      if (corner = target._findTargetCorner(e, this._offset)) {
        action = /ml|mr/.test(corner)
          ? 'scaleX'
          : /mt|mb/.test(corner)
            ? 'scaleY'
            : 'rotate';
      }

      this._currentTransform = {
        target: target,
        action: action,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        offsetX: pointer.x - target.left,
        offsetY: pointer.y - target.top,
        ex: pointer.x,
        ey: pointer.y,
        left: target.left,
        top: target.top,
        theta: target.theta,
        width: target.width * target.scaleX
      };

      this._currentTransform.original = {
        left: target.left,
        top: target.top
      };
    },

    _handleGroupLogic: function (e, target) {
      if (target.isType('group')) {
        target = this.findTarget(e, true);
        if (!target || target.isType('group')) {
          return;
        }
      }
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        if (activeGroup.contains(target)) {
          activeGroup.remove(target);
          target.setActive(false);
          if (activeGroup.size() === 1) {
            this.removeActiveGroup();
          }
        }
        else {
          activeGroup.add(target);
        }
        fireEvent('group:selected', { target: activeGroup });
        activeGroup.setActive(true);
      }
      else {
        if (this._activeObject) {
          if (target !== this._activeObject) {
            var group = new fabric.Group([ this._activeObject,target ]);
            this.setActiveGroup(group);
            activeGroup = this.getActiveGroup();
          }
        }
        target.setActive(true);
      }

      if (activeGroup) {
        activeGroup.saveCoords();
      }
    },

   /**
    * Method that defines the actions when mouse is hovering the canvas.
    * The currentTransform parameter will definde whether the user is rotating/scaling/translating
    * an image or neither of them (only hovering). A group selection is also possible and would cancel
    * all any other type of action.
    * In case of an image transformation only the top canvas will be rendered.
    * @method __onMouseMove
    * @param e {Event} Event object fired on mousemove
    *
    */
    __onMouseMove: function (e) {

      if (this._groupSelector !== null) {
        var pointer = getPointer(e);
        this._groupSelector.left = pointer.x - this._offset.left - this._groupSelector.ex;
        this._groupSelector.top = pointer.y - this._offset.top - this._groupSelector.ey;
        this.renderTop();
      }
      else if (!this._currentTransform) {

        var style = this._oElement.style;

        var target = this.findTarget(e);

        if (!target) {
          for (var i = this._aObjects.length; i--; ) {
            if (!this._aObjects[i].active) {
              this._aObjects[i].setActive(false);
            }
          }
          style.cursor = 'default';
        }
        else {
          this._setCursorFromEvent(e, target);
          if (target.isActive()) {
            target.setCornersVisibility && target.setCornersVisibility(true);
          }
        }
      }
      else {
        var pointer = getPointer(e),
            x = pointer.x,
            y = pointer.y;

        this._currentTransform.target.isMoving = true;

        if (this._currentTransform.action === 'rotate') {

          if (!e.shiftKey) {
            this._rotateObject(x, y);
          }
          this._scaleObject(x, y);
        }
        else if (this._currentTransform.action === 'scaleX') {
          this._scaleObject(x, y, 'x');
        }
        else if (this._currentTransform.action === 'scaleY') {
          this._scaleObject(x, y, 'y');
        }
        else {
          this._translateObject(x, y);
        }
        this.renderAll();
      }
    },

    /**
     * Translates object by "setting" its left/top
     * @method _translateObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     */
    _translateObject: function (x, y) {
      var target = this._currentTransform.target;
      target.set('left', x - this._currentTransform.offsetX);
      target.set('top', y - this._currentTransform.offsetY);
    },

    /**
     * Scales object by invoking its scaleX/scaleY methods
     * @method _scaleObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     * @param by {String} Either 'x' or 'y' - specifies dimension constraint by which to scale an object.
     *                    When not provided, an object is scaled by both dimensions equally
     */
    _scaleObject: function (x, y, by) {
      var lastLen = Math.sqrt(Math.pow(this._currentTransform.ey - this._currentTransform.top - this._offset.top, 2) +
        Math.pow(this._currentTransform.ex - this._currentTransform.left - this._offset.left, 2));

      var curLen = Math.sqrt(Math.pow(y - this._currentTransform.top - this._offset.top, 2) +
        Math.pow(x - this._currentTransform.left - this._offset.left, 2));

      var target = this._currentTransform.target;
      target.__scaling = true;

      if (!by) {
        target.set('scaleX', this._currentTransform.scaleX * curLen/lastLen);
        target.set('scaleY', this._currentTransform.scaleY * curLen/lastLen);
      }
      else if (by === 'x') {
        target.set('scaleX', this._currentTransform.scaleX * curLen/lastLen);
      }
      else if (by === 'y') {
        target.set('scaleY', this._currentTransform.scaleY * curLen/lastLen);
      }
    },

    /**
     * Rotates object by invoking its rotate method
     * @method _rotateObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     */
    _rotateObject: function (x, y) {
      var lastAngle = Math.atan2(this._currentTransform.ey - this._currentTransform.top - this._offset.top,
        this._currentTransform.ex - this._currentTransform.left - this._offset.left);
      var curAngle = Math.atan2(y - this._currentTransform.top - this._offset.top,
        x - this._currentTransform.left - this._offset.left);
      this._currentTransform.target.set('theta', (curAngle - lastAngle) + this._currentTransform.theta);
    },

    /**
     * @method _setCursor
     */
    _setCursor: function (value) {
      this._oElement.style.cursor = value;
    },

    /**
     * Sets the cursor depending on where the canvas is being hovered.
     * Note: very buggy in Opera
     * @method _setCursorFromEvent
     * @param e {Event} Event object
     * @param target {Object} Object that the mouse is hovering, if so.
     */
    _setCursorFromEvent: function (e, target) {
      var s = this._oElement.style;
      if (!target) {
        s.cursor = 'default';
        return false;
      }
      else {
        var activeGroup = this.getActiveGroup();
        var corner = !!target._findTargetCorner
                      && (!activeGroup || !activeGroup.contains(target))
                      && target._findTargetCorner(e, this._offset);

        if (!corner) {
          s.cursor = 'move';
        }
        else {
          if (corner in cursorMap) {
            s.cursor = cursorMap[corner];
          }
          else {
            s.cursor = 'default';
            return false;
          }
        }
      }
      return true;
    },

    /**
     * Given a context, renders an object on that context
     * @param ctx {Object} context to render object on
     * @param object {Object} object to render
     * @private
     */
    _draw: function (ctx, object) {
      object && object.render(ctx);
    },

    /**
     * @method _drawSelection
     * @private
     */
    _drawSelection: function () {
      var left = this._groupSelector.left,
          top = this._groupSelector.top,
          aleft = Math.abs(left),
          atop = Math.abs(top);

      this._oContextTop.fillStyle = this.selectionColor;

      this._oContextTop.fillRect(
        this._groupSelector.ex - ((left > 0) ? 0 : -left),
        this._groupSelector.ey - ((top > 0) ? 0 : -top),
        aleft,
        atop
      );

      this._oContextTop.lineWidth = this.selectionLineWidth;
      this._oContextTop.strokeStyle = this.selectionBorderColor;

      this._oContextTop.strokeRect(
        this._groupSelector.ex + STROKE_OFFSET - ((left > 0) ? 0 : aleft),
        this._groupSelector.ey + STROKE_OFFSET - ((top > 0) ? 0 : atop),
        aleft,
        atop
      );
    },

    _findSelectedObjects: function (e) {

      var target,
          targetRegion,
          group = [ ],
          x1 = this._groupSelector.ex,
          y1 = this._groupSelector.ey,
          x2 = x1 + this._groupSelector.left,
          y2 = y1 + this._groupSelector.top,
          currentObject,
          selectionX1Y1 = new fabric.Point(Math.min(x1, x2), Math.min(y1, y2)),
          selectionX2Y2 = new fabric.Point(Math.max(x1, x2), Math.max(y1, y2));

      for (var i = 0, len = this._aObjects.length; i < len; ++i) {
        currentObject = this._aObjects[i];

        if (currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) ||
            currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2)) {

          currentObject.setActive(true);
          group.push(currentObject);
        }
      }
      if (group.length === 1) {
        this.setActiveObject(group[0]);
        fireEvent('object:selected', {
          target: group[0]
        });
      }
      else if (group.length > 1) {
        var group = new fabric.Group(group);
        this.setActiveGroup(group);
        group.saveCoords();
        fireEvent('group:selected', { target: group });
      }
      this.renderAll();
    },

    /**
     * Adds an object to canvas and renders canvas
     * An object should be an instance of (or inherit from) fabric.Object
     * @method add
     * @return {fabric.Element} thisArg
     * @chainable
     */
    add: function () {
      this._aObjects.push.apply(this._aObjects, arguments);
      this.renderAll();
      return this;
    },

    /**
     * Inserts an object to canvas at specified index and renders canvas.
     * An object should be an instance of (or inherit from) fabric.Object
     * @method insertAt
     * @param object {Object} Object to insert
     * @param index {Number} index to insert object at
     * @return {fabric.Element} instance
     */
    insertAt: function (object, index) {
      this._aObjects.splice(index, 0, object);
      this.renderAll();
      return this;
    },

    /**
     * Returns an array of objects this instance has
     * @method getObjects
     * @return {Array}
     */
    getObjects: function () {
      return this._aObjects;
    },

    /**
     * Returns topmost canvas context
     * @method getContext
     * @return {CanvasRenderingContext2D}
     */
    getContext: function () {
      return this._oContextTop;
    },

    /**
     * Clears specified context of canvas element
     * @method clearContext
     * @param context {Object} ctx context to clear
     * @return {fabric.Element} thisArg
     * @chainable
     */
    clearContext: clearContext,

    /**
     * Clears all contexts of canvas element
     * @method clear
     * @return {fabric.Element} thisArg
     * @chainable
     */
    clear: function () {
      this._aObjects.length = 0;
      this.clearContext(this._oContextTop);
      this.clearContext(this._oContextContainer);
      this.renderAll();
      return this;
    },

    /**
     * Renders both the top canvas and the secondary container canvas.
     * @method renderAll
     * @param allOnTop {Boolean} optional Whether we want to force all images to be rendered on the top canvas
     * @return {fabric.Element} instance
     * @chainable
     */
    renderAll: function (allOnTop) {

      var w = this._oConfig.width,
          h = this._oConfig.height;

      var containerCanvas = allOnTop ? this._oContextTop : this._oContextContainer;

      this.clearContext(this._oContextTop);

      if (containerCanvas !== this._oContextTop) {
        this.clearContext(containerCanvas);
      }

      if (allOnTop) {
        if (!CAN_SET_TRANSPARENT_FILL && this.backgroundColor === 'transparent') {
          var skip = true;
        }
        if (!skip) {
          containerCanvas.fillStyle = this.backgroundColor;
        }
        containerCanvas.fillRect(0, 0, w, h);
      }

      var length = this._aObjects.length,
          activeGroup = this.getActiveGroup();

      if (length) {
        for (var i = 0; i < length; ++i) {

          if (!activeGroup ||
              (activeGroup &&
              !activeGroup.contains(this._aObjects[i]))) {
            this._draw(containerCanvas, this._aObjects[i]);
          }
        }
      }

      if (activeGroup) {
        this._draw(this._oContextTop, activeGroup);
      }

      if (this.overlayImage) {
        this._oContextTop.drawImage(this.overlayImage, 0, 0);
      }

      if (this.afterRender) {
        this.afterRender();
      }

      return this;
    },

    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     * @method renderTop
     * @return {fabric.Element} thisArg
     * @chainable
     */
    renderTop: function () {

      this.clearContext(this._oContextTop);
      if (this.overlayImage) {
        this._oContextTop.drawImage(this.overlayImage, 0, 0);
      }

      if (this._groupSelector) {
        this._drawSelection();
      }

      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        activeGroup.render(this._oContextTop);
      }

      if (this.afterRender) {
        this.afterRender();
      }

      return this;
    },

    /**
     * Applies one implementation of 'point inside polygon' algorithm
     * @method containsPoint
     * @param e { Event } event object
     * @param target { fabric.Object } object to test against
     * @return {Boolean} true if point contains within area of given object
     */
    containsPoint: function (e, target) {
      var pointer = this.getPointer(e),
          xy = this._normalizePointer(target, pointer),
          x = xy.x,
          y = xy.y;


      var iLines = target._getImageLines(target.oCoords),
          xpoints = target._findCrossPoints(x, y, iLines);

      if ((xpoints && xpoints % 2 === 1) || target._findTargetCorner(e, this._offset)) {
        return true;
      }
      return false;
    },

    /**
     * @private
     * @method _normalizePointer
     */
    _normalizePointer: function (object, pointer) {

      var activeGroup = this.getActiveGroup(),
          x = pointer.x,
          y = pointer.y;

      var isObjectInGroup = (
        activeGroup &&
        object.type !== 'group' &&
        activeGroup.contains(object)
      );

      if (isObjectInGroup) {
        x -= activeGroup.left;
        y -= activeGroup.top;
      }
      return { x: x, y: y };
    },

    /**
     * Method that determines what object we are clicking on
     * @method findTarget
     * @param {Event} e mouse event
     * @param {Boolean} skipGroup when true, group is skipped and only objects are traversed through
     */
    findTarget: function (e, skipGroup) {
      var target,
          pointer = this.getPointer(e);

      var activeGroup = this.getActiveGroup();

      if (activeGroup && !skipGroup && this.containsPoint(e, activeGroup)) {
        target = activeGroup;
        return target;
      }

      for (var i = this._aObjects.length; i--; ) {
        if (this.containsPoint(e, this._aObjects[i])) {
          target = this._aObjects[i];
          this.relatedTarget = target;
          break;
        }
      }
      return target;
    },

    /**
     * Exports canvas element to a dataurl image.
     * @method toDataURL
     * @param {String} format the format of the output image. Either "jpeg" or "png".
     * @return {String}
     */
    toDataURL: function (format) {
      var data;
      if (!format) {
        format = 'png';
      }
      if (format === 'jpeg' || format === 'png') {
        this.renderAll(true);
        data = this.getElement().toDataURL('image/' + format);
      }
      return data;
    },

    /**
     * @method toDataURLWithMultiplier
     * @param {String} format (png|jpeg)
     * @param {Number} multiplier
     * @return {String}
     */
    toDataURLWithMultiplier: function (format, multiplier) {

      var origWidth = this.getWidth(),
          origHeight = this.getHeight(),
          scaledWidth = origWidth * multiplier,
          scaledHeight = origHeight * multiplier,
          activeObject = this.getActiveObject();

      this.setWidth(scaledWidth).setHeight(scaledHeight);
      this._oContextTop.scale(multiplier, multiplier);

      if (activeObject) {
        this.deactivateAll().renderAll();
      }
      var dataURL = this.toDataURL(format);

      this._oContextTop.scale( 1 / multiplier,  1 / multiplier);
      this.setWidth(origWidth).setHeight(origHeight);

      if (activeObject) {
        this.setActiveObject(activeObject);
      }
      this.renderAll();

      return dataURL;
    },

    /**
     * @method getPointer
     * @return {Object} object with "x" and "y" number values
     */
    getPointer: function (e) {
      var pointer = getPointer(e);
      return {
        x: pointer.x - this._offset.left,
        y: pointer.y - this._offset.top
      };
    },

    /**
     * Returns coordinates of a center of canvas.
     * Returned value is an object with top and left properties
     * @method getCenter
     * @return {Object} object with "top" and "left" number values
     */
    getCenter: function () {
      return {
        top: this.getHeight() / 2,
        left: this.getWidth() / 2
      };
    },

    /**
     * Centers object horizontally
     * @method centerObjectH
     * @param {fabric.Object} object Object to center
     * @return {fabric.Element} thisArg
     */
    centerObjectH: function (object) {
      object.set('left', this.getCenter().left);
      this.renderAll();
      return this;
    },

    /**
     * Centers object horizontally with animation
     * @method fxCenterObjectH
     * @param {fabric.Object} object
     * @return {fabric.Element} thisArg
     * @chainable
     */
    fxCenterObjectH: function (object) {
      callbacks = callbacks || { };

      var empty = function() { },
          onComplete = callbacks.onComplete || empty,
          onChange = callbacks.onChange || empty,
          _this = this;

      fabric.util.animate({
        startValue: object.get('left'),
        endValue: this.getCenter().left,
        duration: this.FX_DURATION,
        onChange: function(value) {
          object.set('left', value);
          _this.renderAll();
          onChange();
        },
        onComplete: function() {
          object.setCoords();
          onComplete();
        }
      });

      return this;
    },

    /**
     * Centers object vertically
     * @method centerObjectH
     * @param object {fabric.Object} Object to center
     * @return {fabric.Element} thisArg
     * @chainable
     */
    centerObjectV: function (object) {
      object.set('top', this.getCenter().top);
      this.renderAll();
      return this;
    },

    /**
     * Centers object vertically with animation
     * @method fxCenterObjectV
     * @param {fabric.Object} object
     * @return {fabric.Element} thisArg
     * @chainable
     */
    fxCenterObjectV: function (object) {
      callbacks = callbacks || { };

      var empty = function() { },
          onComplete = callbacks.onComplete || empty,
          onChange = callbacks.onChange || empty,
          _this = this;

      fabric.util.animate({
        startValue: object.get('top'),
        endValue: this.getCenter().top,
        duration: this.FX_DURATION,
        onChange: function(value) {
          object.set('top', value);
          _this.renderAll();
          onChange();
        },
        onComplete: function() {
          object.setCoords();
          onComplete();
        }
      });

      return this;
    },

    /**
     * @method straightenObject
     * @param {fabric.Object} object Object to straighten
     * @return {fabric.Element} thisArg
     * @chainable
     */
    straightenObject: function (object) {
      object.straighten();
      this.renderAll();
      return this;
    },

    /**
     * @method fxStraightenObject
     * @param {fabric.Object} object Object to straighten
     * @return {fabric.Element} thisArg
     * @chainable
     */
    fxStraightenObject: function (object) {
      object.fxStraighten({
        onChange: this.renderAll.bind(this)
      });
      return this;
    },

    /**
     * Returs JSON representation of canvas
     * @method toJSON
     * @return {String} json string
     */
    toJSON: function () {
      return JSON.stringify(this.toObject());
    },

    /**
     * Returs dataless JSON representation of canvas
     * @method toDatalessJSON
     * @return {String} json string
     */
    toDatalessJSON: function () {
      return JSON.stringify(this.toDatalessObject());
    },

    /**
     * Returns object representation of canvas
     * @method toObject
     * @return {Object}
     */
    toObject: function () {
      return this._toObjectMethod('toObject');
    },

    /**
     * Returns dataless object representation of canvas
     * @method toDatalessObject
     * @return {Object}
     */
    toDatalessObject: function () {
      return this._toObjectMethod('toDatalessObject');
    },

    /**
     * @private
     * @method _toObjectMethod
     */
    _toObjectMethod: function (methodName) {
      return {
        objects: this._aObjects.map(function (instance){
          if (!this.includeDefaultValues) {
            var originalValue = instance.includeDefaultValues;
            instance.includeDefaultValues = false;
          }
          var object = instance[methodName]();
          if (!this.includeDefaultValues) {
            instance.includeDefaultValues = originalValue;
          }
          return object;
        }, this),
        background: this.backgroundColor
      }
    },

    /**
     * Returns true if canvas contains no objects
     * @method isEmpty
     * @return {Boolean} true if canvas is empty
     */
    isEmpty: function () {
      return this._aObjects.length === 0;
    },

    /**
     * Populates canvas with data from the specified JSON
     * JSON format must conform to the one of fabric.Element#toJSON
     * @method loadFromJSON
     * @param json {String} json string
     * @param callback {Function} callback, invoked when json is parsed
     *                            and corresponding objects (e.g. fabric.Image)
     *                            are initialized
     * @return {fabric.Element} instance
     * @chainable
     */
    loadFromJSON: function (json, callback) {
      if (!json) return;

      var serialized = JSON.parse(json);
      if (!serialized || (serialized && !serialized.objects)) return;

      this.clear();
      var _this = this;
      this._enlivenObjects(serialized.objects, function () {
        _this.backgroundColor = serialized.background;
        if (callback) {
          callback();
        }
      });

      return this;
    },

    _enlivenObjects: function (objects, callback) {
      var numLoadedImages = 0,
          numTotalImages = objects.filter(function (o){
            return o.type === 'image';
          }).length;

      var _this = this;

      objects.forEach(function (o) {
        if (!o.type) {
          return;
        }
        switch (o.type) {
          case 'image':
          case 'font':
            fabric[capitalize(o.type)].fromObject(o, function (o) {
              _this.add(o);
              if (++numLoadedImages === numTotalImages) {
                if (callback) callback();
              }
            });
            break;
          default:
            var klass = fabric[camelize(capitalize(o.type))];
            if (klass && klass.fromObject) {
              _this.add(klass.fromObject(o));
            }
            break;
        }
      });

      if (numTotalImages === 0 && callback) {
        callback();
      }
    },

    loadFromDatalessJSON: function (json, callback) {

      if (!json) {
        return;
      }

      var serialized = (typeof json === 'string')
        ? json.evalJSON()
        : json;

      if (!serialized || (serialized && !serialized.objects)) return;

      this.clear();

      this._enlivenDatalessObjects(serialized.objects, callback);
    },

    _enlivenDatalessObjects: function (objects, callback) {

      function onObjectLoaded(object, index) {
        _this.insertAt(object, index);
				object.setCoords();
        if (++numLoadedObjects === numTotalObjects) {
          callback && callback();
        }
      }

      var _this = this,
          numLoadedObjects = 0,
          numTotalObjects = objects.length;

      try {
        objects.forEach(function (obj, index) {

          var pathProp = obj.paths ? 'paths' : 'path';
          var path = obj[pathProp];

          delete obj[pathProp];

          if (typeof path !== 'string') {
            switch (obj.type) {
              case 'image':
              case 'text':
                Canvas[capitalize(obj.type)].fromObject(obj, function (o) {
                  onObjectLoaded(o, index);
                });
                break;
              default:
                var klass = Canvas[camelize(capitalize(obj.type))];
                if (klass && klass.fromObject) {
                  onObjectLoaded(klass.fromObject(obj), index);
                }
                break;
            }
          }
          else {
            if (obj.type === 'image') {
              _this.loadImageFromURL(path, function (image) {
                image.setSourcePath(path);

                extend(image, obj);
                image.setAngle(obj.angle);

                onObjectLoaded(image, index);
              });
            }
            else if (obj.type === 'text') {

              obj.path = path;
              var object = fabric.Text.fromObject(obj);
              window.__context = _this;
              var onscriptload = function () {
                if (Prototype.Browser.Opera) {
                  setTimeout(function () {
                    onObjectLoaded(object, index);
                  }, 500);
                }
                else {
                  onObjectLoaded(object, index);
                }
              }

              fabric.util.getScript(path, onscriptload);
            }
            else {
              _this.loadSVGFromURL(path, function (elements, options) {
                if (elements.length > 1) {
                  var object = new fabric.PathGroup(elements, obj);
                }
                else {
                  var object = elements[0];
                }
                object.setSourcePath(path);

                if (!(object instanceof fabric.PathGroup)) {
                  extend(object, obj);
                  if (typeof obj.angle !== 'undefined') {
                    object.setAngle(obj.angle);
                  }
                }

                onObjectLoaded(object, index);
              });
            }
          }
        }, this);
      }
      catch(e) {
        console.log(e.message);
      }
    },

    /**
     * Loads an image from URL
     * @method loadImageFromURL
     * @param url {String} url of image to load
     * @param callback {Function} calback, invoked when image is loaded
     */
    loadImageFromURL: (function () {
      var imgCache = { };

      return function (url, callback) {

        var _this = this;

        function checkIfLoaded() {
          var imgEl = document.getElementById(imgCache[url]);
          if (imgEl.width && imgEl.height) {
            callback(new fabric.Image(imgEl));
          }
          else {
            setTimeout(checkIfLoaded, 50);
          }
        }

        if (imgCache[url]) {
          checkIfLoaded();
        }
        else {
          var imgEl = new Image();
          imgEl.onload = function () {
            imgEl.onload = null;

            _this._resizeImageToFit(imgEl);

            var oImg = new fabric.Image(imgEl);
            callback(oImg);
          };

          imgEl.className = 'canvas-img-clone';
          imgEl.src = url;

          if (this.shouldCacheImages) {
            imgCache[url] = Element.identify(imgEl);
          }
          document.body.appendChild(imgEl);
        }
      }
    })(),

    loadSVGFromURL: function (url, callback) {

      var _this = this;

      url = url.replace(/^\n\s*/, '').replace(/\?.*$/, '').trim();

      this.cache.has(url, function (hasUrl) {
        if (hasUrl) {
          _this.cache.get(url, function (value) {
            var enlivedRecord = _this._enlivenCachedObject(value);
            callback(enlivedRecord.objects, enlivedRecord.options);
          });
        }
        else {
          new Ajax.Request(url, {
            method: 'get',
            onComplete: onComplete,
            onFailure: onFailure
          });
        }
      });

      function onComplete(r) {

        var xml = r.responseXML;
        if (!xml) return;

        var doc = xml.documentElement;
        if (!doc) return;

        fabric.parseSVGDocument(doc, function (results, options) {
          _this.cache.set(url, {
            objects: results.invoke('toObject'),
            options: options
          });
          callback(results, options);
        });
      }

      function onFailure() {
        console.log('ERROR!');
      }
    },

    _enlivenCachedObject: function (cachedObject) {

      var objects = cachedObject.objects;
      var options = cachedObject.options;

      objects = objects.map(function (o) {
        return fabric[capitalize(o.type)].fromObject(o);
      });

      return ({ objects: objects, options: options });
    },

    /**
     * Removes an object from canvas and returns it
     * @method remove
     * @param object {Object} Object to remove
     * @return {Object} removed object
     */
    remove: function (object) {
      removeFromArray(this._aObjects, object);
      this.renderAll();
      return object;
    },

    /**
     * Same as `remove` but animated
     * @method fxRemove
     * @param {fabric.Object} object Object to remove
     * @param {Function} callback callback, invoked on effect completion
     * @return {fabric.Element} thisArg
     * @chainable
     */
    fxRemove: function (object, callback) {
      var _this = this;
      object.fxRemove({
        onChange: this.renderAll.bind(this),
        onComplete: function () {
          _this.remove(object);
          if (typeof callback === 'function') {
            callback();
          }
        }
      });
      return this;
    },

    /**
     * Moves an object to the bottom of the stack
     * @method sendToBack
     * @param object {fabric.Object} Object to send to back
     * @return {fabric.Element} thisArg
     * @chainable
     */
    sendToBack: function (object) {
      removeFromArray(this._aObjects, object);
      this._aObjects.unshift(object);
      return this.renderAll();
    },

    /**
     * Moves an object to the top of the stack
     * @method bringToFront
     * @param object {fabric.Object} Object to send
     * @return {fabric.Element} thisArg
     * @chainable
     */
    bringToFront: function (object) {
      removeFromArray(this._aObjects, object);
      this._aObjects.push(object);
      return this.renderAll();
    },

    /**
     * Moves an object one level down in stack
     * @method sendBackwards
     * @param object {fabric.Object} Object to send
     * @return {fabric.Element} thisArg
     * @chainable
     */
    sendBackwards: function (object) {
      var idx = this._aObjects.indexOf(object),
          nextIntersectingIdx = idx;

      if (idx !== 0) {

        for (var i=idx-1; i>=0; --i) {
          if (object.intersectsWithObject(this._aObjects[i])) {
            nextIntersectingIdx = i;
            break;
          }
        }
        removeFromArray(this._aObjects, object);
        this._aObjects.splice(nextIntersectingIdx, 0, object);
      }
      return this.renderAll();
    },

    /**
     * Moves an object one level up in stack
     * @method sendForward
     * @param object {fabric.Object} Object to send
     * @return {fabric.Element} thisArg
     * @chainable
     */
    bringForward: function (object) {
      var objects = this.getObjects(),
          idx = objects.indexOf(object),
          nextIntersectingIdx = idx;


      if (idx !== objects.length-1) {

        for (var i=idx+1, l=this._aObjects.length; i<l; ++i) {
          if (object.intersectsWithObject(objects[i])) {
            nextIntersectingIdx = i;
            break;
          }
        }
        removeFromArray(objects, object);
        objects.splice(nextIntersectingIdx, 0, object);
      }
      this.renderAll();
    },

    /**
     * Sets given object as active
     * @method setActiveObject
     * @param object {fabric.Object} Object to set as an active one
     * @return {fabric.Element} thisArg
     * @chainable
     */
    setActiveObject: function (object) {
      if (this._activeObject) {
        this._activeObject.setActive(false);
      }
      this._activeObject = object;
      object.setActive(true);

      this.renderAll();

      fireEvent('object:selected', { target: object });
      return this;
    },

    /**
     * Returns currently active object
     * @method getActiveObject
     * @return {fabric.Object} active object
     */
    getActiveObject: function () {
      return this._activeObject;
    },

    /**
     * Removes an active object
     * @method removeActiveObject
     * @return {fabric.Element} thisArg
     * @chainable
     */
    removeActiveObject: function () {
      if (this._activeObject) {
        this._activeObject.setActive(false);
      }
      this._activeObject = null;
      return this;
    },

    /**
     * Sets current group to a speicified one
     * @method setActiveGroup
     * @param group {fabric.Group} group to set as a current one
     * @return {fabric.Element} thisArg
     * @chainable
     */
    setActiveGroup: function (group) {
      this._activeGroup = group;
      return this;
    },

    /**
     * Returns current group
     * @method getActiveGroup
     * @return {fabric.Group} Current group
     */
    getActiveGroup: function () {
      return this._activeGroup;
    },

    /**
     * Removes current group
     * @method removeActiveGroup
     * @return {fabric.Element} thisArg
     */
    removeActiveGroup: function () {
      var g = this.getActiveGroup();
      if (g) {
        g.destroy();
      }
      return this.setActiveGroup(null);
    },

    /**
     * @method item
     * @param {Number} index
     * @return {fabric.Object}
     */
    item: function (index) {
      return this.getObjects()[index];
    },

    /**
     * Deactivates all objects by calling their setActive(false)
     * @method deactivateAll
     * @return {fabric.Element} thisArg
     */
    deactivateAll: function () {
      var allObjects = this.getObjects(),
          i = 0,
          len = allObjects.length;
      for ( ; i < len; i++) {
        allObjects[i].setActive(false);
      }
      this.removeActiveGroup();
      this.removeActiveObject();
      return this;
    },

    /**
     * Returns number representation of an instance complexity
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function () {
      return this.getObjects().reduce(function (memo, current) {
        memo += current.complexity ? current.complexity() : 0;
        return memo;
      }, 0);
    },

    /**
     * Clears a canvas element and removes all event handlers.
     * @method dispose
     * @return {fabric.Element} thisArg
     * @chainable
     */
    dispose: function () {
      this.clear();
      removeListener(this.getElement(), 'mousedown', this._onMouseDown);
      removeListener(document, 'mouseup', this._onMouseUp);
      removeListener(document, 'mousemove', this._onMouseMove);
      removeListener(window, 'resize', this._onResize);
      return this;
    },

    /**
     * @method clone
     * @param {Object} callback OPTIONAL expects `onBeforeClone` and `onAfterClone` functions
     * @return {fabric.Element} instance clone
     */
    clone: function (callback) {
      var el = document.createElement('canvas');
      el.width = this.getWidth();
      el.height = this.getHeight();

      var clone = this.__clone || (this.__clone = new fabric.Element(el));

      return clone.loadFromJSON(this.toJSON(), function () {
        if (callback) {
          callback(clone);
        }
      });
    },

    _toDataURL: function (format, callback) {
      this.clone(function (clone) {
        callback(clone.toDataURL(format));
      });
    },

    _toDataURLWithMultiplier: function (format, multiplier, callback) {
      this.clone(function (clone) {
        callback(clone.toDataURLWithMultiplier(format, multiplier));
      });
    },

    _resizeImageToFit: function (imgEl) {

      var imageWidth = imgEl.width || imgEl.offsetWidth,
          imageHeight = imgEl.height || imgEl.offsetHeight,
          widthScaleFactor = this.getWidth() / imageWidth,
          heightScaleFactor = this.getHeight() / imageHeight;

      if (imageWidth && imageHeight) {
        imgEl.width = imageWidth * widthScaleFactor;
        imgEl.height = imageHeight * heightScaleFactor;
      }
    },

    /* stubs */
    cache: {
      has: function (name, callback){ callback(false) },
      get: function () { },
      set: function () { }
    }
  });

  /**
   * Returns a string representation of an instance
   * @method toString
   * @return {String} string representation of an instance
   */
  fabric.Element.prototype.toString = function () {
    return '#<fabric.Element (' + this.complexity() + '): '+
           '{ objects: ' + this.getObjects().length + ' }>';
  };

  extend(fabric.Element, {

    /**
     * @property EMPTY_JSON
     */
    EMPTY_JSON: '{"objects": [], "background": "white"}',

    /**
     * @static
     * @method toGrayscale
     * @param {HTMLCanvasElement} canvasEl
     */
    toGrayscale: function (canvasEl) {
       var context = canvasEl.getContext('2d'),
           imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
           data = imageData.data,
           iLen = imageData.width,
           jLen = imageData.height,
           index, average;

       for (i = 0; i < iLen; i++) {
         for (j = 0; j < jLen; j++) {

           index = (i * 4) * jLen + (j * 4);
           average = (data[index] + data[index + 1] + data[index + 2]) / 3;

           data[index]     = average;
           data[index + 1] = average;
           data[index + 2] = average;
         }
       }

       context.putImageData(imageData, 0, 0);
     },

    /**
     * Provides a way to check support of some of the canvas methods
     * (either those of HTMLCanvasElement itself, or rendering context)
     * @method supports
     * @param methodName {String} method to check support for
     * @return {Boolean | null} `true` if method is supported (or at least exists),
     * `null` if canvas element or context can not be initialized
     */
    supports: function (methodName) {
      var el = document.createElement('canvas');
      if (!el || !el.getContext) {
        return null;
      }

      var ctx = el.getContext('2d');
      if (!ctx) {
        return null;
      }

      switch (methodName) {

        case 'getImageData':
          return typeof ctx.getImageData !== 'undefined';

        case 'toDataURL':
          return typeof el.toDataURL !== 'undefined';

        default:
          return null;
      }
    }

  });
})();

(function(){

  var global = this,

  /**
   * @name Canvas
   * @namespace
   */
      fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      clone = fabric.util.object.clone,
      toFixed = fabric.util.toFixed,
      capitalize = fabric.util.string.capitalize,
      getPointer = fabric.util.getPointer,
      slice = Array.prototype.slice

  if (fabric.Object) {
    return;
  }

  /**
   * @class Object
   * @memberOf Canvas
   */
  fabric.Object = fabric.util.createClass({

    type: 'object',

    includeDefaultValues: true,

    /**
     * @constant
     */
    NUM_FRACTION_DIGITS:        2,

    /**
     * @constant
     */
    FX_DURATION:                500,

    /**
     * @constant
     */
    FX_TRANSITION:              'decel',

    /**
     * @constant
     */
    MIN_SCALE_LIMIT:            0.1,

    /**
     * @field
     */
    stateProperties:  ('top left width height scaleX scaleY flipX flipY ' +
                      'theta angle opacity cornersize fill overlayFill stroke ' +
                      'strokeWidth fillRule borderScaleFactor transformMatrix').split(' '),

    /**
     * @field
     */
    options: {
      top:                      0,
      left:                     0,
      width:                    100,
      height:                   100,
      scaleX:                   1,
      scaleY:                   1,
      flipX:                    false,
      flipY:                    false,
      theta:                    0,
      opacity:                  1,
      angle:                    0,
      cornersize:               10,
      padding:                  0,
      borderColor:              'rgba(102,153,255,0.75)',
      cornerColor:              'rgba(102,153,255,0.5)',
      fill:                     'rgb(0,0,0)',
      overlayFill:              null,
      stroke:                   null,
      strokeWidth:              1,
      fillRule:                 'source-over',
      borderOpacityWhenMoving:  0.4,
      borderScaleFactor:        1,
      transformMatrix:          null
    },

    callSuper: function(methodName) {
      var fn = this.constructor.superclass.prototype[methodName];
      return (arguments.length > 1)
        ? fn.apply(this, slice.call(arguments, 1))
        : fn.call(this);
    },

    /**
     * @constructs
     * @param options {Object} options
     */
    initialize: function(options) {
      this.setOptions(options);
      this._importProperties();
      this.originalState = { };
      this.setCoords();
      this.saveState();
    },

    setOptions: function(options) {
      this.options = extend(this._getOptions(), options);
    },

    /**
     * @private
     * @method _getOptions
     */
    _getOptions: function() {
      return extend(clone(this._getSuperOptions()), this.options);
    },

    /**
     * @private
     * @method _getSuperOptions
     */
    _getSuperOptions: function() {
      var c = this.constructor;
      if (c) {
        var s = c.superclass;
        if (s) {
          var p = s.prototype;
          if (p && typeof p._getOptions == 'function') {
            return p._getOptions();
          }
        }
      }
      return { };
    },

    /**
     * @private
     * @method _importProperties
     */
    _importProperties: function() {
      this.stateProperties.forEach(function(prop) {
        (prop === 'angle')
          ? this.setAngle(this.options[prop])
          : (this[prop] = this.options[prop]);
      }, this);
    },

    /**
     * @method transform
     * @param {CanvasRenderingContext2D} ctx Context
     */
    transform: function(ctx) {
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.left, this.top);
      ctx.rotate(this.theta);
      ctx.scale(
        this.scaleX * (this.flipX ? -1 : 1),
        this.scaleY * (this.flipY ? -1 : 1)
      );
    },

    /**
     * Returns a JSON representation of an instance
     * @method toJSON
     * @return {String} json
     */
    toJSON: function() {
      return JSON.stringify(this.toObject());
    },

    /**
     * Returns an object representation of an instance
     * @method toObject
     * @return {Object}
     */
    toObject: function() {
      var object = {
        type: this.type,
        left: toFixed(this.left, this.NUM_FRACTION_DIGITS),
        top: toFixed(this.top, this.NUM_FRACTION_DIGITS),
        width: toFixed(this.width, this.NUM_FRACTION_DIGITS),
        height: toFixed(this.height, this.NUM_FRACTION_DIGITS),
        fill: this.fill,
        overlayFill: this.overlayFill,
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        scaleX: toFixed(this.scaleX, this.NUM_FRACTION_DIGITS),
        scaleY: toFixed(this.scaleY, this.NUM_FRACTION_DIGITS),
        angle: toFixed(this.getAngle(), this.NUM_FRACTION_DIGITS),
        flipX: this.flipX,
        flipY: this.flipY,
        opacity: toFixed(this.opacity, this.NUM_FRACTION_DIGITS)
      };

      if (!this.includeDefaultValues) {
        object = this._removeDefaultValues(object);
      }
      return object;
    },

    /**
     * @method toDatalessObject
     */
    toDatalessObject: function() {
      return this.toObject();
    },

    /**
     * @private
     * @method _removeDefaultValues
     */
    _removeDefaultValues: function(object) {
      var defaultOptions = fabric.Object.prototype.options;
      this.stateProperties.forEach(function(prop) {
        if (object[prop] === defaultOptions[prop]) {
          delete object[prop];
        }
      });
      return object;
    },

    /**
     * Returns true if an object is in its active state
     * @return {Boolean} true if an object is in its active state
     */
    isActive: function() {
      return !!this.active;
    },

    /**
     * Sets state of an object - `true` makes it active, `false` - inactive
     * @param {Boolean} active
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setActive: function(active) {
      this.active = !!active;
      return this;
    },

    /**
     * Returns a string representation of an instance
     * @return {String}
     */
    toString: function() {
      return "#<fabric." + capitalize(this.type) + ">";
    },

    /**
     * Basic setter
     * @param {Any} property
     * @param {Any} value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    set: function(property, value) {
      var shouldConstrainValue = (property === 'scaleX' || property === 'scaleY') && value < this.MIN_SCALE_LIMIT;
      if (shouldConstrainValue) {
        value = this.MIN_SCALE_LIMIT;
      }
      if (property === 'angle') {
        this.setAngle(value);
      }
      else {
        this[property] = value;
      }
      return this;
    },

    /**
     * Toggles specified property from `true` to `false` or from `false` to `true`
     * @method toggle
     * @param {String} property property to toggle
     * @return {fabric.Object} thisArg
     * @chainable
     */
    toggle: function(property) {
      var value = this.get(property);
      if (typeof value === 'boolean') {
        this.set(property, !value);
      }
      return this;
    },

    /**
     * @method setSourcePath
     * @param {String} value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setSourcePath: function(value) {
      this.sourcePath = value;
      return this;
    },

    /**
     * Basic getter
     * @method get
     * @param {Any} property
     * @return {Any} value of a property
     */
    get: function(property) {
      return (property === 'angle')
        ? this.getAngle()
        : this[property];
    },

    /**
     * @method render
     * @param {CanvasRenderingContext2D} ctx context to render on
     * @param {Boolean} noTransform
     */
    render: function(ctx, noTransform) {

      if (this.width === 0 || this.height === 0) return;

      ctx.save();

      var m = this.transformMatrix;
      if (m) {
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }

      if (!noTransform) {
        this.transform(ctx);
      }

      if (this.stroke) {
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.stroke;
      }

      if (this.overlayFill) {
        ctx.fillStyle = this.overlayFill;
      }
      else if (this.fill) {
        ctx.fillStyle = this.fill;
      }

      this._render(ctx);

      if (this.active && !noTransform) {
        this.drawBorders(ctx);
        this.drawCorners(ctx);
      }
      ctx.restore();
    },

    /**
     * Returns width of an object
     * @method getWidth
     * @return {Number} width value
     */
    getWidth: function() {
      return this.width * this.scaleX;
    },

    /**
     * Returns height of an object
     * @method getHeight
     * @return {Number} height value
     */
    getHeight: function() {
      return this.height * this.scaleY;
    },

    /**
     * Scales an object (equally by x and y)
     * @method scale
     * @param value {Number} scale factor
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scale: function(value) {
      this.scaleX = value;
      this.scaleY = value;
      return this;
    },

    /**
     * Scales an object to a given width (scaling by x/y equally)
     * @method scaleToWidth
     * @param value {Number} new width value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToWidth: function(value) {
      return this.scale(value / this.width);
    },

    /**
     * Scales an object to a given height (scaling by x/y equally)
     * @method scaleToHeight
     * @param value {Number} new height value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToHeight: function(value) {
      return this.scale(value / this.height);
    },

    /**
     * Sets object opacity
     * @method setOpacity
     * @param value {Number} value 0-1
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setOpacity: function(value) {
      this.set('opacity', value);
      return this;
    },

    /**
     * Returns object's angle value
     * @method getAngle
     * @return {Number} angle value
     */
    getAngle: function() {
      return this.theta * 180 / Math.PI;
    },

    /**
     * Sets object's angle
     * @method setAngle
     * @param value {Number} angle value
     * @return {Object} thisArg
     */
    setAngle: function(value) {
      this.theta = value / 180 * Math.PI;
      this.angle = value;
      return this;
    },

    /**
     * Sets corner position coordinates based on current angle, width and height.
     * @method setCoords
     * return {fabric.Object} thisArg
     * @chainable
     */
    setCoords: function() {

      this.currentWidth = this.width * this.scaleX;
      this.currentHeight = this.height * this.scaleY;

      this._hypotenuse = Math.sqrt(
        Math.pow(this.currentWidth / 2, 2) +
        Math.pow(this.currentHeight / 2, 2));

      this._angle = Math.atan(this.currentHeight / this.currentWidth);

      var offsetX = Math.cos(this._angle + this.theta) * this._hypotenuse,
          offsetY = Math.sin(this._angle + this.theta) * this._hypotenuse,
          theta = this.theta,
          sinTh = Math.sin(theta),
          cosTh = Math.cos(theta);

      var tl = {
        x: this.left - offsetX,
        y: this.top - offsetY
      };
      var tr = {
        x: tl.x + (this.currentWidth * cosTh),
        y: tl.y + (this.currentWidth * sinTh)
      };
      var br = {
        x: tr.x - (this.currentHeight * sinTh),
        y: tr.y + (this.currentHeight * cosTh)
      };
      var bl = {
        x: tl.x - (this.currentHeight * sinTh),
        y: tl.y + (this.currentHeight * cosTh)
      };
      var ml = {
        x: tl.x - (this.currentHeight/2 * sinTh),
        y: tl.y + (this.currentHeight/2 * cosTh)
      };
      var mt = {
        x: tl.x + (this.currentWidth/2 * cosTh),
        y: tl.y + (this.currentWidth/2 * sinTh)
      };
      var mr = {
        x: tr.x - (this.currentHeight/2 * sinTh),
        y: tr.y + (this.currentHeight/2 * cosTh)
      }
      var mb = {
        x: bl.x + (this.currentWidth/2 * cosTh),
        y: bl.y + (this.currentWidth/2 * sinTh)
      }

      this.oCoords = { tl: tl, tr: tr, br: br, bl: bl, ml: ml, mt: mt, mr: mr, mb: mb };

      this._setCornerCoords();

      return this;
    },

    /**
     * Draws borders of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @method drawBorders
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawBorders: function(ctx) {
      var o = this.options,
          padding = o.padding,
          padding2 = padding * 2;

      ctx.save();

      ctx.globalAlpha = this.isMoving ? o.borderOpacityWhenMoving : 1;
      ctx.strokeStyle = o.borderColor;

      var scaleX = 1 / (this.scaleX < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleX);
      var scaleY = 1 / (this.scaleY < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleY);

      ctx.lineWidth = 1 / this.borderScaleFactor;

      ctx.scale(scaleX, scaleY);

      var w = this.getWidth(),
          h = this.getHeight();

      ctx.strokeRect(
        Math.floor(-(w / 2) - padding) + 0.5, // offset needed to make lines look sharper
        Math.floor(-(h / 2) - padding) + 0.5,
        Math.floor(w + padding2),
        Math.floor(h + padding2)
      );

      ctx.restore();
      return this;
    },

    /**
     * Draws corners of an object's bounding box.
     * Requires public properties: width, height, scaleX, scaleY
     * Requires public options: cornersize, padding
     * @method drawCorners
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawCorners: function(ctx) {
      var size = this.options.cornersize,
          size2 = size / 2,
          padding = this.options.padding,
          left = -(this.width / 2),
          top = -(this.height / 2),
          _left,
          _top,
          sizeX = size / this.scaleX,
          sizeY = size / this.scaleY,
          scaleOffsetY = (padding + size2) / this.scaleY,
          scaleOffsetX = (padding + size2) / this.scaleX,
          scaleOffsetSizeX = (padding + size2 - size) / this.scaleX,
          scaleOffsetSizeY = (padding + size2 - size) / this.scaleY;

      ctx.save();

      ctx.globalAlpha = this.isMoving ? this.options.borderOpacityWhenMoving : 1;
      ctx.fillStyle = this.options.cornerColor;

      _left = left - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left - scaleOffsetX;
      _top = top + this.height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width + scaleOffsetSizeX;
      _top = top + this.height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width/2 - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width/2 - scaleOffsetX;
      _top = top + this.height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left + this.width + scaleOffsetSizeX;
      _top = top + this.height/2 - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      _left = left - scaleOffsetX;
      _top = top + this.height/2 - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      ctx.restore();

      return this;
    },

    /**
     * Clones an instance
     * @method clone
     * @param {Object} options object
     * @return {fabric.Object} clone of an instance
     */
    clone: function(options) {
      if (this.constructor.fromObject) {
        return this.constructor.fromObject(this.toObject(), options);
      }
      return new fabric.Object(this.toObject());
    },

    /**
     * Creates an instance of fabric.Image out of an object
     * @method cloneAsImage
     * @param callback {Function} callback, invoked with an instance as a first argument
     * @return {fabric.Object} thisArg
     * @chainable
     */
    cloneAsImage: function(callback) {
      if (fabric.Image) {
        var i = new Image();
        i.onload = function() {
          if (callback) {
            callback(new fabric.Image(i), orig);
          }
          i = i.onload = null;
        }
        var orig = {
          angle: this.get('angle'),
          flipX: this.get('flipX'),
          flipY: this.get('flipY')
        }

        this.set('angle', 0).set('flipX', false).set('flipY', false);
        i.src = this.toDataURL();
      }
      return this;
    },

    /**
     * Converts an object into a data-url-like string
     * @method toDataURL
     * @return {String} string of data
     */
    toDataURL: function() {
      var el = document.createElement('canvas');

      el.width = this.getWidth();
      el.height = this.getHeight();

      fabric.util.wrapElement(el, 'div');

      var canvas = new fabric.Element(el);
      canvas.backgroundColor = 'transparent';
      canvas.renderAll();

      var clone = this.clone();
      clone.left = el.width / 2;
      clone.top = el.height / 2;

      clone.setActive(false);

      canvas.add(clone);
      var data = canvas.toDataURL('png');

      canvas.dispose();
      canvas = clone = null;
      return data;
    },

    /**
     * @method hasStateChanged
     * @return {Boolean} true if instance' state has changed
     */
    hasStateChanged: function() {
      return this.stateProperties.some(function(prop) {
        return this[prop] !== this.originalState[prop];
      }, this);
    },

    /**
     * @method saveState
     * @return {fabric.Object} thisArg
     * @chainable
     */
    saveState: function() {
      this.stateProperties.forEach(function(prop) {
        this.originalState[prop] = this.get(prop);
      }, this);
      return this;
    },

    /**
     * Returns true if object intersects with an area formed by 2 points
     * @method intersectsWithRect
     * @param {Object} selectionTL
     * @param {Object} selectionBR
     * @return {Boolean}
     */
    intersectsWithRect: function(selectionTL, selectionBR) {
      var oCoords = this.oCoords,
          tl = new fabric.Point(oCoords.tl.x, oCoords.tl.y),
          tr = new fabric.Point(oCoords.tr.x, oCoords.tr.y),
          bl = new fabric.Point(oCoords.bl.x, oCoords.bl.y),
          br = new fabric.Point(oCoords.br.x, oCoords.br.y);

      var intersection = fabric.Intersection.intersectPolygonRectangle(
        [tl, tr, br, bl],
        selectionTL,
        selectionBR
      );
      return (intersection.status === 'Intersection');
    },

    /**
     * Returns true if object intersects with another object
     * @method intersectsWithObject
     * @param {Object} other Object to test
     * @return {Boolean}
     */
    intersectsWithObject: function(other) {
      function getCoords(oCoords) {
        return {
          tl: new fabric.Point(oCoords.tl.x, oCoords.tl.y),
          tr: new fabric.Point(oCoords.tr.x, oCoords.tr.y),
          bl: new fabric.Point(oCoords.bl.x, oCoords.bl.y),
          br: new fabric.Point(oCoords.br.x, oCoords.br.y)
        }
      }
      var thisCoords = getCoords(this.oCoords),
          otherCoords = getCoords(other.oCoords);
      var intersection = fabric.Intersection.intersectPolygonPolygon(
        [thisCoords.tl, thisCoords.tr, thisCoords.br, thisCoords.bl],
        [otherCoords.tl, otherCoords.tr, otherCoords.br, otherCoords.bl]
      );

      return (intersection.status === 'Intersection');
    },

    /**
     * Returns true if object is fully contained within area formed by 2 points
     * @method isContainedWithinRect
     * @param {Object} selectionTL
     * @param {Object} selectionBR
     * @return {Boolean}
     */
    isContainedWithinRect: function(selectionTL, selectionBR) {
      var oCoords = this.oCoords,
          tl = new fabric.Point(oCoords.tl.x, oCoords.tl.y),
          tr = new fabric.Point(oCoords.tr.x, oCoords.tr.y),
          bl = new fabric.Point(oCoords.bl.x, oCoords.bl.y),
          br = new fabric.Point(oCoords.br.x, oCoords.br.y);
      return tl.x > selectionTL.x
        && tr.x < selectionBR.x
        && tl.y > selectionTL.y
        && bl.y < selectionBR.y;
    },

    /**
     * @method isType
     * @param type {String} type to check against
     * @return {Boolean} true if specified type is identical to the type of instance
     */
    isType: function(type) {
      return this.type === type;
    },

    /**
     * Determines which one of the four corners has been clicked
     * @method _findTargetCorner
     * @private
     * @param e {Event} event object
     * @param offset {Object} canvas offset
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
     */
    _findTargetCorner: function(e, offset) {
      var pointer = getPointer(e),
          ex = pointer.x - offset.left,
          ey = pointer.y - offset.top,
          xpoints,
          lines;

      for (var i in this.oCoords) {
        lines = this._getImageLines(this.oCoords[i].corner, i);
        xpoints = this._findCrossPoints(ex, ey, lines);
        if (xpoints % 2 == 1 && xpoints != 0) {
          this.__corner = i;
          return i;
        }
      }
      return false;
    },

    /**
     * Helper method to determine how many cross points are between the 4 image edges
     * and the horizontal line determined by the position of our mouse when clicked on canvas
     * @method _findCrossPoints
     * @private
     * @param ex {Number} x coordinate of the mouse
     * @param ey {Number} y coordinate of the mouse
     * @param oCoords {Object} Coordinates of the image being evaluated
     */
    _findCrossPoints: function(ex, ey, oCoords) {
      var b1, b2, a1, a2, xi, yi,
          xcount = 0,
          iLine;

      for (var lineKey in oCoords) {
        iLine = oCoords[lineKey];
        if ((iLine.o.y < ey) && (iLine.d.y < ey)) {
          continue;
        }
        if ((iLine.o.y >= ey) && (iLine.d.y >= ey)) {
          continue;
        }
        if ((iLine.o.x == iLine.d.x) && (iLine.o.x >= ex)) {
          xi = iLine.o.x;
          yi = ey;
        }
        else {
          b1 = 0;
          b2 = (iLine.d.y-iLine.o.y)/(iLine.d.x-iLine.o.x);
          a1 = ey-b1*ex;
          a2 = iLine.o.y-b2*iLine.o.x;

          xi = - (a1-a2)/(b1-b2);
          yi = a1+b1*xi;
        }
        if (xi >= ex) {
          xcount += 1;
        }
        if (xcount == 2) {
          break;
        }
      }
      return xcount;
    },

    /**
     * Method that returns an object with the image lines in it given the coordinates of the corners
     * @method _getImageLines
     * @private
     * @param oCoords {Object} coordinates of the image corners
     */
    _getImageLines: function(oCoords, i) {
      return {
        topline: {
          o: oCoords.tl,
          d: oCoords.tr
        },
        rightline: {
          o: oCoords.tr,
          d: oCoords.br
        },
        bottomline: {
          o: oCoords.br,
          d: oCoords.bl
        },
        leftline: {
          o: oCoords.bl,
          d: oCoords.tl
        }
      }
    },

    /**
     * Sets the coordinates of the draggable boxes in the corners of
     * the image used to scale/rotate it.
     * @method _setCornerCoords
     * @private
     */
    _setCornerCoords: function() {
      var coords = this.oCoords,
          theta = this.theta,
          cosOffset = this.cornersize * /*this.scaleX * */ Math.cos(theta),
          sinOffset = this.cornersize * /*this.scaleY * */ Math.sin(theta),
          size2 = this.cornersize / 2,
          size2x = size2 - sinOffset,
          size2y = size2,
          corner;

      coords.tl.x -= size2x;
      coords.tl.y -= size2y;

      coords.tl.corner = {
        tl: {
          x: coords.tl.x,
          y: coords.tl.y
        },
        tr: {
          x: coords.tl.x + cosOffset,
          y: coords.tl.y + sinOffset
        },
        bl: {
          x: coords.tl.x - sinOffset,
          y: coords.tl.y + cosOffset
        }
      };
      coords.tl.corner.br = {
        x: coords.tl.corner.tr.x - sinOffset,
        y: coords.tl.corner.tr.y + cosOffset
      };

      coords.tl.x += size2x;
      coords.tl.y += size2y;

      coords.tr.x += size2;
      coords.tr.y -= size2;
      coords.tr.corner = {
        tl: {
          x: coords.tr.x - cosOffset,
          y: coords.tr.y - sinOffset
        },
        tr: {
          x: coords.tr.x,
          y: coords.tr.y
        },
        br: {
          x: coords.tr.x - sinOffset,
          y: coords.tr.y + cosOffset
        }
      };
      coords.tr.corner.bl = {
        x: coords.tr.corner.tl.x - sinOffset,
        y: coords.tr.corner.tl.y + cosOffset
      };
      coords.tr.x -= size2;
      coords.tr.y += size2;

      coords.bl.x -= size2;
      coords.bl.y += size2;
      coords.bl.corner = {
        tl: {
          x: coords.bl.x + sinOffset,
          y: coords.bl.y - cosOffset
        },
        bl: {
          x: coords.bl.x,
          y: coords.bl.y
        },
        br: {
          x: coords.bl.x + cosOffset,
          y: coords.bl.y + sinOffset
        }
      };
      coords.bl.corner.tr = {
        x: coords.bl.corner.br.x + sinOffset,
        y: coords.bl.corner.br.y - cosOffset
      };
      coords.bl.x += size2;
      coords.bl.y -= size2;

      coords.br.x += size2;
      coords.br.y += size2;
      coords.br.corner = {
        tr: {
          x: coords.br.x + sinOffset,
          y: coords.br.y - cosOffset
        },
        bl: {
          x: coords.br.x - cosOffset,
          y: coords.br.y - sinOffset
        },
        br: {
          x: coords.br.x,
          y: coords.br.y
        }
      };
      coords.br.corner.tl = {
        x: coords.br.corner.bl.x + sinOffset,
        y: coords.br.corner.bl.y - cosOffset
      };
      coords.br.x -= size2;
      coords.br.y -= size2;


      coords.ml.x -= size2;
      coords.ml.y -= size2;
      coords.ml.corner = {
        tl: {
          x: coords.ml.x,
          y: coords.ml.y
        },
        tr: {
          x: coords.ml.x + cosOffset,
          y: coords.ml.y + sinOffset
        },
        bl: {
          x: coords.ml.x - sinOffset,
          y: coords.ml.y + cosOffset
        }
      };
      coords.ml.corner.br = {
        x: coords.ml.corner.tr.x - sinOffset,
        y: coords.ml.corner.tr.y + cosOffset
      };
      coords.ml.x += size2;
      coords.ml.y += size2;

      coords.mt.x -= size2;
      coords.mt.y -= size2;
      coords.mt.corner = {
        tl: {
          x: coords.mt.x,
          y: coords.mt.y
        },
        tr: {
          x: coords.mt.x + cosOffset,
          y: coords.mt.y + sinOffset
        },
        bl: {
          x: coords.mt.x - sinOffset,
          y: coords.mt.y + cosOffset
        }
      };
      coords.mt.corner.br = {
        x: coords.mt.corner.tr.x - sinOffset,
        y: coords.mt.corner.tr.y + cosOffset
      };
      coords.mt.x += size2;
      coords.mt.y += size2;

      coords.mr.x -= size2;
      coords.mr.y -= size2;
      coords.mr.corner = {
        tl: {
          x: coords.mr.x,
          y: coords.mr.y
        },
        tr: {
          x: coords.mr.x + cosOffset,
          y: coords.mr.y + sinOffset
        },
        bl: {
          x: coords.mr.x - sinOffset,
          y: coords.mr.y + cosOffset
        }
      };
      coords.mr.corner.br = {
        x: coords.mr.corner.tr.x - sinOffset,
        y: coords.mr.corner.tr.y + cosOffset
      };
      coords.mr.x += size2;
      coords.mr.y += size2;

      coords.mb.x -= size2;
      coords.mb.y -= size2;
      coords.mb.corner = {
        tl: {
          x: coords.mb.x,
          y: coords.mb.y
        },
        tr: {
          x: coords.mb.x + cosOffset,
          y: coords.mb.y + sinOffset
        },
        bl: {
          x: coords.mb.x - sinOffset,
          y: coords.mb.y + cosOffset
        }
      };
      coords.mb.corner.br = {
        x: coords.mb.corner.tr.x - sinOffset,
        y: coords.mb.corner.tr.y + cosOffset
      };

      coords.mb.x += size2;
      coords.mb.y += size2;

      corner = coords.mb.corner;

      corner.tl.x -= size2;
      corner.tl.y -= size2;
      corner.tr.x -= size2;
      corner.tr.y -= size2;
      corner.br.x -= size2;
      corner.br.y -= size2;
      corner.bl.x -= size2;
      corner.bl.y -= size2;
    },

    /**
     * Makes object's color grayscale
     * @method toGrayscale
     * @return {fabric.Object} thisArg
     */
    toGrayscale: function() {
      var fillValue = this.get('fill');
      if (fillValue) {
        this.set('overlayFill', new fabric.Color(fillValue).toGrayscale().toRgb());
      }
      return this;
    },

    /**
     * @method complexity
     * @return {Number}
     */
    complexity: function() {
      return 0;
    },

    /**
     * @method getCenter
     * @return {Object} object with `x`, `y` properties corresponding to path center coordinates
     */
    getCenter: function() {
      return {
        x: this.get('left') + this.width / 2,
        y: this.get('top') + this.height / 2
      };
    },

    /**
     * @method straighten
     * @return {fabric.Object} thisArg
     * @chainable
     */
    straighten: function() {
      var angle = this._getAngleValueForStraighten();
      this.setAngle(angle);
      return this;
    },

    /**
     * @method fxStraighten
     * @param {Object} callbacks
     *                  - onComplete: invoked on completion
     *                  - onChange: invoked on every step of animation
     *
     * @return {fabric.Object} thisArg
     * @chainable
     */
    fxStraighten: function(callbacks) {
      callbacks = callbacks || { };

      var empty = function() { },
          onComplete = callbacks.onComplete || empty,
          onChange = callbacks.onChange || empty,
          _this = this;

      fabric.util.animate({
        startValue: this.get('angle'),
        endValue: this._getAngleValueForStraighten(),
        duration: this.FX_DURATION,
        onChange: function(value) {
          _this.setAngle(value);
          onChange();
        },
        onComplete: function() {
          _this.setCoords();
          onComplete();
        },
        onStart: function() {
          _this.setActive(false);
        }
      });

      return this;
    },

    /**
     * @method fxRemove
     * @param {Object} callbacks
     * @return {fabric.Object} thisArg
     * @chainable
     */
    fxRemove: function(callbacks) {
      callbacks || (callbacks = { });

      var empty = function() { },
          onComplete = callbacks.onComplete || empty,
          onChange = callbacks.onChange || empty,
          _this = this;

      fabric.util.animate({
        startValue: this.get('opacity'),
        endValue: 0,
        duration: this.FX_DURATION,
        onChange: function(value) {
          _this.set('opacity', value);
          onChange();
        },
        onComplete: onComplete,
        onStart: function() {
          _this.setActive(false);
        }
      });

      return this;
    },

    /**
     * @method _getAngleValueForStraighten
     * @return {Number} angle value
     * @private
     */
    _getAngleValueForStraighten: function() {
      var angle = this.get('angle');


      if      (angle > -225 && angle <= -135) { return -180;  }
      else if (angle > -135 && angle <= -45)  { return  -90;  }
      else if (angle > -45  && angle <= 45)   { return    0;  }
      else if (angle > 45   && angle <= 135)  { return   90;  }
      else if (angle > 135  && angle <= 225 ) { return  180;  }
      else if (angle > 225  && angle <= 315)  { return  270;  }
      else if (angle > 315)                   { return  360;  }

      return 0;
    }
  });

  /**
   * @alias rotate -> setAngle
   */
  fabric.Object.prototype.rotate = fabric.Object.prototype.setAngle;
})();

(function(){

  var fabric = this.fabric || (this.fabric = { }),
      extend = fabric.util.object.extend;

  if (fabric.Line) {
    return;
  }

  fabric.Line = fabric.util.createClass(fabric.Object, {

    type: 'line',

    /**
     * @constructor
     * @method initialize
     * @param points {Array} array of points
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(points, options) {
      if (!points) {
        points = [0, 0, 0, 0];
      }

      this.callSuper('initialize', options);

      this.set('x1', points[0]);
      this.set('y1', points[1]);
      this.set('x2', points[2]);
      this.set('y2', points[3]);

      this.set('width', this.x2 - this.x1);
      this.set('height', this.y2 - this.y1);
      this.set('left', this.x1 + this.width / 2);
      this.set('top', this.y1 + this.height / 2);
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();

      ctx.moveTo(-this.width / 2, -this.height / 2);
      ctx.lineTo(this.width / 2, this.height / 2);

      var origStrokeStyle = ctx.strokeStyle;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.stroke();
      ctx.strokeStyle = origStrokeStyle;
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    },

    /**
     * @methd toObject
     * @return {Object}
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        x1: this.get('x1'),
        y1: this.get('y1'),
        x2: this.get('x2'),
        y2: this.get('y2')
      });
    }
  });

  fabric.Element.ATTRIBUTE_NAMES = 'x1 y1 x2 y2 stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method fabric.Line.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of fabric.Line
   */
  fabric.Line.fromElement = function(element, options) {
    var parsedAttributes = fabric.parseAttributes(element, fabric.Element.ATTRIBUTE_NAMES);
    var points = [
      parsedAttributes.x1 || 0,
      parsedAttributes.y1 || 0,
      parsedAttributes.x2 || 0,
      parsedAttributes.y2 || 0
    ];
    return new fabric.Line(points, extend(parsedAttributes, options));
  };

  /**
   * @static
   * @method fabric.Line.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Line
   */
  fabric.Line.fromObject = function(object) {
    var points = [object.x1, object.y1, object.x2, object.y2];
    return new fabric.Line(points, object);
  };
})();

(function() {

  var fabric  = this.fabric || (this.fabric = { }),
      piBy2   = Math.PI * 2,
      extend = fabric.util.object.extend;

  if (fabric.Circle) {
    console.warn('fabric.Circle is already defined.');
    return;
  }

  fabric.Circle = fabric.util.createClass(fabric.Object, /** @lends fabric.Circle.prototype */ {

    /**
     * @field
     */
    type: 'circle',

    /**
     * @constructs
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this.set('radius', options.radius || 0);
      this.callSuper('initialize', options);

      var radiusBy2ByScale = this.get('radius') * 2 * this.get('scaleX');
      this.set('width', radiusBy2ByScale).set('height', radiusBy2ByScale);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        radius: this.get('radius')
      });
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, piBy2, false);
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },

    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return 1;
    }
  });

  /**
   * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
   */
  fabric.Circle.ATTRIBUTE_NAMES = 'cx cy r fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method fabric.Circle.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @throws {Error} If value of `r` attribute is missing or invalid
   * @return {Object} instance of fabric.Circle
   */
  fabric.Circle.fromElement = function(element, options) {
    var parsedAttributes = fabric.parseAttributes(element, fabric.Circle.ATTRIBUTE_NAMES);
    if (!isValidRadius(parsedAttributes)) {
      throw Error('value of `r` attribute is required and can not be negative');
    }
    return new fabric.Circle(extend(parsedAttributes, options));
  };

  /**
   * @private
   */
  function isValidRadius(attributes) {
    return (('radius' in attributes) && (attributes.radius > 0));
  }

  /**
   * @static
   * @method fabric.Circle.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Circle
   */
  fabric.Circle.fromObject = function(object) {
    return new fabric.Circle(object);
  }
})();
(function(){

  var fabric = this.fabric || (this.fabric = { });

  if (fabric.Triangle) return;

  fabric.Triangle = fabric.util.createClass(fabric.Object, {

    /**
     * @field
     */
    type: 'triangle',

    /**
     * @constructs
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this.callSuper('initialize', options);

      this.set('width', options.width || 100)
          .set('height', options.height || 100);
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();

      ctx.moveTo(-this.width / 2, this.height / 2);
      ctx.lineTo(0, -this.height / 2);
      ctx.lineTo(this.width / 2, this.height / 2);

      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },

    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return 1;
    }
  });

  /**
   * @static
   * @method Canvas.Trangle.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of Canvas.Triangle
   */
  fabric.Triangle.fromObject = function(object) {
    return new fabric.Triangle(object);
  };
})();

(function(){

  var fabric = this.fabric || (this.fabric = { }),
      extend = fabric.util.object.extend;

  if (fabric.Ellipse) {
    console.warn('fabric.Ellipse is already defined.');
    return;
  }

  fabric.Ellipse = fabric.util.createClass(fabric.Object, {

    type: 'ellipse',

    /**
     * @constructor
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this.callSuper('initialize', options);

      this.set('rx', options.rx || 0);
      this.set('ry', options.ry || 0);

      this.set('width', this.get('rx') * 2);
      this.set('height', this.get('ry') * 2);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        rx: this.get('rx'),
        ry: this.get('ry')
      })
    },

    /**
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render on
     * @param noTransform {Boolean} context is not transformed when set to true
     */
    render: function(ctx, noTransform) {
      if (this.rx === 0 || this.ry === 0) return;
      return this.callSuper('render', ctx, noTransform);
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();
      ctx.save();
      ctx.transform(1, 0, 0, this.ry/this.rx, 0, 0);
      ctx.arc(0, 0, this.rx, 0, Math.PI * 2, false);
      ctx.restore();
      if (this.stroke) {
        ctx.stroke();
      }
      if (this.fill) {
        ctx.fill();
      }
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });

  fabric.Ellipse.ATTRIBUTE_NAMES = 'cx cy rx ry fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method fabric.Ellipse.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of fabric.Ellipse
   */
  fabric.Ellipse.fromElement = function(element, options) {
    var parsedAttributes = fabric.parseAttributes(element, fabric.Ellipse.ATTRIBUTE_NAMES);
    return new fabric.Ellipse(extend(parsedAttributes, options));
  };

  /**
   * @static
   * @method fabric.Ellipse.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Ellipse
   */
  fabric.Ellipse.fromObject = function(object) {
    return new fabric.Ellipse(object);
  }
})();

(function(){

  var fabric = this.fabric || (this.fabric = { });

  if (fabric.Rect) {
    return;
  }

  /**
   * @class Rect
   * @extends fabric.Object
   */
  fabric.Rect = fabric.util.createClass(fabric.Object, /** @lends fabric.Rect.prototype */ {

    type: 'rect',

    options: {
      rx: 0,
      ry: 0
    },

    /**
     * @constructs
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      this.callSuper('initialize', options);
      this._initRxRy();
    },

    /**
     * @private
     * @method _initRxRy
     */
    _initRxRy: function() {
      if (this.options.rx && !this.options.ry) {
        this.options.ry = this.options.rx;
      }
      else if (this.options.ry && !this.options.rx) {
        this.options.rx = this.options.ry;
      }
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var rx = this.options.rx || 0,
          ry = this.options.ry || 0,
          x = -this.width / 2,
          y = -this.height / 2,
          w = this.width,
          h = this.height;

      ctx.beginPath();
      ctx.moveTo(x+rx, y);
      ctx.lineTo(x+w-rx, y);
      ctx.bezierCurveTo(x+w, y, x+w, y+ry, x+w, y+ry);
      ctx.lineTo(x+w, y+h-ry);
      ctx.bezierCurveTo(x+w,y+h,x+w-rx,y+h,x+w-rx,y+h);
      ctx.lineTo(x+rx,y+h);
      ctx.bezierCurveTo(x,y+h,x,y+h-ry,x,y+h-ry);
      ctx.lineTo(x,y+ry);
      ctx.bezierCurveTo(x,y,x+rx,y,x+rx,y);
      ctx.closePath();

      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },

    _normalizeLeftTopProperties: function(parsedAttributes) {
      if (parsedAttributes.left) {
        this.set('left', parsedAttributes.left + this.getWidth() / 2);
      }
      if (parsedAttributes.top) {
        this.set('top', parsedAttributes.top + this.getHeight() / 2);
      }
      return this;
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });

  fabric.Rect.ATTRIBUTE_NAMES = 'x y width height rx ry fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @private
   */
  function _setDefaultLeftTopValues(attributes) {
    attributes.left = attributes.left || 0;
    attributes.top  = attributes.top  || 0;
    return attributes;
  }

  /**
   * @static
   * @method fabric.Rect.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of fabric.Rect
   */
  fabric.Rect.fromElement = function(element, options) {
    if (!element) {
      return null;
    }

    var parsedAttributes = fabric.parseAttributes(element, fabric.Rect.ATTRIBUTE_NAMES);
    parsedAttributes = _setDefaultLeftTopValues(parsedAttributes);

    var rect = new fabric.Rect(fabric.util.object.extend(options || { }, parsedAttributes));
    rect._normalizeLeftTopProperties(parsedAttributes);

    return rect;
  };

  /**
   * @static
   * @method fabric.Rect.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Rect
   */
  fabric.Rect.fromObject = function(object) {
    return new fabric.Rect(object);
  };
})();

(function(){

  var fabric = this.fabric || (this.fabric = { });

  if (fabric.Polyline) {
    console.warn('fabric.Polyline is already defined');
    return;
  }

  fabric.Polyline = fabric.util.createClass(fabric.Object, {

    type: 'polyline',

    /**
     * @constructor
     * @method initialize
     * @param points {Array} array of points
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(points, options) {
      options = options || { };
      this.set('points', points);
      this.callSuper('initialize', options);
      this._calcDimensions();
    },

    /**
     * @private
     * @method _calcDimensions
     */
    _calcDimensions: function() {
      return fabric.Polygon.prototype._calcDimensions.call(this);
    },

    /**
     * @private
     * @method _toOrigin
     */
    _toOrigin: function() {
      return fabric.Polygon.prototype._toOrigin.call(this);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return fabric.Polygon.prototype.toObject.call(this);
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var point;
      ctx.beginPath();
      for (var i = 0, len = this.points.length; i < len; i++) {
        point = this.points[i];
        ctx.lineTo(point.x, point.y);
      }
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return this.get('points').length;
    }
  });

  var ATTRIBUTE_NAMES = 'fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method fabric.Polyline.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of fabric.Polyline
   */
  fabric.Polyline.fromElement = function(element, options) {
    if (!element) {
      return null;
    }
    var points = fabric.parsePointsAttribute(element.getAttribute('points')),
        parsedAttributes = fabric.parseAttributes(element, ATTRIBUTE_NAMES);

    return new fabric.Polyline(points, fabric.util.object.extend(parsedAttributes, options));
  };

  /**
   * @static
   * @method fabric.Polyline.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Polyline
   */
  fabric.Polyline.fromObject = function(object) {
    var points = object.points;
    return new fabric.Polyline(points, object);
  }
})();

(function(){

  var fabric = this.fabric || (this.fabric = { }),
      extend = fabric.util.object.extend,
      min = fabric.util.array.min,
      max = fabric.util.array.max;

  if (fabric.Polygon) {
    console.warn('fabric.Polygon is already defined');
    return;
  }

  function byX(p) { return p.x; }
  function byY(p) { return p.y; }

  fabric.Polygon = fabric.util.createClass(fabric.Object, {

    type: 'polygon',

    /**
     * @constructor
     * @method initialize
     * @param points {Array} array of points
     * @param options {Object} options object
     * @return thisArg
     */
    initialize: function(points, options) {
      options = options || { };
      this.points = points;
      this.callSuper('initialize', options);
      this._calcDimensions();
    },

    /**
     * @private
     * @method _calcDimensions
     */
    _calcDimensions: function() {

      var points = this.points,
          minX = min(points, 'x'),
          minY = min(points, 'y'),
          maxX = max(points, 'x'),
          maxY = max(points, 'y');

      this.width = maxX - minX;
      this.height = maxY - minY;
      this.minX = minX;
      this.minY = minY;
    },

    /**
     * @private
     * @method _toOrigin
     */
    _toOrigin: function() {
      this.points = this.points.map(function(point) {
        return {
          x: point.x - this.minX,
          y: point.y - this.minY
        };
      }, this);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        points: this.points.concat()
      });
    },

    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var point;
      ctx.beginPath();
      for (var i = 0, len = this.points.length; i < len; i++) {
        point = this.points[i];
        ctx.lineTo(point.x, point.y);
      }
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.closePath();
        ctx.stroke();
      }
    },

    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return this.points.length;
    }
  });

  fabric.Polygon.ATTRIBUTE_NAMES = 'fill fill-opacity stroke stroke-width transform'.split(' ');

  /**
   * @static
   * @method fabric.Polygon.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of fabric.Polygon
   */
  fabric.Polygon.fromElement = function(element, options) {
    if (!element) {
      return null;
    }
    var points = fabric.parsePointsAttribute(element.getAttribute('points')),
        parsedAttributes = fabric.parseAttributes(element, fabric.Polygon.ATTRIBUTE_NAMES);

    return new fabric.Polygon(points, extend(parsedAttributes, options));
  };

  /**
   * @static
   * @method fabric.Polygon.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Polygon
   */
  fabric.Polygon.fromObject = function(object) {
    return new fabric.Polygon(object.points, object);
  }
})();


(function(){

  var fabric = this.fabric || (this.fabric = { }),
      min = fabric.util.array.min,
      max = fabric.util.array.max,
      extend = fabric.util.object.extend;

  if (fabric.Path) {
    console.warn('fabric.Path is already defined');
    return;
  }
  if (!fabric.Object) {
    console.warn('fabric.Path requires fabric.Object');
    return;
  }

  fabric.Path = fabric.util.createClass(fabric.Object, {

    type: 'path',

    /**
     * @constructor
     * @param path {Array | String} path data
     * (i.e. sequence of coordinates and corresponding "command" tokens)
     * @param options {Object} options object
     */
    initialize: function(path, options) {
      options = options || { };

      this.setOptions(options);
      this._importProperties();

      this.originalState = { };

      if (!path) {
        throw Error('`path` argument is required');
      }

      var fromArray = Object.prototype.toString.call(path) === '[object Array]';

      this.path = fromArray
        ? path
        : path.match && path.match(/[a-zA-Z][^a-zA-Z]*/g);

      if (!this.path) return;

      if (!fromArray) {
        this._initializeFromArray(options);
      };

      this.setCoords();

      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },

    _initializeFromArray: function(options) {
      var isWidthSet = 'width' in options,
          isHeightSet = 'height' in options;

      this.path = this._parsePath();

      if (!isWidthSet || !isHeightSet) {
        extend(this, this._parseDimensions());
        if (isWidthSet) {
          this.width = this.options.width;
        }
        if (isHeightSet) {
          this.height = this.options.height;
        }
      }
    },

    _render: function(ctx) {
      var current, // current instruction
          x = 0, // current x
          y = 0, // current y
          controlX = 0, // current control point x
          controlY = 0, // current control point y
          tempX,
          tempY,
          l = -(this.width / 2),
          t = -(this.height / 2);

      for (var i=0, len=this.path.length; i<len; ++i) {

        current = this.path[i];

        switch (current[0]) { // first letter

          case 'l': // lineto, relative
            x += current[1];
            y += current[2];
            ctx.lineTo(x + l, y + t);
            break;

          case 'L': // lineto, absolute
            x = current[1];
            y = current[2];
            ctx.lineTo(x + l, y + t);
            break;

          case 'h': // horizontal lineto, relative
            x += current[1];
            ctx.lineTo(x + l, y + t);
            break;

          case 'H': // horizontal lineto, absolute
            x = current[1];
            ctx.lineTo(x + l, y + t);
            break;

          case 'v': // vertical lineto, relative
            y += current[1];
            ctx.lineTo(x + l, y + t);
            break;

          case 'V': // verical lineto, absolute
            y = current[1];
            ctx.lineTo(x + l, y + t);
            break;

          case 'm': // moveTo, relative
            x += current[1];
            y += current[2];
            ctx.moveTo(x + l, y + t);
            break;

          case 'M': // moveTo, absolute
            x = current[1];
            y = current[2];
            ctx.moveTo(x + l, y + t);
            break;

          case 'c': // bezierCurveTo, relative
            tempX = x + current[5];
            tempY = y + current[6];
            controlX = x + current[3];
            controlY = y + current[4];
            ctx.bezierCurveTo(
              x + current[1] + l, // x1
              y + current[2] + t, // y1
              controlX + l, // x2
              controlY + t, // y2
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;

          case 'C': // bezierCurveTo, absolute
            x = current[5];
            y = current[6];
            controlX = current[3];
            controlY = current[4];
            ctx.bezierCurveTo(
              current[1] + l,
              current[2] + t,
              controlX + l,
              controlY + t,
              x + l,
              y + t
            );
            break;

          case 's': // shorthand cubic bezierCurveTo, relative
            tempX = x + current[3];
            tempY = y + current[4];
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
            ctx.bezierCurveTo(
              controlX + l,
              controlY + t,
              x + current[1] + l,
              y + current[2] + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;

          case 'S': // shorthand cubic bezierCurveTo, absolute
            tempX = current[3];
            tempY = current[4];
            controlX = 2*x - controlX;
            controlY = 2*y - controlY;
            ctx.bezierCurveTo(
              controlX + l,
              controlY + t,
              current[1] + l,
              current[2] + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;

          case 'q': // quadraticCurveTo, relative
            x += current[3];
            y += current[4];
            ctx.quadraticCurveTo(
              current[1] + l,
              current[2] + t,
              x + l,
              y + t
            );
            break;

          case 'Q': // quadraticCurveTo, absolute
            x = current[3];
            y = current[4];
            controlX = current[1];
            controlY = current[2];
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              x + l,
              y + t
            );
            break;

          case 'T':
            tempX = x;
            tempY = y;
            x = current[1];
            y = current[2];
            controlX = -controlX + 2 * tempX;
            controlY = -controlY + 2 * tempY;
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              x + l,
              y + t
            );
            break;

          case 'a':
            break;

          case 'A':
            break;

          case 'z':
          case 'Z':
            ctx.closePath();
            break;
        }
      }
    },

    render: function(ctx, noTransform) {
      ctx.save();
      var m = this.transformMatrix;
      if (m) {
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }
      if (!noTransform) {
        this.transform(ctx);
      }

      if (this.overlayFill) {
        ctx.fillStyle = this.overlayFill;
      }
      else if (this.fill) {
        ctx.fillStyle = this.fill;
      }

      if (this.stroke) {
        ctx.strokeStyle = this.stroke;
      }
      ctx.beginPath();

      this._render(ctx);

      if (this.fill) {
        ctx.fill();
      }
      if (this.options.stroke) {
        ctx.strokeStyle = this.options.stroke;
        ctx.lineWidth = this.options.strokeWidth;
        ctx.stroke();
      }
      if (!noTransform && this.active) {
        this.drawBorders(ctx);
        this.hideCorners || this.drawCorners(ctx);
      }
      ctx.restore();
    },

    /**
     * Returns string representation of an instance
     * @method toString
     * @return {String} string representation of an instance
     */
    toString: function() {
      return '#<fabric.Path ('+ this.complexity() +'): ' +
        JSON.stringify({ top: this.top, left: this.left }) +'>';
    },

    /**
     * @method toObject
     * @return {Object}
     */
    toObject: function() {
      var o = extend(this.callSuper('toObject'), {
        path: this.path
      });
      if (this.sourcePath) {
        o.sourcePath = this.sourcePath;
      }
      if (this.transformMatrix) {
        o.transformMatrix = this.transformMatrix;
      }
      return o;
    },

    /**
     * @method toDatalessObject
     * @return {Object}
     */
    toDatalessObject: function() {
      var o = this.toObject();
      if (this.sourcePath) {
        o.path = this.sourcePath;
      }
      delete o.sourcePath;
      return o;
    },

    complexity: function() {
      return this.path.length;
    },

    set: function(prop, value) {
      return this.callSuper('set', prop, value);
    },

    _parsePath: function() {

      var result = [],
          currentPath,
          chunks;

      for (var i = 0, len = this.path.length; i < len; i++) {
        currentPath = this.path[i];
        chunks = currentPath.slice(1).trim().replace(/(\d)-/g, '$1###-').split(/\s|,|###/);
        result.push([currentPath.charAt(0)].concat(chunks.map(parseFloat)));
      }
      return result;
    },

    _parseDimensions: function() {
      var aX = [],
          aY = [],
          previousX,
          previousY,
          isLowerCase = false,
          x,
          y;
      function getX(item) {
        if (item[0] === 'H') {
          return item[1];
        }
        return item[item.length - 2];
      }
      function getY(item) {
        if (item[0] === 'V') {
          return item[1];
        }
        return item[item.length - 1];
      }
      this.path.forEach(function(item, i) {
        if (item[0] !== 'H') {
          previousX = (i === 0) ? getX(item) : getX(this.path[i-1]);
        }
        if (item[0] !== 'V') {
          previousY = (i === 0) ? getY(item) : getY(this.path[i-1]);
        }

        if (item[0] === item[0].toLowerCase()) {
          isLowerCase = true;
        }



        x = isLowerCase
          ? previousX + getX(item)
          : item[0] === 'V'
            ? previousX
            : getX(item);

        y = isLowerCase
          ? previousY + getY(item)
          : item[0] === 'H'
            ? previousY
            : getY(item);

        var val = parseInt(x, 10);
        if (!isNaN(val)) aX.push(val);

        val = parseInt(y, 10);
        if (!isNaN(val)) aY.push(val);

      }, this);

      var minX = min(aX),
          minY = min(aY),
          deltaX = deltaY = 0;

      var o = {
        top: minY - deltaY,
        left: minX - deltaX,
        bottom: max(aY) - deltaY,
        right: max(aX) - deltaX
      };

      o.width = o.right - o.left;
      o.height = o.bottom - o.top;

      return o;
    }
  });

  /**
   * Creates an instance of fabric.Path from an object
   * @static
   * @method fabric.Path.fromObject
   * @return {fabric.Path} Instance of fabric.Path
   */
  fabric.Path.fromObject = function(object) {
    return new fabric.Path(object.path, object);
  };

  var ATTRIBUTE_NAMES = fabric.Path.ATTRIBUTE_NAMES = 'd fill fill-opacity fill-rule stroke stroke-width transform'.split(' ');
  /**
   * Creates an instance of fabric.Path from an SVG <PATH> element
   * @static
   * @method fabric.Path.fromElement
   * @param {SVGElement} element to parse
   * @param {Object} options object
   * @return {fabric.Path} Instance of fabric.Path
   */
  fabric.Path.fromElement = function(element, options) {
    var parsedAttributes = fabric.parseAttributes(element, ATTRIBUTE_NAMES),
        path = parsedAttributes.d;
    delete parsedAttributes.d;
    return new fabric.Path(path, extend(parsedAttributes, options));
  }
})();

(function(){

  var fabric = this.fabric || (this.fabric = { }),
      extend = fabric.util.object.extend,
      invoke = fabric.util.array.invoke,
      parentSet = fabric.Object.prototype.set,
      parentToObject = fabric.Object.prototype.toObject,
      camelize = fabric.util.string.camelize,
      capitalize = fabric.util.string.capitalize;

  if (fabric.PathGroup) {
    console.warn('fabric.PathGroup is already defined');
    return;
  }

  fabric.PathGroup = fabric.util.createClass(fabric.Path, {

    type: 'path-group',
    forceFillOverwrite: false,

    initialize: function(paths, options) {

      options = options || { };

      this.originalState = { };
      this.paths = paths;

      this.setOptions(options);
      this.initProperties();

      this.setCoords();

      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },

    initProperties: function() {
      this.stateProperties.forEach(function(prop) {
        if (prop === 'fill') {
          this.set(prop, this.options[prop]);
        }
        else if (prop === 'angle') {
          this.setAngle(this.options[prop]);
        }
        else {
          this[prop] = this.options[prop];
        }
      }, this);
    },

    render: function(ctx) {
      if (this.stub) {
        ctx.save();

        this.transform(ctx);
        this.stub.render(ctx, false /* no transform */);
        if (this.active) {
          this.drawBorders(ctx);
          this.drawCorners(ctx);
        }
        ctx.restore();
      }
      else {
        ctx.save();

        var m = this.transformMatrix;
        if (m) {
          ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }

        this.transform(ctx);
        for (var i = 0, l = this.paths.length; i < l; ++i) {
          this.paths[i].render(ctx, true);
        }
        if (this.active) {
          this.drawBorders(ctx);
          this.hideCorners || this.drawCorners(ctx);
        }
        ctx.restore();
      }
    },

    /**
     * @method set
     * @param {String} prop
     * @param {Any} value
     * @return {fabric.PathGroup} thisArg
     */
    set: function(prop, value) {
      if ((prop === 'fill' || prop === 'overlayFill') && this.isSameColor()) {
        this[prop] = value;
        var i = this.paths.length;
        while (i--) {
          this.paths[i].set(prop, value);
        }
      }
      else {
        parentSet.call(this, prop, value);
      }
      return this;
    },

    /**
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return extend(toObject.call(this), {
        paths: invoke(this.getObjects(), 'clone'),
        sourcePath: this.sourcePath
      });
    },

    /**
     * @method toDatalessObject
     * @return {Object} dataless object representation of an instance
     */
    toDatalessObject: function() {
      var o = this.toObject();
      if (this.sourcePath) {
        o.paths = this.sourcePath;
      }
      return o;
    },

     /**
      * Returns a string representation of an object
      * @method toString
      * @return {String} string representation of an object
      */
    toString: function() {
      return '#<fabric.PathGroup (' + this.complexity() +
        '): { top: ' + this.top + ', left: ' + this.left + ' }>';
    },

    /**
     * @method isSameColor
     * @return {Boolean} true if all paths are of the same color (`fill`)
     */
    isSameColor: function() {
      var firstPathFill = this.getObjects()[0].get('fill');
      return this.getObjects().every(function(path) {
        return path.get('fill') === firstPathFill;
      });
    },

    /**
      * Returns number representation of object's complexity
      * @method complexity
      * @return {Number} complexity
      */
    complexity: function() {
      return this.paths.reduce(function(total, path) {
        return total + ((path && path.complexity) ? path.complexity() : 0);
      }, 0);
    },

    /**
      * Makes path group grayscale
      * @method toGrayscale
      * @return {fabric.PathGroup} thisArg
      */
    toGrayscale: function() {
      var i = this.paths.length;
      while (i--) {
        this.paths[i].toGrayscale();
      }
      return this;
    },

    /**
     * @method getObjects
     * @return {Array} array of path objects included in this path group
     */
    getObjects: function() {
      return this.paths;
    }
  });

  /**
   * @private
   * @method instantiatePaths
   */
  function instantiatePaths(paths) {
    for (var i = 0, len = paths.length; i < len; i++) {
      if (!(paths[i] instanceof fabric.Object)) {
        var klassName = capitalize(camelize(paths[i].type));
        paths[i] = fabric[klassName].fromObject(paths[i]);
      }
    }
    return paths;
  }

  /**
   * @static
   * @method fabric.PathGroup.fromObject
   * @param {Object} object
   * @return {fabric.PathGroup}
   */
  fabric.PathGroup.fromObject = function(object) {
    var paths = instantiatePaths(object.paths);
    return new fabric.PathGroup(paths, object);
  }
})();


(function(){

  var fabric = this.fabric || (this.fabric = { }),
      extend = fabric.util.object.extend,
      min = fabric.util.array.min,
      max = fabric.util.array.max,
      invoke = fabric.util.array.invoke,
      removeFromArray = fabric.util.removeFromArray;

  if (fabric.Group) {
    return;
  }

  fabric.Group = fabric.util.createClass(fabric.Object, {

    /**
     * @property type
     */
    type: 'group',

    /**
     * @constructor
     * @param {Object} objects Group objects
     * @return {Object} thisArg
     */
    initialize: function(objects, options) {
      this.objects = objects || [];
      this.originalState = { };

      this.callSuper('initialize');

      this._calcBounds();
      this._updateObjectsCoords();

      if (options) {
        extend(this, options);
      }
      this._setOpacityIfSame();

      this.setCoords(true);
      this.saveCoords();

      this.activateAllObjects();
    },

    /**
     * @private
     * @method _updateObjectsCoords
     */
    _updateObjectsCoords: function() {
      var groupDeltaX = this.left,
          groupDeltaY = this.top;

      this.forEachObject(function(object) {

        var objectLeft = object.get('left'),
            objectTop = object.get('top');

        object.set('originalLeft', objectLeft);
        object.set('originalTop', objectTop);

        object.set('left', objectLeft - groupDeltaX);
        object.set('top', objectTop - groupDeltaY);

        object.setCoords();

        object.hideCorners = true;
      }, this);
    },

    /**
     * @method toString
     * @return {String}
     */
    toString: function() {
      return '#<fabric.Group: (' + this.complexity() + ')>';
    },

    /**
     * @method getObjects
     * @return {Array} group objects
     */
    getObjects: function() {
      return this.objects;
    },

    /**
     * Adds an object to a group. Recalculates group's dimension, position.
     * @method add
     * @param {Object} object
     * @return {Object} thisArg
     * @chainable
     */
    add: function(object) {
      this._restoreObjectsState();
      this.objects.push(object);
      object.setActive(true);
      this._calcBounds();
      this._updateObjectsCoords();
      return this;
    },

    /**
     * Removes an object from a group. Recalculates group's dimension, position.
     * @param {Object} object
     * @return {Object} thisArg
     * @chainable
     */
    remove: function(object) {
      this._restoreObjectsState();
      removeFromArray(this.objects, object);
      object.setActive(false);
      this._calcBounds();
      this._updateObjectsCoords();
      return this;
    },

    /**
     * Returns a size of a group (i.e. length of an array containing its objects)
     * @return {Number} Group size
     */
    size: function() {
      return this.getObjects().length;
    },

    /**
     * Sets property to a given value
     * @method set
     * @param {String} name
     * @param {Object | Function} value
     * @return {Object} thisArg
     * @chainable
     */
    set: function(name, value) {
      if (typeof value == 'function') {
        this.set(name, value(this[name]));
      }
      else {
        if (name === 'fill' || name === 'opacity') {
          var i = this.objects.length;
          this[name] = value;
          while (i--) {
            this.objects[i].set(name, value);
          }
        }
        else {
          this[name] = value;
        }
      }
      return this;
    },

    /**
     * Returns true if a group contains an object
     * @method contains
     * @param {Object} object Object to check against
     * @return {Boolean} true if group contains an object
     */
    contains: function(object) {
      return this.objects.indexOf(object) > -1;
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        objects: invoke(this.objects, 'clone')
      });
    },

    /**
     * Renders instance on a given context
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render instance on
     */
    render: function(ctx) {
      ctx.save();
      this.transform(ctx);

      var groupScaleFactor = Math.max(this.scaleX, this.scaleY);

      for (var i = 0, len = this.objects.length; i < len; i++) {
        var originalScaleFactor = this.objects[i].borderScaleFactor;
        this.objects[i].borderScaleFactor = groupScaleFactor;
        this.objects[i].render(ctx);
        this.objects[i].borderScaleFactor = originalScaleFactor;
      }
      this.hideBorders || this.drawBorders(ctx);
      this.hideCorners || this.drawCorners(ctx);
      ctx.restore();
      this.setCoords();
    },

    /**
     * @method item
     * @param index {Number} index of item to get
     * @return {fabric.Object}
     */
    item: function(index) {
      return this.getObjects()[index];
    },

    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return this.getObjects().reduce(function(total, object) {
        total += (typeof object.complexity == 'function') ? object.complexity() : 0;
        return total;
      }, 0);
    },

    /**
     * Retores original state of each of group objects
     * @private
     * @method _restoreObjectsState
     * @return {fabric.Group} thisArg
     * @chainable
     */
    _restoreObjectsState: function() {
      this.objects.forEach(this._restoreObjectState, this);
      return this;
    },

    /**
     * @private
     * @method _restoreObjectState
     * @param {fabric.Object} object
     */
    _restoreObjectState: function(object) {

      var groupLeft = this.get('left'),
          groupTop = this.get('top'),
          groupAngle = this.getAngle() * (Math.PI / 180),
          objectLeft = object.get('originalLeft'),
          objectTop = object.get('originalTop'),
          rotatedTop = Math.cos(groupAngle) * object.get('top') + Math.sin(groupAngle) * object.get('left'),
          rotatedLeft = -Math.sin(groupAngle) * object.get('top') + Math.cos(groupAngle) * object.get('left');

      object.setAngle(object.getAngle() + this.getAngle());

      object.set('left', groupLeft + rotatedLeft * this.get('scaleX'));
      object.set('top', groupTop + rotatedTop * this.get('scaleY'));

      object.set('scaleX', object.get('scaleX') * this.get('scaleX'));
      object.set('scaleY', object.get('scaleY') * this.get('scaleY'));

      object.setCoords();
      object.hideCorners = false;
      object.setActive(false);
      object.setCoords();

      return this;
    },

    /**
     * @method destroy
     * @return {fabric.Group} thisArg
     * @chainable
     */
    destroy: function() {
      return this._restoreObjectsState();
    },

    /**
     * @saveCoords
     * @return {fabric.Group} thisArg
     * @chainable
     */
    saveCoords: function() {
      this._originalLeft = this.get('left');
      this._originalTop = this.get('top');
      return this;
    },

    hasMoved: function() {
      return this._originalLeft !== this.get('left') ||
             this._originalTop !== this.get('top');
    },

    /**
     * Sets coordinates of all group objects
     * @method setObjectsCoords
     * @return {fabric.Group} thisArg
     * @chainable
     */
    setObjectsCoords: function() {
      this.forEachObject(function(object) {
        object.setCoords();
      });
      return this;
    },

    /**
     * Activates (makes active) all group objects
     * @method activateAllObjects
     * @return {fabric.Group} thisArg
     * @chainable
     */
    activateAllObjects: function() {
      return this.setActive(true);
    },

    /**
     * @method setActive
     * @param {Boolean} value `true` to activate object, `false` otherwise
     * @return {fabric.Group} thisArg
     * @chainable
     */
    setActive: function(value) {
      this.forEachObject(function(object) {
        object.setActive(value);
      });
      return this;
    },

    /**
     * @method forEachObject
     * @param {Function} callback
     *                   Callback invoked with current object as first argument,
     *                   index - as second and an array of all objects - as third.
     *                   Iteration happens in reverse order (for performance reasons).
     *                   Callback is invoked in a context of Global Object (e.g. `window`)
     *                   when no `context` argument is given
     *
     * @param {Object} context a.k.a. thisObject
     *
     * @return {fabric.Group}
     * @chainable
     */
    forEachObject: function(callback, context) {
      var objects = this.getObjects(),
          i = objects.length;
      while (i--) {
        callback.call(context, objects[i], i, objects);
      }
      return this;
    },

    /**
     * @private
     * @method _setOpacityIfSame
     */
    _setOpacityIfSame: function() {
      var objects = this.getObjects(),
          firstValue = objects[0] ? objects[0].get('opacity') : 1;

      var isSameOpacity = objects.every(function(o) {
        return o.get('opacity') === firstValue;
      });

      if (isSameOpacity) {
        this.opacity = firstValue;
      }
    },

    /**
     * @private
     * @method _calcBounds
     */
    _calcBounds: function() {
      var aX = [],
          aY = [],
          minX, minY, maxX, maxY, o, width, height,
          i = 0,
          len = this.objects.length;

      for (; i < len; ++i) {
        o = this.objects[i];
        o.setCoords();
        for (var prop in o.oCoords) {
          aX.push(o.oCoords[prop].x);
          aY.push(o.oCoords[prop].y);
        }
      };

      minX = min(aX);
      maxX = max(aX);
      minY = min(aY);
      maxY = max(aY);

      width = maxX - minX;
      height = maxY - minY;

      this.width = width;
      this.height = height;

      this.left = minX + width / 2;
      this.top = minY + height / 2;
    },

    /**
     * @method containsPoint
     * @param {Object} point point with `x` and `y` properties
     * @return {Boolean} true if point is contained within group
     */
    containsPoint: function(point) {

      var halfWidth = this.get('width') / 2,
          halfHeight = this.get('height') / 2,
          centerX = this.get('left'),
          centerY = this.get('top');

      return  centerX - halfWidth < point.x &&
              centerX + halfWidth > point.x &&
              centerY - halfHeight < point.y &&
              centerY + halfHeight > point.y;
    },

    toGrayscale: function() {
      var i = this.objects.length;
      while (i--) {
        this.objects[i].toGrayscale();
      }
    }
  });

  /**
   * @static
   * @method fabric.Group.fromObject
   * @param object {Object} object to create a group from
   * @param options {Object} options object
   * @return {fabric.Group} an instance of fabric.Group
   */
  fabric.Group.fromObject = function(object) {
    return new fabric.Group(object.objects, object);
  }
})();


(function(){

  var fabric = this.fabric || (this.fabric = { }),
      extend = fabric.util.object.extend,
      clone = fabric.util.object.clone;

  if (fabric.Text) {
    console.warn('fabric.Text is already defined');
    return;
  }
  if (!fabric.Object) {
    console.warn('fabric.Text requires fabric.Object');
    return;
  }

  fabric.Text = fabric.util.createClass(fabric.Object, {

    options: {
      top:         10,
      left:        10,
      fontsize:    20,
      fontweight:  100,
      fontfamily:  'Modernist_One_400',
      path:        null
    },

    type: 'text',

    initialize: function(text, options) {
      this.originalState = { };
      this.initStateProperties();
      this.text = text;
      this.setOptions(options);
      extend(this, this.options);
      this.theta = this.angle * (Math.PI/180);
      this.width = this.getWidth();
      this.setCoords();
    },

    initStateProperties: function() {
      var o;
      if ((o = this.constructor) &&
          (o = o.superclass) &&
          (o = o.prototype) &&
          (o = o.stateProperties) &&
          o.clone) {
        this.stateProperties = o.clone();
        this.stateProperties.push('fontfamily', 'fontweight', 'path');
      }
    },

    toString: function() {
      return '#<fabric.Text ('+ this.complexity() +'): ' +
        JSON.stringify({ text: this.text, fontfamily: this.fontfamily }) + '>';
    },

    _render: function(context) {
      var o = Cufon.textOptions || (Cufon.textOptions = { });

      o.left = this.left;
      o.top = this.top;
      o.context = context;
      o.color = this.fill;

      var el = this._initDummyElement();

      this.transform(context);

      Cufon.replaceElement(el, {
        separate: 'none',
        fontFamily: this.fontfamily
      });

      this.width = o.width;
      this.height = o.height;
    },

    _initDummyElement: function() {
      var el = document.createElement('div');
      el.innerHTML = this.text;

      el.style.fontSize = '40px';
      el.style.fontWeight = '400';
      el.style.fontStyle = 'normal';
      el.style.letterSpacing = 'normal';
      el.style.color = '#000000';
      el.style.fontWeight = '600';
      el.style.fontFamily = 'Verdana';

      return el;
    },

    render: function(context) {
      context.save();
      this._render(context);
      if (this.active) {
        this.drawBorders(context);
        this.drawCorners(context);
      }
      context.restore();
    },

  	/**
  	 * @method toObject
  	 * @return {Object} object representation of an instance
  	 */
  	toObject: function() {
  	  return extend(this.callSuper('toObject'), {
  	    text:         this.text,
  	    fontsize:     this.fontsize,
  	    fontweight:   this.fontweight,
  	    fontfamily:   this.fontfamily,
  	    path:         this.path
  	  });
  	},

  	/**
  	 * @method setColor
  	 * @param {String} value
  	 * @return {fabric.Text} thisArg
  	 * @chainable
  	 */
  	setColor: function(value) {
  	  this.set('fill', value);
  	  return this;
  	},

  	/**
  	 * @method setFontsize
  	 * @param {Number} value
  	 * @return {fabric.Text} thisArg
  	 * @chainable
  	 */
  	setFontsize: function(value) {
  	  this.set('fontsize', value);
  	  this.setCoords();
  	  return this;
  	},

  	/**
  	 * @method getText
  	 * @return {String}
  	 */
  	getText: function() {
  	  return this.text;
  	},

  	/**
  	 * @method setText
  	 * @param {String} value
  	 * @return {fabric.Text} thisArg
  	 */
  	setText: function(value) {
  	  this.set('text', value);
  	  this.setCoords();
  	  return this;
  	},

  	set: function(name, value) {
  	  this[name] = value;
  	  if (name === 'fontfamily') {
  	    this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, '$1' + value + '$3');
  	  }
  	  return this;
  	}
  });

	/**
   * @static
   * @method fromObject
   * @param {Object} object to create an instance from
   * @return {fabric.Text} an instance
   */
	fabric.Text.fromObject = function(object) {
	  return new fabric.Text(object.text, clone(object));
	};

	/**
   * @static
   * @method fabric.Text.fromElement
   * @return {fabric.Text} an instance
   */
	fabric.Text.fromElement = function(element) {
	};
})();


(function() {

  var global = this,
      extend = fabric.util.object.extend;

  if (!global.fabric) {
    global.fabric = { };
  }

  if (global.fabric.Image) {
    console.warn('fabric.Image is already defined.');
    return;
  };

  if (!fabric.Object) {
    console.warn('fabric.Object is required for fabric.Image initialization');
    return;
  }


  fabric.Image = fabric.util.createClass(fabric.Object, {

    maxwidth: null,
    maxheight: null,
    active: false,

    bordervisibility: false,
    cornervisibility: false,

    type: 'image',

    __isGrayscaled: false,

    /**
     * @constructor
     * @param {HTMLImageElement | String} element Image element
     * @param {Object} options optional
     */
    initialize: function(element, options) {
      this.callSuper('initialize', options);
      this._initElement(element);
      this._initConfig(options || { });
    },

    /**
     * @method getElement
     * @return {HTMLImageElement} image element
     */
    getElement: function() {
      return this._element;
    },

    /**
     * @method setElement
     * @return {fabric.Image} thisArg
     */
    setElement: function(element) {
      this._element = element;
      return this;
    },

    /**
     * Method that resizes an image depending on whether maxwidth and maxheight are set up.
     * Width and height have to mantain the same proportion in the final image as it was in the initial one.
     * @method getNormalizedSize
     * @param {Object} oImg
     * @param {Number} maxwidth maximum width of the image in px
     * @param {Number} maxheight maximum height of the image in px
     */
    getNormalizedSize: function(oImg, maxwidth, maxheight) {
      if (maxheight && maxwidth && (oImg.width > oImg.height && (oImg.width / oImg.height) < (maxwidth / maxheight))) {
        normalizedWidth = Math.floor((oImg.width * maxheight) / oImg.height);
        normalizedHeight = maxheight;
      }
      else if (maxheight && ((oImg.height == oImg.width) || (oImg.height > oImg.width) || (oImg.height > maxheight))) {
        normalizedWidth = Math.floor((oImg.width * maxheight) / oImg.height);
        normalizedHeight = maxheight;
      }
      else if (maxwidth && (maxwidth < oImg.width)){
        normalizedHeight = Math.floor((oImg.height * maxwidth) / oImg.width);
        normalizedWidth = maxwidth;
      }
      else {
        normalizedWidth = oImg.width;
        normalizedHeight = oImg.height;
      }

      return {
        width: normalizedWidth,
        height: normalizedHeight
      }
    },

    /**
     * @method getOriginalSize
     * @return {Object} object with "width" and "height" properties
     */
    getOriginalSize: function() {
      var element = this.getElement();
      return {
        width: element.width,
        height: element.height
      };
    },

    /**
     * @method setBorderVisibility
     * @param showBorder {Boolean} when true, border is being set visible
     */
    setBorderVisibility: function(showBorder) {
      this._resetWidthHeight();
      this._adjustWidthHeightToBorders(showBorder);
      this.setCoords();
    },

    /**
     * @method setCornersVisibility
     */
    setCornersVisibility: function(visible) {
      this.cornervisibility = !!visible;
    },

    /**
     * @method render
     */
    render: function(ctx, noTransform) {
      ctx.save();
      if (!noTransform) {
        this.transform(ctx);
      }
      this._render(ctx);
      if (this.active && !noTransform) {
        this.drawBorders(ctx);
        this.hideCorners || this.drawCorners(ctx);
      }
      ctx.restore();
    },

    /**
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        src: this.getSrc()
      });
    },

    /**
     * @method getSrc
     * @return {String} source of an image
     */
    getSrc: function() {
      return this.getElement().src;
    },

    /**
     * @method toString
     * @return {String} string representation of an instance
     */
    toString: function() {
      return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
    },

    /**
     * @mthod clone
     * @param {Function} callback
     */
    clone: function(callback) {
      this.constructor.fromObject(this.toObject(), callback);
    },

    /**
     * @mthod toGrayscale
     * @param {Function} callback
     */
    toGrayscale: function(callback) {

      if (this.__isGrayscaled) {
        return;
      }

      var imgEl = this.getElement(),
          canvasEl = document.createElement('canvas'),
          replacement = document.createElement('img'),
          _this = this;

      canvasEl.width = imgEl.width;
      canvasEl.height = imgEl.height;

      canvasEl.getContext('2d').drawImage(imgEl, 0, 0);
      fabric.Element.toGrayscale(canvasEl);

      replacement.onload = function() {
        _this.setElement(replacement);
        callback && callback();
        replacement.onload = canvasEl = imgEl = imageData = null;
      };
      replacement.width = imgEl.width;
      replacement.height = imgEl.height;

      replacement.src = canvasEl.toDataURL('image/png');

      this.__isGrayscaled = true;

      return this;
    },

    /**
     * @private
     */
    _render: function(ctx) {
      var originalImgSize = this.getOriginalSize();
      ctx.drawImage(
        this.getElement(),
        - originalImgSize.width / 2,
        - originalImgSize.height / 2,
        originalImgSize.width,
        originalImgSize.height
      );
    },

    /**
     * @private
     */
    _adjustWidthHeightToBorders: function(showBorder) {
      if (showBorder) {
        this.currentBorder = this.borderwidth;
        this.width += (2 * this.currentBorder);
        this.height += (2 * this.currentBorder);
      }
      else {
        this.currentBorder = 0;
      }
    },

    /**
     * @private
     */
    _resetWidthHeight: function() {
      var element = this.getElement();

      this.set('width', element.width);
      this.set('height', element.height);
    },

    /**
     * The Image class's initialization method. This method is automatically
     * called by the constructor.
     * @method _initElement
     * @param {HTMLImageElement|String} el The element representing the image
     */
    _initElement: function(element) {
      this.setElement(fabric.util.getById(element));
      fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
    },

    /**
     * @method _initConfig
     * @param {Object} options Options object
     */
    _initConfig: function(options) {
      this.setOptions(options);
      this._setBorder();
      this._setWidthHeight(options);
    },

    /**
     * @private
     */
    _setBorder: function() {
      if (this.bordervisibility) {
        this.currentBorder = this.borderwidth;
      }
      else {
        this.currentBorder = 0;
      }
    },

    /**
     * @private
     */
    _setWidthHeight: function(options) {
      var sidesBorderWidth = 2 * this.currentBorder;
      this.width = (this.getElement().width || 0) + sidesBorderWidth;
      this.height = (this.getElement().height || 0) + sidesBorderWidth;
    }
  });

  /**
   * Constant for the default CSS class name that represents a Canvas
   * @property fabric.Image.CSS_CANVAS
   * @static
   * @final
   * @type String
   */
  fabric.Image.CSS_CANVAS = "canvas-img";

  /**
   * Creates an instance of fabric.Image from its object representation
   * @method fromObject
   * @param object {Object}
   * @param callback {Function} optional
   * @static
   */
  fabric.Image.fromObject = function(object, callback) {
    var img = document.createElement('img'),
        src = object.src;

    if (object.width) {
      img.width = object.width;
    }
    if (object.height) {
      img.height = object.height;
    }
    img.onload = function() {
      if (callback) {
        callback(new fabric.Image(img, object));
      }
      img = img.onload = null;
    };
    img.src = src;
  };

  /**
   * Creates an instance of fabric.Image from an URL string
   * @method fromURL
   * @param url {String}
   * @param callback {Function} optional
   * @param imgOptions {Object} optional
   * @static
   */
  fabric.Image.fromURL = function(url, callback, imgOptions) {
    var img = document.createElement('img');
    img.onload = function() {
      if (callback) {
        callback(new fabric.Image(img, imgOptions));
      }
      img = img.onload = null;
    };
    img.src = url;
  };
})();
