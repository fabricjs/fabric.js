(function(global){
  var fabric = global.fabric;
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
        for (var i = 0; i < objects.length; i++) {
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
     * @param {(object:fabric.Object) => any} [callback]
     * @returns {number} new array length
     */
    insertAt: function (objects, index, callback) {
      var args = [index, 0].concat(objects);
      this._objects.splice.apply(this._objects, args);
      if (callback) {
        for (var i = 2; i < args.length; i++) {
          callback.call(this, args[i]);
        }
      }
      return this._objects.length;
    },

    /**
     * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
     * @private
     * @param {fabric.Object[]} objectsToRemove objects to remove
     * @param {(object:fabric.Object) => any} [callback] function to call for each object removed
     * @returns {fabric.Object[]} removed objects
     */
    remove: function(objectsToRemove, callback) {
      var objects = this._objects, removed = [];
      for (var i = 0, object, index; i < objectsToRemove.length; i++) {
        object = objectsToRemove[i];
        index = objects.indexOf(object);
        // only call onObjectRemoved if an object was actually removed
        if (index !== -1) {
          objects.splice(index, 1);
          removed.push(object);
          callback && callback.call(this, object);
        }
      }
      return removed;
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
      for (var i = 0; i < objects.length; i++) {
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
      var types = Array.from(arguments);
      return this._objects.filter(function (o) {
        return types.indexOf(o.type) > -1;
      });
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
     * instead of a.contains(b) use b.isDescendantOf(a)
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
})(typeof exports !== 'undefined' ? exports : window);
