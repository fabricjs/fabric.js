
/**
 * Returns the square root of the sum of squares of its arguments\
 * Chrome implements `Math#hypot` with a calculation that affects percision so we hard code it as a util
 * @see https://stackoverflow.com/questions/62931950/different-results-of-math-hypot-on-chrome-and-firefox
 * @static
 * @memberOf fabric.util
 * @param {...number}
 * @returns {number}
 */
export function hypot(...values: number[]) {
    let sumOfSquares = 0;
    for (let i = 0; i < values.length; i++) {
        sumOfSquares += values[i] * values[i];
    }
    return Math.sqrt(sumOfSquares);
}