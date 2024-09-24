/**
 * Capitalizes a string
 * @param {String} string String to capitalize
 * @param {Boolean} [firstLetterOnly] If true only first letter is capitalized
 * and other letters stay untouched, if false first letter is capitalized
 * and other letters are converted to lowercase.
 * @return {String} Capitalized version of a string
 */
const capitalize = function (string) {
  let firstLetterOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return "".concat(string.charAt(0).toUpperCase()).concat(firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase());
};

/**
 * Escapes XML in a string
 * @param {String} string String to escape
 * @return {String} Escaped version of a string
 */
const escapeXml = string => string.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Divide a string in the user perceived single units
 * @param {String} textstring String to escape
 * @return {Array} array containing the graphemes
 */
const graphemeSplit = textstring => {
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
const getWholeChar = (str, i) => {
  const code = str.charCodeAt(i);
  if (isNaN(code)) {
    return ''; // Position not found
  }
  if (code < 0xd800 || code > 0xdfff) {
    return str.charAt(i);
  }

  // High surrogate (could change last hex to 0xDB7F to treat high private
  // surrogates as single characters)
  if (0xd800 <= code && code <= 0xdbff) {
    if (str.length <= i + 1) {
      throw 'High surrogate without following low surrogate';
    }
    const next = str.charCodeAt(i + 1);
    if (0xdc00 > next || next > 0xdfff) {
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
  if (0xd800 > prev || prev > 0xdbff) {
    throw 'Low surrogate without preceding high surrogate';
  }
  // We can pass over low surrogates now as the second component
  // in a pair which we have already processed
  return false;
};

export { capitalize, escapeXml, graphemeSplit };
//# sourceMappingURL=lang_string.mjs.map
