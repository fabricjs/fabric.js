fabric.ElementsParser = function(elements, callback, options, reviver) {
  this.elements = elements;
  this.callback = callback;
  this.options = options;
  this.reviver = reviver;
};

fabric.ElementsParser.prototype.parse = function() {
  this.instances = new Array(this.elements.length);
  this.numElements = this.elements.length;

  this.createObjects();
};

fabric.ElementsParser.prototype.createObjects = function() {
  for (var i = 0, len = this.elements.length; i < len; i++) {
    (function(_this, i) {
      setTimeout(function() {
        _this.createObject(_this.elements[i], i);
      }, 0);
    })(this, i);
  }
};

fabric.ElementsParser.prototype.createObject = function(el, index) {
  var klass = fabric[fabric.util.string.capitalize(el.tagName)];
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
  if (klass.async) {
    klass.fromElement(el, this.createCallback(index, el), this.options);
  }
  else {
    var obj = klass.fromElement(el, this.options);
    this.reviver && this.reviver(el, obj);
    this.instances.splice(index, 0, obj);
    this.checkIfDone();
  }
};

fabric.ElementsParser.prototype.createCallback = function(index, el) {
  var _this = this;
  return function(obj) {
    _this.reviver && _this.reviver(el, obj);
    _this.instances.splice(index, 0, obj);
    _this.checkIfDone();
  };
};

fabric.ElementsParser.prototype.checkIfDone = function() {
  if (--this.numElements === 0) {
    this.instances = this.instances.filter(function(el) {
      return el != null;
    });
    fabric.resolveGradients(this.instances);
    this.callback(this.instances);
  }
};
