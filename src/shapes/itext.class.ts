//@ts-nocheck
(function(global) {
  var fabric = global.fabric;
  /**
   * IText class (introduced in <b>v1.4</b>) Events are also fired with "text:"
   * prefix when observing canvas.
   * @class fabric.IText
   * @extends fabric.Text
   * @mixes fabric.Observable
   *
   * @fires changed
   * @fires selection:changed
   * @fires editing:entered
   * @fires editing:exited
   * @fires dragstart
   * @fires drag drag event firing on the drag source
   * @fires dragend
   * @fires copy
   * @fires cut
   * @fires paste
   *
   * @return {fabric.IText} thisArg
   * @see {@link fabric.IText#initialize} for constructor definition
   *
   * <p>Supported key combinations:</p>
   * <pre>
   *   Move cursor:                    left, right, up, down
   *   Select character:               shift + left, shift + right
   *   Select text vertically:         shift + up, shift + down
   *   Move cursor by word:            alt + left, alt + right
   *   Select words:                   shift + alt + left, shift + alt + right
   *   Move cursor to line start/end:  cmd + left, cmd + right or home, end
   *   Select till start/end of line:  cmd + shift + left, cmd + shift + right or shift + home, shift + end
   *   Jump to start/end of text:      cmd + up, cmd + down
   *   Select till start/end of text:  cmd + shift + up, cmd + shift + down or shift + pgUp, shift + pgDown
   *   Delete character:               backspace
   *   Delete word:                    alt + backspace
   *   Delete line:                    cmd + backspace
   *   Forward delete:                 delete
   *   Copy text:                      ctrl/cmd + c
   *   Paste text:                     ctrl/cmd + v
   *   Cut text:                       ctrl/cmd + x
   *   Select entire text:             ctrl/cmd + a
   *   Quit editing                    tab or esc
   * </pre>
   *
   * <p>Supported mouse/touch combination</p>
   * <pre>
   *   Position cursor:                click/touch
   *   Create selection:               click/touch & drag
   *   Create selection:               click & shift + click
   *   Select word:                    double click
   *   Select line:                    triple click
   * </pre>
   */
  fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, /** @lends fabric.IText.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'i-text',

    /**
     * Index where text selection starts (or where cursor is when there is no selection)
     * @type Number
     * @default
     */
    selectionStart: 0,

    /**
     * Index where text selection ends
     * @type Number
     * @default
     */
    selectionEnd: 0,

    /**
     * Color of text selection
     * @type String
     * @default
     */
    selectionColor: 'rgba(17,119,255,0.3)',

    /**
     * Indicates whether text is in editing mode
     * @type Boolean
     * @default
     */
    isEditing: false,

    /**
     * Indicates whether a text can be edited
     * @type Boolean
     * @default
     */
    editable: true,

    /**
     * Border color of text object while it's in editing mode
     * @type String
     * @default
     */
    editingBorderColor: 'rgba(102,153,255,0.25)',

    /**
     * Width of cursor (in px)
     * @type Number
     * @default
     */
    cursorWidth: 2,

    /**
     * Color of text cursor color in editing mode.
     * if not set (default) will take color from the text.
     * if set to a color value that fabric can understand, it will
     * be used instead of the color of the text at the current position.
     * @type String
     * @default
     */
    cursorColor: '',

    /**
     * Delay between cursor blink (in ms)
     * @type Number
     * @default
     */
    cursorDelay: 1000,

    /**
     * Duration of cursor fadein (in ms)
     * @type Number
     * @default
     */
    cursorDuration: 600,

    /**
     * Indicates whether internal text char widths can be cached
     * @type Boolean
     * @default
     */
    caching: true,

    /**
     * DOM container to append the hiddenTextarea.
     * An alternative to attaching to the document.body.
     * Useful to reduce laggish redraw of the full document.body tree and
     * also with modals event capturing that won't let the textarea take focus.
     * @type HTMLElement
     * @default
     */
    hiddenTextareaContainer: null,

    /**
     * @private
     */
    _reSpace: /\s|\n/,

    /**
     * @private
     */
    _currentCursorOpacity: 1,

    /**
     * @private
     */
    _selectionDirection: null,

    /**
     * Helps determining when the text is in composition, so that the cursor
     * rendering is altered.
     */
    inCompositionMode: false,

    /**
     * Constructor
     * @param {String} text Text string
     * @param {Object} [options] Options object
     * @return {fabric.IText} thisArg
     */
    initialize: function(text, options) {
      this.callSuper('initialize', text, options);
      this.initBehavior();
    },

    /**
     * While editing handle differently
     * @private
     * @param {string} key
     * @param {*} value
     */
    _set: function (key, value) {
      if (this.isEditing && this._savedProps && key in this._savedProps) {
        this._savedProps[key] = value;
      }
      else {
        this.callSuper('_set', key, value);
      }
    },

    /**
     * Sets selection start (left boundary of a selection)
     * @param {Number} index Index to set selection start to
     */
    setSelectionStart: function(index) {
      index = Math.max(index, 0);
      this._updateAndFire('selectionStart', index);
    },

    /**
     * Sets selection end (right boundary of a selection)
     * @param {Number} index Index to set selection end to
     */
    setSelectionEnd: function(index) {
      index = Math.min(index, this.text.length);
      this._updateAndFire('selectionEnd', index);
    },

    /**
     * @private
     * @param {String} property 'selectionStart' or 'selectionEnd'
     * @param {Number} index new position of property
     */
    _updateAndFire: function(property, index) {
      if (this[property] !== index) {
        this._fireSelectionChanged();
        this[property] = index;
      }
      this._updateTextarea();
    },

    /**
     * Fires the even of selection changed
     * @private
     */
    _fireSelectionChanged: function() {
      this.fire('selection:changed');
      this.canvas && this.canvas.fire('text:selection:changed', { target: this });
    },

    /**
     * Initialize text dimensions. Render all text on given context
     * or on a offscreen canvas to get the text width with measureText.
     * Updates this.width and this.height with the proper values.
     * Does not return dimensions.
     * @private
     */
    initDimensions: function() {
      this.isEditing && this.initDelayedCursor();
      this.clearContextTop();
      this.callSuper('initDimensions');
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    render: function (ctx) {
      this.clearContextTop();
      this.callSuper('render', ctx);
      // clear the cursorOffsetCache, so we ensure to calculate once per renderCursor
      // the correct position but not at every cursor animation.
      this.cursorOffsetCache = { };
      this.renderCursorOrSelection();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      this.callSuper('_render', ctx);
    },

    /**
     * Renders cursor or selection (depending on what exists)
     * it does on the contextTop. If contextTop is not available, do nothing.
     */
    renderCursorOrSelection: function() {
      if (!this.isEditing) {
        return;
      }
      var ctx = this.clearContextTop(true);
      if (!ctx) {
        return;
      }
      var boundaries = this._getCursorBoundaries();
      if (this.selectionStart === this.selectionEnd) {
        this.renderCursor(ctx, boundaries);
      }
      else {
        this.renderSelection(ctx, boundaries);
      }
      ctx.restore();
    },

    /**
     * Renders cursor on context Top, outside the animation cycle, on request
     * Used for the drag/drop effect.
     * If contextTop is not available, do nothing.
     */
    renderCursorAt: function(selectionStart) {
      var boundaries = this._getCursorBoundaries(selectionStart, true);
      this._renderCursor(this.canvas.contextTop, boundaries, selectionStart);
    },

    /**
     * Returns cursor boundaries (left, top, leftOffset, topOffset)
     * left/top are left/top of entire text box
     * leftOffset/topOffset are offset from that left/top point of a text box
     * @private
     * @param {number} [index] index from start
     * @param {boolean} [skipCaching]
     */
    _getCursorBoundaries: function (index, skipCaching) {
      if (typeof index === 'undefined') {
        index = this.selectionStart;
      }
      var left = this._getLeftOffset(),
          top = this._getTopOffset(),
          offsets = this._getCursorBoundariesOffsets(index, skipCaching);
      return {
        left: left,
        top: top,
        leftOffset: offsets.left,
        topOffset: offsets.top
      };
    },

    /**
     * Caches and returns cursor left/top offset relative to instance's center point
     * @private
     * @param {number} index index from start
     * @param {boolean} [skipCaching]
     */
    _getCursorBoundariesOffsets: function (index, skipCaching) {
      if (skipCaching) {
        return this.__getCursorBoundariesOffsets(index);
      }
      if (this.cursorOffsetCache && 'top' in this.cursorOffsetCache) {
        return this.cursorOffsetCache;
      }
      return this.cursorOffsetCache = this.__getCursorBoundariesOffsets(index);
    },

    /**
     * Calcualtes cursor left/top offset relative to instance's center point
     * @private
     * @param {number} index index from start
     */
    __getCursorBoundariesOffsets: function (index) {
      var lineLeftOffset,
          lineIndex,
          charIndex,
          topOffset = 0,
          leftOffset = 0,
          boundaries,
          cursorPosition = this.get2DCursorLocation(index);
      charIndex = cursorPosition.charIndex;
      lineIndex = cursorPosition.lineIndex;
      for (var i = 0; i < lineIndex; i++) {
        topOffset += this.getHeightOfLine(i);
      }
      lineLeftOffset = this._getLineLeftOffset(lineIndex);
      var bound = this.__charBounds[lineIndex][charIndex];
      bound && (leftOffset = bound.left);
      if (this.charSpacing !== 0 && charIndex === this._textLines[lineIndex].length) {
        leftOffset -= this._getWidthOfCharSpacing();
      }
      boundaries = {
        top: topOffset,
        left: lineLeftOffset + (leftOffset > 0 ? leftOffset : 0),
      };
      if (this.direction === 'rtl') {
        if (this.textAlign === 'right' || this.textAlign === 'justify' || this.textAlign === 'justify-right') {
          boundaries.left *= -1;
        }
        else if (this.textAlign === 'left' || this.textAlign === 'justify-left') {
          boundaries.left = lineLeftOffset - (leftOffset > 0 ? leftOffset : 0);
        }
        else if (this.textAlign === 'center' || this.textAlign === 'justify-center') {
          boundaries.left = lineLeftOffset - (leftOffset > 0 ? leftOffset : 0);
        }
      }
      return boundaries;
    },

    /**
     * Renders cursor
     * @param {Object} boundaries
     * @param {CanvasRenderingContext2D} ctx transformed context to draw on
     */
    renderCursor: function(ctx, boundaries) {
      this._renderCursor(ctx, boundaries, this.selectionStart);
    },

    _renderCursor: function(ctx, boundaries, selectionStart) {
      var cursorLocation = this.get2DCursorLocation(selectionStart),
          lineIndex = cursorLocation.lineIndex,
          charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
          charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
          multiplier = this.scaleX * this.canvas.getZoom(),
          cursorWidth = this.cursorWidth / multiplier,
          topOffset = boundaries.topOffset,
          dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY');
      topOffset += (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight
        - charHeight * (1 - this._fontSizeFraction);

      if (this.inCompositionMode) {
        // TODO: investigate why there isn't a return inside the if,
        // and why can't happe top of the function
        this.renderSelection(ctx, boundaries);
      }
      ctx.fillStyle = this.cursorColor || this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
      ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
      ctx.fillRect(
        boundaries.left + boundaries.leftOffset - cursorWidth / 2,
        topOffset + boundaries.top + dy,
        cursorWidth,
        charHeight);
    },

    /**
     * Renders text selection
     * @param {Object} boundaries Object with left/top/leftOffset/topOffset
     * @param {CanvasRenderingContext2D} ctx transformed context to draw on
     */
    renderSelection: function (ctx, boundaries) {
      var selection = {
        selectionStart: this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart,
        selectionEnd: this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd
      };
      this._renderSelection(ctx, selection, boundaries);
    },

    /**
     * Renders drag start text selection
     */
    renderDragSourceEffect: function () {
      if (this.__isDragging && this.__dragStartSelection && this.__dragStartSelection) {
        this._renderSelection(
          this.canvas.contextTop,
          this.__dragStartSelection,
          this._getCursorBoundaries(this.__dragStartSelection.selectionStart, true)
        );
      }
    },

    renderDropTargetEffect: function(e) {
      var dragSelection = this.getSelectionStartFromPointer(e);
      this.renderCursorAt(dragSelection);
    },

    /**
     * Renders text selection
     * @private
     * @param {{ selectionStart: number, selectionEnd: number }} selection
     * @param {Object} boundaries Object with left/top/leftOffset/topOffset
     * @param {CanvasRenderingContext2D} ctx transformed context to draw on
     */
    _renderSelection: function (ctx, selection, boundaries) {
      var selectionStart = selection.selectionStart,
          selectionEnd = selection.selectionEnd,
          isJustify = this.textAlign.indexOf('justify') !== -1,
          start = this.get2DCursorLocation(selectionStart),
          end = this.get2DCursorLocation(selectionEnd),
          startLine = start.lineIndex,
          endLine = end.lineIndex,
          startChar = start.charIndex < 0 ? 0 : start.charIndex,
          endChar = end.charIndex < 0 ? 0 : end.charIndex;

      for (var i = startLine; i <= endLine; i++) {
        var lineOffset = this._getLineLeftOffset(i) || 0,
            lineHeight = this.getHeightOfLine(i),
            realLineHeight = 0, boxStart = 0, boxEnd = 0;

        if (i === startLine) {
          boxStart = this.__charBounds[startLine][startChar].left;
        }
        if (i >= startLine && i < endLine) {
          boxEnd = isJustify && !this.isEndOfWrapping(i) ? this.width : this.getLineWidth(i) || 5; // WTF is this 5?
        }
        else if (i === endLine) {
          if (endChar === 0) {
            boxEnd = this.__charBounds[endLine][endChar].left;
          }
          else {
            var charSpacing = this._getWidthOfCharSpacing();
            boxEnd = this.__charBounds[endLine][endChar - 1].left
              + this.__charBounds[endLine][endChar - 1].width - charSpacing;
          }
        }
        realLineHeight = lineHeight;
        if (this.lineHeight < 1 || (i === endLine && this.lineHeight > 1)) {
          lineHeight /= this.lineHeight;
        }
        var drawStart = boundaries.left + lineOffset + boxStart,
            drawWidth = boxEnd - boxStart,
            drawHeight = lineHeight, extraTop = 0;
        if (this.inCompositionMode) {
          ctx.fillStyle = this.compositionColor || 'black';
          drawHeight = 1;
          extraTop = lineHeight;
        }
        else {
          ctx.fillStyle = this.selectionColor;
        }
        if (this.direction === 'rtl') {
          if (this.textAlign === 'right' || this.textAlign === 'justify' || this.textAlign === 'justify-right') {
            drawStart = this.width - drawStart - drawWidth;
          }
          else if (this.textAlign === 'left' || this.textAlign === 'justify-left') {
            drawStart = boundaries.left + lineOffset - boxEnd;
          }
          else if (this.textAlign === 'center' || this.textAlign === 'justify-center') {
            drawStart = boundaries.left + lineOffset - boxEnd;
          }
        }
        ctx.fillRect(
          drawStart,
          boundaries.top + boundaries.topOffset + extraTop,
          drawWidth,
          drawHeight);
        boundaries.topOffset += realLineHeight;
      }
    },

    /**
     * High level function to know the height of the cursor.
     * the currentChar is the one that precedes the cursor
     * Returns fontSize of char at the current cursor
     * Unused from the library, is for the end user
     * @return {Number} Character font size
     */
    getCurrentCharFontSize: function() {
      var cp = this._getCurrentCharIndex();
      return this.getValueOfPropertyAt(cp.l, cp.c, 'fontSize');
    },

    /**
     * High level function to know the color of the cursor.
     * the currentChar is the one that precedes the cursor
     * Returns color (fill) of char at the current cursor
     * if the text object has a pattern or gradient for filler, it will return that.
     * Unused by the library, is for the end user
     * @return {String | fabric.Gradient | fabric.Pattern} Character color (fill)
     */
    getCurrentCharColor: function() {
      var cp = this._getCurrentCharIndex();
      return this.getValueOfPropertyAt(cp.l, cp.c, 'fill');
    },

    /**
     * Returns the cursor position for the getCurrent.. functions
     * @private
     */
    _getCurrentCharIndex: function() {
      var cursorPosition = this.get2DCursorLocation(this.selectionStart, true),
          charIndex = cursorPosition.charIndex > 0 ? cursorPosition.charIndex - 1 : 0;
      return { l: cursorPosition.lineIndex, c: charIndex };
    }
  });

  /**
   * Returns fabric.IText instance from an object representation
   * @static
   * @memberOf fabric.IText
   * @param {Object} object Object to create an instance from
   * @returns {Promise<fabric.IText>}
   */
  fabric.IText.fromObject = function(object) {
    var styles = fabric.util.stylesFromArray(object.styles, object.text);
    //copy object to prevent mutation
    var objCopy = Object.assign({}, object, { styles: styles });
    return fabric.Object._fromObject(fabric.IText, objCopy, { extraParam: 'text' });
  };
})(typeof exports !== 'undefined' ? exports : window);
