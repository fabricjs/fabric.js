fabric.util.object.extend(fabric.Textbox.prototype, /** @lends fabric.Textbox.prototype */ {
  /**
   * Overrides superclass function and adjusts cursor offset value because
   * lines do not necessarily end with a newline in Textbox.
   *
   * @param {Event} e
   * @param {Boolean} isRight
   * @returns {Number}
   */
  getDownCursorOffset: function (e, isRight) {
    var current = this.selectionStart,
      offset = fabric.IText.prototype.getDownCursorOffset.apply(this, [e, isRight]),
      nextNewline = this.text.indexOf('\n', current);

    return nextNewline >= current && nextNewline <= current + offset ? offset : offset - 1;
  },
  /**
   * Overrides superclass function and adjusts cursor offset value because
   * lines do not necessarily end with a newline in Textbox.
   *
   * @param {Event} e
   * @param {Boolean} isRight
   * @returns {Number}
   */
  getUpCursorOffset: function (e, isRight) {
    var current = this.selectionStart,
      offset = fabric.IText.prototype.getUpCursorOffset.apply(this, [e, isRight]),
      previousNewLine = this.text.indexOf('\n', current - offset);

    return previousNewLine >= current - offset && previousNewLine <= current ? offset : offset - 1;
  }
});
