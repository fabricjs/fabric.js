/**
 * Helper for creation of "classes".
 * @param {Function} [parent] optional "Class" to inherit from
 * @param {Object} [properties] Properties shared by all instances of this class
 *                  (be careful modifying objects defined here as this would affect all instances)
 */
export declare function createClass(...args: any[]): {
    (...klassArgs: any[]): void;
    superclass: any;
    prototype: any;
};
//# sourceMappingURL=lang_class.d.ts.map