(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      clone = fabric.util.object.clone,
      MIN_TEXT_WIDTH = 2,
      CACHE_FONT_SIZE = 200;

  if (fabric.Text) {
    fabric.warn('fabric.Text is already defined');
    return;
  }

  var stateProperties = fabric.Object.prototype.stateProperties.concat();
  stateProperties.push(
    'fontFamily',
    'fontWeight',
    'fontSize',
    'text',
    'underline',
    'overline',
    'linethrough',
    'textAlign',
    'fontStyle',
    'lineHeight',
    'textBackgroundColor',
    'charSpacing',
    'styles'
  );

  var cacheProperties = fabric.Object.prototype.cacheProperties.concat();
  cacheProperties.push(
    'fontFamily',
    'fontWeight',
    'fontSize',
    'text',
    'underline',
    'overline',
    'linethrough',
    'textAlign',
    'fontStyle',
    'lineHeight',
    'textBackgroundColor',
    'charSpacing',
    'styles'
  );
  /**
   * Text class
   * @class fabric.Text
   * @extends fabric.Object
   * @return {fabric.Text} thisArg
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#text}
   * @see {@link fabric.Text#initialize} for constructor definition
   */
  fabric.Text = fabric.util.createClass(fabric.Object, /** @lends fabric.Text.prototype */ {

    /**
     * Properties which when set cause object to change dimensions
     * @type Object
     * @private
     */
    _dimensionAffectingProps: [
      'fontSize',
      'fontWeight',
      'fontFamily',
      'fontStyle',
      'lineHeight',
      'text',
      'charSpacing',
      'textAlign',
      'styles',
    ],

    /**
     * @private
     */
    _reNewline: /\r?\n/,

    /**
     * Use this regular expression to filter for whitespaces that is not a new line.
     * Mostly used when text is 'justify' aligned.
     * @private
     */
    _reSpacesAndTabs: /[ \t\r]/g,

    /**
     * Use this regular expression to filter for whitespace that is not a new line.
     * Mostly used when text is 'justify' aligned.
     * @private
     */
    _reSpaceAndTab: /[ \t\r]/,

    /**
     * Use this regular expression to filter consecutive groups of non spaces.
     * Mostly used when text is 'justify' aligned.
     * @private
     */
    _reWords: /\S+/g,

    /**
     * Type of an object
     * @type String
     * @default
     */
    type:                 'text',

    /**
     * Font size (in pixels)
     * @type Number
     * @default
     */
    fontSize:             40,

    /**
     * Font weight (e.g. bold, normal, 400, 600, 800)
     * @type {(Number|String)}
     * @default
     */
    fontWeight:           'normal',

    /**
     * Font family
     * @type String
     * @default
     */
    fontFamily:           'Times New Roman',

    /**
     * Text decoration underline.
     * @type String
     * @default
     */
    underline:       false,

    /**
     * Text decoration overline.
     * @type String
     * @default
     */
    overline:       false,

    /**
     * Text decoration linethrough.
     * @type String
     * @default
     */
    linethrough:       false,

    /**
     * Text alignment. Possible values: "left", "center", "right" or "justify".
     * @type String
     * @default
     */
    textAlign:            'left',

    /**
     * Font style . Possible values: "", "normal", "italic" or "oblique".
     * @type String
     * @default
     */
    fontStyle:            'normal',

    /**
     * Line height
     * @type Number
     * @default
     */
    lineHeight:           1.16,

    /**
     * Background color of text lines
     * @type String
     * @default
     */
    textBackgroundColor:  '',

    /**
     * List of properties to consider when checking if
     * state of an object is changed ({@link fabric.Object#hasStateChanged})
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties:      stateProperties,

    /**
     * List of properties to consider when checking if cache needs refresh
     * @type Array
     */
    cacheProperties:      cacheProperties,

    /**
     * When defined, an object is rendered via stroke and this property specifies its color.
     * <b>Backwards incompatibility note:</b> This property was named "strokeStyle" until v1.1.6
     * @type String
     * @default
     */
    stroke:               null,

    /**
     * Shadow object representing shadow of this shape.
     * <b>Backwards incompatibility note:</b> This property was named "textShadow" (String) until v1.2.11
     * @type fabric.Shadow
     * @default
     */
    shadow:               null,

    /**
     * @private
     */
    _fontSizeFraction: 0.222,

    /**
     * @private
     */
    offsets: {
      underline: 0.10,
      linethrough: -0.315,
      overline: -0.88
    },

    /**
     * Text Line proportion to font Size (in pixels)
     * @type Number
     * @default
     */
    _fontSizeMult:             1.13,

    /**
     * additional space between characters
     * expressed in thousands of em unit
     * @type Number
     * @default
     */
    charSpacing:             0,

    /**
     * Object containing character styles
     * (where top-level properties corresponds to line number and 2nd-level properties -- to char number in a line)
     * @type Object
     * @default
     */
    styles: null,

    /**
     * Reference to a context to measure text char or couple of chars
     * the cacheContext of the canvas will be used or a freshly created one if the object is not on canvas
     * once created it will be referenced on fabric._measuringContext to avoide creating a canvas for every
     * text object created.
     * @type {CanvasRenderingContext2D}
     * @default
     */
    _measuringContext: null,

    /**
     * Array of properties that define a style unit.
     * @type {Array}
     * @default
     */
    _styleProperties: [
      'stroke',
      'strokeWidth',
      'fill',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fontStyle',
      'underline',
      'overline',
      'linethrough',
      'textBackgroundColor',
    ],

    /**
     * contains characters bounding boxes
     */
    __charBounds: [],

    /**
     * Constructor
     * @param {String} text Text string
     * @param {Object} [options] Options object
     * @return {fabric.Text} thisArg
     */
    initialize: function(text, options) {
      this.styles = options ? (options.styles || { }) : { };
      this.text = text;
      this.__skipDimension = true;
      this.callSuper('initialize', options);
      this.__skipDimension = false;
      this.initDimensions();
      this.setCoords();
      this.setupState({ propertySet: '_dimensionAffectingProps' });
    },

    /**
     * Return a contex for measurement of text string.
     * if created it gets stored for reuse
     * @param {String} text Text string
     * @param {Object} [options] Options object
     * @return {fabric.Text} thisArg
     */
    getMeasuringContext: function() {
      // if we did not return we have to measure something.
      if (!fabric._measuringContext) {
        fabric._measuringContext = this.canvas && this.canvas.contextCache ||
          fabric.util.createCanvasElement().getContext('2d');
      }
      return fabric._measuringContext;
    },

    /**
     * Initialize or update text dimensions.
     * Updates this.width and this.height with the proper values.
     * Does not return dimensions.
     */
    initDimensions: function() {
      if (this.__skipDimension) {
        return;
      }
      var newLines = this._splitTextIntoLines(this.text);
      this.textLines = newLines.lines;
      this._unwrappedTextLines = newLines._unwrappedLines;
      this._textLines = newLines.graphemeLines;
      this._text = newLines.graphemeText;
      this._clearCache();
      this.width = this.calcTextWidth() || this.cursorWidth || MIN_TEXT_WIDTH;
      if (this.textAlign === 'justify') {
        // once text is misured we need to make space fatter to make justified text.
        this.enlargeSpaces();
      }
      this.height = this.calcTextHeight();
    },

    /**
     * Enlarge space boxes and shift the others
     */
    enlargeSpaces: function() {
      var diffSpace, currentLineWidth, numberOfSpaces, accumulatedSpace, line, charBound, spaces;
      for (var i = 0, len = this._textLines.length; i < len; i++) {
        accumulatedSpace = 0;
        line = this._textLines[i];
        currentLineWidth = this.getLineWidth(i);
        if (currentLineWidth < this.width && (spaces = this.textLines[i].match(this._reSpacesAndTabs))) {
          numberOfSpaces = spaces.length;
          diffSpace = (this.width - currentLineWidth) / numberOfSpaces;
          for (var j = 0, jlen = line.length; j <= jlen; j++) {
            charBound = this.__charBounds[i][j];
            if (this._reSpaceAndTab.test(line[j])) {
              charBound.width += diffSpace;
              charBound.kernedWidth += diffSpace;
              charBound.left += accumulatedSpace;
              accumulatedSpace += diffSpace;
            }
            else {
              charBound.left += accumulatedSpace;
            }
          }
        }
      }
    },

    /**
     * Returns string representation of an instance
     * @return {String} String representation of text object
     */
    toString: function() {
      return '#<fabric.Text (' + this.complexity() +
        '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>';
    },

    /**
     * Return the dimension and the zoom level needed to create a cache canvas
     * big enough to host the object to be cached.
     * @private
     * @return {Object}.width width of canvas
     * @return {Object}.height height of canvas
     * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
     * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
     */
    _getCacheCanvasDimensions: function() {
      var dim = this.callSuper('_getCacheCanvasDimensions');
      var fontSize = this.fontSize;
      dim.width += fontSize * dim.zoomX;
      dim.height += fontSize * dim.zoomY;
      return dim;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      this._setTextStyles(ctx);
      this._renderTextLinesBackground(ctx);
      this._renderTextDecoration(ctx, 'underline');
      this._renderText(ctx);
      this._renderTextDecoration(ctx, 'overline');
      this._renderTextDecoration(ctx, 'linethrough');
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderText: function(ctx) {
      this._renderTextFill(ctx);
      this._renderTextStroke(ctx);
    },

    /**
     * Set the font parameter of the context with the object properties or with charStyle
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Object} [charStyle] object with font style properties
     * @param {String} [charStyle.fontFamily] Font Family
     * @param {Number} [charStyle.fontSize] Font size in pixels. ( without px suffix )
     * @param {String} [charStyle.fontWeight] Font weight
     * @param {String} [charStyle.fontStyle] Font style (italic|normal)
     */
    _setTextStyles: function(ctx, charStyle, forMeasuring) {
      ctx.textBaseline = 'alphabetic';
      ctx.font = this._getFontDeclaration(charStyle, forMeasuring);
    },

    /**
     * calculate and return the text Width measuring each line.
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @return {Number} Maximum width of fabric.Text object
     */
    calcTextWidth: function() {
      var maxWidth = this.getLineWidth(0);

      for (var i = 1, len = this._textLines.length; i < len; i++) {
        var currentLineWidth = this.getLineWidth(i);
        if (currentLineWidth > maxWidth) {
          maxWidth = currentLineWidth;
        }
      }
      return maxWidth;
    },

    /**
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to render
     * @param {Number} left Left position of text
     * @param {Number} top Top position of text
     * @param {Number} lineIndex Index of a line in a text
     */
    _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
      this._renderChars(method, ctx, line, left, top, lineIndex);
    },

    /**
     * Renders the text background for lines, taking care of style
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderTextLinesBackground: function(ctx) {
      if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor')) {
        return;
      }
      var lineTopOffset = 0, heightOfLine,
          lineLeftOffset, originalFill = ctx.fillStyle,
          line, lastColor,
          leftOffset = this._getLeftOffset(),
          topOffset = this._getTopOffset(),
          boxStart = 0, boxWidth = 0, charBox, currentColor;

      for (var i = 0, len = this._textLines.length; i < len; i++) {
        heightOfLine = this.getHeightOfLine(i);
        if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor', i)) {
          lineTopOffset += heightOfLine;
          continue;
        }
        line = this._textLines[i];
        lineLeftOffset = this._getLineLeftOffset(i);
        boxWidth = 0;
        boxStart = 0;
        lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');
        for (var j = 0, jlen = line.length; j < jlen; j++) {
          charBox = this.__charBounds[i][j];
          currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
          if (currentColor !== lastColor) {
            ctx.fillStyle = lastColor;
            lastColor && ctx.fillRect(
              leftOffset + lineLeftOffset + boxStart,
              topOffset + lineTopOffset,
              boxWidth,
              heightOfLine / this.lineHeight
            );
            boxStart = charBox.left;
            boxWidth = charBox.width;
            lastColor = currentColor;
          }
          else {
            boxWidth += charBox.kernedWidth;
          }
        }
        if (currentColor) {
          ctx.fillStyle = currentColor;
          ctx.fillRect(
            leftOffset + lineLeftOffset + boxStart,
            topOffset + lineTopOffset,
            boxWidth,
            heightOfLine / this.lineHeight
          );
        }
        lineTopOffset += heightOfLine;
      }
      ctx.fillStyle = originalFill;
      // if there is text background color no
      // other shadows should be casted
      this._removeShadow(ctx);
    },

    /**
     * @private
     * @param {Object} decl style declaration for cache
     * @param {String} decl.fontFamily fontFamily
     * @param {String} decl.fontStyle fontStyle
     * @param {String} decl.fontWeight fontWeight
     * @return {Object} reference to cache
     */
    getFontCache: function(decl) {
      var fontFamily = decl.fontFamily.toLowerCase();
      if (!fabric.charWidthsCache[fontFamily]) {
        fabric.charWidthsCache[fontFamily] = { };
      }
      var cache = fabric.charWidthsCache[fontFamily],
          cacheProp = decl.fontStyle.toLowerCase() + '_' + (decl.fontWeight + '').toLowerCase();
      if (!cache[cacheProp]) {
        cache[cacheProp] = { };
      }
      return cache[cacheProp];
    },

    /**
     * apply all the character style to canvas for rendering
     * @private
     * @param {String} _char
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @param {Object} [decl]
     */
    _applyCharStyles: function(method, ctx, lineIndex, charIndex, styleDeclaration) {

      this._setFillStyles(ctx, styleDeclaration);
      this._setStrokeStyles(ctx, styleDeclaration);

      ctx.font = this._getFontDeclaration(styleDeclaration);
    },

    /**
     * measure and return the width of a single character.
     * possibly overridden to accommodate different measure logic or
     * to hook some external lib for character measurement
     * @private
     * @param {String} char to be measured
     * @param {Object} charStyle style of char to be measured
     * @param {String} [previousChar] previous char
     * @param {Object} [prevCharStyle] style of previous char
     */
    _measureChar: function(_char, charStyle, previousChar, prevCharStyle) {
      // first i try to return from cache
      var fontCache = this.getFontCache(charStyle), fontDeclaration = this._getFontDeclaration(charStyle),
          previousFontDeclaration = this._getFontDeclaration(prevCharStyle), couple = previousChar + _char,
          stylesAreEqual = fontDeclaration === previousFontDeclaration, width, coupleWidth, previousWidth,
          fontMultiplier = charStyle.fontSize / CACHE_FONT_SIZE, kernedWidth;

      if (previousChar && fontCache[previousChar]) {
        previousWidth = fontCache[previousChar];
      }
      if (fontCache[_char]) {
        kernedWidth = width = fontCache[_char];
      }
      if (stylesAreEqual && fontCache[couple]) {
        coupleWidth = fontCache[couple];
        kernedWidth = coupleWidth - previousWidth;
      }
      if (!width || !previousWidth || !coupleWidth) {
        var ctx = this.getMeasuringContext();
        // send a TRUE to specify measuring font size CACHE_FONT_SIZE
        this._setTextStyles(ctx, charStyle, true);
      }
      if (!width) {
        kernedWidth = width = ctx.measureText(_char).width;
        fontCache[_char] = width;
      }
      if (!previousWidth && stylesAreEqual && previousChar) {
        previousWidth = ctx.measureText(previousChar).width;
        fontCache[previousChar] = previousWidth;
      }
      if (stylesAreEqual && !coupleWidth) {
        // we can measure the kerning couple and subtract the width of the previous character
        coupleWidth = ctx.measureText(couple).width;
        fontCache[couple] = coupleWidth;
        kernedWidth = coupleWidth - previousWidth;
        // try to fix a MS browsers oddity
        if (kernedWidth > width) {
          var diff = kernedWidth - width;
          fontCache[_char] = kernedWidth;
          fontCache[couple] += diff;
          width = kernedWidth;
        }
      }
      return { width: width * fontMultiplier, kernedWidth: kernedWidth * fontMultiplier };
    },

    /**
     * return height of char in fontSize for a character at lineIndex, charIndex
     * @param {Number} l line Index
     * @param {Number} c char index
     * @return {Number} fontSize of that character
     */
    getHeightOfChar: function(l, c) {
      return this.getValueOfPropertyAt(l, c, 'fontSize');
    },

    /**
     * measure a text line measuring all characters.
     * @param {Number} lineIndex line number
     * @return {Number} Line width
     */
    measureLine: function(lineIndex) {
      var lineInfo = this._measureLine(lineIndex);
      if (this.charSpacing !== 0) {
        lineInfo.width -= this._getWidthOfCharSpacing();
      }
      if (lineInfo.width < 0) {
        lineInfo.width = 0;
      }
      return lineInfo;
    },

    /**
     * measure every grapheme of a line, populating __charBounds
     * @param {Number} lineIndex
     * @return {Object} object.width total width of characters
     * @return {Object} object.widthOfSpaces length of chars that match this._reSpacesAndTabs
     */
    _measureLine: function(lineIndex) {
      var width = 0, i, grapheme, line = this._textLines[lineIndex], prevGrapheme,
          graphemeInfo, numOfSpaces = 0, lineBounds = new Array(line.length);

      this.__charBounds[lineIndex] = lineBounds;
      for (i = 0; i < line.length; i++) {
        grapheme = line[i];
        graphemeInfo = this._getGraphemeBox(grapheme, lineIndex, i, prevGrapheme);
        lineBounds[i] = graphemeInfo;
        width += graphemeInfo.kernedWidth;
        prevGrapheme = grapheme;
      }
      // this latest bound box represent the last character of the line
      // to simplify cursor handling in interactive mode.
      lineBounds[i] = {
        left: graphemeInfo ? graphemeInfo.left + graphemeInfo.width : 0,
        width: 0,
        kernedWidth: 0,
        height: this.fontSize
      };
      return { width: width, numOfSpaces: numOfSpaces };
    },

    /**
     * Measure and return the info of a single grapheme.
     * needs the the info of previous graphemes already filled
     * @private
     * @param {String} grapheme to be measured
     * @param {Number} lineIndex index of the line where the char is
     * @param {Number} charIndex position in the line
     * @param {String} [previousChar] character preceding the one to be measured
     */
    _getGraphemeBox: function(grapheme, lineIndex, charIndex, previousGrapheme, skipLeft) {
      var charStyle = this.getCompleteStyleDeclaration(lineIndex, charIndex),
          prevCharStyle = previousGrapheme ? this.getCompleteStyleDeclaration(lineIndex, charIndex - 1) : { },
          info = this._measureChar(grapheme, charStyle, previousGrapheme, prevCharStyle),
          kernedWidth = info.kernedWidth, width = info.width;

      if (this.charSpacing !== 0) {
        width += this._getWidthOfCharSpacing();
        kernedWidth += this._getWidthOfCharSpacing();
      }
      var box = {
        width: width,
        left: 0,
        height: charStyle.fontSize,
        kernedWidth: kernedWidth,
      };
      if (charIndex > 0 && !skipLeft) {
        var previousBox = this.__charBounds[lineIndex][charIndex - 1];
        box.left = previousBox.left + previousBox.width + info.kernedWidth - info.width;
      }
      return box;
    },

    /**
     * Calculate height of chosen line
     * height of line is based mainly on fontSize
     * @private
     * @param {Number} lineIndex index of the line to calculate
     */
    getHeightOfLine: function(lineIndex) {
      if (this.__lineHeights[lineIndex]) {
        return this.__lineHeights[lineIndex];
      }

      var line = this._textLines[lineIndex],
          maxHeight = this.getHeightOfChar(lineIndex, 0);

      for (var i = 1, len = line.length; i < len; i++) {
        var currentCharHeight = this.getHeightOfChar(lineIndex, i);
        if (currentCharHeight > maxHeight) {
          maxHeight = currentCharHeight;
        }
      }
      this.__lineHeights[lineIndex] = maxHeight * this.lineHeight * this._fontSizeMult;
      return this.__lineHeights[lineIndex];
    },

    /**
     * calculate text box height
     * @private
     */
    calcTextHeight: function() {
      var lineHeight, height = 0;
      for (var i = 0, len = this._textLines.length; i < len; i++) {
        lineHeight = this.getHeightOfLine(i);
        height += (i === len - 1 ? lineHeight / this.lineHeight : lineHeight);
      }
      return height;
    },

    /**
     * @private
     * @return {Number} Left offset
     */
    _getLeftOffset: function() {
      return -this.width / 2;
    },

    /**
     * @private
     * @return {Number} Top offset
     */
    _getTopOffset: function() {
      return -this.height / 2;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} method Method name ("fillText" or "strokeText")
     */
    _renderTextCommon: function(ctx, method) {
      ctx.save();
      var lineHeights = 0, left = this._getLeftOffset(), top = this._getTopOffset(),
          offsets = this._applyPatternGradientTransform(ctx, method === 'fillText' ? this.fill : this.stroke);
      for (var i = 0, len = this._textLines.length; i < len; i++) {
        var heightOfLine = this.getHeightOfLine(i),
            maxHeight = heightOfLine / this.lineHeight,
            leftOffset = this._getLineLeftOffset(i);
        this._renderTextLine(
          method,
          ctx,
          this._textLines[i],
          left + leftOffset - offsets.offsetX,
          top + lineHeights + maxHeight - offsets.offsetY,
          i
        );
        lineHeights += heightOfLine;
      }
      ctx.restore();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderTextFill: function(ctx) {
      if (!this.fill && !this.styleHas('fill')) {
        return;
      }

      this._renderTextCommon(ctx, 'fillText');
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderTextStroke: function(ctx) {
      if ((!this.stroke || this.strokeWidth === 0) && this.isEmptyStyles()) {
        return;
      }

      if (this.shadow && !this.shadow.affectStroke) {
        this._removeShadow(ctx);
      }

      ctx.save();
      this._setLineDash(ctx, this.strokeDashArray);
      ctx.beginPath();
      this._renderTextCommon(ctx, 'strokeText');
      ctx.closePath();
      ctx.restore();
    },

    /**
     * @private
     * @param {String} method
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Content of the line
     * @param {Number} left
     * @param {Number} top
     * @param {Number} lineIndex
     * @param {Number} charOffset
     */
    _renderChars: function(method, ctx, line, left, top, lineIndex) {
      // set proper line offset
      var lineHeight = this.getHeightOfLine(lineIndex),
          actualStyle,
          nextStyle,
          charsToRender = '',
          charBox,
          boxWidth = 0,
          timeToRender;

      ctx.save();
      top -= lineHeight * this._fontSizeFraction / this.lineHeight;
      for (var i = 0, len = line.length - 1; i <= len; i++) {
        timeToRender = i === len || this.charSpacing;
        charsToRender += line[i];
        charBox = this.__charBounds[lineIndex][i];
        if (boxWidth === 0) {
          left += charBox.kernedWidth - charBox.width;
        }
        boxWidth += charBox.kernedWidth;
        if (this.textAlign === 'justify' && !timeToRender) {
          if (this._reSpaceAndTab.test(line[i])) {
            timeToRender = true;
          }
        }
        if (!timeToRender) {
          // if we have charSpacing, we render char by char
          actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
          nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
          timeToRender = this._hasStyleChanged(actualStyle, nextStyle);
        }
        if (timeToRender) {
          this._renderChar(method, ctx, lineIndex, i, charsToRender, left, top, lineHeight);
          charsToRender = '';
          actualStyle = nextStyle;
          left += boxWidth;
          boxWidth = 0;
        }
      }
      ctx.restore();
    },

    /**
     * @private
     * @param {String} method
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @param {String} _char
     * @param {Number} left Left coordinate
     * @param {Number} top Top coordinate
     * @param {Number} lineHeight Height of the line
     */
    _renderChar: function(method, ctx, lineIndex, charIndex, _char, left, top) {
      var decl = this._getStyleDeclaration(lineIndex, charIndex),
          fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex),
          shouldFill = method === 'fillText' && fullDecl.fill,
          shouldStroke = method === 'strokeText' && fullDecl.stroke && fullDecl.strokeWidth;

      if (!shouldStroke && !shouldFill) {
        return;
      }
      decl && ctx.save();

      this._applyCharStyles(method, ctx, lineIndex, charIndex, fullDecl);

      if (decl && decl.textBackgroundColor) {
        this._removeShadow(ctx);
      }
      shouldFill && ctx.fillText(_char, left, top);
      shouldStroke && ctx.strokeText(_char, left, top);
      decl && ctx.restore();
    },

    /**
     * @private
     * @param {Object} prevStyle
     * @param {Object} thisStyle
     */
    _hasStyleChanged: function(prevStyle, thisStyle) {
      return (prevStyle.fill !== thisStyle.fill ||
              prevStyle.stroke !== thisStyle.stroke ||
              prevStyle.strokeWidth !== thisStyle.strokeWidth ||
              prevStyle.fontSize !== thisStyle.fontSize ||
              prevStyle.fontFamily !== thisStyle.fontFamily ||
              prevStyle.fontWeight !== thisStyle.fontWeight ||
              prevStyle.fontStyle !== thisStyle.fontStyle
      );
    },

    /**
     * @private
     * @param {Number} lineIndex index text line
     * @return {Number} Line left offset
     */
    _getLineLeftOffset: function(lineIndex) {
      var lineWidth = this.getLineWidth(lineIndex);
      if (this.textAlign === 'center') {
        return (this.width - lineWidth) / 2;
      }
      if (this.textAlign === 'right') {
        return this.width - lineWidth;
      }
      return 0;
    },

    /**
     * @private
     */
    _clearCache: function() {
      this.__lineWidths = [];
      this.__lineHeights = [];
      this.__numberOfSpaces = [];
      this.__charBounds = [];
    },

    /**
     * @private
     */
    _shouldClearDimensionCache: function() {
      var shouldClear = this._forceClearCache;
      shouldClear || (shouldClear = this.hasStateChanged('_dimensionAffectingProps'));
      if (shouldClear) {
        this.saveState({ propertySet: '_dimensionAffectingProps' });
        this.dirty = true;
        this._forceClearCache = false;
      }
      return shouldClear;
    },

    /**
     * Measure a single line given its index. Used to calculate the initial
     * text bounding box. The values are calculated and stored in __lineWidths cache.
     * @private
     * @param {Number} lineIndex line number
     * @return {Number} Line width
     */
    getLineWidth: function(lineIndex) {
      if (this.__lineWidths[lineIndex]) {
        return this.__lineWidths[lineIndex];
      }

      var width, line = this._textLines[lineIndex], lineInfo;

      if (line === '') {
        width = 0;
      }
      else {
        lineInfo = this.measureLine(lineIndex);
        width = lineInfo.width;
      }
      this.__lineWidths[lineIndex] = width;
      this.__numberOfSpaces[lineIndex] = lineInfo.numberOfSpaces;
      return width;
    },

    _getWidthOfCharSpacing: function() {
      if (this.charSpacing !== 0) {
        return this.fontSize * this.charSpacing / 1000;
      }
      return 0;
    },

    /**
     * @private
     * @param {Number} LineIndex
     * @param {Number} charIndex
     * @param {String} property

     */
    getValueOfPropertyAt: function(lineIndex, charIndex, property) {
      var charStyle = this._getStyleDeclaration(lineIndex, charIndex),
          styleDecoration = charStyle && typeof charStyle[property] !== 'undefined';
      return styleDecoration ? charStyle[property] : this[property];
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderTextDecoration: function(ctx, type) {
      if (!this[type] && !this.styleHas(type)) {
        return;
      }
      var heightOfLine,
          lineLeftOffset,
          line, lastDecoration,
          leftOffset = this._getLeftOffset(),
          topOffset = this._getTopOffset(),
          boxStart, boxWidth, charBox, currentDecoration,
          maxHeight, currentFill, lastFill;

      for (var i = 0, len = this._textLines.length; i < len; i++) {
        heightOfLine = this.getHeightOfLine(i);
        if (!this[type] && !this.styleHas(type, i)) {
          topOffset += heightOfLine;
          continue;
        }
        line = this._textLines[i];
        maxHeight = heightOfLine / this.lineHeight;
        lineLeftOffset = this._getLineLeftOffset(i);
        boxStart = 0;
        boxWidth = 0;
        lastDecoration = this.getValueOfPropertyAt(i, 0, type);
        lastFill = this.getValueOfPropertyAt(i, 0, 'fill');
        for (var j = 0, jlen = line.length; j < jlen; j++) {
          charBox = this.__charBounds[i][j];
          currentDecoration = this.getValueOfPropertyAt(i, j, type);
          currentFill = this.getValueOfPropertyAt(i, j, 'fill');
          if ((currentDecoration !== lastDecoration || currentFill !== lastFill) && boxWidth > 0) {
            ctx.fillStyle = lastFill;
            lastDecoration && lastFill && ctx.fillRect(
              leftOffset + lineLeftOffset + boxStart,
              topOffset + maxHeight * (1 - this._fontSizeFraction) + this.offsets[type] * this.fontSize,
              boxWidth,
              this.fontSize / 15);
            boxStart = charBox.left;
            boxWidth = charBox.width;
            lastDecoration = currentDecoration;
            lastFill = currentFill;
          }
          else {
            boxWidth += charBox.kernedWidth;
          }
        }
        ctx.fillStyle = currentFill;
        currentDecoration && currentFill && ctx.fillRect(
          leftOffset + lineLeftOffset + boxStart,
          topOffset + maxHeight * (1 - this._fontSizeFraction) + this.offsets[type] * this.fontSize,
          boxWidth,
          this.fontSize / 15
        );
        topOffset += heightOfLine;
      }
      // if there is text background color no
      // other shadows should be casted
      this._removeShadow(ctx);
    },

    /**
     * return font declaration string for canvas context
     * @param {Object} [styleObject] object
     * @returns {String} font declaration formatted for canvas context.
     */
    _getFontDeclaration: function(styleObject, forMeasuring) {
      var style = styleObject || this;
      return [
        // node-canvas needs "weight style", while browsers need "style weight"
        (fabric.isLikelyNode ? style.fontWeight : style.fontStyle),
        (fabric.isLikelyNode ? style.fontStyle : style.fontWeight),
        forMeasuring ? CACHE_FONT_SIZE + 'px' : style.fontSize + 'px',
        (fabric.isLikelyNode ? ('"' + style.fontFamily + '"') : style.fontFamily)
      ].join(' ');
    },

    /**
     * Renders text instance on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    render: function(ctx) {
      // do not render if object is not visible
      if (!this.visible) {
        return;
      }
      if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
        return;
      }
      if (this._shouldClearDimensionCache()) {
        this.initDimensions();
      }
      this.callSuper('render', ctx);
    },

    /**
     * Returns the text as an array of lines.
     * @param {String} text text to split
     * @returns {Array} Lines in the text
     */
    _splitTextIntoLines: function(text) {
      var lines = text.split(this._reNewline),
          newLines = new Array(lines.length),
          newLine = ['\n'],
          newText = [];
      for (var i = 0; i < lines.length; i++) {
        newLines[i] = fabric.util.string.graphemeSplit(lines[i]);
        newText = newText.concat(newLines[i], newLine);
      }
      newText.pop();
      return { _unwrappedLines: newLines, lines: lines, graphemeText: newText, graphemeLines: newLines };
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      var additionalProperties = [
        'text',
        'fontSize',
        'fontWeight',
        'fontFamily',
        'fontStyle',
        'lineHeight',
        'underline',
        'overline',
        'linethrough',
        'textAlign',
        'textBackgroundColor',
        'charSpacing',
      ].concat(propertiesToInclude);
      var obj = this.callSuper('toObject', additionalProperties);
      obj.styles = clone(this.styles, true);
      return obj;
    },

    /**
     * Sets specified property to a specified value
     * @param {String} key
     * @param {*} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    _set: function(key, value) {
      this.callSuper('_set', key, value);

      if (this._dimensionAffectingProps.indexOf(key) > -1) {
        this.initDimensions();
        this.setCoords();
      }
    },

    /**
     * Returns complexity of an instance
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link fabric.Text.fromElement})
   * @static
   * @memberOf fabric.Text
   * @see: http://www.w3.org/TR/SVG/text.html#TextElement
   */
  fabric.Text.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat(
    'x y dx dy font-family font-style font-weight font-size text-decoration text-anchor'.split(' '));

  /**
   * Default SVG font size
   * @static
   * @memberOf fabric.Text
   */
  fabric.Text.DEFAULT_SVG_FONT_SIZE = 16;

  /**
   * Returns fabric.Text instance from an SVG element (<b>not yet implemented</b>)
   * @static
   * @memberOf fabric.Text
   * @param {SVGElement} element Element to parse
   * @param {Function} callback callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  fabric.Text.fromElement = function(element, callback, options) {
    if (!element) {
      return callback(null);
    }

    var parsedAttributes = fabric.parseAttributes(element, fabric.Text.ATTRIBUTE_NAMES),
        parsedAnchor = parsedAttributes.textAnchor || 'left';
    options = fabric.util.object.extend((options ? clone(options) : { }), parsedAttributes);

    options.top = options.top || 0;
    options.left = options.left || 0;
    if (parsedAttributes.textDecoration) {
      var textDecoration = parsedAttributes.textDecoration;
      if (textDecoration.indexOf('underline') !== -1) {
        options.underline = true;
      }
      if (textDecoration.indexOf('overline') !== -1) {
        options.overline = true;
      }
      if (textDecoration.indexOf('line-through') !== -1) {
        options.linethrough = true;
      }
      delete options.textDecoration;
    }
    if ('dx' in parsedAttributes) {
      options.left += parsedAttributes.dx;
    }
    if ('dy' in parsedAttributes) {
      options.top += parsedAttributes.dy;
    }
    if (!('fontSize' in options)) {
      options.fontSize = fabric.Text.DEFAULT_SVG_FONT_SIZE;
    }

    var textContent = '';

    // The XML is not properly parsed in IE9 so a workaround to get
    // textContent is through firstChild.data. Another workaround would be
    // to convert XML loaded from a file to be converted using DOMParser (same way loadSVGFromString() does)
    if (!('textContent' in element)) {
      if ('firstChild' in element && element.firstChild !== null) {
        if ('data' in element.firstChild && element.firstChild.data !== null) {
          textContent = element.firstChild.data;
        }
      }
    }
    else {
      textContent = element.textContent;
    }

    textContent = textContent.replace(/^\s+|\s+$|\n+/g, '').replace(/\s+/g, ' ');

    var text = new fabric.Text(textContent, options),
        textHeightScaleFactor = text.getScaledHeight() / text.height,
        lineHeightDiff = (text.height + text.strokeWidth) * text.lineHeight - text.height,
        scaledDiff = lineHeightDiff * textHeightScaleFactor,
        textHeight = text.getScaledHeight() + scaledDiff,
        offX = 0;
    /*
      Adjust positioning:
        x/y attributes in SVG correspond to the bottom-left corner of text bounding box
        fabric output by default at top, left.
    */
    if (parsedAnchor === 'center') {
      offX = text.getScaledWidth() / 2;
    }
    if (parsedAnchor === 'right') {
      offX = text.getScaledWidth();
    }
    text.set({
      left: text.left - offX,
      top: text.top - (textHeight - text.fontSize * (0.18 + text._fontSizeFraction)) / text.lineHeight
    });
    callback(text);
  };
  /* _FROM_SVG_END_ */

  /**
   * Returns fabric.Text instance from an object representation
   * @static
   * @memberOf fabric.Text
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when an fabric.Text instance is created
   */
  fabric.Text.fromObject = function(object, callback) {
    return fabric.Object._fromObject('Text', object, callback, 'text');
  };

  fabric.util.createAccessors && fabric.util.createAccessors(fabric.Text);

})(typeof exports !== 'undefined' ? exports : this);
