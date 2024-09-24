import { Observable } from './Observable';
export declare class CommonMethods<EventSpec> extends Observable<EventSpec> {
    /**
     * Sets object's properties from options, for initialization only
     * @protected
     * @param {Object} [options] Options object
     */
    protected _setOptions(options?: any): void;
    /**
     * @private
     */
    _setObject(obj: Record<string, any>): void;
    /**
     * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
     * @param {String|Object} key Property name or object (if object, iterate over the object properties)
     * @param {Object|Function} value Property value (if function, the value is passed into it and its return value is used as a new one)
     */
    set(key: string | Record<string, any>, value?: any): this;
    _set(key: string, value: any): void;
    /**
     * Toggles specified property from `true` to `false` or from `false` to `true`
     * @param {String} property Property to toggle
     */
    toggle(property: string): this;
    /**
     * Basic getter
     * @param {String} property Property name
     * @return {*} value of a property
     */
    get(property: string): any;
}
//# sourceMappingURL=CommonMethods.d.ts.map