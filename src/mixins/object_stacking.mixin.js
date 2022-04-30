fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Moves an object to the bottom of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  sendToBack: function () {
    var parent = this.getParent();
    parent && parent.sendObjectToBack(this);
    return this;
  },

  /**
   * Moves an object to the top of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  bringToFront: function() {
    var parent = this.getParent();
    parent && parent.bringObjectToFront(this);
    return this;
  },

  /**
   * Moves an object down in stack of drawn objects
   * @param {Boolean} [intersecting] If `true`, send object behind next lower intersecting object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  sendBackwards: function(intersecting) {
    var parent = this.getParent();
    parent && parent.sendObjectBackwards(this, intersecting);
    return this;
  },

  /**
   * Moves an object up in stack of drawn objects
   * @param {Boolean} [intersecting] If `true`, send object in front of next upper intersecting object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  bringForward: function(intersecting) {
    var parent = this.getParent();
    parent && parent.bringObjectForward(this, intersecting);
    return this;
  },

  /**
   * Moves an object to specified level in stack of drawn objects
   * @param {Number} index New position of object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  moveTo: function(index) {
    var parent = this.getParent();
    parent && parent.moveObjectTo(this, index);
    return this;
  },

  /**
   *
   * @param {fabric.Object} other object to compare against
   * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
   */
  isInFrontOf: function (other) {
    if (this === other) {
      return undefined;
    }
    var ancestorData = this.findCommonAncestors(other);
    if (!ancestorData) {
      return undefined;
    }
    if (ancestorData.fork.includes(other)) {
      return true;
    }
    if (ancestorData.otherFork.includes(this)) {
      return false;
    }
    var firstCommonAncestor = ancestorData.common[0];
    if (!firstCommonAncestor) {
      return undefined;
    }
    var headOfFork = ancestorData.fork.pop(),
        headOfOtherFork = ancestorData.otherFork.pop(),
        thisIndex = firstCommonAncestor._objects.indexOf(headOfFork),
        otherIndex = firstCommonAncestor._objects.indexOf(headOfOtherFork);
    return thisIndex > -1 && thisIndex > otherIndex;
  }
});
