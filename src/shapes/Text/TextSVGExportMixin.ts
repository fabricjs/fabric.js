// @ts-nocheck
import { config } from '../../config';
import { TSVGReviver } from '../../typedefs';
import { escapeXml } from '../../util/lang_string';
import { createSVGRect } from '../../util/misc/svgParsing';
import { hasStyleChanged } from '../../util/misc/textStyles';
import { toFixed } from '../../util/misc/toFixed';
import { FabricObjectSVGExportMixin } from '../Object/FabricObjectSVGExportMixin';
import type { TextStyleDeclaration } from './StyledText';

const multipleSpacesRegex = /  +/g;
const dblQuoteRegex = /"/g;

function createSVGInlineRect(
  color: string,
  left: number,
  top: number,
  width: number,
  height: number
) {
  return `\t\t${createSVGRect(color, { left, top, width, height })}\n`;
}

export class TextSVGExportMixin extends FabricObjectSVGExportMixin {
  _toSVG() {
    const offsets = this._getSVGLeftTopOffsets(),
      textAndBg = this._getSVGTextAndBg(offsets.textTop, offsets.textLeft);
    return this._wrapSVGTextAndBg(textAndBg);
  }

  toSVG(reviver: TSVGReviver) {
    return this._createBaseSVGMarkup(this._toSVG(), {
      reviver,
      noStyle: true,
      withShadow: true,
    });
  }

  private _getSVGLeftTopOffsets() {
    return {
      textLeft: -this.width / 2,
      textTop: -this.height / 2,
      lineTop: this.getHeightOfLine(0),
    };
  }

  private _wrapSVGTextAndBg({
    textBgRects,
    textSpans,
  }: {
    textSpans: string[];
    textBgRects: string[];
  }) {
    const noShadow = true,
      textDecoration = this.getSvgTextDecoration(this);
    return [
      textBgRects.join(''),
      '\t\t<text xml:space="preserve" ',
      this.fontFamily
        ? `font-family="${this.fontFamily.replace(dblQuoteRegex, "'")}" `
        : '',
      this.fontSize ? `font-size="${this.fontSize}" ` : '',
      this.fontStyle ? `font-style="${this.fontStyle}" ` : '',
      this.fontWeight ? `font-weight="${this.fontWeight}" ` : '',
      textDecoration ? `text-decoration="${textDecoration}" ` : '',
      this.direction === 'rtl' ? `direction="${this.direction}" ` : '',
      'style="',
      this.getSvgStyles(noShadow),
      '"',
      this.addPaintOrder(),
      ' >',
      textSpans.join(''),
      '</text>\n',
    ];
  }

  /**
   * @private
   * @param {Number} textTopOffset Text top offset
   * @param {Number} textLeftOffset Text left offset
   * @return {Object}
   */
  private _getSVGTextAndBg(textTopOffset: number, textLeftOffset: number) {
    const textSpans: string[] = [],
      textBgRects: string[] = [];
    let height = textTopOffset,
      lineOffset;

    // bounding-box background
    this.backgroundColor &&
      textBgRects.push(
        ...createSVGInlineRect(
          this.backgroundColor,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        )
      );

    // text and text-background
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      lineOffset = this._getLineLeftOffset(i);
      if (this.direction === 'rtl') {
        lineOffset += this.width;
      }
      if (this.textBackgroundColor || this.styleHas('textBackgroundColor', i)) {
        this._setSVGTextLineBg(
          textBgRects,
          i,
          textLeftOffset + lineOffset,
          height
        );
      }
      this._setSVGTextLineText(
        textSpans,
        i,
        textLeftOffset + lineOffset,
        height
      );
      height += this.getHeightOfLine(i);
    }

    return {
      textSpans,
      textBgRects,
    };
  }

  private _createTextCharSpan(
    char: string,
    styleDecl: TextStyleDeclaration,
    left: number,
    top: number
  ) {
    const styleProps = this.getSvgSpanStyles(
        styleDecl,
        char !== char.trim() || !!char.match(multipleSpacesRegex)
      ),
      fillStyles = styleProps ? `style="${styleProps}"` : '',
      dy = styleDecl.deltaY,
      dySpan = dy ? ` dy="${toFixed(dy, config.NUM_FRACTION_DIGITS)}" ` : '';

    return `<tspan x="${toFixed(
      left,
      config.NUM_FRACTION_DIGITS
    )}" y="${toFixed(
      top,
      config.NUM_FRACTION_DIGITS
    )}" ${dySpan}${fillStyles}>${escapeXml(char)}</tspan>`;
  }

  private _setSVGTextLineText(
    textSpans: string[],
    lineIndex: number,
    textLeftOffset: number,
    textTopOffset: number
  ) {
    const lineHeight = this.getHeightOfLine(lineIndex),
      isJustify = this.textAlign.indexOf('justify') !== -1,
      line = this._textLines[lineIndex];
    let actualStyle,
      nextStyle,
      charsToRender = '',
      charBox,
      style,
      boxWidth = 0,
      timeToRender;

    textTopOffset +=
      (lineHeight * (1 - this._fontSizeFraction)) / this.lineHeight;
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
        actualStyle =
          actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
        timeToRender = hasStyleChanged(actualStyle, nextStyle, true);
      }
      if (timeToRender) {
        style = this._getStyleDeclaration(lineIndex, i) || {};
        textSpans.push(
          this._createTextCharSpan(
            charsToRender,
            style,
            textLeftOffset,
            textTopOffset
          )
        );
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

  private _setSVGTextLineBg(
    textBgRects: (string | number)[],
    i: number,
    leftOffset: number,
    textTopOffset: number
  ) {
    const line = this._textLines[i],
      heightOfLine = this.getHeightOfLine(i) / this.lineHeight;
    let boxWidth = 0,
      boxStart = 0,
      charBox,
      currentColor,
      lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');
    for (let j = 0; j < line.length; j++) {
      charBox = this.__charBounds[i][j];
      currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
      if (currentColor !== lastColor) {
        lastColor &&
          textBgRects.push(
            ...createSVGInlineRect(
              lastColor,
              leftOffset + boxStart,
              textTopOffset,
              boxWidth,
              heightOfLine
            )
          );
        boxStart = charBox.left;
        boxWidth = charBox.width;
        lastColor = currentColor;
      } else {
        boxWidth += charBox.kernedWidth;
      }
    }
    currentColor &&
      textBgRects.push(
        ...createSVGInlineRect(
          lastColor,
          leftOffset + boxStart,
          textTopOffset,
          boxWidth,
          heightOfLine
        )
      );
  }

  /**
   * @deprecated unused
   */
  _getSVGLineTopOffset(lineIndex: number) {
    let lineTopOffset = 0,
      lastHeight = 0;
    for (let j = 0; j < lineIndex; j++) {
      lineTopOffset += this.getHeightOfLine(j);
    }
    lastHeight = this.getHeightOfLine(j);
    return {
      lineTop: lineTopOffset,
      offset:
        ((this._fontSizeMult - this._fontSizeFraction) * lastHeight) /
        (this.lineHeight * this._fontSizeMult),
    };
  }

  /**
   * Returns styles-string for svg-export
   * @param {Boolean} skipShadow a boolean to skip shadow filter output
   * @return {String}
   */
  getSvgStyles(skipShadow?: boolean) {
    return `${super.getSvgStyles(skipShadow)} white-space: pre;`;
  }
}
