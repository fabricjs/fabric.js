//@ts-nocheck
import { Observable } from "./observable.mixin";

export class CommonMethods extends Observable {

  /**
   * Sets object's properties from options
   * @deprecated use `set`
   * @param {Object} [options] Options object
   */
  _setOptions(options) {
    for (var prop in options) {
      this.set(prop, options[prop]);
    }
  }

  /**
   * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
   * @param {String|Object} key Property name or object (if object, iterate over the object properties)
   * @param {Object|Function} value Property value (if function, the value is passed into it and its return value is used as a new one)
   * @chainable
   */
  set<K extends keyof this, T extends this[K]>(key: string, value: T): void
  set<K extends keyof this, T extends this[K]>(object: { [key: K]: T }): void
  set(arg0, value?) {
    if (!arg0) {
      //  noop
    }
    else if (typeof arg0 === 'object') {
      for (var prop in arg0) {
        this._set(prop, arg0[prop]);
      }
    }
    else {
      this._set(arg0, value);
    }
    return this;
  }

  _set(key, value) {
    this[key] = value;
  }

  /**
   * Toggles specified property from `true` to `false` or from `false` to `true`
   * @param {String} property Property to toggle
   * @chainable
   */
  toggle(property) {
    var value = this.get(property);
    if (typeof value === 'boolean') {
      this.set(property, !value);
    }
    return this;
  }

  /**
   * Basic getter
   * @deprecated
   * @param {String} property Property name
   * @return {*} value of a property
   */
  get(property) {
    return this[property];
  }
}
