(function() {

  /**
   * Camelizes a string
   * @memberOf fabric.util.string
   * @param {String} string String to camelize
   * @return {String} Camelized version of a string
   */
  function camelize(string) {
    return string.replace(/-+(.)?/g, function(match, character) {
      return character ? character.toUpperCase() : '';
    });
  }

  /**
   * Capitalizes a string
   * @memberOf fabric.util.string
   * @param {String} string String to capitalize
   * @param {Boolean} [firstLetterOnly] If true only first letter is capitalized
   * and other letters stay untouched, if false first letter is capitalized
   * and other letters are converted to lowercase.
   * @return {String} Capitalized version of a string
   */
  function capitalize(string, firstLetterOnly) {
    return string.charAt(0).toUpperCase() +
      (firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase());
  }

  /**
   * Escapes XML in a string
   * @memberOf fabric.util.string
   * @param {String} string String to escape
   * @return {String} Escaped version of a string
   */
  function escapeXml(string) {
    return string.replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Divide a string in the user perceived single units
   * @memberOf fabric.util.string
   * @param {String} textstring String to escape
   * @return {Array} array containing the graphemes
   */
  function graphemeSplit(textstring) {
    var languageCharacters = languageCharacters(textstring);
    return languageCharacters;
  }

 /**
 * Split all characters into single unit character based on the character's language 
 * param {String} textstring String to escape
 * @return {Array} array containing the graphemes with combined consonant characters.
 */
  function languageCharacters(textstring) {
    var charConfig = {iteration : 4, max_diff : 1.5, fontsize : "10px", fontfamily : 'Arial', letterSpacing : "15px" };
    var n = 0,max,next,with_next,char1,char2,char3,start,end,char,i,chars = [],text = textstring;
    var canva = fabric.document.getElementById('fabric_canva'),
      c = canva != null ? canva : fabric.document.createElement("canvas");
    c.style.letterSpacing = charConfig.letterSpacing;
    c.style.display = 'none';
    if(!canva){
      c.id = "fabric_canva";
      fabric.document.body.appendChild(c);
    }
    var ctx = c.getContext("2d");
    ctx.font = charConfig.fontsize+" "+charConfig.fontfamily;
    while(n < charConfig.iteration){
      chars = [];
      for( i = 0,max = text.length ;i < max;i++){
        next = (typeof text[i+1] == 'undefined') ? "" : text[i+1];
        with_next = (text[i] + next);
        char1 = (ctx.measureText(text[i]).width);
        char2 = (ctx.measureText(next).width);
        char3 = (ctx.measureText(with_next).width);
        start = i;
        i += ( Math.abs(char3 - (char1+char2) ) >= charConfig.max_diff ) ? 1 : 0;
        end = i;
        char = start == end ? text[i] : with_next;
        if(char.length)
          chars.push(char);
      } 
      text = chars;
      n++;
    }
    return chars;
  }

  // taken from mdn in the charAt doc page.
  function getWholeChar(str, i) {
    var code = str.charCodeAt(i);

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
      var next = str.charCodeAt(i + 1);
      if (0xDC00 > next || next > 0xDFFF) {
        throw 'High surrogate without following low surrogate';
      }
      return str.charAt(i) + str.charAt(i + 1);
    }
    // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
    if (i === 0) {
      throw 'Low surrogate without preceding high surrogate';
    }
    var prev = str.charCodeAt(i - 1);

    // (could change last hex to 0xDB7F to treat high private
    // surrogates as single characters)
    if (0xD800 > prev || prev > 0xDBFF) {
      throw 'Low surrogate without preceding high surrogate';
    }
    // We can pass over low surrogates now as the second component
    // in a pair which we have already processed
    return false;
  }


  /**
   * String utilities
   * @namespace fabric.util.string
   */
  fabric.util.string = {
    camelize: camelize,
    capitalize: capitalize,
    escapeXml: escapeXml,
    graphemeSplit: graphemeSplit
  };
})();
