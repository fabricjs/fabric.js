   (function() {
     var clone = fabric.util.object.clone;

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
        this._textLines = this._splitTextIntoLines();
        this._clearCache();
        this.height = this._getTextHeight(ctx);
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
           wrapped = wrapped.concat(this._wrapLine(ctx, lines[i]));
         }

         return wrapped;
       },
       /**
        * Wraps a line of text using the width of the Textbox and a context.
        * @param {CanvasRenderingContext2D} ctx Context to use for measurements
        * @param {String} text The string of text to split into lines
        * @returns {Array} Array of line(s) into which the given text is wrapped
        * to.
        */
       _wrapLine: function(ctx, text) {
         var maxWidth = this.width, words = text.split(' '),
                 lines = [],
                 line = '';

         if (ctx.measureText(text).width < maxWidth) {
           lines.push(text);
         }
         else {
           while (words.length > 0) {

             /*
              * If the textbox's width is less than the widest letter.
              * TODO: Performance improvement - cache the width of W whenever
              * fontSize changes.
              */
             if (maxWidth <= ctx.measureText('W').width) {
               return text.split('');
             }

             /*
              * This handles a word that is longer than the width of the
              * text area.
              */
             while (Math.ceil(ctx.measureText(words[0]).width) >= maxWidth) {
               var tmp = words[0];
               words[0] = tmp.slice(0, -1);
               if (words.length > 1) {
                 words[1] = tmp.slice(-1) + words[1];
               }
               else {
                 words.push(tmp.slice(-1));
               }
             }

             if (Math.ceil(ctx.measureText(line + words[0]).width) < maxWidth) {
               line += words.shift() + ' ';
             }
             else {
               lines.push(line);
               line = '';
             }
             if (words.length === 0) {
               lines.push(line.substring(0, line.length - 1));
             }
           }
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
         this.ctx.save();
         this._setTextStyles(this.ctx);

         lines = this._wrapText(this.ctx, this.text);

         this.ctx.restore();
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
           this.set(key, Math.abs(1 / value));
           this.set('width', (this.get('width') * value) /
                   (typeof this.__oldScaleX === 'undefined' ? 1 : this.__oldScaleX));
           this.__oldScaleX = value;
         }
       },

       /**
        * Returns 2d representation (lineIndex and charIndex) of cursor (or selection start).
        * Overrides the superclass function to take into account text wrapping.
        * @param {Number} selectionStart Optional index. When not given, current selectionStart is used.
        * @returns {Object} This object has 'lineIndex' and 'charIndex' properties set to Numbers.
        */
       get2DCursorLocation: function(selectionStart) {
         if (typeof selectionStart === 'undefined') {
           selectionStart = this.selectionStart;
         }

         /*
          * We use `temp` to populate linesBeforeCursor instead of simply splitting
          * textBeforeCursor with newlines to handle the case of the
          * selectionStart value being on a word that, because of its length,
          * needs to be wrapped to the next line.
          */
         var lineIndex = 0,
                 linesBeforeCursor = [],
                 allLines = this._textLines, temp = selectionStart;

         while (temp >= 0) {
           if (lineIndex > allLines.length - 1) {
             break;
           }
           temp -= allLines[lineIndex].length;
           if (temp < 0) {
             linesBeforeCursor[linesBeforeCursor.length] = allLines[lineIndex].slice(0,
                     temp + allLines[lineIndex].length);
           }
           else {
             linesBeforeCursor[linesBeforeCursor.length] = allLines[lineIndex];
           }
           lineIndex++;
         }
         lineIndex--;

         var lastLine = linesBeforeCursor[linesBeforeCursor.length - 1],
                 charIndex = lastLine.length;

         if (linesBeforeCursor[lineIndex] === allLines[lineIndex]) {
           if (lineIndex + 1 < allLines.length - 1) {
             lineIndex++;
             charIndex = 0;
           }
         }

         return {
           lineIndex: lineIndex,
           charIndex: charIndex
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
         var topOffset = 0,
                 leftOffset = 0,
                 cursorLocation = this.get2DCursorLocation(),
                 lineChars = this._textLines[cursorLocation.lineIndex].split(''),
                 lineLeftOffset = this._getCachedLineOffset(cursorLocation.lineIndex);

         for (var i = 0; i < cursorLocation.charIndex; i++) {
            leftOffset += this._getWidthOfChar(this.ctx, lineChars[i], cursorLocation.lineIndex, i);
         }

         for (i = 0; i < cursorLocation.lineIndex; i++) {
           topOffset += this._getHeightOfLine(this.ctx, i);
         }

         if (typeOfBoundaries === 'cursor') {
           topOffset += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, cursorLocation.lineIndex) / this.lineHeight
                   - this.getCurrentCharFontSize(cursorLocation.lineIndex, cursorLocation.charIndex) * (1 - this._fontSizeFraction);
         }

         return {
           top: topOffset,
           left: leftOffset,
           lineLeft: lineLeftOffset
         };
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
      * @memberof fabric.Textbox
      * @type Array
      */
     fabric.Textbox.instances = [];
   })();
