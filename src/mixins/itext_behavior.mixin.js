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
      this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    },

    onDeselect: function() {
      this.isEditing && this.exitEditing();
      this.selected = false;
      this.callSuper('onDeselect');
    },

    /**
     * Initializes "added" event handler
     */
    initAddedHandler: function() {
      var _this = this;
      this.on('added', function() {
        var canvas = _this.canvas;
        if (canvas) {
          if (!canvas._hasITextHandlers) {
            canvas._hasITextHandlers = true;
            _this._initCanvasHandlers(canvas);
          }
          canvas._iTextInstances = canvas._iTextInstances || [];
          canvas._iTextInstances.push(_this);
        }
      });
    },

    initRemovedHandler: function() {
      var _this = this;
      this.on('removed', function() {
        var canvas = _this.canvas;
        if (canvas) {
          canvas._iTextInstances = canvas._iTextInstances || [];
          fabric.util.removeFromArray(canvas._iTextInstances, _this);
          if (canvas._iTextInstances.length === 0) {
            canvas._hasITextHandlers = false;
            _this._removeCanvasHandlers(canvas);
          }
        }
      });
    },

    /**
     * register canvas event to manage exiting on other instances
     * @private
     */
    _initCanvasHandlers: function(canvas) {
      canvas._mouseUpITextHandler = (function() {
        if (canvas._iTextInstances) {
          canvas._iTextInstances.forEach(function(obj) {
            obj.__isMousedown = false;
          });
        }
      }).bind(this);
      canvas.on('mouse:up', canvas._mouseUpITextHandler);
    },

    /**
     * remove canvas event to manage exiting on other instances
     * @private
     */
    _removeCanvasHandlers: function(canvas) {
      canvas.off('mouse:up', canvas._mouseUpITextHandler);
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
          // we do not want to animate a selection, only cursor
          if (obj.canvas && obj.selectionStart === obj.selectionEnd) {
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

      this.abortCursorAnimation();
      this._currentCursorOpacity = 1;
      this._cursorTimeout2 = setTimeout(function() {
        _this._tick();
      }, delay);
    },

    /**
     * Aborts cursor animation and clears all timeouts
     */
    abortCursorAnimation: function() {
      var shouldClear = this._currentTickState || this._currentTickCompleteState;
      this._currentTickState && this._currentTickState.abort();
      this._currentTickCompleteState && this._currentTickCompleteState.abort();

      clearTimeout(this._cursorTimeout1);
      clearTimeout(this._cursorTimeout2);

      this._currentCursorOpacity = 0;
      // to clear just itext area we need to transform the context
      // it may not be worth it
      if (shouldClear) {
        this.canvas && this.canvas.clearContext(this.canvas.contextTop || this.ctx);
      }

    },

    /**
     * Selects entire text
     */
    selectAll: function() {
      this.selectionStart = 0;
      this.selectionEnd = this.text.length;
      this._fireSelectionChanged();
      this._updateTextarea();
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
          numNewLines  = 0;

      for (var i = 0, len = selectedText.length; i < len; i++) {
        if (selectedText[i] === '\n') {
          numNewLines++;
        }
      }
      return numNewLines;
    },

    /**
     * Finds index corresponding to beginning or end of a word
     * @param {Number} selectionStart Index of a character
     * @param {Number} direction 1 or -1
     * @return {Number} Index of the beginning or end of a word
     */
    searchWordBoundary: function(selectionStart, direction) {
      var index     = this._reSpace.test(this.text.charAt(selectionStart)) ? selectionStart - 1 : selectionStart,
          _char     = this.text.charAt(index),
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
      selectionStart = selectionStart || this.selectionStart;
      var newSelectionStart = this.searchWordBoundary(selectionStart, -1), /* search backwards */
          newSelectionEnd = this.searchWordBoundary(selectionStart, 1); /* search forward */

      this.selectionStart = newSelectionStart;
      this.selectionEnd = newSelectionEnd;
      this._fireSelectionChanged();
      this._updateTextarea();
      this.renderCursorOrSelection();
    },

    /**
     * Selects a line based on the index
     * @param {Number} selectionStart Index of a character
     */
    selectLine: function(selectionStart) {
      selectionStart = selectionStart || this.selectionStart;
      var newSelectionStart = this.findLineBoundaryLeft(selectionStart),
          newSelectionEnd = this.findLineBoundaryRight(selectionStart);

      this.selectionStart = newSelectionStart;
      this.selectionEnd = newSelectionEnd;
      this._fireSelectionChanged();
      this._updateTextarea();
    },

    /**
     * Enters editing state
     * @return {fabric.IText} thisArg
     * @chainable
     */
    enterEditing: function(e) {
      if (this.isEditing || !this.editable) {
        return;
      }

      if (this.canvas) {
        this.exitEditingOnOthers(this.canvas);
      }

      this.isEditing = true;
      this.selected = true;
      this.initHiddenTextarea(e);
      this.hiddenTextarea.focus();
      this._updateTextarea();
      this._saveEditingProps();
      this._setEditingProps();
      this._textBeforeEdit = this.text;

      this._tick();
      this.fire('editing:entered');
      this._fireSelectionChanged();
      if (!this.canvas) {
        return this;
      }
      this.canvas.fire('text:editing:entered', { target: this });
      this.initMouseMoveHandler();
      this.canvas.renderAll();
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
      this.canvas.on('mouse:move', this.mouseMoveHandler);
    },

    /**
     * @private
     */
    mouseMoveHandler: function(options) {
      if (!this.__isMousedown || !this.isEditing) {
        return;
      }

      var newSelectionStart = this.getSelectionStartFromPointer(options.e),
          currentStart = this.selectionStart,
          currentEnd = this.selectionEnd;
      if (
        (newSelectionStart !== this.__selectionStartOnMouseDown || currentStart === currentEnd)
        &&
        (currentStart === newSelectionStart || currentEnd === newSelectionStart)
      ) {
        return;
      }
      if (newSelectionStart > this.__selectionStartOnMouseDown) {
        this.selectionStart = this.__selectionStartOnMouseDown;
        this.selectionEnd = newSelectionStart;
      }
      else {
        this.selectionStart = newSelectionStart;
        this.selectionEnd = this.__selectionStartOnMouseDown;
      }
      if (this.selectionStart !== currentStart || this.selectionEnd !== currentEnd) {
        this.restartCursorIfNeeded();
        this._fireSelectionChanged();
        this._updateTextarea();
        this.renderCursorOrSelection();
      }
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
      if (!this.hiddenTextarea || this.inCompositionMode) {
        return;
      }
      this.cursorOffsetCache = { };
      this.hiddenTextarea.value = this.text;
      this.hiddenTextarea.selectionStart = this.selectionStart;
      this.hiddenTextarea.selectionEnd = this.selectionEnd;
      if (this.selectionStart === this.selectionEnd) {
        var style = this._calcTextareaPosition();
        this.hiddenTextarea.style.left = style.left;
        this.hiddenTextarea.style.top = style.top;
        this.hiddenTextarea.style.fontSize = style.fontSize;
      }
    },

    /**
     * @private
     * @return {Object} style contains style for hiddenTextarea
     */
    _calcTextareaPosition: function() {
      if (!this.canvas) {
        return { x: 1, y: 1 };
      }
      var chars = this.text.split(''),
          boundaries = this._getCursorBoundaries(chars, 'cursor'),
          cursorLocation = this.get2DCursorLocation(),
          lineIndex = cursorLocation.lineIndex,
          charIndex = cursorLocation.charIndex,
          charHeight = this.getCurrentCharFontSize(lineIndex, charIndex),
          leftOffset = boundaries.leftOffset,
          m = this.calcTransformMatrix(),
          p = {
            x: boundaries.left + leftOffset,
            y: boundaries.top + boundaries.topOffset + charHeight
          },
          upperCanvas = this.canvas.upperCanvasEl,
          maxWidth = upperCanvas.width - charHeight,
          maxHeight = upperCanvas.height - charHeight;

      p = fabric.util.transformPoint(p, m);
      p = fabric.util.transformPoint(p, this.canvas.viewportTransform);

      if (p.x < 0) {
        p.x = 0;
      }
      if (p.x > maxWidth) {
        p.x = maxWidth;
      }
      if (p.y < 0) {
        p.y = 0;
      }
      if (p.y > maxHeight) {
        p.y = maxHeight;
      }

      // add canvas offset on document
      p.x += this.canvas._offset.left;
      p.y += this.canvas._offset.top;

      return { left: p.x + 'px', top: p.y + 'px', fontSize: charHeight };
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
      var isTextChanged = (this._textBeforeEdit !== this.text);
      this.selected = false;
      this.isEditing = false;
      this.selectable = true;

      this.selectionEnd = this.selectionStart;

      if (this.hiddenTextarea) {
        this.hiddenTextarea.blur && this.hiddenTextarea.blur();
        this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea);
        this.hiddenTextarea = null;
      }

      this.abortCursorAnimation();
      this._restoreEditingProps();
      this._currentCursorOpacity = 0;

      this.fire('editing:exited');
      isTextChanged && this.fire('modified');
      if (this.canvas) {
        this.canvas.off('mouse:move', this.mouseMoveHandler);
        this.canvas.fire('text:editing:exited', { target: this });
        isTextChanged && this.canvas.fire('object:modified', { target: this });
      }
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
      while (end !== start) {
        this._removeSingleCharAndStyle(start + 1);
        end--;
      }
      this.selectionStart = start;
      this.selectionEnd = start;
    },

    _removeSingleCharAndStyle: function(index) {
      var isBeginningOfLine = this.text[index - 1] === '\n',
          indexStyle        = isBeginningOfLine ? index : index - 1;
      this.removeStyleObject(isBeginningOfLine, indexStyle);
      this.text = this.text.slice(0, index - 1) +
        this.text.slice(index);

      this._textLines = this._splitTextIntoLines();
    },

    /**
     * Inserts characters where cursor is (replacing selection if one exists)
     * @param {String} _chars Characters to insert
     * @param {Boolean} useCopiedStyle use fabric.copiedTextStyle
     */
    insertChars: function(_chars, useCopiedStyle) {
      var style;

      if (this.selectionEnd - this.selectionStart > 1) {
        this._removeCharsFromTo(this.selectionStart, this.selectionEnd);
      }
      //short circuit for block paste
      if (!useCopiedStyle && this.isEmptyStyles()) {
        this.insertChar(_chars, false);
        return;
      }
      for (var i = 0, len = _chars.length; i < len; i++) {
        if (useCopiedStyle) {
          style = fabric.util.object.clone(fabric.copiedTextStyle[i], true);
        }
        this.insertChar(_chars[i], i < len - 1, style);
      }
    },

    /**
     * Inserts a character where cursor is
     * @param {String} _char Characters to insert
     * @param {Boolean} skipUpdate trigger rendering and updates at the end of text insert
     * @param {Object} styleObject Style to be inserted for the new char
     */
    insertChar: function(_char, skipUpdate, styleObject) {
      var isEndOfLine = this.text[this.selectionStart] === '\n';
      this.text = this.text.slice(0, this.selectionStart) +
        _char + this.text.slice(this.selectionEnd);
      this._textLines = this._splitTextIntoLines();
      this.insertStyleObjects(_char, isEndOfLine, styleObject);
      this.selectionStart += _char.length;
      this.selectionEnd = this.selectionStart;
      if (skipUpdate) {
        return;
      }
      this._updateTextarea();
      this.setCoords();
      this._fireSelectionChanged();
      this.fire('changed');
      this.restartCursorIfNeeded();
      if (this.canvas) {
        this.canvas.fire('text:changed', { target: this });
        this.canvas.renderAll();
      }
    },

    restartCursorIfNeeded: function() {
      if (!this._currentTickState || this._currentTickState.isAborted
        || !this._currentTickCompleteState || this._currentTickCompleteState.isAborted
      ) {
        this.initDelayedCursor();
      }
    },

    /**
     * Inserts new style object
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     * @param {Boolean} isEndOfLine True if it's end of line
     */
    insertNewlineStyleObject: function(lineIndex, charIndex, isEndOfLine) {

      this.shiftLineStyles(lineIndex, +1);

      var currentCharStyle = {},
          newLineStyles    = {};

      if (this.styles[lineIndex] && this.styles[lineIndex][charIndex - 1]) {
        currentCharStyle = this.styles[lineIndex][charIndex - 1];
      }

      // if there's nothing after cursor,
      // we clone current char style onto the next (otherwise empty) line
      if (isEndOfLine && currentCharStyle) {
        newLineStyles[0] = clone(currentCharStyle);
        this.styles[lineIndex + 1] = newLineStyles;
      }
      // otherwise we clone styles of all chars
      // after cursor onto the next line, from the beginning
      else {
        var somethingAdded = false;
        for (var index in this.styles[lineIndex]) {
          var numIndex = parseInt(index, 10);
          if (numIndex >= charIndex) {
            somethingAdded = true;
            newLineStyles[numIndex - charIndex] = this.styles[lineIndex][index];
            // remove lines from the previous line since they're on a new line now
            delete this.styles[lineIndex][index];
          }
        }
        somethingAdded && (this.styles[lineIndex + 1] = newLineStyles);
      }
      this._forceClearCache = true;
    },

    /**
     * Inserts style object for a given line/char index
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     * @param {Object} [style] Style object to insert, if given
     */
    insertCharStyleObject: function(lineIndex, charIndex, style) {

      var currentLineStyles       = this.styles[lineIndex],
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

          // only delete the style if there was nothing moved there
          if (!currentLineStylesCloned[numericIndex - 1]) {
            delete currentLineStyles[numericIndex];
          }
        }
      }
      var newStyle = style || clone(currentLineStyles[charIndex - 1]);
      newStyle && (this.styles[lineIndex][charIndex] = newStyle);
      this._forceClearCache = true;
    },

    /**
     * Inserts style object(s)
     * @param {String} _chars Characters at the location where style is inserted
     * @param {Boolean} isEndOfLine True if it's end of line
     * @param {Object} [styleObject] Style to insert
     */
    insertStyleObjects: function(_chars, isEndOfLine, styleObject) {
      // removed shortcircuit over isEmptyStyles

      var cursorLocation = this.get2DCursorLocation(),
          lineIndex      = cursorLocation.lineIndex,
          charIndex      = cursorLocation.charIndex;

      if (!this._getLineStyle(lineIndex)) {
        this._setLineStyle(lineIndex, {});
      }

      if (_chars === '\n') {
        this.insertNewlineStyleObject(lineIndex, charIndex, isEndOfLine);
      }
      else {
        this.insertCharStyleObject(lineIndex, charIndex, styleObject);
      }
    },

    /**
     * Shifts line styles up or down
     * @param {Number} lineIndex Index of a line
     * @param {Number} offset Can be -1 or +1
     */
    shiftLineStyles: function(lineIndex, offset) {
      // shift all line styles by 1 upward or downward
      var clonedStyles = clone(this.styles);
      for (var line in clonedStyles) {
        var numericLine = parseInt(line, 10);
        if (numericLine <= lineIndex) {
          delete clonedStyles[numericLine];
        }
      }
      for (var line in this.styles) {
        var numericLine = parseInt(line, 10);
        if (numericLine > lineIndex) {
          this.styles[numericLine + offset] = clonedStyles[numericLine];
          if (!clonedStyles[numericLine - offset]) {
            delete this.styles[numericLine];
          }
        }
      }
      //TODO: evaluate if delete old style lines with offset -1
    },

    /**
     * Removes style object
     * @param {Boolean} isBeginningOfLine True if cursor is at the beginning of line
     * @param {Number} [index] Optional index. When not given, current selectionStart is used.
     */
    removeStyleObject: function(isBeginningOfLine, index) {

      var cursorLocation = this.get2DCursorLocation(index),
          lineIndex      = cursorLocation.lineIndex,
          charIndex      = cursorLocation.charIndex;

      this._removeStyleObject(isBeginningOfLine, cursorLocation, lineIndex, charIndex);
    },

    _getTextOnPreviousLine: function(lIndex) {
      return this._textLines[lIndex - 1];
    },

    _removeStyleObject: function(isBeginningOfLine, cursorLocation, lineIndex, charIndex) {

      if (isBeginningOfLine) {
        var textOnPreviousLine     = this._getTextOnPreviousLine(cursorLocation.lineIndex),
            newCharIndexOnPrevLine = textOnPreviousLine ? textOnPreviousLine.length : 0;

        if (!this.styles[lineIndex - 1]) {
          this.styles[lineIndex - 1] = {};
        }
        for (charIndex in this.styles[lineIndex]) {
          this.styles[lineIndex - 1][parseInt(charIndex, 10) + newCharIndexOnPrevLine]
            = this.styles[lineIndex][charIndex];
        }
        this.shiftLineStyles(cursorLocation.lineIndex, -1);
      }
      else {
        var currentLineStyles = this.styles[lineIndex];

        if (currentLineStyles) {
          delete currentLineStyles[charIndex];
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
    },

    /**
     * Set the selectionStart and selectionEnd according to the ne postion of cursor
     * mimic the key - mouse navigation when shift is pressed.
     */
    setSelectionStartEndWithShift: function(start, end, newSelection) {
      if (newSelection <= start) {
        if (end === start) {
          this._selectionDirection = 'left';
        }
        else if (this._selectionDirection === 'right') {
          this._selectionDirection = 'left';
          this.selectionEnd = start;
        }
        this.selectionStart = newSelection;
      }
      else if (newSelection > start && newSelection < end) {
        if (this._selectionDirection === 'right') {
          this.selectionEnd = newSelection;
        }
        else {
          this.selectionStart = newSelection;
        }
      }
      else {
        // newSelection is > selection start and end
        if (end === start) {
          this._selectionDirection = 'right';
        }
        else if (this._selectionDirection === 'left') {
          this._selectionDirection = 'right';
          this.selectionStart = end;
        }
        this.selectionEnd = newSelection;
      }
    },

    setSelectionInBoundaries: function() {
      var length = this.text.length;
      if (this.selectionStart > length) {
        this.selectionStart = length;
      }
      else if (this.selectionStart < 0) {
        this.selectionStart = 0;
      }
      if (this.selectionEnd > length) {
        this.selectionEnd = length;
      }
      else if (this.selectionEnd < 0) {
        this.selectionEnd = 0;
      }
    }
  });
})();
