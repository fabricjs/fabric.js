import type { Constructor, TBBox } from './typedefs';
import { removeFromArray } from './util/internals/removeFromArray';
import { Point } from './Point';
import type { ActiveSelection } from './shapes/ActiveSelection';
import type { Group } from './shapes/Group';
import type { InteractiveFabricObject } from './shapes/Object/InteractiveObject';
import type { FabricObject } from './shapes/Object/FabricObject';

export const isCollection = (
  fabricObject?: FabricObject,
): fabricObject is Group | ActiveSelection => {
  return !!fabricObject && Array.isArray((fabricObject as Group)._objects);
};

export function createCollectionMixin<TBase extends Constructor>(Base: TBase) {
  class Collection extends Base {
    /**
     * @type {FabricObject[]}
     * @TODO needs to end up in the constructor too
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onStackOrderChanged(object: FabricObject) {
      // subclasses should override this method
    }

    /**
     * Adds objects to collection
     * Objects should be instances of (or inherit from) FabricObject
     * @param {...FabricObject[]} objects to add
     * @returns {number} new array length
     */
    add(...objects: FabricObject[]): number {
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
        array: FabricObject[],
      ) => any,
    ) {
      this.getObjects().forEach((object, index, objects) =>
        callback(object, index, objects),
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
      return this._objects.filter((o) => o.isType(...types));
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
     * **Prefer using {@link FabricObject#isDescendantOf} for performance reasons**
     * instead of `a.contains(b)` use `b.isDescendantOf(a)`
     * @param {Object} object Object to check against
     * @param {Boolean} [deep=false] `true` to check all descendants, `false` to check only `_objects`
     * @return {Boolean} `true` if collection contains an object
     */
    contains(object: FabricObject, deep?: boolean): boolean {
      if (this._objects.includes(object)) {
        return true;
      } else if (deep) {
        return this._objects.some(
          (obj) =>
            obj instanceof Collection &&
            (obj as unknown as Collection).contains(object, true),
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

    /**
     * Moves an object or the objects of a multiple selection
     * to the bottom of the stack of drawn objects
     * @param {fabric.Object} object Object to send to back
     * @returns {boolean} true if change occurred
     */
    sendObjectToBack(object: FabricObject) {
      if (!object || object === this._objects[0]) {
        return false;
      }
      removeFromArray(this._objects, object);
      this._objects.unshift(object);
      this._onStackOrderChanged(object);
      return true;
    }

    /**
     * Moves an object or the objects of a multiple selection
     * to the top of the stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @returns {boolean} true if change occurred
     */
    bringObjectToFront(object: FabricObject) {
      if (!object || object === this._objects[this._objects.length - 1]) {
        return false;
      }
      removeFromArray(this._objects, object);
      this._objects.push(object);
      this._onStackOrderChanged(object);
      return true;
    }

    /**
     * Moves an object or a selection down in stack of drawn objects
     * An optional parameter, `intersecting` allows to move the object in behind
     * the first intersecting object. Where intersection is calculated with
     * bounding box. If no intersection is found, there will not be change in the
     * stack.
     * @param {fabric.Object} object Object to send
     * @param {boolean} [intersecting] If `true`, send object behind next lower intersecting object
     * @returns {boolean} true if change occurred
     */
    sendObjectBackwards(object: FabricObject, intersecting?: boolean) {
      if (!object) {
        return false;
      }
      const idx = this._objects.indexOf(object);
      if (idx !== 0) {
        // if object is not on the bottom of stack
        const newIdx = this.findNewLowerIndex(object, idx, intersecting);
        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
        this._onStackOrderChanged(object);
        return true;
      }
      return false;
    }

    /**
     * Moves an object or a selection up in stack of drawn objects
     * An optional parameter, intersecting allows to move the object in front
     * of the first intersecting object. Where intersection is calculated with
     * bounding box. If no intersection is found, there will not be change in the
     * stack.
     * @param {fabric.Object} object Object to send
     * @param {boolean} [intersecting] If `true`, send object in front of next upper intersecting object
     * @returns {boolean} true if change occurred
     */
    bringObjectForward(object: FabricObject, intersecting?: boolean) {
      if (!object) {
        return false;
      }
      const idx = this._objects.indexOf(object);
      if (idx !== this._objects.length - 1) {
        // if object is not on top of stack (last item in an array)
        const newIdx = this.findNewUpperIndex(object, idx, intersecting);
        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
        this._onStackOrderChanged(object);
        return true;
      }
      return false;
    }

    /**
     * Moves an object to specified level in stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @param {number} index Position to move to
     * @returns {boolean} true if change occurred
     */
    moveObjectTo(object: FabricObject, index: number) {
      if (object === this._objects[index]) {
        return false;
      }
      removeFromArray(this._objects, object);
      this._objects.splice(index, 0, object);
      this._onStackOrderChanged(object);
      return true;
    }

    findNewLowerIndex(
      object: FabricObject,
      idx: number,
      intersecting?: boolean,
    ) {
      let newIdx;

      if (intersecting) {
        newIdx = idx;
        // traverse down the stack looking for the nearest intersecting object
        for (let i = idx - 1; i >= 0; --i) {
          if (object.isOverlapping(this._objects[i])) {
            newIdx = i;
            break;
          }
        }
      } else {
        newIdx = idx - 1;
      }

      return newIdx;
    }

    findNewUpperIndex(
      object: FabricObject,
      idx: number,
      intersecting?: boolean,
    ) {
      let newIdx;

      if (intersecting) {
        newIdx = idx;
        // traverse up the stack looking for the nearest intersecting object
        for (let i = idx + 1; i < this._objects.length; ++i) {
          if (object.isOverlapping(this._objects[i])) {
            newIdx = i;
            break;
          }
        }
      } else {
        newIdx = idx + 1;
      }

      return newIdx;
    }

    /**
     * Given a bounding box, return all the objects of the collection that are contained in the bounding box.
     * If `includeIntersecting` is true, return also the objects that intersect the bounding box as well.
     * This is meant to work with selection. Is not a generic method.
     * @param {TBBox} bbox a bounding box in scene coordinates
     * @param {{ includeIntersecting?: boolean }} options an object with includeIntersecting
     * @returns array of objects contained in the bounding box, ordered from top to bottom stacking wise
     */
    collectObjects(
      { left, top, width, height }: TBBox,
      { includeIntersecting = true }: { includeIntersecting?: boolean } = {},
    ) {
      const objects: InteractiveFabricObject[] = [],
        tl = new Point(left, top),
        br = tl.add(new Point(width, height));

      // we iterate reverse order to collect top first in case of click.
      for (let i = this._objects.length - 1; i >= 0; i--) {
        const object = this._objects[i] as unknown as InteractiveFabricObject;
        if (
          object.selectable &&
          object.visible &&
          ((includeIntersecting && object.intersectsWithRect(tl, br)) ||
            object.isContainedWithinRect(tl, br) ||
            (includeIntersecting && object.containsPoint(tl)) ||
            (includeIntersecting && object.containsPoint(br)))
        ) {
          objects.push(object);
        }
      }

      return objects;
    }
  }

  // https://github.com/microsoft/TypeScript/issues/32080
  return Collection;
}
