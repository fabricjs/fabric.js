
/**
 * 
 * @param value value to check if NaN
 * @param [valueIfNaN]
 * @returns `fallback` is `value is NaN
 */
export const ifNaN = (value: number, valueIfNaN?: number) => {
    return isNaN(value) ? valueIfNaN || NaN : value;
}