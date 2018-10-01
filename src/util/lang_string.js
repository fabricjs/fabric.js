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
    var graphemesChars = languageCharacters(textstring);
    return graphemesChars;
  }

  /**
   * Split all characters into single unit character based on the character's language 
   * param {String} textstring String to escape
   * @return {Array} array containing the graphemes with combined consonant characters.
   */
  function languageCharacters(textstring) {
    var charConfig = { iteration: 4, max_diff: 1.5, fontsize: '10px', fontfamily: 'Arial', letterSpacing: '15px' };
    var n = 0,max,next,withNext,char1,char2,char3,start,end,char,i,chars = [],text = textstring;
    var canva = fabric.document.getElementById('fabric_canva'),
        c = canva !== null ? canva : fabric.document.createElement('canvas');
    c.style.letterSpacing = charConfig.letterSpacing;
    c.style.display = 'none';
    if (!canva){
      c.id = 'fabric_canva';
      fabric.document.body.appendChild(c);
    }
    var ctx = c.getContext('2d');
    ctx.font = charConfig.fontsize + ' ' + charConfig.fontfamily;
    while (n < charConfig.iteration){
      chars = [];
      for ( i = 0,max = text.length ;i < max;i++){
        next = (typeof text[i + 1] === 'undefined') ? '' : text[ i + 1 ];
        withNext = (text[i] + next);
        char1 = (ctx.measureText(text[i]).width);
        char2 = (ctx.measureText(next).width);
        char3 = (ctx.measureText(withNext).width);
        start = i;
        i += ( Math.abs(char3 - (char1 + char2) ) >= charConfig.max_diff ) ? 1 : 0;
        end = i;
        char = start === end ? text[i] : withNext;
        chars.push(char);
      }
      text = chars;
      n++;
    }
    return chars;
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
