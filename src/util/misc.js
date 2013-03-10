(function() {

  var sqrt = Math.sqrt,
      atan2 = Math.atan2;

  /**
   * @namespace Various utilities
   */
  fabric.util = { };

  /**
   * Removes value from an array.
   * Presence of value (and its position in an array) is determined via `Array.prototype.indexOf`
   * @static
   * @memberOf fabric.util
   * @method removeFromArray
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
  }

  /**
   * Returns random number between 2 specified ones.
   * @static
   * @method getRandomInt
   * @memberOf fabric.util
   * @param {Number} min lower limit
   * @param {Number} max upper limit
   * @return {Number} random value (between min and max)
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var PiBy180 = Math.PI / 180;

  /**
   * Transforms degrees to radians.
   * @static
   * @method degreesToRadians
   * @memberOf fabric.util
   * @param {Number} degrees value in degrees
   * @return {Number} value in radians
   */
  function degreesToRadians(degrees) {
    return degrees * PiBy180;
  }

  /**
   * Transforms radians to degrees.
   * @static
   * @method radiansToDegrees
   * @memberOf fabric.util
   * @param {Number} radians value in radians
   * @return {Number} value in degrees
   */
  function radiansToDegrees(radians) {
    return radians / PiBy180;
  }

  /**
   * Rotates `point` around `origin` with `radians`
   * @static
   * @method rotatePoint
   * @memberOf fabric.util
   * @param {fabric.Point} The point to rotate
   * @param {fabric.Point} The origin of the rotation
   * @param {Number} The radians of the angle for the rotation
   * @return {fabric.Point} The new rotated point
   */
  function rotatePoint(point, origin, radians) {
    var sin = Math.sin(radians),
        cos = Math.cos(radians);

    point.subtractEquals(origin);

    var rx = point.x * cos - point.y * sin;
    var ry = point.x * sin + point.y * cos;

    return new fabric.Point(rx, ry).addEquals(origin);
  }

  /**
   * A wrapper around Number#toFixed, which contrary to native method returns number, not string.
   * @static
   * @method toFixed
   * @memberOf fabric.util
   * @param {Number | String} number number to operate on
   * @param {Number} fractionDigits number of fraction digits to "leave"
   * @return {Number}
   */
   function toFixed(number, fractionDigits) {
     return parseFloat(Number(number).toFixed(fractionDigits));
   }

   /**
    * Function which always returns `false`.
    * @static
    * @method falseFunction
    * @memberOf fabric.util
    * @return {Boolean}
    */
   function falseFunction() {
     return false;
   }

   /**
    * Changes value from one to another within certain period of time, invoking callbacks as value is being changed.
    * @method animate
    * @memberOf fabric.util
    * @param {Object} [options] Animation options
    * @param {Function} [options.onChange] Callback; invoked on every value change
    * @param {Function} [options.onComplete] Callback; invoked when value change is completed
    * @param {Number} [options.startValue=0] Starting value
    * @param {Number} [options.endValue=100] Ending value
    * @param {Number} [options.byValue=100] Value to modify the property by
    * @param {Function} [options.easing] Easing function
    * @param {Number} [options.duration=500] Duration of change
    */
  function animate(options) {

    options || (options = { });

    var start = +new Date(),
      duration = options.duration || 500,
      finish = start + duration, time,
      onChange = options.onChange || function() { },
      abort = options.abort || function() { return false; },
      easing = options.easing || function(t, b, c, d) {return -c * Math.cos(t/d * (Math.PI/2)) + c + b;},
      startValue = 'startValue' in options ? options.startValue : 0,
      endValue = 'endValue' in options ? options.endValue : 100,
      byValue = options.byValue || endValue - startValue;

    options.onStart && options.onStart();

    (function tick() {
      time = +new Date();
      var currentTime = time > finish ? duration : (time - start);
      onChange(easing(currentTime, startValue, byValue, duration));
      if (time > finish || abort()) {
        options.onComplete && options.onComplete();
        return;
      }
      requestAnimFrame(tick);
    })();
  }

  var _requestAnimFrame = fabric.window.requestAnimationFrame       ||
                          fabric.window.webkitRequestAnimationFrame ||
                          fabric.window.mozRequestAnimationFrame    ||
                          fabric.window.oRequestAnimationFrame      ||
                          fabric.window.msRequestAnimationFrame     ||
                          function(callback) {
                            fabric.window.setTimeout(callback, 1000 / 60);
                          };
  /**
    * requestAnimationFrame polyfill based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    * @method requestAnimFrame
    * @memberOf fabric.util
    * @param {Function} callback Callback to invoke
    * @param {DOMElement} element optional Element to associate with animation
    */
  var requestAnimFrame = function() {
    return _requestAnimFrame.apply(fabric.window, arguments);
  };

  /**
    * Loads image element from given url and passes it to a callback
    * @method loadImage
    * @memberOf fabric.util
    * @param {String} url URL representing an image
    * @param {Function} callback Callback; invoked with loaded image
    * @param {Any} context optional Context to invoke callback in
    */
  function loadImage(url, callback, context) {
    if (url) {
      var img = new Image();
      /** @ignore */
      img.onload = function () {
        callback && callback.call(context, img);
        img = img.onload = null;
      };
      img.src = url;
    }
    else {
      callback && callback.call(context, url);
    }
  }

  /**
   * Creates corresponding fabric instances from their object representations
   * @static
   * @memberOf fabric.util
   * @method enlivenObjects
   * @param {Array} objects Objects to enliven
   * @param {Function} callback Callback to invoke when all objects are created
   */
  function enlivenObjects(objects, callback) {

    function getKlass(type) {
      return fabric[fabric.util.string.camelize(fabric.util.string.capitalize(type))];
    }

    function onLoaded() {
      if (++numLoadedObjects === numTotalObjects) {
        if (callback) {
          callback(enlivenedObjects);
        }
      }
    }

    var enlivenedObjects = [ ],
        numLoadedObjects = 0,
        numTotalObjects = objects.length;

    objects.forEach(function (o, index) {
      if (!o.type) {
        return;
      }
      var klass = getKlass(o.type);
      if (klass.async) {
        klass.fromObject(o, function (o, error) {
          if (!error) {
            enlivenedObjects[index] = o;
          }
          onLoaded();
        });
      }
      else {
        enlivenedObjects[index] = klass.fromObject(o);
        onLoaded();
      }
    });
  }

  /**
   * Groups SVG elements (usually those retrieved from SVG document)
   * @static
   * @memberOf fabric.util
   * @method groupSVGElements
   * @param {Array} elements SVG elements to group
   * @param {Object} [options] Options object
   * @return {fabric.Object|fabric.PathGroup}
   */
  function groupSVGElements(elements, options, path) {
    var object;

    if (elements.length > 1) {
      var hasText = elements.some(function(el) { return el.type === 'text'; });

      if (hasText) {
        object = new fabric.Group([ ], options);
        elements.reverse().forEach(function(obj) {
          if (obj.cx) {
            obj.left = obj.cx;
          }
          if (obj.cy) {
            obj.top = obj.cy;
          }
          object.addWithUpdate(obj);
        });
      }
      else {
        object = new fabric.PathGroup(elements, options);
      }
    }
    else {
      object = elements[0];
    }

    if (typeof path !== 'undefined') {
      object.setSourcePath(path);
    }
    return object;
  }

  /**
   * Populates an object with properties of another object
   * @static
   * @memberOf fabric.util
   * @method populateWithProperties
   * @param {Object} source Source object
   * @param {Object} destination Destination object
   * @return {Array} properties Propertie names to include
   */
  function populateWithProperties(source, destination, properties) {
    if (properties && Object.prototype.toString.call(properties) === '[object Array]') {
      for (var i = 0, len = properties.length; i < len; i++) {
        destination[properties[i]] = source[properties[i]];
      }
    }
  }

  /**
   * Draws a dashed line between two points
   *
   * This method is used to draw dashed line around selection area.
   * See <a href="http://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas">dotted stroke in canvas</a>
   *
   * @method drawDashedLine
   * @param ctx {Canvas} context
   * @param x {Number} start x coordinate
   * @param y {Number} start y coordinate
   * @param x2 {Number} end x coordinate
   * @param y2 {Number} end y coordinate
   * @param da {Array} dash array pattern
   */
  function drawDashedLine(ctx, x, y, x2, y2, da) {
    var dx = x2 - x,
        dy = y2 - y,
        len = sqrt(dx*dx + dy*dy),
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
  }

  /**
   * Creates canvas element and initializes it via excanvas if necessary
   * @static
   * @memberOf fabric.util
   * @method createCanvasElement
   * @param {CanvasElement} [canvasEl] optional canvas element to initialize; when not given, element is created implicitly
   * @return {CanvasElement} initialized canvas element
   */
  function createCanvasElement(canvasEl) {
    canvasEl || (canvasEl = fabric.document.createElement('canvas'));
    if (!canvasEl.getContext && typeof G_vmlCanvasManager !== 'undefined') {
      G_vmlCanvasManager.initElement(canvasEl);
    }
    return canvasEl;
  }

  /**
   * Creates accessors (getXXX, setXXX) for a "class", based on "stateProperties" array
   * @static
   * @memberOf fabric.util
   * @method createAccessors
   * @param {Object} klass "Class" to create accessors for
   */
  function createAccessors(klass) {
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
  }

  /**
   * @method clipContext
   */
  function clipContext(receiver, ctx) {
    ctx.save();
    ctx.beginPath();
    receiver.clipTo(ctx);
    ctx.clip();
  }

  fabric.util.removeFromArray = removeFromArray;
  fabric.util.degreesToRadians = degreesToRadians;
  fabric.util.radiansToDegrees = radiansToDegrees;
  fabric.util.rotatePoint = rotatePoint;
  fabric.util.toFixed = toFixed;
  fabric.util.getRandomInt = getRandomInt;
  fabric.util.falseFunction = falseFunction;
  fabric.util.animate = animate;
  fabric.util.requestAnimFrame = requestAnimFrame;
  fabric.util.loadImage = loadImage;
  fabric.util.enlivenObjects = enlivenObjects;
  fabric.util.groupSVGElements = groupSVGElements;
  fabric.util.populateWithProperties = populateWithProperties;
  fabric.util.drawDashedLine = drawDashedLine;
  fabric.util.createCanvasElement = createCanvasElement;
  fabric.util.createAccessors = createAccessors;
  fabric.util.clipContext = clipContext;

})();