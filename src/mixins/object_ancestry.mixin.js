fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
     *
     * @param {boolean} [strict] returns only ancestors that are objects (without canvas)
     * @returns {(fabric.Object | fabric.StaticCanvas)[]} ancestors from bottom to top
     */
  getAncestors: function (strict) {
    var ancestors = [];
    var parent = this.group || (!strict ? this.canvas : undefined);
    while (parent) {
      ancestors.push(parent);
      parent = parent.group || (!strict ? parent.canvas : undefined);
    }
    return ancestors;
  }
});
