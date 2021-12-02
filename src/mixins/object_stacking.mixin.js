fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Moves an object to the bottom of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  sendToBack: function () {
    var stack = this.parent || this.group || this.canvas;
    stack && fabric.StaticCanvas.prototype.sendToBack.call(stack, this);
    return this;
  },

  /**
   * Moves an object to the top of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  bringToFront: function() {
    var stack = this.parent || this.group || this.canvas;
    stack && fabric.StaticCanvas.prototype.bringToFront.call(stack, this);
    return this;
  },

  /**
   * Moves an object down in stack of drawn objects
   * @param {Boolean} [intersecting] If `true`, send object behind next lower intersecting object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  sendBackwards: function(intersecting) {
    var stack = this.parent || this.group || this.canvas;
    stack && fabric.StaticCanvas.prototype.sendBackwards.call(stack, this, intersecting);
    return this;
  },

  /**
   * Moves an object up in stack of drawn objects
   * @param {Boolean} [intersecting] If `true`, send object in front of next upper intersecting object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  bringForward: function (intersecting) {
    var stack = this.parent || this.group || this.canvas;
    stack && fabric.StaticCanvas.prototype.bringForward.call(stack, this, intersecting);
    return this;
  },

  /**
   * Moves an object to specified level in stack of drawn objects
   * @param {Number} index New position of object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  moveTo: function(index) {
    var stack = this.parent || this.group || this.canvas;
    stack && fabric.StaticCanvas.prototype.moveTo.call(stack, this, index);
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
    var ancestors = this.getAncestors().reverse().concat(this);
    var otherAncestors = other.getAncestors().reverse().concat(other);
    var i, j, found = false;
    //  find the common ancestor
    for (i = 0; i < ancestors.length; i++) {
      for (j = 0; j < otherAncestors.length; j++) {
        if (ancestors[i] === otherAncestors[j]) {
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
    if (!found) {
      return undefined;
    }
    //  compare trees from the common ancestor down
    var tree = ancestors.slice(i),
      otherTree = otherAncestors.slice(j),
      a, b, parent;
    for (i = 1; i < Math.min(tree.length, otherTree.length); i++) {
      a = tree[i];
      b = otherTree[i];
      if (a !== b) {
        parent = tree[i - 1];
        return parent._objects.indexOf(a) > parent._objects.indexOf(b);
      }
    }
    //  happens if a is ancestor of b or vice versa
    return tree.length > otherTree.length;
  }

});
