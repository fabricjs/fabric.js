import { fabric } from '../../HEADER';
import type { FabricObject } from '../shapes/fabricObject.class';

export function createCollectionMixin(Klass: { new (...args: any[]): any }) {
  return class Collection extends Klass {
    /**
     * @type {FabricObject[]}
     */
    _objects: FabricObject[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onObjectAdded(object: FabricObject) {
      // subclasses should override this method
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onObjectRemoved(object: FabricObject) {
      // subclasses should override this method
    }

    /**
     * Adds objects to collection
     * Objects should be instances of (or inherit from) FabricObject
     * @param {...FabricObject[]} objects to add
     * @returns {number} new array length
     */
    add(...objects: FabricObject[]) {
      const size = this._objects.push(...objects);
      objects.forEach((object) => this._onObjectAdded(object));
      return size;
    }

    /**
     * Inserts an object into collection at specified index
     * @param {number} index Index to insert object at
     * @param {...FabricObject[]} objects Object(s) to insert
     * @returns {number} new array length
     */
    insertAt(index: number, ...objects: FabricObject[]) {
      this._objects.splice(index, 0, ...objects);
      objects.forEach((object) => this._onObjectAdded(object));
      return this._objects.length;
    }

    /**
     * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
     * @private
     * @param {...FabricObject[]} objects objects to remove
     * @returns {FabricObject[]} removed objects
     */
    remove(...objects: FabricObject[]) {
      const array = this._objects,
        removed: FabricObject[] = [];
      objects.forEach((object) => {
        const index = array.indexOf(object);
        // only call onObjectRemoved if an object was actually removed
        if (index !== -1) {
          array.splice(index, 1);
          removed.push(object);
          this._onObjectRemoved(object);
        }
      });
      return removed;
    }

    /**
     * Executes given function for each object in this group
     * A simple shortcut for getObjects().forEach, before es6 was more complicated,
     * now is just a shortcut.
     * @param {Function} callback
     *                   Callback invoked with current object as first argument,
     *                   index - as second and an array of all objects - as third.
     */
    forEachObject(
      callback: (
        object: FabricObject,
        index: number,
        array: FabricObject[]
      ) => any
    ) {
      this.getObjects().forEach((object, index, objects) =>
        callback(object, index, objects)
      );
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
  };
}

fabric.createCollectionMixin = createCollectionMixin;
