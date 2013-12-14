fabric.ElementsParser = {

  parse: function(elements, callback, options, reviver) {

    this.elements = elements;
    this.callback = callback;
    this.options = options;
    this.reviver = reviver;

    this.instances = new Array(elements.length);
    this.numElements = elements.length;

    this.createObjects();
  },

  createObjects: function() {
    for (var i = 0, len = this.elements.length; i < len; i++) {
      (function(_this, i) {
        setTimeout(function() {
          _this.createObject(_this.elements[i], i);
        }, 0);
      })(this, i);
    }
  },

  createObject: function(el, index) {
    var klass = fabric[fabric.util.string.capitalize(el.tagName)];
    if (klass && klass.fromElement) {
      try {
        this._createObject(klass, el, index);
      }
      catch(err) {
        fabric.log(err);
      }
    }
    else {
      this.checkIfDone();
    }
  },

  _createObject: function(klass, el, index) {
    if (klass.async) {
      klass.fromElement(el, this.createCallback(index, el), this.options);
    }
    else {
      var obj = klass.fromElement(el, this.options);
      this.reviver && this.reviver(el, obj);
      this.instances.splice(index, 0, obj);
      this.checkIfDone();
    }
  },

  createCallback: function(index, el) {
    var _this = this;
    return function(obj) {
      _this.reviver && _this.reviver(el, obj);
      _this.instances.splice(index, 0, obj);
      _this.checkIfDone();
    };
  },

  checkIfDone: function() {
    if (--this.numElements === 0) {
      this.instances = this.instances.filter(function(el) {
        return el != null;
      });
      fabric.resolveGradients(this.instances);
      this.callback(this.instances);
    }
  }
};
