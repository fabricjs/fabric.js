/* build: `node build.js modules=All minifier=yui` */
/*! Fabric.js Copyright 2008-2014, Printio (Juriy Zaytsev, Maxim Chernyak) */

var fabric = fabric || { version: "1.4.11" };
if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  fabric.document = document;
  fabric.window = window;
}
else {
  // assume we're running under node.js when document/window are not present
  fabric.document = require("jsdom")
    .jsdom("<!DOCTYPE html><html><head></head><body></body></html>");

  fabric.window = fabric.document.createWindow();
}

/**
 * True when in environment that supports touch events
 * @type boolean
 */
fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement;

/**
 * True when in environment that's probably Node.js
 * @type boolean
 */
fabric.isLikelyNode = typeof Buffer !== 'undefined' &&
                      typeof window === 'undefined';


/**
 * Attributes parsed from all SVG elements
 * @type array
 */
fabric.SHARED_ATTRIBUTES = [
  "display",
  "transform",
  "fill", "fill-opacity", "fill-rule",
  "opacity",
  "stroke", "stroke-dasharray", "stroke-linecap",
  "stroke-linejoin", "stroke-miterlimit",
  "stroke-opacity", "stroke-width"
];

/**
 * Pixel per Inch as a default value set to 96. Can be changed for more realistic conversion.
 */
fabric.DPI = 96;


(function(){

  /**
   * @private
   * @param {String} eventName
   * @param {Function} handler
   */
  function _removeEventListener(eventName, handler) {
    if (!this.__eventListeners[eventName]) {
      return;
    }

    if (handler) {
      fabric.util.removeFromArray(this.__eventListeners[eventName], handler);
    }
    else {
      this.__eventListeners[eventName].length = 0;
    }
  }

  /**
   * Observes specified event
   * @deprecated `observe` deprecated since 0.8.34 (use `on` instead)
   * @memberOf fabric.Observable
   * @alias on
   * @param {String|Object} eventName Event name (eg. 'after:render') or object with key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Self} thisArg
   * @chainable
   */
  function observe(eventName, handler) {
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
    return this;
  }

  /**
   * Stops event observing for a particular event handler. Calling this method
   * without arguments removes all handlers for all events
   * @deprecated `stopObserving` deprecated since 0.8.34 (use `off` instead)
   * @memberOf fabric.Observable
   * @alias off
   * @param {String|Object} eventName Event name (eg. 'after:render') or object with key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function to be deleted from EventListeners
   * @return {Self} thisArg
   * @chainable
   */
  function stopObserving(eventName, handler) {
    if (!this.__eventListeners) {
      return;
    }

    // remove all key/value pairs (event name -> event handler)
    if (arguments.length === 0) {
      this.__eventListeners = { };
    }
    // one object with key/value pairs was passed
    else if (arguments.length === 1 && typeof arguments[0] === 'object') {
      for (var prop in eventName) {
        _removeEventListener.call(this, prop, eventName[prop]);
      }
    }
    else {
      _removeEventListener.call(this, eventName, handler);
    }
    return this;
  }

  /**
   * Fires event with an optional options object
   * @deprecated `fire` deprecated since 1.0.7 (use `trigger` instead)
   * @memberOf fabric.Observable
   * @alias trigger
   * @param {String} eventName Event name to fire
   * @param {Object} [options] Options object
   * @return {Self} thisArg
   * @chainable
   */
  function fire(eventName, options) {
    if (!this.__eventListeners) {
      return;
    }

    var listenersForEvent = this.__eventListeners[eventName];
    if (!listenersForEvent) {
      return;
    }

    for (var i = 0, len = listenersForEvent.length; i < len; i++) {
      // avoiding try/catch for perf. reasons
      listenersForEvent[i].call(this, options || { });
    }
    return this;
  }

  /**
   * @namespace fabric.Observable
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-2/#events}
   * @see {@link http://fabricjs.com/events/|Events demo}
   */
  fabric.Observable = {
    observe: observe,
    stopObserving: stopObserving,
    fire: fire,

    on: observe,
    off: stopObserving,
    trigger: fire
  };
})();


/**
 * @namespace fabric.Collection
 */
fabric.Collection = {

  /**
   * Adds objects to collection, then renders canvas (if `renderOnAddRemove` is not `false`)
   * Objects should be instances of (or inherit from) fabric.Object
   * @param {...fabric.Object} object Zero or more fabric instances
   * @return {Self} thisArg
   */
  add: function () {
    this._objects.push.apply(this._objects, arguments);
    for (var i = 0, length = arguments.length; i < length; i++) {
      this._onObjectAdded(arguments[i]);
    }
    this.renderOnAddRemove && this.renderAll();
    return this;
  },

  /**
   * Inserts an object into collection at specified index, then renders canvas (if `renderOnAddRemove` is not `false`)
   * An object should be an instance of (or inherit from) fabric.Object
   * @param {Object} object Object to insert
   * @param {Number} index Index to insert object at
   * @param {Boolean} nonSplicing When `true`, no splicing (shifting) of objects occurs
   * @return {Self} thisArg
   * @chainable
   */
  insertAt: function (object, index, nonSplicing) {
    var objects = this.getObjects();
    if (nonSplicing) {
      objects[index] = object;
    }
    else {
      objects.splice(index, 0, object);
    }
    this._onObjectAdded(object);
    this.renderOnAddRemove && this.renderAll();
    return this;
  },

  /**
   * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
   * @param {...fabric.Object} object Zero or more fabric instances
   * @return {Self} thisArg
   * @chainable
   */
  remove: function() {
    var objects = this.getObjects(),
        index;

    for (var i = 0, length = arguments.length; i < length; i++) {
      index = objects.indexOf(arguments[i]);

      // only call onObjectRemoved if an object was actually removed
      if (index !== -1) {
        objects.splice(index, 1);
        this._onObjectRemoved(arguments[i]);
      }
    }

    this.renderOnAddRemove && this.renderAll();
    return this;
  },

  /**
   * Executes given function for each object in this group
   * @param {Function} callback
   *                   Callback invoked with current object as first argument,
   *                   index - as second and an array of all objects - as third.
   *                   Iteration happens in reverse order (for performance reasons).
   *                   Callback is invoked in a context of Global Object (e.g. `window`)
   *                   when no `context` argument is given
   *
   * @param {Object} context Context (aka thisObject)
   * @return {Self} thisArg
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
   * Returns an array of children objects of this instance
   * Type parameter introduced in 1.3.10
   * @param {String} [type] When specified, only objects of this type are returned
   * @return {Array}
   */
  getObjects: function(type) {
    if (typeof type === 'undefined') {
      return this._objects;
    }
    return this._objects.filter(function(o) {
      return o.type === type;
    });
  },

  /**
   * Returns object at specified index
   * @param {Number} index
   * @return {Self} thisArg
   */
  item: function (index) {
    return this.getObjects()[index];
  },

  /**
   * Returns true if collection contains no objects
   * @return {Boolean} true if collection is empty
   */
  isEmpty: function () {
    return this.getObjects().length === 0;
  },

  /**
   * Returns a size of a collection (i.e: length of an array containing its objects)
   * @return {Number} Collection size
   */
  size: function() {
    return this.getObjects().length;
  },

  /**
   * Returns true if collection contains an object
   * @param {Object} object Object to check against
   * @return {Boolean} `true` if collection contains an object
   */
  contains: function(object) {
    return this.getObjects().indexOf(object) > -1;
  },

  /**
   * Returns number representation of a collection complexity
   * @return {Number} complexity
   */
  complexity: function () {
    return this.getObjects().reduce(function (memo, current) {
      memo += current.complexity ? current.complexity() : 0;
      return memo;
    }, 0);
  }
};


(function(global) {

  var sqrt = Math.sqrt,
      atan2 = Math.atan2,
      PiBy180 = Math.PI / 180;

  /**
   * @namespace fabric.util
   */
  fabric.util = {

    /**
     * Removes value from an array.
     * Presence of value (and its position in an array) is determined via `Array.prototype.indexOf`
     * @static
     * @memberOf fabric.util
     * @param {Array} array
     * @param {Any} value
     * @return {Array} original array
     */
    removeFromArray: function(array, value) {
      var idx = array.indexOf(value);
      if (idx !== -1) {
        array.splice(idx, 1);
      }
      return array;
    },

    /**
     * Returns random number between 2 specified ones.
     * @static
     * @memberOf fabric.util
     * @param {Number} min lower limit
     * @param {Number} max upper limit
     * @return {Number} random value (between min and max)
     */
    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Transforms degrees to radians.
     * @static
     * @memberOf fabric.util
     * @param {Number} degrees value in degrees
     * @return {Number} value in radians
     */
    degreesToRadians: function(degrees) {
      return degrees * PiBy180;
    },

    /**
     * Transforms radians to degrees.
     * @static
     * @memberOf fabric.util
     * @param {Number} radians value in radians
     * @return {Number} value in degrees
     */
    radiansToDegrees: function(radians) {
      return radians / PiBy180;
    },

    /**
     * Rotates `point` around `origin` with `radians`
     * @static
     * @memberOf fabric.util
     * @param {fabric.Point} point The point to rotate
     * @param {fabric.Point} origin The origin of the rotation
     * @param {Number} radians The radians of the angle for the rotation
     * @return {fabric.Point} The new rotated point
     */
    rotatePoint: function(point, origin, radians) {
      var sin = Math.sin(radians),
          cos = Math.cos(radians);

      point.subtractEquals(origin);

      var rx = point.x * cos - point.y * sin,
          ry = point.x * sin + point.y * cos;

      return new fabric.Point(rx, ry).addEquals(origin);
    },

    /**
     * Apply transform t to point p
     * @static
     * @memberOf fabric.util
     * @param  {fabric.Point} p The point to transform
     * @param  {Array} t The transform
     * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
     * @return {fabric.Point} The transformed point
     */
    transformPoint: function(p, t, ignoreOffset) {
      if (ignoreOffset) {
        return new fabric.Point(
          t[0] * p.x + t[1] * p.y,
          t[2] * p.x + t[3] * p.y
        );
      }
      return new fabric.Point(
        t[0] * p.x + t[1] * p.y + t[4],
        t[2] * p.x + t[3] * p.y + t[5]
      );
    },

    /**
     * Invert transformation t
     * @static
     * @memberOf fabric.util
     * @param {Array} t The transform
     * @return {Array} The inverted transform
     */
    invertTransform: function(t) {
      var r = t.slice(),
          a = 1 / (t[0] * t[3] - t[1] * t[2]);
      r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0];
      var o = fabric.util.transformPoint({ x: t[4], y: t[5] }, r);
      r[4] = -o.x;
      r[5] = -o.y;
      return r;
    },

    /**
     * A wrapper around Number#toFixed, which contrary to native method returns number, not string.
     * @static
     * @memberOf fabric.util
     * @param {Number|String} number number to operate on
     * @param {Number} fractionDigits number of fraction digits to "leave"
     * @return {Number}
     */
    toFixed: function(number, fractionDigits) {
      return parseFloat(Number(number).toFixed(fractionDigits));
    },

    /**
     * Converts from attribute value to pixel value if applicable.
     * Returns converted pixels or original value not converted.
     * @param {Number|String} value number to operate on
     * @return {Number|String}
     */
    parseUnit: function(value) {
      var unit = /\D{0,2}$/.exec(value),
          number = parseFloat(value);

      switch (unit[0]) {
        case 'mm':
          return number * fabric.DPI / 25.4;

        case 'cm':
          return number * fabric.DPI / 2.54;

        case 'in':
          return number * fabric.DPI;

        case 'pt':
          return number * fabric.DPI / 72; // or * 4 / 3

        case 'pc':
          return number * fabric.DPI / 72 * 12; // or * 16

        default:
          return number;
      }
    },

    /**
     * Function which always returns `false`.
     * @static
     * @memberOf fabric.util
     * @return {Boolean}
     */
    falseFunction: function() {
      return false;
    },

    /**
      * Returns klass "Class" object of given namespace
      * @memberOf fabric.util
      * @param {String} type Type of object (eg. 'circle')
      * @param {String} namespace Namespace to get klass "Class" object from
      * @return {Object} klass "Class"
      */
    getKlass: function(type, namespace) {
      // capitalize first letter only
      type = fabric.util.string.camelize(type.charAt(0).toUpperCase() + type.slice(1));
      return fabric.util.resolveNamespace(namespace)[type];
    },

    /**
     * Returns object of given namespace
     * @memberOf fabric.util
     * @param {String} namespace Namespace string e.g. 'fabric.Image.filter' or 'fabric'
     * @return {Object} Object for given namespace (default fabric)
     */
    resolveNamespace: function(namespace) {
      if (!namespace) {
        return fabric;
      }

      var parts = namespace.split('.'),
          len = parts.length,
          obj = global || fabric.window;

      for (var i = 0; i < len; ++i) {
        obj = obj[parts[i]];
      }

      return obj;
    },

    /**
     * Loads image element from given url and passes it to a callback
     * @memberOf fabric.util
     * @param {String} url URL representing an image
     * @param {Function} callback Callback; invoked with loaded image
     * @param {Any} [context] Context to invoke callback in
     * @param {Object} [crossOrigin] crossOrigin value to set image element to
     */
    loadImage: function(url, callback, context, crossOrigin) {
      if (!url) {
        callback && callback.call(context, url);
        return;
      }

      var img = fabric.util.createImage();

      /** @ignore */
      img.onload = function () {
        callback && callback.call(context, img);
        img = img.onload = img.onerror = null;
      };

      /** @ignore */
      img.onerror = function() {
        fabric.log('Error loading ' + img.src);
        callback && callback.call(context, null, true);
        img = img.onload = img.onerror = null;
      };

      // data-urls appear to be buggy with crossOrigin
      // https://github.com/kangax/fabric.js/commit/d0abb90f1cd5c5ef9d2a94d3fb21a22330da3e0a#commitcomment-4513767
      // see https://code.google.com/p/chromium/issues/detail?id=315152
      //     https://bugzilla.mozilla.org/show_bug.cgi?id=935069
      if (url.indexOf('data') !== 0 && typeof crossOrigin !== 'undefined') {
        img.crossOrigin = crossOrigin;
      }

      img.src = url;
    },

    /**
     * Creates corresponding fabric instances from their object representations
     * @static
     * @memberOf fabric.util
     * @param {Array} objects Objects to enliven
     * @param {Function} callback Callback to invoke when all objects are created
     * @param {String} namespace Namespace to get klass "Class" object from
     * @param {Function} reviver Method for further parsing of object elements,
     * called after each fabric object created.
     */
    enlivenObjects: function(objects, callback, namespace, reviver) {
      objects = objects || [ ];

      function onLoaded() {
        if (++numLoadedObjects === numTotalObjects) {
          callback && callback(enlivenedObjects);
        }
      }

      var enlivenedObjects = [ ],
          numLoadedObjects = 0,
          numTotalObjects = objects.length;

      if (!numTotalObjects) {
        callback && callback(enlivenedObjects);
        return;
      }

      objects.forEach(function (o, index) {
        // if sparse array
        if (!o || !o.type) {
          onLoaded();
          return;
        }
        var klass = fabric.util.getKlass(o.type, namespace);
        if (klass.async) {
          klass.fromObject(o, function (obj, error) {
            if (!error) {
              enlivenedObjects[index] = obj;
              reviver && reviver(o, enlivenedObjects[index]);
            }
            onLoaded();
          });
        }
        else {
          enlivenedObjects[index] = klass.fromObject(o);
          reviver && reviver(o, enlivenedObjects[index]);
          onLoaded();
        }
      });
    },

    /**
     * Groups SVG elements (usually those retrieved from SVG document)
     * @static
     * @memberOf fabric.util
     * @param {Array} elements SVG elements to group
     * @param {Object} [options] Options object
     * @return {fabric.Object|fabric.PathGroup}
     */
    groupSVGElements: function(elements, options, path) {
      var object;

      object = new fabric.PathGroup(elements, options);

      if (typeof path !== 'undefined') {
        object.setSourcePath(path);
      }
      return object;
    },

    /**
     * Populates an object with properties of another object
     * @static
     * @memberOf fabric.util
     * @param {Object} source Source object
     * @param {Object} destination Destination object
     * @return {Array} properties Propertie names to include
     */
    populateWithProperties: function(source, destination, properties) {
      if (properties && Object.prototype.toString.call(properties) === '[object Array]') {
        for (var i = 0, len = properties.length; i < len; i++) {
          if (properties[i] in source) {
            destination[properties[i]] = source[properties[i]];
          }
        }
      }
    },

    /**
     * Draws a dashed line between two points
     *
     * This method is used to draw dashed line around selection area.
     * See <a href="http://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas">dotted stroke in canvas</a>
     *
     * @param {CanvasRenderingContext2D} ctx context
     * @param {Number} x  start x coordinate
     * @param {Number} y start y coordinate
     * @param {Number} x2 end x coordinate
     * @param {Number} y2 end y coordinate
     * @param {Array} da dash array pattern
     */
    drawDashedLine: function(ctx, x, y, x2, y2, da) {
      var dx = x2 - x,
          dy = y2 - y,
          len = sqrt(dx * dx + dy * dy),
          rot = atan2(dy, dx),
          dc = da.length,
          di = 0,
          draw = true;

      ctx.save();
      ctx.translate(x, y);
      ctx.moveTo(0, 0);
      ctx.rotate(rot);

      x = 0;
      while (len > x) {
        x += da[di++ % dc];
        if (x > len) {
          x = len;
        }
        ctx[draw ? 'lineTo' : 'moveTo'](x, 0);
        draw = !draw;
      }

      ctx.restore();
    },

    /**
     * Creates canvas element and initializes it via excanvas if necessary
     * @static
     * @memberOf fabric.util
     * @param {CanvasElement} [canvasEl] optional canvas element to initialize;
     * when not given, element is created implicitly
     * @return {CanvasElement} initialized canvas element
     */
    createCanvasElement: function(canvasEl) {
      canvasEl || (canvasEl = fabric.document.createElement('canvas'));
      //jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      if (!canvasEl.getContext && typeof G_vmlCanvasManager !== 'undefined') {
        G_vmlCanvasManager.initElement(canvasEl);
      }
      //jscs:enable requireCamelCaseOrUpperCaseIdentifiers
      return canvasEl;
    },

    /**
     * Creates image element (works on client and node)
     * @static
     * @memberOf fabric.util
     * @return {HTMLImageElement} HTML image element
     */
    createImage: function() {
      return fabric.isLikelyNode
        ? new (require('canvas').Image)()
        : fabric.document.createElement('img');
    },

    /**
     * Creates accessors (getXXX, setXXX) for a "class", based on "stateProperties" array
     * @static
     * @memberOf fabric.util
     * @param {Object} klass "Class" to create accessors for
     */
    createAccessors: function(klass) {
      var proto = klass.prototype;

      for (var i = proto.stateProperties.length; i--; ) {

        var propName = proto.stateProperties[i],
            capitalizedPropName = propName.charAt(0).toUpperCase() + propName.slice(1),
            setterName = 'set' + capitalizedPropName,
            getterName = 'get' + capitalizedPropName;

        // using `new Function` for better introspection
        if (!proto[getterName]) {
          proto[getterName] = (function(property) {
            return new Function('return this.get("' + property + '")');
          })(propName);
        }
        if (!proto[setterName]) {
          proto[setterName] = (function(property) {
            return new Function('value', 'return this.set("' + property + '", value)');
          })(propName);
        }
      }
    },

    /**
     * @static
     * @memberOf fabric.util
     * @param {fabric.Object} receiver Object implementing `clipTo` method
     * @param {CanvasRenderingContext2D} ctx Context to clip
     */
    clipContext: function(receiver, ctx) {
      ctx.save();
      ctx.beginPath();
      receiver.clipTo(ctx);
      ctx.clip();
    },

    /**
     * Multiply matrix A by matrix B to nest transformations
     * @static
     * @memberOf fabric.util
     * @param  {Array} matrixA First transformMatrix
     * @param  {Array} matrixB Second transformMatrix
     * @return {Array} The product of the two transform matrices
     */
    multiplyTransformMatrices: function(matrixA, matrixB) {
      // Matrix multiply matrixA * matrixB
      var a = [
        [matrixA[0], matrixA[2], matrixA[4]],
        [matrixA[1], matrixA[3], matrixA[5]],
        [0,          0,          1         ]
      ],

      b = [
        [matrixB[0], matrixB[2], matrixB[4]],
        [matrixB[1], matrixB[3], matrixB[5]],
        [0,          0,          1         ]
      ],

      result = [];

      for (var r = 0; r < 3; r++) {
        result[r] = [];
        for (var c = 0; c < 3; c++) {
          var sum = 0;
          for (var k = 0; k < 3; k++) {
            sum += a[r][k] * b[k][c];
          }

          result[r][c] = sum;
        }
      }

      return [
        result[0][0],
        result[1][0],
        result[0][1],
        result[1][1],
        result[0][2],
        result[1][2]
      ];
    },

    /**
     * Returns string representation of function body
     * @param {Function} fn Function to get body of
     * @return {String} Function body
     */
    getFunctionBody: function(fn) {
      return (String(fn).match(/function[^{]*\{([\s\S]*)\}/) || {})[1];
    },

    /**
     * Returns true if context has transparent pixel
     * at specified location (taking tolerance into account)
     * @param {CanvasRenderingContext2D} ctx context
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Number} tolerance Tolerance
     */
    isTransparent: function(ctx, x, y, tolerance) {

      // If tolerance is > 0 adjust start coords to take into account.
      // If moves off Canvas fix to 0
      if (tolerance > 0) {
        if (x > tolerance) {
          x -= tolerance;
        }
        else {
          x = 0;
        }
        if (y > tolerance) {
          y -= tolerance;
        }
        else {
          y = 0;
        }
      }

      var _isTransparent = true,
          imageData = ctx.getImageData(x, y, (tolerance * 2) || 1, (tolerance * 2) || 1);

      // Split image data - for tolerance > 1, pixelDataSize = 4;
      for (var i = 3, l = imageData.data.length; i < l; i += 4) {
        var temp = imageData.data[i];
        _isTransparent = temp <= 0;
        if (_isTransparent === false) {
          break; // Stop if colour found
        }
      }

      imageData = null;

      return _isTransparent;
    }
  };

})(typeof exports !== 'undefined' ? exports : this);


(function() {

  var arcToSegmentsCache = { },
      segmentToBezierCache = { },
      _join = Array.prototype.join;

  /* Adapted from http://dxr.mozilla.org/mozilla-central/source/content/svg/content/src/nsSVGPathDataParser.cpp
   * by Andrea Bogazzi code is under MPL. if you don't have a copy of the license you can take it here
   * http://mozilla.org/MPL/2.0/
   */
  function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
    var argsString = _join.call(arguments);
    if (arcToSegmentsCache[argsString]) {
      return arcToSegmentsCache[argsString];
    }

    var PI = Math.PI, th = rotateX * (PI / 180),
        sinTh = Math.sin(th),
        cosTh = Math.cos(th),
        fromX = 0, fromY = 0;

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    var px = -cosTh * toX - sinTh * toY,
        py = -cosTh * toY + sinTh * toX,
        rx2 = rx * rx, ry2 = ry * ry, py2 = py * py, px2 = px * px,
        pl = 4 * rx2 * ry2 - rx2 * py2 - ry2 * px2,
        root = 0;

    if (pl < 0) {
      var s = Math.sqrt(1 - 0.25 * pl/(rx2 * ry2));
      rx *= s;
      ry *= s;
    }
    else {
      root = (large === sweep ? -0.5 : 0.5) *
              Math.sqrt( pl /(rx2 * py2 + ry2 * px2));
    }

    var cx = root * rx * py / ry,
        cy = -root * ry * px / rx,
        cx1 = cosTh * cx - sinTh * cy + toX / 2,
        cy1 = sinTh * cx + cosTh * cy + toY / 2,
        mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry),
        dtheta = calcVectorAngle((px - cx) / rx, (py - cy) / ry, (-px - cx) / rx, (-py - cy) / ry);

    if (sweep === 0 && dtheta > 0) {
      dtheta -= 2 * PI;
    }
    else if (sweep === 1 && dtheta < 0) {
      dtheta += 2 * PI;
    }

    // Convert into cubic bezier segments <= 90deg
    var segments = Math.ceil(Math.abs(dtheta / (PI * 0.5))),
        result = [], mDelta = dtheta / segments,
        mT = 8 / 3 * Math.sin(mDelta / 4) * Math.sin(mDelta / 4) / Math.sin(mDelta / 2),
        th3 = mTheta + mDelta;

    for (var i = 0; i < segments; i++) {
      result[i] = segmentToBezier(mTheta, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY);
      fromX = result[i][4];
      fromY = result[i][5];
      mTheta += mDelta;
      th3 += mDelta;
    }
    arcToSegmentsCache[argsString] = result;
    return result;
  }

  function segmentToBezier(th2, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) {
    var argsString2 = _join.call(arguments);
    if (segmentToBezierCache[argsString2]) {
      return segmentToBezierCache[argsString2];
    }

    var costh2 = Math.cos(th2),
        sinth2 = Math.sin(th2),
        costh3 = Math.cos(th3),
        sinth3 = Math.sin(th3),
        toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1,
        toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1,
        cp1X = fromX + mT * ( - cosTh * rx * sinth2 - sinTh * ry * costh2),
        cp1Y = fromY + mT * ( - sinTh * rx * sinth2 + cosTh * ry * costh2),
        cp2X = toX + mT * ( cosTh * rx * sinth3 + sinTh * ry * costh3),
        cp2Y = toY + mT * ( sinTh * rx * sinth3 - cosTh * ry * costh3);

    segmentToBezierCache[argsString2] = [
      cp1X, cp1Y,
      cp2X, cp2Y,
      toX, toY
    ];
    return segmentToBezierCache[argsString2];
  }

  /*
  * Private
  */
  function calcVectorAngle(ux, uy, vx, vy) {
    var ta = Math.atan2(uy, ux),
        tb = Math.atan2(vy, vx);
    if (tb >= ta) {
      return tb - ta;
    }
    else {
      return 2 * Math.PI - (ta - tb);
    }
  }

  /**
   * Draws arc
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} fx
   * @param {Number} fy
   * @param {Array} coords
   */
  fabric.util.drawArc = function(ctx, fx, fy, coords) {
    var rx = coords[0],
        ry = coords[1],
        rot = coords[2],
        large = coords[3],
        sweep = coords[4],
        tx = coords[5],
        ty = coords[6],
        segs = [[ ], [ ], [ ], [ ]],
        segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

    for (var i = 0, len = segsNorm.length; i < len; i++) {
      segs[i][0] = segsNorm[i][0] + fx;
      segs[i][1] = segsNorm[i][1] + fy;
      segs[i][2] = segsNorm[i][2] + fx;
      segs[i][3] = segsNorm[i][3] + fy;
      segs[i][4] = segsNorm[i][4] + fx;
      segs[i][5] = segsNorm[i][5] + fy;
      ctx.bezierCurveTo.apply(ctx, segs[i]);
    }
  };
})();


(function() {

  var slice = Array.prototype.slice;

  /* _ES5_COMPAT_START_ */

  if (!Array.prototype.indexOf) {
    /**
     * Finds index of an element in an array
     * @param {Any} searchElement
     * @param {Number} [fromIndex]
     * @return {Number}
     */
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      if (this === void 0 || this === null) {
        throw new TypeError();
      }
      var t = Object(this), len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 0) {
        n = Number(arguments[1]);
        if (n !== n) { // shortcut for verifying if it's NaN
          n = 0;
        }
        else if (n !== 0 && n !== Number.POSITIVE_INFINITY && n !== Number.NEGATIVE_INFINITY) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }

  if (!Array.prototype.forEach) {
    /**
     * Iterates an array, invoking callback for each element
     * @param {Function} fn Callback to invoke for each element
     * @param {Object} [context] Context to invoke callback in
     * @return {Array}
     */
    Array.prototype.forEach = function(fn, context) {
      for (var i = 0, len = this.length >>> 0; i < len; i++) {
        if (i in this) {
          fn.call(context, this[i], i, this);
        }
      }
    };
  }

  if (!Array.prototype.map) {
    /**
     * Returns a result of iterating over an array, invoking callback for each element
     * @param {Function} fn Callback to invoke for each element
     * @param {Object} [context] Context to invoke callback in
     * @return {Array}
     */
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
    /**
     * Returns true if a callback returns truthy value for all elements in an array
     * @param {Function} fn Callback to invoke for each element
     * @param {Object} [context] Context to invoke callback in
     * @return {Boolean}
     */
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
    /**
     * Returns true if a callback returns truthy value for at least one element in an array
     * @param {Function} fn Callback to invoke for each element
     * @param {Object} [context] Context to invoke callback in
     * @return {Boolean}
     */
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
    /**
     * Returns the result of iterating over elements in an array
     * @param {Function} fn Callback to invoke for each element
     * @param {Object} [context] Context to invoke callback in
     * @return {Array}
     */
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
      return result;
    };
  }

  if (!Array.prototype.reduce) {
    /**
     * Returns "folded" (reduced) result of iterating over elements in an array
     * @param {Function} fn Callback to invoke for each element
     * @param {Object} [initial] Object to use as the first argument to the first call of the callback
     * @return {Any}
     */
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
          // if array contains no values, no initial value to return
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

  /* _ES5_COMPAT_END_ */

  /**
   * Invokes method on all items in a given array
   * @memberOf fabric.util.array
   * @param {Array} array Array to iterate over
   * @param {String} method Name of a method to invoke
   * @return {Array}
   */
  function invoke(array, method) {
    var args = slice.call(arguments, 2), result = [ ];
    for (var i = 0, len = array.length; i < len; i++) {
      result[i] = args.length ? array[i][method].apply(array[i], args) : array[i][method].call(array[i]);
    }
    return result;
  }

  /**
   * Finds maximum value in array (not necessarily "first" one)
   * @memberOf fabric.util.array
   * @param {Array} array Array to iterate over
   * @param {String} byProperty
   * @return {Any}
   */
  function max(array, byProperty) {
    return find(array, byProperty, function(value1, value2) {
      return value1 >= value2;
    });
  }

  /**
   * Finds minimum value in array (not necessarily "first" one)
   * @memberOf fabric.util.array
   * @param {Array} array Array to iterate over
   * @param {String} byProperty
   * @return {Any}
   */
  function min(array, byProperty) {
    return find(array, byProperty, function(value1, value2) {
      return value1 < value2;
    });
  }

  /**
   * @private
   */
  function find(array, byProperty, condition) {
    if (!array || array.length === 0) {
      return;
    }

    var i = array.length - 1,
        result = byProperty ? array[i][byProperty] : array[i];
    if (byProperty) {
      while (i--) {
        if (condition(array[i][byProperty], result)) {
          result = array[i][byProperty];
        }
      }
    }
    else {
      while (i--) {
        if (condition(array[i], result)) {
          result = array[i];
        }
      }
    }
    return result;
  }

  /**
   * @namespace fabric.util.array
   */
  fabric.util.array = {
    invoke: invoke,
    min: min,
    max: max
  };

})();


(function(){

  /**
   * Copies all enumerable properties of one object to another
   * @memberOf fabric.util.object
   * @param {Object} destination Where to copy to
   * @param {Object} source Where to copy from
   * @return {Object}
   */
  function extend(destination, source) {
    // JScript DontEnum bug is not taken care of
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  }

  /**
   * Creates an empty object and copies all enumerable properties of another object to it
   * @memberOf fabric.util.object
   * @param {Object} object Object to clone
   * @return {Object}
   */
  function clone(object) {
    return extend({ }, object);
  }

  /** @namespace fabric.util.object */
  fabric.util.object = {
    extend: extend,
    clone: clone
  };

})();


(function() {

  /* _ES5_COMPAT_START_ */
  if (!String.prototype.trim) {
    /**
     * Trims a string (removing whitespace from the beginning and the end)
     * @function external:String#trim
     * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim">String#trim on MDN</a>
     */
    String.prototype.trim = function () {
      // this trim is not fully ES3 or ES5 compliant, but it should cover most cases for now
      return this.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '');
    };
  }
  /* _ES5_COMPAT_END_ */

  /**
   * Camelizes a string
   * @memberOf fabric.util.string
   * @param {String} string String to camelize
   * @return {String} Camelized version of a string
   */
  function camelize(string) {
    return string.replace(/-+(.)?/g, function(match, character) {
      return character ? character.toUpperCase() : '';
    });
  }

  /**
   * Capitalizes a string
   * @memberOf fabric.util.string
   * @param {String} string String to capitalize
   * @param {Boolean} [firstLetterOnly] If true only first letter is capitalized
   * and other letters stay untouched, if false first letter is capitalized
   * and other letters are converted to lowercase.
   * @return {String} Capitalized version of a string
   */
  function capitalize(string, firstLetterOnly) {
    return string.charAt(0).toUpperCase() +
      (firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase());
  }

  /**
   * Escapes XML in a string
   * @memberOf fabric.util.string
   * @param {String} string String to escape
   * @return {String} Escaped version of a string
   */
  function escapeXml(string) {
    return string.replace(/&/g, '&amp;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&apos;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;');
  }

  /**
   * String utilities
   * @namespace fabric.util.string
   */
  fabric.util.string = {
    camelize: camelize,
    capitalize: capitalize,
    escapeXml: escapeXml
  };
}());


/* _ES5_COMPAT_START_ */
(function() {

  var slice = Array.prototype.slice,
      apply = Function.prototype.apply,
      Dummy = function() { };

  if (!Function.prototype.bind) {
    /**
     * Cross-browser approximation of ES5 Function.prototype.bind (not fully spec conforming)
     * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind">Function#bind on MDN</a>
     * @param {Object} thisArg Object to bind function to
     * @param {Any[]} [...] Values to pass to a bound function
     * @return {Function}
     */
    Function.prototype.bind = function(thisArg) {
      var _this = this, args = slice.call(arguments, 1), bound;
      if (args.length) {
        bound = function() {
          return apply.call(_this, this instanceof Dummy ? this : thisArg, args.concat(slice.call(arguments)));
        };
      }
      else {
        /** @ignore */
        bound = function() {
          return apply.call(_this, this instanceof Dummy ? this : thisArg, arguments);
        };
      }
      Dummy.prototype = this.prototype;
      bound.prototype = new Dummy();

      return bound;
    };
  }

})();
/* _ES5_COMPAT_END_ */


(function() {

  var slice = Array.prototype.slice, emptyFunction = function() { },

      IS_DONTENUM_BUGGY = (function(){
        for (var p in { toString: 1 }) {
          if (p === 'toString') {
            return false;
          }
        }
        return true;
      })(),

      /** @ignore */
      addMethods = function(klass, source, parent) {
        for (var property in source) {

          if (property in klass.prototype &&
              typeof klass.prototype[property] === 'function' &&
              (source[property] + '').indexOf('callSuper') > -1) {

            klass.prototype[property] = (function(property) {
              return function() {

                var superclass = this.constructor.superclass;
                this.constructor.superclass = parent;
                var returnValue = source[property].apply(this, arguments);
                this.constructor.superclass = superclass;

                if (property !== 'initialize') {
                  return returnValue;
                }
              };
            })(property);
          }
          else {
            klass.prototype[property] = source[property];
          }

          if (IS_DONTENUM_BUGGY) {
            if (source.toString !== Object.prototype.toString) {
              klass.prototype.toString = source.toString;
            }
            if (source.valueOf !== Object.prototype.valueOf) {
              klass.prototype.valueOf = source.valueOf;
            }
          }
        }
      };

  function Subclass() { }

  function callSuper(methodName) {
    var fn = this.constructor.superclass.prototype[methodName];
    return (arguments.length > 1)
      ? fn.apply(this, slice.call(arguments, 1))
      : fn.call(this);
  }

  /**
   * Helper for creation of "classes".
   * @memberOf fabric.util
   * @param {Function} [parent] optional "Class" to inherit from
   * @param {Object} [properties] Properties shared by all instances of this class
   *                  (be careful modifying objects defined here as this would affect all instances)
   */
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
      Subclass.prototype = parent.prototype;
      klass.prototype = new Subclass();
      parent.subclasses.push(klass);
    }
    for (var i = 0, length = properties.length; i < length; i++) {
      addMethods(klass, properties[i], parent);
    }
    if (!klass.prototype.initialize) {
      klass.prototype.initialize = emptyFunction;
    }
    klass.prototype.constructor = klass;
    klass.prototype.callSuper = callSuper;
    return klass;
  }

  fabric.util.createClass = createClass;
})();


(function () {

  var unknown = 'unknown';

  /* EVENT HANDLING */

  function areHostMethods(object) {
    var methodNames = Array.prototype.slice.call(arguments, 1),
        t, i, len = methodNames.length;
    for (i = 0; i < len; i++) {
      t = typeof object[methodNames[i]];
      if (!(/^(?:function|object|unknown)$/).test(t)) {
        return false;
      }
    }
    return true;
  }

  /** @ignore */
  var getElement,
      setElement,
      getUniqueId = (function () {
        var uid = 0;
        return function (element) {
          return element.__uniqueID || (element.__uniqueID = 'uniqueID__' + uid++);
        };
      })();

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
   * @function
   * @memberOf fabric.util
   * @param {HTMLElement} element
   * @param {String} eventName
   * @param {Function} handler
   */
  fabric.util.addListener = addListener;

  /**
   * Removes an event listener from an element
   * @function
   * @memberOf fabric.util
   * @param {HTMLElement} element
   * @param {String} eventName
   * @param {Function} handler
   */
  fabric.util.removeListener = removeListener;

  /**
   * Cross-browser wrapper for getting event's coordinates
   * @memberOf fabric.util
   * @param {Event} event Event object
   * @param {HTMLCanvasElement} upperCanvasEl &lt;canvas> element on which object selection is drawn
   */
  function getPointer(event, upperCanvasEl) {
    event || (event = fabric.window.event);

    var element = event.target ||
                  (typeof event.srcElement !== unknown ? event.srcElement : null),

        scroll = fabric.util.getScrollLeftTop(element, upperCanvasEl);

    return {
      x: pointerX(event) + scroll.left,
      y: pointerY(event) + scroll.top
    };
  }

  var pointerX = function(event) {
    // looks like in IE (<9) clientX at certain point (apparently when mouseup fires on VML element)
    // is represented as COM object, with all the consequences, like "unknown" type and error on [[Get]]
    // need to investigate later
    return (typeof event.clientX !== unknown ? event.clientX : 0);
  },

  pointerY = function(event) {
    return (typeof event.clientY !== unknown ? event.clientY : 0);
  };

  function _getPointer(event, pageProp, clientProp) {
    var touchProp = event.type === 'touchend' ? 'changedTouches' : 'touches';

    return (event[touchProp] && event[touchProp][0]
      ? (event[touchProp][0][pageProp] - (event[touchProp][0][pageProp] - event[touchProp][0][clientProp]))
        || event[clientProp]
      : event[clientProp]);
  }

  if (fabric.isTouchSupported) {
    pointerX = function(event) {
      return _getPointer(event, 'pageX', 'clientX');
    };
    pointerY = function(event) {
      return _getPointer(event, 'pageY', 'clientY');
    };
  }

  fabric.util.getPointer = getPointer;

  fabric.util.object.extend(fabric.util, fabric.Observable);

})();


(function () {

  /**
   * Cross-browser wrapper for setting element's style
   * @memberOf fabric.util
   * @param {HTMLElement} element
   * @param {Object} styles
   * @return {HTMLElement} Element that was passed as a first argument
   */
  function setStyle(element, styles) {
    var elementStyle = element.style;
    if (!elementStyle) {
      return element;
    }
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

  var parseEl = fabric.document.createElement('div'),
      supportsOpacity = typeof parseEl.style.opacity === 'string',
      supportsFilters = typeof parseEl.style.filter === 'string',
      reOpacity = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,

      /** @ignore */
      setOpacity = function (element) { return element; };

  if (supportsOpacity) {
    /** @ignore */
    setOpacity = function(element, value) {
      element.style.opacity = value;
      return element;
    };
  }
  else if (supportsFilters) {
    /** @ignore */
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


(function() {

  var _slice = Array.prototype.slice;

  /**
   * Takes id and returns an element with that id (if one exists in a document)
   * @memberOf fabric.util
   * @param {String|HTMLElement} id
   * @return {HTMLElement|null}
   */
  function getById(id) {
    return typeof id === 'string' ? fabric.document.getElementById(id) : id;
  }

  var sliceCanConvertNodelists,
      /**
       * Converts an array-like object (e.g. arguments or NodeList) to an array
       * @memberOf fabric.util
       * @param {Object} arrayLike
       * @return {Array}
       */
      toArray = function(arrayLike) {
        return _slice.call(arrayLike, 0);
      };

  try {
    sliceCanConvertNodelists = toArray(fabric.document.childNodes) instanceof Array;
  }
  catch (err) { }

  if (!sliceCanConvertNodelists) {
    toArray = function(arrayLike) {
      var arr = new Array(arrayLike.length), i = arrayLike.length;
      while (i--) {
        arr[i] = arrayLike[i];
      }
      return arr;
    };
  }

  /**
   * Creates specified element with specified attributes
   * @memberOf fabric.util
   * @param {String} tagName Type of an element to create
   * @param {Object} [attributes] Attributes to set on an element
   * @return {HTMLElement} Newly created element
   */
  function makeElement(tagName, attributes) {
    var el = fabric.document.createElement(tagName);
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

  /**
   * Adds class to an element
   * @memberOf fabric.util
   * @param {HTMLElement} element Element to add class to
   * @param {String} className Class to add to an element
   */
  function addClass(element, className) {
    if (element && (' ' + element.className + ' ').indexOf(' ' + className + ' ') === -1) {
      element.className += (element.className ? ' ' : '') + className;
    }
  }

  /**
   * Wraps element with another element
   * @memberOf fabric.util
   * @param {HTMLElement} element Element to wrap
   * @param {HTMLElement|String} wrapper Element to wrap with
   * @param {Object} [attributes] Attributes to set on a wrapper
   * @return {HTMLElement} wrapper
   */
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

  /**
   * Returns element scroll offsets
   * @memberOf fabric.util
   * @param {HTMLElement} element Element to operate on
   * @param {HTMLElement} upperCanvasEl Upper canvas element
   * @return {Object} Object with left/top values
   */
  function getScrollLeftTop(element, upperCanvasEl) {

    var firstFixedAncestor,
        origElement,
        left = 0,
        top = 0,
        docElement = fabric.document.documentElement,
        body = fabric.document.body || {
          scrollLeft: 0, scrollTop: 0
        };

    origElement = element;

    while (element && element.parentNode && !firstFixedAncestor) {

      element = element.parentNode;

      if (element !== fabric.document &&
          fabric.util.getElementStyle(element, 'position') === 'fixed') {
        firstFixedAncestor = element;
      }

      if (element !== fabric.document &&
          origElement !== upperCanvasEl &&
          fabric.util.getElementStyle(element, 'position') === 'absolute') {
        left = 0;
        top = 0;
      }
      else if (element === fabric.document) {
        left = body.scrollLeft || docElement.scrollLeft || 0;
        top = body.scrollTop ||  docElement.scrollTop || 0;
      }
      else {
        left += element.scrollLeft || 0;
        top += element.scrollTop || 0;
      }
    }

    return { left: left, top: top };
  }

  /**
   * Returns offset for a given element
   * @function
   * @memberOf fabric.util
   * @param {HTMLElement} element Element to get offset for
   * @return {Object} Object with "left" and "top" properties
   */
  function getElementOffset(element) {
    var docElem,
        doc = element && element.ownerDocument,
        box = { left: 0, top: 0 },
        offset = { left: 0, top: 0 },
        scrollLeftTop,
        offsetAttributes = {
          borderLeftWidth: 'left',
          borderTopWidth:  'top',
          paddingLeft:     'left',
          paddingTop:      'top'
        };

    if (!doc) {
      return { left: 0, top: 0 };
    }

    for (var attr in offsetAttributes) {
      offset[offsetAttributes[attr]] += parseInt(getElementStyle(element, attr), 10) || 0;
    }

    docElem = doc.documentElement;
    if ( typeof element.getBoundingClientRect !== 'undefined' ) {
      box = element.getBoundingClientRect();
    }

    scrollLeftTop = fabric.util.getScrollLeftTop(element, null);

    return {
      left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
      top: box.top + scrollLeftTop.top - (docElem.clientTop || 0)  + offset.top
    };
  }

  /**
  * Returns style attribute value of a given element
  * @memberOf fabric.util
  * @param {HTMLElement} element Element to get style attribute for
  * @param {String} attr Style attribute to get for element
  * @return {String} Style attribute value of the given element.
  */
  var getElementStyle;
  if (fabric.document.defaultView && fabric.document.defaultView.getComputedStyle) {
    getElementStyle = function(element, attr) {
      return fabric.document.defaultView.getComputedStyle(element, null)[attr];
    };
  }
  else {
    getElementStyle = function(element, attr) {
      var value = element.style[attr];
      if (!value && element.currentStyle) {
        value = element.currentStyle[attr];
      }
      return value;
    };
  }

  (function () {
    var style = fabric.document.documentElement.style,
        selectProp = 'userSelect' in style
          ? 'userSelect'
          : 'MozUserSelect' in style
            ? 'MozUserSelect'
            : 'WebkitUserSelect' in style
              ? 'WebkitUserSelect'
              : 'KhtmlUserSelect' in style
                ? 'KhtmlUserSelect'
                : '';

    /**
     * Makes element unselectable
     * @memberOf fabric.util
     * @param {HTMLElement} element Element to make unselectable
     * @return {HTMLElement} Element that was passed in
     */
    function makeElementUnselectable(element) {
      if (typeof element.onselectstart !== 'undefined') {
        element.onselectstart = fabric.util.falseFunction;
      }
      if (selectProp) {
        element.style[selectProp] = 'none';
      }
      else if (typeof element.unselectable === 'string') {
        element.unselectable = 'on';
      }
      return element;
    }

    /**
     * Makes element selectable
     * @memberOf fabric.util
     * @param {HTMLElement} element Element to make selectable
     * @return {HTMLElement} Element that was passed in
     */
    function makeElementSelectable(element) {
      if (typeof element.onselectstart !== 'undefined') {
        element.onselectstart = null;
      }
      if (selectProp) {
        element.style[selectProp] = '';
      }
      else if (typeof element.unselectable === 'string') {
        element.unselectable = '';
      }
      return element;
    }

    fabric.util.makeElementUnselectable = makeElementUnselectable;
    fabric.util.makeElementSelectable = makeElementSelectable;
  })();

  (function() {

    /**
     * Inserts a script element with a given url into a document; invokes callback, when that script is finished loading
     * @memberOf fabric.util
     * @param {String} url URL of a script to load
     * @param {Function} callback Callback to execute when script is finished loading
     */
    function getScript(url, callback) {
      var headEl = fabric.document.getElementsByTagName('head')[0],
          scriptEl = fabric.document.createElement('script'),
          loading = true;

      /** @ignore */
      scriptEl.onload = /** @ignore */ scriptEl.onreadystatechange = function(e) {
        if (loading) {
          if (typeof this.readyState === 'string' &&
              this.readyState !== 'loaded' &&
              this.readyState !== 'complete') {
            return;
          }
          loading = false;
          callback(e || fabric.window.event);
          scriptEl = scriptEl.onload = scriptEl.onreadystatechange = null;
        }
      };
      scriptEl.src = url;
      headEl.appendChild(scriptEl);
      // causes issue in Opera
      // headEl.removeChild(scriptEl);
    }

    fabric.util.getScript = getScript;
  })();

  fabric.util.getById = getById;
  fabric.util.toArray = toArray;
  fabric.util.makeElement = makeElement;
  fabric.util.addClass = addClass;
  fabric.util.wrapElement = wrapElement;
  fabric.util.getScrollLeftTop = getScrollLeftTop;
  fabric.util.getElementOffset = getElementOffset;
  fabric.util.getElementStyle = getElementStyle;

})();


(function(){

  function addParamToUrl(url, param) {
    return url + (/\?/.test(url) ? '&' : '?') + param;
  }

  var makeXHR = (function() {
    var factories = [
      function() { return new ActiveXObject('Microsoft.XMLHTTP'); },
      function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
      function() { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); },
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

  function emptyFn() { }

  /**
   * Cross-browser abstraction for sending XMLHttpRequest
   * @memberOf fabric.util
   * @param {String} url URL to send XMLHttpRequest to
   * @param {Object} [options] Options object
   * @param {String} [options.method="GET"]
   * @param {Function} options.onComplete Callback to invoke when request is completed
   * @return {XMLHttpRequest} request
   */
  function request(url, options) {

    options || (options = { });

    var method = options.method ? options.method.toUpperCase() : 'GET',
        onComplete = options.onComplete || function() { },
        xhr = makeXHR(),
        body;

    /** @ignore */
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        onComplete(xhr);
        xhr.onreadystatechange = emptyFn;
      }
    };

    if (method === 'GET') {
      body = null;
      if (typeof options.parameters === 'string') {
        url = addParamToUrl(url, options.parameters);
      }
    }

    xhr.open(method, url, true);

    if (method === 'POST' || method === 'PUT') {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    xhr.send(body);
    return xhr;
  }

  fabric.util.request = request;
})();


/**
 * Wrapper around `console.log` (when available)
 * @param {Any} [values] Values to log
 */
fabric.log = function() { };

/**
 * Wrapper around `console.warn` (when available)
 * @param {Any} [values] Values to log as a warning
 */
fabric.warn = function() { };

if (typeof console !== 'undefined') {
  ['log', 'warn'].forEach(function(methodName) {
    if (typeof console[methodName] !== 'undefined' && console[methodName].apply) {
      fabric[methodName] = function() {
        return console[methodName].apply(console, arguments);
      };
    }
  });
}


(function(global) {

  'use strict';

  /* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

  var fabric = global.fabric || (global.fabric = { });

  if (fabric.Point) {
    fabric.warn('fabric.Point is already defined');
    return;
  }

  fabric.Point = Point;

  /**
   * Point class
   * @class fabric.Point
   * @memberOf fabric
   * @constructor
   * @param {Number} x
   * @param {Number} y
   * @return {fabric.Point} thisArg
   */
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype = /** @lends fabric.Point.prototype */ {

    constructor: Point,

    /**
     * Adds another point to this one and returns another one
     * @param {fabric.Point} that
     * @return {fabric.Point} new Point instance with added values
     */
    add: function (that) {
      return new Point(this.x + that.x, this.y + that.y);
    },

    /**
     * Adds another point to this one
     * @param {fabric.Point} that
     * @return {fabric.Point} thisArg
     */
    addEquals: function (that) {
      this.x += that.x;
      this.y += that.y;
      return this;
    },

    /**
     * Adds value to this point and returns a new one
     * @param {Number} scalar
     * @return {fabric.Point} new Point with added value
     */
    scalarAdd: function (scalar) {
      return new Point(this.x + scalar, this.y + scalar);
    },

    /**
     * Adds value to this point
     * @param {Number} scalar
     * @return {fabric.Point} thisArg
     */
    scalarAddEquals: function (scalar) {
      this.x += scalar;
      this.y += scalar;
      return this;
    },

    /**
     * Subtracts another point from this point and returns a new one
     * @param {fabric.Point} that
     * @return {fabric.Point} new Point object with subtracted values
     */
    subtract: function (that) {
      return new Point(this.x - that.x, this.y - that.y);
    },

    /**
     * Subtracts another point from this point
     * @param {fabric.Point} that
     * @return {fabric.Point} thisArg
     */
    subtractEquals: function (that) {
      this.x -= that.x;
      this.y -= that.y;
      return this;
    },

    /**
     * Subtracts value from this point and returns a new one
     * @param {Number} scalar
     * @return {fabric.Point}
     */
    scalarSubtract: function (scalar) {
      return new Point(this.x - scalar, this.y - scalar);
    },

    /**
     * Subtracts value from this point
     * @param {Number} scalar
     * @return {fabric.Point} thisArg
     */
    scalarSubtractEquals: function (scalar) {
      this.x -= scalar;
      this.y -= scalar;
      return this;
    },

    /**
     * Miltiplies this point by a value and returns a new one
     * @param {Number} scalar
     * @return {fabric.Point}
     */
    multiply: function (scalar) {
      return new Point(this.x * scalar, this.y * scalar);
    },

    /**
     * Miltiplies this point by a value
     * @param {Number} scalar
     * @return {fabric.Point} thisArg
     */
    multiplyEquals: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },

    /**
     * Divides this point by a value and returns a new one
     * @param {Number} scalar
     * @return {fabric.Point}
     */
    divide: function (scalar) {
      return new Point(this.x / scalar, this.y / scalar);
    },

    /**
     * Divides this point by a value
     * @param {Number} scalar
     * @return {fabric.Point} thisArg
     */
    divideEquals: function (scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    },

    /**
     * Returns true if this point is equal to another one
     * @param {fabric.Point} that
     * @return {Boolean}
     */
    eq: function (that) {
      return (this.x === that.x && this.y === that.y);
    },

    /**
     * Returns true if this point is less than another one
     * @param {fabric.Point} that
     * @return {Boolean}
     */
    lt: function (that) {
      return (this.x < that.x && this.y < that.y);
    },

    /**
     * Returns true if this point is less than or equal to another one
     * @param {fabric.Point} that
     * @return {Boolean}
     */
    lte: function (that) {
      return (this.x <= that.x && this.y <= that.y);
    },

    /**

     * Returns true if this point is greater another one
     * @param {fabric.Point} that
     * @return {Boolean}
     */
    gt: function (that) {
      return (this.x > that.x && this.y > that.y);
    },

    /**
     * Returns true if this point is greater than or equal to another one
     * @param {fabric.Point} that
     * @return {Boolean}
     */
    gte: function (that) {
      return (this.x >= that.x && this.y >= that.y);
    },

    /**
     * Returns new point which is the result of linear interpolation with this one and another one
     * @param {fabric.Point} that
     * @param {Number} t
     * @return {fabric.Point}
     */
    lerp: function (that, t) {
      return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
    },

    /**
     * Returns distance from this point and another one
     * @param {fabric.Point} that
     * @return {Number}
     */
    distanceFrom: function (that) {
      var dx = this.x - that.x,
          dy = this.y - that.y;
      return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Returns the point between this point and another one
     * @param {fabric.Point} that
     * @return {fabric.Point}
     */
    midPointFrom: function (that) {
      return new Point(this.x + (that.x - this.x)/2, this.y + (that.y - this.y)/2);
    },

    /**
     * Returns a new point which is the min of this and another one
     * @param {fabric.Point} that
     * @return {fabric.Point}
     */
    min: function (that) {
      return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
    },

    /**
     * Returns a new point which is the max of this and another one
     * @param {fabric.Point} that
     * @return {fabric.Point}
     */
    max: function (that) {
      return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
    },

    /**
     * Returns string representation of this point
     * @return {String}
     */
    toString: function () {
      return this.x + ',' + this.y;
    },

    /**
     * Sets x/y of this point
     * @param {Number} x
     * @return {Number} y
     */
    setXY: function (x, y) {
      this.x = x;
      this.y = y;
    },

    /**
     * Sets x/y of this point from another point
     * @param {fabric.Point} that
     */
    setFromPoint: function (that) {
      this.x = that.x;
      this.y = that.y;
    },

    /**
     * Swaps x/y of this point and another point
     * @param {fabric.Point} that
     */
    swap: function (that) {
      var x = this.x,
          y = this.y;
      this.x = that.x;
      this.y = that.y;
      that.x = x;
      that.y = y;
    }
  };

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  /* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */
  var fabric = global.fabric || (global.fabric = { });

  if (fabric.Intersection) {
    fabric.warn('fabric.Intersection is already defined');
    return;
  }

  /**
   * Intersection class
   * @class fabric.Intersection
   * @memberOf fabric
   * @constructor
   */
  function Intersection(status) {
    this.status = status;
    this.points = [];
  }

  fabric.Intersection = Intersection;

  fabric.Intersection.prototype = /** @lends fabric.Intersection.prototype */ {

    /**
     * Appends a point to intersection
     * @param {fabric.Point} point
     */
    appendPoint: function (point) {
      this.points.push(point);
    },

    /**
     * Appends points to intersection
     * @param {Array} points
     */
    appendPoints: function (points) {
      this.points = this.points.concat(points);
    }
  };

  /**
   * Checks if one line intersects another
   * @static
   * @param {fabric.Point} a1
   * @param {fabric.Point} a2
   * @param {fabric.Point} b1
   * @param {fabric.Point} b2
   * @return {fabric.Intersection}
   */
  fabric.Intersection.intersectLineLine = function (a1, a2, b1, b2) {
    var result,
        uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
        ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
        uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (uB !== 0) {
      var ua = uaT / uB,
          ub = ubT / uB;
      if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
        result = new Intersection('Intersection');
        result.points.push(new fabric.Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
      }
      else {
        result = new Intersection();
      }
    }
    else {
      if (uaT === 0 || ubT === 0) {
        result = new Intersection('Coincident');
      }
      else {
        result = new Intersection('Parallel');
      }
    }
    return result;
  };

  /**
   * Checks if line intersects polygon
   * @static
   * @param {fabric.Point} a1
   * @param {fabric.Point} a2
   * @param {Array} points
   * @return {fabric.Intersection}
   */
  fabric.Intersection.intersectLinePolygon = function(a1,a2,points){
    var result = new Intersection(),
        length = points.length;

    for (var i = 0; i < length; i++) {
      var b1 = points[i],
          b2 = points[(i + 1) % length],
          inter = Intersection.intersectLineLine(a1, a2, b1, b2);

      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = 'Intersection';
    }
    return result;
  };

  /**
   * Checks if polygon intersects another polygon
   * @static
   * @param {Array} points1
   * @param {Array} points2
   * @return {fabric.Intersection}
   */
  fabric.Intersection.intersectPolygonPolygon = function (points1, points2) {
    var result = new Intersection(),
        length = points1.length;

    for (var i = 0; i < length; i++) {
      var a1 = points1[i],
          a2 = points1[(i + 1) % length],
          inter = Intersection.intersectLinePolygon(a1, a2, points2);

      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = 'Intersection';
    }
    return result;
  };

  /**
   * Checks if polygon intersects rectangle
   * @static
   * @param {Array} points
   * @param {Number} r1
   * @param {Number} r2
   * @return {fabric.Intersection}
   */
  fabric.Intersection.intersectPolygonRectangle = function (points, r1, r2) {
    var min = r1.min(r2),
        max = r1.max(r2),
        topRight = new fabric.Point(max.x, min.y),
        bottomLeft = new fabric.Point(min.x, max.y),
        inter1 = Intersection.intersectLinePolygon(min, topRight, points),
        inter2 = Intersection.intersectLinePolygon(topRight, max, points),
        inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points),
        inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points),
        result = new Intersection();

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if (result.points.length > 0) {
      result.status = 'Intersection';
    }
    return result;
  };

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { });

  if (fabric.Color) {
    fabric.warn('fabric.Color is already defined.');
    return;
  }

  /**
   * Color class
   * The purpose of {@link fabric.Color} is to abstract and encapsulate common color operations;
   * {@link fabric.Color} is a constructor and creates instances of {@link fabric.Color} objects.
   *
   * @class fabric.Color
   * @param {String} color optional in hex or rgb(a) format
   * @return {fabric.Color} thisArg
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-2/#colors}
   */
  function Color(color) {
    if (!color) {
      this.setSource([0, 0, 0, 1]);
    }
    else {
      this._tryParsingColor(color);
    }
  }

  fabric.Color = Color;

  fabric.Color.prototype = /** @lends fabric.Color.prototype */ {

    /**
     * @private
     * @param {String|Array} color Color value to parse
     */
    _tryParsingColor: function(color) {
      var source;

      if (color in Color.colorNameMap) {
        color = Color.colorNameMap[color];
      }

      if (color === 'transparent') {
        this.setSource([255,255,255,0]);
        return;
      }

      source = Color.sourceFromHex(color);

      if (!source) {
        source = Color.sourceFromRgb(color);
      }
      if (!source) {
        source = Color.sourceFromHsl(color);
      }
      if (source) {
        this.setSource(source);
      }
    },

    /**
     * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
     * @private
     * @param {Number} r Red color value
     * @param {Number} g Green color value
     * @param {Number} b Blue color value
     * @return {Array} Hsl color
     */
    _rgbToHsl: function(r, g, b) {
      r /= 255, g /= 255, b /= 255;

      var h, s, l,
          max = fabric.util.array.max([r, g, b]),
          min = fabric.util.array.min([r, g, b]);

      l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      }
      else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return [
        Math.round(h * 360),
        Math.round(s * 100),
        Math.round(l * 100)
      ];
    },

    /**
     * Returns source of this color (where source is an array representation; ex: [200, 200, 100, 1])
     * @return {Array}
     */
    getSource: function() {
      return this._source;
    },

    /**
     * Sets source of this color (where source is an array representation; ex: [200, 200, 100, 1])
     * @param {Array} source
     */
    setSource: function(source) {
      this._source = source;
    },

    /**
     * Returns color represenation in RGB format
     * @return {String} ex: rgb(0-255,0-255,0-255)
     */
    toRgb: function() {
      var source = this.getSource();
      return 'rgb(' + source[0] + ',' + source[1] + ',' + source[2] + ')';
    },

    /**
     * Returns color represenation in RGBA format
     * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
     */
    toRgba: function() {
      var source = this.getSource();
      return 'rgba(' + source[0] + ',' + source[1] + ',' + source[2] + ',' + source[3] + ')';
    },

    /**
     * Returns color represenation in HSL format
     * @return {String} ex: hsl(0-360,0%-100%,0%-100%)
     */
    toHsl: function() {
      var source = this.getSource(),
          hsl = this._rgbToHsl(source[0], source[1], source[2]);

      return 'hsl(' + hsl[0] + ',' + hsl[1] + '%,' + hsl[2] + '%)';
    },

    /**
     * Returns color represenation in HSLA format
     * @return {String} ex: hsla(0-360,0%-100%,0%-100%,0-1)
     */
    toHsla: function() {
      var source = this.getSource(),
          hsl = this._rgbToHsl(source[0], source[1], source[2]);

      return 'hsla(' + hsl[0] + ',' + hsl[1] + '%,' + hsl[2] + '%,' + source[3] + ')';
    },

    /**
     * Returns color represenation in HEX format
     * @return {String} ex: FF5555
     */
    toHex: function() {
      var source = this.getSource(), r, g, b;

      r = source[0].toString(16);
      r = (r.length === 1) ? ('0' + r) : r;

      g = source[1].toString(16);
      g = (g.length === 1) ? ('0' + g) : g;

      b = source[2].toString(16);
      b = (b.length === 1) ? ('0' + b) : b;

      return r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
    },

    /**
     * Gets value of alpha channel for this color
     * @return {Number} 0-1
     */
    getAlpha: function() {
      return this.getSource()[3];
    },

    /**
     * Sets value of alpha channel for this color
     * @param {Number} alpha Alpha value 0-1
     * @return {fabric.Color} thisArg
     */
    setAlpha: function(alpha) {
      var source = this.getSource();
      source[3] = alpha;
      this.setSource(source);
      return this;
    },

    /**
     * Transforms color to its grayscale representation
     * @return {fabric.Color} thisArg
     */
    toGrayscale: function() {
      var source = this.getSource(),
          average = parseInt((source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0), 10),
          currentAlpha = source[3];
      this.setSource([average, average, average, currentAlpha]);
      return this;
    },

    /**
     * Transforms color to its black and white representation
     * @param {Number} threshold
     * @return {fabric.Color} thisArg
     */
    toBlackWhite: function(threshold) {
      var source = this.getSource(),
          average = (source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0),
          currentAlpha = source[3];

      threshold = threshold || 127;

      average = (Number(average) < Number(threshold)) ? 0 : 255;
      this.setSource([average, average, average, currentAlpha]);
      return this;
    },

    /**
     * Overlays color with another color
     * @param {String|fabric.Color} otherColor
     * @return {fabric.Color} thisArg
     */
    overlayWith: function(otherColor) {
      if (!(otherColor instanceof Color)) {
        otherColor = new Color(otherColor);
      }

      var result = [],
          alpha = this.getAlpha(),
          otherAlpha = 0.5,
          source = this.getSource(),
          otherSource = otherColor.getSource();

      for (var i = 0; i < 3; i++) {
        result.push(Math.round((source[i] * (1 - otherAlpha)) + (otherSource[i] * otherAlpha)));
      }

      result[3] = alpha;
      this.setSource(result);
      return this;
    }
  };

  /**
   * Regex matching color in RGB or RGBA formats (ex: rgb(0, 0, 0), rgba(255, 100, 10, 0.5), rgba( 255 , 100 , 10 , 0.5 ), rgb(1,1,1), rgba(100%, 60%, 10%, 0.5))
   * @static
   * @field
   * @memberOf fabric.Color
   */
  fabric.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;

  /**
   * Regex matching color in HSL or HSLA formats (ex: hsl(200, 80%, 10%), hsla(300, 50%, 80%, 0.5), hsla( 300 , 50% , 80% , 0.5 ))
   * @static
   * @field
   * @memberOf fabric.Color
   */
  fabric.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;

  /**
   * Regex matching color in HEX format (ex: #FF5555, 010155, aff)
   * @static
   * @field
   * @memberOf fabric.Color
   */
  fabric.Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;

  /**
   * Map of the 17 basic color names with HEX code
   * @static
   * @field
   * @memberOf fabric.Color
   * @see: http://www.w3.org/TR/CSS2/syndata.html#color-units
   */
  fabric.Color.colorNameMap = {
    aqua:    '#00FFFF',
    black:   '#000000',
    blue:    '#0000FF',
    fuchsia: '#FF00FF',
    gray:    '#808080',
    green:   '#008000',
    lime:    '#00FF00',
    maroon:  '#800000',
    navy:    '#000080',
    olive:   '#808000',
    orange:  '#FFA500',
    purple:  '#800080',
    red:     '#FF0000',
    silver:  '#C0C0C0',
    teal:    '#008080',
    white:   '#FFFFFF',
    yellow:  '#FFFF00'
  };

  /**
   * @private
   * @param {Number} p
   * @param {Number} q
   * @param {Number} t
   * @return {Number}
   */
  function hue2rgb(p, q, t){
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1/6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1/2) {
      return q;
    }
    if (t < 2/3) {
      return p + (q - p) * (2/3 - t) * 6;
    }
    return p;
  }

  /**
   * Returns new color object, when given a color in RGB format
   * @memberOf fabric.Color
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255)
   * @return {fabric.Color}
   */
  fabric.Color.fromRgb = function(color) {
    return Color.fromSource(Color.sourceFromRgb(color));
  };

  /**
   * Returns array represenatation (ex: [100, 100, 200, 1]) of a color that's in RGB or RGBA format
   * @memberOf fabric.Color
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255), rgb(0%-100%,0%-100%,0%-100%)
   * @return {Array} source
   */
  fabric.Color.sourceFromRgb = function(color) {
    var match = color.match(Color.reRGBa);
    if (match) {
      var r = parseInt(match[1], 10) / (/%$/.test(match[1]) ? 100 : 1) * (/%$/.test(match[1]) ? 255 : 1),
          g = parseInt(match[2], 10) / (/%$/.test(match[2]) ? 100 : 1) * (/%$/.test(match[2]) ? 255 : 1),
          b = parseInt(match[3], 10) / (/%$/.test(match[3]) ? 100 : 1) * (/%$/.test(match[3]) ? 255 : 1);

      return [
        parseInt(r, 10),
        parseInt(g, 10),
        parseInt(b, 10),
        match[4] ? parseFloat(match[4]) : 1
      ];
    }
  };

  /**
   * Returns new color object, when given a color in RGBA format
   * @static
   * @function
   * @memberOf fabric.Color
   * @param {String} color
   * @return {fabric.Color}
   */
  fabric.Color.fromRgba = Color.fromRgb;

  /**
   * Returns new color object, when given a color in HSL format
   * @param {String} color Color value ex: hsl(0-260,0%-100%,0%-100%)
   * @memberOf fabric.Color
   * @return {fabric.Color}
   */
  fabric.Color.fromHsl = function(color) {
    return Color.fromSource(Color.sourceFromHsl(color));
  };

  /**
   * Returns array represenatation (ex: [100, 100, 200, 1]) of a color that's in HSL or HSLA format.
   * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
   * @memberOf fabric.Color
   * @param {String} color Color value ex: hsl(0-360,0%-100%,0%-100%) or hsla(0-360,0%-100%,0%-100%, 0-1)
   * @return {Array} source
   * @see http://http://www.w3.org/TR/css3-color/#hsl-color
   */
  fabric.Color.sourceFromHsl = function(color) {
    var match = color.match(Color.reHSLa);
    if (!match) {
      return;
    }

    var h = (((parseFloat(match[1]) % 360) + 360) % 360) / 360,
        s = parseFloat(match[2]) / (/%$/.test(match[2]) ? 100 : 1),
        l = parseFloat(match[3]) / (/%$/.test(match[3]) ? 100 : 1),
        r, g, b;

    if (s === 0) {
      r = g = b = l;
    }
    else {
      var q = l <= 0.5 ? l * (s + 1) : l + s - l * s,
          p = l * 2 - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      match[4] ? parseFloat(match[4]) : 1
    ];
  };

  /**
   * Returns new color object, when given a color in HSLA format
   * @static
   * @function
   * @memberOf fabric.Color
   * @param {String} color
   * @return {fabric.Color}
   */
  fabric.Color.fromHsla = Color.fromHsl;

  /**
   * Returns new color object, when given a color in HEX format
   * @static
   * @memberOf fabric.Color
   * @param {String} color Color value ex: FF5555
   * @return {fabric.Color}
   */
  fabric.Color.fromHex = function(color) {
    return Color.fromSource(Color.sourceFromHex(color));
  };

  /**
   * Returns array represenatation (ex: [100, 100, 200, 1]) of a color that's in HEX format
   * @static
   * @memberOf fabric.Color
   * @param {String} color ex: FF5555
   * @return {Array} source
   */
  fabric.Color.sourceFromHex = function(color) {
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
   * Returns new color object, when given color in array representation (ex: [200, 100, 100, 0.5])
   * @static
   * @memberOf fabric.Color
   * @param {Array} source
   * @return {fabric.Color}
   */
  fabric.Color.fromSource = function(source) {
    var oColor = new Color();
    oColor.setSource(source);
    return oColor;
  };

})(typeof exports !== 'undefined' ? exports : this);


(function () {

  'use strict';

  if (fabric.StaticCanvas) {
    fabric.warn('fabric.StaticCanvas is already defined.');
    return;
  }

  // aliases for faster resolution
  var extend = fabric.util.object.extend,
      getElementOffset = fabric.util.getElementOffset,
      removeFromArray = fabric.util.removeFromArray,

      CANVAS_INIT_ERROR = new Error('Could not initialize `canvas` element');

  /**
   * Static canvas class
   * @class fabric.StaticCanvas
   * @mixes fabric.Collection
   * @mixes fabric.Observable
   * @see {@link http://fabricjs.com/static_canvas/|StaticCanvas demo}
   * @see {@link fabric.StaticCanvas#initialize} for constructor definition
   * @fires before:render
   * @fires after:render
   * @fires canvas:cleared
   * @fires object:added
   * @fires object:removed
   */
  fabric.StaticCanvas = fabric.util.createClass(/** @lends fabric.StaticCanvas.prototype */ {

    /**
     * Constructor
     * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function(el, options) {
      options || (options = { });

      this._initStatic(el, options);
      fabric.StaticCanvas.activeInstance = this;
    },

    /**
     * Background color of canvas instance.
     * Should be set via {@link fabric.StaticCanvas#setBackgroundColor}.
     * @type {(String|fabric.Pattern)}
     * @default
     */
    backgroundColor: '',

    /**
     * Background image of canvas instance.
     * Should be set via {@link fabric.StaticCanvas#setBackgroundImage}.
     * <b>Backwards incompatibility note:</b> The "backgroundImageOpacity"
     * and "backgroundImageStretch" properties are deprecated since 1.3.9.
     * Use {@link fabric.Image#opacity}, {@link fabric.Image#width} and {@link fabric.Image#height}.
     * @type fabric.Image
     * @default
     */
    backgroundImage: null,

    /**
     * Overlay color of canvas instance.
     * Should be set via {@link fabric.StaticCanvas#setOverlayColor}
     * @since 1.3.9
     * @type {(String|fabric.Pattern)}
     * @default
     */
    overlayColor: '',

    /**
     * Overlay image of canvas instance.
     * Should be set via {@link fabric.StaticCanvas#setOverlayImage}.
     * <b>Backwards incompatibility note:</b> The "overlayImageLeft"
     * and "overlayImageTop" properties are deprecated since 1.3.9.
     * Use {@link fabric.Image#left} and {@link fabric.Image#top}.
     * @type fabric.Image
     * @default
     */
    overlayImage: null,

    /**
     * Indicates whether toObject/toDatalessObject should include default values
     * @type Boolean
     * @default
     */
    includeDefaultValues: true,

    /**
     * Indicates whether objects' state should be saved
     * @type Boolean
     * @default
     */
    stateful: true,

    /**
     * Indicates whether {@link fabric.Collection.add}, {@link fabric.Collection.insertAt} and {@link fabric.Collection.remove} should also re-render canvas.
     * Disabling this option could give a great performance boost when adding/removing a lot of objects to/from canvas at once
     * (followed by a manual rendering after addition/deletion)
     * @type Boolean
     * @default
     */
    renderOnAddRemove: true,

    /**
     * Function that determines clipping of entire canvas area
     * Being passed context as first argument. See clipping canvas area in {@link https://github.com/kangax/fabric.js/wiki/FAQ}
     * @type Function
     * @default
     */
    clipTo: null,

    /**
     * Indicates whether object controls (borders/controls) are rendered above overlay image
     * @type Boolean
     * @default
     */
    controlsAboveOverlay: false,

    /**
     * Indicates whether the browser can be scrolled when using a touchscreen and dragging on the canvas
     * @type Boolean
     * @default
     */
    allowTouchScrolling: false,

    /**
     * Indicates whether this canvas will use image smoothing, this is on by default in browsers
     * @type Boolean
     * @default
     */
    imageSmoothingEnabled: true,

    /**
     * Indicates whether objects should remain in current stack position when selected. When false objects are brought to top and rendered as part of the selection group
     * @type Boolean
     * @default
     */
    preserveObjectStacking: false,

    /**
     * The transformation (in the format of Canvas transform) which focuses the viewport
     * @type Array
     * @default
     */
    viewportTransform: [1, 0, 0, 1, 0, 0],

    /**
     * Callback; invoked right before object is about to be scaled/rotated
     */
    onBeforeScaleRotate: function () {
      /* NOOP */
    },

    /**
     * @private
     * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
     * @param {Object} [options] Options object
     */
    _initStatic: function(el, options) {
      this._objects = [];

      this._createLowerCanvas(el);
      this._initOptions(options);
      this._setImageSmoothing();

      if (options.overlayImage) {
        this.setOverlayImage(options.overlayImage, this.renderAll.bind(this));
      }
      if (options.backgroundImage) {
        this.setBackgroundImage(options.backgroundImage, this.renderAll.bind(this));
      }
      if (options.backgroundColor) {
        this.setBackgroundColor(options.backgroundColor, this.renderAll.bind(this));
      }
      if (options.overlayColor) {
        this.setOverlayColor(options.overlayColor, this.renderAll.bind(this));
      }
      this.calcOffset();
    },

    /**
     * Calculates canvas element offset relative to the document
     * This method is also attached as "resize" event handler of window
     * @return {fabric.Canvas} instance
     * @chainable
     */
    calcOffset: function () {
      this._offset = getElementOffset(this.lowerCanvasEl);
      return this;
    },

    /**
     * Sets {@link fabric.StaticCanvas#overlayImage|overlay image} for this canvas
     * @param {(fabric.Image|String)} image fabric.Image instance or URL of an image to set overlay to
     * @param {Function} callback callback to invoke when image is loaded and set as an overlay
     * @param {Object} [options] Optional options to set for the {@link fabric.Image|overlay image}.
     * @return {fabric.Canvas} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/MnzHT/|jsFiddle demo}
     * @example <caption>Normal overlayImage with left/top = 0</caption>
     * canvas.setOverlayImage('http://fabricjs.com/assets/jail_cell_bars.png', canvas.renderAll.bind(canvas), {
     *   // Needed to position overlayImage at 0/0
     *   originX: 'left',
     *   originY: 'top'
     * });
     * @example <caption>overlayImage with different properties</caption>
     * canvas.setOverlayImage('http://fabricjs.com/assets/jail_cell_bars.png', canvas.renderAll.bind(canvas), {
     *   opacity: 0.5,
     *   angle: 45,
     *   left: 400,
     *   top: 400,
     *   originX: 'left',
     *   originY: 'top'
     * });
     * @example <caption>Stretched overlayImage #1 - width/height correspond to canvas width/height</caption>
     * fabric.Image.fromURL('http://fabricjs.com/assets/jail_cell_bars.png', function(img) {
     *    img.set({width: canvas.width, height: canvas.height, originX: 'left', originY: 'top'});
     *    canvas.setOverlayImage(img, canvas.renderAll.bind(canvas));
     * });
     * @example <caption>Stretched overlayImage #2 - width/height correspond to canvas width/height</caption>
     * canvas.setOverlayImage('http://fabricjs.com/assets/jail_cell_bars.png', canvas.renderAll.bind(canvas), {
     *   width: canvas.width,
     *   height: canvas.height,
     *   // Needed to position overlayImage at 0/0
     *   originX: 'left',
     *   originY: 'top'
     * });
     */
    setOverlayImage: function (image, callback, options) {
      return this.__setBgOverlayImage('overlayImage', image, callback, options);
    },

    /**
     * Sets {@link fabric.StaticCanvas#backgroundImage|background image} for this canvas
     * @param {(fabric.Image|String)} image fabric.Image instance or URL of an image to set background to
     * @param {Function} callback Callback to invoke when image is loaded and set as background
     * @param {Object} [options] Optional options to set for the {@link fabric.Image|background image}.
     * @return {fabric.Canvas} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/YH9yD/|jsFiddle demo}
     * @example <caption>Normal backgroundImage with left/top = 0</caption>
     * canvas.setBackgroundImage('http://fabricjs.com/assets/honey_im_subtle.png', canvas.renderAll.bind(canvas), {
     *   // Needed to position backgroundImage at 0/0
     *   originX: 'left',
     *   originY: 'top'
     * });
     * @example <caption>backgroundImage with different properties</caption>
     * canvas.setBackgroundImage('http://fabricjs.com/assets/honey_im_subtle.png', canvas.renderAll.bind(canvas), {
     *   opacity: 0.5,
     *   angle: 45,
     *   left: 400,
     *   top: 400,
     *   originX: 'left',
     *   originY: 'top'
     * });
     * @example <caption>Stretched backgroundImage #1 - width/height correspond to canvas width/height</caption>
     * fabric.Image.fromURL('http://fabricjs.com/assets/honey_im_subtle.png', function(img) {
     *    img.set({width: canvas.width, height: canvas.height, originX: 'left', originY: 'top'});
     *    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
     * });
     * @example <caption>Stretched backgroundImage #2 - width/height correspond to canvas width/height</caption>
     * canvas.setBackgroundImage('http://fabricjs.com/assets/honey_im_subtle.png', canvas.renderAll.bind(canvas), {
     *   width: canvas.width,
     *   height: canvas.height,
     *   // Needed to position backgroundImage at 0/0
     *   originX: 'left',
     *   originY: 'top'
     * });
     */
    setBackgroundImage: function (image, callback, options) {
      return this.__setBgOverlayImage('backgroundImage', image, callback, options);
    },

    /**
     * Sets {@link fabric.StaticCanvas#overlayColor|background color} for this canvas
     * @param {(String|fabric.Pattern)} overlayColor Color or pattern to set background color to
     * @param {Function} callback Callback to invoke when background color is set
     * @return {fabric.Canvas} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/pB55h/|jsFiddle demo}
     * @example <caption>Normal overlayColor - color value</caption>
     * canvas.setOverlayColor('rgba(255, 73, 64, 0.6)', canvas.renderAll.bind(canvas));
     * @example <caption>fabric.Pattern used as overlayColor</caption>
     * canvas.setOverlayColor({
     *   source: 'http://fabricjs.com/assets/escheresque_ste.png'
     * }, canvas.renderAll.bind(canvas));
     * @example <caption>fabric.Pattern used as overlayColor with repeat and offset</caption>
     * canvas.setOverlayColor({
     *   source: 'http://fabricjs.com/assets/escheresque_ste.png',
     *   repeat: 'repeat',
     *   offsetX: 200,
     *   offsetY: 100
     * }, canvas.renderAll.bind(canvas));
     */
    setOverlayColor: function(overlayColor, callback) {
      return this.__setBgOverlayColor('overlayColor', overlayColor, callback);
    },

    /**
     * Sets {@link fabric.StaticCanvas#backgroundColor|background color} for this canvas
     * @param {(String|fabric.Pattern)} backgroundColor Color or pattern to set background color to
     * @param {Function} callback Callback to invoke when background color is set
     * @return {fabric.Canvas} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/hXzvk/|jsFiddle demo}
     * @example <caption>Normal backgroundColor - color value</caption>
     * canvas.setBackgroundColor('rgba(255, 73, 64, 0.6)', canvas.renderAll.bind(canvas));
     * @example <caption>fabric.Pattern used as backgroundColor</caption>
     * canvas.setBackgroundColor({
     *   source: 'http://fabricjs.com/assets/escheresque_ste.png'
     * }, canvas.renderAll.bind(canvas));
     * @example <caption>fabric.Pattern used as backgroundColor with repeat and offset</caption>
     * canvas.setBackgroundColor({
     *   source: 'http://fabricjs.com/assets/escheresque_ste.png',
     *   repeat: 'repeat',
     *   offsetX: 200,
     *   offsetY: 100
     * }, canvas.renderAll.bind(canvas));
     */
    setBackgroundColor: function(backgroundColor, callback) {
      return this.__setBgOverlayColor('backgroundColor', backgroundColor, callback);
    },

    /**
     * @private
     * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-imagesmoothingenabled|WhatWG Canvas Standard}
     */
    _setImageSmoothing: function(){
      var ctx = this.getContext();

      ctx.imageSmoothingEnabled       = this.imageSmoothingEnabled;
      ctx.webkitImageSmoothingEnabled = this.imageSmoothingEnabled;
      ctx.mozImageSmoothingEnabled    = this.imageSmoothingEnabled;
      ctx.msImageSmoothingEnabled     = this.imageSmoothingEnabled;
      ctx.oImageSmoothingEnabled      = this.imageSmoothingEnabled;
    },

    /**
     * @private
     * @param {String} property Property to set ({@link fabric.StaticCanvas#backgroundImage|backgroundImage}
     * or {@link fabric.StaticCanvas#overlayImage|overlayImage})
     * @param {(fabric.Image|String|null)} image fabric.Image instance, URL of an image or null to set background or overlay to
     * @param {Function} callback Callback to invoke when image is loaded and set as background or overlay
     * @param {Object} [options] Optional options to set for the {@link fabric.Image|image}.
     */
    __setBgOverlayImage: function(property, image, callback, options) {
      if (typeof image === 'string') {
        fabric.util.loadImage(image, function(img) {
          this[property] = new fabric.Image(img, options);
          callback && callback();
        }, this);
      }
      else {
        this[property] = image;
        callback && callback();
      }

      return this;
    },

    /**
     * @private
     * @param {String} property Property to set ({@link fabric.StaticCanvas#backgroundColor|backgroundColor}
     * or {@link fabric.StaticCanvas#overlayColor|overlayColor})
     * @param {(Object|String|null)} color Object with pattern information, color value or null
     * @param {Function} [callback] Callback is invoked when color is set
     */
    __setBgOverlayColor: function(property, color, callback) {
      if (color && color.source) {
        var _this = this;
        fabric.util.loadImage(color.source, function(img) {
          _this[property] = new fabric.Pattern({
            source: img,
            repeat: color.repeat,
            offsetX: color.offsetX,
            offsetY: color.offsetY
          });
          callback && callback();
        });
      }
      else {
        this[property] = color;
        callback && callback();
      }

      return this;
    },

    /**
     * @private
     */
    _createCanvasElement: function() {
      var element = fabric.document.createElement('canvas');
      if (!element.style) {
        element.style = { };
      }
      if (!element) {
        throw CANVAS_INIT_ERROR;
      }
      this._initCanvasElement(element);
      return element;
    },

    /**
     * @private
     * @param {HTMLElement} element
     */
    _initCanvasElement: function(element) {
      fabric.util.createCanvasElement(element);

      if (typeof element.getContext === 'undefined') {
        throw CANVAS_INIT_ERROR;
      }
    },

    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initOptions: function (options) {
      for (var prop in options) {
        this[prop] = options[prop];
      }

      this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0;
      this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0;

      if (!this.lowerCanvasEl.style) {
        return;
      }

      this.lowerCanvasEl.width = this.width;
      this.lowerCanvasEl.height = this.height;

      this.lowerCanvasEl.style.width = this.width + 'px';
      this.lowerCanvasEl.style.height = this.height + 'px';

      this.viewportTransform = this.viewportTransform.slice();
    },

    /**
     * Creates a bottom canvas
     * @private
     * @param {HTMLElement} [canvasEl]
     */
    _createLowerCanvas: function (canvasEl) {
      this.lowerCanvasEl = fabric.util.getById(canvasEl) || this._createCanvasElement();
      this._initCanvasElement(this.lowerCanvasEl);

      fabric.util.addClass(this.lowerCanvasEl, 'lower-canvas');

      if (this.interactive) {
        this._applyCanvasStyle(this.lowerCanvasEl);
      }

      this.contextContainer = this.lowerCanvasEl.getContext('2d');
    },

    /**
     * Returns canvas width (in px)
     * @return {Number}
     */
    getWidth: function () {
      return this.width;
    },

    /**
     * Returns canvas height (in px)
     * @return {Number}
     */
    getHeight: function () {
      return this.height;
    },

    /**
     * Sets width of this canvas instance
     * @param {Number|String} value                         Value to set width to
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    setWidth: function (value, options) {
      return this.setDimensions({ width: value }, options);
    },

    /**
     * Sets height of this canvas instance
     * @param {Number|String} value                         Value to set height to
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    setHeight: function (value, options) {
      return this.setDimensions({ height: value }, options);
    },

    /**
     * Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)
     * @param {Object}        dimensions                    Object with width/height properties
     * @param {Number|String} [dimensions.width]            Width of canvas element
     * @param {Number|String} [dimensions.height]           Height of canvas element
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    setDimensions: function (dimensions, options) {
      var cssValue;

      options = options || {};

      for (var prop in dimensions) {
        cssValue = dimensions[prop];

        if (!options.cssOnly) {
          this._setBackstoreDimension(prop, dimensions[prop]);
          cssValue += 'px';
        }

        if (!options.backstoreOnly) {
          this._setCssDimension(prop, cssValue);
        }
      }

      if (!options.cssOnly) {
        this.renderAll();
      }

      this.calcOffset();

      return this;
    },

    /**
     * Helper for setting width/height
     * @private
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    _setBackstoreDimension: function (prop, value) {
      this.lowerCanvasEl[prop] = value;

      if (this.upperCanvasEl) {
        this.upperCanvasEl[prop] = value;
      }

      if (this.cacheCanvasEl) {
        this.cacheCanvasEl[prop] = value;
      }

      this[prop] = value;

      return this;
    },

    /**
     * Helper for setting css width/height
     * @private
     * @param {String} prop property (width|height)
     * @param {String} value value to set property to
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    _setCssDimension: function (prop, value) {
      this.lowerCanvasEl.style[prop] = value;

      if (this.upperCanvasEl) {
        this.upperCanvasEl.style[prop] = value;
      }

      if (this.wrapperEl) {
        this.wrapperEl.style[prop] = value;
      }

      return this;
    },

    /**
     * Returns canvas zoom level
     * @return {Number}
     */
    getZoom: function () {
      return Math.sqrt(this.viewportTransform[0] * this.viewportTransform[3]);
    },

    /**
     * Sets viewport transform of this canvas instance
     * @param {Array} vpt the transform in the form of context.transform
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    setViewportTransform: function (vpt) {
      this.viewportTransform = vpt;
      this.renderAll();
      for (var i = 0, len = this._objects.length; i < len; i++) {
        this._objects[i].setCoords();
      }
      return this;
    },

    /**
     * Sets zoom level of this canvas instance, zoom centered around point
     * @param {fabric.Point} point to zoom with respect to
     * @param {Number} value to set zoom to, less than 1 zooms out
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    zoomToPoint: function (point, value) {
      // TODO: just change the scale, preserve other transformations
      var before = point;
      point = fabric.util.transformPoint(point, fabric.util.invertTransform(this.viewportTransform));
      this.viewportTransform[0] = value;
      this.viewportTransform[3] = value;
      var after = fabric.util.transformPoint(point, this.viewportTransform);
      this.viewportTransform[4] += before.x - after.x;
      this.viewportTransform[5] += before.y - after.y;
      this.renderAll();
      for (var i = 0, len = this._objects.length; i < len; i++) {
        this._objects[i].setCoords();
      }
      return this;
    },

    /**
     * Sets zoom level of this canvas instance
     * @param {Number} value to set zoom to, less than 1 zooms out
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    setZoom: function (value) {
      this.zoomToPoint(new fabric.Point(0, 0), value);
      return this;
    },

    /**
     * Pan viewport so as to place point at top left corner of canvas
     * @param {fabric.Point} point to move to
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    absolutePan: function (point) {
      this.viewportTransform[4] = -point.x;
      this.viewportTransform[5] = -point.y;
      this.renderAll();
      for (var i = 0, len = this._objects.length; i < len; i++) {
        this._objects[i].setCoords();
      }
      return this;
    },

    /**
     * Pans viewpoint relatively
     * @param {fabric.Point} point (position vector) to move by
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    relativePan: function (point) {
      return this.absolutePan(new fabric.Point(
        -point.x - this.viewportTransform[4],
        -point.y - this.viewportTransform[5]
      ));
    },

    /**
     * Returns &lt;canvas> element corresponding to this instance
     * @return {HTMLCanvasElement}
     */
    getElement: function () {
      return this.lowerCanvasEl;
    },

    /**
     * Returns currently selected object, if any
     * @return {fabric.Object}
     */
    getActiveObject: function() {
      return null;
    },

    /**
     * Returns currently selected group of object, if any
     * @return {fabric.Group}
     */
    getActiveGroup: function() {
      return null;
    },

    /**
     * Given a context, renders an object on that context
     * @param {CanvasRenderingContext2D} ctx Context to render object on
     * @param {fabric.Object} object Object to render
     * @private
     */
    _draw: function (ctx, object) {
      if (!object) {
        return;
      }

      ctx.save();
      var v = this.viewportTransform;
      ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
      if (this._shouldRenderObject(object)) {
        object.render(ctx);
      }
      ctx.restore();
      if (!this.controlsAboveOverlay) {
        object._renderControls(ctx);
      }
    },

    _shouldRenderObject: function(object) {
      if (!object) {
        return false;
      }
      return (object !== this.getActiveGroup() || !this.preserveObjectStacking);
    },

    /**
     * @private
     * @param {fabric.Object} obj Object that was added
     */
    _onObjectAdded: function(obj) {
      this.stateful && obj.setupState();
      obj.canvas = this;
      obj.setCoords();
      this.fire('object:added', { target: obj });
      obj.fire('added');
    },

    /**
     * @private
     * @param {fabric.Object} obj Object that was removed
     */
    _onObjectRemoved: function(obj) {
      // removing active object should fire "selection:cleared" events
      if (this.getActiveObject() === obj) {
        this.fire('before:selection:cleared', { target: obj });
        this._discardActiveObject();
        this.fire('selection:cleared');
      }

      this.fire('object:removed', { target: obj });
      obj.fire('removed');
    },

    /**
     * Clears specified context of canvas element
     * @param {CanvasRenderingContext2D} ctx Context to clear
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    clearContext: function(ctx) {
      ctx.clearRect(0, 0, this.width, this.height);
      return this;
    },

    /**
     * Returns context of canvas where objects are drawn
     * @return {CanvasRenderingContext2D}
     */
    getContext: function () {
      return this.contextContainer;
    },

    /**
     * Clears all contexts (background, main, top) of an instance
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    clear: function () {
      this._objects.length = 0;
      if (this.discardActiveGroup) {
        this.discardActiveGroup();
      }
      if (this.discardActiveObject) {
        this.discardActiveObject();
      }
      this.clearContext(this.contextContainer);
      if (this.contextTop) {
        this.clearContext(this.contextTop);
      }
      this.fire('canvas:cleared');
      this.renderAll();
      return this;
    },

    /**
     * Renders both the top canvas and the secondary container canvas.
     * @param {Boolean} [allOnTop] Whether we want to force all images to be rendered on the top canvas
     * @return {fabric.Canvas} instance
     * @chainable
     */
    renderAll: function (allOnTop) {
      var canvasToDrawOn = this[(allOnTop === true && this.interactive) ? 'contextTop' : 'contextContainer'],
          activeGroup = this.getActiveGroup();

      if (this.contextTop && this.selection && !this._groupSelector) {
        this.clearContext(this.contextTop);
      }

      if (!allOnTop) {
        this.clearContext(canvasToDrawOn);
      }

      this.fire('before:render');

      if (this.clipTo) {
        fabric.util.clipContext(this, canvasToDrawOn);
      }

      this._renderBackground(canvasToDrawOn);
      this._renderObjects(canvasToDrawOn, activeGroup);
      this._renderActiveGroup(canvasToDrawOn, activeGroup);

      if (this.clipTo) {
        canvasToDrawOn.restore();
      }

      this._renderOverlay(canvasToDrawOn);

      if (this.controlsAboveOverlay && this.interactive) {
        this.drawControls(canvasToDrawOn);
      }

      this.fire('after:render');

      return this;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {fabric.Group} activeGroup
     */
    _renderObjects: function(ctx, activeGroup) {
      var i, length;

      // fast path
      if (!activeGroup || this.preserveObjectStacking) {
        for (i = 0, length = this._objects.length; i < length; ++i) {
          this._draw(ctx, this._objects[i]);
        }
      }
      else {
        for (i = 0, length = this._objects.length; i < length; ++i) {
          if (this._objects[i] && !activeGroup.contains(this._objects[i])) {
            this._draw(ctx, this._objects[i]);
          }
        }
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {fabric.Group} activeGroup
     */
    _renderActiveGroup: function(ctx, activeGroup) {

      // delegate rendering to group selection (if one exists)
      if (activeGroup) {

        //Store objects in group preserving order, then replace
        var sortedObjects = [];
        this.forEachObject(function (object) {
          if (activeGroup.contains(object)) {
            sortedObjects.push(object);
          }
        });
        activeGroup._set('objects', sortedObjects);
        this._draw(ctx, activeGroup);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderBackground: function(ctx) {
      if (this.backgroundColor) {
        ctx.fillStyle = this.backgroundColor.toLive
          ? this.backgroundColor.toLive(ctx)
          : this.backgroundColor;

        ctx.fillRect(
          this.backgroundColor.offsetX || 0,
          this.backgroundColor.offsetY || 0,
          this.width,
          this.height);
      }
      if (this.backgroundImage) {
        this._draw(ctx, this.backgroundImage);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderOverlay: function(ctx) {
      if (this.overlayColor) {
        ctx.fillStyle = this.overlayColor.toLive
          ? this.overlayColor.toLive(ctx)
          : this.overlayColor;

        ctx.fillRect(
          this.overlayColor.offsetX || 0,
          this.overlayColor.offsetY || 0,
          this.width,
          this.height);
      }
      if (this.overlayImage) {
        this._draw(ctx, this.overlayImage);
      }
    },

    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    renderTop: function () {
      var ctx = this.contextTop || this.contextContainer;
      this.clearContext(ctx);

      // we render the top context - last object
      if (this.selection && this._groupSelector) {
        this._drawSelection();
      }

      // delegate rendering to group selection if one exists
      // used for drawing selection borders/controls
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        activeGroup.render(ctx);
      }

      this._renderOverlay(ctx);

      this.fire('after:render');

      return this;
    },

    /**
     * Returns coordinates of a center of canvas.
     * Returned value is an object with top and left properties
     * @return {Object} object with "top" and "left" number values
     */
    getCenter: function () {
      return {
        top: this.getHeight() / 2,
        left: this.getWidth() / 2
      };
    },

    /**
     * Centers object horizontally.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     * @param {fabric.Object} object Object to center horizontally
     * @return {fabric.Canvas} thisArg
     */
    centerObjectH: function (object) {
      this._centerObject(object, new fabric.Point(this.getCenter().left, object.getCenterPoint().y));
      this.renderAll();
      return this;
    },

    /**
     * Centers object vertically.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     * @param {fabric.Object} object Object to center vertically
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    centerObjectV: function (object) {
      this._centerObject(object, new fabric.Point(object.getCenterPoint().x, this.getCenter().top));
      this.renderAll();
      return this;
    },

    /**
     * Centers object vertically and horizontally.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     * @param {fabric.Object} object Object to center vertically and horizontally
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    centerObject: function(object) {
      var center = this.getCenter();

      this._centerObject(object, new fabric.Point(center.left, center.top));
      this.renderAll();
      return this;
    },

    /**
     * @private
     * @param {fabric.Object} object Object to center
     * @param {fabric.Point} center Center point
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    _centerObject: function(object, center) {
      object.setPositionByOrigin(center, 'center', 'center');
      return this;
    },

    /**
     * Returs dataless JSON representation of canvas
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {String} json string
     */
    toDatalessJSON: function (propertiesToInclude) {
      return this.toDatalessObject(propertiesToInclude);
    },

    /**
     * Returns object representation of canvas
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function (propertiesToInclude) {
      return this._toObjectMethod('toObject', propertiesToInclude);
    },

    /**
     * Returns dataless object representation of canvas
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toDatalessObject: function (propertiesToInclude) {
      return this._toObjectMethod('toDatalessObject', propertiesToInclude);
    },

    /**
     * @private
     */
    _toObjectMethod: function (methodName, propertiesToInclude) {

      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        this.discardActiveGroup();
      }

      var data = {
        objects: this._toObjects(methodName, propertiesToInclude)
      };

      extend(data, this.__serializeBgOverlay());

      fabric.util.populateWithProperties(this, data, propertiesToInclude);

      if (activeGroup) {
        this.setActiveGroup(new fabric.Group(activeGroup.getObjects(), {
          originX: 'center',
          originY: 'center'
        }));
        activeGroup.forEachObject(function(o) {
          o.set('active', true);
        });

        if (this._currentTransform) {
          this._currentTransform.target = this.getActiveGroup();
        }
      }

      return data;
    },

    /**
     * @private
     */
    _toObjects: function(methodName, propertiesToInclude) {
      return this.getObjects().map(function(instance) {
        return this._toObject(instance, methodName, propertiesToInclude);
      }, this);
    },

    /**
     * @private
     */
    _toObject: function(instance, methodName, propertiesToInclude) {
      var originalValue;

      if (!this.includeDefaultValues) {
        originalValue = instance.includeDefaultValues;
        instance.includeDefaultValues = false;
      }
      var object = instance[methodName](propertiesToInclude);
      if (!this.includeDefaultValues) {
        instance.includeDefaultValues = originalValue;
      }
      return object;
    },

    /**
     * @private
     */
    __serializeBgOverlay: function() {
      var data = {
        background: (this.backgroundColor && this.backgroundColor.toObject)
          ? this.backgroundColor.toObject()
          : this.backgroundColor
      };

      if (this.overlayColor) {
        data.overlay = this.overlayColor.toObject
          ? this.overlayColor.toObject()
          : this.overlayColor;
      }
      if (this.backgroundImage) {
        data.backgroundImage = this.backgroundImage.toObject();
      }
      if (this.overlayImage) {
        data.overlayImage = this.overlayImage.toObject();
      }

      return data;
    },

    /* _TO_SVG_START_ */
    /**
     * When true, getSvgTransform() will apply the StaticCanvas.viewportTransform to the SVG transformation. When true,
     * a zoomed canvas will then produce zoomed SVG output.
     * @type Boolean
     * @default
     */
    svgViewportTransformation: true,

    /**
     * Returns SVG representation of canvas
     * @function
     * @param {Object} [options] Options object for SVG output
     * @param {Boolean} [options.suppressPreamble=false] If true xml tag is not included
     * @param {Object} [options.viewBox] SVG viewbox object
     * @param {Number} [options.viewBox.x] x-cooridnate of viewbox
     * @param {Number} [options.viewBox.y] y-coordinate of viewbox
     * @param {Number} [options.viewBox.width] Width of viewbox
     * @param {Number} [options.viewBox.height] Height of viewbox
     * @param {String} [options.encoding=UTF-8] Encoding of SVG output
     * @param {Function} [reviver] Method for further parsing of svg elements, called after each fabric object converted into svg representation.
     * @return {String} SVG string
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-3/#serialization}
     * @see {@link http://jsfiddle.net/fabricjs/jQ3ZZ/|jsFiddle demo}
     * @example <caption>Normal SVG output</caption>
     * var svg = canvas.toSVG();
     * @example <caption>SVG output without preamble (without &lt;?xml ../>)</caption>
     * var svg = canvas.toSVG({suppressPreamble: true});
     * @example <caption>SVG output with viewBox attribute</caption>
     * var svg = canvas.toSVG({
     *   viewBox: {
     *     x: 100,
     *     y: 100,
     *     width: 200,
     *     height: 300
     *   }
     * });
     * @example <caption>SVG output with different encoding (default: UTF-8)</caption>
     * var svg = canvas.toSVG({encoding: 'ISO-8859-1'});
     * @example <caption>Modify SVG output with reviver function</caption>
     * var svg = canvas.toSVG(null, function(svg) {
     *   return svg.replace('stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; ', '');
     * });
     */
    toSVG: function(options, reviver) {
      options || (options = { });

      var markup = [];

      this._setSVGPreamble(markup, options);
      this._setSVGHeader(markup, options);

      this._setSVGBgOverlayColor(markup, 'backgroundColor');
      this._setSVGBgOverlayImage(markup, 'backgroundImage');

      this._setSVGObjects(markup, reviver);

      this._setSVGBgOverlayColor(markup, 'overlayColor');
      this._setSVGBgOverlayImage(markup, 'overlayImage');

      markup.push('</svg>');

      return markup.join('');
    },

    /**
     * @private
     */
    _setSVGPreamble: function(markup, options) {
      if (!options.suppressPreamble) {
        markup.push(
          '<?xml version="1.0" encoding="', (options.encoding || 'UTF-8'), '" standalone="no" ?>',
            '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ',
              '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
        );
      }
    },

    /**
     * @private
     */
    _setSVGHeader: function(markup, options) {
      var width, height, vpt;

      if (options.viewBox) {
        width = options.viewBox.width;
        height = options.viewBox.height;
      }
      else {
        width = this.width;
        height = this.height;
        if (!this.svgViewportTransformation) {
          vpt = this.viewportTransform;
          width /= vpt[0];
          height /= vpt[3];
        }
      }

      markup.push(
        '<svg ',
          'xmlns="http://www.w3.org/2000/svg" ',
          'xmlns:xlink="http://www.w3.org/1999/xlink" ',
          'version="1.1" ',
          'width="', width, '" ',
          'height="', height, '" ',
          (this.backgroundColor && !this.backgroundColor.toLive
            ? 'style="background-color: ' + this.backgroundColor + '" '
            : null),
          (options.viewBox
              ? 'viewBox="' +
                options.viewBox.x + ' ' +
                options.viewBox.y + ' ' +
                options.viewBox.width + ' ' +
                options.viewBox.height + '" '
              : null),
          'xml:space="preserve">',
        '<desc>Created with Fabric.js ', fabric.version, '</desc>',
        '<defs>',
          fabric.createSVGFontFacesMarkup(this.getObjects()),
          fabric.createSVGRefElementsMarkup(this),
        '</defs>'
      );
    },

    /**
     * @private
     */
    _setSVGObjects: function(markup, reviver) {
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        this.discardActiveGroup();
      }
      for (var i = 0, objects = this.getObjects(), len = objects.length; i < len; i++) {
        markup.push(objects[i].toSVG(reviver));
      }
      if (activeGroup) {
        this.setActiveGroup(new fabric.Group(activeGroup.getObjects()));
        activeGroup.forEachObject(function(o) {
          o.set('active', true);
        });
      }
    },

    /**
     * @private
     */
    _setSVGBgOverlayImage: function(markup, property) {
      if (this[property] && this[property].toSVG) {
        markup.push(this[property].toSVG());
      }
    },

    /**
     * @private
     */
    _setSVGBgOverlayColor: function(markup, property) {
      if (this[property] && this[property].source) {
        markup.push(
          '<rect x="', this[property].offsetX, '" y="', this[property].offsetY, '" ',
            'width="',
              (this[property].repeat === 'repeat-y' || this[property].repeat === 'no-repeat'
                ? this[property].source.width
                : this.width),
            '" height="',
              (this[property].repeat === 'repeat-x' || this[property].repeat === 'no-repeat'
                ? this[property].source.height
                : this.height),
            '" fill="url(#' + property + 'Pattern)"',
          '></rect>'
        );
      }
      else if (this[property] && property === 'overlayColor') {
        markup.push(
          '<rect x="0" y="0" ',
            'width="', this.width,
            '" height="', this.height,
            '" fill="', this[property], '"',
          '></rect>'
        );
      }
    },
    /* _TO_SVG_END_ */

    /**
     * Moves an object to the bottom of the stack of drawn objects
     * @param {fabric.Object} object Object to send to back
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    sendToBack: function (object) {
      removeFromArray(this._objects, object);
      this._objects.unshift(object);
      return this.renderAll && this.renderAll();
    },

    /**
     * Moves an object to the top of the stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    bringToFront: function (object) {
      removeFromArray(this._objects, object);
      this._objects.push(object);
      return this.renderAll && this.renderAll();
    },

    /**
     * Moves an object down in stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @param {Boolean} [intersecting] If `true`, send object behind next lower intersecting object
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    sendBackwards: function (object, intersecting) {
      var idx = this._objects.indexOf(object);

      // if object is not on the bottom of stack
      if (idx !== 0) {
        var newIdx = this._findNewLowerIndex(object, idx, intersecting);

        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
        this.renderAll && this.renderAll();
      }
      return this;
    },

    /**
     * @private
     */
    _findNewLowerIndex: function(object, idx, intersecting) {
      var newIdx;

      if (intersecting) {
        newIdx = idx;

        // traverse down the stack looking for the nearest intersecting object
        for (var i = idx - 1; i >= 0; --i) {

          var isIntersecting = object.intersectsWithObject(this._objects[i]) ||
                               object.isContainedWithinObject(this._objects[i]) ||
                               this._objects[i].isContainedWithinObject(object);

          if (isIntersecting) {
            newIdx = i;
            break;
          }
        }
      }
      else {
        newIdx = idx - 1;
      }

      return newIdx;
    },

    /**
     * Moves an object up in stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @param {Boolean} [intersecting] If `true`, send object in front of next upper intersecting object
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    bringForward: function (object, intersecting) {
      var idx = this._objects.indexOf(object);

      // if object is not on top of stack (last item in an array)
      if (idx !== this._objects.length - 1) {
        var newIdx = this._findNewUpperIndex(object, idx, intersecting);

        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
        this.renderAll && this.renderAll();
      }
      return this;
    },

    /**
     * @private
     */
    _findNewUpperIndex: function(object, idx, intersecting) {
      var newIdx;

      if (intersecting) {
        newIdx = idx;

        // traverse up the stack looking for the nearest intersecting object
        for (var i = idx + 1; i < this._objects.length; ++i) {

          var isIntersecting = object.intersectsWithObject(this._objects[i]) ||
                               object.isContainedWithinObject(this._objects[i]) ||
                               this._objects[i].isContainedWithinObject(object);

          if (isIntersecting) {
            newIdx = i;
            break;
          }
        }
      }
      else {
        newIdx = idx + 1;
      }

      return newIdx;
    },

    /**
     * Moves an object to specified level in stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @param {Number} index Position to move to
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    moveTo: function (object, index) {
      removeFromArray(this._objects, object);
      this._objects.splice(index, 0, object);
      return this.renderAll && this.renderAll();
    },

    /**
     * Clears a canvas element and removes all event listeners
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    dispose: function () {
      this.clear();
      this.interactive && this.removeListeners();
      return this;
    },

    /**
     * Returns a string representation of an instance
     * @return {String} string representation of an instance
     */
    toString: function () {
      return '#<fabric.Canvas (' + this.complexity() + '): ' +
               '{ objects: ' + this.getObjects().length + ' }>';
    }
  });

  extend(fabric.StaticCanvas.prototype, fabric.Observable);
  extend(fabric.StaticCanvas.prototype, fabric.Collection);
  extend(fabric.StaticCanvas.prototype, fabric.DataURLExporter);

  extend(fabric.StaticCanvas, /** @lends fabric.StaticCanvas */ {

    /**
     * @static
     * @type String
     * @default
     */
    EMPTY_JSON: '{"objects": [], "background": "white"}',

    /**
     * Provides a way to check support of some of the canvas methods
     * (either those of HTMLCanvasElement itself, or rendering context)
     *
     * @param {String} methodName Method to check support for;
     *                            Could be one of "getImageData", "toDataURL", "toDataURLWithQuality" or "setLineDash"
     * @return {Boolean | null} `true` if method is supported (or at least exists),
     *                          `null` if canvas element or context can not be initialized
     */
    supports: function (methodName) {
      var el = fabric.util.createCanvasElement();

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

        case 'setLineDash':
          return typeof ctx.setLineDash !== 'undefined';

        case 'toDataURL':
          return typeof el.toDataURL !== 'undefined';

        case 'toDataURLWithQuality':
          try {
            el.toDataURL('image/jpeg', 0);
            return true;
          }
          catch (e) { }
          return false;

        default:
          return null;
      }
    }
  });

  /**
   * Returns JSON representation of canvas
   * @function
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {String} JSON string
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3/#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/pec86/|jsFiddle demo}
   * @example <caption>JSON without additional properties</caption>
   * var json = canvas.toJSON();
   * @example <caption>JSON with additional properties included</caption>
   * var json = canvas.toJSON(['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY', 'lockUniScaling']);
   * @example <caption>JSON without default values</caption>
   * canvas.includeDefaultValues = false;
   * var json = canvas.toJSON();
   */
  fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject;

})();


fabric.util.object.extend(fabric.StaticCanvas.prototype, /** @lends fabric.StaticCanvas.prototype */ {

  /**
   * Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately
   * @param {Object} [options] Options object
   * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
   * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
   * @see {@link http://jsfiddle.net/fabricjs/NfZVb/|jsFiddle demo}
   * @example <caption>Generate jpeg dataURL with lower quality</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'jpeg',
   *   quality: 0.8
   * });
   * @example <caption>Generate cropped png dataURL (clipping of canvas)</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   left: 100,
   *   top: 100,
   *   width: 200,
   *   height: 200
   * });
   * @example <caption>Generate double scaled png dataURL</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   multiplier: 2
   * });
   */
  toDataURL: function (options) {
    options || (options = { });

    var format = options.format || 'png',
        quality = options.quality || 1,
        multiplier = options.multiplier || 1,
        cropping = {
          left: options.left,
          top: options.top,
          width: options.width,
          height: options.height
        };

    if (multiplier !== 1) {
      return this.__toDataURLWithMultiplier(format, quality, cropping, multiplier);
    }
    else {
      return this.__toDataURL(format, quality, cropping);
    }
  },

  /**
   * @private
   */
  __toDataURL: function(format, quality, cropping) {

    this.renderAll(true);

    var canvasEl = this.upperCanvasEl || this.lowerCanvasEl,
        croppedCanvasEl = this.__getCroppedCanvas(canvasEl, cropping);

    // to avoid common confusion https://github.com/kangax/fabric.js/issues/806
    if (format === 'jpg') {
      format = 'jpeg';
    }

    var data = (fabric.StaticCanvas.supports('toDataURLWithQuality'))
              ? (croppedCanvasEl || canvasEl).toDataURL('image/' + format, quality)
              : (croppedCanvasEl || canvasEl).toDataURL('image/' + format);

    this.contextTop && this.clearContext(this.contextTop);
    this.renderAll();

    if (croppedCanvasEl) {
      croppedCanvasEl = null;
    }

    return data;
  },

  /**
   * @private
   */
  __getCroppedCanvas: function(canvasEl, cropping) {

    var croppedCanvasEl,
        croppedCtx,
        shouldCrop = 'left' in cropping ||
                     'top' in cropping ||
                     'width' in cropping ||
                     'height' in cropping;

    if (shouldCrop) {

      croppedCanvasEl = fabric.util.createCanvasElement();
      croppedCtx = croppedCanvasEl.getContext('2d');

      croppedCanvasEl.width = cropping.width || this.width;
      croppedCanvasEl.height = cropping.height || this.height;

      croppedCtx.drawImage(canvasEl, -cropping.left || 0, -cropping.top || 0);
    }

    return croppedCanvasEl;
  },

  /**
   * @private
   */
  __toDataURLWithMultiplier: function(format, quality, cropping, multiplier) {

    var origWidth = this.getWidth(),
        origHeight = this.getHeight(),
        scaledWidth = origWidth * multiplier,
        scaledHeight = origHeight * multiplier,
        activeObject = this.getActiveObject(),
        activeGroup = this.getActiveGroup(),

        ctx = this.contextTop || this.contextContainer;

    if (multiplier > 1) {
      this.setWidth(scaledWidth).setHeight(scaledHeight);
    }
    ctx.scale(multiplier, multiplier);

    if (cropping.left) {
      cropping.left *= multiplier;
    }
    if (cropping.top) {
      cropping.top *= multiplier;
    }
    if (cropping.width) {
      cropping.width *= multiplier;
    }
    else if (multiplier < 1) {
      cropping.width = scaledWidth;
    }
    if (cropping.height) {
      cropping.height *= multiplier;
    }
    else if (multiplier < 1) {
      cropping.height = scaledHeight;
    }

    if (activeGroup) {
      // not removing group due to complications with restoring it with correct state afterwords
      this._tempRemoveBordersControlsFromGroup(activeGroup);
    }
    else if (activeObject && this.deactivateAll) {
      this.deactivateAll();
    }

    this.renderAll(true);

    var data = this.__toDataURL(format, quality, cropping);

    // restoring width, height for `renderAll` to draw
    // background properly (while context is scaled)
    this.width = origWidth;
    this.height = origHeight;

    ctx.scale(1 / multiplier,  1 / multiplier);
    this.setWidth(origWidth).setHeight(origHeight);

    if (activeGroup) {
      this._restoreBordersControlsOnGroup(activeGroup);
    }
    else if (activeObject && this.setActiveObject) {
      this.setActiveObject(activeObject);
    }

    this.contextTop && this.clearContext(this.contextTop);
    this.renderAll();

    return data;
  },

  /**
   * Exports canvas element to a dataurl image (allowing to change image size via multiplier).
   * @deprecated since 1.0.13
   * @param {String} format (png|jpeg)
   * @param {Number} multiplier
   * @param {Number} quality (0..1)
   * @return {String}
   */
  toDataURLWithMultiplier: function (format, multiplier, quality) {
    return this.toDataURL({
      format: format,
      multiplier: multiplier,
      quality: quality
    });
  },

  /**
   * @private
   */
  _tempRemoveBordersControlsFromGroup: function(group) {
    group.origHasControls = group.hasControls;
    group.origBorderColor = group.borderColor;

    group.hasControls = true;
    group.borderColor = 'rgba(0,0,0,0)';

    group.forEachObject(function(o) {
      o.origBorderColor = o.borderColor;
      o.borderColor = 'rgba(0,0,0,0)';
    });
  },

  /**
   * @private
   */
  _restoreBordersControlsOnGroup: function(group) {
    group.hideControls = group.origHideControls;
    group.borderColor = group.origBorderColor;

    group.forEachObject(function(o) {
      o.borderColor = o.origBorderColor;
      delete o.origBorderColor;
    });
  }
});


(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      toFixed = fabric.util.toFixed,
      capitalize = fabric.util.string.capitalize,
      degreesToRadians = fabric.util.degreesToRadians,
      supportsLineDash = fabric.StaticCanvas.supports('setLineDash');

  if (fabric.Object) {
    return;
  }

  /**
   * Root object class from which all 2d shape classes inherit from
   * @class fabric.Object
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1/#objects}
   * @see {@link fabric.Object#initialize} for constructor definition
   *
   * @fires added
   * @fires removed
   *
   * @fires selected
   * @fires modified
   * @fires rotating
   * @fires scaling
   * @fires moving
   *
   * @fires mousedown
   * @fires mouseup
   */
  fabric.Object = fabric.util.createClass(/** @lends fabric.Object.prototype */ {

    /**
     * Retrieves object's {@link fabric.Object#clipTo|clipping function}
     * @method getClipTo
     * @memberOf fabric.Object.prototype
     * @return {Function}
     */

    /**
     * Sets object's {@link fabric.Object#clipTo|clipping function}
     * @method setClipTo
     * @memberOf fabric.Object.prototype
     * @param {Function} clipTo Clipping function
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#transformMatrix|transformMatrix}
     * @method getTransformMatrix
     * @memberOf fabric.Object.prototype
     * @return {Array} transformMatrix
     */

    /**
     * Sets object's {@link fabric.Object#transformMatrix|transformMatrix}
     * @method setTransformMatrix
     * @memberOf fabric.Object.prototype
     * @param {Array} transformMatrix
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#visible|visible} state
     * @method getVisible
     * @memberOf fabric.Object.prototype
     * @return {Boolean} True if visible
     */

    /**
     * Sets object's {@link fabric.Object#visible|visible} state
     * @method setVisible
     * @memberOf fabric.Object.prototype
     * @param {Boolean} value visible value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#shadow|shadow}
     * @method getShadow
     * @memberOf fabric.Object.prototype
     * @return {Object} Shadow instance
     */

    /**
     * Retrieves object's {@link fabric.Object#stroke|stroke}
     * @method getStroke
     * @memberOf fabric.Object.prototype
     * @return {String} stroke value
     */

    /**
     * Sets object's {@link fabric.Object#stroke|stroke}
     * @method setStroke
     * @memberOf fabric.Object.prototype
     * @param {String} value stroke value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#strokeWidth|strokeWidth}
     * @method getStrokeWidth
     * @memberOf fabric.Object.prototype
     * @return {Number} strokeWidth value
     */

    /**
     * Sets object's {@link fabric.Object#strokeWidth|strokeWidth}
     * @method setStrokeWidth
     * @memberOf fabric.Object.prototype
     * @param {Number} value strokeWidth value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#originX|originX}
     * @method getOriginX
     * @memberOf fabric.Object.prototype
     * @return {String} originX value
     */

    /**
     * Sets object's {@link fabric.Object#originX|originX}
     * @method setOriginX
     * @memberOf fabric.Object.prototype
     * @param {String} value originX value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#originY|originY}
     * @method getOriginY
     * @memberOf fabric.Object.prototype
     * @return {String} originY value
     */

    /**
     * Sets object's {@link fabric.Object#originY|originY}
     * @method setOriginY
     * @memberOf fabric.Object.prototype
     * @param {String} value originY value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#fill|fill}
     * @method getFill
     * @memberOf fabric.Object.prototype
     * @return {String} Fill value
     */

    /**
     * Sets object's {@link fabric.Object#fill|fill}
     * @method setFill
     * @memberOf fabric.Object.prototype
     * @param {String} value Fill value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#opacity|opacity}
     * @method getOpacity
     * @memberOf fabric.Object.prototype
     * @return {Number} Opacity value (0-1)
     */

    /**
     * Sets object's {@link fabric.Object#opacity|opacity}
     * @method setOpacity
     * @memberOf fabric.Object.prototype
     * @param {Number} value Opacity value (0-1)
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#angle|angle} (in degrees)
     * @method getAngle
     * @memberOf fabric.Object.prototype
     * @return {Number}
     */

    /**
     * Sets object's {@link fabric.Object#angle|angle}
     * @method setAngle
     * @memberOf fabric.Object.prototype
     * @param {Number} value Angle value (in degrees)
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#top|top position}
     * @method getTop
     * @memberOf fabric.Object.prototype
     * @return {Number} Top value (in pixels)
     */

    /**
     * Sets object's {@link fabric.Object#top|top position}
     * @method setTop
     * @memberOf fabric.Object.prototype
     * @param {Number} value Top value (in pixels)
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#left|left position}
     * @method getLeft
     * @memberOf fabric.Object.prototype
     * @return {Number} Left value (in pixels)
     */

    /**
     * Sets object's {@link fabric.Object#left|left position}
     * @method setLeft
     * @memberOf fabric.Object.prototype
     * @param {Number} value Left value (in pixels)
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#scaleX|scaleX} value
     * @method getScaleX
     * @memberOf fabric.Object.prototype
     * @return {Number} scaleX value
     */

    /**
     * Sets object's {@link fabric.Object#scaleX|scaleX} value
     * @method setScaleX
     * @memberOf fabric.Object.prototype
     * @param {Number} value scaleX value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#scaleY|scaleY} value
     * @method getScaleY
     * @memberOf fabric.Object.prototype
     * @return {Number} scaleY value
     */

    /**
     * Sets object's {@link fabric.Object#scaleY|scaleY} value
     * @method setScaleY
     * @memberOf fabric.Object.prototype
     * @param {Number} value scaleY value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#flipX|flipX} value
     * @method getFlipX
     * @memberOf fabric.Object.prototype
     * @return {Boolean} flipX value
     */

    /**
     * Sets object's {@link fabric.Object#flipX|flipX} value
     * @method setFlipX
     * @memberOf fabric.Object.prototype
     * @param {Boolean} value flipX value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Retrieves object's {@link fabric.Object#flipY|flipY} value
     * @method getFlipY
     * @memberOf fabric.Object.prototype
     * @return {Boolean} flipY value
     */

    /**
     * Sets object's {@link fabric.Object#flipY|flipY} value
     * @method setFlipY
     * @memberOf fabric.Object.prototype
     * @param {Boolean} value flipY value
     * @return {fabric.Object} thisArg
     * @chainable
     */

    /**
     * Type of an object (rect, circle, path, etc.)
     * @type String
     * @default
     */
    type:                     'object',

    /**
     * Horizontal origin of transformation of an object (one of "left", "right", "center")
     * @type String
     * @default
     */
    originX:                  'left',

    /**
     * Vertical origin of transformation of an object (one of "top", "bottom", "center")
     * @type String
     * @default
     */
    originY:                  'top',

    /**
     * Top position of an object. Note that by default it's relative to object center. You can change this by setting originY={top/center/bottom}
     * @type Number
     * @default
     */
    top:                      0,

    /**
     * Left position of an object. Note that by default it's relative to object center. You can change this by setting originX={left/center/right}
     * @type Number
     * @default
     */
    left:                     0,

    /**
     * Object width
     * @type Number
     * @default
     */
    width:                    0,

    /**
     * Object height
     * @type Number
     * @default
     */
    height:                   0,

    /**
     * Object scale factor (horizontal)
     * @type Number
     * @default
     */
    scaleX:                   1,

    /**
     * Object scale factor (vertical)
     * @type Number
     * @default
     */
    scaleY:                   1,

    /**
     * When true, an object is rendered as flipped horizontally
     * @type Boolean
     * @default
     */
    flipX:                    false,

    /**
     * When true, an object is rendered as flipped vertically
     * @type Boolean
     * @default
     */
    flipY:                    false,

    /**
     * Opacity of an object
     * @type Number
     * @default
     */
    opacity:                  1,

    /**
     * Angle of rotation of an object (in degrees)
     * @type Number
     * @default
     */
    angle:                    0,

    /**
     * Size of object's controlling corners (in pixels)
     * @type Number
     * @default
     */
    cornerSize:               12,

    /**
     * When true, object's controlling corners are rendered as transparent inside (i.e. stroke instead of fill)
     * @type Boolean
     * @default
     */
    transparentCorners:       true,

    /**
     * Default cursor value used when hovering over this object on canvas
     * @type String
     * @default
     */
    hoverCursor:              null,

    /**
     * Padding between object and its controlling borders (in pixels)
     * @type Number
     * @default
     */
    padding:                  0,

    /**
     * Color of controlling borders of an object (when it's active)
     * @type String
     * @default
     */
    borderColor:              'rgba(102,153,255,0.75)',

    /**
     * Color of controlling corners of an object (when it's active)
     * @type String
     * @default
     */
    cornerColor:              'rgba(102,153,255,0.5)',

    /**
     * When true, this object will use center point as the origin of transformation
     * when being scaled via the controls.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredScaling:          false,

    /**
     * When true, this object will use center point as the origin of transformation
     * when being rotated via the controls.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredRotation:         true,

    /**
     * Color of object's fill
     * @type String
     * @default
     */
    fill:                     'rgb(0,0,0)',

    /**
     * Fill rule used to fill an object
     * @type String
     * @default
     */
    fillRule:                 'source-over',

    /**
     * Background color of an object. Only works with text objects at the moment.
     * @type String
     * @default
     */
    backgroundColor:          '',

    /**
     * When defined, an object is rendered via stroke and this property specifies its color
     * @type String
     * @default
     */
    stroke:                   null,

    /**
     * Width of a stroke used to render this object
     * @type Number
     * @default
     */
    strokeWidth:              1,

    /**
     * Array specifying dash pattern of an object's stroke (stroke must be defined)
     * @type Array
     */
    strokeDashArray:          null,

    /**
     * Line endings style of an object's stroke (one of "butt", "round", "square")
     * @type String
     * @default
     */
    strokeLineCap:            'butt',

    /**
     * Corner style of an object's stroke (one of "bevil", "round", "miter")
     * @type String
     * @default
     */
    strokeLineJoin:           'miter',

    /**
     * Maximum miter length (used for strokeLineJoin = "miter") of an object's stroke
     * @type Number
     * @default
     */
    strokeMiterLimit:         10,

    /**
     * Shadow object representing shadow of this shape
     * @type fabric.Shadow
     * @default
     */
    shadow:                   null,

    /**
     * Opacity of object's controlling borders when object is active and moving
     * @type Number
     * @default
     */
    borderOpacityWhenMoving:  0.4,

    /**
     * Scale factor of object's controlling borders
     * @type Number
     * @default
     */
    borderScaleFactor:        1,

    /**
     * Transform matrix (similar to SVG's transform matrix)
     * @type Array
     */
    transformMatrix:          null,

    /**
     * Minimum allowed scale value of an object
     * @type Number
     * @default
     */
    minScaleLimit:            0.01,

    /**
     * When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection).
     * But events still fire on it.
     * @type Boolean
     * @default
     */
    selectable:               true,

    /**
     * When set to `false`, an object can not be a target of events. All events propagate through it. Introduced in v1.3.4
     * @type Boolean
     * @default
     */
    evented:                  true,

    /**
     * When set to `false`, an object is not rendered on canvas
     * @type Boolean
     * @default
     */
    visible:                  true,

    /**
     * When set to `false`, object's controls are not displayed and can not be used to manipulate object
     * @type Boolean
     * @default
     */
    hasControls:              true,

    /**
     * When set to `false`, object's controlling borders are not rendered
     * @type Boolean
     * @default
     */
    hasBorders:               true,

    /**
     * When set to `false`, object's controlling rotating point will not be visible or selectable
     * @type Boolean
     * @default
     */
    hasRotatingPoint:         true,

    /**
     * Offset for object's controlling rotating point (when enabled via `hasRotatingPoint`)
     * @type Number
     * @default
     */
    rotatingPointOffset:      40,

    /**
     * When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box
     * @type Boolean
     * @default
     */
    perPixelTargetFind:       false,

    /**
     * When `false`, default object's values are not included in its serialization
     * @type Boolean
     * @default
     */
    includeDefaultValues:     true,

    /**
     * Function that determines clipping of an object (context is passed as a first argument)
     * Note that context origin is at the object's center point (not left/top corner)
     * @type Function
     */
    clipTo:                   null,

    /**
     * When `true`, object horizontal movement is locked
     * @type Boolean
     * @default
     */
    lockMovementX:            false,

    /**
     * When `true`, object vertical movement is locked
     * @type Boolean
     * @default
     */
    lockMovementY:            false,

    /**
     * When `true`, object rotation is locked
     * @type Boolean
     * @default
     */
    lockRotation:             false,

    /**
     * When `true`, object horizontal scaling is locked
     * @type Boolean
     * @default
     */
    lockScalingX:             false,

    /**
     * When `true`, object vertical scaling is locked
     * @type Boolean
     * @default
     */
    lockScalingY:             false,

    /**
     * When `true`, object non-uniform scaling is locked
     * @type Boolean
     * @default
     */
    lockUniScaling:           false,

    /**
     * When `true`, object cannot be flipped by scaling into negative values
     * @type Boolean
     * @default
     */

    lockScalingFlip:          false,
    /**
     * List of properties to consider when checking if state
     * of an object is changed (fabric.Object#hasStateChanged)
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties:  (
      'top left width height scaleX scaleY flipX flipY originX originY transformMatrix ' +
      'stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit ' +
      'angle opacity fill fillRule shadow clipTo visible backgroundColor'
    ).split(' '),

    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    initialize: function(options) {
      if (options) {
        this.setOptions(options);
      }
    },

    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initGradient: function(options) {
      if (options.fill && options.fill.colorStops && !(options.fill instanceof fabric.Gradient)) {
        this.set('fill', new fabric.Gradient(options.fill));
      }
    },

    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initPattern: function(options) {
      if (options.fill && options.fill.source && !(options.fill instanceof fabric.Pattern)) {
        this.set('fill', new fabric.Pattern(options.fill));
      }
      if (options.stroke && options.stroke.source && !(options.stroke instanceof fabric.Pattern)) {
        this.set('stroke', new fabric.Pattern(options.stroke));
      }
    },

    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initClipping: function(options) {
      if (!options.clipTo || typeof options.clipTo !== 'string') {
        return;
      }

      var functionBody = fabric.util.getFunctionBody(options.clipTo);
      if (typeof functionBody !== 'undefined') {
        this.clipTo = new Function('ctx', functionBody);
      }
    },

    /**
     * Sets object's properties from options
     * @param {Object} [options] Options object
     */
    setOptions: function(options) {
      for (var prop in options) {
        this.set(prop, options[prop]);
      }
      this._initGradient(options);
      this._initPattern(options);
      this._initClipping(options);
    },

    /**
     * Transforms context when rendering an object
     * @param {CanvasRenderingContext2D} ctx Context
     * @param {Boolean} fromLeft When true, context is transformed to object's top/left corner. This is used when rendering text on Node
     */
    transform: function(ctx, fromLeft) {
      if (this.group) {
        this.group.transform(ctx, fromLeft);
      }
      ctx.globalAlpha = this.opacity;

      var center = fromLeft ? this._getLeftTopCoords() : this.getCenterPoint();
      ctx.translate(center.x, center.y);
      ctx.rotate(degreesToRadians(this.angle));
      ctx.scale(
        this.scaleX * (this.flipX ? -1 : 1),
        this.scaleY * (this.flipY ? -1 : 1)
      );
    },

    /**
     * Returns an object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,

          object = {
            type:               this.type,
            originX:            this.originX,
            originY:            this.originY,
            left:               toFixed(this.left, NUM_FRACTION_DIGITS),
            top:                toFixed(this.top, NUM_FRACTION_DIGITS),
            width:              toFixed(this.width, NUM_FRACTION_DIGITS),
            height:             toFixed(this.height, NUM_FRACTION_DIGITS),
            fill:               (this.fill && this.fill.toObject) ? this.fill.toObject() : this.fill,
            stroke:             (this.stroke && this.stroke.toObject) ? this.stroke.toObject() : this.stroke,
            strokeWidth:        toFixed(this.strokeWidth, NUM_FRACTION_DIGITS),
            strokeDashArray:    this.strokeDashArray,
            strokeLineCap:      this.strokeLineCap,
            strokeLineJoin:     this.strokeLineJoin,
            strokeMiterLimit:   toFixed(this.strokeMiterLimit, NUM_FRACTION_DIGITS),
            scaleX:             toFixed(this.scaleX, NUM_FRACTION_DIGITS),
            scaleY:             toFixed(this.scaleY, NUM_FRACTION_DIGITS),
            angle:              toFixed(this.getAngle(), NUM_FRACTION_DIGITS),
            flipX:              this.flipX,
            flipY:              this.flipY,
            opacity:            toFixed(this.opacity, NUM_FRACTION_DIGITS),
            shadow:             (this.shadow && this.shadow.toObject) ? this.shadow.toObject() : this.shadow,
            visible:            this.visible,
            clipTo:             this.clipTo && String(this.clipTo),
            backgroundColor:    this.backgroundColor
          };

      if (!this.includeDefaultValues) {
        object = this._removeDefaultValues(object);
      }

      fabric.util.populateWithProperties(this, object, propertiesToInclude);

      return object;
    },

    /**
     * Returns (dataless) object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toDatalessObject: function(propertiesToInclude) {
      // will be overwritten by subclasses
      return this.toObject(propertiesToInclude);
    },

    /**
     * @private
     * @param {Object} object
     */
    _removeDefaultValues: function(object) {
      var prototype = fabric.util.getKlass(object.type).prototype,
          stateProperties = prototype.stateProperties;

      stateProperties.forEach(function(prop) {
        if (object[prop] === prototype[prop]) {
          delete object[prop];
        }
      });

      return object;
    },

    /**
     * Returns a string representation of an instance
     * @return {String}
     */
    toString: function() {
      return '#<fabric.' + capitalize(this.type) + '>';
    },

    /**
     * Basic getter
     * @param {String} property Property name
     * @return {Any} value of a property
     */
    get: function(property) {
      return this[property];
    },

    /**
     * @private
     */
    _setObject: function(obj) {
      for (var prop in obj) {
        this._set(prop, obj[prop]);
      }
    },

    /**
     * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
     * @param {String|Object} key Property name or object (if object, iterate over the object properties)
     * @param {Object|Function} value Property value (if function, the value is passed into it and its return value is used as a new one)
     * @return {fabric.Object} thisArg
     * @chainable
     */
    set: function(key, value) {
      if (typeof key === 'object') {
        this._setObject(key);
      }
      else {
        if (typeof value === 'function' && key !== 'clipTo') {
          this._set(key, value(this.get(key)));
        }
        else {
          this._set(key, value);
        }
      }
      return this;
    },

    /**
     * @private
     * @param {String} key
     * @param {Any} value
     * @return {fabric.Object} thisArg
     */
    _set: function(key, value) {
      var shouldConstrainValue = (key === 'scaleX' || key === 'scaleY');

      if (shouldConstrainValue) {
        value = this._constrainScale(value);
      }
      if (key === 'scaleX' && value < 0) {
        this.flipX = !this.flipX;
        value *= -1;
      }
      else if (key === 'scaleY' && value < 0) {
        this.flipY = !this.flipY;
        value *= -1;
      }
      else if (key === 'width' || key === 'height') {
        this.minScaleLimit = toFixed(Math.min(0.1, 1/Math.max(this.width, this.height)), 2);
      }
      else if (key === 'shadow' && value && !(value instanceof fabric.Shadow)) {
        value = new fabric.Shadow(value);
      }

      this[key] = value;

      return this;
    },

    /**
     * Toggles specified property from `true` to `false` or from `false` to `true`
     * @param {String} property Property to toggle
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
     * Sets sourcePath of an object
     * @param {String} value Value to set sourcePath to
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setSourcePath: function(value) {
      this.sourcePath = value;
      return this;
    },

    /**
     * Retrieves viewportTransform from Object's canvas if possible
     * @method getViewportTransform
     * @memberOf fabric.Object.prototype
     * @return {Boolean} flipY value // TODO
     */
    getViewportTransform: function() {
      if (this.canvas && this.canvas.viewportTransform) {
        return this.canvas.viewportTransform;
      }
      return [1, 0, 0, 1, 0, 0];
    },

    /**
     * Renders an object on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Boolean} [noTransform] When true, context is not transformed
     */
    render: function(ctx, noTransform) {
      // do not render if width/height are zeros or object is not visible
      if (this.width === 0 || this.height === 0 || !this.visible) {
        return;
      }

      ctx.save();

      //setup fill rule for current object
      this._setupFillRule(ctx);

      this._transform(ctx, noTransform);
      this._setStrokeStyles(ctx);
      this._setFillStyles(ctx);

      if (this.group && this.group.type === 'path-group') {
        ctx.translate(-this.group.width/2, -this.group.height/2);
        var m = this.transformMatrix;
        if (m) {
          ctx.transform.apply(ctx, m);
        }
      }
      ctx.globalAlpha = this.group ? (ctx.globalAlpha * this.opacity) : this.opacity;
      this._setShadow(ctx);
      this.clipTo && fabric.util.clipContext(this, ctx);
      this._render(ctx, noTransform);
      this.clipTo && ctx.restore();
      this._removeShadow(ctx);
      this._restoreFillRule(ctx);

      ctx.restore();
    },

    _transform: function(ctx, noTransform) {
      var m = this.transformMatrix;

      if (m && !this.group) {
        ctx.setTransform.apply(ctx, m);
      }
      if (!noTransform) {
        this.transform(ctx);
      }
    },

    _setStrokeStyles: function(ctx) {
      if (this.stroke) {
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeLineCap;
        ctx.lineJoin = this.strokeLineJoin;
        ctx.miterLimit = this.strokeMiterLimit;
        ctx.strokeStyle = this.stroke.toLive
          ? this.stroke.toLive(ctx)
          : this.stroke;
      }
    },

    _setFillStyles: function(ctx) {
      if (this.fill) {
        ctx.fillStyle = this.fill.toLive
          ? this.fill.toLive(ctx)
          : this.fill;
      }
    },

    /**
     * Renders controls and borders for the object
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Boolean} [noTransform] When true, context is not transformed
     */
    _renderControls: function(ctx, noTransform) {
      var vpt = this.getViewportTransform();

      ctx.save();
      if (this.active && !noTransform) {
        var center;
        if (this.group) {
          center = fabric.util.transformPoint(this.group.getCenterPoint(), vpt);
          ctx.translate(center.x, center.y);
          ctx.rotate(degreesToRadians(this.group.angle));
        }
        center = fabric.util.transformPoint(this.getCenterPoint(), vpt, null != this.group);
        if (this.group) {
          center.x *= this.group.scaleX;
          center.y *= this.group.scaleY;
        }
        ctx.translate(center.x, center.y);
        ctx.rotate(degreesToRadians(this.angle));
        this.drawBorders(ctx);
        this.drawControls(ctx);
      }
      ctx.restore();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _setShadow: function(ctx) {
      if (!this.shadow) {
        return;
      }

      ctx.shadowColor = this.shadow.color;
      ctx.shadowBlur = this.shadow.blur;
      ctx.shadowOffsetX = this.shadow.offsetX;
      ctx.shadowOffsetY = this.shadow.offsetY;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _removeShadow: function(ctx) {
      if (!this.shadow) {
        return;
      }

      ctx.shadowColor = '';
      ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderFill: function(ctx) {
      if (!this.fill) {
        return;
      }

      ctx.save();
      if (this.fill.toLive) {
        ctx.translate(
          -this.width / 2 + this.fill.offsetX || 0,
          -this.height / 2 + this.fill.offsetY || 0);
      }
      if (this.fill.gradientTransform) {
        var g = this.fill.gradientTransform;
        ctx.transform.apply(ctx, g);
      }
      if (this.fillRule === 'destination-over') {
        ctx.fill('evenodd');
      }
      else {
        ctx.fill();
      }
      ctx.restore();
      if (this.shadow && !this.shadow.affectStroke) {
        this._removeShadow(ctx);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderStroke: function(ctx) {
      if (!this.stroke || this.strokeWidth === 0) {
        return;
      }

      ctx.save();
      if (this.strokeDashArray) {
        // Spec requires the concatenation of two copies the dash list when the number of elements is odd
        if (1 & this.strokeDashArray.length) {
          this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
        }

        if (supportsLineDash) {
          ctx.setLineDash(this.strokeDashArray);
          this._stroke && this._stroke(ctx);
        }
        else {
          this._renderDashedStroke && this._renderDashedStroke(ctx);
        }
        ctx.stroke();
      }
      else {
        if (this.stroke.gradientTransform) {
          var g = this.stroke.gradientTransform;
          ctx.transform.apply(ctx, g);
        }
        this._stroke ? this._stroke(ctx) : ctx.stroke();
      }
      this._removeShadow(ctx);
      ctx.restore();
    },

    /**
     * Clones an instance
     * @param {Function} callback Callback is invoked with a clone as a first argument
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {fabric.Object} clone of an instance
     */
    clone: function(callback, propertiesToInclude) {
      if (this.constructor.fromObject) {
        return this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
      }
      return new fabric.Object(this.toObject(propertiesToInclude));
    },

    /**
     * Creates an instance of fabric.Image out of an object
     * @param {Function} callback callback, invoked with an instance as a first argument
     * @return {fabric.Object} thisArg
     */
    cloneAsImage: function(callback) {
      var dataUrl = this.toDataURL();
      fabric.util.loadImage(dataUrl, function(img) {
        if (callback) {
          callback(new fabric.Image(img));
        }
      });
      return this;
    },

    /**
     * Converts an object into a data-url-like string
     * @param {Object} options Options object
     * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
     * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
     * @param {Number} [options.multiplier=1] Multiplier to scale by
     * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
     * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
     * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
     * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
     * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
     */
    toDataURL: function(options) {
      options || (options = { });

      var el = fabric.util.createCanvasElement(),
          boundingRect = this.getBoundingRect();

      el.width = boundingRect.width;
      el.height = boundingRect.height;

      fabric.util.wrapElement(el, 'div');
      var canvas = new fabric.Canvas(el);

      // to avoid common confusion https://github.com/kangax/fabric.js/issues/806
      if (options.format === 'jpg') {
        options.format = 'jpeg';
      }

      if (options.format === 'jpeg') {
        canvas.backgroundColor = '#fff';
      }

      var origParams = {
        active: this.get('active'),
        left: this.getLeft(),
        top: this.getTop()
      };

      this.set('active', false);
      this.setPositionByOrigin(new fabric.Point(el.width / 2, el.height / 2), 'center', 'center');

      var originalCanvas = this.canvas;
      canvas.add(this);
      var data = canvas.toDataURL(options);

      this.set(origParams).setCoords();
      this.canvas = originalCanvas;

      canvas.dispose();
      canvas = null;

      return data;
    },

    /**
     * Returns true if specified type is identical to the type of an instance
     * @param {String} type Type to check against
     * @return {Boolean}
     */
    isType: function(type) {
      return this.type === type;
    },

    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return 0;
    },

    /**
     * Returns a JSON representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} JSON
     */
    toJSON: function(propertiesToInclude) {
      // delegate, not alias
      return this.toObject(propertiesToInclude);
    },

    /**
     * Sets gradient (fill or stroke) of an object
     * <b>Backwards incompatibility note:</b> This method was named "setGradientFill" until v1.1.0
     * @param {String} property Property name 'stroke' or 'fill'
     * @param {Object} [options] Options object
     * @param {String} [options.type] Type of gradient 'radial' or 'linear'
     * @param {Number} [options.x1=0] x-coordinate of start point
     * @param {Number} [options.y1=0] y-coordinate of start point
     * @param {Number} [options.x2=0] x-coordinate of end point
     * @param {Number} [options.y2=0] y-coordinate of end point
     * @param {Number} [options.r1=0] Radius of start point (only for radial gradients)
     * @param {Number} [options.r2=0] Radius of end point (only for radial gradients)
     * @param {Object} [options.colorStops] Color stops object eg. {0: 'ff0000', 1: '000000'}
     * @return {fabric.Object} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/58y8b/|jsFiddle demo}
     * @example <caption>Set linear gradient</caption>
     * object.setGradient('fill', {
     *   type: 'linear',
     *   x1: -object.width / 2,
     *   y1: 0,
     *   x2: object.width / 2,
     *   y2: 0,
     *   colorStops: {
     *     0: 'red',
     *     0.5: '#005555',
     *     1: 'rgba(0,0,255,0.5)'
     *   }
     * });
     * canvas.renderAll();
     * @example <caption>Set radial gradient</caption>
     * object.setGradient('fill', {
     *   type: 'radial',
     *   x1: 0,
     *   y1: 0,
     *   x2: 0,
     *   y2: 0,
     *   r1: object.width / 2,
     *   r2: 10,
     *   colorStops: {
     *     0: 'red',
     *     0.5: '#005555',
     *     1: 'rgba(0,0,255,0.5)'
     *   }
     * });
     * canvas.renderAll();
     */
    setGradient: function(property, options) {
      options || (options = { });

      var gradient = { colorStops: [] };

      gradient.type = options.type || (options.r1 || options.r2 ? 'radial' : 'linear');
      gradient.coords = {
        x1: options.x1,
        y1: options.y1,
        x2: options.x2,
        y2: options.y2
      };

      if (options.r1 || options.r2) {
        gradient.coords.r1 = options.r1;
        gradient.coords.r2 = options.r2;
      }

      for (var position in options.colorStops) {
        var color = new fabric.Color(options.colorStops[position]);
        gradient.colorStops.push({
          offset: position,
          color: color.toRgb(),
          opacity: color.getAlpha()
        });
      }

      return this.set(property, fabric.Gradient.forObject(this, gradient));
    },

    /**
     * Sets pattern fill of an object
     * @param {Object} options Options object
     * @param {(String|HTMLImageElement)} options.source Pattern source
     * @param {String} [options.repeat=repeat] Repeat property of a pattern (one of repeat, repeat-x, repeat-y or no-repeat)
     * @param {Number} [options.offsetX=0] Pattern horizontal offset from object's left/top corner
     * @param {Number} [options.offsetY=0] Pattern vertical offset from object's left/top corner
     * @return {fabric.Object} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/QT3pa/|jsFiddle demo}
     * @example <caption>Set pattern</caption>
     * fabric.util.loadImage('http://fabricjs.com/assets/escheresque_ste.png', function(img) {
     *   object.setPatternFill({
     *     source: img,
     *     repeat: 'repeat'
     *   });
     *   canvas.renderAll();
     * });
     */
    setPatternFill: function(options) {
      return this.set('fill', new fabric.Pattern(options));
    },

    /**
     * Sets {@link fabric.Object#shadow|shadow} of an object
     * @param {Object|String} [options] Options object or string (e.g. "2px 2px 10px rgba(0,0,0,0.2)")
     * @param {String} [options.color=rgb(0,0,0)] Shadow color
     * @param {Number} [options.blur=0] Shadow blur
     * @param {Number} [options.offsetX=0] Shadow horizontal offset
     * @param {Number} [options.offsetY=0] Shadow vertical offset
     * @return {fabric.Object} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/7gvJG/|jsFiddle demo}
     * @example <caption>Set shadow with string notation</caption>
     * object.setShadow('2px 2px 10px rgba(0,0,0,0.2)');
     * canvas.renderAll();
     * @example <caption>Set shadow with object notation</caption>
     * object.setShadow({
     *   color: 'red',
     *   blur: 10,
     *   offsetX: 20,
     *   offsetY: 20
     * });
     * canvas.renderAll();
     */
    setShadow: function(options) {
      return this.set('shadow', options ? new fabric.Shadow(options) : null);
    },

    /**
     * Sets "color" of an instance (alias of `set('fill', &hellip;)`)
     * @param {String} color Color value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setColor: function(color) {
      this.set('fill', color);
      return this;
    },

    /**
     * Sets "angle" of an instance
     * @param {Number} angle Angle value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setAngle: function(angle) {
      var shouldCenterOrigin = (this.originX !== 'center' || this.originY !== 'center') && this.centeredRotation;

      if (shouldCenterOrigin) {
        this._setOriginToCenter();
      }

      this.set('angle', angle);

      if (shouldCenterOrigin) {
        this._resetOrigin();
      }

      return this;
    },

    /**
     * Centers object horizontally on canvas to which it was added last.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     * @return {fabric.Object} thisArg
     * @chainable
     */
    centerH: function () {
      this.canvas.centerObjectH(this);
      return this;
    },

    /**
     * Centers object vertically on canvas to which it was added last.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     * @return {fabric.Object} thisArg
     * @chainable
     */
    centerV: function () {
      this.canvas.centerObjectV(this);
      return this;
    },

    /**
     * Centers object vertically and horizontally on canvas to which is was added last
     * You might need to call `setCoords` on an object after centering, to update controls area.
     * @return {fabric.Object} thisArg
     * @chainable
     */
    center: function () {
      this.canvas.centerObject(this);
      return this;
    },

    /**
     * Removes object from canvas to which it was added last
     * @return {fabric.Object} thisArg
     * @chainable
     */
    remove: function() {
      this.canvas.remove(this);
      return this;
    },

    /**
     * Returns coordinates of a pointer relative to an object
     * @param {Event} e Event to operate upon
     * @param {Object} [pointer] Pointer to operate upon (instead of event)
     * @return {Object} Coordinates of a pointer (x, y)
     */
    getLocalPointer: function(e, pointer) {
      pointer = pointer || this.canvas.getPointer(e);
      var objectLeftTop = this.translateToOriginPoint(this.getCenterPoint(), 'left', 'top');
      return {
        x: pointer.x - objectLeftTop.x,
        y: pointer.y - objectLeftTop.y
      };
    },

    /**
     * Sets canvas globalCompositeOperation for specific object
     * custom composition operation for the particular object can be specifed using fillRule property
     * @param {CanvasRenderingContext2D} ctx Rendering canvas context
     */
    _setupFillRule: function (ctx) {
      if (this.fillRule) {
        this._prevFillRule = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = this.fillRule;
      }
    },

    /**
     * Restores previously saved canvas globalCompositeOperation after obeject rendering
     * @param {CanvasRenderingContext2D} ctx Rendering canvas context
     */
    _restoreFillRule: function (ctx) {
      if (this.fillRule && this._prevFillRule) {
        ctx.globalCompositeOperation = this._prevFillRule;
      }
    }
  });

  fabric.util.createAccessors(fabric.Object);

  /**
   * Alias for {@link fabric.Object.prototype.setAngle}
   * @alias rotate -> setAngle
   * @memberof fabric.Object
   */
  fabric.Object.prototype.rotate = fabric.Object.prototype.setAngle;

  extend(fabric.Object.prototype, fabric.Observable);

  /**
   * Defines the number of fraction digits to use when serializing object values.
   * You can use it to increase/decrease precision of such values like left, top, scaleX, scaleY, etc.
   * @static
   * @memberof fabric.Object
   * @constant
   * @type Number
   */
  fabric.Object.NUM_FRACTION_DIGITS = 2;

  /**
   * Unique id used internally when creating SVG elements
   * @static
   * @memberof fabric.Object
   * @type Number
   */
  fabric.Object.__uid = 0;

})(typeof exports !== 'undefined' ? exports : this);


(function() {

  var degreesToRadians = fabric.util.degreesToRadians;

  fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

    /**
     * Translates the coordinates from origin to center coordinates (based on the object's dimensions)
     * @param {fabric.Point} point The point which corresponds to the originX and originY params
     * @param {String} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {String} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {fabric.Point}
     */
    translateToCenterPoint: function(point, originX, originY) {
      var cx = point.x,
          cy = point.y,
          strokeWidth = this.stroke ? this.strokeWidth : 0;

      if (originX === 'left') {
        cx = point.x + (this.getWidth() + strokeWidth * this.scaleX) / 2;
      }
      else if (originX === 'right') {
        cx = point.x - (this.getWidth() + strokeWidth * this.scaleX) / 2;
      }

      if (originY === 'top') {
        cy = point.y + (this.getHeight() + strokeWidth * this.scaleY) / 2;
      }
      else if (originY === 'bottom') {
        cy = point.y - (this.getHeight() + strokeWidth * this.scaleY) / 2;
      }

      // Apply the reverse rotation to the point (it's already scaled properly)
      return fabric.util.rotatePoint(new fabric.Point(cx, cy), point, degreesToRadians(this.angle));
    },

    /**
     * Translates the coordinates from center to origin coordinates (based on the object's dimensions)
     * @param {fabric.Point} center The point which corresponds to center of the object
     * @param {String} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {String} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {fabric.Point}
     */
    translateToOriginPoint: function(center, originX, originY) {
      var x = center.x,
          y = center.y,
          strokeWidth = this.stroke ? this.strokeWidth : 0;

      // Get the point coordinates
      if (originX === 'left') {
        x = center.x - (this.getWidth() + strokeWidth * this.scaleX) / 2;
      }
      else if (originX === 'right') {
        x = center.x + (this.getWidth() + strokeWidth * this.scaleX) / 2;
      }
      if (originY === 'top') {
        y = center.y - (this.getHeight() + strokeWidth * this.scaleY) / 2;
      }
      else if (originY === 'bottom') {
        y = center.y + (this.getHeight() + strokeWidth * this.scaleY) / 2;
      }

      // Apply the rotation to the point (it's already scaled properly)
      return fabric.util.rotatePoint(new fabric.Point(x, y), center, degreesToRadians(this.angle));
    },

    /**
     * Returns the real center coordinates of the object
     * @return {fabric.Point}
     */
    getCenterPoint: function() {
      var leftTop = new fabric.Point(this.left, this.top);
      return this.translateToCenterPoint(leftTop, this.originX, this.originY);
    },

    /**
     * Returns the coordinates of the object based on center coordinates
     * @param {fabric.Point} point The point which corresponds to the originX and originY params
     * @return {fabric.Point}
     */
    // getOriginPoint: function(center) {
    //   return this.translateToOriginPoint(center, this.originX, this.originY);
    // },

    /**
     * Returns the coordinates of the object as if it has a different origin
     * @param {String} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {String} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {fabric.Point}
     */
    getPointByOrigin: function(originX, originY) {
      var center = this.getCenterPoint();
      return this.translateToOriginPoint(center, originX, originY);
    },

    /**
     * Returns the point in local coordinates
     * @param {fabric.Point} point The point relative to the global coordinate system
     * @param {String} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {String} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {fabric.Point}
     */
    toLocalPoint: function(point, originX, originY) {
      var center = this.getCenterPoint(),
          strokeWidth = this.stroke ? this.strokeWidth : 0,
          x, y;

      if (originX && originY) {
        if (originX === 'left') {
          x = center.x - (this.getWidth() + strokeWidth * this.scaleX) / 2;
        }
        else if (originX === 'right') {
          x = center.x + (this.getWidth() + strokeWidth * this.scaleX) / 2;
        }
        else {
          x = center.x;
        }

        if (originY === 'top') {
          y = center.y - (this.getHeight() + strokeWidth * this.scaleY) / 2;
        }
        else if (originY === 'bottom') {
          y = center.y + (this.getHeight() + strokeWidth * this.scaleY) / 2;
        }
        else {
          y = center.y;
        }
      }
      else {
        x = this.left;
        y = this.top;
      }

      return fabric.util.rotatePoint(new fabric.Point(point.x, point.y), center, -degreesToRadians(this.angle))
        .subtractEquals(new fabric.Point(x, y));
    },

    /**
     * Returns the point in global coordinates
     * @param {fabric.Point} The point relative to the local coordinate system
     * @return {fabric.Point}
     */
    // toGlobalPoint: function(point) {
    //   return fabric.util.rotatePoint(point, this.getCenterPoint(), degreesToRadians(this.angle)).addEquals(new fabric.Point(this.left, this.top));
    // },

    /**
     * Sets the position of the object taking into consideration the object's origin
     * @param {fabric.Point} pos The new position of the object
     * @param {String} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {String} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {void}
     */
    setPositionByOrigin: function(pos, originX, originY) {
      var center = this.translateToCenterPoint(pos, originX, originY),
          position = this.translateToOriginPoint(center, this.originX, this.originY);

      this.set('left', position.x);
      this.set('top', position.y);
    },

    /**
     * @param {String} to One of 'left', 'center', 'right'
     */
    adjustPosition: function(to) {
      var angle = degreesToRadians(this.angle),
          hypotHalf = this.getWidth() / 2,
          xHalf = Math.cos(angle) * hypotHalf,
          yHalf = Math.sin(angle) * hypotHalf,
          hypotFull = this.getWidth(),
          xFull = Math.cos(angle) * hypotFull,
          yFull = Math.sin(angle) * hypotFull;

      if (this.originX === 'center' && to === 'left' ||
          this.originX === 'right' && to === 'center') {
        // move half left
        this.left -= xHalf;
        this.top -= yHalf;
      }
      else if (this.originX === 'left' && to === 'center' ||
               this.originX === 'center' && to === 'right') {
        // move half right
        this.left += xHalf;
        this.top += yHalf;
      }
      else if (this.originX === 'left' && to === 'right') {
        // move full right
        this.left += xFull;
        this.top += yFull;
      }
      else if (this.originX === 'right' && to === 'left') {
        // move full left
        this.left -= xFull;
        this.top -= yFull;
      }

      this.setCoords();
      this.originX = to;
    },

    /**
     * Sets the origin/position of the object to it's center point
     * @private
     * @return {void}
     */
    _setOriginToCenter: function() {
      this._originalOriginX = this.originX;
      this._originalOriginY = this.originY;

      var center = this.getCenterPoint();

      this.originX = 'center';
      this.originY = 'center';

      this.left = center.x;
      this.top = center.y;
    },

    /**
     * Resets the origin/position of the object to it's original origin
     * @private
     * @return {void}
     */
    _resetOrigin: function() {
      var originPoint = this.translateToOriginPoint(
        this.getCenterPoint(),
        this._originalOriginX,
        this._originalOriginY);

      this.originX = this._originalOriginX;
      this.originY = this._originalOriginY;

      this.left = originPoint.x;
      this.top = originPoint.y;

      this._originalOriginX = null;
      this._originalOriginY = null;
    },

    /**
     * @private
     */
    _getLeftTopCoords: function() {
      return this.translateToOriginPoint(this.getCenterPoint(), 'left', 'center');
    }
  });

})();


(function() {

  var degreesToRadians = fabric.util.degreesToRadians;

  fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

    /**
     * Object containing coordinates of object's controls
     * @type Object
     * @default
     */
    oCoords: null,

    /**
     * Checks if object intersects with an area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @return {Boolean} true if object intersects with an area formed by 2 points
     */
    intersectsWithRect: function(pointTL, pointBR) {
      var oCoords = this.oCoords,
          tl = new fabric.Point(oCoords.tl.x, oCoords.tl.y),
          tr = new fabric.Point(oCoords.tr.x, oCoords.tr.y),
          bl = new fabric.Point(oCoords.bl.x, oCoords.bl.y),
          br = new fabric.Point(oCoords.br.x, oCoords.br.y),
          intersection = fabric.Intersection.intersectPolygonRectangle(
            [tl, tr, br, bl],
            pointTL,
            pointBR
          );
      return intersection.status === 'Intersection';
    },

    /**
     * Checks if object intersects with another object
     * @param {Object} other Object to test
     * @return {Boolean} true if object intersects with another object
     */
    intersectsWithObject: function(other) {
      // extracts coords
      function getCoords(oCoords) {
        return {
          tl: new fabric.Point(oCoords.tl.x, oCoords.tl.y),
          tr: new fabric.Point(oCoords.tr.x, oCoords.tr.y),
          bl: new fabric.Point(oCoords.bl.x, oCoords.bl.y),
          br: new fabric.Point(oCoords.br.x, oCoords.br.y)
        };
      }
      var thisCoords = getCoords(this.oCoords),
          otherCoords = getCoords(other.oCoords),
          intersection = fabric.Intersection.intersectPolygonPolygon(
            [thisCoords.tl, thisCoords.tr, thisCoords.br, thisCoords.bl],
            [otherCoords.tl, otherCoords.tr, otherCoords.br, otherCoords.bl]
          );

      return intersection.status === 'Intersection';
    },

    /**
     * Checks if object is fully contained within area of another object
     * @param {Object} other Object to test
     * @return {Boolean} true if object is fully contained within area of another object
     */
    isContainedWithinObject: function(other) {
      var boundingRect = other.getBoundingRect(),
          point1 = new fabric.Point(boundingRect.left, boundingRect.top),
          point2 = new fabric.Point(boundingRect.left + boundingRect.width, boundingRect.top + boundingRect.height);

      return this.isContainedWithinRect(point1, point2);
    },

    /**
     * Checks if object is fully contained within area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @return {Boolean} true if object is fully contained within area formed by 2 points
     */
    isContainedWithinRect: function(pointTL, pointBR) {
      var boundingRect = this.getBoundingRect();

      return (
        boundingRect.left >= pointTL.x &&
        boundingRect.left + boundingRect.width <= pointBR.x &&
        boundingRect.top >= pointTL.y &&
        boundingRect.top + boundingRect.height <= pointBR.y
      );
    },

    /**
     * Checks if point is inside the object
     * @param {fabric.Point} point Point to check against
     * @return {Boolean} true if point is inside the object
     */
    containsPoint: function(point) {
      var lines = this._getImageLines(this.oCoords),
          xPoints = this._findCrossPoints(point, lines);

      // if xPoints is odd then point is inside the object
      return (xPoints !== 0 && xPoints % 2 === 1);
    },

    /**
     * Method that returns an object with the object edges in it, given the coordinates of the corners
     * @private
     * @param {Object} oCoords Coordinates of the object corners
     */
    _getImageLines: function(oCoords) {
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
      };
    },

    /**
     * Helper method to determine how many cross points are between the 4 object edges
     * and the horizontal line determined by a point on canvas
     * @private
     * @param {fabric.Point} point Point to check
     * @param {Object} oCoords Coordinates of the object being evaluated
     */
    _findCrossPoints: function(point, oCoords) {
      var b1, b2, a1, a2, xi, yi,
          xcount = 0,
          iLine;

      for (var lineKey in oCoords) {
        iLine = oCoords[lineKey];
        // optimisation 1: line below point. no cross
        if ((iLine.o.y < point.y) && (iLine.d.y < point.y)) {
          continue;
        }
        // optimisation 2: line above point. no cross
        if ((iLine.o.y >= point.y) && (iLine.d.y >= point.y)) {
          continue;
        }
        // optimisation 3: vertical line case
        if ((iLine.o.x === iLine.d.x) && (iLine.o.x >= point.x)) {
          xi = iLine.o.x;
          yi = point.y;
        }
        // calculate the intersection point
        else {
          b1 = 0;
          b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
          a1 = point.y - b1 * point.x;
          a2 = iLine.o.y - b2 * iLine.o.x;

          xi = - (a1 - a2) / (b1 - b2);
          yi = a1 + b1 * xi;
        }
        // dont count xi < point.x cases
        if (xi >= point.x) {
          xcount += 1;
        }
        // optimisation 4: specific for square images
        if (xcount === 2) {
          break;
        }
      }
      return xcount;
    },

    /**
     * Returns width of an object's bounding rectangle
     * @deprecated since 1.0.4
     * @return {Number} width value
     */
    getBoundingRectWidth: function() {
      return this.getBoundingRect().width;
    },

    /**
     * Returns height of an object's bounding rectangle
     * @deprecated since 1.0.4
     * @return {Number} height value
     */
    getBoundingRectHeight: function() {
      return this.getBoundingRect().height;
    },

    /**
     * Returns coordinates of object's bounding rectangle (left, top, width, height)
     * @return {Object} Object with left, top, width, height properties
     */
    getBoundingRect: function() {
      this.oCoords || this.setCoords();

      var xCoords = [this.oCoords.tl.x, this.oCoords.tr.x, this.oCoords.br.x, this.oCoords.bl.x],
          minX = fabric.util.array.min(xCoords),
          maxX = fabric.util.array.max(xCoords),
          width = Math.abs(minX - maxX),

          yCoords = [this.oCoords.tl.y, this.oCoords.tr.y, this.oCoords.br.y, this.oCoords.bl.y],
          minY = fabric.util.array.min(yCoords),
          maxY = fabric.util.array.max(yCoords),
          height = Math.abs(minY - maxY);

      return {
        left: minX,
        top: minY,
        width: width,
        height: height
      };
    },

    /**
     * Returns width of an object
     * @return {Number} width value
     */
    getWidth: function() {
      return this.width * this.scaleX;
    },

    /**
     * Returns height of an object
     * @return {Number} height value
     */
    getHeight: function() {
      return this.height * this.scaleY;
    },

    /**
     * Makes sure the scale is valid and modifies it if necessary
     * @private
     * @param {Number} value
     * @return {Number}
     */
    _constrainScale: function(value) {
      if (Math.abs(value) < this.minScaleLimit) {
        if (value < 0) {
          return -this.minScaleLimit;
        }
        else {
          return this.minScaleLimit;
        }
      }
      return value;
    },

    /**
     * Scales an object (equally by x and y)
     * @param {Number} value Scale factor
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scale: function(value) {
      value = this._constrainScale(value);

      if (value < 0) {
        this.flipX = !this.flipX;
        this.flipY = !this.flipY;
        value *= -1;
      }

      this.scaleX = value;
      this.scaleY = value;
      this.setCoords();
      return this;
    },

    /**
     * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New width value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToWidth: function(value) {
      // adjust to bounding rect factor so that rotated shapes would fit as well
      var boundingRectFactor = this.getBoundingRectWidth() / this.getWidth();
      return this.scale(value / this.width / boundingRectFactor);
    },

    /**
     * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New height value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToHeight: function(value) {
      // adjust to bounding rect factor so that rotated shapes would fit as well
      var boundingRectFactor = this.getBoundingRectHeight() / this.getHeight();
      return this.scale(value / this.height / boundingRectFactor);
    },

    /**
     * Sets corner position coordinates based on current angle, width and height
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setCoords: function() {
      var strokeWidth = this.strokeWidth > 1 ? this.strokeWidth : 0,
          theta = degreesToRadians(this.angle),
          vpt = this.getViewportTransform(),
          f = function (p) {
            return fabric.util.transformPoint(p, vpt);
          },
          w = this.width,
          h = this.height,
          capped = this.strokeLineCap === 'round' || this.strokeLineCap === 'square',
          vLine = this.type === 'line' && this.width === 1,
          hLine = this.type === 'line' && this.height === 1,
          strokeW = (capped && hLine) || this.type !== 'line',
          strokeH = (capped && vLine) || this.type !== 'line';

      if (vLine) {
        w = strokeWidth;
      }
      else if (hLine) {
        h = strokeWidth;
      }
      if (strokeW) {
        w += strokeWidth;
      }
      if (strokeH) {
        h += strokeWidth;
      }
      this.currentWidth = w * this.scaleX;
      this.currentHeight = h * this.scaleY;

      // If width is negative, make postive. Fixes path selection issue
      if (this.currentWidth < 0) {
        this.currentWidth = Math.abs(this.currentWidth);
      }

      var _hypotenuse = Math.sqrt(
            Math.pow(this.currentWidth / 2, 2) +
            Math.pow(this.currentHeight / 2, 2)),

          _angle = Math.atan(isFinite(this.currentHeight / this.currentWidth) ? this.currentHeight / this.currentWidth : 0),

          // offset added for rotate and scale actions
          offsetX = Math.cos(_angle + theta) * _hypotenuse,
          offsetY = Math.sin(_angle + theta) * _hypotenuse,
          sinTh = Math.sin(theta),
          cosTh = Math.cos(theta),
          coords = this.getCenterPoint(),
          wh = new fabric.Point(this.currentWidth, this.currentHeight),
          _tl =   new fabric.Point(coords.x - offsetX, coords.y - offsetY),
          _tr =   new fabric.Point(_tl.x + (wh.x * cosTh),   _tl.y + (wh.x * sinTh)),
          _bl =   new fabric.Point(_tl.x - (wh.y * sinTh),   _tl.y + (wh.y * cosTh)),
          _mt =   new fabric.Point(_tl.x + (wh.x/2 * cosTh), _tl.y + (wh.x/2 * sinTh)),
          tl  = f(_tl),
          tr  = f(_tr),
          br  = f(new fabric.Point(_tr.x - (wh.y * sinTh),   _tr.y + (wh.y * cosTh))),
          bl  = f(_bl),
          ml  = f(new fabric.Point(_tl.x - (wh.y/2 * sinTh), _tl.y + (wh.y/2 * cosTh))),
          mt  = f(_mt),
          mr  = f(new fabric.Point(_tr.x - (wh.y/2 * sinTh), _tr.y + (wh.y/2 * cosTh))),
          mb  = f(new fabric.Point(_bl.x + (wh.x/2 * cosTh), _bl.y + (wh.x/2 * sinTh))),
          mtr = f(new fabric.Point(_mt.x, _mt.y)),

          // padding
          padX = Math.cos(_angle + theta) * this.padding * Math.sqrt(2),
          padY = Math.sin(_angle + theta) * this.padding * Math.sqrt(2);

      tl = tl.add(new fabric.Point(-padX, -padY));
      tr = tr.add(new fabric.Point(padY, -padX));
      br = br.add(new fabric.Point(padX, padY));
      bl = bl.add(new fabric.Point(-padY, padX));
      ml = ml.add(new fabric.Point((-padX - padY) / 2, (-padY + padX) / 2));
      mt = mt.add(new fabric.Point((padY - padX) / 2, -(padY + padX) / 2));
      mr = mr.add(new fabric.Point((padY + padX) / 2, (padY - padX) / 2));
      mb = mb.add(new fabric.Point((padX - padY) / 2, (padX + padY) / 2));
      mtr = mtr.add(new fabric.Point((padY - padX) / 2, -(padY + padX) / 2));

      // debugging

      // setTimeout(function() {
      //   canvas.contextTop.fillStyle = 'green';
      //   canvas.contextTop.fillRect(mb.x, mb.y, 3, 3);
      //   canvas.contextTop.fillRect(bl.x, bl.y, 3, 3);
      //   canvas.contextTop.fillRect(br.x, br.y, 3, 3);
      //   canvas.contextTop.fillRect(tl.x, tl.y, 3, 3);
      //   canvas.contextTop.fillRect(tr.x, tr.y, 3, 3);
      //   canvas.contextTop.fillRect(ml.x, ml.y, 3, 3);
      //   canvas.contextTop.fillRect(mr.x, mr.y, 3, 3);
      //   canvas.contextTop.fillRect(mt.x, mt.y, 3, 3);
      // }, 50);

      this.oCoords = {
        // corners
        tl: tl, tr: tr, br: br, bl: bl,
        // middle
        ml: ml, mt: mt, mr: mr, mb: mb,
        // rotating point
        mtr: mtr
      };

      // set coordinates of the draggable boxes in the corners used to scale/rotate the image
      this._setCornerCoords && this._setCornerCoords();

      return this;
    }
  });
})();


fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Moves an object to the bottom of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  sendToBack: function() {
    if (this.group) {
      fabric.StaticCanvas.prototype.sendToBack.call(this.group, this);
    }
    else {
      this.canvas.sendToBack(this);
    }
    return this;
  },

  /**
   * Moves an object to the top of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  bringToFront: function() {
    if (this.group) {
      fabric.StaticCanvas.prototype.bringToFront.call(this.group, this);
    }
    else {
      this.canvas.bringToFront(this);
    }
    return this;
  },

  /**
   * Moves an object down in stack of drawn objects
   * @param {Boolean} [intersecting] If `true`, send object behind next lower intersecting object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  sendBackwards: function(intersecting) {
    if (this.group) {
      fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, intersecting);
    }
    else {
      this.canvas.sendBackwards(this, intersecting);
    }
    return this;
  },

  /**
   * Moves an object up in stack of drawn objects
   * @param {Boolean} [intersecting] If `true`, send object in front of next upper intersecting object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  bringForward: function(intersecting) {
    if (this.group) {
      fabric.StaticCanvas.prototype.bringForward.call(this.group, this, intersecting);
    }
    else {
      this.canvas.bringForward(this, intersecting);
    }
    return this;
  },

  /**
   * Moves an object to specified level in stack of drawn objects
   * @param {Number} index New position of object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  moveTo: function(index) {
    if (this.group) {
      fabric.StaticCanvas.prototype.moveTo.call(this.group, this, index);
    }
    else {
      this.canvas.moveTo(this, index);
    }
    return this;
  }
});


/* _TO_SVG_START_ */
fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Returns styles-string for svg-export
   * @return {String}
   */
  getSvgStyles: function() {

    var fill = this.fill
          ? (this.fill.toLive ? 'url(#SVGID_' + this.fill.id + ')' : this.fill)
          : 'none',
        fillRule = (this.fillRule === 'destination-over' ? 'evenodd' : this.fillRule),
        stroke = this.stroke
          ? (this.stroke.toLive ? 'url(#SVGID_' + this.stroke.id + ')' : this.stroke)
          : 'none',

        strokeWidth = this.strokeWidth ? this.strokeWidth : '0',
        strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(' ') : '',
        strokeLineCap = this.strokeLineCap ? this.strokeLineCap : 'butt',
        strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : 'miter',
        strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : '4',
        opacity = typeof this.opacity !== 'undefined' ? this.opacity : '1',

        visibility = this.visible ? '' : ' visibility: hidden;',
        filter = this.shadow && this.type !== 'text' ? 'filter: url(#SVGID_' + this.shadow.id + ');' : '';

    return [
      'stroke: ', stroke, '; ',
      'stroke-width: ', strokeWidth, '; ',
      'stroke-dasharray: ', strokeDashArray, '; ',
      'stroke-linecap: ', strokeLineCap, '; ',
      'stroke-linejoin: ', strokeLineJoin, '; ',
      'stroke-miterlimit: ', strokeMiterLimit, '; ',
      'fill: ', fill, '; ',
      'fill-rule: ', fillRule, '; ',
      'opacity: ', opacity, ';',
      filter,
      visibility
    ].join('');
  },

  /**
   * Returns transform-string for svg-export
   * @return {String}
   */
  getSvgTransform: function() {
    if (this.group) {
      return '';
    }
    var toFixed = fabric.util.toFixed,
        angle = this.getAngle(),
        vpt = !this.canvas || this.canvas.svgViewportTransformation ? this.getViewportTransform() : [1, 0, 0, 1, 0, 0],
        center = fabric.util.transformPoint(this.getCenterPoint(), vpt),

        NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,

        translatePart = this.type === 'path-group' ? '' : 'translate(' +
                          toFixed(center.x, NUM_FRACTION_DIGITS) +
                          ' ' +
                          toFixed(center.y, NUM_FRACTION_DIGITS) +
                        ')',

        anglePart = angle !== 0
          ? (' rotate(' + toFixed(angle, NUM_FRACTION_DIGITS) + ')')
          : '',

        scalePart = (this.scaleX === 1 && this.scaleY === 1 && vpt[0] === 1 && vpt[3] === 1)
          ? '' :
          (' scale(' +
            toFixed(this.scaleX * vpt[0], NUM_FRACTION_DIGITS) +
            ' ' +
            toFixed(this.scaleY * vpt[3], NUM_FRACTION_DIGITS) +
          ')'),

        addTranslateX = this.type === 'path-group' ? this.width * vpt[0] : 0,

        flipXPart = this.flipX ? ' matrix(-1 0 0 1 ' + addTranslateX + ' 0) ' : '',

        addTranslateY = this.type === 'path-group' ? this.height * vpt[3] : 0,

        flipYPart = this.flipY ? ' matrix(1 0 0 -1 0 ' + addTranslateY + ')' : '';

    return [
      translatePart, anglePart, scalePart, flipXPart, flipYPart
    ].join('');
  },

  /**
   * Returns transform-string for svg-export from the transform matrix of single elements
   * @return {String}
   */
  getSvgTransformMatrix: function() {
    return this.transformMatrix ? ' matrix(' + this.transformMatrix.join(' ') + ')' : '';
  },

  /**
   * @private
   */
  _createBaseSVGMarkup: function() {
    var markup = [ ];

    if (this.fill && this.fill.toLive) {
      markup.push(this.fill.toSVG(this, false));
    }
    if (this.stroke && this.stroke.toLive) {
      markup.push(this.stroke.toSVG(this, false));
    }
    if (this.shadow) {
      markup.push(this.shadow.toSVG(this));
    }
    return markup;
  }
});
/* _TO_SVG_END_ */


/*
  Depends on `stateProperties`
*/
fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Returns true if object state (one of its state properties) was changed
   * @return {Boolean} true if instance' state has changed since `{@link fabric.Object#saveState}` was called
   */
  hasStateChanged: function() {
    return this.stateProperties.some(function(prop) {
      return this.get(prop) !== this.originalState[prop];
    }, this);
  },

  /**
   * Saves state of an object
   * @param {Object} [options] Object with additional `stateProperties` array to include when saving state
   * @return {fabric.Object} thisArg
   */
  saveState: function(options) {
    this.stateProperties.forEach(function(prop) {
      this.originalState[prop] = this.get(prop);
    }, this);

    if (options && options.stateProperties) {
      options.stateProperties.forEach(function(prop) {
        this.originalState[prop] = this.get(prop);
      }, this);
    }

    return this;
  },

  /**
   * Setups state of an object
   * @return {fabric.Object} thisArg
   */
  setupState: function() {
    this.originalState = { };
    this.saveState();

    return this;
  }
});


(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      coordProps = { x1: 1, x2: 1, y1: 1, y2: 1 },
      supportsLineDash = fabric.StaticCanvas.supports('setLineDash');

  if (fabric.Line) {
    fabric.warn('fabric.Line is already defined');
    return;
  }

  /**
   * Line class
   * @class fabric.Line
   * @extends fabric.Object
   * @see {@link fabric.Line#initialize} for constructor definition
   */
  fabric.Line = fabric.util.createClass(fabric.Object, /** @lends fabric.Line.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'line',

    /**
     * x value or first line edge
     * @type Number
     * @default
     */
    x1: 0,

    /**
     * y value or first line edge
     * @type Number
     * @default
     */
    y1: 0,

    /**
     * x value or second line edge
     * @type Number
     * @default
     */
    x2: 0,

    /**
     * y value or second line edge
     * @type Number
     * @default
     */
    y2: 0,

    /**
     * Constructor
     * @param {Array} [points] Array of points
     * @param {Object} [options] Options object
     * @return {fabric.Line} thisArg
     */
    initialize: function(points, options) {
      options = options || { };

      if (!points) {
        points = [0, 0, 0, 0];
      }

      this.callSuper('initialize', options);

      this.set('x1', points[0]);
      this.set('y1', points[1]);
      this.set('x2', points[2]);
      this.set('y2', points[3]);

      this._setWidthHeight(options);
    },

    /**
     * @private
     * @param {Object} [options] Options
     */
    _setWidthHeight: function(options) {
      options || (options = { });

      this.width = Math.abs(this.x2 - this.x1) || 1;
      this.height = Math.abs(this.y2 - this.y1) || 1;

      this.left = 'left' in options
        ? options.left
        : this._getLeftToOriginX();

      this.top = 'top' in options
        ? options.top
        : this._getTopToOriginY();
    },

    /**
     * @private
     * @param {String} key
     * @param {Any} value
     */
    _set: function(key, value) {
      this[key] = value;
      if (typeof coordProps[key] !== 'undefined') {
        this._setWidthHeight();
      }
      return this;
    },

    /**
     * @private
     * @return {Number} leftToOriginX Distance from left edge of canvas to originX of Line.
     */
    _getLeftToOriginX: makeEdgeToOriginGetter(
      { // property names
        origin: 'originX',
        axis1: 'x1',
        axis2: 'x2',
        dimension: 'width'
      },
      { // possible values of origin
        nearest: 'left',
        center: 'center',
        farthest: 'right'
      }
    ),

    /**
     * @private
     * @return {Number} topToOriginY Distance from top edge of canvas to originY of Line.
     */
    _getTopToOriginY: makeEdgeToOriginGetter(
      { // property names
        origin: 'originY',
        axis1: 'y1',
        axis2: 'y2',
        dimension: 'height'
      },
      { // possible values of origin
        nearest: 'top',
        center: 'center',
        farthest: 'bottom'
      }
    ),

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx, noTransform) {
      ctx.beginPath();

      if (noTransform) {
        //  Line coords are distances from left-top of canvas to origin of line.
        //
        //  To render line in a path-group, we need to translate them to
        //  distances from center of path-group to center of line.
        var cp = this.getCenterPoint();
        ctx.translate(
          cp.x,
          cp.y
        );
      }

      if (!this.strokeDashArray || this.strokeDashArray && supportsLineDash) {

        // move from center (of virtual box) to its left/top corner
        // we can't assume x1, y1 is top left and x2, y2 is bottom right
        var xMult = this.x1 <= this.x2 ? -1 : 1,
            yMult = this.y1 <= this.y2 ? -1 : 1;

        ctx.moveTo(
          this.width === 1 ? 0 : (xMult * this.width / 2),
          this.height === 1 ? 0 : (yMult * this.height / 2));

        ctx.lineTo(
          this.width === 1 ? 0 : (xMult * -1 * this.width / 2),
          this.height === 1 ? 0 : (yMult * -1 * this.height / 2));
      }

      ctx.lineWidth = this.strokeWidth;

      // TODO: test this
      // make sure setting "fill" changes color of a line
      // (by copying fillStyle to strokeStyle, since line is stroked, not filled)
      var origStrokeStyle = ctx.strokeStyle;
      ctx.strokeStyle = this.stroke || ctx.fillStyle;
      this.stroke && this._renderStroke(ctx);
      ctx.strokeStyle = origStrokeStyle;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderDashedStroke: function(ctx) {
      var
        xMult = this.x1 <= this.x2 ? -1 : 1,
        yMult = this.y1 <= this.y2 ? -1 : 1,
        x = this.width === 1 ? 0 : xMult * this.width / 2,
        y = this.height === 1 ? 0 : yMult * this.height / 2;

      ctx.beginPath();
      fabric.util.drawDashedLine(ctx, x, y, -x, -y, this.strokeDashArray);
      ctx.closePath();
    },

    /**
     * Returns object representation of an instance
     * @methd toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        x1: this.get('x1'),
        y1: this.get('y1'),
        x2: this.get('x2'),
        y2: this.get('y2')
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = this._createBaseSVGMarkup(), addTranslate = '';
      if (!this.group) {
        var x = - this.width / 2 - (this.x1 > this.x2 ? this.x2 : this.x1),
            y = - this.height / 2 - (this.y1 > this.y2 ? this.y2 : this.y1);
        addTranslate = 'translate(' + x + ', ' + y + ') ';
      }
      markup.push(
        '<line ',
          'x1="', this.x1,
          '" y1="', this.y1,
          '" x2="', this.x2,
          '" y2="', this.y2,
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(), addTranslate,
          this.getSvgTransformMatrix(),
        '"/>\n'
      );

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns complexity of an instance
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });

  

  /**
   * Returns fabric.Line instance from an object representation
   * @static
   * @memberOf fabric.Line
   * @param {Object} object Object to create an instance from
   * @return {fabric.Line} instance of fabric.Line
   */
  fabric.Line.fromObject = function(object) {
    var points = [object.x1, object.y1, object.x2, object.y2];
    return new fabric.Line(points, object);
  };

  /**
   * Produces a function that calculates distance from canvas edge to Line origin.
   */
  function makeEdgeToOriginGetter(propertyNames, originValues) {
    var origin = propertyNames.origin,
        axis1 = propertyNames.axis1,
        axis2 = propertyNames.axis2,
        dimension = propertyNames.dimension,
        nearest = originValues.nearest,
        center = originValues.center,
        farthest = originValues.farthest;

    return function() {
      switch (this.get(origin)) {
      case nearest:
        return Math.min(this.get(axis1), this.get(axis2));
      case center:
        return Math.min(this.get(axis1), this.get(axis2)) + (0.5 * this.get(dimension));
      case farthest:
        return Math.max(this.get(axis1), this.get(axis2));
      }
    };

  }

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      piBy2   = Math.PI * 2,
      extend = fabric.util.object.extend;

  if (fabric.Circle) {
    fabric.warn('fabric.Circle is already defined.');
    return;
  }

  /**
   * Circle class
   * @class fabric.Circle
   * @extends fabric.Object
   * @see {@link fabric.Circle#initialize} for constructor definition
   */
  fabric.Circle = fabric.util.createClass(fabric.Object, /** @lends fabric.Circle.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'circle',

    /**
     * Radius of this circle
     * @type Number
     * @default
     */
    radius: 0,

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {fabric.Circle} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this.callSuper('initialize', options);
      this.set('radius', options.radius || 0);
    },

    /**
     * @private
     * @param {String} key
     * @param {Any} value
     * @return {fabric.Circle} thisArg
     */
    _set: function(key, value) {
      this.callSuper('_set', key, value);

      if (key === 'radius') {
        this.setRadius(value);
      }

      return this;
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        radius: this.get('radius')
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = this._createBaseSVGMarkup(), x = 0, y = 0;
      if (this.group) {
        x = this.left + this.radius;
        y = this.top + this.radius;
      }
      markup.push(
        '<circle ',
          'cx="' + x + '" cy="' + y + '" ',
          'r="', this.radius,
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
          ' ', this.getSvgTransformMatrix(),
        '"/>\n'
      );

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx context to render on
     * @param {Boolean} [noTransform] When true, context is not transformed
     */
    _render: function(ctx, noTransform) {
      ctx.beginPath();
      ctx.arc(noTransform ? this.left + this.radius : 0, noTransform ? this.top + this.radius : 0, this.radius, 0, piBy2, false);
      this._renderFill(ctx);
      this._renderStroke(ctx);
    },

    /**
     * Returns horizontal radius of an object (according to how an object is scaled)
     * @return {Number}
     */
    getRadiusX: function() {
      return this.get('radius') * this.get('scaleX');
    },

    /**
     * Returns vertical radius of an object (according to how an object is scaled)
     * @return {Number}
     */
    getRadiusY: function() {
      return this.get('radius') * this.get('scaleY');
    },

    /**
     * Sets radius of an object (and updates width accordingly)
     * @return {Number}
     */
    setRadius: function(value) {
      this.radius = value;
      this.set('width', value * 2).set('height', value * 2);
    },

    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return 1;
    }
  });

  

  /**
   * Returns {@link fabric.Circle} instance from an object representation
   * @static
   * @memberOf fabric.Circle
   * @param {Object} object Object to create an instance from
   * @return {Object} Instance of fabric.Circle
   */
  fabric.Circle.fromObject = function(object) {
    return new fabric.Circle(object);
  };

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { });

  if (fabric.Triangle) {
    fabric.warn('fabric.Triangle is already defined');
    return;
  }

  /**
   * Triangle class
   * @class fabric.Triangle
   * @extends fabric.Object
   * @return {fabric.Triangle} thisArg
   * @see {@link fabric.Triangle#initialize} for constructor definition
   */
  fabric.Triangle = fabric.util.createClass(fabric.Object, /** @lends fabric.Triangle.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'triangle',

    /**
     * Constructor
     * @param {Object} [options] Options object
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
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      var widthBy2 = this.width / 2,
          heightBy2 = this.height / 2;

      ctx.beginPath();
      ctx.moveTo(-widthBy2, heightBy2);
      ctx.lineTo(0, -heightBy2);
      ctx.lineTo(widthBy2, heightBy2);
      ctx.closePath();

      this._renderFill(ctx);
      this._renderStroke(ctx);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderDashedStroke: function(ctx) {
      var widthBy2 = this.width / 2,
          heightBy2 = this.height / 2;

      ctx.beginPath();
      fabric.util.drawDashedLine(ctx, -widthBy2, heightBy2, 0, -heightBy2, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, 0, -heightBy2, widthBy2, heightBy2, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, widthBy2, heightBy2, -widthBy2, heightBy2, this.strokeDashArray);
      ctx.closePath();
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = this._createBaseSVGMarkup(),
          widthBy2 = this.width / 2,
          heightBy2 = this.height / 2,
          points = [
            -widthBy2 + ' ' + heightBy2,
            '0 ' + -heightBy2,
            widthBy2 + ' ' + heightBy2
          ]
          .join(',');

      markup.push(
        '<polygon ',
          'points="', points,
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
        '"/>'
      );

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return 1;
    }
  });

  /**
   * Returns fabric.Triangle instance from an object representation
   * @static
   * @memberOf fabric.Triangle
   * @param {Object} object Object to create an instance from
   * @return {Object} instance of Canvas.Triangle
   */
  fabric.Triangle.fromObject = function(object) {
    return new fabric.Triangle(object);
  };

})(typeof exports !== 'undefined' ? exports : this);


(function(global){

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      piBy2   = Math.PI * 2,
      extend = fabric.util.object.extend;

  if (fabric.Ellipse) {
    fabric.warn('fabric.Ellipse is already defined.');
    return;
  }

  /**
   * Ellipse class
   * @class fabric.Ellipse
   * @extends fabric.Object
   * @return {fabric.Ellipse} thisArg
   * @see {@link fabric.Ellipse#initialize} for constructor definition
   */
  fabric.Ellipse = fabric.util.createClass(fabric.Object, /** @lends fabric.Ellipse.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'ellipse',

    /**
     * Horizontal radius
     * @type Number
     * @default
     */
    rx:   0,

    /**
     * Vertical radius
     * @type Number
     * @default
     */
    ry:   0,

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {fabric.Ellipse} thisArg
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
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        rx: this.get('rx'),
        ry: this.get('ry')
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = this._createBaseSVGMarkup(), x = 0, y = 0;
      if (this.group) {
        x = this.left + this.rx;
        y = this.top + this.ry;
      }
      markup.push(
        '<ellipse ',
          'cx="', x, '" cy="', y, '" ',
          'rx="', this.rx,
          '" ry="', this.ry,
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
          this.getSvgTransformMatrix(),
        '"/>\n'
      );

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx context to render on
     * @param {Boolean} [noTransform] When true, context is not transformed
     */
    _render: function(ctx, noTransform) {
      ctx.beginPath();
      ctx.save();
      ctx.transform(1, 0, 0, this.ry/this.rx, 0, 0);
      ctx.arc(noTransform ? this.left + this.rx : 0, noTransform ? (this.top + this.ry) * this.rx/this.ry : 0, this.rx, 0, piBy2, false);
      ctx.restore();
      this._renderFill(ctx);
      this._renderStroke(ctx);
    },

    /**
     * Returns complexity of an instance
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });

  

  /**
   * Returns {@link fabric.Ellipse} instance from an object representation
   * @static
   * @memberOf fabric.Ellipse
   * @param {Object} object Object to create an instance from
   * @return {fabric.Ellipse}
   */
  fabric.Ellipse.fromObject = function(object) {
    return new fabric.Ellipse(object);
  };

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  if (fabric.Rect) {
    console.warn('fabric.Rect is already defined');
    return;
  }

  var stateProperties = fabric.Object.prototype.stateProperties.concat();
  stateProperties.push('rx', 'ry', 'x', 'y');

  /**
   * Rectangle class
   * @class fabric.Rect
   * @extends fabric.Object
   * @return {fabric.Rect} thisArg
   * @see {@link fabric.Rect#initialize} for constructor definition
   */
  fabric.Rect = fabric.util.createClass(fabric.Object, /** @lends fabric.Rect.prototype */ {

    /**
     * List of properties to consider when checking if state of an object is changed ({@link fabric.Object#hasStateChanged})
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties: stateProperties,

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'rect',

    /**
     * Horizontal border radius
     * @type Number
     * @default
     */
    rx:   0,

    /**
     * Vertical border radius
     * @type Number
     * @default
     */
    ry:   0,

    /**
     * Used to specify dash pattern for stroke on this object
     * @type Array
     */
    strokeDashArray: null,

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this.callSuper('initialize', options);
      this._initRxRy();

    },

    /**
     * Initializes rx/ry attributes
     * @private
     */
    _initRxRy: function() {
      if (this.rx && !this.ry) {
        this.ry = this.rx;
      }
      else if (this.ry && !this.rx) {
        this.rx = this.ry;
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx, noTransform) {

      // optimize 1x1 case (used in spray brush)
      if (this.width === 1 && this.height === 1) {
        ctx.fillRect(0, 0, 1, 1);
        return;
      }

      var rx = this.rx ? Math.min(this.rx, this.width / 2) : 0,
          ry = this.ry ? Math.min(this.ry, this.height / 2) : 0,
          w = this.width,
          h = this.height,
          x = noTransform ? this.left : -this.width / 2,
          y = noTransform ? this.top : -this.height / 2,
          isRounded = rx !== 0 || ry !== 0,
          k = 1 - 0.5522847498 /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */;

      ctx.beginPath();

      ctx.moveTo(x + rx, y);

      ctx.lineTo(x + w - rx, y);
      isRounded && ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry);

      ctx.lineTo(x + w, y + h - ry);
      isRounded && ctx.bezierCurveTo(x + w, y + h - k * ry, x + w - k * rx, y + h, x + w - rx, y + h);

      ctx.lineTo(x + rx, y + h);
      isRounded && ctx.bezierCurveTo(x + k * rx, y + h, x, y + h - k * ry, x, y + h - ry);

      ctx.lineTo(x, y + ry);
      isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);

      ctx.closePath();

      this._renderFill(ctx);
      this._renderStroke(ctx);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderDashedStroke: function(ctx) {
      var x = -this.width / 2,
          y = -this.height / 2,
          w = this.width,
          h = this.height;

      ctx.beginPath();
      fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
      ctx.closePath();
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      var object = extend(this.callSuper('toObject', propertiesToInclude), {
        rx: this.get('rx') || 0,
        ry: this.get('ry') || 0
      });
      if (!this.includeDefaultValues) {
        this._removeDefaultValues(object);
      }
      return object;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = this._createBaseSVGMarkup(), x = this.left, y = this.top;
      if (!this.group) {
        x = -this.width / 2;
        y = -this.height / 2;
      }
      markup.push(
        '<rect ',
          'x="', x, '" y="', y,
          '" rx="', this.get('rx'), '" ry="', this.get('ry'),
          '" width="', this.width, '" height="', this.height,
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
          this.getSvgTransformMatrix(),
        '"/>\n');

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns complexity of an instance
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });

  

  /**
   * Returns {@link fabric.Rect} instance from an object representation
   * @static
   * @memberOf fabric.Rect
   * @param {Object} object Object to create an instance from
   * @return {Object} instance of fabric.Rect
   */
  fabric.Rect.fromObject = function(object) {
    return new fabric.Rect(object);
  };

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      toFixed = fabric.util.toFixed;

  if (fabric.Polyline) {
    fabric.warn('fabric.Polyline is already defined');
    return;
  }

  /**
   * Polyline class
   * @class fabric.Polyline
   * @extends fabric.Object
   * @see {@link fabric.Polyline#initialize} for constructor definition
   */
  fabric.Polyline = fabric.util.createClass(fabric.Object, /** @lends fabric.Polyline.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'polyline',

    /**
     * Points array
     * @type Array
     * @default
     */
    points: null,

    /**
     * Constructor
     * @param {Array} points Array of points (where each point is an object with x and y)
     * @param {Object} [options] Options object
     * @param {Boolean} [skipOffset] Whether points offsetting should be skipped
     * @return {fabric.Polyline} thisArg
     * @example
     * var poly = new fabric.Polyline([
     *     { x: 10, y: 10 },
     *     { x: 50, y: 30 },
     *     { x: 40, y: 70 },
     *     { x: 60, y: 50 },
     *     { x: 100, y: 150 },
     *     { x: 40, y: 100 }
     *   ], {
     *   stroke: 'red',
     *   left: 100,
     *   top: 100
     * });
     */
    initialize: function(points, options) {
      options = options || { };
      this.set('points', points);
      this.callSuper('initialize', options);
      this._calcDimensions();
    },

    /**
     * @private
     */
    _calcDimensions: function() {
      return fabric.Polygon.prototype._calcDimensions.call(this);
    },

    /**
     * @private
     */
    _applyPointOffset: function() {
      return fabric.Polygon.prototype._applyPointOffset.call(this);
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return fabric.Polygon.prototype.toObject.call(this, propertiesToInclude);
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var points = [],
          markup = this._createBaseSVGMarkup();

      for (var i = 0, len = this.points.length; i < len; i++) {
        points.push(toFixed(this.points[i].x, 2), ',', toFixed(this.points[i].y, 2), ' ');
      }

      markup.push(
        '<polyline ',
          'points="', points.join(''),
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
          ' ', this.getSvgTransformMatrix(),
        '"/>\n'
      );

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      var point;
      ctx.beginPath();

      if (this._applyPointOffset) {
        if (!(this.group && this.group.type === 'path-group')) {
          this._applyPointOffset();
        }
        this._applyPointOffset = null;
      }

      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (var i = 0, len = this.points.length; i < len; i++) {
        point = this.points[i];
        ctx.lineTo(point.x, point.y);
      }

      this._renderFill(ctx);
      this._renderStroke(ctx);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderDashedStroke: function(ctx) {
      var p1, p2;

      ctx.beginPath();
      for (var i = 0, len = this.points.length; i < len; i++) {
        p1 = this.points[i];
        p2 = this.points[i + 1] || p1;
        fabric.util.drawDashedLine(ctx, p1.x, p1.y, p2.x, p2.y, this.strokeDashArray);
      }
    },

    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return this.get('points').length;
    }
  });

  

  /**
   * Returns fabric.Polyline instance from an object representation
   * @static
   * @memberOf fabric.Polyline
   * @param {Object} object Object to create an instance from
   * @return {fabric.Polyline} Instance of fabric.Polyline
   */
  fabric.Polyline.fromObject = function(object) {
    var points = object.points;
    return new fabric.Polyline(points, object, true);
  };

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      min = fabric.util.array.min,
      max = fabric.util.array.max,
      toFixed = fabric.util.toFixed;

  if (fabric.Polygon) {
    fabric.warn('fabric.Polygon is already defined');
    return;
  }

  /**
   * Polygon class
   * @class fabric.Polygon
   * @extends fabric.Object
   * @see {@link fabric.Polygon#initialize} for constructor definition
   */
  fabric.Polygon = fabric.util.createClass(fabric.Object, /** @lends fabric.Polygon.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'polygon',

    /**
     * Points array
     * @type Array
     * @default
     */
    points: null,

    /**
     * Constructor
     * @param {Array} points Array of points
     * @param {Object} [options] Options object
     * @return {fabric.Polygon} thisArg
     */
    initialize: function(points, options) {
      options = options || { };
      this.points = points;
      this.callSuper('initialize', options);
      this._calcDimensions();
    },

    /**
     * @private
     */
    _calcDimensions: function() {

      var points = this.points,
          minX = min(points, 'x'),
          minY = min(points, 'y'),
          maxX = max(points, 'x'),
          maxY = max(points, 'y');

      this.width = (maxX - minX) || 1;
      this.height = (maxY - minY) || 1;

      this.left = minX,
      this.top = minY;
    },

    /**
     * @private
     */
    _applyPointOffset: function() {
      // change points to offset polygon into a bounding box
      // executed one time
      this.points.forEach(function(p) {
        p.x -= (this.left + this.width / 2);
        p.y -= (this.top + this.height / 2);
      }, this);
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        points: this.points.concat()
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var points = [],
          markup = this._createBaseSVGMarkup();

      for (var i = 0, len = this.points.length; i < len; i++) {
        points.push(toFixed(this.points[i].x, 2), ',', toFixed(this.points[i].y, 2), ' ');
      }

      markup.push(
        '<polygon ',
          'points="', points.join(''),
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
          ' ', this.getSvgTransformMatrix(),
        '"/>\n'
      );

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      var point;
      ctx.beginPath();

      if (this._applyPointOffset) {
        if (!(this.group && this.group.type === 'path-group')) {
          this._applyPointOffset();
        }
        this._applyPointOffset = null;
      }

      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (var i = 0, len = this.points.length; i < len; i++) {
        point = this.points[i];
        ctx.lineTo(point.x, point.y);
      }
      this._renderFill(ctx);
      if (this.stroke || this.strokeDashArray) {
        ctx.closePath();
        this._renderStroke(ctx);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderDashedStroke: function(ctx) {
      var p1, p2;

      ctx.beginPath();
      for (var i = 0, len = this.points.length; i < len; i++) {
        p1 = this.points[i];
        p2 = this.points[i + 1] || this.points[0];
        fabric.util.drawDashedLine(ctx, p1.x, p1.y, p2.x, p2.y, this.strokeDashArray);
      }
      ctx.closePath();
    },

    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return this.points.length;
    }
  });

  

  /**
   * Returns fabric.Polygon instance from an object representation
   * @static
   * @memberOf fabric.Polygon
   * @param {Object} object Object to create an instance from
   * @return {fabric.Polygon} Instance of fabric.Polygon
   */
  fabric.Polygon.fromObject = function(object) {
    return new fabric.Polygon(object.points, object, true);
  };

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      min = fabric.util.array.min,
      max = fabric.util.array.max,
      extend = fabric.util.object.extend,
      _toString = Object.prototype.toString,
      drawArc = fabric.util.drawArc,
      commandLengths = {
        m: 2,
        l: 2,
        h: 1,
        v: 1,
        c: 6,
        s: 4,
        q: 4,
        t: 2,
        a: 7
      },
      repeatedCommands = {
        m: 'l',
        M: 'L'
      };

  if (fabric.Path) {
    fabric.warn('fabric.Path is already defined');
    return;
  }

  /**
   * @private
   */
  function getX(item) {
    if (item[0] === 'H') {
      return item[1];
    }
    return item[item.length - 2];
  }

  /**
   * @private
   */
  function getY(item) {
    if (item[0] === 'V') {
      return item[1];
    }
    return item[item.length - 1];
  }

  /**
   * Path class
   * @class fabric.Path
   * @extends fabric.Object
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1/#path_and_pathgroup}
   * @see {@link fabric.Path#initialize} for constructor definition
   */
  fabric.Path = fabric.util.createClass(fabric.Object, /** @lends fabric.Path.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'path',

    /**
     * Array of path points
     * @type Array
     * @default
     */
    path: null,

    /**
     * Constructor
     * @param {Array|String} path Path data (sequence of coordinates and corresponding "command" tokens)
     * @param {Object} [options] Options object
     * @return {fabric.Path} thisArg
     */
    initialize: function(path, options) {
      options = options || { };

      this.setOptions(options);

      if (!path) {
        throw new Error('`path` argument is required');
      }

      var fromArray = _toString.call(path) === '[object Array]';

      this.path = fromArray
        ? path
        // one of commands (m,M,l,L,q,Q,c,C,etc.) followed by non-command characters (i.e. command values)
        : path.match && path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);

      if (!this.path) {
        return;
      }

      if (!fromArray) {
        this.path = this._parsePath();
      }
      this._initializePath(options);

      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },

    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initializePath: function (options) {
      var isWidthSet = 'width' in options && options.width != null,
          isHeightSet = 'height' in options && options.width != null,
          isLeftSet = 'left' in options,
          isTopSet = 'top' in options,
          origLeft = isLeftSet ? this.left : 0,
          origTop = isTopSet ? this.top : 0;

      if (!isWidthSet || !isHeightSet) {
        extend(this, this._parseDimensions());
        if (isWidthSet) {
          this.width = options.width;
        }
        if (isHeightSet) {
          this.height = options.height;
        }
      }
      else { //Set center location relative to given height/width if not specified
        if (!isTopSet) {
          this.top = this.height / 2;
        }
        if (!isLeftSet) {
          this.left = this.width / 2;
        }
      }
      this.pathOffset = this.pathOffset ||
                        // Save top-left coords as offset
                        this._calculatePathOffset(origLeft, origTop);
    },

    /**
     * @private
     * @param {Number} origLeft Original left position
     * @param {Number} origTop  Original top position
     */
    _calculatePathOffset: function (origLeft, origTop) {
      return {
        x: this.left - origLeft - (this.width / 2),
        y: this.top - origTop - (this.height / 2)
      };
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx context to render path on
     */
    _render: function(ctx, noTransform) {
      var current, // current instruction
          previous = null,
          subpathStartX = 0,
          subpathStartY = 0,
          x = 0, // current x
          y = 0, // current y
          controlX = 0, // current control point x
          controlY = 0, // current control point y
          tempX,
          tempY,
          tempControlX,
          tempControlY,
          l = -((this.width / 2) + this.pathOffset.x),
          t = -((this.height / 2) + this.pathOffset.y);

      if (noTransform) {
        l += this.width / 2;
        t += this.height / 2;
      }

      for (var i = 0, len = this.path.length; i < len; ++i) {

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
            subpathStartX = x;
            subpathStartY = y;
            ctx.moveTo(x + l, y + t);
            break;

          case 'M': // moveTo, absolute
            x = current[1];
            y = current[2];
            subpathStartX = x;
            subpathStartY = y;
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

            // transform to absolute x,y
            tempX = x + current[3];
            tempY = y + current[4];

            // calculate reflection of previous control points
            controlX = controlX ? (2 * x - controlX) : x;
            controlY = controlY ? (2 * y - controlY) : y;

            ctx.bezierCurveTo(
              controlX + l,
              controlY + t,
              x + current[1] + l,
              y + current[2] + t,
              tempX + l,
              tempY + t
            );
            // set control point to 2nd one of this command
            // "... the first control point is assumed to be
            // the reflection of the second control point on
            // the previous command relative to the current point."
            controlX = x + current[1];
            controlY = y + current[2];

            x = tempX;
            y = tempY;
            break;

          case 'S': // shorthand cubic bezierCurveTo, absolute
            tempX = current[3];
            tempY = current[4];
            // calculate reflection of previous control points
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
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

            // set control point to 2nd one of this command
            // "... the first control point is assumed to be
            // the reflection of the second control point on
            // the previous command relative to the current point."
            controlX = current[1];
            controlY = current[2];

            break;

          case 'q': // quadraticCurveTo, relative
            // transform to absolute x,y
            tempX = x + current[3];
            tempY = y + current[4];

            controlX = x + current[1];
            controlY = y + current[2];

            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;

          case 'Q': // quadraticCurveTo, absolute
            tempX = current[3];
            tempY = current[4];

            ctx.quadraticCurveTo(
              current[1] + l,
              current[2] + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            controlX = current[1];
            controlY = current[2];
            break;

          case 't': // shorthand quadraticCurveTo, relative

            // transform to absolute x,y
            tempX = x + current[1];
            tempY = y + current[2];

            if (previous[0].match(/[QqTt]/) === null) {
              // If there is no previous command or if the previous command was not a Q, q, T or t,
              // assume the control point is coincident with the current point
              controlX = x;
              controlY = y;
            }
            else if (previous[0] === 't') {
              // calculate reflection of previous control points for t
              controlX = 2 * x - tempControlX;
              controlY = 2 * y - tempControlY;
            }
            else if (previous[0] === 'q') {
              // calculate reflection of previous control points for q
              controlX = 2 * x - controlX;
              controlY = 2 * y - controlY;
            }

            tempControlX = controlX;
            tempControlY = controlY;

            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            controlX = x + current[1];
            controlY = y + current[2];
            break;

          case 'T':
            tempX = current[1];
            tempY = current[2];

            // calculate reflection of previous control points
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;

          case 'a':
            // TODO: optimize this
            drawArc(ctx, x + l, y + t, [
              current[1],
              current[2],
              current[3],
              current[4],
              current[5],
              current[6] + x + l,
              current[7] + y + t
            ]);
            x += current[6];
            y += current[7];
            break;

          case 'A':
            // TODO: optimize this
            drawArc(ctx, x + l, y + t, [
              current[1],
              current[2],
              current[3],
              current[4],
              current[5],
              current[6] + l,
              current[7] + t
            ]);
            x = current[6];
            y = current[7];
            break;

          case 'z':
          case 'Z':
            x = subpathStartX;
            y = subpathStartY;
            ctx.closePath();
            break;
        }
        previous = current;
      }
    },

    /**
     * Renders path on a specified context
     * @param {CanvasRenderingContext2D} ctx context to render path on
     * @param {Boolean} [noTransform] When true, context is not transformed
     */
    render: function(ctx, noTransform) {
      // do not render if object is not visible
      if (!this.visible) {
        return;
      }

      ctx.save();
      if (noTransform) {
        ctx.translate(-this.width/2, -this.height/2);
      }
      var m = this.transformMatrix;

      if (m) {
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }
      if (!noTransform) {
        this.transform(ctx);
      }
      this._setStrokeStyles(ctx);
      this._setFillStyles(ctx);
      this._setShadow(ctx);
      this.clipTo && fabric.util.clipContext(this, ctx);
      ctx.beginPath();
      ctx.globalAlpha = this.group ? (ctx.globalAlpha * this.opacity) : this.opacity;
      this._render(ctx, noTransform);
      this._renderFill(ctx);
      this._renderStroke(ctx);
      this.clipTo && ctx.restore();
      this._removeShadow(ctx);
      ctx.restore();
    },

    /**
     * Returns string representation of an instance
     * @return {String} string representation of an instance
     */
    toString: function() {
      return '#<fabric.Path (' + this.complexity() +
        '): { "top": ' + this.top + ', "left": ' + this.left + ' }>';
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      var o = extend(this.callSuper('toObject', propertiesToInclude), {
        path: this.path.map(function(item) { return item.slice() }),
        pathOffset: this.pathOffset
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
     * Returns dataless object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toDatalessObject: function(propertiesToInclude) {
      var o = this.toObject(propertiesToInclude);
      if (this.sourcePath) {
        o.path = this.sourcePath;
      }
      delete o.sourcePath;
      return o;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var chunks = [],
          markup = this._createBaseSVGMarkup();

      for (var i = 0, len = this.path.length; i < len; i++) {
        chunks.push(this.path[i].join(' '));
      }
      var path = chunks.join(' ');

      markup.push(
        //jscs:disable validateIndentation
        '<path ',
          'd="', path,
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(),
          this.getSvgTransformMatrix(), '" stroke-linecap="round" ',
        '/>\n'
        //jscs:enable validateIndentation
      );

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns number representation of an instance complexity
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return this.path.length;
    },

    /**
     * @private
     */
    _parsePath: function() {
      var result = [ ],
          coords = [ ],
          currentPath,
          parsed,
          re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/ig,
          match,
          coordsStr;

      for (var i = 0, coordsParsed, len = this.path.length; i < len; i++) {
        currentPath = this.path[i];

        coordsStr = currentPath.slice(1).trim();
        coords.length = 0;

        while ((match = re.exec(coordsStr))) {
          coords.push(match[0]);
        }

        coordsParsed = [ currentPath.charAt(0) ];

        for (var j = 0, jlen = coords.length; j < jlen; j++) {
          parsed = parseFloat(coords[j]);
          if (!isNaN(parsed)) {
            coordsParsed.push(parsed);
          }
        }

        var command = coordsParsed[0],
            commandLength = commandLengths[command.toLowerCase()],
            repeatedCommand = repeatedCommands[command] || command;

        if (coordsParsed.length - 1 > commandLength) {
          for (var k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
            result.push([ command ].concat(coordsParsed.slice(k, k + commandLength)));
            command = repeatedCommand;
          }
        }
        else {
          result.push(coordsParsed);
        }
      }

      return result;
    },

    /**
     * @private
     */
    _parseDimensions: function() {
      var aX = [],
          aY = [],
          previous = { };

      this.path.forEach(function(item, i) {
        this._getCoordsFromCommand(item, i, aX, aY, previous);
      }, this);

      var minX = min(aX),
          minY = min(aY),
          maxX = max(aX),
          maxY = max(aY),
          deltaX = maxX - minX,
          deltaY = maxY - minY,

          o = {
            left: this.left + (minX + deltaX / 2),
            top: this.top + (minY + deltaY / 2),
            width: deltaX,
            height: deltaY
          };

      return o;
    },

    _getCoordsFromCommand: function(item, i, aX, aY, previous) {
      var isLowerCase = false;

      if (item[0] !== 'H') {
        previous.x = (i === 0) ? getX(item) : getX(this.path[i - 1]);
      }
      if (item[0] !== 'V') {
        previous.y = (i === 0) ? getY(item) : getY(this.path[i - 1]);
      }

      // lowercased letter denotes relative position;
      // transform to absolute
      if (item[0] === item[0].toLowerCase()) {
        isLowerCase = true;
      }

      var xy = this._getXY(item, isLowerCase, previous),
          val;

      val = parseInt(xy.x, 10);
      if (!isNaN(val)) {
        aX.push(val);
      }

      val = parseInt(xy.y, 10);
      if (!isNaN(val)) {
        aY.push(val);
      }
    },

    _getXY: function(item, isLowerCase, previous) {

      // last 2 items in an array of coordinates are the actualy x/y (except H/V), collect them
      // TODO (kangax): support relative h/v commands

      var x = isLowerCase
        ? previous.x + getX(item)
        : item[0] === 'V'
          ? previous.x
          : getX(item),

          y = isLowerCase
            ? previous.y + getY(item)
            : item[0] === 'H'
              ? previous.y
              : getY(item);

      return { x: x, y: y };
    }
  });

  /**
   * Creates an instance of fabric.Path from an object
   * @static
   * @memberOf fabric.Path
   * @param {Object} object
   * @param {Function} callback Callback to invoke when an fabric.Path instance is created
   */
  fabric.Path.fromObject = function(object, callback) {
    if (typeof object.path === 'string') {
      fabric.loadSVGFromURL(object.path, function (elements) {
        var path = elements[0],
            pathUrl = object.path;

        delete object.path;

        fabric.util.object.extend(path, object);
        path.setSourcePath(pathUrl);

        callback(path);
      });
    }
    else {
      callback(new fabric.Path(object.path, object));
    }
  };

  

  /**
   * Indicates that instances of this type are async
   * @static
   * @memberOf fabric.Path
   * @type Boolean
   * @default
   */
  fabric.Path.async = true;

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      invoke = fabric.util.array.invoke,
      parentToObject = fabric.Object.prototype.toObject;

  if (fabric.PathGroup) {
    fabric.warn('fabric.PathGroup is already defined');
    return;
  }

  /**
   * Path group class
   * @class fabric.PathGroup
   * @extends fabric.Path
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1/#path_and_pathgroup}
   * @see {@link fabric.PathGroup#initialize} for constructor definition
   */
  fabric.PathGroup = fabric.util.createClass(fabric.Path, /** @lends fabric.PathGroup.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'path-group',

    /**
     * Fill value
     * @type String
     * @default
     */
    fill: '',

    /**
     * Constructor
     * @param {Array} paths
     * @param {Object} [options] Options object
     * @return {fabric.PathGroup} thisArg
     */
    initialize: function(paths, options) {

      options = options || { };
      this.paths = paths || [ ];

      for (var i = this.paths.length; i--; ) {
        this.paths[i].group = this;
      }

      this.setOptions(options);

      if (options.widthAttr) {
        this.scaleX = options.widthAttr / options.width;
      }
      if (options.heightAttr) {
        this.scaleY = options.heightAttr / options.height;
      }

      this.setCoords();

      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },

    /**
     * Renders this group on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render this instance on
     */
    render: function(ctx) {
      // do not render if object is not visible
      if (!this.visible) {
        return;
      }

      ctx.save();

      var m = this.transformMatrix;

      if (m) {
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }
      this.transform(ctx);

      this._setShadow(ctx);
      this.clipTo && fabric.util.clipContext(this, ctx);
      for (var i = 0, l = this.paths.length; i < l; ++i) {
        this.paths[i].render(ctx, true);
      }
      this.clipTo && ctx.restore();
      this._removeShadow(ctx);
      ctx.restore();
    },

    /**
     * Sets certain property to a certain value
     * @param {String} prop
     * @param {Any} value
     * @return {fabric.PathGroup} thisArg
     */
    _set: function(prop, value) {

      if (prop === 'fill' && value && this.isSameColor()) {
        var i = this.paths.length;
        while (i--) {
          this.paths[i]._set(prop, value);
        }
      }

      return this.callSuper('_set', prop, value);
    },

    /**
     * Returns object representation of this path group
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      var o = extend(parentToObject.call(this, propertiesToInclude), {
        paths: invoke(this.getObjects(), 'toObject', propertiesToInclude)
      });
      if (this.sourcePath) {
        o.sourcePath = this.sourcePath;
      }
      return o;
    },

    /**
     * Returns dataless object representation of this path group
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} dataless object representation of an instance
     */
    toDatalessObject: function(propertiesToInclude) {
      var o = this.toObject(propertiesToInclude);
      if (this.sourcePath) {
        o.paths = this.sourcePath;
      }
      return o;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var objects = this.getObjects(),
          translatePart = 'translate(' + this.left + ' ' + this.top + ')',
          markup = [
            //jscs:disable validateIndentation
            '<g ',
              'style="', this.getSvgStyles(), '" ',
              'transform="', translatePart, this.getSvgTransform(), '" ',
            '>\n'
            //jscs:enable validateIndentation
          ];

      for (var i = 0, len = objects.length; i < len; i++) {
        markup.push(objects[i].toSVG(reviver));
      }
      markup.push('</g>\n');

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns a string representation of this path group
     * @return {String} string representation of an object
     */
    toString: function() {
      return '#<fabric.PathGroup (' + this.complexity() +
        '): { top: ' + this.top + ', left: ' + this.left + ' }>';
    },

    /**
     * Returns true if all paths in this group are of same color
     * @return {Boolean} true if all paths are of the same color (`fill`)
     */
    isSameColor: function() {
      var firstPathFill = (this.getObjects()[0].get('fill') || '').toLowerCase();
      return this.getObjects().every(function(path) {
        return (path.get('fill') || '').toLowerCase() === firstPathFill;
      });
    },

    /**
     * Returns number representation of object's complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return this.paths.reduce(function(total, path) {
        return total + ((path && path.complexity) ? path.complexity() : 0);
      }, 0);
    },

    /**
     * Returns all paths in this path group
     * @return {Array} array of path objects included in this path group
     */
    getObjects: function() {
      return this.paths;
    }
  });

  /**
   * Creates fabric.PathGroup instance from an object representation
   * @static
   * @memberOf fabric.PathGroup
   * @param {Object} object Object to create an instance from
   * @param {Function} callback Callback to invoke when an fabric.PathGroup instance is created
   */
  fabric.PathGroup.fromObject = function(object, callback) {
    if (typeof object.paths === 'string') {
      fabric.loadSVGFromURL(object.paths, function (elements) {

        var pathUrl = object.paths;
        delete object.paths;

        var pathGroup = fabric.util.groupSVGElements(elements, object, pathUrl);

        callback(pathGroup);
      });
    }
    else {
      fabric.util.enlivenObjects(object.paths, function(enlivenedObjects) {
        delete object.paths;
        callback(new fabric.PathGroup(enlivenedObjects, object));
      });
    }
  };

  /**
   * Indicates that instances of this type are async
   * @static
   * @memberOf fabric.PathGroup
   * @type Boolean
   * @default
   */
  fabric.PathGroup.async = true;

})(typeof exports !== 'undefined' ? exports : this);


(function(global){

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      min = fabric.util.array.min,
      max = fabric.util.array.max,
      invoke = fabric.util.array.invoke;

  if (fabric.Group) {
    return;
  }

  // lock-related properties, for use in fabric.Group#get
  // to enable locking behavior on group
  // when one of its objects has lock-related properties set
  var _lockProperties = {
    lockMovementX:  true,
    lockMovementY:  true,
    lockRotation:   true,
    lockScalingX:   true,
    lockScalingY:   true,
    lockUniScaling: true
  };

  /**
   * Group class
   * @class fabric.Group
   * @extends fabric.Object
   * @mixes fabric.Collection
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3/#groups}
   * @see {@link fabric.Group#initialize} for constructor definition
   */
  fabric.Group = fabric.util.createClass(fabric.Object, fabric.Collection, /** @lends fabric.Group.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'group',

    /**
     * Constructor
     * @param {Object} objects Group objects
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function(objects, options) {
      options = options || { };

      this._objects = objects || [];
      for (var i = this._objects.length; i--; ) {
        this._objects[i].group = this;
      }

      this.originalState = { };
      this.callSuper('initialize');

      this._calcBounds();
      this._updateObjectsCoords();

      if (options) {
        extend(this, options);
      }
      this._setOpacityIfSame();

      this.setCoords();
      this.saveCoords();
    },

    /**
     * @private
     */
    _updateObjectsCoords: function() {
      this.forEachObject(this._updateObjectCoords, this);
    },

    /**
     * @private
     */
    _updateObjectCoords: function(object) {
      var objectLeft = object.getLeft(),
          objectTop = object.getTop();

      object.set({
        originalLeft: objectLeft,
        originalTop: objectTop,
        left: objectLeft - this.left,
        top: objectTop - this.top
      });

      object.setCoords();

      // do not display corners of objects enclosed in a group
      object.__origHasControls = object.hasControls;
      object.hasControls = false;
    },

    /**
     * Returns string represenation of a group
     * @return {String}
     */
    toString: function() {
      return '#<fabric.Group: (' + this.complexity() + ')>';
    },

    /**
     * Adds an object to a group; Then recalculates group's dimension, position.
     * @param {Object} object
     * @return {fabric.Group} thisArg
     * @chainable
     */
    addWithUpdate: function(object) {
      this._restoreObjectsState();
      if (object) {
        this._objects.push(object);
        object.group = this;
      }
      // since _restoreObjectsState set objects inactive
      this.forEachObject(this._setObjectActive, this);
      this._calcBounds();
      this._updateObjectsCoords();
      return this;
    },

    /**
     * @private
     */
    _setObjectActive: function(object) {
      object.set('active', true);
      object.group = this;
    },

    /**
     * Removes an object from a group; Then recalculates group's dimension, position.
     * @param {Object} object
     * @return {fabric.Group} thisArg
     * @chainable
     */
    removeWithUpdate: function(object) {
      this._moveFlippedObject(object);
      this._restoreObjectsState();

      // since _restoreObjectsState set objects inactive
      this.forEachObject(this._setObjectActive, this);

      this.remove(object);
      this._calcBounds();
      this._updateObjectsCoords();

      return this;
    },

    /**
     * @private
     */
    _onObjectAdded: function(object) {
      object.group = this;
    },

    /**
     * @private
     */
    _onObjectRemoved: function(object) {
      delete object.group;
      object.set('active', false);
    },

    /**
     * Properties that are delegated to group objects when reading/writing
     * @param {Object} delegatedProperties
     */
    delegatedProperties: {
      fill:             true,
      opacity:          true,
      fontFamily:       true,
      fontWeight:       true,
      fontSize:         true,
      fontStyle:        true,
      lineHeight:       true,
      textDecoration:   true,
      textAlign:        true,
      backgroundColor:  true
    },

    /**
     * @private
     */
    _set: function(key, value) {
      if (key in this.delegatedProperties) {
        var i = this._objects.length;
        this[key] = value;
        while (i--) {
          this._objects[i].set(key, value);
        }
      }
      else {
        this[key] = value;
      }
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        objects: invoke(this._objects, 'toObject', propertiesToInclude)
      });
    },

    /**
     * Renders instance on a given context
     * @param {CanvasRenderingContext2D} ctx context to render instance on
     */
    render: function(ctx) {
      // do not render if object is not visible
      if (!this.visible) {
        return;
      }

      ctx.save();
      this.clipTo && fabric.util.clipContext(this, ctx);

      // the array is now sorted in order of highest first, so start from end
      for (var i = 0, len = this._objects.length; i < len; i++) {
        this._renderObject(this._objects[i], ctx);
      }

      this.clipTo && ctx.restore();

      ctx.restore();
    },

    /**
     * Renders controls and borders for the object
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Boolean} [noTransform] When true, context is not transformed
     */
    _renderControls: function(ctx, noTransform) {
      this.callSuper('_renderControls', ctx, noTransform);
      for (var i = 0, len = this._objects.length; i < len; i++) {
        this._objects[i]._renderControls(ctx);
      }
    },

    /**
     * @private
     */
    _renderObject: function(object, ctx) {
      var originalHasRotatingPoint = object.hasRotatingPoint;

      // do not render if object is not visible
      if (!object.visible) {
        return;
      }

      object.hasRotatingPoint = false;

      object.render(ctx);

      object.hasRotatingPoint = originalHasRotatingPoint;
    },

    /**
     * Retores original state of each of group objects (original state is that which was before group was created).
     * @private
     * @return {fabric.Group} thisArg
     * @chainable
     */
    _restoreObjectsState: function() {
      this._objects.forEach(this._restoreObjectState, this);
      return this;
    },

    /**
     * Moves a flipped object to the position where it's displayed
     * @private
     * @param {fabric.Object} object
     * @return {fabric.Group} thisArg
     */
    _moveFlippedObject: function(object) {
      var oldOriginX = object.get('originX'),
          oldOriginY = object.get('originY'),
          center = object.getCenterPoint();

      object.set({
        originX: 'center',
        originY: 'center',
        left: center.x,
        top: center.y
      });

      this._toggleFlipping(object);

      var newOrigin = object.getPointByOrigin(oldOriginX, oldOriginY);

      object.set({
        originX: oldOriginX,
        originY: oldOriginY,
        left: newOrigin.x,
        top: newOrigin.y
      });

      return this;
    },

    /**
     * @private
     */
    _toggleFlipping: function(object) {
      if (this.flipX) {
        object.toggle('flipX');
        object.set('left', -object.get('left'));
        object.setAngle(-object.getAngle());
      }
      if (this.flipY) {
        object.toggle('flipY');
        object.set('top', -object.get('top'));
        object.setAngle(-object.getAngle());
      }
    },

    /**
     * Restores original state of a specified object in group
     * @private
     * @param {fabric.Object} object
     * @return {fabric.Group} thisArg
     */
    _restoreObjectState: function(object) {
      this._setObjectPosition(object);

      object.setCoords();
      object.hasControls = object.__origHasControls;
      delete object.__origHasControls;
      object.set('active', false);
      object.setCoords();
      delete object.group;

      return this;
    },

    /**
     * @private
     */
    _setObjectPosition: function(object) {
      var groupLeft = this.getLeft(),
          groupTop = this.getTop(),
          rotated = this._getRotatedLeftTop(object);

      object.set({
        angle: object.getAngle() + this.getAngle(),
        left: groupLeft + rotated.left,
        top: groupTop + rotated.top,
        scaleX: object.get('scaleX') * this.get('scaleX'),
        scaleY: object.get('scaleY') * this.get('scaleY')
      });
    },

    /**
     * @private
     */
    _getRotatedLeftTop: function(object) {
      var groupAngle = this.getAngle() * (Math.PI / 180);
      return {
        left: (-Math.sin(groupAngle) * object.getTop() * this.get('scaleY') +
                Math.cos(groupAngle) * object.getLeft() * this.get('scaleX')),

        top:  (Math.cos(groupAngle) * object.getTop() * this.get('scaleY') +
               Math.sin(groupAngle) * object.getLeft() * this.get('scaleX'))
      };
    },

    /**
     * Destroys a group (restoring state of its objects)
     * @return {fabric.Group} thisArg
     * @chainable
     */
    destroy: function() {
      this._objects.forEach(this._moveFlippedObject, this);
      return this._restoreObjectsState();
    },

    /**
     * Saves coordinates of this instance (to be used together with `hasMoved`)
     * @saveCoords
     * @return {fabric.Group} thisArg
     * @chainable
     */
    saveCoords: function() {
      this._originalLeft = this.get('left');
      this._originalTop = this.get('top');
      return this;
    },

    /**
     * Checks whether this group was moved (since `saveCoords` was called last)
     * @return {Boolean} true if an object was moved (since fabric.Group#saveCoords was called)
     */
    hasMoved: function() {
      return this._originalLeft !== this.get('left') ||
             this._originalTop !== this.get('top');
    },

    /**
     * Sets coordinates of all group objects
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
     * @private
     */
    _setOpacityIfSame: function() {
      var objects = this.getObjects(),
          firstValue = objects[0] ? objects[0].get('opacity') : 1,
          isSameOpacity = objects.every(function(o) {
            return o.get('opacity') === firstValue;
          });

      if (isSameOpacity) {
        this.opacity = firstValue;
      }
    },

    /**
     * @private
     */
    _calcBounds: function(onlyWidthHeight) {
      var aX = [],
          aY = [],
          o;

      for (var i = 0, len = this._objects.length; i < len; ++i) {
        o = this._objects[i];
        o.setCoords();
        for (var prop in o.oCoords) {
          aX.push(o.oCoords[prop].x);
          aY.push(o.oCoords[prop].y);
        }
      }

      this.set(this._getBounds(aX, aY, onlyWidthHeight));
    },

    /**
     * @private
     */
    _getBounds: function(aX, aY, onlyWidthHeight) {
      var ivt = fabric.util.invertTransform(this.getViewportTransform()),
          minXY = fabric.util.transformPoint(new fabric.Point(min(aX), min(aY)), ivt),
          maxXY = fabric.util.transformPoint(new fabric.Point(max(aX), max(aY)), ivt),
          obj = {
            width: (maxXY.x - minXY.x) || 0,
            height: (maxXY.y - minXY.y) || 0
          };

      if (!onlyWidthHeight) {
        obj.left = (minXY.x + maxXY.x) / 2 || 0;
        obj.top = (minXY.y + maxXY.y) / 2 || 0;
      }
      return obj;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = [
        //jscs:disable validateIndentation
        '<g ',
          'transform="', this.getSvgTransform(),
        '">\n'
        //jscs:enable validateIndentation
      ];

      for (var i = 0, len = this._objects.length; i < len; i++) {
        markup.push(this._objects[i].toSVG(reviver));
      }

      markup.push('</g>\n');

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns requested property
     * @param {String} prop Property to get
     * @return {Any}
     */
    get: function(prop) {
      if (prop in _lockProperties) {
        if (this[prop]) {
          return this[prop];
        }
        else {
          for (var i = 0, len = this._objects.length; i < len; i++) {
            if (this._objects[i][prop]) {
              return true;
            }
          }
          return false;
        }
      }
      else {
        if (prop in this.delegatedProperties) {
          return this._objects[0] && this._objects[0].get(prop);
        }
        return this[prop];
      }
    }
  });

  /**
   * Returns {@link fabric.Group} instance from an object representation
   * @static
   * @memberOf fabric.Group
   * @param {Object} object Object to create a group from
   * @param {Function} [callback] Callback to invoke when an group instance is created
   * @return {fabric.Group} An instance of fabric.Group
   */
  fabric.Group.fromObject = function(object, callback) {
    fabric.util.enlivenObjects(object.objects, function(enlivenedObjects) {
      delete object.objects;
      callback && callback(new fabric.Group(enlivenedObjects, object));
    });
  };

  /**
   * Indicates that instances of this type are async
   * @static
   * @memberOf fabric.Group
   * @type Boolean
   * @default
   */
  fabric.Group.async = true;

})(typeof exports !== 'undefined' ? exports : this);


(function(global) {

  'use strict';

  var extend = fabric.util.object.extend;

  if (!global.fabric) {
    global.fabric = { };
  }

  if (global.fabric.Image) {
    fabric.warn('fabric.Image is already defined.');
    return;
  }

  /**
   * Image class
   * @class fabric.Image
   * @extends fabric.Object
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1/#images}
   * @see {@link fabric.Image#initialize} for constructor definition
   */
  fabric.Image = fabric.util.createClass(fabric.Object, /** @lends fabric.Image.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'image',

    /**
     * crossOrigin value (one of "", "anonymous", "allow-credentials")
     * @see https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes
     * @type String
     * @default
     */
    crossOrigin: '',

    /**
     * Constructor
     * @param {HTMLImageElement | String} element Image element
     * @param {Object} [options] Options object
     * @return {fabric.Image} thisArg
     */
    initialize: function(element, options) {
      options || (options = { });

      this.filters = [ ];

      this.callSuper('initialize', options);

      this._initElement(element, options);
      this._initConfig(options);

      if (options.filters) {
        this.filters = options.filters;
        this.applyFilters();
      }
    },

    /**
     * Returns image element which this instance if based on
     * @return {HTMLImageElement} Image element
     */
    getElement: function() {
      return this._element;
    },

    /**
     * Sets image element for this instance to a specified one.
     * If filters defined they are applied to new image.
     * You might need to call `canvas.renderAll` and `object.setCoords` after replacing, to render new image and update controls area.
     * @param {HTMLImageElement} element
     * @param {Function} [callback] Callback is invoked when all filters have been applied and new image is generated
     * @return {fabric.Image} thisArg
     * @chainable
     */
    setElement: function(element, callback) {
      this._element = element;
      this._originalElement = element;
      this._initConfig();

      if (this.filters.length !== 0) {
        this.applyFilters(callback);
      }

      return this;
    },

    /**
     * Sets crossOrigin value (on an instance and corresponding image element)
     * @return {fabric.Image} thisArg
     * @chainable
     */
    setCrossOrigin: function(value) {
      this.crossOrigin = value;
      this._element.crossOrigin = value;

      return this;
    },

    /**
     * Returns original size of an image
     * @return {Object} Object with "width" and "height" properties
     */
    getOriginalSize: function() {
      var element = this.getElement();
      return {
        width: element.width,
        height: element.height
      };
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _stroke: function(ctx) {
      ctx.save();
      this._setStrokeStyles(ctx);
      ctx.beginPath();
      ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.closePath();
      ctx.restore();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderDashedStroke: function(ctx) {
      var x = -this.width / 2,
          y = -this.height / 2,
          w = this.width,
          h = this.height;

      ctx.save();
      this._setStrokeStyles(ctx);

      ctx.beginPath();
      fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
      ctx.closePath();
      ctx.restore();
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        src: this._originalElement.src || this._originalElement._src,
        filters: this.filters.map(function(filterObj) {
          return filterObj && filterObj.toObject();
        }),
        crossOrigin: this.crossOrigin
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = [], x = -this.width / 2, y = -this.height / 2;
      if (this.group) {
        x = this.left;
        y = this.top;
      }
      markup.push(
        '<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n',
          '<image xlink:href="', this.getSvgSrc(),
            '" x="', x, '" y="', y,
            '" style="', this.getSvgStyles(),
            // we're essentially moving origin of transformation from top/left corner to the center of the shape
            // by wrapping it in container <g> element with actual transformation, then offsetting object to the top/left
            // so that object's center aligns with container's left/top
            '" width="', this.width,
            '" height="', this.height,
            '" preserveAspectRatio="none"',
          '></image>\n'
      );

      if (this.stroke || this.strokeDashArray) {
        var origFill = this.fill;
        this.fill = null;
        markup.push(
          '<rect ',
            'x="', x, '" y="', y,
            '" width="', this.width, '" height="', this.height,
            '" style="', this.getSvgStyles(),
          '"/>\n'
        );
        this.fill = origFill;
      }

      markup.push('</g>\n');

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns source of an image
     * @return {String} Source of an image
     */
    getSrc: function() {
      if (this.getElement()) {
        return this.getElement().src || this.getElement()._src;
      }
    },

    /**
     * Returns string representation of an instance
     * @return {String} String representation of an instance
     */
    toString: function() {
      return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
    },

    /**
     * Returns a clone of an instance
     * @param {Function} callback Callback is invoked with a clone as a first argument
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     */
    clone: function(callback, propertiesToInclude) {
      this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
    },

    /**
     * Applies filters assigned to this image (from "filters" array)
     * @mthod applyFilters
     * @param {Function} callback Callback is invoked when all filters have been applied and new image is generated
     * @return {fabric.Image} thisArg
     * @chainable
     */
    applyFilters: function(callback) {

      if (!this._originalElement) {
        return;
      }

      if (this.filters.length === 0) {
        this._element = this._originalElement;
        callback && callback();
        return;
      }

      var imgEl = this._originalElement,
          canvasEl = fabric.util.createCanvasElement(),
          replacement = fabric.util.createImage(),
          _this = this;

      canvasEl.width = imgEl.width;
      canvasEl.height = imgEl.height;

      canvasEl.getContext('2d').drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);

      this.filters.forEach(function(filter) {
        filter && filter.applyTo(canvasEl);
      });

       /** @ignore */

      replacement.width = imgEl.width;
      replacement.height = imgEl.height;

      if (fabric.isLikelyNode) {
        replacement.src = canvasEl.toBuffer(undefined, fabric.Image.pngCompression);

        // onload doesn't fire in some node versions, so we invoke callback manually
        _this._element = replacement;
        callback && callback();
      }
      else {
        replacement.onload = function() {
          _this._element = replacement;
          callback && callback();
          replacement.onload = canvasEl = imgEl = null;
        };
        replacement.src = canvasEl.toDataURL('image/png');
      }

      return this;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx, noTransform) {
      this._element &&
      ctx.drawImage(
        this._element,
        noTransform ? this.left : -this.width/2,
        noTransform ? this.top : -this.height/2,
        this.width,
        this.height
      );
      this._renderStroke(ctx);
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
     * @private
     * @param {HTMLImageElement|String} element The element representing the image
     */
    _initElement: function(element) {
      this.setElement(fabric.util.getById(element));
      fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
    },

    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initConfig: function(options) {
      options || (options = { });
      this.setOptions(options);
      this._setWidthHeight(options);
      if (this._element && this.crossOrigin) {
        this._element.crossOrigin = this.crossOrigin;
      }
    },

    /**
     * @private
     * @param {Object} object Object with filters property
     * @param {Function} callback Callback to invoke when all fabric.Image.filters instances are created
     */
    _initFilters: function(object, callback) {
      if (object.filters && object.filters.length) {
        fabric.util.enlivenObjects(object.filters, function(enlivenedObjects) {
          callback && callback(enlivenedObjects);
        }, 'fabric.Image.filters');
      }
      else {
        callback && callback();
      }
    },

    /**
     * @private
     * @param {Object} [options] Object with width/height properties
     */
    _setWidthHeight: function(options) {
      this.width = 'width' in options
        ? options.width
        : (this.getElement()
            ? this.getElement().width || 0
            : 0);

      this.height = 'height' in options
        ? options.height
        : (this.getElement()
            ? this.getElement().height || 0
            : 0);
    },

    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return 1;
    }
  });

  /**
   * Default CSS class name for canvas
   * @static
   * @type String
   * @default
   */
  fabric.Image.CSS_CANVAS = 'canvas-img';

  /**
   * Alias for getSrc
   * @static
   */
  fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc;

  /**
   * Creates an instance of fabric.Image from its object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when an image instance is created
   */
  fabric.Image.fromObject = function(object, callback) {
    fabric.util.loadImage(object.src, function(img) {
      fabric.Image.prototype._initFilters.call(object, object, function(filters) {
        object.filters = filters || [ ];
        var instance = new fabric.Image(img, object);
        callback && callback(instance);
      });
    }, null, object.crossOrigin);
  };

  /**
   * Creates an instance of fabric.Image from an URL string
   * @static
   * @param {String} url URL to create an image from
   * @param {Function} [callback] Callback to invoke when image is created (newly created image is passed as a first argument)
   * @param {Object} [imgOptions] Options object
   */
  fabric.Image.fromURL = function(url, callback, imgOptions) {
    fabric.util.loadImage(url, function(img) {
      callback(new fabric.Image(img, imgOptions));
    }, null, imgOptions && imgOptions.crossOrigin);
  };

  

  /**
   * Indicates that instances of this type are async
   * @static
   * @type Boolean
   * @default
   */
  fabric.Image.async = true;

  /**
   * Indicates compression level used when generating PNG under Node (in applyFilters). Any of 0-9
   * @static
   * @type Number
   * @default
   */
  fabric.Image.pngCompression = 1;

})(typeof exports !== 'undefined' ? exports : this);


/* Footer for requirejs AMD support */

window.fabric = fabric;

// make sure exports.fabric is always defined when used as 'global' later scopes
var exports = exports || {};
exports.fabric = fabric;

if (typeof define === 'function' && define.amd) {
  define([], function() { return fabric });
}

