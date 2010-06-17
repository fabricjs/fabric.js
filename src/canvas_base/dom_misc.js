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
      prop = 'className';
    }
    else if (prop === 'for') {
      prop = 'htmlFor';
    }
    el[prop] = attributes[prop];
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
    // TODO (kangax): test return value
    return element;
  }
  
  Canvas.base.makeElementUnselectable = makeElementUnselectable
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
  
  Canvas.base.getScript = getScript;
  
  var Jaxer = this.Jaxer;
  if (Jaxer && Jaxer.load) {
    Canvas.base.getScript = getScriptJaxer;
  }
})();

Canvas.base.getById = getById;
Canvas.base.toArray = toArray;
Canvas.base.makeElement = makeElement;
Canvas.base.addClass = addClass;
Canvas.base.wrapElement = wrapElement;
Canvas.base.getElementOffset = getElementOffset;