fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Moves an object to the bottom of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  sendToBack: function () {
    var parent = this.__owningGroup || this.group || this.canvas;
    parent && parent.sendToBack(this);
    return this;
  },

  /**
   * Moves an object to the top of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  bringToFront: function() {
    var parent = this.__owningGroup || this.group || this.canvas;
    parent && parent.bringToFront(this);
    return this;
  },

  /**
   * Moves an object down in stack of drawn objects
   * @param {Boolean} [intersecting] If `true`, send object behind next lower intersecting object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  sendBackwards: function(intersecting) {
    var parent = this.__owningGroup || this.group || this.canvas;
    parent && parent.sendBackwards(this, intersecting);
    return this;
  },

  /**
   * Moves an object up in stack of drawn objects
   * @param {Boolean} [intersecting] If `true`, send object in front of next upper intersecting object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  bringForward: function(intersecting) {
    var parent = this.__owningGroup || this.group || this.canvas;
    parent && parent.bringForward(this, intersecting);
    return this;
  },

  /**
   * Moves an object to specified level in stack of drawn objects
   * @param {Number} index New position of object
   * @return {fabric.Object} thisArg
   * @chainable
   */
  moveTo: function(index) {
    var parent = this.__owningGroup || this.group || this.canvas;
    parent && parent.moveTo(this, index);
    return this;
  }
});
