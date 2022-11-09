import { fabric } from '../../HEADER';
import type { FabricObject } from '../shapes/fabricObject.class';

type ObjectCallback = (object: FabricObject) => any;

export class Collection {
  /**
   * @type {FabricObject[]}
   */
  _objects: FabricObject[] = [];

  /**
   * Adds objects to collection
   * Objects should be instances of (or inherit from) FabricObject
   * @param {FabricObject[]} objects to add
   * @param {ObjectCallback} [callback]
   * @returns {number} new array length
   */
  add(objects: FabricObject[], callback: ObjectCallback) {
    const size = this._objects.push(...objects);
    objects.forEach(callback.bind(this));
    return size;
  }

  /**
   * Inserts an object into collection at specified index
   * @param {FabricObject|FabricObject[]} objects Object(s) to insert
   * @param {number} index Index to insert object at
   * @param {ObjectCallback} [callback]
   * @returns {number} new array length
   */
  insertAt(
    objects: FabricObject | FabricObject[],
    index: number,
    callback: ObjectCallback
  ) {
    objects = Array.isArray(objects) ? objects : [objects];
    this._objects.splice(index, 0, ...objects);
    callback && objects.forEach(callback.bind(this));
    return this._objects.length;
  }

  /**
   * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
   * @private
   * @param {FabricObject[]} objectsToRemove objects to remove
   * @param {ObjectCallback} [callback] function to call for each object removed
   * @returns {FabricObject[]} removed objects
   */
  remove(objectsToRemove: FabricObject[], callback: ObjectCallback) {
    const objects = this._objects,
      removed: FabricObject[] = [];
    objectsToRemove.forEach((object) => {
      const index = objects.indexOf(object);
      // only call onObjectRemoved if an object was actually removed
      if (index !== -1) {
        objects.splice(index, 1);
        removed.push(object);
        callback && callback.call(this, object);
      }
    });
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
   * @param {Object} context Context (aka thisObject)
   */
  forEachObject<T>(
    callback: (
      this: T | undefined,
      object: FabricObject,
      index: number,
      array: FabricObject[]
    ) => any,
    context?: T
  ) {
    this.getObjects().forEach(callback.bind(context));
  }

  /**
   * Returns an array of children objects of this instance
   * @param {...String} [types] When specified, only objects of these types are returned
   * @return {Array}
   */
  getObjects(...types: string[]) {
    if (types.length === 0) {
      return [...this._objects];
    }
    return this._objects.filter((o) => types.includes(o.type));
  }

  /**
   * Returns object at specified index
   * @param {Number} index
   * @return {Object} object at index
   */
  item(index: number) {
    return this._objects[index];
  }

  /**
   * Returns true if collection contains no objects
   * @return {Boolean} true if collection is empty
   */
  isEmpty() {
    return this._objects.length === 0;
  }

  /**
   * Returns a size of a collection (i.e: length of an array containing its objects)
   * @return {Number} Collection size
   */
  size() {
    return this._objects.length;
  }

  /**
   * Returns true if collection contains an object.\
   * **Prefer using {@link `FabricObject#isDescendantOf`} for performance reasons**
   * instead of a.contains(b) use b.isDescendantOf(a)
   * @param {Object} object Object to check against
   * @param {Boolean} [deep=false] `true` to check all descendants, `false` to check only `_objects`
   * @return {Boolean} `true` if collection contains an object
   */
  contains(object: FabricObject, deep?: boolean): boolean {
    if (this._objects.includes(object)) {
      return true;
    } else if (deep) {
      return this._objects.some(
        (obj) => obj instanceof Collection && obj.contains(object, true)
      );
    }
    return false;
  }

  /**
   * Returns number representation of a collection complexity
   * @return {Number} complexity
   */
  complexity() {
    return this._objects.reduce((memo, current) => {
      memo += current.complexity ? current.complexity() : 0;
      return memo;
    }, 0);
  }
}

fabric.Collection = new Collection();
