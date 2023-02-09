import { Observable } from './Observable';
import { createHybrid } from './util/internals';

export class CommonMethods<EventSpec> extends Observable<EventSpec> {
  static getDefaultValues() {
    return {};
  }

  constructor(options?: any) {
    super();
    return createHybrid(
      Object.assign(this, options),
      (this.constructor as typeof CommonMethods).getDefaultValues()
    );
  }

  /**
   * A side effect that runs during {@link Object#set}
   *
   * ---
   *
   * **IMPORTANT**
   *
   * Setting the value of `key` in this block will result in an infinite loop.\
   * To do so use {@link Reflect} or {@link Object}
   *
   * ---
   *
   * @todo
   * **Migration Path**
   *
   * - Do **NOT** call from {@link _set} and all of {@link CommonMethods} methods
   * - Migrate logic from {@link _set} to here making sure all logic related to a key has been fully migrated
   *
   * @param key
   * @param value
   * @param prevValue
   * @returns true if the change should be accepted and `false` to revert the set operation
   */
  protected onChange<K extends keyof this>(
    key: K,
    value: T[K],
    prevValue: T[K]
  ): boolean {
    return true;
  }

  /**
   * Sets object's properties from options, for initialization only
   * @protected
   * @param {Object} [options] Options object
   */
  protected _setOptions(options: any = {}) {
    for (const prop in options) {
      this.set(prop, options[prop]);
    }
  }

  /**
   * @private
   */
  _setObject(obj: Record<string, any>) {
    for (const prop in obj) {
      this._set(prop, obj[prop]);
    }
  }

  /**
   * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
   * @param {String|Object} key Property name or object (if object, iterate over the object properties)
   * @param {Object|Function} value Property value (if function, the value is passed into it and its return value is used as a new one)
   */
  set(key: string | Record<string, any>, value?: any) {
    if (typeof key === 'object') {
      this._setObject(key);
    } else {
      this._set(key, value);
    }
    return this;
  }

  _set(key: string, value: any) {
    this[key] = value;
  }

  /**
   * Toggles specified property from `true` to `false` or from `false` to `true`
   * @param {String} property Property to toggle
   */
  toggle(property: string) {
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
  get(property: string) {
    return this[property];
  }
}
