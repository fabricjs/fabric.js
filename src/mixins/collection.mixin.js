/**
 * @namespace fabric.Collection
 */
fabric.Collection = {

  /**
   * Adds objects to collection, then renders canvas (if `renderOnAddRemove` is not `false`)
   * Objects should be instances of (or inherit from) fabric.Object
   * @param {...fabric.Object} object Zero or more fabric instances
   * @return {Self} thisArg
   */
  add: function () {
    this._objects.push.apply(this._objects, arguments);
    for (var i = 0, length = arguments.length; i < length; i++) {
      this._onObjectAdded(arguments[i]);
    }
    this.renderOnAddRemove && this.renderAll();
    return this;
  },

  /**
   * Inserts an object into collection at specified index, then renders canvas (if `renderOnAddRemove` is not `false`)
   * An object should be an instance of (or inherit from) fabric.Object
   * @param {Object} object Object to insert
   * @param {Number} index Index to insert object at
   * @param {Boolean} nonSplicing When `true`, no splicing (shifting) of objects occurs
   * @return {Self} thisArg
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
    this.renderOnAddRemove && this.renderAll();
    return this;
  },

  /**
   * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
   * @param {...fabric.Object} object Zero or more fabric instances
   * @return {Self} thisArg
   * @chainable
   */
  remove: function() {
    var objects = this.getObjects(),
        index;

    for (var i = 0, length = arguments.length; i < length; i++) {
      index = objects.indexOf(arguments[i]);

      // only call onObjectRemoved if an object was actually removed
      if (index !== -1) {
        objects.splice(index, 1);
        this._onObjectRemoved(arguments[i]);
      }
    }

    this.renderOnAddRemove && this.renderAll();
    return this;
  },

  /**
   * Executes given function for each object in this group
   * @param {Function} callback
   *                   Callback invoked with current object as first argument,
   *                   index - as second and an array of all objects - as third.
   *                   Iteration happens in reverse order (for performance reasons).
   *                   Callback is invoked in a context of Global Object (e.g. `window`)
   *                   when no `context` argument is given
   *
   * @param {Object} context Context (aka thisObject)
   * @return {Self} thisArg
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
   * Returns an array of children objects of this instance
   * Type parameter introduced in 1.3.10
   * @param {String} [type] When specified, only objects of this type are returned
   * @return {Array}
   */
  getObjects: function(type) {
    if (typeof type === 'undefined') {
      return this._objects;
    }
    return this._objects.filter(function(o) {
      return o.type === type;
    });
  },

  /**
   * Returns object at specified index
   * @param {Number} index
   * @return {Self} thisArg
   */
  item: function (index) {
    return this.getObjects()[index];
  },

  /**
   * Returns true if collection contains no objects
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
   * @param {Object} object Object to check against
   * @return {Boolean} `true` if collection contains an object
   */
  contains: function(object) {
    return this.getObjects().indexOf(object) > -1;
  },

  /**
   * Returns number representation of a collection complexity
   * @return {Number} complexity
   */
  complexity: function () {
    return this.getObjects().reduce(function (memo, current) {
      memo += current.complexity ? current.complexity() : 0;
      return memo;
    }, 0);
  },

  /**
   * Returns all objects in the collection that intersect a given rectangle
   * @param  {Object} rectCoords Rectangle coordinates to check against
   * @return {Array} An array of fabric.Object
   */
  getObjectsInsideRect: function(rectCoords) {
    return this._objects.filter(function(obj){
      return fabric.util.doCoordinatesIntersect(rectCoords, obj.getCoords());
    });
  },

  /**
   * Gets the index within `this._objects` for the given object
   * @param  {fabric.Object} obj The object to find
   * @return {Number} The index of the object
   */
  indexForObject: function(obj) {
    return this._objects.indexOf(obj);
  },

  /**
   * For a given rectangle, specified by its coordinates, returns
   * an array of objects within the collection that can be linked to the rectangle
   * by a chain of intersecting objects. Used to determine which objects should
   * be redrawn after a rectangle is cleared in performanceMode.
   *
   * An object will only pass the test if its index within the collection is
   * higher than the object we're testing against. This is because if object A
   * is above object B and object A has changed, redrawing only object A is the 
   * correct behaviour. However if object B is above object A in the same case, 
   * both need to be redrawn.
   *
   * @todo  Explain this better!
   * @param  {Object} rectCoords Rectangle coordinates to check against
   * @param  {Object} excludeObjs Objects that can be skipped
   * @return {Array} An array of fabric.Object
   */
  iterativelyGetObjectsInsideRect: function(rectCoords, excludeObjs) {

    // Pretend we already have an object
    var dummyObject = {
      getCoords: function() {
        return rectCoords;
      }
    };

    var intersectingObjects = [],
        allObjs = this._objects.filter(function(el) {
          return el.visible && excludeObjs.indexOf(el) === -1;
        }),
        foundStack = [dummyObject],
        foundObj,
        i,
        objToTest,
        remainingObjsToTest;

    while (foundStack.length > 0) {
      foundObj = foundStack.shift();
      intersectingObjects.push(foundObj);
      remainingObjsToTest = [];
      for (i = 0; i < allObjs.length; i++) {
        objToTest = allObjs[i];
        if ((fabric.util.doCoordinatesIntersect(foundObj.getCoords(), objToTest.getCoords()) &&
          this.indexForObject(objToTest) > this.indexForObject(foundObj))) {
          foundStack.push(objToTest);
        } else {
          remainingObjsToTest.push(objToTest);
        }
      }
      allObjs = remainingObjsToTest;
    }

    intersectingObjects.shift(); // Remove the dummy object

    return intersectingObjects;
  }
};
