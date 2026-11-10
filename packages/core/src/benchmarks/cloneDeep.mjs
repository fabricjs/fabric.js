/**
 * @deprecated Using a generic JSON parse/stringify on random object may bring to slow perf issues,
 * if needed to clone complicated data structures use a dedicated clone logic
 * @param object
 * @returns
 */
export const cloneDeep = (object) => JSON.parse(JSON.stringify(object));
