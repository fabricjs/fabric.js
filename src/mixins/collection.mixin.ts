import type { FabricObject } from "../shapes/object.class";

export function CollectionMixinGenerator<T extends new (...args: any[]) => any>(Klass: T) {
  return class Collection extends Klass {

    /**
     * @type {FabricObject[]}
     */
    _objects: FabricObject[] = []

    /**
     * Adds objects to collection, Canvas or Group, then renders canvas
     * (if `renderOnAddRemove` is not `false`).
     * Objects should be instances of (or inherit from) Object
     * @private
     * @param {FabricObject[]} objects to add
     * @param {(object:FabricObject) => any} [callback]
     * @returns {number} new array length
     */
    add(objects: FabricObject[], callback: (object: object) => any): number {
      var size = this._objects.push(...objects);
      if (callback) {
        for (var i = 0; i < objects.length; i++) {
          callback.call(this, objects[i]);
        }
      }
      return size;
    }

    /**
     * Inserts an object into collection at specified index, then renders canvas (if `renderOnAddRemove` is not `false`)
     * An object should be an instance of (or inherit from) Object
     * 
     * @param {FabricObject | FabricObject[]} arg Object(s) to insert
     * @param {Number} index Index to insert object at
     * @param {(object: FabricObject) => any} [callback]
     * @returns {number} new array length
     */
    insertAt(arg: FabricObject | FabricObject[], index: number, callback: (object: FabricObject) => any): number {
      const objects = Array.isArray(arg) ? arg : [arg];
      this._objects.splice(index, 0, ...objects);
      if (callback) {
        objects.forEach(callback.bind(this));
      }
      return this._objects.length;
    }

    /**
     * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
     * @private
     * @param {FabricObject[]} objectsToRemove objects to remove
     * @param {(object:FabricObject) => any} [callback] function to call for each object removed
     * @returns {FabricObject[]} removed objects
     */
    remove(objectsToRemove: FabricObject[], callback: (object: FabricObject) => any): FabricObject[] {
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
    }

    /**
     * Executes given function for each object in this group
     * @param {Function} callback
     *                   Callback invoked with current object as first argument,
     *                   index - as second and an array of all objects - as third.
     *                   Callback is invoked in a context of Global Object (e.g. `window`)
     *                   when no `context` argument is given
     *
     * @param {FabricObject} context Context (aka thisObject)
     * @chainable
     */
    forEachObject(callback: (object: FabricObject, index: number, array: FabricObject[]) => any, context?: object) {
      var objects = this.getObjects();
      for (var i = 0; i < objects.length; i++) {
        callback.call(context, objects[i], i, objects);
      }
      return this;
    }

    /**
     * Returns an array of children objects of this instance
     * @param {...String} [types] When specified, only objects of these types are returned
     */
    getObjects(...types: string[]) {
      if (types.length === 0) {
        return this._objects.concat();
      }
      return this._objects.filter((o) => types.includes(o.type));
    }

    /**
     * Returns object at specified index
     * @param {Number} index
     */
    item(index: number) {
      return this._objects[index];
    }

    /**
     * Returns true if collection contains no objects
     * @return {Boolean} true if collection is empty
     */
    isEmpty(): boolean {
      return this._objects.length === 0;
    }

    /**
     * Returns a size of a collection (i.e: length of an array containing its objects)
     * @return {Number} Collection size
     */
    size(): number {
      return this._objects.length;
    }

    /**
     * Returns true if collection contains an object.\
     * **Prefer using {@link `Object#isDescendantOf`} for performance reasons**
     * instead of a.contains(b) use b.isDescendantOf(a)
     * @param {FabricObject} object Object to check against
     * @param {Boolean} [deep=false] `true` to check all descendants, `false` to check only `_objects`
     * @return {Boolean} `true` if collection contains an object
     */
    contains(object: FabricObject, deep: boolean = false): boolean {
      if (this._objects.indexOf(object) > -1) {
        return true;
      }
      else if (deep) {
        return this._objects.some(function (obj) {
          return typeof obj.contains === 'function' && obj.contains(object, true);
        });
      }
      return false;
    }

    /**
     * Returns number representation of a collection complexity
     * @return {Number} complexity
     */
    complexity(): number {
      return this._objects.reduce(function (memo, current) {
        memo += current.complexity ? current.complexity() : 0;
        return memo;
      }, 0);
    }
  }
}
