(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      toFixed = fabric.util.toFixed,
      clone = fabric.util.object.clone,
      NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,
      MIN_TEXT_WIDTH = 2;

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
    'textDecoration',
    'textAlign',
    'fontStyle',
    'lineHeight',
    'textBackgroundColor',
    'charSpacing'
  );

  var cacheProperties = fabric.Object.prototype.cacheProperties.concat();
  cacheProperties.push(
    'fontFamily',
    'fontWeight',
    'fontSize',
    'text',
    'textDecoration',
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
      'textAlign'
    ],

    /**
     * @private
     */
    _reNewline: /\r?\n/,

    /**
     * Use this regular expression to filter for whitespace that is not a new line.
     * Mostly used when text is 'justify' aligned.
     * @private
     */
    _reSpacesAndTabs: /[ \t\r]+/g,

    /**
     * Retrieves object's fontSize
     * @method getFontSize
     * @memberOf fabric.Text.prototype
     * @return {String} Font size (in pixels)
     */

    /**
     * Sets object's fontSize
     * Does not update the object .width and .height,
     * call ._initDimensions() to update the values.
     * @method setFontSize
     * @memberOf fabric.Text.prototype
     * @param {Number} fontSize Font size (in pixels)
     * @return {fabric.Text}
     * @chainable
     */

    /**
     * Retrieves object's fontWeight
     * @method getFontWeight
     * @memberOf fabric.Text.prototype
     * @return {(String|Number)} Font weight
     */

    /**
     * Sets object's fontWeight
     * Does not update the object .width and .height,
     * call ._initDimensions() to update the values.
     * @method setFontWeight
     * @memberOf fabric.Text.prototype
     * @param {(Number|String)} fontWeight Font weight
     * @return {fabric.Text}
     * @chainable
     */

    /**
     * Retrieves object's fontFamily
     * @method getFontFamily
     * @memberOf fabric.Text.prototype
     * @return {String} Font family
     */

    /**
     * Sets object's fontFamily
     * Does not update the object .width and .height,
     * call ._initDimensions() to update the values.
     * @method setFontFamily
     * @memberOf fabric.Text.prototype
     * @param {String} fontFamily Font family
     * @return {fabric.Text}
     * @chainable
     */

    /**
     * Retrieves object's text
     * @method getText
     * @memberOf fabric.Text.prototype
     * @return {String} text
     */

    /**
     * Sets object's text
     * Does not update the object .width and .height,
     * call ._initDimensions() to update the values.
     * @method setText
     * @memberOf fabric.Text.prototype
     * @param {String} text Text
     * @return {fabric.Text}
     * @chainable
     */

    /**
     * Retrieves object's textDecoration
     * @method getTextDecoration
     * @memberOf fabric.Text.prototype
     * @return {String} Text decoration
     */

    /**
     * Sets object's textDecoration
     * @method setTextDecoration
     * @memberOf fabric.Text.prototype
     * @param {String} textDecoration Text decoration
     * @return {fabric.Text}
     * @chainable
     */

    /**
     * Retrieves object's fontStyle
     * @method getFontStyle
     * @memberOf fabric.Text.prototype
     * @return {String} Font style
     */

    /**
     * Sets object's fontStyle
     * Does not update the object .width and .height,
     * call ._initDimensions() to update the values.
     * @method setFontStyle
     * @memberOf fabric.Text.prototype
     * @param {String} fontStyle Font style
     * @return {fabric.Text}
     * @chainable
     */

    /**
     * Retrieves object's lineHeight
     * @method getLineHeight
     * @memberOf fabric.Text.prototype
     * @return {Number} Line height
     */

    /**
     * Sets object's lineHeight
     * @method setLineHeight
     * @memberOf fabric.Text.prototype
     * @param {Number} lineHeight Line height
     * @return {fabric.Text}
     * @chainable
     */

    /**
     * Retrieves object's textAlign
     * @method getTextAlign
     * @memberOf fabric.Text.prototype
     * @return {String} Text alignment
     */

    /**
     * Sets object's textAlign
     * @method setTextAlign
     * @memberOf fabric.Text.prototype
     * @param {String} textAlign Text alignment
     * @return {fabric.Text}
     * @chainable
     */

    /**
     * Retrieves object's textBackgroundColor
     * @method getTextBackgroundColor
     * @memberOf fabric.Text.prototype
     * @return {String} Text background color
     */

    /**
     * Sets object's textBackgroundColor
     * @method setTextBackgroundColor
     * @memberOf fabric.Text.prototype
     * @param {String} textBackgroundColor Text background color
     * @return {fabric.Text}
     * @chainable
     */

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
     * Text decoration Possible values: "", "underline", "overline" or "line-through".
     * @type String
     * @default
     */
    textDecoration:       '',

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
    fontStyle:            '',

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
    _fontSizeFraction: 0.25,

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
      'fill',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fontStyle',
      'textDecoration',
      'textBackgroundColor'
    ],

    /**
     * Constructor
     * @param {String} text Text string
     * @param {Object} [options] Options object
     * @return {fabric.Text} thisArg
     */
    initialize: function(text, options) {
      options = options || { };
      this.text = text;
      this.__skipDimension = true;
      this.callSuper('initialize', options);
      this.__skipDimension = false;
      this._initDimensions();
      this.setupState({ propertySet: '_dimensionAffectingProps' });
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
          // eslint-disable-next-line no-unused-vars
          for (var p3 in obj[p1][p2]) {
            return false;
          }
        }
      }
      return true;
    },

    /**
     * @private
     */
    _extendStyles: function(index, styles) {
      var loc = this.get2DCursorLocation(index);

      if (!this._getLineStyle(loc.lineIndex)) {
        this._setLineStyle(loc.lineIndex, {});
      }

      if (!this._getStyleDeclaration(loc.lineIndex, loc.charIndex)) {
        this._setStyleDeclaration(loc.lineIndex, loc.charIndex, {});
      }

      fabric.util.object.extend(this._getStyleDeclaration(loc.lineIndex, loc.charIndex), styles);
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
      this._textLines = this._splitTextIntoLines();
      this._clearCache();
      this.width = this._getTextWidth() || this.cursorWidth || MIN_TEXT_WIDTH;
      this.height = this._getTextHeight();
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
      var fontSize = Math.ceil(this.fontSize) * 2;
      dim.width += fontSize;
      dim.height += fontSize;
      return dim;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      this._setTextStyles(ctx);
      if (this.group && this.group.type === 'path-group') {
        ctx.translate(this.left, this.top);
      }
      this._renderTextLinesBackground(ctx);
      this._renderText(ctx);
      this._renderTextDecoration(ctx);
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
    _setTextStyles: function(ctx, charStyle) {
      ctx.textBaseline = 'alphabetic';
      ctx.font = this._getFontDeclaration(charStyle);
    },

    /**
     * calculate and return the text Width measuring each line.
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @return {Number} Maximum width of fabric.Text object
     */
    _getTextWidth: function() {
      var maxWidth = this._getLineWidth(0);

      for (var i = 1, len = this._textLines.length; i < len; i++) {
        var currentLineWidth = this._getLineWidth(i);
        if (currentLineWidth > maxWidth) {
          maxWidth = currentLineWidth;
        }
      }
      return maxWidth;
    },

    // /**
    //  * @private
    //  * @param {String} method Method name ("fillText" or "strokeText")
    //  * @param {CanvasRenderingContext2D} ctx Context to render on
    //  * @param {String} chars Chars to render
    //  * @param {Number} left Left position of text
    //  * @param {Number} top Top position of text
    //  */
    // _renderChars: function(method, ctx, chars, left, top) {
    //   // remove Text word from method var
    //   var shortM = method.slice(0, -4), char, width;
    //   if (this[shortM].toLive) {
    //     var offsetX = -this.width / 2 + this[shortM].offsetX || 0,
    //         offsetY = -this.height / 2 + this[shortM].offsetY || 0;
    //     ctx.save();
    //     ctx.translate(offsetX, offsetY);
    //     left -= offsetX;
    //     top -= offsetY;
    //   }
    //   if (this.charSpacing !== 0) {
    //     var additionalSpace = this._getWidthOfCharSpacing();
    //     chars = chars.split('');
    //     for (var i = 0, len = chars.length; i < len; i++) {
    //       char = chars[i];
    //       width = ctx.measureText(char).width + additionalSpace;
    //       ctx[method](char, left, top);
    //       left += width > 0 ? width : 0;
    //     }
    //   }
    //   else {
    //     ctx[method](chars, left, top);
    //   }
    //   this[shortM].toLive && ctx.restore();
    // },

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
      // lift the line by quarter of fontSize
      top -= this.fontSize * this._fontSizeFraction;

      // short-circuit
      var lineWidth = this._getLineWidth(ctx, lineIndex);
      if (this.textAlign !== 'justify' || this.width < lineWidth) {
        this._renderChars(method, ctx, line, left, top, lineIndex);
        return;
      }

      // stretch the line
      var words = line.split(/\s+/),
          charOffset = 0,
          wordsWidth = this._getWidthOfWords(ctx, words.join(' '), lineIndex, 0),
          widthDiff = this.width - wordsWidth,
          numSpaces = words.length - 1,
          spaceWidth = numSpaces > 0 ? widthDiff / numSpaces : 0,
          leftOffset = 0, word;

      for (var i = 0, len = words.length; i < len; i++) {
        while (line[charOffset] === ' ' && charOffset < line.length) {
          charOffset++;
        }
        word = words[i];
        this._renderChars(method, ctx, word, left + leftOffset, top, lineIndex, charOffset);
        leftOffset += this._getWidthOfWords(ctx, word, lineIndex, charOffset) + spaceWidth;
        charOffset += word.length;
      }
    },

    // to be investigated
    //  /**
    //  * @private
    //  * @param {String} method
    //  * @param {CanvasRenderingContext2D} ctx Context to render on
    //  * @param {String} line
    //  * @param {Number} left
    //  * @param {Number} top
    //  * @param {Number} lineIndex
    //  */
    // _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
    //   // to "cancel" this.fontSize subtraction in fabric.Text#_renderTextLine
    //   // the adding 0.03 is just to align text with itext by overlap test
    //   if (!this.isEmptyStyles()) {
    //     top += this.fontSize * (this._fontSizeFraction + 0.03);
    //   }
    //   this.callSuper('_renderTextLine', method, ctx, line, left, top, lineIndex);
    // },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderTextLinesBackground: function(ctx) {
      if (!this.textBackgroundColor) {
        return;
      }
      var lineTopOffset = 0, heightOfLine,
          lineWidth, lineLeftOffset, originalFill = ctx.fillStyle;

      ctx.fillStyle = this.textBackgroundColor;
      for (var i = 0, len = this._textLines.length; i < len; i++) {
        heightOfLine = this._getHeightOfLine(ctx, i);
        lineWidth = this._getLineWidth(ctx, i);
        if (lineWidth > 0) {
          lineLeftOffset = this._getLineLeftOffset(lineWidth);
          ctx.fillRect(
            this._getLeftOffset() + lineLeftOffset,
            this._getTopOffset() + lineTopOffset,
            lineWidth,
            heightOfLine / this.lineHeight
          );
        }
        lineTopOffset += heightOfLine;
      }
      ctx.fillStyle = originalFill;
      // if there is text background color no
      // other shadows should be casted
      this._removeShadow(ctx);

      var lineTopOffset = 0, heightOfLine,
          lineWidth, lineLeftOffset,
          leftOffset = this._getLeftOffset(),
          topOffset = this._getTopOffset(),
          line, _char, style;
      ctx.save();
      for (var i = 0, len = this._textLines.length; i < len; i++) {
        heightOfLine = this._getHeightOfLine(ctx, i);
        line = this._textLines[i];

        if (line === '' || !this.styles || !this._getLineStyle(i)) {
          lineTopOffset += heightOfLine;
          continue;
        }

        lineWidth = this._getLineWidth(ctx, i);
        lineLeftOffset = this._getLineLeftOffset(lineWidth);

        for (var j = 0, jlen = line.length; j < jlen; j++) {
          style = this._getStyleDeclaration(i, j);
          if (!style || !style.textBackgroundColor) {
            continue;
          }
          _char = line[j];

          ctx.fillStyle = style.textBackgroundColor;

          ctx.fillRect(
            leftOffset + lineLeftOffset + this._getWidthOfCharsAt(ctx, i, j),
            topOffset + lineTopOffset,
            this._getWidthOfChar(ctx, _char, i, j),
            heightOfLine / this.lineHeight
          );
        }
        lineTopOffset += heightOfLine;
      }
      ctx.restore();
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
      if (!fabric.charWidthsCache[decl.fontFamily]) {
        fabric.charWidthsCache[decl.fontFamily] = { };
      }
      var cache = fabric.charWidthsCache[decl.fontFamily],
          cacheProp = decl.fontStyle + '_' + decl.fontWeight;
      if (!cache[cacheProp]) {
        cache[cacheProp] = { };
      }
      return cache[cacheProp];
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
      var charDecl = decl || this._getStyleDeclaration(lineIndex, charIndex),
          styleDeclaration = clone(charDecl),
          width, cacheProp, charWidthsCache;

      this._applyFontStyles(styleDeclaration);
      charWidthsCache = this._getFontCache(styleDeclaration.fontFamily);
      cacheProp = this._getCacheProp(_char, styleDeclaration);

      // short-circuit if no styles for this char
      // global style from object is always applyed and handled by save and restore
      if (!charDecl && charWidthsCache[cacheProp] && this.caching) {
        return charWidthsCache[cacheProp];
      }

      if (typeof styleDeclaration.shadow === 'string') {
        styleDeclaration.shadow = new fabric.Shadow(styleDeclaration.shadow);
      }

      var fill = styleDeclaration.fill || this.fill;
      ctx.fillStyle = fill.toLive
        ? fill.toLive(ctx, this)
        : fill;

      if (styleDeclaration.stroke) {
        ctx.strokeStyle = (styleDeclaration.stroke && styleDeclaration.stroke.toLive)
          ? styleDeclaration.stroke.toLive(ctx, this)
          : styleDeclaration.stroke;
      }

      ctx.lineWidth = styleDeclaration.strokeWidth || this.strokeWidth;
      ctx.font = this._getFontDeclaration.call(styleDeclaration);

      //if we want this._setShadow.call to work with styleDeclarion
      //we have to add those references
      if (styleDeclaration.shadow) {
        styleDeclaration.scaleX = this.scaleX;
        styleDeclaration.scaleY = this.scaleY;
        styleDeclaration.canvas = this.canvas;
        styleDeclaration.getObjectScaling = this.getObjectScaling;
        this._setShadow.call(styleDeclaration, ctx);
      }

      if (!this.caching || !charWidthsCache[cacheProp]) {
        width = ctx.measureText(_char).width;
        this.caching && (charWidthsCache[cacheProp] = width);
        return width;
      }

      return charWidthsCache[cacheProp];
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
     * get the reference, notcloned of the style object for a given character
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @return {Object} style object
     */
    getStyleDeclaration: function(lineIndex, charIndex) {
      var lineStyle = this.styles[lineIndex];
      if (!lineStyle) {
        return null;
      }
      return lineStyle[charIndex];
    },

    /**
     * return a new object that contains all the style property for a character
     * the object returned is newly created
     * @param {Number} lineIndex of the line where the character is
     * @param {Number} charIndex position of the character on the line
     * @return {Object} style object
     */
    getCompleteStyleDeclaration: function(lineIndex, charIndex) {
      var style = this.getStyleDeclaration(lineIndex, charIndex),
          styleObject = { }, prop;
      for (var i = 0; i < this._styleProperties.length; i++) {
        prop = this._styleProperties[i];
        styleObject[prop] = typeof style[prop] === 'undefined' ? this[prop] : style[prop];
      }
      return styleObject;
    },

    /**
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @param {Object} style
     * @private
     */
    _setStyleDeclaration: function(lineIndex, charIndex, style) {
      this.styles[lineIndex][charIndex] = style;
    },

    /**
     *
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @private
     */
    _deleteStyleDeclaration: function(lineIndex, charIndex) {
      delete this.styles[lineIndex][charIndex];
    },

    /**
     * @param {Number} lineIndex
     * @private
     */
    _getLineStyle: function(lineIndex) {
      return this.styles[lineIndex];
    },

    /**
     * @param {Number} lineIndex
     * @param {Object} style
     * @private
     */
    _setLineStyle: function(lineIndex, style) {
      this.styles[lineIndex] = style;
    },

    /**
     * @param {Number} lineIndex
     * @private
     */
    _deleteLineStyle: function(lineIndex) {
      delete this.styles[lineIndex];
    },

    /**
     * return or measure and return the width of a single character.
     * takes in consideration style, and kerning where possible.
     * @private
     * @param {String} _char to be measured
     * @param {Number} lineIndex index of the line where the char is
     * @param {Number} charIndex position in the line
     * @param {String} [previousChar] character preceding the one to be measured
     */
    _getWidthOfChar: function(_char, lineIndex, charIndex, previousChar) {
      var charStyle = this.getCompleteStyleDeclaration(lineIndex, charIndex),
          prevCharStyle = previousChar ? this.getCompleteStyleDeclaration(lineIndex, charIndex - 1) : { },
          width = this._measureChar(_char, charStyle, previousChar, prevCharStyle);
      if (this.charSpacing !== 0) {
        width += this._getWidthOfCharSpacing();
      }
      // being charSpacing possibly negative we do not want the width being negative.
      return width > 0 ? width : 0;
    },

    /**
     * measure and return the width of a single character.
     * possibly overridden to accomodate differente measure logic or
     * to hook some external lib for character measurement
     * @private
     * @param {String} char char to be measured
     * @param {Object} charStyle style of char to be measured
     * @param {String} [previousChar] previous char
     * @param {Object} [prevCharStyle] style of previous char
     */
    _measureChar: function(char, charStyle, previousChar, prevCharStyle) {
      if (!this._measuringContext) {
        this._measuringContext = fabric.measuringContext ||
          this.canvas && this.canvas.contextCache ||
          fabric.util.createCanvasElement().getContext('2d');
        fabric.measuringContext || (fabric.measuringContext = this._measuringContext);
      }
      var fontCache = this.getFontCache(charStyle),
          ctx = this._measuringContext, fontDeclaration = this._getFontDeclaration(charStyle),
          previousFontDeclaration = this._getFontDeclaration(prevCharStyle), width, widthPrevious,
          widthCouple;
      this._setTextStyles(ctx, charStyle);
      if (previousChar && fontDeclaration === previousFontDeclaration) {
        // we can measure the kerning couple and subtract the width of the previous character
        widthCouple = fontCache[previousChar + char] || ctx.measureText(previousChar + char);
        widthPrevious = this._measureChar(previousChar, prevCharStyle);
      }
      width = ctx.measureText(char);
      return widthCouple ? widthCouple - widthPrevious : width;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Number} lineIndex
     * @param {Number} charIndex
     */
    _getHeightOfChar: function(ctx, lineIndex, charIndex) {
      var style = this._getStyleDeclaration(lineIndex, charIndex);
      return style && style.fontSize ? style.fontSize : this.fontSize;
    },

    /**
     * measure an interval of characters from a given line
     * @private
     * @param {Number} lineIndex
     * @param {Number} indexStart
     * @param {Number} length
     */
    _getWidthOfCharsAt: function(lineIndex, indexStart, length) {
      var width = 0, i, _char, line = this._textLines[lineIndex], prevChar;
      for (i = indexStart; i < indexStart + length; i++) {
        _char = line.charAt(i);
        width += this._getWidthOfChar(_char, lineIndex, i, prevChar);
        prevChar = _char;
      }
      return width;
    },

    /**
     * measure a text line measuring all characters.
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Number} lineIndex line number
     * @return {Number} Line width
     */
    _measureLine: function(ctx, lineIndex) {
      var width = this._getWidthOfCharsAt(lineIndex, 0, this._textLines[lineIndex].length);
      if (this.charSpacing !== 0) {
        width -= this._getWidthOfCharSpacing();
      }
      return width > 0 ? width : 0;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Number} lineIndex
     */
    _getWidthOfSpace: function (ctx, lineIndex) {
      if (this.__widthOfSpace[lineIndex]) {
        return this.__widthOfSpace[lineIndex];
      }
      var line = this._textLines[lineIndex],
          wordsWidth = this._getWidthOfWords(ctx, line, lineIndex, 0),
          widthDiff = this.width - wordsWidth,
          numSpaces = line.length - line.replace(this._reSpacesAndTabs, '').length,
          width = Math.max(widthDiff / numSpaces, ctx.measureText(' ').width);
      this.__widthOfSpace[lineIndex] = width;
      return width;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line
     * @param {Number} lineIndex
     * @param {Number} charOffset
     */
    _getWidthOfWords: function (ctx, line, lineIndex, charOffset) {
      var width = 0;

      for (var charIndex = 0; charIndex < line.length; charIndex++) {
        var _char = line[charIndex];

        if (!_char.match(/\s/)) {
          width += this._getWidthOfChar(ctx, _char, lineIndex, charIndex + charOffset);
        }
      }

      return width;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getHeightOfLine: function(ctx, lineIndex) {
      if (this.__lineHeights[lineIndex]) {
        return this.__lineHeights[lineIndex];
      }

      var line = this._textLines[lineIndex],
          maxHeight = this._getHeightOfChar(ctx, lineIndex, 0);

      for (var i = 1, len = line.length; i < len; i++) {
        var currentCharHeight = this._getHeightOfChar(ctx, lineIndex, i);
        if (currentCharHeight > maxHeight) {
          maxHeight = currentCharHeight;
        }
      }
      this.__lineHeights[lineIndex] = maxHeight * this.lineHeight * this._fontSizeMult;
      return this.__lineHeights[lineIndex];
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _getTextHeight: function(ctx) {
      var lineHeight, height = 0;
      for (var i = 0, len = this._textLines.length; i < len; i++) {
        lineHeight = this._getHeightOfLine(ctx, i);
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
     * Returns complete style of char at the current cursor
     * @param {Number} lineIndex Line index
     * @param {Number} charIndex Char index
     * @return {Object} Character style
     */
    getCurrentCharStyle: function(lineIndex, charIndex) {
      var style = this._getStyleDeclaration(lineIndex, charIndex === 0 ? 0 : charIndex - 1);

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
      var style = this._getStyleDeclaration(lineIndex, charIndex === 0 ? 0 : charIndex - 1);
      return style && style.fontSize ? style.fontSize : this.fontSize;
    },

    /**
     * Returns color (fill) of char at the current cursor
     * @param {Number} lineIndex Line index
     * @param {Number} charIndex Char index
     * @return {String} Character color (fill)
     */
    getCurrentCharColor: function(lineIndex, charIndex) {
      var style = this._getStyleDeclaration(lineIndex, charIndex === 0 ? 0 : charIndex - 1);
      return style && style.fill ? style.fill : this.cursorColor;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} method Method name ("fillText" or "strokeText")
     */
    _renderTextCommon: function(ctx, method) {

      var lineHeights = 0, left = this._getLeftOffset(), top = this._getTopOffset();

      for (var i = 0, len = this._textLines.length; i < len; i++) {
        var heightOfLine = this._getHeightOfLine(ctx, i),
            maxHeight = heightOfLine / this.lineHeight,
            lineWidth = this._getLineWidth(ctx, i),
            leftOffset = this._getLineLeftOffset(lineWidth);
        this._renderTextLine(
          method,
          ctx,
          this._textLines[i],
          left + leftOffset,
          top + lineHeights + maxHeight,
          i
        );
        lineHeights += heightOfLine;
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderTextFill: function(ctx) {
      if (!this.fill && this.isEmptyStyles()) {
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
    _renderChars: function(method, ctx, line, left, top, lineIndex, charOffset) {

      if (this.isEmptyStyles()) {
        return this._renderCharsFast(method, ctx, line, left, top);
      }

      charOffset = charOffset || 0;

      // set proper line offset
      var lineHeight = this._getHeightOfLine(ctx, lineIndex),
          prevStyle,
          thisStyle,
          charsToRender = '';

      ctx.save();
      top -= lineHeight / this.lineHeight * this._fontSizeFraction;
      for (var i = charOffset, len = line.length + charOffset; i <= len; i++) {
        prevStyle = prevStyle || this.getCurrentCharStyle(lineIndex, i);
        thisStyle = this.getCurrentCharStyle(lineIndex, i + 1);

        if (this._hasStyleChanged(prevStyle, thisStyle) || i === len) {
          this._renderChar(method, ctx, lineIndex, i - 1, charsToRender, left, top, lineHeight);
          charsToRender = '';
          prevStyle = thisStyle;
        }
        charsToRender += line[i - charOffset];
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

      if (method === 'fillText' && this.fill) {
        this.callSuper('_renderChars', method, ctx, line, left, top);
      }
      if (method === 'strokeText' && ((this.stroke && this.strokeWidth > 0) || this.skipFillStrokeCheck)) {
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
      var charWidth, charHeight, shouldFill, shouldStroke,
          decl = this._getStyleDeclaration(lineIndex, i),
          offset, textDecoration, chars, additionalSpace, _charWidth;

      if (decl) {
        charHeight = this._getHeightOfChar(ctx, _char, lineIndex, i);
        shouldStroke = decl.stroke;
        shouldFill = decl.fill;
        textDecoration = decl.textDecoration;
      }
      else {
        charHeight = this.fontSize;
      }

      shouldStroke = (shouldStroke || this.stroke) && method === 'strokeText';
      shouldFill = (shouldFill || this.fill) && method === 'fillText';

      decl && ctx.save();

      charWidth = this._applyCharStylesGetWidth(ctx, _char, lineIndex, i, decl || null);
      textDecoration = textDecoration || this.textDecoration;

      if (decl && decl.textBackgroundColor) {
        this._removeShadow(ctx);
      }
      if (this.charSpacing !== 0) {
        additionalSpace = this._getWidthOfCharSpacing();
        chars = _char.split('');
        charWidth = 0;
        for (var j = 0, len = chars.length, char; j < len; j++) {
          char = chars[j];
          shouldFill && ctx.fillText(char, left + charWidth, top);
          shouldStroke && ctx.strokeText(char, left + charWidth, top);
          _charWidth = ctx.measureText(char).width + additionalSpace;
          charWidth += _charWidth > 0 ? _charWidth : 0;
        }
      }
      else {
        shouldFill && ctx.fillText(_char, left, top);
        shouldStroke && ctx.strokeText(_char, left, top);
      }

      if (textDecoration || textDecoration !== '') {
        offset = this._fontSizeFraction * lineHeight / this.lineHeight;
        this._renderCharDecoration(ctx, textDecoration, left, top, offset, charWidth, charHeight);
      }

      decl && ctx.restore();
      ctx.translate(charWidth, 0);
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
    _renderCharDecoration: function(ctx, textDecoration, left, top, offset, charWidth, charHeight) {

      if (!textDecoration) {
        return;
      }

      var decorationWeight = charHeight / 15,
          positions = {
            underline: top + charHeight / 10,
            'line-through': top - charHeight * (this._fontSizeFraction + this._fontSizeMult - 1) + decorationWeight,
            overline: top - (this._fontSizeMult - this._fontSizeFraction) * charHeight
          },
          decorations = ['underline', 'line-through', 'overline'], i, decoration;

      for (i = 0; i < decorations.length; i++) {
        decoration = decorations[i];
        if (textDecoration.indexOf(decoration) > -1) {
          ctx.fillRect(left, positions[decoration], charWidth , decorationWeight);
        }
      }
    },

    /**
     * @private
     * @param {Number} lineWidth Width of text line
     * @return {Number} Line left offset
     */
    _getLineLeftOffset: function(lineWidth) {
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
      this.__widthOfSpace = [];
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
      }
      return shouldClear;
    },

    /**
     * Measure a single line given its index. Used to calculate the initial
     * text bouding box. The values are calculated and stored in __lineWidths cache.
     * TODO: fix the hack of storing the jusfified lines as -1 in a better way
     * @private
     * @param {Number} lineIndex line number
     * @return {Number} Line width
     */
    _getLineWidth: function(lineIndex) {
      if (this.__lineWidths[lineIndex]) {
        return this.__lineWidths[lineIndex] === -1 ? this.width : this.__lineWidths[lineIndex];
      }

      var width, wordCount, line = this._textLines[lineIndex];

      if (line === '') {
        width = 0;
      }
      else {
        width = this._measureLine(lineIndex);
      }
      this.__lineWidths[lineIndex] = width;

      if (width && this.textAlign === 'justify') {
        wordCount = line.split(/\s+/);
        if (wordCount.length > 1) {
          this.__lineWidths[lineIndex] = -1;
        }
      }
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
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderTextDecoration: function(ctx) {
      if (!this.textDecoration) {
        return;
      }
      var halfOfVerticalBox = this.height / 2,
          _this = this, offsets = [];

      /** @ignore */
      function renderLinesAtOffset(offsets) {
        var i, lineHeight = 0, len, j, oLen, lineWidth,
            lineLeftOffset, heightOfLine;

        for (i = 0, len = _this._textLines.length; i < len; i++) {

          lineWidth = _this._getLineWidth(ctx, i);
          lineLeftOffset = _this._getLineLeftOffset(lineWidth);
          heightOfLine = _this._getHeightOfLine(ctx, i);

          for (j = 0, oLen = offsets.length; j < oLen; j++) {
            ctx.fillRect(
              _this._getLeftOffset() + lineLeftOffset,
              lineHeight + (_this._fontSizeMult - 1 + offsets[j] ) * _this.fontSize - halfOfVerticalBox,
              lineWidth,
              _this.fontSize / 15);
          }
          lineHeight += heightOfLine;
        }
      }

      if (this.textDecoration.indexOf('underline') > -1) {
        offsets.push(0.85); // 1 - 3/16
      }
      if (this.textDecoration.indexOf('line-through') > -1) {
        offsets.push(0.43);
      }
      if (this.textDecoration.indexOf('overline') > -1) {
        offsets.push(-0.12);
      }
      if (offsets.length > 0) {
        renderLinesAtOffset(offsets);
      }
    },

    /**
     * return font declaration string for canvas context
     * @param {Object} [styleObject] object
     * @returns {String} font declaration formatted for canvas context.
     */
    _getFontDeclaration: function(styleObject) {
      var style = styleObject || this;
      return [
        // node-canvas needs "weight style", while browsers need "style weight"
        (fabric.isLikelyNode ? style.fontWeight : style.fontStyle),
        (fabric.isLikelyNode ? style.fontStyle : style.fontWeight),
        style.fontSize + 'px',
        (fabric.isLikelyNode ? ('"' + style.fontFamily + '"') : style.fontFamily)
      ].join(' ');
    },

    /**
     * Renders text instance on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Boolean} noTransform
     */
    render: function(ctx, noTransform) {
      // do not render if object is not visible
      if (!this.visible) {
        return;
      }
      if (this._shouldClearDimensionCache()) {
        this._initDimensions();
      }
      this.callSuper('render', ctx, noTransform);
    },

    /**
     * Returns the text as an array of lines.
     * @returns {Array} Lines in the text
     */
    _splitTextIntoLines: function() {
      return this.text.split(this._reNewline);
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
        'textDecoration',
        'textAlign',
        'textBackgroundColor',
        'charSpacing'
      ].concat(propertiesToInclude);
      return this.callSuper('toObject', additionalProperties);
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      if (!this.ctx) {
        this.ctx = fabric.util.createCanvasElement().getContext('2d');
      }
      var markup = this._createBaseSVGMarkup(),
          offsets = this._getSVGLeftTopOffsets(this.ctx),
          textAndBg = this._getSVGTextAndBg(offsets.textTop, offsets.textLeft);
      this._wrapSVGTextAndBg(markup, textAndBg);

      return reviver ? reviver(markup.join('')) : markup.join('');
    },

    /**
     * @private
     */
    _getSVGLeftTopOffsets: function(ctx) {
      var lineTop = this._getHeightOfLine(ctx, 0),
          textLeft = -this.width / 2,
          textTop = 0;

      return {
        textLeft: textLeft + (this.group && this.group.type === 'path-group' ? this.left : 0),
        textTop: textTop + (this.group && this.group.type === 'path-group' ? -this.top : 0),
        lineTop: lineTop
      };
    },

    /**
     * @private
     */
    _wrapSVGTextAndBg: function(markup, textAndBg) {
      var noShadow = true, filter = this.getSvgFilter(),
          style = filter === '' ? '' : ' style="' + filter + '"';

      markup.push(
        '\t<g ', this.getSvgId(), 'transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"',
          style, '>\n',
          textAndBg.textBgRects.join(''),
          '\t\t<text ',
            (this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, '\'') + '" ' : ''),
            (this.fontSize ? 'font-size="' + this.fontSize + '" ' : ''),
            (this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : ''),
            (this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : ''),
            (this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : ''),
            'style="', this.getSvgStyles(noShadow), '" >\n',
            textAndBg.textSpans.join(''),
          '\t\t</text>\n',
        '\t</g>\n'
      );
    },

    /**
     * @private
     * @param {Number} textTopOffset Text top offset
     * @param {Number} textLeftOffset Text left offset
     * @return {Object}
     */
    _getSVGTextAndBg: function(textTopOffset, textLeftOffset) {
      var textSpans = [],
          textBgRects = [],
          height = 0;
      // bounding-box background
      this._setSVGBg(textBgRects);

      // text and text-background
      for (var i = 0, len = this._textLines.length; i < len; i++) {
        if (this.textBackgroundColor) {
          this._setSVGTextLineBg(textBgRects, i, textLeftOffset, textTopOffset, height);
        }
        this._setSVGTextLineText(i, textSpans, height, textLeftOffset, textTopOffset, textBgRects);
        height += this._getHeightOfLine(this.ctx, i);
      }

      return {
        textSpans: textSpans,
        textBgRects: textBgRects
      };
    },

    _setSVGTextLineText: function(i, textSpans, height, textLeftOffset, textTopOffset) {
      var yPos = this.fontSize * (this._fontSizeMult - this._fontSizeFraction)
        - textTopOffset + height - this.height / 2;
      if (this.textAlign === 'justify') {
        // i call from here to do not intefere with IText
        this._setSVGTextLineJustifed(i, textSpans, yPos, textLeftOffset);
        return;
      }
      textSpans.push(
        '\t\t\t<tspan x="',
          toFixed(textLeftOffset + this._getLineLeftOffset(this._getLineWidth(this.ctx, i)), NUM_FRACTION_DIGITS), '" ',
          'y="',
          toFixed(yPos, NUM_FRACTION_DIGITS),
          '" ',
          // doing this on <tspan> elements since setting opacity
          // on containing <text> one doesn't work in Illustrator
          this._getFillAttributes(this.fill), '>',
          fabric.util.string.escapeXml(this._textLines[i]),
        '</tspan>\n'
      );
    },

    _setSVGTextLineJustifed: function(i, textSpans, yPos, textLeftOffset) {
      var ctx = fabric.util.createCanvasElement().getContext('2d');

      this._setTextStyles(ctx);

      var line = this._textLines[i],
          words = line.split(/\s+/),
          wordsWidth = this._getWidthOfWords(ctx, words.join('')),
          widthDiff = this.width - wordsWidth,
          numSpaces = words.length - 1,
          spaceWidth = numSpaces > 0 ? widthDiff / numSpaces : 0,
          word, attributes = this._getFillAttributes(this.fill),
          len;

      textLeftOffset += this._getLineLeftOffset(this._getLineWidth(ctx, i));

      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        textSpans.push(
          '\t\t\t<tspan x="',
            toFixed(textLeftOffset, NUM_FRACTION_DIGITS), '" ',
            'y="',
            toFixed(yPos, NUM_FRACTION_DIGITS),
            '" ',
            // doing this on <tspan> elements since setting opacity
            // on containing <text> one doesn't work in Illustrator
            attributes, '>',
            fabric.util.string.escapeXml(word),
          '</tspan>\n'
        );
        textLeftOffset += this._getWidthOfWords(ctx, word) + spaceWidth;
      }
    },

    _setSVGTextLineBg: function(textBgRects, i, textLeftOffset, textTopOffset, height) {
      textBgRects.push(
        '\t\t<rect ',
          this._getFillAttributes(this.textBackgroundColor),
          ' x="',
          toFixed(textLeftOffset + this._getLineLeftOffset(this._getLineWidth(this.ctx, i)), NUM_FRACTION_DIGITS),
          '" y="',
          toFixed(height - this.height / 2, NUM_FRACTION_DIGITS),
          '" width="',
          toFixed(this._getLineWidth(this.ctx, i), NUM_FRACTION_DIGITS),
          '" height="',
          toFixed(this._getHeightOfLine(this.ctx, i) / this.lineHeight, NUM_FRACTION_DIGITS),
        '"></rect>\n');
    },

    _setSVGBg: function(textBgRects) {
      if (this.backgroundColor) {
        textBgRects.push(
          '\t\t<rect ',
            this._getFillAttributes(this.backgroundColor),
            ' x="',
            toFixed(-this.width / 2, NUM_FRACTION_DIGITS),
            '" y="',
            toFixed(-this.height / 2, NUM_FRACTION_DIGITS),
            '" width="',
            toFixed(this.width, NUM_FRACTION_DIGITS),
            '" height="',
            toFixed(this.height, NUM_FRACTION_DIGITS),
          '"></rect>\n');
      }
    },

    /**
     * Adobe Illustrator (at least CS5) is unable to render rgba()-based fill values
     * we work around it by "moving" alpha channel into opacity attribute and setting fill's alpha to 1
     *
     * @private
     * @param {*} value
     * @return {String}
     */
    _getFillAttributes: function(value) {
      var fillColor = (value && typeof value === 'string') ? new fabric.Color(value) : '';
      if (!fillColor || !fillColor.getSource() || fillColor.getAlpha() === 1) {
        return 'fill="' + value + '"';
      }
      return 'opacity="' + fillColor.getAlpha() + '" fill="' + fillColor.setAlpha(1).toRgb() + '"';
    },
    /* _TO_SVG_END_ */

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
        this._initDimensions();
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
   * @param {Object} [options] Options object
   * @return {fabric.Text} Instance of fabric.Text
   */
  fabric.Text.fromElement = function(element, options) {
    if (!element) {
      return null;
    }

    var parsedAttributes = fabric.parseAttributes(element, fabric.Text.ATTRIBUTE_NAMES);
    options = fabric.util.object.extend((options ? fabric.util.object.clone(options) : { }), parsedAttributes);

    options.top = options.top || 0;
    options.left = options.left || 0;
    if ('dx' in parsedAttributes) {
      options.left += parsedAttributes.dx;
    }
    if ('dy' in parsedAttributes) {
      options.top += parsedAttributes.dy;
    }
    if (!('fontSize' in options)) {
      options.fontSize = fabric.Text.DEFAULT_SVG_FONT_SIZE;
    }

    if (!options.originX) {
      options.originX = 'left';
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
        textHeightScaleFactor = text.getHeight() / text.height,
        lineHeightDiff = (text.height + text.strokeWidth) * text.lineHeight - text.height,
        scaledDiff = lineHeightDiff * textHeightScaleFactor,
        textHeight = text.getHeight() + scaledDiff,
        offX = 0;
    /*
      Adjust positioning:
        x/y attributes in SVG correspond to the bottom-left corner of text bounding box
        top/left properties in Fabric correspond to center point of text bounding box
    */
    if (text.originX === 'left') {
      offX = text.getWidth() / 2;
    }
    if (text.originX === 'right') {
      offX = -text.getWidth() / 2;
    }
    text.set({
      left: text.getLeft() + offX,
      top: text.getTop() - textHeight / 2 + text.fontSize * (0.18 + text._fontSizeFraction) / text.lineHeight /* 0.3 is the old lineHeight */
    });

    return text;
  };
  /* _FROM_SVG_END_ */

  /**
   * Returns fabric.Text instance from an object representation
   * @static
   * @memberOf fabric.Text
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when an fabric.Text instance is created
   * @param {Boolean} [forceAsync] Force an async behaviour trying to create pattern first
   * @return {fabric.Text} Instance of fabric.Text
   */
  fabric.Text.fromObject = function(object, callback, forceAsync) {
    return fabric.Object._fromObject('Text', object, callback, forceAsync, 'text');
  };

  fabric.util.createAccessors(fabric.Text);

})(typeof exports !== 'undefined' ? exports : this);
