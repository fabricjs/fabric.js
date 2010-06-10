Prototype.falseFunction = function () { return false; };

Element.addMethods({
  makeUnselectable: (function () {
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

    function makeUnselectable(element) {
      if (typeof element.onselectstart !== 'undefined') {
        element.onselectstart = Prototype.falseFunction;
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
    return makeUnselectable;
  })()
});

Element.addMethods('button', {
  enable: Field.enable,
  disable: Field.disable
});

/* speed up toJSON on arrays by not using `each` */
Array.prototype.toJSON = function() {
  var results = [];
  for (var i = 0, len = this.length; i < len; i++) {
    var value = Object.toJSON(this[i]);
    if (typeof value !== 'undefined') {
      results.push(value);
    }
  }
  return "[" + results.join(", ") + "]";
};

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
  
  Prototype.getScript = getScript;
  
  var Jaxer = this.Jaxer;
  if (Jaxer && Jaxer.load) {
    Prototype.getScript = getScriptJaxer;
  }
})();