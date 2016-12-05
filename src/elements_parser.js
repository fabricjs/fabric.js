fabric.ElementsParser = function(elements, callback, options, reviver) {
  this.elements = elements;
  this.callback = callback;
  this.options = options;
  this.reviver = reviver;
  this.svgUid = (options && options.svgUid) || 0;
};

fabric.ElementsParser.prototype.parse = function() {
  this.instances = new Array(this.elements.length);
  this.numElements = this.elements.length;

  this.createObjects();
};

fabric.ElementsParser.prototype.createObjects = function() {
  for (var i = 0, len = this.elements.length; i < len; i++) {
    this.elements[i].setAttribute('svgUid', this.svgUid);
    this.createObject(this.elements[i], i);
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
  if (klass.async) {
    klass.fromElement(el, this.createCallback(index, el), this.options);
  }
  else {
    var obj = klass.fromElement(el, this.options);
    this.resolveGradient(obj, 'fill');
    this.resolveGradient(obj, 'stroke');
    this.resolveClipPath(obj);
    this.reviver && this.reviver(el, obj);
    this.instances[index] = obj;
    this.checkIfDone();
  }
};

fabric.ElementsParser.prototype.createCallback = function(index, el) {
  var _this = this;
  return function(obj) {
    _this.resolveGradient(obj, 'fill');
    _this.resolveGradient(obj, 'stroke');
    _this.resolveClipPath(obj);
    _this.reviver && _this.reviver(el, obj);
    _this.instances[index] = obj;
    _this.checkIfDone();
  };
};

fabric.ElementsParser.prototype.extractPropertyDefinition = function(obj, property, storage) {
  var value = obj.get(property);
  if (!(/^url\(/).test(value)) {
    return false;
  }
  var id = value.slice(5, value.length - 1);
  return fabric[storage][this.svgUid][id];
};

fabric.ElementsParser.prototype.resolveGradient = function(obj, property) {
  var gradientDef = this.extractPropertyDefinition(obj, property, 'gradientDefs');
  if (gradientDef) {
    obj.set(property, fabric.Gradient.fromElement(gradientDef, obj));
  }
};

fabric.ElementsParser.prototype.resolveClipPath = function(obj) {
  var clipPath = this.extractPropertyDefinition(obj, 'clipPath', 'clipPaths');
  if (clipPath) {
    obj.clipPath = [];
    for (var i = 0; i < clipPath.length; i++) {
      // from clip-path specs, element from clip-path are all parsed syncronously
      var klass = fabric[fabric.util.string.capitalize(clipPath[i].tagName.replace('svg:', ''))];
      var _clipPath = klass.fromElement(clipPath[i], this.options);
      obj.clipPath.push(_clipPath);
    }
  }
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
