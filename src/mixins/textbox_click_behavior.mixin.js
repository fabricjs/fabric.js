(function() {
  var getNewSelectionStartFromOffsetOverriden = fabric.IText.prototype._getNewSelectionStartFromOffset;
  /**
   * Overrides the IText implementation and always sends lineIndex as 0 for Textboxes.
   * @param {Number} mouseOffset
   * @param {Number} prevWidth
   * @param {Number} width
   * @param {Number} index
   * @param {Number} lineIndex
   * @param {Number} jlen
   * @returns {Number}
   */
  fabric.IText.prototype._getNewSelectionStartFromOffset = function(mouseOffset,
  prevWidth, width, index, lineIndex, jlen) {
    if (this instanceof fabric.Textbox) {
      lineIndex = 0;
    }
    return getNewSelectionStartFromOffsetOverriden
            .call(this, mouseOffset,
            prevWidth, width, index, lineIndex, jlen);
  };
})();
