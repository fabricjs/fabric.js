//@ts-nocheck
(function (global) {
  var fabric = global.fabric;
  /**
   * @namespace fabric.CommonMethods
   */
  fabric.CommonMethods = {
    /**
     * Sets object's properties from options
     * @param {Object} [options] Options object
     */
    _setOptions: function (options) {
      for (var prop in options) {
        this.set(prop, options[prop]);
      }
    },

    /**
     * @private
     */
    _setObject: function (obj) {
      for (var prop in obj) {
        this._set(prop, obj[prop]);
      }
    },

    /**
     * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
     * @param {String|Object} key Property name or object (if object, iterate over the object properties)
     * @param {Object|Function} value Property value (if function, the value is passed into it and its return value is used as a new one)
     * @return {fabric.Object} thisArg
     * @chainable
     */
    set: function (key, value) {
      if (typeof key === 'object') {
        this._setObject(key);
      } else {
        this._set(key, value);
      }
      return this;
    },

    _set: function (key, value) {
      this[key] = value;
    },

    /**
     * Toggles specified property from `true` to `false` or from `false` to `true`
     * @param {String} property Property to toggle
     * @return {fabric.Object} thisArg
     * @chainable
     */
    toggle: function (property) {
      var value = this.get(property);
      if (typeof value === 'boolean') {
        this.set(property, !value);
      }
      return this;
    },

    /**
     * Basic getter
     * @param {String} property Property name
     * @return {*} value of a property
     */
    get: function (property) {
      return this[property];
    },
  };
})(typeof exports !== 'undefined' ? exports : window);
