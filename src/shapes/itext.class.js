(function() {

  var clone = fabric.util.object.clone,
      toFixed = fabric.util.toFixed;

   /**
    * IText class (introduced in <b>v1.4</b>)
    * @class fabric.IText
    * @extends fabric.Text
    * @mixes fabric.Observable
    * @fires text:changed
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
    *   Move cursor to line start/end:  cmd + left, cmd + right
    *   Select till start/end of line:  cmd + shift + left, cmd + shift + right
    *   Jump to start/end of text:      cmd + up, cmd + down
    *   Select till start/end of text:  cmd + shift + up, cmd + shift + down
    *   Delete character:               backspace
    *   Delete word:                    alt + backspace
    *   Delete line:                    cmd + backspace
    *   Forward delete:                 delete
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
     * @type Nubmer
     * @default
     */
    selectionStart: 0,

    /**
     * Index where text selection ends
     * @type Nubmer
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
     * Color of default cursor (when not overwritten by character style)
     * @type String
     * @default
     */
    cursorColor: '#333',

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
     * Object containing character styles
     * (where top-level properties corresponds to line number and 2nd-level properties -- to char number in a line)
     * @type Object
     * @default
     */
    styles: null,

    skipFillStrokeCheck: true,

    /**
     * @private
     */
    _reSpace: /\s|\n/,

    /**
     * @private
     */
    _fontSizeFraction: 4,

    /**
     * @private
     */
    _currentCursorOpacity: 0,

    /**
     * @private
     */
    _selectionDirection: null,

    /**
     * @private
     */
    _abortCursorAnimation: false,

    /**
     * @private
     */
    _charWidthsCache: { },

    /**
     * Constructor
     * @param {String} text Text string
     * @param {Object} [options] Options object
     * @return {fabric.IText} thisArg
     */
    initialize: function(text, options) {
      this.styles = options.styles || { };
      this.callSuper('initialize', text, options);
      this.initBehavior();

      fabric.IText.instances.push(this);
    },

    /**
     * Returns true if object has no styling
     */
    isEmptyStyles: function() {
      if (!this.styles) return true;
      var obj = this.styles;

      for (var p1 in obj) {
        for (var p2 in obj[p1]) {
          /*jshint unused:false */
          for (var p3 in obj[p1][p2]) {
            return false;
          }
        }
      }
      return true;
    },

    /**
     * Sets selection start (left boundary of a selection)
     * @param {Number} index Index to set selection start to
     */
    setSelectionStart: function(index) {
      this.selectionStart = index;
      this.hiddenTextarea && (this.hiddenTextarea.selectionStart = index);
    },

    /**
     * Sets selection end (right boundary of a selection)
     * @param {Number} index Index to set selection end to
     */
    setSelectionEnd: function(index) {
      this.selectionEnd = index;
      this.hiddenTextarea && (this.hiddenTextarea.selectionEnd = index);
    },

    /**
     * Gets style of a current selection/cursor (at the start position)
     * @return {Object} styles Style object at a cursor position
     */
    getSelectionStyles: function() {
      var loc = this.get2DCursorLocation();
      if (this.styles[loc.lineIndex]) {
        return this.styles[loc.lineIndex][loc.charIndex] || { };
      }
      return { };
    },

    /**
     * Sets style of a current selection
     * @param {Object} [styles] Styles object
     * @return {fabric.IText} thisArg
     * @chainable
     */
    setSelectionStyles: function(styles) {
      if (this.selectionStart === this.selectionEnd) {
        this._extendStyles(this.selectionStart, styles);
      }
      else {
        for (var i = this.selectionStart; i < this.selectionEnd; i++) {
          this._extendStyles(i, styles);
        }
      }
      return this;
    },

    /**
     * @private
     */
    _extendStyles: function(index, styles) {
      var loc = this.get2DCursorLocation(index);

      if (!this.styles[loc.lineIndex]) {
        this.styles[loc.lineIndex] = { };
      }
      if (!this.styles[loc.lineIndex][loc.charIndex]) {
        this.styles[loc.lineIndex][loc.charIndex] = { };
      }

      fabric.util.object.extend(this.styles[loc.lineIndex][loc.charIndex], styles);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      this.callSuper('_render', ctx);
      this.isEditing && this.renderCursorOrSelection(ctx);
      this.ctx = ctx;
    },

    /**
     * Renders cursor or selection (depending on what exists)
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    renderCursorOrSelection: function(ctx) {
      if (!this.active) return;

      var chars = this.text.split(''),
          boundaries;

      if (this.selectionStart === this.selectionEnd) {
        boundaries = this.getCursorBoundaries(ctx, chars, 'cursor');
        this.renderCursor(ctx, boundaries);
      }
      else {
        boundaries = this.getCursorBoundaries(ctx, chars, 'selection');
        this.renderSelection(ctx, chars, boundaries);
      }
    },

    /**
     * Returns 2d representation (lineIndex and charIndex) of cursor (or selection start)
     * @param {Number} [selectionStart] Optional index. When not given, current selectionStart is used.
     */
    get2DCursorLocation: function(selectionStart) {
      if (typeof selectionStart === 'undefined') {
        selectionStart = this.selectionStart;
      }
      var textBeforeCursor = this.text.slice(0, selectionStart);
      var linesBeforeCursor = textBeforeCursor.split(this._reNewline);

      return {
        lineIndex: linesBeforeCursor.length - 1,
        charIndex: linesBeforeCursor[linesBeforeCursor.length - 1].length
      };
    },

    /**
     * Returns fontSize of char at the current cursor
     * @param {Number} lineIndex Line index
     * @param {Number} charIndex Char index
     * @return {Number} Character font size
     */
    getCurrentCharFontSize: function(lineIndex, charIndex) {
      return (
        this.styles[lineIndex] &&
        this.styles[lineIndex][charIndex === 0 ? 0 : (charIndex - 1)] &&
        this.styles[lineIndex][charIndex === 0 ? 0 : (charIndex - 1)].fontSize) || this.fontSize;
    },

    /**
     * Returns color (fill) of char at the current cursor
     * @param {Number} lineIndex Line index
     * @param {Number} charIndex Char index
     * @return {String} Character color (fill)
     */
    getCurrentCharColor: function(lineIndex, charIndex) {
      return (
        this.styles[lineIndex] &&
        this.styles[lineIndex][charIndex === 0 ? 0 : (charIndex - 1)] &&
        this.styles[lineIndex][charIndex === 0 ? 0 : (charIndex - 1)].fill) || this.cursorColor;
    },

    /**
     * Returns cursor boundaries (left, top, leftOffset, topOffset)
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} chars Array of characters
     */
    getCursorBoundaries: function(ctx, chars, typeOfBoundaries) {

      var cursorLocation = this.get2DCursorLocation(),
          lineIndex = 0,
          charIndex = 0,
          textLines = this.text.split(this._reNewline),
          widthOfLine,
          lineLeftOffset,
          // caching
          lineWidths = { },
          lineHeights = { },
          lineOffsets = { };

      // left/top are left/top of entire text box
      // leftOffset/topOffset are offset from that left/top point of a text box
      var left = Math.round(this._getLeftOffset());
      var top = -this.height / 2;

      var leftOffset = 0;
      var topOffset = typeOfBoundaries === 'cursor'
        // selection starts at the very top of the line,
        // whereas cursor starts at the padding created by line height
        ? (this._getHeightOfLine(ctx, 0) -
          this.getCurrentCharFontSize(cursorLocation.lineIndex, cursorLocation.charIndex))
        : 0;

      for (var i = 0; i < this.selectionStart; i++) {
        if (chars[i] === '\n') {
          leftOffset = 0;
          var index = lineIndex + (typeOfBoundaries === 'cursor' ? 1 : 0);
          topOffset += lineHeights[index] || (lineHeights[index] = this._getHeightOfLine(ctx, index));

          lineIndex++;
          charIndex = 0;
        }
        else {
          leftOffset += this._getWidthOfChar(ctx, chars[i], lineIndex, charIndex);
          charIndex++;
        }

        widthOfLine = lineWidths[lineIndex] ||
                     (lineWidths[lineIndex] = this._getWidthOfLine(ctx, lineIndex, textLines));

        lineLeftOffset = lineOffsets[lineIndex] ||
                        (lineOffsets[lineIndex] = this._getLineLeftOffset(widthOfLine));
      }

      lineWidths = lineHeights = lineOffsets = null;

      return {
        left: left,
        top: top,
        leftOffset: leftOffset + (lineLeftOffset || 0),
        topOffset: topOffset
      };
    },

    /**
     * Renders cursor
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    renderCursor: function(ctx, boundaries) {
      ctx.save();

      var cursorLocation = this.get2DCursorLocation();
      var lineIndex = cursorLocation.lineIndex;
      var charIndex = cursorLocation.charIndex;

      ctx.fillStyle = this.getCurrentCharColor(lineIndex, charIndex);
      ctx.globalAlpha = this._currentCursorOpacity;

      var charHeight = this.getCurrentCharFontSize(lineIndex, charIndex);

      ctx.fillRect(
        boundaries.left + boundaries.leftOffset,
        boundaries.top + boundaries.topOffset,
        this.cursorWidth,
        charHeight);

      ctx.restore();
    },

    /**
     * Renders text selection
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} chars Array of characters
     * @param {Object} boundaries Object with left/top/leftOffset/topOffset
     */
    renderSelection: function(ctx, chars, boundaries) {
      ctx.save();

      ctx.fillStyle = this.selectionColor;

      var cursorLocation = this.get2DCursorLocation();
      var lineIndex = cursorLocation.lineIndex;
      var charIndex = cursorLocation.charIndex;
      var textLines = this.text.split(this._reNewline);
      var origLineIndex = lineIndex;

      for (var i = this.selectionStart; i < this.selectionEnd; i++) {

        if (chars[i] === '\n') {
          boundaries.leftOffset = 0;
          boundaries.topOffset += this._getHeightOfLine(ctx, lineIndex);
          lineIndex++;
          charIndex = 0;
        }
        else if (i !== this.text.length) {

          var charWidth = this._getWidthOfChar(ctx, chars[i], lineIndex, charIndex);
          var lineOffset = this._getLineLeftOffset(this._getWidthOfLine(ctx, lineIndex, textLines)) || 0;

          if (lineIndex === origLineIndex) {
            // only offset the line if we're rendering selection of 2nd, 3rd, etc. line
            lineOffset = 0;
          }

          ctx.fillRect(
            boundaries.left + boundaries.leftOffset + lineOffset,
            boundaries.top + boundaries.topOffset,
            charWidth,
            this._getHeightOfLine(ctx, lineIndex));

          boundaries.leftOffset += charWidth;
          charIndex++;
        }
      }
      ctx.restore();
    },

    /**
     * @private
     * @param {String} method
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderChars: function(method, ctx, line, left, top, lineIndex) {

      if (this.isEmptyStyles()) {
        return this._renderCharsFast(method, ctx, line, left, top);
      }

      this.skipTextAlign = true;

      // set proper box offset
      left -= this.textAlign === 'center'
        ? (this.width / 2)
        : (this.textAlign === 'right')
          ? this.width
          : 0;

      // set proper line offset
      var textLines = this.text.split(this._reNewline);
      var lineWidth = this._getWidthOfLine(ctx, lineIndex, textLines);
      var lineHeight = this._getHeightOfLine(ctx, lineIndex, textLines);
      var lineLeftOffset = this._getLineLeftOffset(lineWidth);
      var chars = line.split('');

      left += lineLeftOffset || 0;

      ctx.save();
      for (var i = 0, len = chars.length; i < len; i++) {
        this._renderChar(method, ctx, lineIndex, i, chars[i], left, top, lineHeight);
      }
      ctx.restore();
    },

    /**
     * @private
     * @param {String} method
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line
     */
    _renderCharsFast: function(method, ctx, line, left, top) {
      this.skipTextAlign = false;

      if (method === 'fillText' && this.fill) {
        this.callSuper('_renderChars', method, ctx, line, left, top);
      }
      if (method === 'strokeText' && this.stroke) {
        this.callSuper('_renderChars', method, ctx, line, left, top);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderChar: function(method, ctx, lineIndex, i, _char, left, top, lineHeight) {
      var decl, charWidth;

      if (this.styles && this.styles[lineIndex] && (decl = this.styles[lineIndex][i])) {

        var shouldStroke = decl.stroke || this.stroke;
        var shouldFill = decl.fill || this.fill;

        ctx.save();
        charWidth = this._applyCharStylesGetWidth(ctx, _char, lineIndex, i, decl);

        if (shouldFill) {
          ctx.fillText(_char, left, top);
        }
        if (shouldStroke) {
          ctx.strokeText(_char, left, top);
        }

        this._renderCharDecoration(ctx, decl, left, top, charWidth, lineHeight);
        ctx.restore();

        ctx.translate(charWidth, 0);
      }
      else {
        if (method === 'strokeText' && this.stroke) {
          ctx[method](_char, left, top);
        }
        if (method === 'fillText' && this.fill) {
          ctx[method](_char, left, top);
        }
        charWidth = this._applyCharStylesGetWidth(ctx, _char, lineIndex, i);
        this._renderCharDecoration(ctx, null, left, top, charWidth, lineHeight);

        ctx.translate(ctx.measureText(_char).width, 0);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderCharDecoration: function(ctx, styleDeclaration, left, top, charWidth, lineHeight) {
      var textDecoration = styleDeclaration
        ? (styleDeclaration.textDecoration || this.textDecoration)
        : this.textDecoration;

      if (!textDecoration) return;

      if (textDecoration.indexOf('underline') > -1) {

        this._renderCharDecorationAtOffset(
          ctx,
          left,
          top + (this.fontSize / this._fontSizeFraction),
          charWidth,
          0
        );
      }
      if (textDecoration.indexOf('line-through') > -1) {
        this._renderCharDecorationAtOffset(
          ctx,
          left,
          top + (this.fontSize / this._fontSizeFraction),
          charWidth,
          (lineHeight / this._fontSizeFraction)
        );
      }
      if (textDecoration.indexOf('overline') > -1) {
        this._renderCharDecorationAtOffset(
          ctx,
          left,
          top,
          charWidth,
          lineHeight - (this.fontSize / this._fontSizeFraction)
        );
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderCharDecorationAtOffset: function(ctx, left, top, charWidth, offset) {
      ctx.fillRect(left, top - offset, charWidth, 1);
    },

    /**
     * @private
     * @param {String} method
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line
     */
    _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
      // to "cancel" this.fontSize subtraction in fabric.Text#_renderTextLine
      top += this.fontSize / 4;
      this.callSuper('_renderTextLine', method, ctx, line, left, top, lineIndex);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines
     */
    _renderTextDecoration: function(ctx, textLines) {
      if (this.isEmptyStyles()) {
        return this.callSuper('_renderTextDecoration', ctx, textLines);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextLinesBackground: function(ctx, textLines) {
      if (!this.textBackgroundColor && !this.styles) return;

      ctx.save();

      if (this.textBackgroundColor) {
        ctx.fillStyle = this.textBackgroundColor;
      }

      var lineHeights = 0;
      var fractionOfFontSize = this.fontSize / this._fontSizeFraction;

      for (var i = 0, len = textLines.length; i < len; i++) {

        var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
        if (textLines[i] === '') {
          lineHeights += heightOfLine;
          continue;
        }

        var lineWidth = this._getWidthOfLine(ctx, i, textLines);
        var lineLeftOffset = this._getLineLeftOffset(lineWidth);

        if (this.textBackgroundColor) {
          ctx.fillStyle = this.textBackgroundColor;

          ctx.fillRect(
            this._getLeftOffset() + lineLeftOffset,
            this._getTopOffset() + lineHeights + fractionOfFontSize,
            lineWidth,
            heightOfLine
          );
        }
        if (this.styles[i]) {
          for (var j = 0, jlen = textLines[i].length; j < jlen; j++) {
            if (this.styles[i] && this.styles[i][j] && this.styles[i][j].textBackgroundColor) {

              var _char = textLines[i][j];

              ctx.fillStyle = this.styles[i][j].textBackgroundColor;

              ctx.fillRect(
                this._getLeftOffset() + lineLeftOffset + this._getWidthOfCharsAt(ctx, i, j, textLines),
                this._getTopOffset() + lineHeights + fractionOfFontSize,
                this._getWidthOfChar(ctx, _char, i, j, textLines) + 1,
                heightOfLine
              );
            }
          }
        }
        lineHeights += heightOfLine;
      }
      ctx.restore();
    },

    /**
     * @private
     */
    _getCacheProp: function(_char, styleDeclaration) {
      return _char +

             styleDeclaration.fontFamily +
             styleDeclaration.fontSize +
             styleDeclaration.fontWeight +
             styleDeclaration.fontStyle +

             styleDeclaration.shadow;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} _char
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @param {Object} [decl]
     */
    _applyCharStylesGetWidth: function(ctx, _char, lineIndex, charIndex, decl) {
      var styleDeclaration = decl || (this.styles[lineIndex] && this.styles[lineIndex][charIndex]);

      if (styleDeclaration) {
        // cloning so that original style object is not polluted with following font declarations
        styleDeclaration = clone(styleDeclaration);
      }
      else {
        styleDeclaration = { };
      }

      this._applyFontStyles(styleDeclaration);

      var cacheProp = this._getCacheProp(_char, styleDeclaration);

      // short-circuit if no styles
      if (this.isEmptyStyles() && this._charWidthsCache[cacheProp]) {
        return this._charWidthsCache[cacheProp];
      }

      if (typeof styleDeclaration.shadow === 'string') {
        styleDeclaration.shadow = new fabric.Shadow(styleDeclaration.shadow);
      }

      var fill = styleDeclaration.fill || this.fill;
      ctx.fillStyle = fill.toLive
        ? fill.toLive(ctx)
        : fill;

      if (styleDeclaration.stroke) {
        ctx.strokeStyle = (styleDeclaration.stroke && styleDeclaration.stroke.toLive)
          ? styleDeclaration.stroke.toLive(ctx)
          : styleDeclaration.stroke;
      }

      ctx.lineWidth = styleDeclaration.strokeWidth || this.strokeWidth;
      ctx.font = this._getFontDeclaration.call(styleDeclaration);
      this._setShadow.call(styleDeclaration, ctx);

      if (!this._charWidthsCache[cacheProp]) {
        this._charWidthsCache[cacheProp] = ctx.measureText(_char).width;
      }
      return this._charWidthsCache[cacheProp];
    },

    /**
     * @private
     * @param {Object} styleDeclaration
     */
    _applyFontStyles: function(styleDeclaration) {
      if (!styleDeclaration.fontFamily) {
        styleDeclaration.fontFamily = this.fontFamily;
      }
      if (!styleDeclaration.fontSize) {
        styleDeclaration.fontSize = this.fontSize;
      }
      if (!styleDeclaration.fontWeight) {
        styleDeclaration.fontWeight = this.fontWeight;
      }
      if (!styleDeclaration.fontStyle) {
        styleDeclaration.fontStyle = this.fontStyle;
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getWidthOfChar: function(ctx, _char, lineIndex, charIndex) {
      ctx.save();
      var width = this._applyCharStylesGetWidth(ctx, _char, lineIndex, charIndex);
      ctx.restore();
      return width;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getHeightOfChar: function(ctx, _char, lineIndex, charIndex) {
      if (this.styles[lineIndex] && this.styles[lineIndex][charIndex]) {
        return this.styles[lineIndex][charIndex].fontSize || this.fontSize;
      }
      return this.fontSize;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getWidthOfCharAt: function(ctx, lineIndex, charIndex, lines) {
      lines = lines || this.text.split(this._reNewline);
      var _char = lines[lineIndex].split('')[charIndex];
      return this._getWidthOfChar(ctx, _char, lineIndex, charIndex);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getHeightOfCharAt: function(ctx, lineIndex, charIndex, lines) {
      lines = lines || this.text.split(this._reNewline);
      var _char = lines[lineIndex].split('')[charIndex];
      return this._getHeightOfChar(ctx, _char, lineIndex, charIndex);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getWidthOfCharsAt: function(ctx, lineIndex, charIndex, lines) {
      var width = 0;
      for (var i = 0; i < charIndex; i++) {
        width += this._getWidthOfCharAt(ctx, lineIndex, i, lines);
      }
      return width;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getWidthOfLine: function(ctx, lineIndex, textLines) {
      // if (!this.styles[lineIndex]) {
      //   return this.callSuper('_getLineWidth', ctx, textLines[lineIndex]);
      // }
      return this._getWidthOfCharsAt(ctx, lineIndex, textLines[lineIndex].length, textLines);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getTextWidth: function(ctx, textLines) {

      if (this.isEmptyStyles()) {
        return this.callSuper('_getTextWidth', ctx, textLines);
      }

      var maxWidth = this._getWidthOfLine(ctx, 0, textLines);

      for (var i = 1, len = textLines.length; i < len; i++) {
        var currentLineWidth = this._getWidthOfLine(ctx, i, textLines);
        if (currentLineWidth > maxWidth) {
          maxWidth = currentLineWidth;
        }
      }
      return maxWidth;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getHeightOfLine: function(ctx, lineIndex, textLines) {

      textLines = textLines || this.text.split(this._reNewline);

      var maxHeight = this._getHeightOfChar(ctx, textLines[lineIndex][0], lineIndex, 0);

      var line = textLines[lineIndex];
      var chars = line.split('');

      for (var i = 1, len = chars.length; i < len; i++) {
        var currentCharHeight = this._getHeightOfChar(ctx, chars[i], lineIndex, i);
        if (currentCharHeight > maxHeight) {
          maxHeight = currentCharHeight;
        }
      }

      return maxHeight * this.lineHeight;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getTextHeight: function(ctx, textLines) {
      var height = 0;
      for (var i = 0, len = textLines.length; i < len; i++) {
        height += this._getHeightOfLine(ctx, i, textLines);
      }
      return height;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getTopOffset: function() {
      var topOffset = fabric.Text.prototype._getTopOffset.call(this);
      return topOffset - (this.fontSize / this._fontSizeFraction);
    },

    /**
     * Returns object representation of an instance
     * @methd toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude), {
        styles: clone(this.styles)
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @return {String} svg representation of an instance
     */
    //toSVG: function(reviver) {
      //if (this.isEmptyStyles()) {
      //  return this.callSuper('toSVG', reviver);
      //}

      // TODO: add support for styled text SVG output
    //}

    /**
     * @private
     */
    _setSVGTextLineText: function(textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier, textBgRects) {
      if (!this.styles[lineIndex]) {
        this.callSuper('_setSVGTextLineText',
          textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier);
      }
      else {
        this._setSVGTextLineChars(
          textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier, textBgRects);
      }
    },

    /**
     * @private
     */
    _setSVGTextLineChars: function(textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier, textBgRects) {

      var yProp = lineIndex === 0 || this.useNative ? 'y' : 'dy';
      var chars = textLine.split('');
      var charOffset = 0;
      var lineLeftOffset = (this._boundaries && this._boundaries[lineIndex])
                            ? toFixed(this._boundaries[lineIndex].left, 2)
                            : 0;

      var heightOfLine = this._getHeightOfLine(this.ctx, lineIndex);

      var lineTopOffset = 0;
      for (var j = 0; j <= lineIndex; j++) {
        lineTopOffset += this._getHeightOfLine(this.ctx, j);
      }
      lineTopOffset -= this.height / 2;

      for (var i = 0, len = chars.length; i < len; i++) {
        var styleDecl = this.styles[lineIndex][i] || { };

        var fillStyles = this.getSvgStyles.call(fabric.util.object.extend({
          visible: true,
          fill: this.fill,
          stroke: this.stroke,
          type: 'text'
        }, styleDecl));

        textSpans.push(
          '<tspan x="', lineLeftOffset + charOffset, '" ',
            yProp, '="', lineTopOffset, '" ',

            (styleDecl.fontFamily ? 'font-family="' + styleDecl.fontFamily.replace(/"/g,'\'') + '" ': ''),
            (styleDecl.fontSize ? 'font-size="' + styleDecl.fontSize + '" ': ''),
            (styleDecl.fontStyle ? 'font-style="' + styleDecl.fontStyle + '" ': ''),
            (styleDecl.fontWeight ? 'font-weight="' + styleDecl.fontWeight + '" ': ''),
            (styleDecl.textDecoration ? 'text-decoration="' + styleDecl.textDecoration + '" ': ''),
            'style="', fillStyles, '">',

            fabric.util.string.escapeXml(chars[i]),
          '</tspan>'
        );

        var charWidth = this._getWidthOfChar(this.ctx, chars[i], lineIndex, i);

        if (styleDecl.textBackgroundColor) {
          textBgRects.push(
            '<rect fill="', styleDecl.textBackgroundColor,
            '" transform="translate(',
              -this.width / 2, ' ',
              -this.height + heightOfLine, ')',
            '" x="', lineLeftOffset + charOffset,
            '" y="', lineTopOffset + heightOfLine,
            '" width="', charWidth,
            '" height="', heightOfLine,
            '"></rect>'
          );
        }

        charOffset += charWidth;
      }
    }
    /* _TO_SVG_END_ */
  });

  /**
   * Returns fabric.IText instance from an object representation
   * @static
   * @memberOf fabric.IText
   * @param {Object} object Object to create an instance from
   * @return {fabric.IText} instance of fabric.IText
   */
  fabric.IText.fromObject = function(object) {
    return new fabric.IText(object.text, clone(object));
  };

  fabric.IText.instances = [ ];

})();
