import { Observable } from './Observable.mjs';

class CommonMethods extends Observable {
  /**
   * Sets object's properties from options, for initialization only
   * @protected
   * @param {Object} [options] Options object
   */
  _setOptions() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    for (const prop in options) {
      this.set(prop, options[prop]);
    }
  }

  /**
   * @private
   */
  _setObject(obj) {
    for (const prop in obj) {
      this._set(prop, obj[prop]);
    }
  }

  /**
   * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
   * @param {String|Object} key Property name or object (if object, iterate over the object properties)
   * @param {Object|Function} value Property value (if function, the value is passed into it and its return value is used as a new one)
   */
  set(key, value) {
    if (typeof key === 'object') {
      this._setObject(key);
    } else {
      this._set(key, value);
    }
    return this;
  }
  _set(key, value) {
    this[key] = value;
  }

  /**
   * Toggles specified property from `true` to `false` or from `false` to `true`
   * @param {String} property Property to toggle
   */
  toggle(property) {
    const value = this.get(property);
    if (typeof value === 'boolean') {
      this.set(property, !value);
    }
    return this;
  }

  /**
   * Basic getter
   * @param {String} property Property name
   * @return {*} value of a property
   */
  get(property) {
    return this[property];
  }
}

export { CommonMethods };
//# sourceMappingURL=CommonMethods.mjs.map
