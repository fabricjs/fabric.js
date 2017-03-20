(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {});

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
     * fixed to 2 so that an empty textbox cannot go to 0
     * and is still selectable without text.
     * @type Number
     * @default
     */
    dynamicMinWidth: 2,

    /**
     * Cached array of text wrapping.
     * @type Array
     */
    __cachedLines: null,

    /**
     * Override standard Object class values
     */
    lockScalingY: true,

    /**
     * Override standard Object class values
     */
    lockScalingFlip: true,

    /**
     * Override standard Object class values
     * Textbox needs this on false
     */
    noScaleCache: false,

    /**
     * Constructor. Some scaling related property values are forced. Visibility
     * of controls is also fixed; only the rotation and width controls are
     * made available.
     * @param {String} text Text string
     * @param {Object} [options] Options object
     * @return {fabric.Textbox} thisArg
     */
    initialize: function(text, options) {

      this.callSuper('initialize', text, options);
      this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());
      this.ctx = this.objectCaching ? this._cacheContext : fabric.util.createCanvasElement().getContext('2d');
      // add width to this list of props that effect line wrapping.
      this._dimensionAffectingProps.push('width');
    },

    /**
     * Unlike superclass's version of this function, Textbox does not update
     * its width.
     * @private
     * @override
     */
    initDimensions: function() {
      if (this.__skipDimension) {
        return;
      }
      // clear dynamicMinWidth as it will be different after we re-wrap line
      this.dynamicMinWidth = 0;
      // wrap lines
      var newText = this._splitTextIntoLines(this.text);
      this._textLines = newText.graphemeLines;
      this._text = newText.graphemeText;
      this._styleMap = this._generateStyleMap(newText);
      // if after wrapping, the width is smaller than dynamicMinWidth, change the width and re-wrap
      if (this.dynamicMinWidth > this.width) {
        this._set('width', this.dynamicMinWidth);
      }
      // clear cache and re-calculate height
      this._clearCache();
      this.height = this.calcTextHeight();
    },

    /**
     * Generate an object that translates the style object so that it is
     * broken up by visual lines (new lines and automatic wrapping).
     * The original text styles object is broken up by actual lines (new lines only),
     * which is only sufficient for Text / IText
     * @private
     */
    _generateStyleMap: function(textInfo) {
      var realLineCount     = 0,
          realLineCharCount = 0,
          charCount         = 0,
          map               = {};

      for (var i = 0; i < textInfo.lines.length; i++) {
        if (textInfo.graphemeText[charCount] === '\n' && i > 0) {
          realLineCharCount = 0;
          charCount++;
          realLineCount++;
        }
        else if (this._reSpaceAndTab.test(textInfo.graphemeText[charCount]) && i > 0) {
          // this case deals with space's that are removed from end of lines when wrapping
          realLineCharCount++;
          charCount++;
        }

        map[i] = { line: realLineCount, offset: realLineCharCount };

        charCount += textInfo.lines[i].length;
        realLineCharCount += textInfo.lines[i].length;
      }

      return map;
    },

    /**
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @private
     */
    _getStyleDeclaration: function(lineIndex, charIndex) {
      if (this._styleMap && !this.isWrapping) {
        var map = this._styleMap[lineIndex];
        if (!map) {
          return null;
        }
        lineIndex = map.line;
        charIndex = map.offset + charIndex;
      }
      return this.callSuper('_getStyleDeclaration', lineIndex, charIndex);
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
     * @param {Array} lines The string array of text that is split into lines
     * @returns {Array} Array of lines
     */
    _wrapText: function(lines) {
      var wrapped = [], i;
      this.isWrapping = true;
      for (i = 0; i < lines.length; i++) {
        wrapped = wrapped.concat(this._wrapLine(lines[i], i));
      }
      this.isWrapping = false;
      return wrapped;
    },

    /**
     * Helper function to measure a string of text, given its lineIndex and charIndex offset
     * it gets called when charBounds are not available yet.
     * @param {CanvasRenderingContext2D} ctx
     * @param {String} text
     * @param {number} lineIndex
     * @param {number} charOffset
     * @returns {number}
     * @private
     */
    _measureWord: function(word, lineIndex, charOffset) {
      var width = 0, prevGrapheme, skipLeft = true;
      charOffset = charOffset || 0;
      for (var i = 0, len = word.length; i < len; i++) {
        var box = this._getGraphemeBox(word[i], lineIndex, i + charOffset, prevGrapheme, skipLeft);
        width += box.kernedWidth;
        prevGrapheme = word[i];
      }
      return width;
    },

    /**
     * Wraps a line of text using the width of the Textbox and a context.
     * @param {CanvasRenderingContext2D} ctx Context to use for measurements
     * @param {Array} line The grapheme array that represent the line
     * @param {Number} lineIndex
     * @returns {Array} Array of line(s) into which the given text is wrapped
     * to.
     */
    _wrapLine: function(_line, lineIndex) {
      var lineWidth        = 0,
          graphemeLines    = [],
          line             = [],
          // spaces in different languges?
          words            = _line.split(this._reSpaceAndTab),
          word             = '',
          offset           = 0,
          infix            = ' ',
          wordWidth        = 0,
          infixWidth       = 0,
          largestWordWidth = 0,
          lineJustStarted = true,
          additionalSpace = this._getWidthOfCharSpacing();
      for (var i = 0; i < words.length; i++) {
        // i would avoid resplitting the graphemes
        word = fabric.util.string.graphemeSplit(words[i]);
        wordWidth = this._measureWord(word, lineIndex, offset);
        offset += word.length;

        lineWidth += infixWidth + wordWidth - additionalSpace;

        if (lineWidth >= this.width && !lineJustStarted) {
          graphemeLines.push(line);
          line = [];
          lineWidth = wordWidth;
          lineJustStarted = true;
        }
        // else {
        //   lineWidth += additionalSpace;
        // }

        if (!lineJustStarted) {
          line.push(infix);
        }
        line = line.concat(word);

        infixWidth = this._measureWord([infix], lineIndex, offset);
        offset++;
        lineJustStarted = false;
        // keep track of largest word
        if (wordWidth > largestWordWidth) {
          largestWordWidth = wordWidth;
        }
      }

      i && graphemeLines.push(line);

      if (largestWordWidth > this.dynamicMinWidth) {
        this.dynamicMinWidth = largestWordWidth - additionalSpace;
      }

      return graphemeLines;
    },

    /**
    * Gets lines of text to render in the Textbox. This function calculates
    * text wrapping on the fly everytime it is called.
    * @param {String} text text to split
    * @returns {Array} Array of lines in the Textbox.
    * @override
    */
    _splitTextIntoLines: function(text) {
      var rawLines = text.split(this._reNewline),
          graphemeLines = this._wrapText(rawLines),
          lines = new Array(graphemeLines.length),
          newText = [];
      for (var i = 0; i < graphemeLines.length; i++) {
        lines[i] = graphemeLines[i].join('');
      }
      newText = fabric.util.string.graphemeSplit(text);
      return { lines: lines, graphemeText: newText, graphemeLines: graphemeLines };
    },

    /**
     * When part of a group, we don't want the Textbox's scale to increase if
     * the group's increases. That's why we reduce the scale of the Textbox by
     * the amount that the group's increases. This is to maintain the effective
     * scale of the Textbox at 1, so that font-size values make sense. Otherwise
     * the same font-size value would result in different actual size depending
     * on the value of the scale.
     * @param {String} key
     * @param {*} value
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
      return this.callSuper('toObject', ['minWidth'].concat(propertiesToInclude));
    }
  });

  /**
   * Returns fabric.Textbox instance from an object representation
   * @static
   * @memberOf fabric.Textbox
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when an fabric.Textbox instance is created
   * @param {Boolean} [forceAsync] Force an async behaviour trying to create pattern first
   * @return {fabric.Textbox} instance of fabric.Textbox
   */
  fabric.Textbox.fromObject = function(object, callback, forceAsync) {
    return fabric.Object._fromObject('Textbox', object, callback, forceAsync, 'text');
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

})(typeof exports !== 'undefined' ? exports : this);
