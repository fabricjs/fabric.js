(function() {

  /**
   * Override _setObjectScale and add Textbox specific resizing behavior. Resizing
   * a Textbox doesn't scale text, it only changes width and makes text wrap automatically.
   */
  var setObjectScaleOverridden = fabric.Canvas.prototype._setObjectScale;

  fabric.Canvas.prototype._setObjectScale = function(localMouse, transform,
                                                     lockScalingX, lockScalingY, by, lockScalingFlip, _dim) {

    var t = transform.target;
    if (t instanceof fabric.Textbox) {
      var w = t.width * ((localMouse.x / transform.scaleX) / (t.width + t.strokeWidth));
      if (w >= t.getMinWidth()) {
        t.set('width', w);
        return true;
      }
    }
    else {
      return setObjectScaleOverridden.call(fabric.Canvas.prototype, localMouse, transform,
        lockScalingX, lockScalingY, by, lockScalingFlip, _dim);
    }
  };

  /**
   * Sets controls of this group to the Textbox's special configuration if
   * one is present in the group. Deletes _controlsVisibility otherwise, so that
   * it gets initialized to default value at runtime.
   */
  fabric.Group.prototype._refreshControlsVisibility = function() {
    if (typeof fabric.Textbox === 'undefined') {
      return;
    }
    for (var i = this._objects.length; i--;) {
      if (this._objects[i] instanceof fabric.Textbox) {
        this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());
        return;
      }
    }
  };

  fabric.util.object.extend(fabric.Textbox.prototype, /** @lends fabric.IText.prototype */ {
    /**
     * @private
     */
    _removeExtraneousStyles: function() {
      for (var prop in this._styleMap) {
        if (!this._textLines[prop]) {
          delete this.styles[this._styleMap[prop].line];
        }
      }
    },

    /**
     * Inserts style object for a given line/char index
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     * @param {Number} quantity number Style object to insert, if given
     */
    insertCharStyleObject: function(lineIndex, charIndex, quantity) {
      // adjust lineIndex and charIndex
      var map = this._styleMap[lineIndex];
      lineIndex = map.line;
      charIndex = map.offset + charIndex;

      fabric.IText.prototype.insertCharStyleObject.call(this, lineIndex, charIndex, quantity);
    },

    /**
     * Inserts new style object
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     * @param {Number} qty how many lines are we adding
     */
    insertNewlineStyleObject: function(lineIndex, charIndex, qty) {
      // adjust lineIndex and charIndex
      var map = this._styleMap[lineIndex];
      lineIndex = map.line;
      charIndex = map.offset + charIndex;

      fabric.IText.prototype.insertNewlineStyleObject.call(this, lineIndex, charIndex, qty);
    },

    /**
     * Shifts line styles up or down. This function is slightly different than the one in
     * itext_behaviour as it takes into account the styleMap.
     *
     * @param {Number} lineIndex Index of a line
     * @param {Number} offset Can be -1 or +1
     */
    shiftLineStyles: function(lineIndex, offset) {
      // shift all line styles by 1 upward
      var map = this._styleMap[lineIndex];
      // adjust line index
      lineIndex = map.line;
      fabric.IText.prototype.shiftLineStyles.call(this, lineIndex, offset);
    },
  });
})();
