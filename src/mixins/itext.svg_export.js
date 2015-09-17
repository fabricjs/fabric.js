/* _TO_SVG_START_ */
(function() {
  var toFixed = fabric.util.toFixed,
      NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;

  fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {

    /**
     * @private
     */
    _setSVGTextLineText: function(lineIndex, textSpans, height, textLeftOffset, textTopOffset, textBgRects) {
      if (!this.styles[lineIndex]) {
        fabric.Text.prototype._setSVGTextLineText.call(this,
          lineIndex, textSpans, height, textLeftOffset, textTopOffset);
      }
      else {
        this._setSVGTextLineChars(
          lineIndex, textSpans, height, textLeftOffset, textBgRects);
      }
    },

    /**
     * @private
     */
    _setSVGTextLineChars: function(lineIndex, textSpans, height, textLeftOffset, textBgRects) {

      var chars = this._textLines[lineIndex],
          charOffset = 0,
          lineLeftOffset = this._getLineLeftOffset(this._getLineWidth(this.ctx, lineIndex)) - this.width / 2,
          lineOffset = this._getSVGLineTopOffset(lineIndex),
          heightOfLine = this._getHeightOfLine(this.ctx, lineIndex);

      for (var i = 0, len = chars.length; i < len; i++) {
        var styleDecl = this.styles[lineIndex][i] || { };

        textSpans.push(
          this._createTextCharSpan(
            chars[i], styleDecl, lineLeftOffset, lineOffset.lineTop + lineOffset.offset, charOffset));

        var charWidth = this._getWidthOfChar(this.ctx, chars[i], lineIndex, i);

        if (styleDecl.textBackgroundColor) {
          textBgRects.push(
            this._createTextCharBg(
              styleDecl, lineLeftOffset, lineOffset.lineTop, heightOfLine, charWidth, charOffset));
        }

        charOffset += charWidth;
      }
    },

    /**
     * @private
     */
    _getSVGLineTopOffset: function(lineIndex) {
      var lineTopOffset = 0, lastHeight = 0;
      for (var j = 0; j < lineIndex; j++) {
        lineTopOffset += this._getHeightOfLine(this.ctx, j);
      }
      lastHeight = this._getHeightOfLine(this.ctx, j);
      return {
        lineTop: lineTopOffset,
        offset: (this._fontSizeMult - this._fontSizeFraction) * lastHeight / (this.lineHeight * this._fontSizeMult)
      };
    },

    /**
     * @private
     */
    _createTextCharBg: function(styleDecl, lineLeftOffset, lineTopOffset, heightOfLine, charWidth, charOffset) {
      return [
        //jscs:disable validateIndentation
        '<rect fill="', styleDecl.textBackgroundColor,
        '" x="', toFixed(lineLeftOffset + charOffset, NUM_FRACTION_DIGITS),
        '" y="', toFixed(lineTopOffset - this.height/2, NUM_FRACTION_DIGITS),
        '" width="', toFixed(charWidth, NUM_FRACTION_DIGITS),
        '" height="', toFixed(heightOfLine / this.lineHeight, NUM_FRACTION_DIGITS),
        '"></rect>'
        //jscs:enable validateIndentation
      ].join('');
    },

    /**
     * @private
     */
    _createTextCharSpan: function(_char, styleDecl, lineLeftOffset, lineTopOffset, charOffset) {

      var fillStyles = this.getSvgStyles.call(fabric.util.object.extend({
        visible: true,
        fill: this.fill,
        stroke: this.stroke,
        type: 'text',
        getSvgFilter: fabric.Object.prototype.getSvgFilter
      }, styleDecl));

      return [
        //jscs:disable validateIndentation
        '<tspan x="', toFixed(lineLeftOffset + charOffset, NUM_FRACTION_DIGITS), '" y="',
          toFixed(lineTopOffset - this.height/2, NUM_FRACTION_DIGITS), '" ',
          (styleDecl.fontFamily ? 'font-family="' + styleDecl.fontFamily.replace(/"/g, '\'') + '" ': ''),
          (styleDecl.fontSize ? 'font-size="' + styleDecl.fontSize + '" ': ''),
          (styleDecl.fontStyle ? 'font-style="' + styleDecl.fontStyle + '" ': ''),
          (styleDecl.fontWeight ? 'font-weight="' + styleDecl.fontWeight + '" ': ''),
          (styleDecl.textDecoration ? 'text-decoration="' + styleDecl.textDecoration + '" ': ''),
          'style="', fillStyles, '">',
          fabric.util.string.escapeXml(_char),
        '</tspan>'
        //jscs:enable validateIndentation
      ].join('');
    }
  });
})();
/* _TO_SVG_END_ */
