(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      clone = fabric.util.object.clone,
      toFixed = fabric.util.toFixed,
      supportsLineDash = fabric.StaticCanvas.supports('setLineDash');

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
    'useNative',
    'path'
  );

  /**
   * Text class
   * @class fabric.Text
   * @extends fabric.Object
   * @return {fabric.Text} thisArg
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-2/#text}
   * @see {@link fabric.Text#initialize} for constructor definition
   */
  fabric.Text = fabric.util.createClass(fabric.Object, /** @lends fabric.Text.prototype */ {

    /**
     * Properties which when set cause object to change dimensions
     * @type Object
     * @private
     */
    _dimensionAffectingProps: {
      fontSize: true,
      fontWeight: true,
      fontFamily: true,
      textDecoration: true,
      fontStyle: true,
      lineHeight: true,
      stroke: true,
      strokeWidth: true,
      text: true
    },

    /**
     * @private
     */
    _reNewline: /\r?\n/,

    /**
     * Retrieves object's fontSize
     * @method getFontSize
     * @memberOf fabric.Text.prototype
     * @return {String} Font size (in pixels)
     */

    /**
     * Sets object's fontSize
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
     * Text alignment. Possible values: "left", "center", or "right".
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
    lineHeight:           1.3,

    /**
     * Background color of text lines
     * @type String
     * @default
     */
    textBackgroundColor:  '',

    /**
     * URL of a font file, when using Cufon
     * @type String | null
     * @default
     */
    path:                 null,

    /**
     * Indicates whether canvas native text methods should be used to render text (otherwise, Cufon is used)
     * @type Boolean
     * @default
     */
    useNative:            true,

    /**
     * List of properties to consider when checking if
     * state of an object is changed ({@link fabric.Object#hasStateChanged})
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties:      stateProperties,

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
     * fabric.Path that the text observes
     * @type fabric.Path
     */
    textPath: null,

    /**
     * If fabric.Text#textPath exists, should letters rotate along the path or not
     * @type Boolean
     */
    wantObservePathRotation: true,

    /**
     * If fabric.Text#textPath exists, should letters be subject to collision detection to help ensure legibility or not
     * @type Boolean
     */
    wantTextPathWithLessOverlap: false,

    /**
     * If fabric.Text#textPath exists, should a faded, untransformed version of fabric.Text#text be rendered or not
     * @type Boolean
     */
    wantTextPathResidue: true,

    /**
     * If fabric.Text#textPath exists and non-zero, the fabric.Path in fabric.Text#textPath will be approximated to this number of points; otherwise, path will be drawn as-is
     * @type Number
     */
    wantApproximationDetail: 0,

    /**
     * If true, do not destroy the fabric.Text#_boundaries object; otherwise, perform all boundary calculations every time
     * @type Boolean
     */
    isFrozen: false,

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
      this.setOptions(options);
      this.__skipDimension = false;
      this._initDimensions();
    },

    /**
     * Renders text object on offscreen canvas, so that it would get dimensions
     * @private
     */
    _initDimensions: function() {
      if (this.__skipDimension) {
        return;
      }
      var canvasEl = fabric.util.createCanvasElement();
      this._render(canvasEl.getContext('2d'));
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
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {

      if (typeof Cufon === 'undefined' || this.useNative === true) {
        this._renderViaNative(ctx);
      }
      else {
        this._renderViaCufon(ctx);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderViaNative: function(ctx) {
      var textLines = this.text.split(this._reNewline);

      this._setTextStyles(ctx);

      this.width = this._getTextWidth(ctx, textLines);
      this.height = this._getTextHeight(ctx, textLines);

      this.clipTo && fabric.util.clipContext(this, ctx);

      this._renderTextBackground(ctx, textLines);
      this._translateForTextAlign(ctx);
      this._renderText(ctx, textLines);

      if (this.textAlign !== 'left' && this.textAlign !== 'justify') {
        ctx.restore();
      }

      this._renderTextDecoration(ctx, textLines);
      this.clipTo && ctx.restore();

      this._setBoundaries(ctx, textLines);
      this._totalLineHeight = 0;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderText: function(ctx, textLines) {
      ctx.save();
      this._setShadow(ctx);
      this._setupFillRule(ctx);
      this._renderTextFill(ctx, textLines);
      this._renderTextStroke(ctx, textLines);
      this._restoreFillRule(ctx);
      this._removeShadow(ctx);
      ctx.restore();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _translateForTextAlign: function(ctx) {
      if (this.textAlign !== 'left' && this.textAlign !== 'justify') {
        ctx.save();
        ctx.translate(this.textAlign === 'center' ? (this.width / 2) : this.width, 0);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _setBoundaries: function(ctx, textLines) {
      // Only set the boundaries if necessary.
      if (this.isFrozen == null || this.isFrozen === false) {
        // Reset boundaries.
        this._boundaries = [];
        // If fabric.Text-like object supports the ability to get the width of a line, use that instead of the ctx[method] fabric.Text#_getLineWidth defers to.
        var supportsWidthOfLine = (this._getWidthOfLine == null) ? false : true;
        for (var lineIndex = 0, len = textLines.length; lineIndex < len; lineIndex++) {
          var lineWidth = (supportsWidthOfLine) ? this._getWidthOfLine(ctx, lineIndex, textLines) : this._getLineWidth(ctx, textLines[lineIndex]);
          var lineLeftOffset = this._getLineLeftOffset(lineWidth);
          this._boundaries.push({
            height: this._getHeightOfLine(ctx, lineIndex, textLines),
            width: lineWidth,
            left: lineLeftOffset
          });
        }
      } else {
        // If boundaries are already set, reset the flag to draw the residue.
        if (this.wantTextPathResidue && this._boundaries) {
          for (var lineIndex = 0, len = this._boundaries.length; lineIndex < len; lineIndex++) {
            this._boundaries[lineIndex].residueHasBeenDrawn = null;
          }
        }
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _setTextStyles: function(ctx) {
      this._setFillStyles(ctx);
      this._setStrokeStyles(ctx);
      ctx.textBaseline = 'alphabetic';
      if (!this.skipTextAlign) {
        ctx.textAlign = this.textAlign;
      }
      ctx.font = this._getFontDeclaration();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     * @return {Number} Height of fabric.Text object
     */
    _getTextHeight: function(ctx, textLines) {
      return this.fontSize * textLines.length * this.lineHeight;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     * @return {Number} Maximum width of fabric.Text object
     */
    _getTextWidth: function(ctx, textLines) {
      var maxWidth = ctx.measureText(textLines[0] || '|').width;

      for (var i = 1, len = textLines.length; i < len; i++) {
        var currentLineWidth = ctx.measureText(textLines[i]).width;
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
     * @param {String} chars Chars to render
     * @param {Number} left Left position of text
     * @param {Number} top Top position of text
     */
    _renderChars: function(method, ctx, chars, left, top) {
      ctx[method](chars, left, top);
    },

    /**
     * Render an unjustified line of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     */
    _renderUnjustifiedTextLine: function(method, ctx, line, left, top, lineIndex) {
      // If observing a path, go letter by letter through the line, render the character, and advance by the previous distance. Otherwise, render the characters normally.
      if (this.textPath) {
        this._renderTextLineOnTextPath(method, ctx, line, left, top, lineIndex);
      } else {
        this._renderChars(method, ctx, line, left, top, lineIndex);
      }
    },

    /**
     * Render a justified line of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     * @param {Number} totalWidth Width to fill; depends on existence of spaces to act as expandable targets.
     */
    _renderJustifiedTextLine: function(method, ctx, line, left, top, lineIndex, totalWidth) {
      // Stretch the line.
      var words = line.split(/\s+/), wordsWidth = ctx.measureText(line.replace(/\s+/g, '')).width, widthDiff = totalWidth - wordsWidth, numSpaces = words.length - 1, spaceWidth = widthDiff / numSpaces, leftOffset = 0;
      // If observing a path, go letter by letter through the line, render the character, and advance by the previous distance, optionally overriding the distance to be spaceWidth for spaces. Otherwise, render the line word by word, skipping over spaces by spaceWidth.
      if (this.textPath) {
        this._renderTextLineOnTextPath(method, ctx, line, left, top, lineIndex, spaceWidth);
      } else {
        for (var i = 0, len = words.length; i < len; i++) {
          this._renderChars(method, ctx, words[i], left + leftOffset, top, lineIndex);
          leftOffset += ctx.measureText(words[i]).width + spaceWidth;
        }
      }
    },

    /**
     * Generically render a line of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     */
    _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
      // Lift the line by a quarter of the fontSize.
      top -= this.fontSize / 4;
      // If the text isn't justified, render it without any additional tests.
      if (this.textAlign !== 'justify') {
        this._renderUnjustifiedTextLine(method, ctx, line, left, top, lineIndex);
      } else {
        // Otherwise, perform an initial justification test. If true, figure out how large spaces should actually be. Otherwise, render normally.
        var lineWidth = ctx.measureText(line).width, totalWidth = this.width;
        if (totalWidth > lineWidth) {
          this._renderJustifiedTextLine(method, ctx, line, left, top, lineIndex, totalWidth);
        } else {
          this._renderUnjustifiedTextLine(method, ctx, line, left, top, lineIndex);
        }
      }
    },

    /**
     * @private
     * @return {Number} Left offset
     */
    _getLeftOffset: function() {
      if (fabric.isLikelyNode) {
        return 0;
      }
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
     * @param {Array} textLines Array of all text lines
     */
    _renderTextFill: function(ctx, textLines) {
      if (!this.fill && !this._skipFillStrokeCheck) {
        return;
      }
      if (this._boundaries == null || this.isFrozen == null || this.isFrozen === false) {
        this._boundaries = [];
      }
      this._renderTextLines("fillText", ctx, textLines);
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextStroke: function(ctx, textLines) {
      if ((this.stroke == null || this.strokeWidth === 0) && !this._skipFillStrokeCheck) {
        return;
      }
      ctx.save();
      if (this.strokeDashArray) {
        // Spec requires the concatenation of two copies the dash list when the number of elements is odd
        if (1 & this.strokeDashArray.length) {
          this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
        }
        supportsLineDash && ctx.setLineDash(this.strokeDashArray);
      }
      ctx.beginPath();
      if (this._boundaries == null) {
        this._boundaries = [];
      }
      this._renderTextLines("strokeText", ctx, textLines);
      ctx.closePath();
      ctx.restore();
    },

    _getHeightOfLine: function() {
      return this.fontSize * this.lineHeight;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextBackground: function(ctx, textLines) {
      // If no text path, draw normally. Otherwise, depend on fill or stroke pass.
      if (this.textPath == null) {
        this._renderTextBoxBackground(ctx);
        this._renderTextLinesBackground(ctx, textLines);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderTextBoxBackground: function(ctx) {
      if (!this.backgroundColor) {
        return;
      }

      ctx.save();
      ctx.fillStyle = this.backgroundColor;

      ctx.fillRect(
        this._getLeftOffset(),
        this._getTopOffset(),
        this.width,
        this.height
      );

      ctx.restore();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextLinesBackground: function(ctx, textLines) {
      if (!this.textBackgroundColor) {
        return;
      }

      ctx.save();
      ctx.fillStyle = this.textBackgroundColor;

      for (var i = 0, len = textLines.length; i < len; i++) {

        if (textLines[i] !== '') {

          var lineWidth = this._getLineWidth(ctx, textLines[i]),
              lineLeftOffset = this._getLineLeftOffset(lineWidth);

          ctx.fillRect(
            this._getLeftOffset() + lineLeftOffset,
            this._getTopOffset() + (i * this.fontSize * this.lineHeight),
            lineWidth,
            this.fontSize * this.lineHeight
          );
        }
      }
      ctx.restore();
    },

    /**
     * Gets the text lines this fabric.Text object represents (in array format)
     * @private
     * @return {Array} Array of text lines, split at new lines.
     */
    _getTextLines: function() {
      return this.text.split(this._reNewline);
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
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text line
     * @return {Number} Line width
     */
    _getLineWidth: function(ctx, line) {
      return this.textAlign === 'justify'
        ? this.width
        : ctx.measureText(line).width;
    },

    /**
     * Get the lines in order of widest to least wide
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _getOrderOfWidestLines: function(ctx, textLines) {
      // Ordering by line width is required by the text on path feature, which requires knowing the individual line boundaries.
      if (this._boundaries.length == 0) {
        textLines = (textLines == null) ? textLines : this._getTextLines();
        this._setBoundaries(ctx, textLines);
      }
      // Prepare a place to store the ordered indices.
      var order = [];
      // Get a copy of the boundaries.
      var objectsToOrderByWidth = this._boundaries.slice(0);
      // Do the sort by longest width.
      while (objectsToOrderByWidth.length > 0) {
        var current = objectsToOrderByWidth.shift();
        // Compare current to everything that's left.
        var foundWiderLine = false;
        for (var i = 0, len = objectsToOrderByWidth.length; i < len && !foundWiderLine; i++) {
          var comparison = objectsToOrderByWidth[i];
          // If the comparison object is wider than the current object, no further testing is needed for this pass.
          if (comparison.width > current.width) {
            // Put the current object back on the stack.
            objectsToOrderByWidth.push(current);
            // Break out.
            foundWiderLine = true;
          }
        }
        if (!foundWiderLine)
          order.push(this._boundaries.indexOf(current));
      }
      return order;
    },

    /**
     * Gets the maximum line width for the text this fabric.Text object represents
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     * @return {Number} Width of the longest text line.
     */
    _getMaximumLineWidth: function(ctx, textLines) {
      var width = 0;
      // Maximum line width is required by the text on path feature, which requires knowing the individual line boundaries.
      if (this._boundaries.length == 0) {
        textLines = (textLines == null) ? textLines : this._getTextLines();
        this._setBoundaries(ctx, textLines);
      }
      for (var i = 0, len = this._boundaries.length; i < len; i++) {
        width = (this._boundaries[i].width > width) ? this._boundaries[i].width : width;
      }
      return width;
    },

    /**
     * Gets the line height without explicitly specifying the text lines this fabric.Text object represents
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @return {Number} Height of the text.
     */
    _getObservedTotalLineHeight: function(ctx) {
      var textLines = this._getTextLines();
      return this._getTextHeight(ctx, textLines);
    },

    /**
     * Renders decorations ("underline", "line-through", "overline") found in fabric.Text#textDecoration
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextDecoration: function(ctx, textLines) {
      if (!this.textDecoration) {
        return;
      }
      var doUnderline = (this.textDecoration.indexOf("underline") > -1) ? true : false;
      var doLineThrough = (this.textDecoration.indexOf("line-through") > -1) ? true : false;
      var doOverline = (this.textDecoration.indexOf("overline") > -1) ? true : false;
      // If there is no text path, draw the lines normally. Otherwise, plot the line and draw it.
      if (this.textPath == null) {
        var halfOfVerticalBox = this._getTextHeight(ctx, textLines) / 2,
          _this = this;
        /** @ignore */
        function renderLinesAtOffset(offset) {
          for (var i = 0, len = textLines.length; i < len; i++) {
            var lineWidth = _this._getLineWidth(ctx, textLines[i]),
              lineLeftOffset = _this._getLineLeftOffset(lineWidth);
            ctx.fillRect(
              _this._getLeftOffset() + lineLeftOffset,
              ~~((offset + (i * _this._getHeightOfLine(ctx, i, textLines))) - halfOfVerticalBox),
              lineWidth,
              1);
          }
        }
        if (doUnderline) {
          renderLinesAtOffset(this.fontSize * this.lineHeight);
        }
        if (doLineThrough) {
          renderLinesAtOffset(this.fontSize * this.lineHeight - this.fontSize / 2);
        }
        if (doOverline) {
          renderLinesAtOffset(this.fontSize * this.lineHeight - this.fontSize);
        }
      } else {
        var supportsSpecificStyles = (this.getCurrentCharStyle == null) ? false : true;
        if (doUnderline || supportsSpecificStyles) {
          this._renderTextDecorationOnTextPath(ctx, "underline");
        }
        if (doLineThrough || supportsSpecificStyles) {
          this._renderTextDecorationOnTextPath(ctx, "line-through");
        }
        if (doOverline || supportsSpecificStyles) {
          this._renderTextDecorationOnTextPath(ctx, "overline");
        }
      }
    },

    /**
     * Renders decorations ("underline", "line-through", "overline") found in fabric.Text#textDecoration specifically for text on the fabric.Path located in fabric.Text#textPath
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} decoration Specific decoration; valid values: "underline", "line-through", and "overline".
     */
    _renderTextDecorationOnTextPath: function(ctx, decoration) {
      // Create top offset.
      var runningLineHeight = 0;
      var supportsSpecificStyles = (this.getCurrentCharStyle == null) ? false : true;
      // Deal with horizontal translation from text alignment.
      var crutchX = (this.textAlign === "left" || this.textAlign === "justify") ? 0 : (this.textAlign === "center") ? (this.width / 2) : this.width;
      for (var lineIndex = 0, len = this._boundaries.length; lineIndex < len; lineIndex++) {
        var lineBoundary = this._boundaries[lineIndex];
        var verticalAdjustment = this._getTopOffset() + runningLineHeight + lineBoundary.height / 2;
        runningLineHeight += lineBoundary.height;
        // Push settings.
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.fill || this.stroke || "black";
        ctx.beginPath();
        var hadLine = false;
        for (var charIndex = 0, lineLength = lineBoundary.letters.length; charIndex < lineLength; charIndex++) {
          // Get character style. Character indices in line styles are one-index rather than zero-index.
          var style = (!supportsSpecificStyles) ? this : this.getCurrentCharStyle(lineIndex, charIndex + 1);
          var command = (style.textDecoration && style.textDecoration.indexOf(decoration) > -1) ? "lineTo" : "moveTo";
          // Get letter entry.
          var letterEntry = lineBoundary.letters[charIndex];
          // Get center point of drawing.
          var point = letterEntry.point;
          // Get delta to point (slides up or down).
          var deltaToPoint;
          // Get perpendicular angle. Default (at a 0 degree tangent) is 90 degrees. TODO: Interpolation for less harsh visual result.
          var perpendicularAngle = point.angleOfTangentInRadians + Math.PI / 2;
          var thisVerticalAdjustment = (this.type === "i-text") ? verticalAdjustment + this.fontSize / 4 : verticalAdjustment;
          var distanceToMove;
          if (decoration === "underline") {
            // Try to shift the line down.
            distanceToMove = thisVerticalAdjustment + point.halfHeightOfLetter;
          } else if (decoration === "overline") {
            // Try to shift the line up.
            distanceToMove = -1 * (-thisVerticalAdjustment + point.halfHeightOfLetter);
          } else {
            distanceToMove = thisVerticalAdjustment;
          }
          deltaToPoint = new fabric.Point(crutchX + distanceToMove * Math.cos(perpendicularAngle), distanceToMove * Math.sin(perpendicularAngle));
          // 
          if (!hadLine && command === "lineTo") {
            // If this point happens after no line (like at the start of the process), it's necessary to draw a segment from the left edge to the center.
            var deltaToStartPoint = new fabric.Point(-point.halfWidth * Math.cos(point.angleOfTangentInRadians), -point.halfWidth * Math.sin(point.angleOfTangentInRadians));
            ctx.moveTo(deltaToPoint.x + point.x + deltaToStartPoint.x, deltaToPoint.y + point.y + deltaToStartPoint.y);
            ctx[command](deltaToPoint.x + point.x, deltaToPoint.y + point.y);
          } else if (charIndex == (lineLength - 1)) {
            // If this point is the very last point, it's necessary to draw a segment from the center to the right edge.
            var deltaToEndPoint = new fabric.Point(point.halfWidth * Math.cos(point.angleOfTangentInRadians), point.halfWidth * Math.sin(point.angleOfTangentInRadians));
            ctx[command](deltaToPoint.x + point.x + deltaToEndPoint.x, deltaToPoint.y + point.y + deltaToEndPoint.y);
            } else if (command === "moveTo") {
            // In case of skipped text decoration at the character level, slide to the right edge.
            var deltaToEdgePoint = new fabric.Point(point.halfWidth * Math.cos(point.angleOfTangentInRadians), point.halfWidth * Math.sin(point.angleOfTangentInRadians));
            ctx[command](deltaToPoint.x + point.x + deltaToEdgePoint.x, deltaToPoint.y + point.y + deltaToEdgePoint.y);
          } else {
            // Point is along an existing line.
            ctx[command](deltaToPoint.x + point.x, deltaToPoint.y + point.y);
            // To help deal with skips, make a segment to the edge as well.
            var deltaToEdgePoint = new fabric.Point(point.halfWidth * Math.cos(point.angleOfTangentInRadians), point.halfWidth * Math.sin(point.angleOfTangentInRadians));
            ctx[command](deltaToPoint.x + point.x + deltaToEdgePoint.x, deltaToPoint.y + point.y + deltaToEdgePoint.y);
          }
          // Track if had line or not.
          hadLine = (command === "lineTo") ? true : false;
        }
        ctx.strokeStyle = (lineIndex % 2) ? "red" : ctx.strokeStyle;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
    },

    /**
     * @private
     */
    _getFontDeclaration: function() {
      return [
        // node-canvas needs "weight style", while browsers need "style weight"
        (fabric.isLikelyNode ? this.fontWeight : this.fontStyle),
        (fabric.isLikelyNode ? this.fontStyle : this.fontWeight),
        this.fontSize + 'px',
        (fabric.isLikelyNode ? ('"' + this.fontFamily + '"') : this.fontFamily)
      ].join(' ');
    },

    /**
     * Render an array of text lines in the requested way, ordered by widest line first
     * @private
     * @param {String} method Context method to call ("fillText", "strokeText", etc)
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextLines: function(method, ctx, textLines) {
      // Order the lines by widest first. This is a step required by the text-on-path feature in order to support right, center, and justify alignments.
      var order = (!this.textPath) ? textLines.map(function (line) { return textLines.indexOf(line); }) : this._getOrderOfWidestLines(ctx, textLines);
      // To be forward compatible with fabric.IText, it's important to go the long route, even though fabric.Text doesn't require it.
      var copyOfOrder = order.slice(0);
      var lineHeights = [];
      while (copyOfOrder.length > 0) {
        var currentIndex = copyOfOrder.shift();
        var lineHeight = this._getHeightOfLine(ctx, currentIndex, textLines);
        lineHeights[currentIndex] = lineHeight;
      }
      // Render the lines in order of width.
      while (order.length > 0) {
        var currentIndex = order.shift();
        // Sum the observed line heights up to (and including) the current index.
        var summedLineHeight = lineHeights.slice(0, currentIndex + 1).reduce(function(a, b) { return a + b; }, 0);
        this._renderTextLine(
          method,
          ctx,
          textLines[currentIndex],
          this._getLeftOffset(),
          this._getTopOffset() + summedLineHeight,
          currentIndex
        );
      }
    },

    /**
     * Gets the angle of the tangent near the specified distance
     * @private
     * @param {Number} distance Distance along the fabric.Path object stored in fabric.Text#textPath
     */
    _getAngleOfTangentAtDistanceInDegrees: function(distance) {
      var angle = 0;
      if (this.textPath) {
        // Get two distances to represent the tangent.
        var leftDistance = distance - 0.00075,
          rightDistance = distance + 0.00075;
        // Get two points to represent the tangent.
        var leftPoint = this.textPath.getPointAtLength(leftDistance);
        var rightPoint = this.textPath.getPointAtLength(rightDistance);
        // Calculate angle of the tangent.
        angle = leftPoint.degreesBetween(rightPoint);
      }
      // Send the angle back.
      return angle;
    },

    /**
     * Gets the distance along the path traced by fabric.Text#textPath required to show an object of size: (widthOfCharacter, halfNonTransformedHeight) @ angleInDegrees
     * @private
     * @param {Number} angleInDegrees Angle in degrees; clamped to first quadrant of unit-circle.
     * @param {Number} halfNonTransformedHeight Height of the object.
     * @param {Number} widthOfCharacter Width of the object.
     * @return {Number} Suggested parametric distance along the fabric.Text#textPath to consume for the object.
     */
    _getDistanceConsumptionGivenAngleInDegrees: function(angleInDegrees, halfNonTransformedHeight, widthOfCharacter) {
      // Circularly clamp the angle to be from 0 to 90 degrees.
      var rotationInFirstQuadrantOfUnitCircle = Math.abs(angleInDegrees) % 90;
      // Calculate the percentage of height and width this suggests (100% height at 90, 100% width at 0, 50% of both at 45).
      var percentOfHeight = rotationInFirstQuadrantOfUnitCircle / 90;
      var percentOfWidth = 1 - percentOfHeight;
      // Calculate the distance to be consumed in total.
      var requiredDistance = percentOfHeight * halfNonTransformedHeight + percentOfWidth * widthOfCharacter;
      // Send it back.
      return requiredDistance;
    },

    /**
     * Gets the maximum distance consumption along the path in fabric.Text#textPath for the text this fabric.Text object represents
     * @private
     * @return {Number} Distance consumption required by the text in fabric.Text#text.
     */
    _getMaximumConsumedDistance: function() {
      if (this._boundaries.length > 0) {
        var distance;
        for (var i = 0, len = this._boundaries.length; i < len; i++) {
          var current = this._boundaries[i];
          if (!(current.consumedDistance == null)) {
            if (distance == null || current.consumedDistance > distance) {
              distance = current.consumedDistance;
            }
          }
        }
        return distance;
      }
      return undefined;
    },

    /**
     * Render a version of the text in fabric.Text#text untransformed by the fabric.Path in fabric.Text#textPath; style of text is intentionally faded out
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to render
     * @param {Number} left Left position of text
     * @param {Number} top Top position of text
     * @param {Number} lineIndex Index of a line in a text
     */
    _drawTextResidueIfNecessary: function(method, ctx, line, left, top, lineIndex) {
      if (this.wantTextPathResidue && this.textPath) {
        // Has the residue already been drawn?
        var isFirstPass = (this._boundaries[lineIndex].residueHasBeenDrawn == null || !this._boundaries[lineIndex].residueHasBeenDrawn) ? true : false;
        if (isFirstPass) {
          var textPath = this.textPath;
          var globalAlpha = ctx.globalAlpha;
          this.textPath = null;
          ctx.fillStyle = "#000000";
          ctx.globalAlpha = 0.05;
          var crutchY = (this.type == "i-text") ? 0 : this.fontSize / 4;
          this._renderTextLine(method, ctx, line, left, top + crutchY, lineIndex);
          this.textPath = textPath;
          ctx.fillStyle = this.fill;
          ctx.globalAlpha = globalAlpha;
          // Draw dashed box.
          if (lineIndex == 0) {
            // Copy data out.
            var previousBorderColor = this.borderColor;
            var hasBorders = this.hasBorders;
            var hasRotatingPoint = this.hasRotatingPoint;
            var isMoving = this.isMoving;
            var borderOpacityWhenMoving = this.borderOpacityWhenMoving;
            // Replace it.
            this.borderColor = "#000000";
            this.hasBorders = true;
            this.hasRotatingPoint = false;
            this.borderOpacityWhenMoving = 0.1;
            this.isMoving = true;
            // If the canvas matrix has been translated (center or right alignments), get the amount to slide the drawing back into place.
            var crutchX = (this.textAlign === "left" || this.textAlign === "justify") ? 0 : (this.textAlign === "center") ? (-this.width / 2) : -this.width;
            ctx.save();
            ctx.setLineDash([2, 3]);
            ctx.translate(crutchX, 0);
            this.drawBorders(ctx);
            ctx.restore();
            this.borderColor = previousBorderColor;
            this.hasBorders = hasBorders;
            this.hasRotatingPoint = hasRotatingPoint;
            this.borderOpacityWhenMoving = borderOpacityWhenMoving;
            this.isMoving = isMoving;
          }
          //
          this._boundaries[lineIndex].residueHasBeenDrawn = true;
        }
      }
    },

    /**
     * Get a 4-point bounding box polygon that represents a box of size (2 * halfWidthOfLetter, 2 * halfHeightOfLetter) @ angleInDegrees
     * @private
     * @param {fabric.Point} point Represents center point of drawing.
     * @param {Number} top Offset used to provide additional vertical placement for the center point.
     * @param {Number} halfWidthOfLetter Half the width of the object.
     * @param {Number} halfHeightOfLetter Half the height of the object.
     * @param {Number} angleInDegrees Angle in degrees to transform the original bounding box points by.
     * @param {Boolean} reverseMode If the mode is reversed (in the case of fabric.Text#textAlign "right"), make it so that the edges logically match up with the indices of all the other cases (i.e. not "right").
     * @return {Array} An array of fabric.Point objects that represent the polygon.
     */
    _getMinorBoundingBoxAroundPoint: function(point, top, halfWidthOfLetter, halfHeightOfLetter, angleInDegrees, reverseMode) {
      if (reverseMode == null) {
        reverseMode = false;
      }
      // Get lines. X represents the leading edge, which is the right edge in non-right-aligned cases, and the left edge otherwise.
      var x = (!reverseMode) ? point.x - halfWidthOfLetter : point.x + halfWidthOfLetter,
          x2 = (!reverseMode) ? point.x + halfWidthOfLetter : point.x - halfWidthOfLetter;
      // Get the points that represent an unrotated box around just the letter.
      var thisUntransformedUpperLeadingPoint = new fabric.Point(x, point.y + top - halfHeightOfLetter),
          thisUntransformedLowerLeadingPoint = new fabric.Point(x, point.y + top + halfHeightOfLetter),
          thisUntransformedLowerTrailingPoint = new fabric.Point(x2, point.y + top + halfHeightOfLetter),
          thisUntransformedUpperTrailingPoint = new fabric.Point(x2, point.y + top - halfHeightOfLetter);
      // Rotate point around center.
      var radians = fabric.util.degreesToRadians(angleInDegrees);
      var thisMinorBoundingBox = [
        fabric.util.rotatePoint(thisUntransformedUpperLeadingPoint, point, radians),
        fabric.util.rotatePoint(thisUntransformedLowerLeadingPoint, point, radians),
        fabric.util.rotatePoint(thisUntransformedLowerTrailingPoint, point, radians),
        fabric.util.rotatePoint(thisUntransformedUpperTrailingPoint, point, radians)
      ];
      return thisMinorBoundingBox;
    },

    /**
     * Determine if two (4-point) bounding boxes share one and only one edge
     * @private
     * @param {Array} boundingBox Represents a reference bounding box.
     * @param {Array} otherBoundingBox Represents a comparison bounding box.
     * @return {Boolean} If the two bounding boxes only share one edge, then true. Otherwise, false.
     */
    _pointsShareOnlyOneEdge: function(boundingBox, otherBoundingBox) {
      var sharedCount = 0;
      for (var c = 0, len = boundingBox.length; c < len; c++) {
        var firstIndex = c % len,
          secondIndex = (c + 1) % len,
          firstNotIndex = (c + 3) % len,
          secondNotIndex = (c + 2) % len;
        var p1 = boundingBox[firstIndex];
        var p2 = boundingBox[secondIndex];
        var pNot1 = otherBoundingBox[firstNotIndex];
        var pNot2 = otherBoundingBox[secondNotIndex];
        if (p1.eq(pNot1) && p2.eq(pNot2)) {
          sharedCount += 1;
        }
      }
      return (sharedCount == 1) ? true : false;
    },

    /**
     * Gets an acceptable center point for an object along the fabric.Path in fabric.Text#textPath
     * @private
     * @param {Number} runningDistance Distance along the path to start calculations.
     * @param {Number} widthOfCharacter Width of the object.
     * @param {Number} halfWidth Half of the width of the object (calculated elsewhere).
     * @param {Number} halfHeightOfLetter Half the height of the object.
     * @param {Number} halfNonTransformedHeight Half the height the object is contained in (ex. total line height).
     * @param {Number} top Vertical offset of line.
     * @param {fabric.Point} previousPoint Previous center point.
     * @param {Boolean} reverseMode If false, calculations move from left to right. Otherwise, calculations move from right to left.
     * @param {Boolean} wantLessTextPathOverlapFeature If false, consume the very least distance required by the object. Otherwise, perform collision detection on the generated bounding boxes (looks one bounding box backwards) to place discontinuities along the path function in order to more intuitively place objects along the path.
     * @return {fabric.Point} Acceptable center point on path of fabric.Text#textPath to draw object.
     */
    _getAcceptablePoint: function(runningDistance, widthOfCharacter, halfWidth, halfHeightOfLetter, halfNonTransformedHeight, top, previousPoint, reverseMode, wantLessTextPathOverlapFeature) {
      // If the less overlap feature is requested, provide the necessary information.
      var lastDistanceToConsume, lastMinorBoundingBox;
      if (wantLessTextPathOverlapFeature) {
        lastMinorBoundingBox = previousPoint.boundingBox;
        lastDistanceToConsume = previousPoint.distanceToConsume;
      }
      // Represents where the object would be placed if the line were completely horizontal. Use to find a tangent.
      var initialDistancePlusHalfWidth = (!reverseMode) ? runningDistance + halfWidth : runningDistance - halfWidth;
      // Prepare a place to store the angle of the tangent (may be reset to avoid rotation at request).
      var angleOfTangentInDegrees;
      // Prepare a place to store the consumable distance.
      var distanceToConsume, halfDistanceToConsume;
      // Prepare a place to store the point.
      var point,
        pass = 0,
        extraPassLimit = 10,
        pointIsNotAcceptable = true,
        thisDistancePlusHalfWidth = initialDistancePlusHalfWidth;
      // Placement passes. An intersection test is done between the current minor bounding box and the previous letter's minor bounding box. The iteration has the ability to run until either the two boxes no longer intersect or the pass limit has been exceeded. Currently, this is a guess and check feature.
      while (pointIsNotAcceptable) {
        // Get the angle of the tangent in degrees.
        var angleOfTangentInDegrees = this._getAngleOfTangentAtDistanceInDegrees(thisDistancePlusHalfWidth);
        // If this object does not observe rotation, the width of the glyph will not accurately represent the consumed distance, so obtain something indicative of what will actually be used. Otherwise, just use the width.
        if (!this.wantObservePathRotation) {
          // Get distance on line that will be consumed by this glyph.
          distanceToConsume = this._getDistanceConsumptionGivenAngleInDegrees(angleOfTangentInDegrees, halfNonTransformedHeight, widthOfCharacter);
          // Reset angle.
          angleOfTangentInDegrees = 0;
        } else {
          distanceToConsume = widthOfCharacter;
        }
        halfDistanceToConsume = distanceToConsume / 2;
        var thisPoint = this.textPath.getPointAtLength(thisDistancePlusHalfWidth, true);
        // If there isn't a new point or if the new point is the same as the last one (in the case of hitting the end of a path), the point is acceptable.
        if (point == null || !point.eq(thisPoint)) {
          point = thisPoint;
        } else {
          pointIsNotAcceptable = false;
        }
        // Overlapping at convex spots along a line is by design, but this can be mathematically altered if requested.
        if (wantLessTextPathOverlapFeature && pointIsNotAcceptable && pass < extraPassLimit)
        {
          // Get bounding box of the letter (as opposed to of the letter in the total observed line height).
          var thisMinorBoundingBox = this._getMinorBoundingBoxAroundPoint(point, top, halfWidth, halfHeightOfLetter, angleOfTangentInDegrees, reverseMode);
          // Update the bounding box.
          point.boundingBox = thisMinorBoundingBox;
          // Do an initial check to see if the bounding boxes are arranged end to end (in which case, objects are adjacent to each other already).
          var pointsShareOnlyOneEdge = this._pointsShareOnlyOneEdge(thisMinorBoundingBox, lastMinorBoundingBox);
          // If the two bounding boxes don't share only one edge, see if they intersect.
          if (!pointsShareOnlyOneEdge) {
            var intersectionTest = fabric.Intersection.intersectPolygonPolygon(thisMinorBoundingBox, lastMinorBoundingBox);
            // If intersects, get minimum distance to prevent intersection.
            if (intersectionTest.status == "Intersection" && intersectionTest.points.length >= 2) {
              var averageDistanceConsumedByTwoBoundingBoxes = (lastDistanceToConsume + distanceToConsume) / 2;
              // Rather than attempt to figure out where on the line actually will provide an appropriate, non-overlapping placement, just shove the character over more and more (up to five-seconds of the largest distance to consume at a time).
              var clearDistance = averageDistanceConsumedByTwoBoundingBoxes / Math.max(2.5, (10 - pass));
              // If the distance is greater than zero, go find the point at a .
              if (!(clearDistance == null) && clearDistance > 0) {
                thisDistancePlusHalfWidth += (!reverseMode) ? clearDistance : -clearDistance;
              } else {
                pointIsNotAcceptable = false;
              }
            } else {
              pointIsNotAcceptable = false;
            }
          } else {
            pointIsNotAcceptable = false;
          }
          pass += 1;
        } else {
          pointIsNotAcceptable = false;
        }
      }
      // Stick information important to the rendering method (and, by proxy, the freezing process).
      if (!(point == null)) {
        point.distanceToConsume = distanceToConsume;
        point.runningDistanceAfter = (!reverseMode) ? thisDistancePlusHalfWidth + halfDistanceToConsume : thisDistancePlusHalfWidth - halfDistanceToConsume;
        point.angleOfTangentInRadians = fabric.util.degreesToRadians(angleOfTangentInDegrees);
        point.halfWidth = halfWidth;
        point.halfHeightOfLetter = halfHeightOfLetter;
        point.widthOfCharacter = widthOfCharacter;
        if (point.boundingBox == null) {
          point.boundingBox = this._getMinorBoundingBoxAroundPoint(point, top, halfWidth, halfHeightOfLetter, angleOfTangentInDegrees, reverseMode);
        }
      }
      // Return the point (along with its metadata).
      return point;
    },

    /**
     * Generate and render a bounding box of size (2 * halfWidth, 2 * halfBoundingBoxHeight), adjusted by verticalOffset
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Number} halfWidth Half width of the object.
     * @param {Number} halfBoundingBoxHeight Half height of the object.
     * @param {Number} verticalOffset Top position of text.
     */
    _renderBoundingBox: function(method, ctx, halfWidth, halfBoundingBoxHeight, verticalOffset) {
      // Shift the drawing up as necessary. Default draws horizontally along the vertical center of the text object.
      ctx.translate(0, verticalOffset);
      // Draw expected boundary.
      ctx.beginPath();
      ctx.moveTo(-halfWidth, -halfBoundingBoxHeight);
      ctx.lineTo(halfWidth, -halfBoundingBoxHeight);
      ctx.lineTo(halfWidth, halfBoundingBoxHeight);
      ctx.lineTo(-halfWidth, halfBoundingBoxHeight);
      ctx.lineTo(-halfWidth, -halfBoundingBoxHeight);
      ctx[method](); //stroke();
      ctx.closePath();
      // Reverse the vertical shift.
      ctx.translate(0, -verticalOffset);
    },

    /**
     * Render a letter of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} letter Text to render.
     * @param {fabric.Point} point Center point to render text at.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line the text is in.
     * @param {Number} halfNonTransformedHeight Half of the height the letter exists in.
     * @param {Number} summedLineHeight The inclusive sum of previous line heights.
     * @param {object} style A dictionary of style choices relevant to the context.
     * @param {Boolean} approximating If true, turn off computationally-intensive features. Otherwise, render to the best of the algorithm's ability.
     */
    _renderLetterAtPoint: function(method, ctx, letter, point, top, lineIndex, halfNonTransformedHeight, summedLineHeight, style, approximating) {
      // If the center point of the letter's bounding box exists, render the letter and the bounding box (if requested) around it.
      if (point) {
        // Push the current drawing matrix.
        ctx.save();
        // Set all the style settings.
        this._pushStyleToContext(ctx, style);
        // Reposition origin such that the drawing will occur around a horizontally sliding center point.
        ctx.translate(point.x, point.y);
        // Centrally rotate the future drawing by the angle of the tangent.
        ctx.rotate(point.angleOfTangentInRadians);
        var halfWidth = point.halfWidth,
          halfHeightOfLetter = point.halfHeightOfLetter;
        // Do background passes beneath letters. Depends on render order being: fillText -> strokeText.
        var isFirstPass = (method === "fillText" || (method === "strokeText" && style.fill == null)) ? true : false;
        if (isFirstPass && (style.textBackgroundColor || style.backgroundColor)) {
          ctx.save();
          // Determine whether a full bounding box or a minor bounding box will be drawn.
          var isFullBoundingBox = false;
          // Stroke grey for full bounding box. Stroke blue for minor bounding box.
          ctx.strokeStyle = (isFullBoundingBox) ? "#888" : "#0020c2";
          var halfBoundingBoxHeight = (isFullBoundingBox) ? halfNonTransformedHeight : halfHeightOfLetter;
          if (!isFullBoundingBox && this.type == "i-text") {
            halfBoundingBoxHeight += halfHeightOfLetter / 4;
          }
          var verticalOffset = (isFullBoundingBox) ? 0 : summedLineHeight - halfNonTransformedHeight - halfBoundingBoxHeight;
          if (style.backgroundColor) {
            ctx.fillStyle = style.backgroundColor;
            this._renderBoundingBox("fill", ctx, halfWidth, halfBoundingBoxHeight, verticalOffset);
          }
          if (style.textBackgroundColor) {
            ctx.fillStyle = style.textBackgroundColor;
            this._renderBoundingBox("fill", ctx, halfWidth, halfBoundingBoxHeight, verticalOffset);
          }
          ctx.restore();
        }
        // Refuse to render individual characters if necessary.
        var fillTextButNoFillDefinition = (method === "fillText" && style.fill == null) ? true : false;
        var strokeTextButNoStrokeDefinition = (method === "strokeText" && (style.stroke == null || style.strokeWidth === 0)) ? true : false;
        if (!fillTextButNoFillDefinition && !strokeTextButNoStrokeDefinition) {
          // Horizontally reposition result of context drawing in case of center and right.
          var adjustmentToContextDrawing = (this.textAlign === "center") ? -halfWidth : 0;
          // Determine where the local left offset is.
          var left = (this.textAlign !== "center" && this.textAlign !== "right") ? -halfWidth : halfWidth;
          ctx.translate(adjustmentToContextDrawing, 0);
          // Render the character, sliding the height by the top value. WARN: Do not call this._renderChars in place of ctx[method], since an override can exist that does non-essential transforms.
          ctx[method](letter, left, top);
          ctx.translate(-adjustmentToContextDrawing, 0);
        }
        // Pop the drawing matrix used to get the letter drawn off the stack.
        ctx.restore();
      }
    },

    /**
     * Render a letter of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     * @param {Boolean} approximating If true, turn off computationally-intensive features. Otherwise, render to the best of the algorithm's ability.
     * @param {Boolean} spaceWidth If defined, width of space to use in place of measured width (specifically, for purposes of justification).
     */
    _calculateTextLineOnTextPath: function(method, ctx, line, left, top, lineIndex, approximating, spaceWidth) {
      // w/h: function(ctx, lineIndex, charIndex, lines)
      var hasSpecificWidth = (this._getWidthOfCharAt == null) ? false : true;
      var hasSpecificHeight = (this._getHeightOfCharAt == null) ? false : true;
      // For justification purposes, define the width of a space.
      var overrideSpaceWidth = (spaceWidth == null) ? false : true;
      // If the canvas matrix has been translated (center or right alignments), get the amount to slide the drawing back into place.
      var crutchX = (this.textAlign === "left" || this.textAlign === "justify") ? 0 : (this.textAlign === "center") ? (-this.width / 2) : -this.width;
      // Determine the starting distance along the observed path.
      var startingDistance, reverseMode = false;
      if (this.textAlign === "center") {
        var maximumConsumedDistance = this._getMaximumConsumedDistance() || this._getMaximumLineWidth(ctx);
        startingDistance = (maximumConsumedDistance - this._boundaries[lineIndex].width) / 2;
      } else if (this.textAlign === "right") {
        var maximumConsumedDistance = this._getMaximumConsumedDistance();
        if (maximumConsumedDistance == null) {
          startingDistance = 0;
        } else {
          startingDistance = maximumConsumedDistance;
          reverseMode = true;
          // Reverse the text order.
          line = line.split("").reverse().join("");
        }
      } else {
        startingDistance = 0;
      }
      // Obtain single line height.
      var heightOfLetter = this._getHeightOfLine(ctx, lineIndex, this._getTextLines());
      var halfHeightOfLetter = heightOfLetter / 2;
      // Obtain the height of the untransformed bounding box that the unpathed text would have created.
      var nonTransformedHeightOfAllLines = this._getObservedTotalLineHeight(ctx);
      var halfNonTransformedHeight = nonTransformedHeightOfAllLines / 2;
      // Obtain the width of the untransformed bounding box that the unpathed text would have created.
      var nonTransformedMaximumLineWidth = this._getMaximumLineWidth(ctx);
      var halfNonTransformedMaximumLineWidth = nonTransformedMaximumLineWidth / 2;
      // Get the center of the object.
      var centerOfTextObject = this.getCenterPoint();
      // Get the center of what's being observed.
      var centerOfPathObject = this.textPath.getCenterPoint();
      // Find out how far away the two objects are from each other (to relatively offset the text object as a whole).
      var distanceFromPathCenterX = centerOfPathObject.x - centerOfTextObject.x, distanceFromPathCenterY = centerOfPathObject.y - centerOfTextObject.y;
      // -(Center - Width / 2 + Horizontal Distance from Observation), -(Center - Height / 2 + Vertical Distance from Observation); equivalent to -this.left, -this.top if both objects are centered on each other, but left/top values may change during rotation (and can't be reliably used).
      var drawingOffsetX = crutchX + -(centerOfTextObject.x - halfNonTransformedMaximumLineWidth + distanceFromPathCenterX), drawingOffsetY = -(centerOfTextObject.y - halfNonTransformedHeight + distanceFromPathCenterY);
      // Track the distance along the line. For a horizontal line (unpathed text), this would increment by the width of the character.
      var runningDistance = !(this.textPathDistanceOffset == null) ? this.textPathDistanceOffset + startingDistance : startingDistance;
      // For the feature wantLessTextPathOverlapFeature, track a lot of the information about the point at which the previous letter was drawn at.
      var lastPoint;
      // Prepare a place to cache the points (basically required by fabric.IText needing to constantly draw because of the animated caret line). 
      this._boundaries[lineIndex].letters = [];
      // Iterate the line character by character.
      for (var charIndex = 0, len = line.length; charIndex < len; charIndex++) {
        // Letter, space, etc.
        var letter = line[charIndex];
        // If in reverse mode, complement the character index by length.
        var actualCharIndex = (!reverseMode) ? charIndex : (len - charIndex) - 1;
        // Track to see if the letter is whitespace.
        var letterIsWhitespaceDuringSpaceOverride = (overrideSpaceWidth && /\s/.test(letter)) ? true : false;
        // Prepare to get the width of the character.  Used for distance consumption if not observing rotation.
        var widthOfCharacter;
        // Get the size (width only). TODO: Should probably be cached, especially while multiple styles are not supported.
        if (!hasSpecificWidth || !hasSpecificHeight) {
          widthOfCharacter = (letterIsWhitespaceDuringSpaceOverride) ? spaceWidth : ctx.measureText(letter).width;
        } else {
          widthOfCharacter = (letterIsWhitespaceDuringSpaceOverride) ? spaceWidth : this._getWidthOfCharAt(ctx, lineIndex, actualCharIndex);
          heightOfLetter = this._getHeightOfCharAt(ctx, lineIndex, actualCharIndex);
          halfHeightOfLetter = heightOfLetter / 2;
        }
        // Halve the width. Used for centering.
        var halfWidth = widthOfCharacter / 2;
        // Determine whether this letter should be subjected to the less overlap feature or not.
        var wantLessTextPathOverlapFeature = (!approximating && this.wantTextPathWithLessOverlap && lastPoint && !letterIsWhitespaceDuringSpaceOverride) ? true : false;
        // Get an acceptable center-point.
        var point = this._getAcceptablePoint(runningDistance, widthOfCharacter, halfWidth, halfHeightOfLetter, halfNonTransformedHeight, top, lastPoint, reverseMode, wantLessTextPathOverlapFeature);
        // If the center point of the letter's bounding box exists, render the letter and the bounding box (if requested) around it.
        if (point) {
          // Track the forward motion along the line.
          runningDistance = point.runningDistanceAfter;
          // Adjust the point so that it represents the center of the horizontally sliding bounding box.
          point.setXY(drawingOffsetX + point.x + left, drawingOffsetY + point.y - halfNonTransformedHeight);
          // Cache the calculation. If frozen, this will be available on the next render request, and it should be much faster to just draw letters at points.
          this._boundaries[lineIndex].letters[actualCharIndex] = {
            letter: letter,
            point: point
          };
        }
        // Track last point.
        lastPoint = point;
      }
      // For purposes of alignment, store the consumed distance.
      this._boundaries[lineIndex].consumedDistance = runningDistance;
    },

    /**
     * Pushes style declaration's attributes into the context
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {object} styleDeclaration Dictionary containing style directives relevant to the context.
     */
    _pushStyleToContext: function(ctx, styleDeclaration) {
      if (typeof styleDeclaration.shadow === 'string') {
        styleDeclaration.shadow = new fabric.Shadow(styleDeclaration.shadow);
      }
      var fill = styleDeclaration.fill || this.fill;
      ctx.fillStyle = fill.toLive
        ? fill.toLive(ctx)
        : fill;
      var validStrokeWidthExists = (!(styleDeclaration.strokeWidth == null) && styleDeclaration.strokeWidth > 0) ? true : false;
      if (styleDeclaration.stroke && (validStrokeWidthExists || styleDeclaration.strokeWidth == null)) {
        ctx.strokeStyle = (styleDeclaration.stroke && styleDeclaration.stroke.toLive)
          ? styleDeclaration.stroke.toLive(ctx)
          : styleDeclaration.stroke;
      }
      ctx.lineWidth = styleDeclaration.strokeWidth || this.strokeWidth;
      ctx.font = this._getFontDeclaration.call(styleDeclaration);
      this._setShadow.call(styleDeclaration, ctx);
    },

    /**
     * Render a line of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     * @param {Boolean} spaceWidth If defined, width of space to use in place of measured width (specifically, for purposes of justification).
     */
    _renderTextLineOnTextPath: function(method, ctx, line, left, top, lineIndex, spaceWidth) {
      // In the middle of approximating, turn off non-essential features.
      var approximating = (!this.textPath.wantApproximationDetail || this.textPath.wantApproximationDetail == 0) ? false : true;
      // Figure out if the letter locations need to be calculated.
      var isNotCalculated = (this._boundaries[lineIndex].letters == null) ? true : false;
      // If the letter locations need to be calculated, calculate where the letters should be drawn.
      if (isNotCalculated) {
        this._calculateTextLineOnTextPath(method, ctx, line, left, top, lineIndex, approximating, spaceWidth);
      }
      // If requested, draw the text how it would have been.
      this._drawTextResidueIfNecessary(method, ctx, line, left, top, lineIndex);
      // Get calculated line metadata.
      var thisLineMetaData = this._boundaries[lineIndex];
      // Obtain the height of the untransformed bounding box that the unpathed text would have created.
      var nonTransformedHeightOfAllLines = this._getObservedTotalLineHeight(ctx);
      var halfNonTransformedHeight = nonTransformedHeightOfAllLines / 2;
      // Get the center of the object.
      var centerOfTextObject = this.getCenterPoint();
      // Get the center of what's being observed.
      var centerOfPathObject = this.textPath.getCenterPoint();
      // Get vertical delta.
      var distanceFromPathCenterY = centerOfPathObject.y - centerOfTextObject.y;
      // Subtract out the top offset (and other offsets) to get just the summed line height. fabric.IText already does away with the 4th fontSize lift that occurs in fabric.Text.
      var summedLineHeight = (this.type == "i-text") ? top - this._getTopOffset() : top - this._getTopOffset() + this.fontSize / 4;
      // Object supports character styles.
      var supportsSpecificStyles = (this.getCurrentCharStyle == null) ? false : true;
      for (var charIndex = 0, len = thisLineMetaData.letters.length; charIndex < len; charIndex++) {
        var letterEntry = thisLineMetaData.letters[charIndex];
        // Get character style. Character indices in line styles are one-index rather than zero-index.
        var style = (!supportsSpecificStyles) ? this : this.getCurrentCharStyle(lineIndex, charIndex + 1);
        // For fabric.IText, push the background color onto the style.
        if (!style.backgroundColor) {
          style.backgroundColor = this.backgroundColor;
        }
        // Draw it.
        this._renderLetterAtPoint(method, ctx, letterEntry.letter, letterEntry.point, top, lineIndex, halfNonTransformedHeight, summedLineHeight, style, approximating);
      }
    },

    /**
     * Renders text instance on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    render: function(ctx, noTransform) {
      // do not render if object is not visible
      if (!this.visible) {
        return;
      }

      ctx.save();
      this._transform(ctx, noTransform);

      var m = this.transformMatrix,
          isInPathGroup = this.group && this.group.type === 'path-group';

      if (isInPathGroup) {
        ctx.translate(-this.group.width/2, -this.group.height/2);
      }
      if (m) {
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }
      if (isInPathGroup) {
        ctx.translate(this.left, this.top);
      }
      this._render(ctx);
      ctx.restore();
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      var object = extend(this.callSuper('toObject', propertiesToInclude), {
        text:                        this.text,
        fontSize:                    this.fontSize,
        fontWeight:                  this.fontWeight,
        fontFamily:                  this.fontFamily,
        fontStyle:                   this.fontStyle,
        lineHeight:                  this.lineHeight,
        textDecoration:              this.textDecoration,
        textAlign:                   this.textAlign,
        path:                        this.path,
        textBackgroundColor:         this.textBackgroundColor,
        useNative:                   this.useNative,
        textPath:                    this.textPath,
        textPathDistanceOffset:      this.textPathDistanceOffset,
        wantObservePathRotation:     this.wantObservePathRotation,
        wantTextPathWithLessOverlap: this.wantTextPathWithLessOverlap,
        wantTextPathResidue:         this.wantTextPathResidue,
        wantApproximationDetail:     this.wantApproximationDetail,
      });
      if (!this.includeDefaultValues) {
        this._removeDefaultValues(object);
      }
      return object;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = [ ],
          textLines = this.text.split(this._reNewline),
          offsets = this._getSVGLeftTopOffsets(textLines),
          textAndBg = this._getSVGTextAndBg(offsets.lineTop, offsets.textLeft, textLines),
          shadowSpans = this._getSVGShadows(offsets.lineTop, textLines);

      // move top offset by an ascent
      offsets.textTop += (this._fontAscent ? ((this._fontAscent / 5) * this.lineHeight) : 0);

      this._wrapSVGTextAndBg(markup, textAndBg, shadowSpans, offsets);

      return reviver ? reviver(markup.join('')) : markup.join('');
    },

    /**
     * @private
     */
    _getSVGLeftTopOffsets: function(textLines) {
      var lineTop = this.useNative
            ? this.fontSize * this.lineHeight
            : (-this._fontAscent - ((this._fontAscent / 5) * this.lineHeight)),

          textLeft = -(this.width/2),
          textTop = this.useNative
            ? this.fontSize - 1
            : (this.height/2) - (textLines.length * this.fontSize) - this._totalLineHeight;

      return {
        textLeft: textLeft + (this.group ? this.left : 0),
        textTop: textTop + (this.group ? this.top : 0),
        lineTop: lineTop
      };
    },

    /**
     * @private
     */
    _wrapSVGTextAndBg: function(markup, textAndBg, shadowSpans, offsets) {
      markup.push(
        '<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n',
          textAndBg.textBgRects.join(''),
          '<text ',
            (this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g,'\'') + '" ': ''),
            (this.fontSize ? 'font-size="' + this.fontSize + '" ': ''),
            (this.fontStyle ? 'font-style="' + this.fontStyle + '" ': ''),
            (this.fontWeight ? 'font-weight="' + this.fontWeight + '" ': ''),
            (this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ': ''),
            'style="', this.getSvgStyles(), '" ',
            /* svg starts from left/bottom corner so we normalize height */
            'transform="translate(', toFixed(offsets.textLeft, 2), ' ', toFixed(offsets.textTop, 2), ')">',
            shadowSpans.join(''),
            textAndBg.textSpans.join(''),
          '</text>\n',
        '</g>\n'
      );
    },

    /**
     * @private
     * @param {Number} lineHeight
     * @param {Array} textLines Array of all text lines
     * @return {Array}
     */
    _getSVGShadows: function(lineHeight, textLines) {
      var shadowSpans = [],
          i, len,
          lineTopOffsetMultiplier = 1;

      if (!this.shadow || !this._boundaries) {
        return shadowSpans;
      }

      for (i = 0, len = textLines.length; i < len; i++) {
        if (textLines[i] !== '') {
          var lineLeftOffset = (this._boundaries && this._boundaries[i]) ? this._boundaries[i].left : 0;
          shadowSpans.push(
            '<tspan x="',
            toFixed((lineLeftOffset + lineTopOffsetMultiplier) + this.shadow.offsetX, 2),
            ((i === 0 || this.useNative) ? '" y' : '" dy'), '="',
            toFixed(this.useNative
              ? ((lineHeight * i) - this.height / 2 + this.shadow.offsetY)
              : (lineHeight + (i === 0 ? this.shadow.offsetY : 0)), 2),
            '" ',
            this._getFillAttributes(this.shadow.color), '>',
            fabric.util.string.escapeXml(textLines[i]),
          '</tspan>');
          lineTopOffsetMultiplier = 1;
        }
        else {
          // in some environments (e.g. IE 7 & 8) empty tspans are completely ignored, using a lineTopOffsetMultiplier
          // prevents empty tspans
          lineTopOffsetMultiplier++;
        }
      }

      return shadowSpans;
    },

    /**
     * @private
     * @param {Number} lineHeight
     * @param {Number} textLeftOffset Text left offset
     * @param {Array} textLines Array of all text lines
     * @return {Object}
     */
    _getSVGTextAndBg: function(lineHeight, textLeftOffset, textLines) {
      var textSpans = [ ],
          textBgRects = [ ],
          lineTopOffsetMultiplier = 1;

      // bounding-box background
      this._setSVGBg(textBgRects);

      // text and text-background
      for (var i = 0, len = textLines.length; i < len; i++) {
        if (textLines[i] !== '') {
          this._setSVGTextLineText(textLines[i], i, textSpans, lineHeight, lineTopOffsetMultiplier, textBgRects);
          lineTopOffsetMultiplier = 1;
        }
        else {
          // in some environments (e.g. IE 7 & 8) empty tspans are completely ignored, using a lineTopOffsetMultiplier
          // prevents empty tspans
          lineTopOffsetMultiplier++;
        }

        if (!this.textBackgroundColor || !this._boundaries) {
          continue;
        }

        this._setSVGTextLineBg(textBgRects, i, textLeftOffset, lineHeight);
      }

      return {
        textSpans: textSpans,
        textBgRects: textBgRects
      };
    },

    _setSVGTextLineText: function(textLine, i, textSpans, lineHeight, lineTopOffsetMultiplier) {
      var lineLeftOffset = (this._boundaries && this._boundaries[i])
        ? toFixed(this._boundaries[i].left, 2)
        : 0;

      textSpans.push(
        '<tspan x="',
          lineLeftOffset, '" ',
          (i === 0 || this.useNative ? 'y' : 'dy'), '="',
          toFixed(this.useNative
            ? ((lineHeight * i) - this.height / 2)
            : (lineHeight * lineTopOffsetMultiplier), 2), '" ',
          // doing this on <tspan> elements since setting opacity
          // on containing <text> one doesn't work in Illustrator
          this._getFillAttributes(this.fill), '>',
          fabric.util.string.escapeXml(textLine),
        '</tspan>'
      );
    },

    _setSVGTextLineBg: function(textBgRects, i, textLeftOffset, lineHeight) {
      textBgRects.push(
        '<rect ',
          this._getFillAttributes(this.textBackgroundColor),
          ' x="',
          toFixed(textLeftOffset + this._boundaries[i].left, 2),
          '" y="',
          /* an offset that seems to straighten things out */
          toFixed((lineHeight * i) - this.height / 2, 2),
          '" width="',
          toFixed(this._boundaries[i].width, 2),
          '" height="',
          toFixed(this._boundaries[i].height, 2),
        '"></rect>\n');
    },

    _setSVGBg: function(textBgRects) {
      if (this.backgroundColor && this._boundaries) {
        textBgRects.push(
          '<rect ',
            this._getFillAttributes(this.backgroundColor),
            ' x="',
            toFixed(-this.width / 2, 2),
            '" y="',
            toFixed(-this.height / 2, 2),
            '" width="',
            toFixed(this.width, 2),
            '" height="',
            toFixed(this.height, 2),
          '"></rect>');
      }
    },

    /**
     * Adobe Illustrator (at least CS5) is unable to render rgba()-based fill values
     * we work around it by "moving" alpha channel into opacity attribute and setting fill's alpha to 1
     *
     * @private
     * @param {Any} value
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
     * @param {Any} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    _set: function(key, value) {
      if (key === 'fontFamily' && this.path) {
        this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, '$1' + value + '$3');
      }
      this.callSuper('_set', key, value);

      if (key in this._dimensionAffectingProps) {
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

    var text = new fabric.Text(element.textContent, options),
        /*
          Adjust positioning:
            x/y attributes in SVG correspond to the bottom-left corner of text bounding box
            top/left properties in Fabric correspond to center point of text bounding box
        */
        offX = 0;

    if (text.originX === 'left') {
      offX = text.getWidth() / 2;
    }
    if (text.originX === 'right') {
      offX = -text.getWidth() / 2;
    }
    text.set({
      left: text.getLeft() + offX,
      top: text.getTop() - text.getHeight() / 2
    });

    return text;
  };
  /* _FROM_SVG_END_ */

  /**
   * Returns fabric.Text instance from an object representation
   * @static
   * @memberOf fabric.Text
   * @param {Object} object Object to create an instance from
   * @return {fabric.Text} Instance of fabric.Text
   */
  fabric.Text.fromObject = function(object) {
    return new fabric.Text(object.text, clone(object));
  };

  fabric.util.createAccessors(fabric.Text);

})(typeof exports !== 'undefined' ? exports : this);
