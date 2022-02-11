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
     * @returns {(fabric.Object | fabric.StaticCanvas)[]} ancestors from bottom to top
     */
    getAncestors: function () {
        var ancestors = [];
        var parent = this.group || this.canvas;
        while (parent) {
            ancestors.push(parent);
            parent = parent.group || parent.canvas;
        }
        return ancestors;
    },

});