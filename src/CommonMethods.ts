// @ts-nocheck
import { Observable } from './Observable';
import type {
  ChangeContext,
  ProxyTarget,
  TransformValueContext,
} from './util/internals';
import { createProxy } from './util/internals';

// @ts-expect-error ProxyTarget methods should be protected
export class CommonMethods<EventSpec>
  extends Observable<EventSpec>
  implements ProxyTarget
{
  static getDefaultValues() {
    return {};
  }

  constructor(options?: any) {
    super();
    return createProxy(Object.assign(this, options));
  }

  /**
   * A hook that runs from the `get` and `set` traps of {@link Proxy},
   * allowing to return a different value that will be used instead.
   *
   * This method is bound to the {@link Proxy} `target`, which means that accessing `this.` will not be trapped by the proxy.
   * The {@link receiver} (`= proxy`) can be used for that (**caution** is advised in order to avoid triggering an infinite loop).
   *
   * @param context
   * @param receiver {@link Reflect} receiver (the proxy)
   */
  protected transformValue<K extends keyof this>(
    context: TransformValueContext<K, this[K]>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    receiver: this
  ) {
    return context.operation === 'set' ? context.newValue : context.value;
  }

  /**
   * A hook that runs **after** a change has been made to instance from the `set` and `deleteProperty` traps of {@link Proxy}.
   * It is a good place to run side effects.
   * Allows to revert the operation by returning `false`.
   *
   * This method is bound to the {@link Proxy} `target`, which means that accessing `this.` will not be trapped by the proxy.
   * The {@link receiver} (`= proxy`) can be used for that (**caution** is advised in order to avoid triggering an infinite loop).
   *
   * @todo
   * **Migration Path**
   *
   * - Do **NOT** call from {@link _set} and all of {@link CommonMethods} methods
   * - Migrate logic from {@link _set} to here making sure all logic related to a key has been fully migrated
   * - Use {@link transformValue} when needed
   *
   * @param context
   * @param receiver {@link Reflect} receiver (the proxy)
   * @returns true if the change should be accepted and `false` to revert the `set` operation
   */
  protected onChange<K extends keyof this>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ChangeContext<K, this[K]>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    receiver: this
  ): boolean {
    return true;
  }

  /**
   * Sets object's properties from options, for initialization only
   * @deprecated
   * @param {Object} [options] Options object
   */
  protected _setOptions(options: any = {}) {
    for (const prop in options) {
      this.set(prop, options[prop]);
    }
  }

  /**
   * @deprecated
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
   * @deprecated
   */
  set(key: string | Record<string, any>, value?: any) {
    if (typeof key === 'object') {
      this._setObject(key);
    } else {
      this._set(key, value);
    }
    return this;
  }

  /**
   * @deprecated
   */
  _set(key: string, value: any) {
    this[key] = value;
  }

  /**
   * Toggles specified property from `true` to `false` or from `false` to `true`
   * @param {String} property Property to toggle
   * @deprecated
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
   * @deprecated
   */
  get(property: string) {
    return this[property];
  }
}
