/* _TO_SVG_START_ */
(function() {
  var toFixed = fabric.util.toFixed,
      NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;

  fabric.util.object.extend(fabric.Text.prototype, /** @lends fabric.IText.prototype */ {

    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = this._createBaseSVGMarkup(),
          offsets = this._getSVGLeftTopOffsets(),
          textAndBg = this._getSVGTextAndBg(offsets.textTop, offsets.textLeft);
      this._wrapSVGTextAndBg(markup, textAndBg);

      return reviver ? reviver(markup.join('')) : markup.join('');
    },

    /**
     * @private
     */
    _getSVGLeftTopOffsets: function() {
      var lineTop = this.getHeightOfLine(0),
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
        height += this.getHeightOfLine(i);
      }

      return {
        textSpans: textSpans,
        textBgRects: textBgRects
      };
    },

    _setSVGTextLineText: function(i, textSpans, height, textLeftOffset, textTopOffset) {
      var yPos = this.fontSize * (this._fontSizeMult - this._fontSizeFraction)
        - textTopOffset + height - this.height / 2;
      textSpans.push(
        '\t\t\t<tspan x="',
          toFixed(textLeftOffset + this._getLineLeftOffset(i), NUM_FRACTION_DIGITS), '" ',
          'y="',
          toFixed(yPos, NUM_FRACTION_DIGITS),
          '" ',
          // doing this on <tspan> elements since setting opacity
          // on containing <text> one doesn't work in Illustrator
          this._getFillAttributes(this.fill), '>',
          fabric.util.string.escapeXml(this._textLines[i].join('')),
        '</tspan>\n'
      );
    },

    _setSVGTextLineBg: function(textBgRects, i, textLeftOffset, textTopOffset, height) {
      textBgRects.push(
        '\t\t<rect ',
          this._getFillAttributes(this.textBackgroundColor),
          ' x="',
          toFixed(textLeftOffset + this._getLineLeftOffset(i), NUM_FRACTION_DIGITS),
          '" y="',
          toFixed(height - this.height / 2, NUM_FRACTION_DIGITS),
          '" width="',
          toFixed(this.getLineWidth(i), NUM_FRACTION_DIGITS),
          '" height="',
          toFixed(this.getHeightOfLine(i) / this.lineHeight, NUM_FRACTION_DIGITS),
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

    /**
     * @private
     */
    _setSVGTextLineText: function(lineIndex, textSpans, height, textLeftOffset, textTopOffset, textBgRects) {
      if (!this._getLineStyle(lineIndex)) {
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
          lineLeftOffset = this._getLineLeftOffset(lineIndex) - this.width / 2,
          lineOffset = this._getSVGLineTopOffset(lineIndex),
          heightOfLine = this.getHeightOfLine(lineIndex);

      for (var i = 0, len = chars.length; i < len; i++) {
        var styleDecl = this._getStyleDeclaration(lineIndex, i) || { };

        textSpans.push(
          this._createTextCharSpan(
            chars[i], styleDecl, lineLeftOffset, lineOffset.lineTop + lineOffset.offset, charOffset));

        var charWidth = this.__charBounds[lineIndex][i].kernedWidth;

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
        lineTopOffset += this.getHeightOfLine(j);
      }
      lastHeight = this.getHeightOfLine(j);
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
        '\t\t<rect fill="', styleDecl.textBackgroundColor,
        '" x="', toFixed(lineLeftOffset + charOffset, NUM_FRACTION_DIGITS),
        '" y="', toFixed(lineTopOffset - this.height / 2, NUM_FRACTION_DIGITS),
        '" width="', toFixed(charWidth, NUM_FRACTION_DIGITS),
        '" height="', toFixed(heightOfLine / this.lineHeight, NUM_FRACTION_DIGITS),
        '"></rect>\n'
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
        '\t\t\t<tspan x="', toFixed(lineLeftOffset + charOffset, NUM_FRACTION_DIGITS), '" y="',
        toFixed(lineTopOffset - this.height / 2, NUM_FRACTION_DIGITS), '" ',
          (styleDecl.fontFamily ? 'font-family="' + styleDecl.fontFamily.replace(/"/g, '\'') + '" ' : ''),
          (styleDecl.fontSize ? 'font-size="' + styleDecl.fontSize + '" ' : ''),
          (styleDecl.fontStyle ? 'font-style="' + styleDecl.fontStyle + '" ' : ''),
          (styleDecl.fontWeight ? 'font-weight="' + styleDecl.fontWeight + '" ' : ''),
          (styleDecl.textDecoration ? 'text-decoration="' + styleDecl.textDecoration + '" ' : ''),
        'style="', fillStyles, '">',
        fabric.util.string.escapeXml(_char),
        '</tspan>\n'
      ].join('');
    }
  });
})();
/* _TO_SVG_END_ */
