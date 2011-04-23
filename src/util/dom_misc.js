var _slice = Array.prototype.slice;

/**
 * Takes id and returns an element with that id (if one exists in a document)
 * @method getById
 * @memberOf fabric.util
 * @param {String|HTMLElement} id
 * @return {HTMLElement|null}
 */
function getById(id) {
  return typeof id === 'string' ? document.getElementById(id) : id;
}

/**
 * Converts an array-like object (e.g. arguments or NodeList) to an array
 * @method toArray
 * @memberOf fabric.util
 * @param {Object} arrayLike
 * @return {Array}
 */
function toArray(arrayLike) {
  return _slice.call(arrayLike, 0);
}

try {
  var sliceCanConvertNodelists = toArray(document.childNodes) instanceof Array;
}
catch(err) { }

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
 * @method makeElement
 * @memberOf fabric.util
 * @param {String} tagName Type of an element to create
 * @param {Object} [attributes] Attributes to set on an element
 * @return {HTMLElement} Newly created element
 */
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

/**
 * Adds class to an element
 * @method addClass
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to add class to
 * @param {String} className Class to add to an element
 */
function addClass(element, className) {
  if ((' ' + element.className + ' ').indexOf(' ' + className + ' ') === -1) {
    element.className += (element.className ? ' ' : '') + className;
  }  
}

/**
 * Wraps element with another element
 * @method wrapElement
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
 * Returns offset for a given element
 * @method getElementOffset
 * @function
 * @memberOf fabric.util
 * @param {HTMLElement} element Element to get offset for
 * @return {Object} Object with "left" and "top" properties
 */
function getElementOffset(element) {
  // TODO (kangax): need to fix this method
  var valueT = 0, valueL = 0;
  do {
    valueT += element.offsetTop  || 0;
    valueL += element.offsetLeft || 0;
    element = element.offsetParent;
  } 
  while (element);
  return ({ left: valueL, top: valueT });
}

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
  
  /**
   * Makes element unselectable
   * @method makeElementUnselectable
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
    else if (typeof element.unselectable == 'string') {
      element.unselectable = 'on';
    }
    return element;
  }
  
  fabric.util.makeElementUnselectable = makeElementUnselectable;
})();

(function() {
  
  /**
   * Inserts a script element with a given url into a document; invokes callback, when that script is finished loading
   * @method getScript
   * @memberOf fabric.util
   * @param {String} url URL of a script to load
   * @param {Function} callback Callback to execute when script is finished loading
   */
  function getScript(url, callback) {
  	var headEl = document.getElementsByTagName("head")[0],
  	    scriptEl = document.createElement('script'), 
  	    loading = true;

  	scriptEl.type = 'text/javascript';
  	scriptEl.setAttribute('runat', 'server');
  	
  	/** @ignore */
  	scriptEl.onload = /** @ignore */ scriptEl.onreadystatechange = function(e) {
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
  	// causes issue in Opera
  	// headEl.removeChild(scriptEl);
  }
  
  function getScriptJaxer(url, callback) {
    Jaxer.load(url);
    callback();
  }
  
  fabric.util.getScript = getScript;
  
  var Jaxer = global.Jaxer;
  if (Jaxer && Jaxer.load) {
    fabric.util.getScript = getScriptJaxer;
  }
})();

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

fabric.util.getById = getById;
fabric.util.toArray = toArray;
fabric.util.makeElement = makeElement;
fabric.util.addClass = addClass;
fabric.util.wrapElement = wrapElement;
fabric.util.getElementOffset = getElementOffset;
fabric.util.animate = animate;