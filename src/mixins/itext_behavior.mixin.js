(function() {

  var clone = fabric.util.object.clone;

  fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {

    /**
     * Initializes all the interactive behavior of IText
     */
    initBehavior: function() {
      this.initAddedHandler();
      this.initRemovedHandler();
      this.initCursorSelectionHandlers();
      this.initDoubleClickSimulation();
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
      });
    },

    /**
     * Initializes "added" event handler
     */
    initAddedHandler: function() {
      var _this = this;
      this.on('added', function() {
        if (this.canvas && !this.canvas._hasITextHandlers) {
          this.canvas._hasITextHandlers = true;
          this._initCanvasHandlers();
        }

        // Track IText instances per-canvas. Only register in this array once added
        // to a canvas; we don't want to leak a reference to the instance forever
        // simply because it existed at some point.
        //
        // (Might be added to a collection, but not on a canvas.)
        if (_this.canvas) {
          _this.canvas._iTextInstances = _this.canvas._iTextInstances || [];
          _this.canvas._iTextInstances.push(_this);
        }
      });
    },

    initRemovedHandler: function() {
      var _this = this;
      this.on('removed', function() {
        // (Might be removed from a collection, but not on a canvas.)
        if (_this.canvas) {
          _this.canvas._iTextInstances = _this.canvas._iTextInstances || [];
          fabric.util.removeFromArray(_this.canvas._iTextInstances, _this);
        }
      });
    },

    /**
     * @private
     */
    _initCanvasHandlers: function() {
      var _this = this;

      this.canvas.on('selection:cleared', function() {
        fabric.IText.prototype.exitEditingOnOthers(_this.canvas);
      });

      this.canvas.on('mouse:up', function() {
        if (_this.canvas._iTextInstances) {
          _this.canvas._iTextInstances.forEach(function(obj) {
            obj.__isMousedown = false;
          });
        }
      });

      this.canvas.on('object:selected', function() {
        fabric.IText.prototype.exitEditingOnOthers(_this.canvas);
      });
    },

    /**
     * @private
     */
    _tick: function() {
      this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, '_onTickComplete');
    },

    /**
     * @private
     */
    _animateCursor: function(obj, targetOpacity, duration, completeMethod) {

      var tickState;

      tickState = {
        isAborted: false,
        abort: function() {
          this.isAborted = true;
        },
      };

      obj.animate('_currentCursorOpacity', targetOpacity, {
        duration: duration,
        onComplete: function() {
          if (!tickState.isAborted) {
            obj[completeMethod]();
          }
        },
        onChange: function() {
          if (obj.canvas) {
            obj.canvas.clearContext(obj.canvas.contextTop || obj.ctx);
            obj.renderCursorOrSelection();
          }
        },
        abort: function() {
          return tickState.isAborted;
        }
      });
      return tickState;
    },

    /**
     * @private
     */
    _onTickComplete: function() {

      var _this = this;

      if (this._cursorTimeout1) {
        clearTimeout(this._cursorTimeout1);
      }
      this._cursorTimeout1 = setTimeout(function() {
        _this._currentTickCompleteState = _this._animateCursor(_this, 0, this.cursorDuration / 2, '_tick');
      }, 100);
    },

    /**
     * Initializes delayed cursor
     */
    initDelayedCursor: function(restart) {
      var _this = this,
          delay = restart ? 0 : this.cursorDelay;

      this._currentTickState && this._currentTickState.abort();
      this._currentTickCompleteState && this._currentTickCompleteState.abort();
      clearTimeout(this._cursorTimeout1);
      this._currentCursorOpacity = 1;
      if (this.canvas) {
        this.canvas.clearContext(this.canvas.contextTop || this.ctx);
        this.renderCursorOrSelection();
      }
      if (this._cursorTimeout2) {
        clearTimeout(this._cursorTimeout2);
      }
      this._cursorTimeout2 = setTimeout(function() {
        _this._tick();
      }, delay);
    },

    /**
     * Aborts cursor animation and clears all timeouts
     */
    abortCursorAnimation: function() {
      this._currentTickState && this._currentTickState.abort();
      this._currentTickCompleteState && this._currentTickCompleteState.abort();

      clearTimeout(this._cursorTimeout1);
      clearTimeout(this._cursorTimeout2);

      this._currentCursorOpacity = 0;
      this.canvas && this.canvas.clearContext(this.canvas.contextTop || this.ctx);
    },

    /**
     * Selects entire text
     */
    selectAll: function() {
      this.setSelectionStart(0);
      this.setSelectionEnd(this.text.length);
    },

    /**
     * Returns selected text
     * @return {String}
     */
    getSelectedText: function() {
      return this.text.slice(this.selectionStart, this.selectionEnd);
    },

    /**
     * Find new selection index representing start of current word according to current selection index
     * @param {Number} startFrom Surrent selection index
     * @return {Number} New selection index
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
     * @param {Number} startFrom Current selection index
     * @return {Number} New selection index
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
     * @param {Number} startFrom Current selection index
     * @return {Number} New selection index
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
     * @param {Number} startFrom Current selection index
     * @return {Number} New selection index
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
     * Returns number of newlines in selected text
     * @return {Number} Number of newlines in selected text
     */
    getNumNewLinesInSelectedText: function() {
      var selectedText = this.getSelectedText(),
          numNewLines = 0;

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
     * @return {Number} Index of the beginning or end of a word
     */
    searchWordBoundary: function(selectionStart, direction) {
      var index = this._reSpace.test(this.text.charAt(selectionStart)) ? selectionStart - 1 : selectionStart,
          _char = this.text.charAt(index),
          reNonWord = /[ \n\.,;!\?\-]/;

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
      var newSelectionStart = this.searchWordBoundary(selectionStart, -1), /* search backwards */
          newSelectionEnd = this.searchWordBoundary(selectionStart, 1); /* search forward */

      this.setSelectionStart(newSelectionStart);
      this.setSelectionEnd(newSelectionEnd);
    },

    /**
     * Selects a line based on the index
     * @param {Number} selectionStart Index of a character
     */
    selectLine: function(selectionStart) {
      var newSelectionStart = this.findLineBoundaryLeft(selectionStart),
          newSelectionEnd = this.findLineBoundaryRight(selectionStart);

      this.setSelectionStart(newSelectionStart);
      this.setSelectionEnd(newSelectionEnd);
    },

    /**
     * Enters editing state
     * @return {fabric.IText} thisArg
     * @chainable
     */
    enterEditing: function() {
      if (this.isEditing || !this.editable) {
        return;
      }

      if (this.canvas) {
        this.exitEditingOnOthers(this.canvas);
      }

      this.isEditing = true;

      this.initHiddenTextarea();
      this.hiddenTextarea.focus();
      this._updateTextarea();
      this._saveEditingProps();
      this._setEditingProps();

      this._tick();
      this.fire('editing:entered');

      if (!this.canvas) {
        return this;
      }

      this.canvas.renderAll();
      this.canvas.fire('text:editing:entered', { target: this });
      this.initMouseMoveHandler();
      return this;
    },

    exitEditingOnOthers: function(canvas) {
      if (canvas._iTextInstances) {
        canvas._iTextInstances.forEach(function(obj) {
          obj.selected = false;
          if (obj.isEditing) {
            obj.exitEditing();
          }
        });
      }
    },

    /**
    * Initializes "mousemove" event handler
    */
    initMouseMoveHandler: function() {
      var _this = this;
      this.canvas.on('mouse:move',  function(options) {
        if (!_this.__isMousedown || !_this.isEditing) {
          return;
        }

        var newSelectionStart = _this.getSelectionStartFromPointer(options.e);
        if (newSelectionStart >= _this.__selectionStartOnMouseDown) {
          _this.setSelectionStart(_this.__selectionStartOnMouseDown);
          _this.setSelectionEnd(newSelectionStart);
        }
        else {
          _this.setSelectionStart(newSelectionStart);
          _this.setSelectionEnd(_this.__selectionStartOnMouseDown);
        }
      });
    },

    /**
     * @private
     */
    _setEditingProps: function() {
      this.hoverCursor = 'text';

      if (this.canvas) {
        this.canvas.defaultCursor = this.canvas.moveCursor = 'text';
      }

      this.borderColor = this.editingBorderColor;

      this.hasControls = this.selectable = false;
      this.lockMovementX = this.lockMovementY = true;
    },

    /**
     * @private
     */
    _updateTextarea: function() {
      if (!this.hiddenTextarea) {
        return;
      }

      this.hiddenTextarea.value = this.text;
      this.hiddenTextarea.selectionStart = this.selectionStart;
      this.hiddenTextarea.selectionEnd = this.selectionEnd;
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
        defaultCursor: this.canvas && this.canvas.defaultCursor,
        moveCursor: this.canvas && this.canvas.moveCursor
      };
    },

    /**
     * @private
     */
    _restoreEditingProps: function() {
      if (!this._savedProps) {
        return;
      }

      this.hoverCursor = this._savedProps.overCursor;
      this.hasControls = this._savedProps.hasControls;
      this.borderColor = this._savedProps.borderColor;
      this.lockMovementX = this._savedProps.lockMovementX;
      this.lockMovementY = this._savedProps.lockMovementY;

      if (this.canvas) {
        this.canvas.defaultCursor = this._savedProps.defaultCursor;
        this.canvas.moveCursor = this._savedProps.moveCursor;
      }
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

      this.selectionEnd = this.selectionStart;
      this.hiddenTextarea && this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea);
      this.hiddenTextarea = null;

      this.abortCursorAnimation();
      this._restoreEditingProps();
      this._currentCursorOpacity = 0;

      this.fire('editing:exited');
      this.canvas && this.canvas.fire('text:editing:exited', { target: this });

      return this;
    },

    /**
     * @private
     */
    _removeExtraneousStyles: function() {
      for (var prop in this.styles) {
        if (!this._textLines[prop]) {
          delete this.styles[prop];
        }
      }
    },

    /**
     * @private
     */
    _removeCharsFromTo: function(start, end) {

      var i = end;
      while (i !== start) {

        var prevIndex = this.get2DCursorLocation(i).charIndex;
        i--;

        var index = this.get2DCursorLocation(i).charIndex,
            isNewline = index > prevIndex;

        if (isNewline) {
          this.removeStyleObject(isNewline, i + 1);
        }
        else {
          this.removeStyleObject(this.get2DCursorLocation(i).charIndex === 0, i);
        }

      }

      this.text = this.text.slice(0, start) +
                  this.text.slice(end);
      this._clearCache();
    },

    /**
     * Inserts a character where cursor is (replacing selection if one exists)
     * @param {String} _chars Characters to insert
     */
    insertChars: function(_chars, useCopiedStyle) {
      var isEndOfLine = this.text.slice(this.selectionStart, this.selectionStart + 1) === '\n';

      this.text = this.text.slice(0, this.selectionStart) +
                    _chars +
                  this.text.slice(this.selectionEnd);

      if (this.selectionStart === this.selectionEnd) {
        this.insertStyleObjects(_chars, isEndOfLine, useCopiedStyle);
      }
      // else if (this.selectionEnd - this.selectionStart > 1) {
      // TODO: replace styles properly
      // console.log('replacing MORE than 1 char');
      // }
      this.setSelectionStart(this.selectionStart + _chars.length);
      this.setSelectionEnd(this.selectionStart);
      this._clearCache();
      this.canvas && this.canvas.renderAll();

      this.setCoords();
      this.fire('changed');
      this.canvas && this.canvas.fire('text:changed', { target: this });
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
      this._clearCache();
    },

    /**
     * Inserts style object for a given line/char index
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     * @param {Object} [style] Style object to insert, if given
     */
    insertCharStyleObject: function(lineIndex, charIndex, style) {

      var currentLineStyles = this.styles[lineIndex],
          currentLineStylesCloned = clone(currentLineStyles);

      if (charIndex === 0 && !style) {
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

      this.styles[lineIndex][charIndex] =
        style || clone(currentLineStyles[charIndex - 1]);
      this._clearCache();
    },

    /**
     * Inserts style object(s)
     * @param {String} _chars Characters at the location where style is inserted
     * @param {Boolean} isEndOfLine True if it's end of line
     * @param {Boolean} [useCopiedStyle] Style to insert
     */
    insertStyleObjects: function(_chars, isEndOfLine, useCopiedStyle) {
      // removed shortcircuit over isEmptyStyles

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
        if (useCopiedStyle) {
          this._insertStyles(this.copiedStyles);
        }
        else {
          // TODO: support multiple style insertion if _chars.length > 1
          this.insertCharStyleObject(lineIndex, charIndex);
        }
      }
    },

    /**
     * @private
     */
    _insertStyles: function(styles) {
      for (var i = 0, len = styles.length; i < len; i++) {

        var cursorLocation = this.get2DCursorLocation(this.selectionStart + i),
            lineIndex = cursorLocation.lineIndex,
            charIndex = cursorLocation.charIndex;

        this.insertCharStyleObject(lineIndex, charIndex, styles[i]);
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

        var textOnPreviousLine = this._textLines[lineIndex - 1],
            newCharIndexOnPrevLine = textOnPreviousLine
              ? textOnPreviousLine.length
              : 0;

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
