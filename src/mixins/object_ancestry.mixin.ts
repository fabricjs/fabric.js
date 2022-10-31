// @ts-nocheck

import { fabric } from '../../HEADER';
import type { FabricObject } from '../shapes/fabricObject.class';
import type { Group } from '../shapes/group.class';
import type { Canvas, StaticCanvas } from '../__types__';

export class FabricObjectAncestryMixin {
  group?: Group;
  canvas?: StaticCanvas;

  /**
   * Checks if object is descendant of target
   * Should be used instead of @link {fabric.Collection.contains} for performance reasons
   * @param {FabricObject|fabric.StaticCanvas} target
   * @returns {boolean}
   */
  isDescendantOf(target: FabricObject | StaticCanvas) {
    let parent = this.group || this.canvas;
    while (parent) {
      if (target === parent) {
        return true;
      } else if (parent instanceof fabric.StaticCanvas) {
        //  happens after all parents were traversed through without a match
        return false;
      }
      parent = parent.group || parent.canvas;
    }
    return false;
  }

  /**
   *
   * @typedef {FabricObject[] | [...FabricObject[], fabric.StaticCanvas]} Ancestors
   *
   * @param {boolean} [strict] returns only ancestors that are objects (without canvas)
   * @returns {Ancestors} ancestors from bottom to top
   */
  getAncestors(strict?: boolean) {
    const ancestors: (Group | StaticCanvas | Canvas)[] = [];
    let parent = this.group || (strict ? undefined : this.canvas);
    while (parent) {
      ancestors.push(parent);
      parent = parent.group || (strict ? undefined : parent.canvas);
    }
    return ancestors;
  }

  /**
   * Returns an object that represent the ancestry situation.
   *
   * @typedef {object} AncestryComparison
   * @property {Ancestors} common ancestors of `this` and `other` (may include `this` | `other`)
   * @property {Ancestors} fork ancestors that are of `this` only
   * @property {Ancestors} otherFork ancestors that are of `other` only
   *
   * @param {FabricObject} other
   * @param {boolean} [strict] finds only ancestors that are objects (without canvas)
   * @returns {AncestryComparison | undefined}
   *
   */
  findCommonAncestors(
    this: FabricObject & this,
    other: FabricObject & this,
    strict?: boolean
  ) {
    if (this === other) {
      return {
        fork: [] as FabricObject[],
        otherFork: [] as FabricObject[],
        common: [this, ...this.getAncestors(strict)],
      };
    } else if (!other) {
      // meh, warn and inform, and not my issue.
      // the argument is NOT optional, we can't end up here.
      return undefined;
    }
    const ancestors = this.getAncestors(strict);
    const otherAncestors = other.getAncestors(strict);
    //  if `this` has no ancestors and `this` is top ancestor of `other` we must handle the following case
    if (
      ancestors.length === 0 &&
      otherAncestors.length > 0 &&
      this === otherAncestors[otherAncestors.length - 1]
    ) {
      return {
        fork: [],
        otherFork: [
          other,
          ...otherAncestors.slice(0, otherAncestors.length - 1),
        ],
        common: [this],
      };
    }
    //  compare ancestors
    for (let i = 0, ancestor; i < ancestors.length; i++) {
      ancestor = ancestors[i];
      if (ancestor === other) {
        return {
          fork: [this, ...ancestors.slice(0, i)],
          otherFork: [],
          common: ancestors.slice(i),
        };
      }
      for (let j = 0; j < otherAncestors.length; j++) {
        if (this === otherAncestors[j]) {
          return {
            fork: [],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: [this, ...ancestors],
          };
        }
        if (ancestor === otherAncestors[j]) {
          return {
            fork: [this, ...ancestors.slice(0, i)],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: ancestors.slice(i),
          };
        }
      }
    }
    // nothing shared
    return {
      fork: [this, ...ancestors],
      otherFork: [other, ...otherAncestors],
      common: [],
    };
  }

  /**
   *
   * @param {FabricObject} other
   * @param {boolean} [strict] checks only ancestors that are objects (without canvas)
   * @returns {boolean}
   */
  hasCommonAncestors(
    this: FabricObject & this,
    other: FabricObject & this,
    strict?: boolean
  ) {
    const commonAncestors = this.findCommonAncestors(other, strict);
    return commonAncestors && !!commonAncestors.common.length;
  }

  /**
   *
   * @param {FabricObject} other object to compare against
   * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
   */
  isInFrontOf(this: FabricObject & this, other: FabricObject & this) {
    if (this === other) {
      return undefined;
    }
    const ancestorData = this.findCommonAncestors(other);
    if (!ancestorData) {
      return undefined;
    }
    if (ancestorData.fork.includes(other)) {
      return true;
    }
    if (ancestorData.otherFork.includes(this)) {
      return false;
    }
    const firstCommonAncestor = ancestorData.common[0];
    if (!firstCommonAncestor) {
      return undefined;
    }
    const headOfFork = ancestorData.fork.pop(),
      headOfOtherFork = ancestorData.otherFork.pop(),
      thisIndex = firstCommonAncestor._objects.indexOf(headOfFork),
      otherIndex = firstCommonAncestor._objects.indexOf(headOfOtherFork);
    return thisIndex > -1 && thisIndex > otherIndex;
  }
}
