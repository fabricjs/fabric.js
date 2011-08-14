(function() {
  
  var slice = Array.prototype.slice;
  
  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })();
  
  var addMethods;
  if (IS_DONTENUM_BUGGY) {
    /** @ignore */
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
    /** @ignore */
    addMethods = function(klass, source) {
      for (var property in source) {
        klass.prototype[property] = source[property];
      }
    };
  }

  function subclass() { };
  
  /**
   * Helper for creation of "classes"
   * @method createClass
   * @memberOf fabric.util
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