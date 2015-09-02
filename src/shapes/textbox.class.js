(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
      clone  = fabric.util.object.clone;

  /**
   * Textbox class, based on IText, allows the user to resize the text rectangle
   * and wraps lines automatically. Textboxes have their Y scaling locked, the
   * user can only change width. Height is adjusted automatically based on the
   * wrapping of lines.
   * @class fabric.Textbox
   * @extends fabric.IText
   * @mixes fabric.Observable
   * @return {fabric.Textbox} thisArg
   * @see {@link fabric.Textbox#initialize} for constructor definition
   */
  fabric.Textbox = fabric.util.createClass(fabric.IText, fabric.Observable, {
    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'textbox',
    /**
     * Minimum width of textbox, in pixels.
     * @type Number
     * @default
     */
    minWidth: 20,
    /**
     * Minimum calculated width of a textbox, in pixels.
     * @type Number
     * @default
     */
    dynamicMinWidth: 0,
    /**
     * Cached array of text wrapping.
     * @type Array
     */
    __cachedLines: null,
    /**
     * Constructor. Some scaling related property values are forced. Visibility
     * of controls is also fixed; only the rotation and width controls are
     * made available.
     * @param {String} text Text string
     * @param {Object} [options] Options object
     * @return {fabric.Textbox} thisArg
     */
    initialize: function(text, options) {
      this.ctx = fabric.util.createCanvasElement().getContext('2d');

      this.callSuper('initialize', text, options);
      this.set({
        lockUniScaling: false,
        lockScalingY: true,
        lockScalingFlip: true,
        hasBorders: true
      });
      this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());

      // add width to this list of props that effect line wrapping.
      this._dimensionAffectingProps.width = true;
    },

    /**
     * Unlike superclass's version of this function, Textbox does not update
     * its width.
     * @param {CanvasRenderingContext2D} ctx Context to use for measurements
     * @private
     * @override
     */
    _initDimensions: function(ctx) {
      if (this.__skipDimension) {
        return;
      }

      if (!ctx) {
        ctx = fabric.util.createCanvasElement().getContext('2d');
        this._setTextStyles(ctx);
      }

      // clear dynamicMinWidth as it will be different after we re-wrap line
      this.dynamicMinWidth = 0;

      // wrap lines
      this._textLines = this._splitTextIntoLines();

      // if after wrapping, the width is smaller than dynamicMinWidth, change the width and re-wrap
      if (this.dynamicMinWidth > this.width) {
        this._set('width', this.dynamicMinWidth);
      }

      // clear cache and re-calculate height
      this._clearCache();
      this.height = this._getTextHeight(ctx);
    },

    /**
     * Generate an object that translates the style object so that it is
     * broken up by visual lines (new lines and automatic wrapping).
     * The original text styles object is broken up by actual lines (new lines only),
     * which is only sufficient for Text / IText
     * @private
     */
    _generateStyleMap: function() {
      var realLineCount     = 0,
          realLineCharCount = 0,
          charCount         = 0,
          map               = {};

      for (var i = 0; i < this._textLines.length; i++) {
        if (this.text[charCount] === '\n') {
          realLineCharCount = 0;
          charCount++;
          realLineCount++;
        }
        else if (this.text[charCount] === ' ') {
          // this case deals with space's that are removed from end of lines when wrapping
          realLineCharCount++;
          charCount++;
        }

        map[i] = { line: realLineCount, offset: realLineCharCount };

        charCount += this._textLines[i].length;
        realLineCharCount += this._textLines[i].length;
      }

      return map;
    },

    /**
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @param {Boolean} [returnCloneOrEmpty=false]
     * @private
     */
    _getStyleDeclaration: function(lineIndex, charIndex, returnCloneOrEmpty) {
      if (this._styleMap) {
        var map = this._styleMap[lineIndex];
        if (!map) {
          return returnCloneOrEmpty ? { } : null;
        }
        lineIndex = map.line;
        charIndex = map.offset + charIndex;
      }
      return this.callSuper('_getStyleDeclaration', lineIndex, charIndex, returnCloneOrEmpty);
    },

    /**
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @param {Object} style
     * @private
     */
    _setStyleDeclaration: function(lineIndex, charIndex, style) {
      var map = this._styleMap[lineIndex];
      lineIndex = map.line;
      charIndex = map.offset + charIndex;

      this.styles[lineIndex][charIndex] = style;
    },

    /**
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @private
     */
    _deleteStyleDeclaration: function(lineIndex, charIndex) {
      var map = this._styleMap[lineIndex];
      lineIndex = map.line;
      charIndex = map.offset + charIndex;

      delete this.styles[lineIndex][charIndex];
    },

    /**
     * @param {Number} lineIndex
     * @private
     */
    _getLineStyle: function(lineIndex) {
      var map = this._styleMap[lineIndex];
      return this.styles[map.line];
    },

    /**
     * @param {Number} lineIndex
     * @param {Object} style
     * @private
     */
    _setLineStyle: function(lineIndex, style) {
      var map = this._styleMap[lineIndex];
      this.styles[map.line] = style;
    },

    /**
     * @param {Number} lineIndex
     * @private
     */
    _deleteLineStyle: function(lineIndex) {
      var map = this._styleMap[lineIndex];
      delete this.styles[map.line];
    },

    /**
     * Wraps text using the 'width' property of Textbox. First this function
     * splits text on newlines, so we preserve newlines entered by the user.
     * Then it wraps each line using the width of the Textbox by calling
     * _wrapLine().
     * @param {CanvasRenderingContext2D} ctx Context to use for measurements
     * @param {String} text The string of text that is split into lines
     * @returns {Array} Array of lines
     */
    _wrapText: function(ctx, text) {
      var lines = text.split(this._reNewline), wrapped = [], i;

      for (i = 0; i < lines.length; i++) {
        wrapped = wrapped.concat(this._wrapLine(ctx, lines[i], i));
      }

      return wrapped;
    },

    /**
     * Helper function to measure a string of text, given its lineIndex and charIndex offset
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {String} text
     * @param {number} lineIndex
     * @param {number} charOffset
     * @returns {number}
     * @private
     */
    _measureText: function(ctx, text, lineIndex, charOffset) {
      var width = 0;
      charOffset = charOffset || 0;

      for (var i = 0, len = text.length; i < len; i++) {
        width += this._getWidthOfChar(ctx, text[i], lineIndex, i + charOffset);
      }

      return width;
    },

    /**
     * Wraps a line of text using the width of the Textbox and a context.
     * @param {CanvasRenderingContext2D} ctx Context to use for measurements
     * @param {String} text The string of text to split into lines
     * @param {Number} lineIndex
     * @returns {Array} Array of line(s) into which the given text is wrapped
     * to.
     */
    _wrapLine: function(ctx, text, lineIndex) {
      var lineWidth        = 0,
          lines            = [],
          line             = '',
          words            = text.split(' '),
          word             = '',
          offset           = 0,
          infix            = ' ',
          wordWidth        = 0,
          infixWidth       = 0,
          largestWordWidth = 0;

      for (var i = 0; i < words.length; i++) {
        word = words[i];
        wordWidth = this._measureText(ctx, word, lineIndex, offset);
        offset += word.length;

        lineWidth += infixWidth + wordWidth;

        if (lineWidth >= this.width && line !== '') {
          lines.push(line);
          line = '';
          lineWidth = wordWidth;
        }

        if (line !== '' || i === 1) {
          line += infix;
        }
        line += word;

        infixWidth = this._measureText(ctx, infix, lineIndex, offset);
        offset++;

        // keep track of largest word
        if (wordWidth > largestWordWidth) {
          largestWordWidth = wordWidth;
        }
      }

      i && lines.push(line);

      if (largestWordWidth > this.dynamicMinWidth) {
        this.dynamicMinWidth = largestWordWidth;
      }

      return lines;
    },

    /**
     * Gets lines of text to render in the Textbox. This function calculates
     * text wrapping on the fly everytime it is called.
     * @returns {Array} Array of lines in the Textbox.
     * @override
     */
    _splitTextIntoLines: function() {
      var originalAlign = this.textAlign;
      this.ctx.save();
      this._setTextStyles(this.ctx);
      this.textAlign = 'left';
      var lines = this._wrapText(this.ctx, this.text);
      this.textAlign = originalAlign;
      this.ctx.restore();
      this._textLines = lines;
      this._styleMap = this._generateStyleMap();
      return lines;
    },

    /**
     * When part of a group, we don't want the Textbox's scale to increase if
     * the group's increases. That's why we reduce the scale of the Textbox by
     * the amount that the group's increases. This is to maintain the effective
     * scale of the Textbox at 1, so that font-size values make sense. Otherwise
     * the same font-size value would result in different actual size depending
     * on the value of the scale.
     * @param {String} key
     * @param {Any} value
     */
    setOnGroup: function(key, value) {
      if (key === 'scaleX') {
        this.set('scaleX', Math.abs(1 / value));
        this.set('width', (this.get('width') * value) /
          (typeof this.__oldScaleX === 'undefined' ? 1 : this.__oldScaleX));
        this.__oldScaleX = value;
      }
    },

    /**
     * Returns 2d representation (lineIndex and charIndex) of cursor (or selection start).
     * Overrides the superclass function to take into account text wrapping.
     *
     * @param {Number} [selectionStart] Optional index. When not given, current selectionStart is used.
     */
    get2DCursorLocation: function(selectionStart) {
      if (typeof selectionStart === 'undefined') {
        selectionStart = this.selectionStart;
      }

      var numLines = this._textLines.length,
          removed  = 0;

      for (var i = 0; i < numLines; i++) {
        var line    = this._textLines[i],
            lineLen = line.length;

        if (selectionStart <= removed + lineLen) {
          return {
            lineIndex: i,
            charIndex: selectionStart - removed
          };
        }

        removed += lineLen;

        if (this.text[removed] === '\n' || this.text[removed] === ' ') {
          removed++;
        }
      }

      return {
        lineIndex: numLines - 1,
        charIndex: this._textLines[numLines - 1].length
      };
    },

    /**
     * Overrides superclass function and uses text wrapping data to get cursor
     * boundary offsets instead of the array of chars.
     * @param {Array} chars Unused
     * @param {String} typeOfBoundaries Can be 'cursor' or 'selection'
     * @returns {Object} Object with 'top', 'left', and 'lineLeft' properties set.
     */
    _getCursorBoundariesOffsets: function(chars, typeOfBoundaries) {
      var topOffset      = 0,
          leftOffset     = 0,
          cursorLocation = this.get2DCursorLocation(),
          lineChars      = this._textLines[cursorLocation.lineIndex].split(''),
          lineLeftOffset = this._getLineLeftOffset(this._getLineWidth(this.ctx, cursorLocation.lineIndex));

      for (var i = 0; i < cursorLocation.charIndex; i++) {
        leftOffset += this._getWidthOfChar(this.ctx, lineChars[i], cursorLocation.lineIndex, i);
      }

      for (i = 0; i < cursorLocation.lineIndex; i++) {
        topOffset += this._getHeightOfLine(this.ctx, i);
      }

      if (typeOfBoundaries === 'cursor') {
        topOffset += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, cursorLocation.lineIndex)
          / this.lineHeight - this.getCurrentCharFontSize(cursorLocation.lineIndex, cursorLocation.charIndex)
          * (1 - this._fontSizeFraction);
      }

      return {
        top: topOffset,
        left: leftOffset,
        lineLeft: lineLeftOffset
      };
    },

    getMinWidth: function() {
      return Math.max(this.minWidth, this.dynamicMinWidth);
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude), {
        minWidth: this.minWidth
      });
    }
  });
  /**
   * Returns fabric.Textbox instance from an object representation
   * @static
   * @memberOf fabric.Textbox
   * @param {Object} object Object to create an instance from
   * @return {fabric.Textbox} instance of fabric.Textbox
   */
  fabric.Textbox.fromObject = function(object) {
    return new fabric.Textbox(object.text, clone(object));
  };
  /**
   * Returns the default controls visibility required for Textboxes.
   * @returns {Object}
   */
  fabric.Textbox.getTextboxControlVisibility = function() {
    return {
      tl: false,
      tr: false,
      br: false,
      bl: false,
      ml: true,
      mt: false,
      mr: true,
      mb: false,
      mtr: true
    };
  };
  /**
   * Contains all fabric.Textbox objects that have been created
   * @static
   * @memberOf fabric.Textbox
   * @type Array
   */
  fabric.Textbox.instances = [];
})(typeof exports !== 'undefined' ? exports : this);
