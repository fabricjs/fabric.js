(function() {

  var clone = fabric.util.object.clone;

  fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {

    /**
     * Initializes all the interactive behavior of IText
     */
    initBehavior: function() {
      this.initKeyHandlers();
      this.initCursorSelectionHandlers();
      this.initDblClickSimulation();
      this.initHiddenTextarea();
    },

    /**
     * Initializes key handlers
     */
    initKeyHandlers: function() {
      fabric.util.addListener(fabric.document, 'keydown', this.onKeyDown.bind(this));
      fabric.util.addListener(fabric.document, 'keypress', this.onKeyPress.bind(this));
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
     * Initializes "dbclick" event handler
     */
    initDblClickSimulation: function() {

      var lastClickTime = +new Date(),
          newClickTime,
          lastPointer = { },
          newPointer;

      this.on('mousedown', function(options) {

        var event = options.e;

        newClickTime = +new Date();
        newPointer = this.canvas.getPointer(event);

        var isDblClick =
          newClickTime - lastClickTime < 500 &&
          lastPointer.x === newPointer.x &&
          lastPointer.y === newPointer.y;

        if (isDblClick) {

          this.fire('dblclick', options);

          event.preventDefault && event.preventDefault();
          event.stopPropagation && event.stopPropagation();
        }

        lastClickTime = newClickTime;
        lastPointer = newPointer;
      });
    },

    /**
     * Initializes event handlers related to cursor or selection
     */
    initCursorSelectionHandlers: function() {
      this.initSelectedHandler();
      this.initMousedownHandler();
      this.initMousemoveHandler();
      this.initMouseupHandler();

      this.on('dblclick', function(options) {
        this.selectWord(this.getSelectionStartFromPointer(options.e));
      });
    },

    /**
     * Initializes "mousedown" event handler
     */
    initMousedownHandler: function() {
      this.on('mousedown', function(options) {

        var pointer = this.canvas.getPointer(options.e);

        this.__mousedownX = pointer.x;
        this.__mousedownY = pointer.y;
        this.__isMousedown = true;

        if (this.hiddenTextarea && this.canvas) {
          this.canvas.wrapperEl.appendChild(this.hiddenTextarea);
        }

        if (this.isEditing) {
          this.setCursorByClick(options.e);
          this.__selectionStartOnMouseDown = this.selectionStart;
        }

      });
    },

    /**
     * Initializes "mousemove" event handler
     */
    initMousemoveHandler: function() {
      this.on('mousemove', function(options) {
        if (!this.__isMousedown || !this.isEditing) return;

        var newSelectionStart = this.getSelectionStartFromPointer(options.e);

        if (newSelectionStart >= this.__selectionStartOnMouseDown) {
          this.setSelectionStart(this.__selectionStartOnMouseDown);
          this.setSelectionEnd(newSelectionStart);
        }
        else {
          this.setSelectionStart(newSelectionStart);
          this.setSelectionEnd(this.__selectionStartOnMouseDown);
        }
      });
    },

    /**
     * @private
     */
    _isObjectMoved: function(e) {
      var pointer = this.canvas.getPointer(e);

      return this.__mousedownX !== pointer.x ||
             this.__mousedownY !== pointer.y;
    },

    /**
     * Initializes "mouseup" event handler
     */
    initMouseupHandler: function() {
      this.on('mouseup', function(options) {
        this.__isMousedown = false;

        if (this._isObjectMoved(options.e)) return;

        if (this.selected) {
          this.enterEditing();
        }
      });
    },

    /**
     * Initializes "selected" event handler
     */
    initSelectedHandler: function() {
      this.on('selected', function() {

        var _this = this;
        setTimeout(function() {
          _this.selected = true;
        }, 100);

        if (!this._hasClearSelectionListener) {

          this.canvas.on('selection:cleared', function(options) {
            // do not exit editing if event fired when clicking on an object again (in editing mode)
            if (options.e && _this.canvas.containsPoint(options.e, _this)) return;
            _this.exitEditing();
          });

          this.canvas.on('mouse:up', function() {
            this.getObjects('i-text').forEach(function(obj) {
              obj.__isMousedown = false;
            });
          });

          this._hasClearSelectionListener = true;
        }
      });
    },

    /**
     * @private
     */
    _tick: function() {

      var _this = this;

      if (this._abortCursorAnimation) return;

      this.animate('_currentCursorOpacity', 1, {

        duration: this.cursorDuration,

        onComplete: function() {
          _this._onTickComplete();
        },

        onChange: function() {
          _this.canvas && _this.canvas.renderAll();
        },

        abort: function() {
          return _this._abortCursorAnimation;
        }
      });
    },

    /**
     * @private
     */
    _onTickComplete: function() {
      if (this._abortCursorAnimation) return;

      var _this = this;
      if (this._cursorTimeout1) {
        clearTimeout(this._cursorTimeout1);
      }
      this._cursorTimeout1 = setTimeout(function() {
        _this.animate('_currentCursorOpacity', 0, {
          duration: this.cursorDuration / 2,
          onComplete: function() {
            _this._tick();
          },
          onChange: function() {
            _this.canvas && _this.canvas.renderAll();
          },
          abort: function() {
            return _this._abortCursorAnimation;
          }
        });
      }, 100);
    },

    /**
     * Initializes delayed cursor
     */
    initDelayedCursor: function() {
      var _this = this;
      if (this._cursorTimeout2) {
        clearTimeout(this._cursorTimeout2);
      }
      this._cursorTimeout2 = setTimeout(function() {
        _this._abortCursorAnimation = false;
        _this._tick();
      }, this.cursorDelay);
    },

    /**
     * Aborts cursor animation and clears all timeouts
     */
    abortCursorAnimation: function() {
      this._abortCursorAnimation = true;

      clearTimeout(this._cursorTimeout1);
      clearTimeout(this._cursorTimeout2);

      this._currentCursorOpacity = 0;
      this.canvas && this.canvas.renderAll();

      var _this = this;
      setTimeout(function() {
        _this._abortCursorAnimation = false;
      }, 10);
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
     * Selects entire text
     */
    selectAll: function() {
      this.selectionStart = 0;
      this.selectionEnd = this.text.length;
    },

    /**
     * Returns selected text
     * @return {String}
     */
    getSelectedText: function() {
      return this.text.slice(this.selectionStart, this.selectionEnd);
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
     * Find new selection index representing start of current word according to current selection index
     * @param {Number} current selection index
     */
    findWordBoundaryLeft: function(startFrom) {
      var offset = 0, index = startFrom - 1;

      // remove space before cursor first
      if (this._reSpace.test(this.text.charAt(index))) {
        while (this._reSpace.test(this.text.charAt(index))) {
          offset++;
          index--;
        }
      }
      while (/\S/.test(this.text.charAt(index)) && index > -1) {
        offset++;
        index--;
      }

      return startFrom - offset;
    },

    /**
     * Find new selection index representing end of current word according to current selection index
     * @param {Number} current selection index
     */
    findWordBoundaryRight: function(startFrom) {
      var offset = 0, index = startFrom;

      // remove space after cursor first
      if (this._reSpace.test(this.text.charAt(index))) {
        while (this._reSpace.test(this.text.charAt(index))) {
          offset++;
          index++;
        }
      }
      while (/\S/.test(this.text.charAt(index)) && index < this.text.length) {
        offset++;
        index++;
      }

      return startFrom + offset;
    },

    /**
     * Find new selection index representing start of current line according to current selection index
     * @param {Number} current selection index
     */
    findLineBoundaryLeft: function(startFrom) {
      var offset = 0, index = startFrom - 1;

      while (!/\n/.test(this.text.charAt(index)) && index > -1) {
        offset++;
        index--;
      }

      return startFrom - offset;
    },

    /**
     * Find new selection index representing end of current line according to current selection index
     * @param {Number} current selection index
     */
    findLineBoundaryRight: function(startFrom) {
      var offset = 0, index = startFrom;

      while (!/\n/.test(this.text.charAt(index)) && index < this.text.length) {
        offset++;
        index++;
      }

      return startFrom + offset;
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
     * Returns number of newlines in selected text
     * @return {Number}
     */
    getNumNewLinesInSelectedText: function() {
      var selectedText = this.getSelectedText();
      var numNewLines = 0;
      for (var i = 0, chars = selectedText.split(''), len = chars.length; i < len; i++) {
        if (chars[i] === '\n') {
          numNewLines++;
        }
      }
      return numNewLines;
    },

    /**
     * Finds index corresponding to beginning or end of a word
     * @param {Number} selectionStart Index of a character
     * @param {Number} direction: 1 or -1
     */
    searchWordBoundary: function(selectionStart, direction) {
      var index = selectionStart;
      var _char = this.text.charAt(index);
      var reNonWord = /[ \n\.,;!\?\-]/;

      while (!reNonWord.test(_char) && index > 0 && index < this.text.length) {
        index += direction;
        _char = this.text.charAt(index);
      }
      if (reNonWord.test(_char) && _char !== '\n') {
        index += direction === 1 ? 0 : 1;
      }
      return index;
    },

    /**
     * Selects a word based on the index
     * @param {Number} selectionStart Index of a character
     */
    selectWord: function(selectionStart) {

      var newSelectionStart = this.searchWordBoundary(selectionStart, -1); /* search backwards */
      var newSelectionEnd = this.searchWordBoundary(selectionStart, 1); /* search forward */

      this.setSelectionStart(newSelectionStart);
      this.setSelectionEnd(newSelectionEnd);
    },

    /**
     * Changes cursor location in a text depending on passed pointer (x/y) object
     * @param {Object} pointer Pointer object with x and y numeric properties
     */
    setCursorByClick: function(e) {
      var newSelectionStart = this.getSelectionStartFromPointer(e);

      this.setSelectionStart(newSelectionStart);
      this.setSelectionEnd(newSelectionStart);
    },

    /**
     * @private
     * @param {Event} e Event object
     * @param {Object} Object with x/y corresponding to local offset (according to object rotation)
     */
    _getLocalRotatedPointer: function(e) {
      var pointer = this.canvas.getPointer(e),

          pClicked = new fabric.Point(pointer.x, pointer.y),
          pLeftTop = new fabric.Point(this.left, this.top),

          rotated = fabric.util.rotatePoint(
            pClicked, pLeftTop, fabric.util.degreesToRadians(-this.angle));

      return this.getLocalPointer(e, rotated);
    },

    /**
     * Returns index of a character corresponding to where an object was clicked
     * @param {Event} e Event object
     * @return {Number} Index of a character
     */
    getSelectionStartFromPointer: function(e) {

      var mouseOffset = this._getLocalRotatedPointer(e),
          textLines = this.text.split(this._reNewline),
          prevWidth = 0,
          width = 0,
          height = 0,
          charIndex = 0,
          newSelectionStart;

      for (var i = 0, len = textLines.length; i < len; i++) {

        height += this._getHeightOfLine(this.ctx, i) * this.scaleY;

        var widthOfLine = this._getWidthOfLine(this.ctx, i, textLines);
        var lineLeftOffset = this._getLineLeftOffset(widthOfLine);

        width = lineLeftOffset;

        if (this.flipX) {
          // when oject is horizontally flipped we reverse chars
          textLines[i] = textLines[i].split('').reverse().join('');
        }

        for (var j = 0, jlen = textLines[i].length; j < jlen; j++) {

          var _char = textLines[i][j];
          prevWidth = width;

          width += this._getWidthOfChar(this.ctx, _char, i, this.flipX ? jlen - j : j) *
                   this.scaleX;

          if (height <= mouseOffset.y || width <= mouseOffset.x) {
            charIndex++;
            continue;
          }

          return this._getNewSelectionStartFromOffset(
            mouseOffset, prevWidth, width, charIndex + i, jlen);
        }
      }

      // clicked somewhere after all chars, so set at the end
      if (typeof newSelectionStart === 'undefined') {
        return this.text.length;
      }
    },

    /**
     * @private
     */
    _getNewSelectionStartFromOffset: function(mouseOffset, prevWidth, width, index, jlen) {

      var distanceBtwLastCharAndCursor = mouseOffset.x - prevWidth,
          distanceBtwNextCharAndCursor = width - mouseOffset.x,
          offset = distanceBtwNextCharAndCursor > distanceBtwLastCharAndCursor ? 0 : 1,
          newSelectionStart = index + offset;

      // if object is horizontally flipped, mirror cursor location from the end
      if (this.flipX) {
        newSelectionStart = jlen - newSelectionStart;
      }

      if (newSelectionStart > this.text.length) {
        newSelectionStart = this.text.length;
      }

      return newSelectionStart;
    },

    /**
     * Enters editing state
     * @return {fabric.IText} thisArg
     * @chainable
     */
    enterEditing: function() {
      if (this.isEditing || !this.editable) return;

      fabric.IText.instances.forEach(function(obj) {
        if (obj === this) return;
        obj.exitEditing();
      }, this);

      this.isEditing = true;

      this._updateTextarea();
      this._saveEditingProps();
      this._setEditingProps();

      this._tick();
      this.canvas.renderAll();

      return this;
    },

    /**
     * @private
     */
    _setEditingProps: function() {
      this.hoverCursor =
      this.canvas.defaultCursor =
      this.canvas.moveCursor = 'text';

      this.borderColor = this.editingBorderColor;

      this.hasControls = this.selectable = false;
      this.lockMovementX = this.lockMovementY = true;
    },

    /**
     * @private
     */
    _updateTextarea: function() {
      if (!this.hiddenTextarea) return;

      this.hiddenTextarea.value = this.text;
      this.hiddenTextarea.selectionStart = this.selectionStart;
      this.hiddenTextarea.focus();
    },

    /**
     * @private
     */
    _saveEditingProps: function() {
      this._savedProps = {
        hasControls: this.hasControls,
        borderColor: this.borderColor,
        lockMovementX: this.lockMovementX,
        lockMovementY: this.lockMovementY,
        hoverCursor: this.hoverCursor,
        defaultCursor: this.canvas.defaultCursor,
        moveCursor: this.canvas.moveCursor
      };
    },

    /**
     * @private
     */
    _restoreEditingProps: function() {
      if (!this._savedProps) return;

      this.hoverCursor = this._savedProps.overCursor;
      this.canvas.defaultCursor = this._savedProps.defaultCursor;
      this.canvas.moveCursor = this._savedProps.moveCursor;
      this.hasControls = this._savedProps.hasControls;
      this.borderColor = this._savedProps.borderColor;
      this.lockMovementX = this._savedProps.lockMovementX;
      this.lockMovementY = this._savedProps.lockMovementY;
    },

    /**
     * Exits from editing state
     * @return {fabric.IText} thisArg
     * @chainable
     */
    exitEditing: function() {

      this.selected = false;
      this.isEditing = false;
      this.selectable = true;

      this.hiddenTextarea && this.hiddenTextarea.blur();

      this.abortCursorAnimation();
      this._restoreEditingProps();
      this._currentCursorOpacity = 0;

      return this;
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
      this.fire('text:changed');
    },

    /**
     * @private
     */
    _removeExtraneousStyles: function() {
      var textLines = this.text.split(this._reNewline);
      for (var prop in this.styles) {
        if (!textLines[prop]) {
          delete this.styles[prop];
        }
      }
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
    },

    /**
     * @private
     */
    _removeCharsFromTo: function(start, end) {
      var i = end;
      while (i !== start) {
        i--;
        this.removeStyleObject(false, i);
      }

      this.text = this.text.slice(0, start) +
                  this.text.slice(end);
    },

    /**
     * Inserts a character where cursor is (replacing selection if one exists)
     * @param {String} _chars Characters to insert
     */
    insertChars: function(_chars) {
      var isEndOfLine = this.text.slice(this.selectionStart, this.selectionStart + 1) === '\n';

      this.text = this.text.slice(0, this.selectionStart) +
                    _chars +
                  this.text.slice(this.selectionEnd);

      if (this.selectionStart === this.selectionEnd) {
        this.insertStyleObject(_chars, isEndOfLine);
      }
      else if (this.selectionEnd - this.selectionStart > 1) {
        // TODO: replace styles properly
        // console.log('replacing MORE than 1 char');
      }

      this.selectionStart += _chars.length;
      this.selectionEnd = this.selectionStart;

      if (this.canvas) {
        // TODO: double renderAll gets rid of text box shift happenning sometimes
        // need to find out what exactly causes it and fix it
        this.canvas.renderAll().renderAll();
      }

      this.setCoords();
      this.fire('text:changed');
    },

    /**
     * Inserts new style object
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     * @param {Boolean} isEndOfLine True if it's end of line
     */
    insertNewlineStyleObject: function(lineIndex, charIndex, isEndOfLine) {

      this.shiftLineStyles(lineIndex, +1);

      if (!this.styles[lineIndex + 1]) {
        this.styles[lineIndex + 1] = { };
      }

      var currentCharStyle = this.styles[lineIndex][charIndex - 1],
          newLineStyles = { };

      // if there's nothing after cursor,
      // we clone current char style onto the next (otherwise empty) line
      if (isEndOfLine) {
        newLineStyles[0] = clone(currentCharStyle);
        this.styles[lineIndex + 1] = newLineStyles;
      }
      // otherwise we clone styles of all chars
      // after cursor onto the next line, from the beginning
      else {
        for (var index in this.styles[lineIndex]) {
          if (parseInt(index, 10) >= charIndex) {
            newLineStyles[parseInt(index, 10) - charIndex] = this.styles[lineIndex][index];
            // remove lines from the previous line since they're on a new line now
            delete this.styles[lineIndex][index];
          }
        }
        this.styles[lineIndex + 1] = newLineStyles;
      }
    },

    /**
     * Inserts style object for a given line/char index
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     */
    insertCharStyleObject: function(lineIndex, charIndex) {

      var currentLineStyles = this.styles[lineIndex],
          currentLineStylesCloned = clone(currentLineStyles);

      if (charIndex === 0) {
        charIndex = 1;
      }

      // shift all char styles by 1 forward
      // 0,1,2,3 -> (charIndex=2) -> 0,1,3,4 -> (insert 2) -> 0,1,2,3,4
      for (var index in currentLineStylesCloned) {
        var numericIndex = parseInt(index, 10);
        if (numericIndex >= charIndex) {
          currentLineStyles[numericIndex + 1] = currentLineStylesCloned[numericIndex];
          //delete currentLineStyles[index];
        }
      }
      this.styles[lineIndex][charIndex] = clone(currentLineStyles[charIndex - 1]);
    },

    /**
     * Inserts style object
     * @param {String} _chars Characters at the location where style is inserted
     * @param {Boolean} isEndOfLine True if it's end of line
     */
    insertStyleObject: function(_chars, isEndOfLine) {

      // short-circuit
      if (this.isEmptyStyles()) return;

      var cursorLocation = this.get2DCursorLocation(),
          lineIndex = cursorLocation.lineIndex,
          charIndex = cursorLocation.charIndex;

      if (!this.styles[lineIndex]) {
        this.styles[lineIndex] = { };
      }

      if (_chars === '\n') {
        this.insertNewlineStyleObject(lineIndex, charIndex, isEndOfLine);
      }
      else {
        // TODO: support multiple style insertion if _chars.length > 1
        this.insertCharStyleObject(lineIndex, charIndex);
      }
    },

    /**
     * Shifts line styles up or down
     * @param {Number} lineIndex Index of a line
     * @param {Number} offset Can be -1 or +1
     */
    shiftLineStyles: function(lineIndex, offset) {
      // shift all line styles by 1 upward
      var clonedStyles = clone(this.styles);
      for (var line in this.styles) {
        var numericLine = parseInt(line, 10);
        if (numericLine > lineIndex) {
          this.styles[numericLine + offset] = clonedStyles[numericLine];
        }
      }
    },

    /**
     * Removes style object
     * @param {Boolean} isBeginningOfLine True if cursor is at the beginning of line
     * @param {Number} [index] Optional index. When not given, current selectionStart is used.
     */
    removeStyleObject: function(isBeginningOfLine, index) {

      var cursorLocation = this.get2DCursorLocation(index),
          lineIndex = cursorLocation.lineIndex,
          charIndex = cursorLocation.charIndex;

      if (isBeginningOfLine) {

        var textLines = this.text.split(this._reNewline),
            textOnPreviousLine = textLines[lineIndex - 1],
            newCharIndexOnPrevLine = textOnPreviousLine.length;

        if (!this.styles[lineIndex - 1]) {
          this.styles[lineIndex - 1] = { };
        }

        for (charIndex in this.styles[lineIndex]) {
          this.styles[lineIndex - 1][parseInt(charIndex, 10) + newCharIndexOnPrevLine]
            = this.styles[lineIndex][charIndex];
        }

        this.shiftLineStyles(lineIndex, -1);
      }
      else {
        var currentLineStyles = this.styles[lineIndex];

        if (currentLineStyles) {
          var offset = this.selectionStart === this.selectionEnd ? -1 : 0;
          delete currentLineStyles[charIndex + offset];
          // console.log('deleting', lineIndex, charIndex + offset);
        }

        var currentLineStylesCloned = clone(currentLineStyles);

        // shift all styles by 1 backwards
        for (var i in currentLineStylesCloned) {
          var numericIndex = parseInt(i, 10);
          if (numericIndex >= charIndex && numericIndex !== 0) {
            currentLineStyles[numericIndex - 1] = currentLineStylesCloned[numericIndex];
            delete currentLineStyles[numericIndex];
          }
        }
      }
    },

    /**
     * Inserts new line
     */
    insertNewline: function() {
      this.insertChars('\n');
    }
  });
})();
