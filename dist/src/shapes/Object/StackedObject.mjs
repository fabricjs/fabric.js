import { ObjectGeometry } from './ObjectGeometry.mjs';

class StackedObject extends ObjectGeometry {
  /**
   * A reference to the parent of the object
   * Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref
   */

  /**
   * Checks if object is descendant of target
   * Should be used instead of {@link Group.contains} or {@link StaticCanvas.contains} for performance reasons
   * @param {TAncestor} target
   * @returns {boolean}
   */
  isDescendantOf(target) {
    const {
      parent,
      group
    } = this;
    return parent === target || group === target || this.canvas === target ||
    // walk up
    !!parent && parent.isDescendantOf(target) || !!group && group !== parent && group.isDescendantOf(target);
  }

  /**
   * @returns {Ancestors} ancestors (excluding `ActiveSelection`) from bottom to top
   */
  getAncestors() {
    const ancestors = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let parent = this;
    do {
      parent = parent instanceof StackedObject ? parent.parent : undefined;
      parent && ancestors.push(parent);
    } while (parent);
    return ancestors;
  }

  /**
   * Compare ancestors
   *
   * @param {StackedObject} other
   * @returns {AncestryComparison} an object that represent the ancestry situation.
   */
  findCommonAncestors(other) {
    if (this === other) {
      return {
        fork: [],
        otherFork: [],
        common: [this, ...this.getAncestors()]
      };
    }
    const ancestors = this.getAncestors();
    const otherAncestors = other.getAncestors();
    //  if `this` has no ancestors and `this` is top ancestor of `other` we must handle the following case
    if (ancestors.length === 0 && otherAncestors.length > 0 && this === otherAncestors[otherAncestors.length - 1]) {
      return {
        fork: [],
        otherFork: [other, ...otherAncestors.slice(0, otherAncestors.length - 1)],
        common: [this]
      };
    }
    //  compare ancestors
    for (let i = 0, ancestor; i < ancestors.length; i++) {
      ancestor = ancestors[i];
      if (ancestor === other) {
        return {
          fork: [this, ...ancestors.slice(0, i)],
          otherFork: [],
          common: ancestors.slice(i)
        };
      }
      for (let j = 0; j < otherAncestors.length; j++) {
        if (this === otherAncestors[j]) {
          return {
            fork: [],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: [this, ...ancestors]
          };
        }
        if (ancestor === otherAncestors[j]) {
          return {
            fork: [this, ...ancestors.slice(0, i)],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: ancestors.slice(i)
          };
        }
      }
    }
    // nothing shared
    return {
      fork: [this, ...ancestors],
      otherFork: [other, ...otherAncestors],
      common: []
    };
  }

  /**
   *
   * @param {StackedObject} other
   * @returns {boolean}
   */
  hasCommonAncestors(other) {
    const commonAncestors = this.findCommonAncestors(other);
    return commonAncestors && !!commonAncestors.common.length;
  }

  /**
   *
   * @param {FabricObject} other object to compare against
   * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
   */
  isInFrontOf(other) {
    if (this === other) {
      return undefined;
    }
    const ancestorData = this.findCommonAncestors(other);
    if (ancestorData.fork.includes(other)) {
      return true;
    }
    if (ancestorData.otherFork.includes(this)) {
      return false;
    }
    // if there isn't a common ancestor, we take the canvas.
    // if there is no canvas, there is nothing to compare
    const firstCommonAncestor = ancestorData.common[0] || this.canvas;
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

export { StackedObject };
//# sourceMappingURL=StackedObject.mjs.map
