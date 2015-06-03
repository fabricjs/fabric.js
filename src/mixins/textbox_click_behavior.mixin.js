(function () {
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
  fabric.IText.prototype._getNewSelectionStartFromOffset = function (mouseOffset, prevWidth, width, index, jlen) {
    // start by getting the iText cursor location, and then figure out how many actual new lines there are
    var cursor = this.get2DCursorLocation(index),
      newLines = this.text.substring(0, index).split(this._reNewline).length - 1;

    // adjust index by actual new lines
    index -= cursor.lineIndex - newLines;

    return override.call(this, mouseOffset, prevWidth, width, index, jlen);
  };
})();
