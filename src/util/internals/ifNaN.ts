
/**
 * 
 * @param value value to check if NaN
 * @param [fallback]
 * @returns `fallback` is `value is NaN
 */
export const ifNaN = (value: number, fallback?: number) => {
    return isNaN(value) ? fallback || NaN : value;
}