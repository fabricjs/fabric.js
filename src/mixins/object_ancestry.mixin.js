fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Checks if object is decendant of target
   * Should be used instead of @link {fabric.Collection.contains} for performance reasons
   * @param {fabric.Object|fabric.StaticCanvas} target
   * @returns {boolean}
   */
  isDescendantOf: function (target) {
    var parent = this.group || this.canvas;
    while (parent) {
      if (target === parent) {
        return true;
      }
      else if (parent instanceof fabric.StaticCanvas) {
        //  happens after all parents were traversed through without a match
        return false;
      }
      parent = parent.group || parent.canvas;
    }
    return false;
  },

  /**
   *
   * @typedef {fabric.Object[] | [...fabric.Object[], fabric.StaticCanvas]} Ancestors
   *
   * @param {boolean} [strict] returns only ancestors that are objects (without canvas)
   * @returns {Ancestors} ancestors from bottom to top
   */
  getAncestors: function (strict) {
    var ancestors = [];
    var parent = this.group || (strict ? undefined : this.canvas);
    while (parent) {
      ancestors.push(parent);
      parent = parent.group || (strict ? undefined : parent.canvas);
    }
    return ancestors;
  },

  /**
   * Returns an object that represent the ancestry situation.
   *
   * @typedef {object} AncestryComparison
   * @property {Ancestors} common ancestors of `this` and `other` (may include `this` | `other`)
   * @property {Ancestors} fork ancestors that are of `this` only
   * @property {Ancestors} otherFork ancestors that are of `other` only
   *
   * @param {fabric.Object} other
   * @param {boolean} [strict] finds only ancestors that are objects (without canvas)
   * @returns {AncestryComparison | undefined}
   *
   */
  findCommonAncestors: function (other, strict) {
    if (this === other) {
      return {
        fork: [],
        otherFork: [],
        common: [this].concat(this.getAncestors(strict))
      };
    }
    else if (!other) {
      // meh, warn and inform, and not my issue.
      // the argument is NOT optional, we can't end up here.
      return undefined;
    }
    var ancestors = this.getAncestors(strict);
    var otherAncestors = other.getAncestors(strict);
    //  if `this` has no ancestors and `this` is top ancestor of `other` we must handle the following case
    if (ancestors.length === 0 && otherAncestors.length > 0 && this === otherAncestors[otherAncestors.length - 1]) {
      return {
        fork: [],
        otherFork: [other].concat(otherAncestors.slice(0, otherAncestors.length - 1)),
        common: [this]
      };
    }
    //  compare ancestors
    for (var i = 0, ancestor; i < ancestors.length; i++) {
      ancestor = ancestors[i];
      if (ancestor === other) {
        return {
          fork: [this].concat(ancestors.slice(0, i)),
          otherFork: [],
          common: ancestors.slice(i)
        };
      }
      for (var j = 0; j < otherAncestors.length; j++) {
        if (this === otherAncestors[j]) {
          return {
            fork: [],
            otherFork: [other].concat(otherAncestors.slice(0, j)),
            common: [this].concat(ancestors)
          };
        }
        if (ancestor === otherAncestors[j]) {
          return {
            fork: [this].concat(ancestors.slice(0, i)),
            otherFork: [other].concat(otherAncestors.slice(0, j)),
            common: ancestors.slice(i)
          };
        }
      }
    }
    // nothing shared
    return {
      fork: [this].concat(ancestors),
      otherFork: [other].concat(otherAncestors),
      common: []
    };
  },

  /**
   *
   * @param {fabric.Object} other
   * @param {boolean} [strict] checks only ancestors that are objects (without canvas)
   * @returns {boolean}
   */
  hasCommonAncestors: function (other, strict) {
    var commonAncestors = this.findCommonAncestors(other, strict);
    return commonAncestors && !!commonAncestors.ancestors.length;
  }
});
