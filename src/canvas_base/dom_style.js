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

  Canvas.base.setStyle = setStyle;
  
})();