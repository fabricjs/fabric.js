//@ts-nocheck
import { fabric } from '../../HEADER';

/**
   * Camelizes a string
   * @memberOf fabric.util.string
   * @param {String} string String to camelize
   * @return {String} Camelized version of a string
   */
export const camelize = (string: string): string => string.replace(/-+(.)?/g, function(match, character) {
  return character ? character.toUpperCase() : '';
});

/**
 * Capitalizes a string
 * @memberOf fabric.util.string
 * @param {String} string String to capitalize
 * @param {Boolean} [firstLetterOnly] If true only first letter is capitalized
 * and other letters stay untouched, if false first letter is capitalized
 * and other letters are converted to lowercase.
 * @return {String} Capitalized version of a string
 */
export const capitalize = (string: string, firstLetterOnly = false): string =>
  `${string.charAt(0).toUpperCase()}${(
    firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase()
  )}`;

/**
 * Escapes XML in a string
 * @memberOf fabric.util.string
 * @param {String} string String to escape
 * @return {String} Escaped version of a string
 */
export const escapeXml = (string: string): string => string
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/**
 * Divide a string in the user perceived single units
 * @memberOf fabric.util.string
 * @param {String} textstring String to escape
 * @return {Array} array containing the graphemes
 */
export const graphemeSplit = (textstring: string): string[] => {
  const graphemes = [];
  for (let i = 0, chr; i < textstring.length; i++) {
    if ((chr = getWholeChar(textstring, i)) === false) {
      continue;
    }
    graphemes.push(chr);
  }
  return graphemes;
};

// taken from mdn in the charAt doc page.
const getWholeChar = (str: string, i: number): string => {
  const code = str.charCodeAt(i);
  if (isNaN(code)) {
    return ''; // Position not found
  }
  if (code < 0xD800 || code > 0xDFFF) {
    return str.charAt(i);
  }

  // High surrogate (could change last hex to 0xDB7F to treat high private
  // surrogates as single characters)
  if (0xD800 <= code && code <= 0xDBFF) {
    if (str.length <= (i + 1)) {
      throw 'High surrogate without following low surrogate';
    }
    const next = str.charCodeAt(i + 1);
    if (0xDC00 > next || next > 0xDFFF) {
      throw 'High surrogate without following low surrogate';
    }
    return str.charAt(i) + str.charAt(i + 1);
  }
  // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
  if (i === 0) {
    throw 'Low surrogate without preceding high surrogate';
  }
  const prev = str.charCodeAt(i - 1);

  // (could change last hex to 0xDB7F to treat high private
  // surrogates as single characters)
  if (0xD800 > prev || prev > 0xDBFF) {
    throw 'Low surrogate without preceding high surrogate';
  }
  // We can pass over low surrogates now as the second component
  // in a pair which we have already processed
  return false;
}
