(function() {

  var clone = fabric.util.object.clone;

  fabric.ITextBehavior = { /** @lends fabric.IText.prototype */

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
      fabric.util.addListener(document, 'keydown', this.onKeyDown.bind(this));
      fabric.util.addListener(document, 'keypress', this.onKeyPress.bind(this));
    },

    /**
     * Initializes hidden textarea (needed to bring up keyboard in iOS)
     */
    initHiddenTextarea: function() {
      if (!/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) return;

      this.hiddenTextarea = fabric.document.createElement('textarea');

      this.hiddenTextarea.setAttribute('autocapitalize', 'off');
      this.hiddenTextarea.style.cssText = 'position: absolute; top: 0; left: -9999px';

      fabric.document.body.appendChild(this.hiddenTextarea);
    },

    /**
     * Initializes "dbclick" event handler
     */
    initDblClickSimulation: function() {
      var lastClickTime = +new Date();
      var newClickTime;
      this.on('mousedown', function(options) {
        newClickTime = +new Date();
        if (newClickTime - lastClickTime < 500) {
          this.fire('dblclick', options);

          var event = options.e;

          event.preventDefault && event.preventDefault();
          event.stopPropagation && event.stopPropagation();
        }
        lastClickTime = newClickTime;
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
        }
      });
    },

    /**
     * Initializes "mousemove" event handler
     */
    initMousemoveHandler: function() {
      this.on('mousemove', function() {
        if (this.__isMousedown && this.isEditing) {
          console.log('mousemove: need to select text');
        }
      });
    },

    /**
     * Initializes "mouseup" event handler
     */
    initMouseupHandler: function() {
      this.on('mouseup', function(options) {
        this.__isMousedown = false;

        var pointer = this.canvas.getPointer(options.e);

        var isObjectMoved = this.__mousedownX !== pointer.x ||
                            this.__mousedownY !== pointer.y;

        if (isObjectMoved) return;

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
            if (options.e && _this.canvas.findTarget(options.e)) return;
            _this.exitEditing();
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
      this.canvas.renderAll();

      var _this = this;
      setTimeout(function() {
        _this._abortCursorAnimation = false;
      }, 10);
    },

    /**
     * Handles keyup event
     * @param {Event} e Event object
     */
    onKeyDown: function(e) {
      if (!this.isEditing || e.ctrlKey) return;

      if (e.keyCode === 39) {
        this.moveCursorRight(e);
      }
      else if (e.keyCode === 37) {
        this.moveCursorLeft(e);
      }
      else if (e.keyCode === 38) {
        this.moveCursorUp(e);
      }
      else if (e.keyCode === 40) {
        this.moveCursorDown(e);
      }
      else if (e.keyCode === 8) {
        this.removeChars(e);
      }
      else if (e.keyCode === 46) {
        // forward delete on windows
        this.moveCursorRight(e);
        this.removeChars(e);
      }
      else if (e.keyCode === 13) {
        this.insertNewline();
      }
      else {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      this.canvas && this.canvas.renderAll();
    },

    /**
     * Handles keypress event
     * @param {Event} e Event object
     */
    onKeyPress: function(e) {
      if (!this.isEditing || e.metaKey || e.ctrlKey ||
          e.keyCode === 8 ||
          e.keyCode === 13 ||
          e.keyCode === 37 ||
          e.keyCode === 38 ||
          e.keyCode === 39 ||
          e.keyCode === 40) {
        return;
      }

      this.insertChar(String.fromCharCode(e.which));

      e.preventDefault();
      e.stopPropagation();
    },

    /**
     * Gets start offset of a selection
     * @return {Number}
     */
    getSelectionStartOffset: function() {
      var textBeforeCursor = this.text.slice(0, this.selectionStart);
      var textAfterCursor = this.text.slice(this.selectionStart);

      var textOnSameLineBeforeCursor = textBeforeCursor.slice(textBeforeCursor.lastIndexOf('\n') + 1);
      var textOnSameLineAfterCursor = textAfterCursor.match(/(.*)\n?/)[1];
      var textOnNextLine = (textAfterCursor.match(/.*\n(.*)\n?/) || { })[1] || '';

      if (textOnSameLineBeforeCursor.length > textOnNextLine.length) {
        return (textOnNextLine + textOnSameLineAfterCursor).length + 1;
      }
      else {
        return (textOnSameLineBeforeCursor + textOnSameLineAfterCursor).length + 1;
      }
    },

    /**
     * Moves cursor down
     * @param {Event} e Event object
     */
    moveCursorDown: function(e) {

      this.abortCursorAnimation();
      this._currentCursorOpacity = 1;

      var offset = this.getSelectionStartOffset();

      if (e.metaKey) {
        // move to the end of a text
        offset = this.text.length - this.selectionStart;
      }

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
        this.selectionStart = this.selectionEnd;
        this._selectionDirection = 'right';
      }
      else {
        this._selectionDirection = 'right';
        this.selectionEnd += offset;

        if (this.selectionEnd > this.text.length) {
          this.selectionEnd = this.text.length;
        }
      }
    },

    /**
     * Moves cursor up
     * @param {Event} e Event object
     */
    moveCursorUp: function(e) {

      var textBeforeCursor = this.text.slice(0, this.selectionStart);

      this.abortCursorAnimation();
      this._currentCursorOpacity = 1;

      var textOnSameLineBeforeCursor = textBeforeCursor.slice(textBeforeCursor.lastIndexOf('\n') + 1);
      var textOnPreviousLine = (textBeforeCursor.match(/\n?(.*)\n.*$/) || {})[1] || '';
      var offset;

      // only change cursor location if there's no selection at the moment
      if (textOnSameLineBeforeCursor.length > textOnPreviousLine.length) {
        offset = textOnSameLineBeforeCursor.length + 1;
      }
      else {
        offset = textOnPreviousLine.length + 1;
      }

      if (e.metaKey) {
        // move to start of text
        offset = this.selectionStart;
      }

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
          this.selectionEnd = this.selectionStart;
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
      var selectedText = this.text.slice(this.selectionStart, this.selectionEnd);
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
     * Returns coordinates of a pointer relative to an object
     * @return {Object} Coordinates of a pointer (x, y)
     */
    getLocalPointer: function(e) {
      var pointer = this.canvas.getPointer(e);
      var objectLeftTop = this.translateToOriginPoint(this.getCenterPoint(), 'left', 'top');
      return {
        x: pointer.x - objectLeftTop.x,
        y: pointer.y - objectLeftTop.y
      };
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
     * Returns index of a character corresponding to where an object was clicked
     * @param {Event} e Event object
     * @return {Number} Index of a character
     */
    getSelectionStartFromPointer: function(e) {

      var localPointer = this.getLocalPointer(e),
          mouseOffsetX = localPointer.x,
          mouseOffsetY = localPointer.y,
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

        for (var j = 0, jlen = textLines[i].length; j < jlen; j++) {
          var _char = textLines[i][j];
          prevWidth = width;
          width += this._getWidthOfChar(this.ctx, _char, i, j) * this.scaleX;

          // debugging
          // var objectLeftTop = this.translateToOriginPoint(this.getCenterPoint(), 'left', 'top');
          // var ctx = this.canvas.upperCanvasEl.getContext('2d');

          if (height > mouseOffsetY && width > mouseOffsetX) {

            // ctx.save();
            // ctx.strokeRect(objectLeftTop.x, objectLeftTop.y, width, height);
            // ctx.translate(objectLeftTop.x, objectLeftTop.y);
            // ctx.fillRect(mouseOffsetX, mouseOffsetY, 10, 10);
            // ctx.restore();

            var distanceBtwLastCharAndCursor = mouseOffsetX - prevWidth;
            var distanceBtwNextCharAndCursor = width - mouseOffsetX;

            if (distanceBtwNextCharAndCursor > distanceBtwLastCharAndCursor) {
              newSelectionStart = charIndex + i;
              // console.log('leaning left');
            }
            else {
              // console.log('leaning right');
              newSelectionStart = charIndex + i + 1;
            }

            if (newSelectionStart > this.text.length) {
              newSelectionStart = this.text.length;
            }

            //this.canvas.renderAll();
            return newSelectionStart;
          }

          charIndex++;
        }
      }

      // clicked somewhere after all chars, so set at the end
      if (typeof newSelectionStart === 'undefined') {
        return this.text.length;
      }
    },

    /**
     * Enters editing state
     * @return {fabric.IText} thisArg
     * @chainable
     */
    enterEditing: function() {
      if (this.isEditing || !this.editable) return;

      this.isEditing = true;

      if (this.hiddenTextarea) {
        this.hiddenTextarea.value = this.text;
        this.hiddenTextarea.selectionStart = this.selectionStart;
        this.hiddenTextarea.focus();
      }

      this._saveProps();

      this.hoverCursor = 'text';
      this.canvas.defaultCursor = 'text';
      this.canvas.moveCursor = 'text';

      this.hasControls = false;
      this.borderColor = this.editingBorderColor;
      this.selectable = false;
      this.lockMovementX = true;
      this.lockMovementY = true;

      this._tick();
      this.canvas.renderAll();

      return this;
    },

    /**
     * @private
     */
    _saveProps: function() {
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
    _restoreProps: function() {
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
      this._restoreProps();
      this._currentCursorOpacity = 0;

      return this;
    },

    /**
     * Inserts a character where cursor is (replacing selection if one exists)
     */
    removeChars: function(e) {

      if (this.selectionStart === this.selectionEnd) {
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
      else {
        this._removeCharsFromTo(this.selectionStart, this.selectionEnd);
      }

      this.selectionEnd = this.selectionStart;

      // remove any extraneous styles "at the end"
      var textLines = this.text.split(this._reNewline);
      for (var prop in this.styles) {
        if (!textLines[prop]) {
          delete this.styles[prop];
        }
      }

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
    _removeCharsFromTo: function(start, end) {
      var i = end;
      while (i !== start) {
        i--;
        //var isBeginningOfLine = this.text.slice(end - 1, end) === '\n';
        this.removeStyleObject(false, i);
      }

      this.text = this.text.slice(0, start) +
                  this.text.slice(end);
    },

    /**
     * Inserts a character where cursor is (replacing selection if one exists)
     * @param {String} _char Character to insert
     */
    insertChar: function(_char) {
      var isEndOfLine = this.text.slice(this.selectionStart, this.selectionStart + 1) === '\n';

      this.text = this.text.slice(0, this.selectionStart) +
                    _char +
                  this.text.slice(this.selectionEnd);

      if (this.selectionStart === this.selectionEnd) {
        this.insertStyleObject(_char, isEndOfLine);
      }
      else if (this.selectionEnd - this.selectionStart > 1) {
        // TODO: replace styles properly
        // console.log('replacing MORE than 1 char');
      }

      this.selectionStart++;
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

      var currentCharStyle = this.styles[lineIndex][charIndex - 1];
      var newLineStyles = { };

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

      var currentLineStyles = this.styles[lineIndex];
      var currentLineStylesCloned = clone(currentLineStyles);

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
     * @param {String} _char Character at the location where style is inserted
     * @param {Boolean} isEndOfLine True if it's end of line
     */
    insertStyleObject: function(_char, isEndOfLine) {

      // short-circuit
      if (this.isEmptyStyles()) return;

      var cursorLocation = this.get2DCursorLocation();
      var lineIndex = cursorLocation.lineIndex;
      var charIndex = cursorLocation.charIndex;

      if (!this.styles[lineIndex]) {
        this.styles[lineIndex] = { };
      }

      if (_char === '\n') {
        this.insertNewlineStyleObject(lineIndex, charIndex, isEndOfLine);
      }
      else {
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

      var cursorLocation = this.get2DCursorLocation(index);
      var lineIndex = cursorLocation.lineIndex;
      var charIndex = cursorLocation.charIndex;

      if (isBeginningOfLine) {

        var textLines = this.text.split(this._reNewline);
        var textOnPreviousLine = textLines[lineIndex - 1];
        var newCharIndexOnPrevLine = textOnPreviousLine.length;

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
      this.insertChar('\n');
    }
  };
})();
