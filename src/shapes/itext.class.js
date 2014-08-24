(function() {

  var clone = fabric.util.object.clone;

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
    *   Move cursor to line start/end:  cmd + left, cmd + right
    *   Select till start/end of line:  cmd + shift + left, cmd + shift + right
    *   Jump to start/end of text:      cmd + up, cmd + down
    *   Select till start/end of text:  cmd + shift + up, cmd + shift + down
    *   Delete character:               backspace
    *   Delete word:                    alt + backspace
    *   Delete line:                    cmd + backspace
    *   Forward delete:                 delete
    *   Copy text:                      ctrl/cmd + c
    *   Paste text:                     ctrl/cmd + v
    *   Cut text:                       ctrl/cmd + x
    *   Select entire text:             ctrl/cmd + a
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

    /**
     * Indicates whether internal text char widths can be cached
     * @type Boolean
     * @default
     */
    caching: true,

    /**
     * @private
     * @type Boolean
     * @default
     */
    _skipFillStrokeCheck: true,

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
      this.styles = options ? (options.styles || { }) : { };
      this.callSuper('initialize', text, options);
      this.initBehavior();

      fabric.IText.instances.push(this);

      // caching
      this.__lineWidths = { };
      this.__lineHeights = { };
      this.__lineOffsets = { };
    },

    /**
     * Returns true if object has no styling
     */
    isEmptyStyles: function() {
      if (!this.styles) {
        return true;
      }
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
      if (this.selectionStart !== index) {
        this.fire('selection:changed');
        this.canvas && this.canvas.fire('text:selection:changed', { target: this });
      }
      this.selectionStart = index;
      this.hiddenTextarea && (this.hiddenTextarea.selectionStart = index);
    },

    /**
     * Sets selection end (right boundary of a selection)
     * @param {Number} index Index to set selection end to
     */
    setSelectionEnd: function(index) {
      if (this.selectionEnd !== index) {
        this.fire('selection:changed');
        this.canvas && this.canvas.fire('text:selection:changed', { target: this });
      }
      this.selectionEnd = index;
      this.hiddenTextarea && (this.hiddenTextarea.selectionEnd = index);
    },

    /**
     * Gets style of a current selection/cursor (at the start position)
     * @param {Number} [startIndex] Start index to get styles at
     * @param {Number} [endIndex] End index to get styles at
     * @return {Object} styles Style object at a specified (or current) index
     */
    getSelectionStyles: function(startIndex, endIndex) {

      if (arguments.length === 2) {
        var styles = [ ];
        for (var i = startIndex; i < endIndex; i++) {
          styles.push(this.getSelectionStyles(i));
        }
        return styles;
      }

      var loc = this.get2DCursorLocation(startIndex);
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
      this.ctx = ctx;
      this.isEditing && this.renderCursorOrSelection();
    },

    /**
     * Renders cursor or selection (depending on what exists)
     */
    renderCursorOrSelection: function() {
      if (!this.active) {
        return;
      }

      var chars = this.text.split(''),
          boundaries;

      if (this.selectionStart === this.selectionEnd) {
        boundaries = this._getCursorBoundaries(chars, 'cursor');
        this.renderCursor(boundaries);
      }
      else {
        boundaries = this._getCursorBoundaries(chars, 'selection');
        this.renderSelection(chars, boundaries);
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
      var textBeforeCursor = this.text.slice(0, selectionStart),
          linesBeforeCursor = textBeforeCursor.split(this._reNewline);

      return {
        lineIndex: linesBeforeCursor.length - 1,
        charIndex: linesBeforeCursor[linesBeforeCursor.length - 1].length
      };
    },

    /**
     * Returns complete style of char at the current cursor
     * @param {Number} lineIndex Line index
     * @param {Number} charIndex Char index
    * @return {Object} Character style
     */
    getCurrentCharStyle: function(lineIndex, charIndex) {
      var style = this.styles[lineIndex] && this.styles[lineIndex][charIndex === 0 ? 0 : (charIndex - 1)];

      return {
        fontSize: style && style.fontSize || this.fontSize,
        fill: style && style.fill || this.fill,
        textBackgroundColor: style && style.textBackgroundColor || this.textBackgroundColor,
        textDecoration: style && style.textDecoration || this.textDecoration,
        fontFamily: style && style.fontFamily || this.fontFamily,
        fontWeight: style && style.fontWeight || this.fontWeight,
        fontStyle: style && style.fontStyle || this.fontStyle,
        stroke: style && style.stroke || this.stroke,
        strokeWidth: style && style.strokeWidth || this.strokeWidth
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
     * @private
     * @param {Array} chars Array of characters
     * @param {String} typeOfBoundaries
     */
    _getCursorBoundaries: function(chars, typeOfBoundaries) {

      var cursorLocation = this.get2DCursorLocation(),

          textLines = this.text.split(this._reNewline),

          // left/top are left/top of entire text box
          // leftOffset/topOffset are offset from that left/top point of a text box

          left = Math.round(this._getLeftOffset()),
          top = this._getTopOffset(),

          offsets = this._getCursorBoundariesOffsets(
                      chars, typeOfBoundaries, cursorLocation, textLines);

      return {
        left: left,
        top: top,
        leftOffset: offsets.left + offsets.lineLeft,
        topOffset: offsets.top
      };
    },

    /**
     * @private
     */
    _getCursorBoundariesOffsets: function(chars, typeOfBoundaries, cursorLocation, textLines) {

      var lineLeftOffset = 0,

          lineIndex = 0,
          charIndex = 0,

          leftOffset = 0,
          topOffset = typeOfBoundaries === 'cursor'
            // selection starts at the very top of the line,
            // whereas cursor starts at the padding created by line height
            ? (this._getHeightOfLine(this.ctx, 0) -
              this.getCurrentCharFontSize(cursorLocation.lineIndex, cursorLocation.charIndex))
            : 0;

      for (var i = 0; i < this.selectionStart; i++) {
        if (chars[i] === '\n') {
          leftOffset = 0;
          var index = lineIndex + (typeOfBoundaries === 'cursor' ? 1 : 0);
          topOffset += this._getCachedLineHeight(index);

          lineIndex++;
          charIndex = 0;
        }
        else {
          leftOffset += this._getWidthOfChar(this.ctx, chars[i], lineIndex, charIndex);
          charIndex++;
        }

        lineLeftOffset = this._getCachedLineOffset(lineIndex, textLines);
      }

      this._clearCache();

      return {
        top: topOffset,
        left: leftOffset,
        lineLeft: lineLeftOffset
      };
    },

    /**
     * @private
     */
    _clearCache: function() {
      this.__lineWidths = { };
      this.__lineHeights = { };
      this.__lineOffsets = { };
    },

    /**
     * @private
     */
    _getCachedLineHeight: function(index) {
      return this.__lineHeights[index] ||
        (this.__lineHeights[index] = this._getHeightOfLine(this.ctx, index));
    },

    /**
     * @private
     */
    _getCachedLineWidth: function(lineIndex, textLines) {
      return this.__lineWidths[lineIndex] ||
        (this.__lineWidths[lineIndex] = this._getWidthOfLine(this.ctx, lineIndex, textLines));
    },

    /**
     * @private
     */
    _getCachedLineOffset: function(lineIndex, textLines) {
      var widthOfLine = this._getCachedLineWidth(lineIndex, textLines);

      return this.__lineOffsets[lineIndex] ||
        (this.__lineOffsets[lineIndex] = this._getLineLeftOffset(widthOfLine));
    },

    /**
     * Renders cursor
     * @param {Object} boundaries
     */
    renderCursor: function(boundaries) {
      var ctx = this.ctx;

      ctx.save();

      var cursorLocation = this.get2DCursorLocation(),
          lineIndex = cursorLocation.lineIndex,
          charIndex = cursorLocation.charIndex,
          charHeight = this.getCurrentCharFontSize(lineIndex, charIndex),
          leftOffset = (lineIndex === 0 && charIndex === 0)
                    ? this._getCachedLineOffset(lineIndex, this.text.split(this._reNewline))
                    : boundaries.leftOffset;

      ctx.fillStyle = this.getCurrentCharColor(lineIndex, charIndex);
      ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;

      ctx.fillRect(
        boundaries.left + leftOffset,
        boundaries.top + boundaries.topOffset,
        this.cursorWidth / this.scaleX,
        charHeight);

      ctx.restore();
    },

    /**
     * Renders text selection
     * @param {Array} chars Array of characters
     * @param {Object} boundaries Object with left/top/leftOffset/topOffset
     */
    renderSelection: function(chars, boundaries) {
      var ctx = this.ctx;

      ctx.save();

      ctx.fillStyle = this.selectionColor;

      var start = this.get2DCursorLocation(this.selectionStart),
          end = this.get2DCursorLocation(this.selectionEnd),
          startLine = start.lineIndex,
          endLine = end.lineIndex,
          textLines = this.text.split(this._reNewline);

      for (var i = startLine; i <= endLine; i++) {
        var lineOffset = this._getCachedLineOffset(i, textLines) || 0,
            lineHeight = this._getCachedLineHeight(i),
            boxWidth = 0;

        if (i === startLine) {
          for (var j = 0, len = textLines[i].length; j < len; j++) {
            if (j >= start.charIndex && (i !== endLine || j < end.charIndex)) {
              boxWidth += this._getWidthOfChar(ctx, textLines[i][j], i, j);
            }
            if (j < start.charIndex) {
              lineOffset += this._getWidthOfChar(ctx, textLines[i][j], i, j);
            }
          }
        }
        else if (i > startLine && i < endLine) {
          boxWidth += this._getCachedLineWidth(i, textLines) || 5;
        }
        else if (i === endLine) {
          for (var j2 = 0, j2len = end.charIndex; j2 < j2len; j2++) {
            boxWidth += this._getWidthOfChar(ctx, textLines[i][j2], i, j2);
          }
        }

        ctx.fillRect(
          boundaries.left + lineOffset,
          boundaries.top + boundaries.topOffset,
          boxWidth,
          lineHeight);

        boundaries.topOffset += lineHeight;
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
      var textLines = this.text.split(this._reNewline),
          lineWidth = this._getWidthOfLine(ctx, lineIndex, textLines),
          lineHeight = this._getHeightOfLine(ctx, lineIndex, textLines),
          lineLeftOffset = this._getLineLeftOffset(lineWidth),
          chars = line.split(''),
          prevStyle,
          charsToRender = '';

      left += lineLeftOffset || 0;

      ctx.save();

      for (var i = 0, len = chars.length; i <= len; i++) {
        prevStyle = prevStyle || this.getCurrentCharStyle(lineIndex, i);
        var thisStyle = this.getCurrentCharStyle(lineIndex, i + 1);

        if (this._hasStyleChanged(prevStyle, thisStyle) || i === len) {
          this._renderChar(method, ctx, lineIndex, i - 1, charsToRender, left, top, lineHeight);
          charsToRender = '';
          prevStyle = thisStyle;
        }
        charsToRender += chars[i];
      }

      ctx.restore();
    },

    /**
     * @private
     * @param {String} method
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Content of the line
     * @param {Number} left Left coordinate
     * @param {Number} top Top coordinate
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
     * @param {String} method
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Number} lineIndex
     * @param {Number} i
     * @param {String} _char
     * @param {Number} left Left coordinate
     * @param {Number} top Top coordinate
     * @param {Number} lineHeight Height of the line
     */
    _renderChar: function(method, ctx, lineIndex, i, _char, left, top, lineHeight) {
      var decl, charWidth, charHeight;

      if (this.styles && this.styles[lineIndex] && (decl = this.styles[lineIndex][i])) {

        var shouldStroke = decl.stroke || this.stroke,
            shouldFill = decl.fill || this.fill;

        ctx.save();
        charWidth = this._applyCharStylesGetWidth(ctx, _char, lineIndex, i, decl);
        charHeight = this._getHeightOfChar(ctx, _char, lineIndex, i);

        if (shouldFill) {
          ctx.fillText(_char, left, top);
        }
        if (shouldStroke) {
          ctx.strokeText(_char, left, top);
        }

        this._renderCharDecoration(ctx, decl, left, top, charWidth, lineHeight, charHeight);
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
     * @param {Object} prevStyle
     * @param {Object} thisStyle
     */
    _hasStyleChanged: function(prevStyle, thisStyle) {
      return (prevStyle.fill !== thisStyle.fill ||
              prevStyle.fontSize !== thisStyle.fontSize ||
              prevStyle.textBackgroundColor !== thisStyle.textBackgroundColor ||
              prevStyle.textDecoration !== thisStyle.textDecoration ||
              prevStyle.fontFamily !== thisStyle.fontFamily ||
              prevStyle.fontWeight !== thisStyle.fontWeight ||
              prevStyle.fontStyle !== thisStyle.fontStyle ||
              prevStyle.stroke !== thisStyle.stroke ||
              prevStyle.strokeWidth !== thisStyle.strokeWidth
      );
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderCharDecoration: function(ctx, styleDeclaration, left, top, charWidth, lineHeight, charHeight) {

      var textDecoration = styleDeclaration
            ? (styleDeclaration.textDecoration || this.textDecoration)
            : this.textDecoration,

          fontSize = (styleDeclaration ? styleDeclaration.fontSize : null) || this.fontSize;

      if (!textDecoration) {
        return;
      }

      if (textDecoration.indexOf('underline') > -1) {
        this._renderCharDecorationAtOffset(
          ctx,
          left,
          top + (this.fontSize / this._fontSizeFraction),
          charWidth,
          0,
          this.fontSize / 20
        );
      }
      if (textDecoration.indexOf('line-through') > -1) {
        this._renderCharDecorationAtOffset(
          ctx,
          left,
          top + (this.fontSize / this._fontSizeFraction),
          charWidth,
          charHeight / 2,
          fontSize / 20
        );
      }
      if (textDecoration.indexOf('overline') > -1) {
        this._renderCharDecorationAtOffset(
          ctx,
          left,
          top,
          charWidth,
          lineHeight - (this.fontSize / this._fontSizeFraction),
          this.fontSize / 20
        );
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderCharDecorationAtOffset: function(ctx, left, top, charWidth, offset, thickness) {
      ctx.fillRect(left, top - offset, charWidth, thickness);
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
      if (!this.textBackgroundColor && !this.styles) {
        return;
      }

      ctx.save();

      if (this.textBackgroundColor) {
        ctx.fillStyle = this.textBackgroundColor;
      }

      var lineHeights = 0,
          fractionOfFontSize = this.fontSize / this._fontSizeFraction;

      for (var i = 0, len = textLines.length; i < len; i++) {

        var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
        if (textLines[i] === '') {
          lineHeights += heightOfLine;
          continue;
        }

        var lineWidth = this._getWidthOfLine(ctx, i, textLines),
            lineLeftOffset = this._getLineLeftOffset(lineWidth);

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
      var styleDeclaration = decl ||
                            (this.styles[lineIndex] &&
                             this.styles[lineIndex][charIndex]);

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
      if (this.isEmptyStyles() && this._charWidthsCache[cacheProp] && this.caching) {
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

      if (!this.caching) {
        return ctx.measureText(_char).width;
      }

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
     * @param {Number} lineIndex
     * @param {Number} charIndex
     */
    _getStyleDeclaration: function(lineIndex, charIndex) {
      return (this.styles[lineIndex] && this.styles[lineIndex][charIndex])
        ? clone(this.styles[lineIndex][charIndex])
        : { };
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getWidthOfChar: function(ctx, _char, lineIndex, charIndex) {
      if (this.textAlign === 'justify' && /\s/.test(_char)) {
        return this._getWidthOfSpace(ctx, lineIndex);
      }

      var styleDeclaration = this._getStyleDeclaration(lineIndex, charIndex);
      this._applyFontStyles(styleDeclaration);
      var cacheProp = this._getCacheProp(_char, styleDeclaration);

      if (this._charWidthsCache[cacheProp] && this.caching) {
        return this._charWidthsCache[cacheProp];
      }
      else if (ctx) {
        ctx.save();
        var width = this._applyCharStylesGetWidth(ctx, _char, lineIndex, charIndex);
        ctx.restore();
        return width;
      }
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
     * @param {Number} lineIndex
     */
    _getWidthOfSpace: function (ctx, lineIndex) {
      var lines = this.text.split(this._reNewline),
          line = lines[lineIndex],
          words = line.split(/\s+/),
          wordsWidth = this._getWidthOfWords(ctx, line, lineIndex),
          widthDiff = this.width - wordsWidth,
          numSpaces = words.length - 1,
          width = widthDiff / numSpaces;

      return width;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Number} line
     * @param {Number} lineIndex
     */
    _getWidthOfWords: function (ctx, line, lineIndex) {
      var width = 0;

      for (var charIndex = 0; charIndex < line.length; charIndex++) {
        var _char = line[charIndex];

        if (!_char.match(/\s/)) {
          width += this._getWidthOfChar(ctx, _char, lineIndex, charIndex);
        }
      }

      return width;
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

      var maxHeight = this._getHeightOfChar(ctx, textLines[lineIndex][0], lineIndex, 0),
          line = textLines[lineIndex],
          chars = line.split('');

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
     * @param {Array} textLines Array of all text lines
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
     */
    _getTopOffset: function() {
      var topOffset = fabric.Text.prototype._getTopOffset.call(this);
      return topOffset - (this.fontSize / this._fontSizeFraction);
    },

    /**
     * This method is overwritten to account for different top offset
     * @private
     */
    _renderTextBoxBackground: function(ctx) {
      if (!this.backgroundColor) {
        return;
      }

      ctx.save();
      ctx.fillStyle = this.backgroundColor;

      ctx.fillRect(
        this._getLeftOffset(),
        this._getTopOffset() + (this.fontSize / this._fontSizeFraction),
        this.width,
        this.height
      );

      ctx.restore();
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude), {
        styles: clone(this.styles)
      });
    }
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

  /**
   * Contains all fabric.IText objects that have been created
   * @static
   * @memberof fabric.IText
   * @type Array
   */
  fabric.IText.instances = [ ];

})();
