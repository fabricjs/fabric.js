import { config } from '../../config.mjs';
import { escapeXml } from '../../util/lang_string.mjs';
import { colorPropToSVG, createSVGRect } from '../../util/misc/svgParsing.mjs';
import { hasStyleChanged } from '../../util/misc/textStyles.mjs';
import { toFixed } from '../../util/misc/toFixed.mjs';
import { FabricObjectSVGExportMixin } from '../Object/FabricObjectSVGExportMixin.mjs';
import { JUSTIFY } from './constants.mjs';
import { STROKE, FILL } from '../../constants.mjs';

const multipleSpacesRegex = /  +/g;
const dblQuoteRegex = /"/g;
function createSVGInlineRect(color, left, top, width, height) {
  return "\t\t".concat(createSVGRect(color, {
    left,
    top,
    width,
    height
  }), "\n");
}
class TextSVGExportMixin extends FabricObjectSVGExportMixin {
  _toSVG() {
    const offsets = this._getSVGLeftTopOffsets(),
      textAndBg = this._getSVGTextAndBg(offsets.textTop, offsets.textLeft);
    return this._wrapSVGTextAndBg(textAndBg);
  }
  toSVG(reviver) {
    return this._createBaseSVGMarkup(this._toSVG(), {
      reviver,
      noStyle: true,
      withShadow: true
    });
  }
  _getSVGLeftTopOffsets() {
    return {
      textLeft: -this.width / 2,
      textTop: -this.height / 2,
      lineTop: this.getHeightOfLine(0)
    };
  }
  _wrapSVGTextAndBg(_ref) {
    let {
      textBgRects,
      textSpans
    } = _ref;
    const noShadow = true,
      textDecoration = this.getSvgTextDecoration(this);
    return [textBgRects.join(''), '\t\t<text xml:space="preserve" ', this.fontFamily ? "font-family=\"".concat(this.fontFamily.replace(dblQuoteRegex, "'"), "\" ") : '', this.fontSize ? "font-size=\"".concat(this.fontSize, "\" ") : '', this.fontStyle ? "font-style=\"".concat(this.fontStyle, "\" ") : '', this.fontWeight ? "font-weight=\"".concat(this.fontWeight, "\" ") : '', textDecoration ? "text-decoration=\"".concat(textDecoration, "\" ") : '', this.direction === 'rtl' ? "direction=\"".concat(this.direction, "\" ") : '', 'style="', this.getSvgStyles(noShadow), '"', this.addPaintOrder(), ' >', textSpans.join(''), '</text>\n'];
  }

  /**
   * @private
   * @param {Number} textTopOffset Text top offset
   * @param {Number} textLeftOffset Text left offset
   * @return {Object}
   */
  _getSVGTextAndBg(textTopOffset, textLeftOffset) {
    const textSpans = [],
      textBgRects = [];
    let height = textTopOffset,
      lineOffset;

    // bounding-box background
    this.backgroundColor && textBgRects.push(...createSVGInlineRect(this.backgroundColor, -this.width / 2, -this.height / 2, this.width, this.height));

    // text and text-background
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      lineOffset = this._getLineLeftOffset(i);
      if (this.direction === 'rtl') {
        lineOffset += this.width;
      }
      if (this.textBackgroundColor || this.styleHas('textBackgroundColor', i)) {
        this._setSVGTextLineBg(textBgRects, i, textLeftOffset + lineOffset, height);
      }
      this._setSVGTextLineText(textSpans, i, textLeftOffset + lineOffset, height);
      height += this.getHeightOfLine(i);
    }
    return {
      textSpans,
      textBgRects
    };
  }
  _createTextCharSpan(char, styleDecl, left, top) {
    const styleProps = this.getSvgSpanStyles(styleDecl, char !== char.trim() || !!char.match(multipleSpacesRegex)),
      fillStyles = styleProps ? "style=\"".concat(styleProps, "\"") : '',
      dy = styleDecl.deltaY,
      dySpan = dy ? " dy=\"".concat(toFixed(dy, config.NUM_FRACTION_DIGITS), "\" ") : '';
    return "<tspan x=\"".concat(toFixed(left, config.NUM_FRACTION_DIGITS), "\" y=\"").concat(toFixed(top, config.NUM_FRACTION_DIGITS), "\" ").concat(dySpan).concat(fillStyles, ">").concat(escapeXml(char), "</tspan>");
  }
  _setSVGTextLineText(textSpans, lineIndex, textLeftOffset, textTopOffset) {
    const lineHeight = this.getHeightOfLine(lineIndex),
      isJustify = this.textAlign.includes(JUSTIFY),
      line = this._textLines[lineIndex];
    let actualStyle,
      nextStyle,
      charsToRender = '',
      charBox,
      style,
      boxWidth = 0,
      timeToRender;
    textTopOffset += lineHeight * (1 - this._fontSizeFraction) / this.lineHeight;
    for (let i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing;
      charsToRender += line[i];
      charBox = this.__charBounds[lineIndex][i];
      if (boxWidth === 0) {
        textLeftOffset += charBox.kernedWidth - charBox.width;
        boxWidth += charBox.width;
      } else {
        boxWidth += charBox.kernedWidth;
      }
      if (isJustify && !timeToRender) {
        if (this._reSpaceAndTab.test(line[i])) {
          timeToRender = true;
        }
      }
      if (!timeToRender) {
        // if we have charSpacing, we render char by char
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
        timeToRender = hasStyleChanged(actualStyle, nextStyle, true);
      }
      if (timeToRender) {
        style = this._getStyleDeclaration(lineIndex, i);
        textSpans.push(this._createTextCharSpan(charsToRender, style, textLeftOffset, textTopOffset));
        charsToRender = '';
        actualStyle = nextStyle;
        if (this.direction === 'rtl') {
          textLeftOffset -= boxWidth;
        } else {
          textLeftOffset += boxWidth;
        }
        boxWidth = 0;
      }
    }
  }
  _setSVGTextLineBg(textBgRects, i, leftOffset, textTopOffset) {
    const line = this._textLines[i],
      heightOfLine = this.getHeightOfLine(i) / this.lineHeight;
    let boxWidth = 0,
      boxStart = 0,
      currentColor,
      lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');
    for (let j = 0; j < line.length; j++) {
      const {
        left,
        width,
        kernedWidth
      } = this.__charBounds[i][j];
      currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
      if (currentColor !== lastColor) {
        lastColor && textBgRects.push(...createSVGInlineRect(lastColor, leftOffset + boxStart, textTopOffset, boxWidth, heightOfLine));
        boxStart = left;
        boxWidth = width;
        lastColor = currentColor;
      } else {
        boxWidth += kernedWidth;
      }
    }
    currentColor && textBgRects.push(...createSVGInlineRect(lastColor, leftOffset + boxStart, textTopOffset, boxWidth, heightOfLine));
  }

  /**
   * @deprecated unused
   */
  _getSVGLineTopOffset(lineIndex) {
    let lineTopOffset = 0,
      j;
    for (j = 0; j < lineIndex; j++) {
      lineTopOffset += this.getHeightOfLine(j);
    }
    const lastHeight = this.getHeightOfLine(j);
    return {
      lineTop: lineTopOffset,
      offset: (this._fontSizeMult - this._fontSizeFraction) * lastHeight / (this.lineHeight * this._fontSizeMult)
    };
  }

  /**
   * Returns styles-string for svg-export
   * @param {Boolean} skipShadow a boolean to skip shadow filter output
   * @return {String}
   */
  getSvgStyles(skipShadow) {
    return "".concat(super.getSvgStyles(skipShadow), " white-space: pre;");
  }

  /**
   * Returns styles-string for svg-export
   * @param {Object} style the object from which to retrieve style properties
   * @param {Boolean} useWhiteSpace a boolean to include an additional attribute in the style.
   * @return {String}
   */
  getSvgSpanStyles(style, useWhiteSpace) {
    const {
      fontFamily,
      strokeWidth,
      stroke,
      fill,
      fontSize,
      fontStyle,
      fontWeight,
      deltaY
    } = style;
    const textDecoration = this.getSvgTextDecoration(style);
    return [stroke ? colorPropToSVG(STROKE, stroke) : '', strokeWidth ? "stroke-width: ".concat(strokeWidth, "; ") : '', fontFamily ? "font-family: ".concat(!fontFamily.includes("'") && !fontFamily.includes('"') ? "'".concat(fontFamily, "'") : fontFamily, "; ") : '', fontSize ? "font-size: ".concat(fontSize, "px; ") : '', fontStyle ? "font-style: ".concat(fontStyle, "; ") : '', fontWeight ? "font-weight: ".concat(fontWeight, "; ") : '', textDecoration ? "text-decoration: ".concat(textDecoration, "; ") : textDecoration, fill ? colorPropToSVG(FILL, fill) : '', deltaY ? "baseline-shift: ".concat(-deltaY, "; ") : '', useWhiteSpace ? 'white-space: pre; ' : ''].join('');
  }

  /**
   * Returns text-decoration property for svg-export
   * @param {Object} style the object from which to retrieve style properties
   * @return {String}
   */
  getSvgTextDecoration(style) {
    return ['overline', 'underline', 'line-through'].filter(decoration => style[decoration.replace('-', '')]).join(' ');
  }
}

export { TextSVGExportMixin };
//# sourceMappingURL=TextSVGExportMixin.mjs.map
