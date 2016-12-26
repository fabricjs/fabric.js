fabric.ElementsParser = function(elements, callback, options, reviver) {
  this.elements = elements;
  this.callback = callback;
  this.options = options;
  this.reviver = reviver;
  this.svgUid = (options && options.svgUid) || 0;
  this.fillers = ['fill', 'stroke'];
};

fabric.ElementsParser.prototype.parse = function() {
  this.instances = new Array(this.elements.length);
  this.numElements = this.elements.length;

  this.createObjects();
};

fabric.ElementsParser.prototype.createObjects = function() {
  for (var i = 0, len = this.elements.length; i < len; i++) {
    this.elements[i].setAttribute('svgUid', this.svgUid);
    (function(_obj, i) {
      setTimeout(function() {
        _obj.createObject(_obj.elements[i], i);
      }, 0);
    })(this, i);
  }
};

fabric.ElementsParser.prototype.createObject = function(el, index) {
  var klass = fabric[fabric.util.string.capitalize(el.tagName.replace('svg:', ''))];
  if (klass && klass.fromElement) {
    try {
      this._createObject(klass, el, index);
    }
    catch (err) {
      fabric.log(err);
    }
  }
  else {
    this.checkIfDone();
  }
};

fabric.ElementsParser.prototype._createObject = function(klass, el, index) {
  var callback = this.createCallback(index, el);
  if (klass.async) {
    klass.fromElement(el, callback, this.options);
  }
  else {
    var obj = klass.fromElement(el, this.options);
    callback(obj);
  }
};

fabric.ElementsParser.prototype.createCallback = function(index, el) {
  var _this = this;
  return function(obj) {
    _this.resolveFillers(obj, function(_obj) {
      _this.reviver && _this.reviver(el, _obj);
      _this.instances[index] = _obj;
      _this.checkIfDone();
    });
  };
};

fabric.ElementsParser.prototype.resolveFillers = function(obj, callback) {
  var counter,
      _callback = function(_obj) {
        counter++;
        if (counter === 2) {
          callback(_obj);
        }
      };
  this.fillers.forEach(function(filler) {
    var instanceFillValue = obj.get(filler);
    if (!(/^url\(/).test(instanceFillValue)) {
      if (counter) {
        _callback(obj);
        return;
      }
    }
    var fillerId = instanceFillValue.slice(5, instanceFillValue.length - 1);
    if (fabric.gradientDefs[this.svgUid][fillerId]) {
      obj.set(filler, fabric.Gradient.fromElement(fabric.gradientDefs[this.svgUid][fillerId], obj));
      _callback(obj);
    }
    else if (fabric.patternDefs[this.svgUid][fillerId]) {
      fabric.Pattern.fromElement(fabric.patternDefs[this.svgUid][fillerId], obj, function(_pattern) {
        obj.set(filler, _pattern);
        _callback(obj);
      });
    }
  });
};

fabric.ElementsParser.prototype.checkIfDone = function() {
  if (--this.numElements === 0) {
    this.instances = this.instances.filter(function(el) {
      // eslint-disable-next-line no-eq-null, eqeqeq
      return el != null;
    });
    this.callback(this.instances);
  }
};
