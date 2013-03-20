fabric.Collection = {

  /**
   * Adds objects to collection, then renders canvas (if `renderOnAddition` is not `false`)
   * Objects should be instances of (or inherit from) fabric.Object
   * @method add
   * @param [...] Zero or more fabric instances
   * @chainable
   */
  add: function () {
    this._objects.push.apply(this._objects, arguments);
    for (var i = arguments.length; i--; ) {
      this._onObjectAdded(arguments[i]);
    }
    this.renderOnAddition && this.renderAll();
    return this;
  },

  /**
   * Inserts an object into collection at specified index and renders canvas
   * An object should be an instance of (or inherit from) fabric.Object
   * @method insertAt
   * @param object {Object} Object to insert
   * @param index {Number} index to insert object at
   * @param nonSplicing {Boolean} when `true`, no splicing (shifting) of objects occurs
   * @chainable
   */
  insertAt: function (object, index, nonSplicing) {
    var objects = this.getObjects();
    if (nonSplicing) {
      objects[index] = object;
    }
    else {
      objects.splice(index, 0, object);
    }
    this._onObjectAdded(object);
    this.renderOnAddition && this.renderAll();
    return this;
  },

  /**
   * Removes an object from a group
   * @method remove
   * @param {Object} object
   * @return {fabric.Group} thisArg
   * @chainable
   */
  remove: function(object) {

    var objects = this.getObjects();
    var index = objects.indexOf(object);

    // only call onObjectRemoved if an object was actually removed
    if (index !== -1) {
      objects.splice(index, 1);
      this._onObjectRemoved(object);
    }

    this.renderAll && this.renderAll();
    return object;
  },

  /**
   * Executes given function for each object in this group
   * @method forEachObject
   * @param {Function} callback
   *                   Callback invoked with current object as first argument,
   *                   index - as second and an array of all objects - as third.
   *                   Iteration happens in reverse order (for performance reasons).
   *                   Callback is invoked in a context of Global Object (e.g. `window`)
   *                   when no `context` argument is given
   *
   * @param {Object} context Context (aka thisObject)
   * @chainable
   */
  forEachObject: function(callback, context) {
    var objects = this.getObjects(),
        i = objects.length;
    while (i--) {
      callback.call(context, objects[i], i, objects);
    }
    return this;
  },

  /**
   * Returns object at specified index
   * @method item
   * @param {Number} index
   * @return {fabric.Object}
   */
  item: function (index) {
    return this.getObjects()[index];
  },

  /**
   * Returns true if collection contains no objects
   * @method isEmpty
   * @return {Boolean} true if collection is empty
   */
  isEmpty: function () {
    return this.getObjects().length === 0;
  },

  /**
   * Returns a size of a collection (i.e: length of an array containing its objects)
   * @return {Number} Collection size
   */
  size: function() {
    return this.getObjects().length;
  },

  /**
   * Returns true if collection contains an object
   * @method contains
   * @param {Object} object Object to check against
   * @return {Boolean} `true` if collection contains an object
   */
  contains: function(object) {
    return this.getObjects().indexOf(object) > -1;
  },

  /**
   * Returns number representation of a collection complexity
   * @method complexity
   * @return {Number} complexity
   */
  complexity: function () {
    return this.getObjects().reduce(function (memo, current) {
      memo += current.complexity ? current.complexity() : 0;
      return memo;
    }, 0);
  },

  /**
   * Makes all of the collection objects grayscale (i.e. calling `toGrayscale` on them)
   * @method toGrayscale
   * @return {fabric.Group} thisArg
   * @chainable
   */
  toGrayscale: function() {
    return this.forEachObject(function(obj) {
      obj.toGrayscale();
    });
  }
};