fabric.ElementsParser = function(elements, callback, options, reviver, parsingOptions) {
  this.elements = elements;
  this.callback = callback;
  this.options = options;
  this.reviver = reviver;
  this.svgUid = (options && options.svgUid) || 0;
  this.parsingOptions = parsingOptions;
};

(function(proto) {
  proto.parse = function() {
    this.instances = new Array(this.elements.length);
    this.numElements = this.elements.length;
    this.createObjects();
  };

  proto.createObjects = function() {
    this.elements.forEach(function(element, i) {
      element.setAttribute('svgUid', this.svgUid);
      this.createObject(element, i);
    });
  };

  proto.findTag = function(el) {
    return fabric[fabric.util.string.capitalize(el.tagName.replace('svg:', ''))];
  };

  proto.createObject = function(el, index) {
    var klass = this.findTag(el);
    if (klass && klass.fromElement) {
      try {
        klass.fromElement(el, this.createCallback(index, el), this.options);
      }
      catch (err) {
        fabric.log(err);
      }
    }
    else {
      this.checkIfDone();
    }
  };

  proto.createCallback = function(index, el) {
    var _this = this;
    return function(obj) {
      var _options;
      _this.resolveGradient(obj, 'fill');
      _this.resolveGradient(obj, 'stroke');
      _this.resolveClipPath(obj);
      if (obj instanceof fabric.Image) {
        _options = obj.parsePreserveAspectRatioAttribute(el);
      }
      obj._removeTransformMatrix(_options);
      _this.reviver && _this.reviver(el, obj);
      _this.instances[index] = obj;
      _this.checkIfDone();
    };
  };

  proto.extractPropertyDefinition = function(obj, property, storage) {
    var value = obj.get(property);
    if (!(/^url\(/).test(value)) {
      return false;
    }
    var id = value.slice(5, value.length - 1);
    return fabric[storage][this.svgUid][id];
  };

  proto.resolveGradient = function(obj, property) {
    var gradientDef = this.extractPropertyDefinition(obj, property, 'gradientDefs');
    if (gradientDef) {
      obj.set(property, fabric.Gradient.fromElement(gradientDef, obj));
    }
  };

  proto.resolveClipPath = function(obj) {
    var clipPath = this.extractPropertyDefinition(obj, 'clipPath', 'clipPaths');
    if (clipPath) {
      obj.clipPath = clipPath.map(function(element) {
        var klass = this.findTag(element);
        return klass.fromElement(element, this.options);
      });
    }
  };

  proto.checkIfDone = function() {
    if (--this.numElements === 0) {
      this.instances = this.instances.filter(function(el) {
        // eslint-disable-next-line no-eq-null, eqeqeq
        return el != null;
      });
      this.callback(this.instances, this.elements);
    }
  };
})(fabric.ElementsParser.prototype);
