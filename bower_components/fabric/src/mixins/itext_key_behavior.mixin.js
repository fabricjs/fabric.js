fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {

  /**
   * Initializes key handlers
   */
  initKeyHandlers: function() {
    fabric.util.addListener(fabric.document, 'keydown', this.onKeyDown.bind(this));
    fabric.util.addListener(fabric.document, 'keypress', this.onKeyPress.bind(this));
    fabric.util.addListener(fabric.document, 'click', this.onClick.bind(this));
  },

  /**
   * Initializes hidden textarea (needed to bring up keyboard in iOS)
   */
  initHiddenTextarea: function() {
    this.hiddenTextarea = fabric.document.createElement('textarea');

    this.hiddenTextarea.setAttribute('autocapitalize', 'off');
    this.hiddenTextarea.style.cssText = 'position: absolute; top: 0; left: -9999px';

    fabric.document.body.appendChild(this.hiddenTextarea);
  },

  /**
   * @private
   */
  _keysMap: {
    8:  'removeChars',
    13: 'insertNewline',
    37: 'moveCursorLeft',
    38: 'moveCursorUp',
    39: 'moveCursorRight',
    40: 'moveCursorDown',
    46: 'forwardDelete'
  },

  /**
   * @private
   */
  _ctrlKeysMap: {
    65: 'selectAll',
    67: 'copy',
    86: 'paste',
    88: 'cut'
  },

  onClick: function() {
    // No need to trigger click event here, focus is enough to have the keyboard appear on Android
    this.hiddenTextarea && this.hiddenTextarea.focus();
  },

  /**
   * Handles keyup event
   * @param {Event} e Event object
   */
  onKeyDown: function(e) {
    if (!this.isEditing) return;

    if (e.keyCode in this._keysMap) {
      this[this._keysMap[e.keyCode]](e);
    }
    else if ((e.keyCode in this._ctrlKeysMap) && (e.ctrlKey || e.metaKey)) {
      this[this._ctrlKeysMap[e.keyCode]](e);
    }
    else {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.canvas && this.canvas.renderAll();
  },

  /**
   * Forward delete
   */
  forwardDelete: function(e) {
    if (this.selectionStart === this.selectionEnd) {
      this.moveCursorRight(e);
    }
    this.removeChars(e);
  },

  /**
   * Copies selected text
   */
  copy: function() {
    var selectedText = this.getSelectedText();
    this.copiedText = selectedText;
    this.copiedStyles = this.getSelectionStyles(
                          this.selectionStart,
                          this.selectionEnd);
  },

  /**
   * Pastes text
   */
  paste: function() {
    if (this.copiedText) {
      this.insertChars(this.copiedText);
    }
  },

  /**
   * Cuts text
   */
  cut: function(e) {
    this.copy();
    this.removeChars(e);
  },

  /**
   * Handles keypress event
   * @param {Event} e Event object
   */
  onKeyPress: function(e) {
    if (!this.isEditing || e.metaKey || e.ctrlKey || e.keyCode === 8 || e.keyCode === 13) {
      return;
    }

    this.insertChars(String.fromCharCode(e.which));

    e.preventDefault();
    e.stopPropagation();
  },

  /**
   * Gets start offset of a selection
   * @return {Number}
   */
  getDownCursorOffset: function(e, isRight) {

    var selectionProp = isRight ? this.selectionEnd : this.selectionStart,
        textLines = this.text.split(this._reNewline),
        _char,
        lineLeftOffset,

        textBeforeCursor = this.text.slice(0, selectionProp),
        textAfterCursor = this.text.slice(selectionProp),

        textOnSameLineBeforeCursor = textBeforeCursor.slice(textBeforeCursor.lastIndexOf('\n') + 1),
        textOnSameLineAfterCursor = textAfterCursor.match(/(.*)\n?/)[1],
        textOnNextLine = (textAfterCursor.match(/.*\n(.*)\n?/) || { })[1] || '',

        cursorLocation = this.get2DCursorLocation(selectionProp);

    // if on last line, down cursor goes to end of line
    if (cursorLocation.lineIndex === textLines.length - 1 || e.metaKey) {

      // move to the end of a text
      return this.text.length - selectionProp;
    }

    var widthOfSameLineBeforeCursor = this._getWidthOfLine(this.ctx, cursorLocation.lineIndex, textLines);
    lineLeftOffset = this._getLineLeftOffset(widthOfSameLineBeforeCursor);

    var widthOfCharsOnSameLineBeforeCursor = lineLeftOffset;
    var lineIndex = cursorLocation.lineIndex;

    for (var i = 0, len = textOnSameLineBeforeCursor.length; i < len; i++) {
      _char = textOnSameLineBeforeCursor[i];
      widthOfCharsOnSameLineBeforeCursor += this._getWidthOfChar(this.ctx, _char, lineIndex, i);
    }

    var indexOnNextLine = this._getIndexOnNextLine(
      cursorLocation, textOnNextLine, widthOfCharsOnSameLineBeforeCursor, textLines);

    return textOnSameLineAfterCursor.length + 1 + indexOnNextLine;
  },

  /**
   * @private
   */
  _getIndexOnNextLine: function(cursorLocation, textOnNextLine, widthOfCharsOnSameLineBeforeCursor, textLines) {

    var lineIndex = cursorLocation.lineIndex + 1;
    var widthOfNextLine = this._getWidthOfLine(this.ctx, lineIndex, textLines);
    var lineLeftOffset = this._getLineLeftOffset(widthOfNextLine);
    var widthOfCharsOnNextLine = lineLeftOffset;
    var indexOnNextLine = 0;
    var foundMatch;

    for (var j = 0, jlen = textOnNextLine.length; j < jlen; j++) {

      var _char = textOnNextLine[j];
      var widthOfChar = this._getWidthOfChar(this.ctx, _char, lineIndex, j);

      widthOfCharsOnNextLine += widthOfChar;

      if (widthOfCharsOnNextLine > widthOfCharsOnSameLineBeforeCursor) {

        foundMatch = true;

        var leftEdge = widthOfCharsOnNextLine - widthOfChar;
        var rightEdge = widthOfCharsOnNextLine;
        var offsetFromLeftEdge = Math.abs(leftEdge - widthOfCharsOnSameLineBeforeCursor);
        var offsetFromRightEdge = Math.abs(rightEdge - widthOfCharsOnSameLineBeforeCursor);

        indexOnNextLine = offsetFromRightEdge < offsetFromLeftEdge ? j + 1 : j;

        break;
      }
    }

    // reached end
    if (!foundMatch) {
      indexOnNextLine = textOnNextLine.length;
    }

    return indexOnNextLine;
  },

  /**
   * Moves cursor down
   * @param {Event} e Event object
   */
  moveCursorDown: function(e) {

    this.abortCursorAnimation();
    this._currentCursorOpacity = 1;

    var offset = this.getDownCursorOffset(e, this._selectionDirection === 'right');

    if (e.shiftKey) {
      this.moveCursorDownWithShift(offset);
    }
    else {
      this.moveCursorDownWithoutShift(offset);
    }

    this.initDelayedCursor();
  },

  /**
   * Moves cursor down without keeping selection
   * @param {Number} offset
   */
  moveCursorDownWithoutShift: function(offset) {

    this._selectionDirection = 'right';
    this.selectionStart += offset;

    if (this.selectionStart > this.text.length) {
      this.selectionStart = this.text.length;
    }
    this.selectionEnd = this.selectionStart;
  },

  /**
   * Moves cursor down while keeping selection
   * @param {Number} offset
   */
  moveCursorDownWithShift: function(offset) {

    if (this._selectionDirection === 'left' && (this.selectionStart !== this.selectionEnd)) {
      this.selectionStart += offset;
      this._selectionDirection = 'left';
      return;
    }
    else {
      this._selectionDirection = 'right';
      this.selectionEnd += offset;

      if (this.selectionEnd > this.text.length) {
        this.selectionEnd = this.text.length;
      }
    }
  },

  getUpCursorOffset: function(e, isRight) {

    var selectionProp = isRight ? this.selectionEnd : this.selectionStart,
        cursorLocation = this.get2DCursorLocation(selectionProp);

    // if on first line, up cursor goes to start of line
    if (cursorLocation.lineIndex === 0 || e.metaKey) {
      return selectionProp;
    }

    var textBeforeCursor = this.text.slice(0, selectionProp),
        textOnSameLineBeforeCursor = textBeforeCursor.slice(textBeforeCursor.lastIndexOf('\n') + 1),
        textOnPreviousLine = (textBeforeCursor.match(/\n?(.*)\n.*$/) || {})[1] || '',
        textLines = this.text.split(this._reNewline),
        _char,
        lineLeftOffset;

    var widthOfSameLineBeforeCursor = this._getWidthOfLine(this.ctx, cursorLocation.lineIndex, textLines);
    lineLeftOffset = this._getLineLeftOffset(widthOfSameLineBeforeCursor);

    var widthOfCharsOnSameLineBeforeCursor = lineLeftOffset;
    var lineIndex = cursorLocation.lineIndex;

    for (var i = 0, len = textOnSameLineBeforeCursor.length; i < len; i++) {
      _char = textOnSameLineBeforeCursor[i];
      widthOfCharsOnSameLineBeforeCursor += this._getWidthOfChar(this.ctx, _char, lineIndex, i);
    }

    var indexOnPrevLine = this._getIndexOnPrevLine(
      cursorLocation, textOnPreviousLine, widthOfCharsOnSameLineBeforeCursor, textLines);

    return textOnPreviousLine.length - indexOnPrevLine + textOnSameLineBeforeCursor.length;
  },

  /**
   * @private
   */
  _getIndexOnPrevLine: function(cursorLocation, textOnPreviousLine, widthOfCharsOnSameLineBeforeCursor, textLines) {

    var lineIndex = cursorLocation.lineIndex - 1;
    var widthOfPreviousLine = this._getWidthOfLine(this.ctx, lineIndex, textLines);
    var lineLeftOffset = this._getLineLeftOffset(widthOfPreviousLine);
    var widthOfCharsOnPreviousLine = lineLeftOffset;
    var indexOnPrevLine = 0;
    var foundMatch;

    for (var j = 0, jlen = textOnPreviousLine.length; j < jlen; j++) {

      var _char = textOnPreviousLine[j];
      var widthOfChar = this._getWidthOfChar(this.ctx, _char, lineIndex, j);

      widthOfCharsOnPreviousLine += widthOfChar;

      if (widthOfCharsOnPreviousLine > widthOfCharsOnSameLineBeforeCursor) {

        foundMatch = true;

        var leftEdge = widthOfCharsOnPreviousLine - widthOfChar;
        var rightEdge = widthOfCharsOnPreviousLine;
        var offsetFromLeftEdge = Math.abs(leftEdge - widthOfCharsOnSameLineBeforeCursor);
        var offsetFromRightEdge = Math.abs(rightEdge - widthOfCharsOnSameLineBeforeCursor);

        indexOnPrevLine = offsetFromRightEdge < offsetFromLeftEdge ? j : (j - 1);

        break;
      }
    }

    // reached end
    if (!foundMatch) {
      indexOnPrevLine = textOnPreviousLine.length - 1;
    }

    return indexOnPrevLine;
  },

  /**
   * Moves cursor up
   * @param {Event} e Event object
   */
  moveCursorUp: function(e) {

    this.abortCursorAnimation();
    this._currentCursorOpacity = 1;

    var offset = this.getUpCursorOffset(e, this._selectionDirection === 'right');

    if (e.shiftKey) {
      this.moveCursorUpWithShift(offset);
    }
    else {
      this.moveCursorUpWithoutShift(offset);
    }

    this.initDelayedCursor();
  },

  /**
   * Moves cursor up with shift
   * @param {Number} offset
   */
  moveCursorUpWithShift: function(offset) {

    if (this.selectionStart === this.selectionEnd) {
      this.selectionStart -= offset;
    }
    else {
      if (this._selectionDirection === 'right') {
        this.selectionEnd -= offset;
        this._selectionDirection = 'right';
        return;
      }
      else {
        this.selectionStart -= offset;
      }
    }

    if (this.selectionStart < 0) {
      this.selectionStart = 0;
    }

    this._selectionDirection = 'left';
  },

  /**
   * Moves cursor up without shift
   * @param {Number} offset
   */
  moveCursorUpWithoutShift: function(offset) {
    if (this.selectionStart === this.selectionEnd) {
      this.selectionStart -= offset;
    }
    if (this.selectionStart < 0) {
      this.selectionStart = 0;
    }
    this.selectionEnd = this.selectionStart;

    this._selectionDirection = 'left';
  },

  /**
   * Moves cursor left
   * @param {Event} e Event object
   */
  moveCursorLeft: function(e) {
    if (this.selectionStart === 0 && this.selectionEnd === 0) return;

    this.abortCursorAnimation();
    this._currentCursorOpacity = 1;

    if (e.shiftKey) {
      this.moveCursorLeftWithShift(e);
    }
    else {
      this.moveCursorLeftWithoutShift(e);
    }

    this.initDelayedCursor();
  },

  /**
   * @private
   */
  _move: function(e, prop, direction) {
    if (e.altKey) {
      this[prop] = this['findWordBoundary' + direction](this[prop]);
    }
    else if (e.metaKey) {
      this[prop] = this['findLineBoundary' + direction](this[prop]);
    }
    else {
      this[prop] += (direction === 'Left' ? -1 : 1);
    }
  },

  /**
   * @private
   */
  _moveLeft: function(e, prop) {
    this._move(e, prop, 'Left');
  },

  /**
   * @private
   */
  _moveRight: function(e, prop) {
    this._move(e, prop, 'Right');
  },

  /**
   * Moves cursor left without keeping selection
   * @param {Event} e
   */
  moveCursorLeftWithoutShift: function(e) {
    this._selectionDirection = 'left';

    // only move cursor when there is no selection,
    // otherwise we discard it, and leave cursor on same place
    if (this.selectionEnd === this.selectionStart) {
      this._moveLeft(e, 'selectionStart');
    }
    this.selectionEnd = this.selectionStart;
  },

  /**
   * Moves cursor left while keeping selection
   * @param {Event} e
   */
  moveCursorLeftWithShift: function(e) {
    if (this._selectionDirection === 'right' && this.selectionStart !== this.selectionEnd) {
      this._moveLeft(e, 'selectionEnd');
    }
    else {
      this._selectionDirection = 'left';
      this._moveLeft(e, 'selectionStart');

      // increase selection by one if it's a newline
      if (this.text.charAt(this.selectionStart) === '\n') {
        this.selectionStart--;
      }
      if (this.selectionStart < 0) {
        this.selectionStart = 0;
      }
    }
  },

  /**
   * Moves cursor right
   * @param {Event} e Event object
   */
  moveCursorRight: function(e) {
    if (this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length) return;

    this.abortCursorAnimation();
    this._currentCursorOpacity = 1;

    if (e.shiftKey) {
      this.moveCursorRightWithShift(e);
    }
    else {
      this.moveCursorRightWithoutShift(e);
    }

    this.initDelayedCursor();
  },

  /**
   * Moves cursor right while keeping selection
   * @param {Event} e
   */
  moveCursorRightWithShift: function(e) {
    if (this._selectionDirection === 'left' && this.selectionStart !== this.selectionEnd) {
      this._moveRight(e, 'selectionStart');
    }
    else {
      this._selectionDirection = 'right';
      this._moveRight(e, 'selectionEnd');

      // increase selection by one if it's a newline
      if (this.text.charAt(this.selectionEnd - 1) === '\n') {
        this.selectionEnd++;
      }
      if (this.selectionEnd > this.text.length) {
        this.selectionEnd = this.text.length;
      }
    }
  },

  /**
   * Moves cursor right without keeping selection
   * @param {Event} e
   */
  moveCursorRightWithoutShift: function(e) {
    this._selectionDirection = 'right';

    if (this.selectionStart === this.selectionEnd) {
      this._moveRight(e, 'selectionStart');
      this.selectionEnd = this.selectionStart;
    }
    else {
      this.selectionEnd += this.getNumNewLinesInSelectedText();
      if (this.selectionEnd > this.text.length) {
        this.selectionEnd = this.text.length;
      }
      this.selectionStart = this.selectionEnd;
    }
  },

  /**
   * Inserts a character where cursor is (replacing selection if one exists)
   */
  removeChars: function(e) {
    if (this.selectionStart === this.selectionEnd) {
      this._removeCharsNearCursor(e);
    }
    else {
      this._removeCharsFromTo(this.selectionStart, this.selectionEnd);
    }

    this.selectionEnd = this.selectionStart;

    this._removeExtraneousStyles();

    if (this.canvas) {
      // TODO: double renderAll gets rid of text box shift happenning sometimes
      // need to find out what exactly causes it and fix it
      this.canvas.renderAll().renderAll();
    }

    this.setCoords();
    this.fire('changed');
    this.canvas && this.canvas.fire('text:changed', { target: this });
  },

  /**
   * @private
   */
  _removeCharsNearCursor: function(e) {
    if (this.selectionStart !== 0) {

      if (e.metaKey) {
        // remove all till the start of current line
        var leftLineBoundary = this.findLineBoundaryLeft(this.selectionStart);

        this._removeCharsFromTo(leftLineBoundary, this.selectionStart);
        this.selectionStart = leftLineBoundary;
      }
      else if (e.altKey) {
        // remove all till the start of current word
        var leftWordBoundary = this.findWordBoundaryLeft(this.selectionStart);

        this._removeCharsFromTo(leftWordBoundary, this.selectionStart);
        this.selectionStart = leftWordBoundary;
      }
      else {
        var isBeginningOfLine = this.text.slice(this.selectionStart-1, this.selectionStart) === '\n';
        this.removeStyleObject(isBeginningOfLine);

        this.selectionStart--;
        this.text = this.text.slice(0, this.selectionStart) +
                    this.text.slice(this.selectionStart + 1);
      }
    }
  }
});
