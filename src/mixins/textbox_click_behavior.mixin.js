(function() {
  var override = fabric.IText.prototype._getNewSelectionStartFromOffset;
  /**
   * Overrides the IText implementation and adjusts character index as there is not always a linebreak
   *
   * @param {Number} mouseOffset
   * @param {Number} prevWidth
   * @param {Number} width
   * @param {Number} index
   * @param {Number} jlen
   * @returns {Number}
   */
  fabric.IText.prototype._getNewSelectionStartFromOffset = function(mouseOffset, prevWidth, width, index, jlen) {
    index = override.call(this, mouseOffset, prevWidth, width, index, jlen);

    // the index passed into the function is padded by the amount of lines from _textLines (to account for \n)
    // we need to remove this padding, and pad it by actual lines, and / or spaces that are meant to be there
    var tmp     = 0,
        removed = 0;

    // account for removed characters
    for (var i = 0; i < this._textLines.length; i++) {
      tmp += this._textLines[i].length;

      if (tmp + removed >= index) {
        break;
      }

      if (this.text[tmp + removed] === '\n' || this.text[tmp + removed] === ' ') {
        removed++;
      }
    }

    return index - i + removed;
  };
})();
