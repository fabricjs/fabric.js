fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * @private
   * @returns {fabric.Group | fabric.Canvas}
   */
  _getStackManager: function () {
    //  current logic is strange
    //  if an object is part of an ActiveSelection, acting with it's stack methods changes it's z-index in the origin parent
    return this.__owningGroup || (!!this.group && this.group.type !== 'activeSelection' && this.group) || this.canvas;
  },

  /**
   * Moves an object to the bottom of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  sendToBack: function () {
    var parent = this._getStackManager();
    parent && parent.sendObjectToBack(this);
    return this;
  },

  /**
   * Moves an object to the top of the stack of drawn objects
   * @return {fabric.Object} thisArg
   * @chainable
   */
  bringToFront: function() {
    var parent = this._getStackManager();
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
    var parent = this._getStackManager();
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
    var parent = this._getStackManager();
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
    var parent = this._getStackManager();
    parent && parent.moveObjectTo(this, index);
    return this;
  }
});
