/**
 * @namespace fabric.Collection
 */
fabric.Collection = {

  /**
   * @type {fabric.Object[]}
   */
  _objects: [],

  /**
   * Adds objects to collection, Canvas or Group, then renders canvas
   * (if `renderOnAddRemove` is not `false`).
   * Objects should be instances of (or inherit from) fabric.Object
   * @private
   * @param {fabric.Object[]} objects to add
   * @param {(object:fabric.Object) => any} [callback]
   * @returns {number} new array length
   */
  add: function (objects, callback) {
    var size = this._objects.push.apply(this._objects, objects);
    if (callback) {
      for (var i = 0, length = objects.length; i < length; i++) {
        callback.call(this, objects[i]);
      }
    }
    return size;
  },

  /**
   * Inserts an object into collection at specified index, then renders canvas (if `renderOnAddRemove` is not `false`)
   * An object should be an instance of (or inherit from) fabric.Object
   * @private
   * @param {fabric.Object|fabric.Object[]} objects Object(s) to insert
   * @param {Number} index Index to insert object at
   * @param {Boolean} nonSplicing When `true`, no splicing (shifting) of objects occurs
   * @param {(object:fabric.Object) => any} [callback]
   */
  insertAt: function (objects, index, nonSplicing, callback) {
    var deleteCount = nonSplicing ?
      Array.isArray(objects) ? objects.length : 1 :
      0;
    //  objects might be an array so we use concat
    var args = [index, deleteCount].concat(objects);
    this._objects.splice.apply(this._objects, args);
    if (callback) {
      for (var i = 2, length = args.length; i < length; i++) {
        callback.call(this, args[i]);
      }
    }
  },

  /**
   * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
   * @private
   * @param {fabric.Object[]} objectsToRemove objects to remove
   * @param {(object:fabric.Object) => any} [callback]
   * @returns {boolean} true if objects were removed
   */
  remove: function(objectsToRemove, callback) {
    var objects = this._objects,
        index, somethingRemoved = false;

    for (var i = 0, length = objectsToRemove.length; i < length; i++) {
      index = objects.indexOf(objectsToRemove[i]);
      // only call onObjectRemoved if an object was actually removed
      if (index !== -1) {
        somethingRemoved = true;
        objects.splice(index, 1);
        callback && callback.call(this, objectsToRemove[i]);
      }
    }
    return somethingRemoved;
  },

  /**
   * Executes given function for each object in this group
   * @param {Function} callback
   *                   Callback invoked with current object as first argument,
   *                   index - as second and an array of all objects - as third.
   *                   Callback is invoked in a context of Global Object (e.g. `window`)
   *                   when no `context` argument is given
   *
   * @param {Object} context Context (aka thisObject)
   * @return {Self} thisArg
   * @chainable
   */
  forEachObject: function(callback, context) {
    var objects = this.getObjects();
    for (var i = 0, len = objects.length; i < len; i++) {
      callback.call(context, objects[i], i, objects);
    }
    return this;
  },

  /**
   * Returns an array of children objects of this instance
   * @param {...String} [types] When specified, only objects of these types are returned
   * @return {Array}
   */
  getObjects: function() {
    if (arguments.length === 0) {
      return this._objects.concat();
    }
    else if (arguments.length === 1) {
      var type = arguments[0];
      return this._objects.filter(function (o) {
        return o.type === type;
      });
    }
    else {
      var types = Array.from(arguments);
      return this._objects.filter(function (o) {
        return types.indexOf(o.type) > -1;
      });
    }
  },

  /**
   * Returns object at specified index
   * @param {Number} index
   * @return {Self} thisArg
   */
  item: function (index) {
    return this._objects[index];
  },

  /**
   * Returns true if collection contains no objects
   * @return {Boolean} true if collection is empty
   */
  isEmpty: function () {
    return this._objects.length === 0;
  },

  /**
   * Returns a size of a collection (i.e: length of an array containing its objects)
   * @return {Number} Collection size
   */
  size: function() {
    return this._objects.length;
  },

  /**
   * Returns true if collection contains an object.\
   * **Prefer using {@link `fabric.Object#isDescendantOf`} for performance reasons**
   * @param {Object} object Object to check against
   * @param {Boolean} [deep=false] `true` to check all descendants, `false` to check only `_objects`
   * @return {Boolean} `true` if collection contains an object
   */
  contains: function (object, deep) {
    if (this._objects.indexOf(object) > -1) {
      return true;
    }
    else if (deep) {
      return this._objects.some(function (obj) {
        return typeof obj.contains === 'function' && obj.contains(object, true);
      });
    }
    return false;
  },

  /**
   * Returns number representation of a collection complexity
   * @return {Number} complexity
   */
  complexity: function () {
    return this._objects.reduce(function (memo, current) {
      memo += current.complexity ? current.complexity() : 0;
      return memo;
    }, 0);
  }
};
