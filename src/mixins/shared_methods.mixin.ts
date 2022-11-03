import { Observable } from './observable.mixin';

export class CommonMethods extends Observable {
  /**
   * Sets property to a given value and runs side effects.
   * When changing position/dimension related properties (left, top, scale, angle, etc.)
   * `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
   * @param {String|Object} key Property name or object (if object, iterate over the object properties)
   * @param {*} [value] Property value
   */
  set<K extends keyof this, V extends this[K]>(key: K, value: V): this;
  set<K extends keyof this, V extends this[K]>(value: Record<K, V>): this;
  set<K extends keyof this, V extends this[K]>(
    arg0: K | Record<K, V>,
    value?: V
  ) {
    if (typeof arg0 === 'object') {
      for (const prop in arg0) {
        this._set(prop, arg0[prop] as any);
      }
    } else {
      this._set(arg0, value!);
    }
    return this;
  }

  protected _set<K extends keyof this, V extends this[K]>(key: K, value: V) {
    this[key] = value;
  }

  /**
   * Toggles specified property from `true` to `false` or from `false` to `true`
   * @param {String} property Property to toggle
   */
  toggle<T extends keyof this>(property: T) {
    const value = this.get(property);
    if (typeof value === 'boolean') {
      this.set(property, !value as this[T]);
    }
    return this;
  }

  /**
   * Basic getter
   * @param {String} property Property name
   * @return {*} value of a property
   */
  get<T extends keyof this>(property: T) {
    return this[property];
  }
}
