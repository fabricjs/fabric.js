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

    /**
     * 
     * @param {fabric.Object} other 
     * @returns {{ index: number, otherIndex: number, ancestors: fabric.Object[] }} ancestors may include the passed objects if one is an ancestor of the other resulting in index of -1
     */
    findCommonAncestors: function (other) {
        if (this === other) {
            return true;
        }
        else if (!other) {
            return false;
        }
        var ancestors = this.getAncestors();
        ancestors.unshift(this);
        var otherAncestors = other.getAncestors();
        otherAncestors.unshift(other);
        for (var i = 0, ancestor; i < ancestors.length; i++) {
            ancestor = ancestors[i];
            for (var j = 0; j < otherAncestors.length; j++) {
                if (ancestor === otherAncestors[j] && !(ancestor instanceof fabric.StaticCanvas)) {
                    return {
                        index: i - 1,
                        otherIndex: j - 1,
                        ancestors: ancestors.slice(i)
                    };
                }
            }
        }
    },

    /**
     * 
     * @param {fabric.Object} other 
     * @returns {boolean}
     */
    hasCommonAncestors: function (other) {
        return !!this.findCommonAncestors(other);
    }

});