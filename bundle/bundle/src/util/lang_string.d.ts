/**
 * Capitalizes a string
 * @param {String} string String to capitalize
 * @param {Boolean} [firstLetterOnly] If true only first letter is capitalized
 * and other letters stay untouched, if false first letter is capitalized
 * and other letters are converted to lowercase.
 * @return {String} Capitalized version of a string
 */
export declare const capitalize: (string: string, firstLetterOnly?: boolean) => string;
/**
 * Escapes XML in a string
 * @param {String} string String to escape
 * @return {String} Escaped version of a string
 */
export declare const escapeXml: (string: string) => string;
/**
 * Divide a string in the user perceived single units
 * @param {String} textstring String to escape
 * @return {Array} array containing the graphemes
 */
export declare const graphemeSplit: (textstring: string) => string[];
//# sourceMappingURL=lang_string.d.ts.map