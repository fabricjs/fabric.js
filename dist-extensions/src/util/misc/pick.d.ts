/**
 * Populates an object with properties of another object
 * @param {Object} source Source object
 * @param {string[]} properties Properties names to include
 * @returns object populated with the picked keys
 */
export declare const pick: <T extends Record<string, any>>(source: T, keys?: (keyof T)[]) => Partial<T>;
export declare const pickBy: <T extends Record<string, any>>(source: T, predicate: <K extends keyof T>(value: T[K], key: K, collection: T) => boolean) => Partial<T>;
//# sourceMappingURL=pick.d.ts.map