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

// TODO (kangax): need to fix this method
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
  	// causes issue in Opera
  	// headEl.removeChild(scriptEl);
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