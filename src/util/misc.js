(function() {
  
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
  };
  
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
    * @param {Function} [options.easing] Easing function
    * @param {Number} [options.duration=500] Duration of change
    */
   function animate(options) {

     options || (options = { });

     var start = +new Date(), 
         duration = options.duration || 500,
         finish = start + duration, time, pos,
         onChange = options.onChange || function() { },
         abort = options.abort || function() { return false; },
         easing = options.easing || function(pos) { return (-Math.cos(pos * Math.PI) / 2) + 0.5; },
         startValue = 'startValue' in options ? options.startValue : 0,
         endValue = 'endValue' in options ? options.endValue : 100,
         isReversed = startValue > endValue;

     options.onStart && options.onStart();

     var interval = setInterval(function() {
       time = +new Date();
       pos = time > finish ? 1 : (time - start) / duration;
       onChange(isReversed 
         ? (startValue - (startValue - endValue) * easing(pos)) 
         : (startValue + (endValue - startValue) * easing(pos)));
       if (time > finish || abort()) {
         clearInterval(interval);
         options.onComplete && options.onComplete();
       }
     }, 10);

     return interval;
   }
   
   
   /**
    * Used for caching SVG documents (loaded via `fabric.Canvas#loadSVGFromURL`)
    * @property
    * @namespace
    */
   var svgCache = {
     
     /**
      * @method has
      * @param {String} name
      * @param {Function} callback
      */
     has: function (name, callback) { 
       callback(false);
     },
     
     /**
      * @method get
      * @param {String} url
      * @param {Function} callback
      */
     get: function (url, callback) {
       /* NOOP */
     },
     
     /**
      * @method set
      * @param {String} url
      * @param {Object} object
      */
     set: function (url, object) {
       /* NOOP */
     }
   };
   
   /**
    * Takes url corresponding to an SVG document, and parses it to a set of objects
    * @method loadSVGFromURL
    * @param {String} url
    * @param {Function} callback
    */
   function loadSVGFromURL(url, callback) {
     
     url = url.replace(/^\n\s*/, '').replace(/\?.*$/, '').trim();
     
     svgCache.has(url, function (hasUrl) {
       if (hasUrl) {
         svgCache.get(url, function (value) {
           var enlivedRecord = _enlivenCachedObject(value);
           callback(enlivedRecord.objects, enlivedRecord.options);
         });
       }
       else {
         new fabric.util.request(url, {
           method: 'get',
           onComplete: onComplete
         });
       }
     });
     
     function onComplete(r) {
       
       var xml = r.responseXML;
       if (!xml) return;
       
       var doc = xml.documentElement;
       if (!doc) return;
       
       console.log(doc);
       
       fabric.parseSVGDocument(doc, function (results, options) {
         svgCache.set(url, {
           objects: fabric.util.array.invoke(results, 'toObject'),
           options: options
         });
         callback(results, options);
       });
     }
   }
   
  /**
  * @method _enlivenCachedObject
  */
  function _enlivenCachedObject(cachedObject) {
 
   var objects = cachedObject.objects,
       options = cachedObject.options;
 
   objects = objects.map(function (o) {
     return fabric[capitalize(o.type)].fromObject(o);
   });
 
   return ({ objects: objects, options: options });
  }
   
  function loadSVGFromString(string, callback) {
    var doc;
    if (typeof DOMParser !== 'undefined') {
      var parser = new DOMParser();
      if (parser && parser.parseFromString) {
        doc = parser.parseFromString(string, 'text/xml');
      }
    }
    else if (window.ActiveXObject) {
      var doc = new ActiveXObject('Microsoft.XMLDOM');
      if (doc && doc.loadXML) {
        doc.async = 'false';
        doc.loadXML(string);
      }
    }
    
    fabric.parseSVGDocument(doc.documentElement, function (results, options) {
      callback(results, options);
    });
  }
  
  fabric.util.removeFromArray = removeFromArray;
  fabric.util.degreesToRadians = degreesToRadians;
  fabric.util.toFixed = toFixed;
  fabric.util.getRandomInt = getRandomInt;
  fabric.util.falseFunction = falseFunction;
  fabric.util.animate = animate;
  
  fabric.loadSVGFromURL = loadSVGFromURL;
  fabric.loadSVGFromString = loadSVGFromString;
})();