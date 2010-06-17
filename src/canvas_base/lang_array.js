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

function invoke(array, method) {
  var args = slice.call(arguments, 2), result = [ ];
  for (var i = 0, len = array.length; i < len; i++) {
    result[i] = method.apply(array[i], args);
  }
  return result;
}

function max(array, context) {
  var i = array.length - 1, result = array[i];
  while (i--) {
    if (array[i] >= result) {
      result = array[i];
    }
  }
  return result;
}

function min(array, context) {
  var i = array.length - 1, result = array[i];
  while (i--) {
    if (array[i] < result) {
      result = array[i];
    }
  }
  return result;
}

Canvas.base.array = {
  invoke: invoke,
  min: min,
  max: max
};