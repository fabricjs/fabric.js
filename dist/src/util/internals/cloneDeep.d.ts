/**
 * @deprecated Using a generic JSON parse/stringify on random object may bring to slow perf issues,
 * if needed to clone complicated data structures use a dedicated clone logic
 * @param object
 * @returns
 */
export declare const cloneDeep: <T extends object>(object: T) => T;
//# sourceMappingURL=cloneDeep.d.ts.map