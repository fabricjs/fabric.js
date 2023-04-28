// @ts-nocheck
import { cache } from '../../cache';
import { DEFAULT_SVG_FONT_SIZE } from '../../constants';
import { ObjectEvents } from '../../EventTypeDefs';
import { TextStyle, TextStyleDeclaration, StyledText } from './StyledText';
import { SHARED_ATTRIBUTES } from '../../parser/attributes';
import { parseAttributes } from '../../parser/parseAttributes';
import type { Point } from '../../Point';
import type {
  TCacheCanvasDimensions,
  TClassProperties,
  TFiller,
} from '../../typedefs';
import { classRegistry } from '../../ClassRegistry';
import { graphemeSplit } from '../../util/lang_string';
import { createCanvasElement } from '../../util/misc/dom';
import {
  hasStyleChanged,
  stylesFromArray,
  stylesToArray,
} from '../../util/misc/textStyles';
import { getPathSegmentsInfo, getPointOnPath } from '../../util/path';
import { cacheProperties } from '../Object/FabricObject';
import { Path } from '../Path';
import { TextSVGExportMixin } from './TextSVGExportMixin';
import { applyMixins } from '../../util/applyMixins';
import type {
  FabricObjectProps,
  SerializedObjectProps,
  TProps,
} from '../Object/types';
import {
  additionalProps,
  textDefaultValues,
  textLayoutProperties,
} from './constants';

let measuringContext: CanvasRenderingContext2D | null;

/**
 * Return a context for measurement of text string.
 * if created it gets stored for reuse
 */
function getMeasuringContext() {
  if (!measuringContext) {
    measuringContext = createCanvasElement().getContext('2d');
  }
  return measuringContext;
}

type TPathSide = 'left' | 'right';

type TPathAlign = 'baseline' | 'center' | 'ascender' | 'descender';

/**
 * Measure and return the info of a single grapheme.
 * needs the the info of previous graphemes already filled
 * Override to customize measuring
 */
export type GraphemeBBox<onPath = false> = {
  width: number;
  height: number;
  kernedWidth: number;
  left: number;
  deltaY: number;
} & (onPath extends true
  ? {
      // on path
      renderLeft: number;
      renderTop: number;
      angle: number;
    }
  : Record<string, never>);

// @TODO this is not complete
interface UniqueTextProps {
  charSpacing: number;
  lineHeight: number;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  fontStyle: string;
  pathSide: TPathSide;
  pathAlign: TPathAlign;
  underline: boolean;
  overline: boolean;
  linethrough: boolean;
  textAlign: string;
  direction: CanvasDirection;
  path?: Path;
}

export interface SerializedTextProps
  extends SerializedObjectProps,
    UniqueTextProps {}

export interface TextProps extends FabricObjectProps, UniqueTextProps {}

/**
 * Text class
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#text}
 */
export class Text<
    Props extends TProps<TextProps> = Partial<TextProps>,
    SProps extends SerializedTextProps = SerializedTextProps,
    EventSpec extends ObjectEvents = ObjectEvents
  >
  extends StyledText<Props, SProps, EventSpec>
  implements UniqueTextProps
{
  /**
   * Properties that requires a text layout recalculation when changed
   * @type string[]
   * @protected
   */
  static textLayoutProperties: string[] = textLayoutProperties;

  /**
   * @private
   */
  declare _reNewline: RegExp;

  /**
   * Use this regular expression to filter for whitespaces that is not a new line.
   * Mostly used when text is 'justify' aligned.
   * @private
   */
  declare _reSpacesAndTabs: RegExp;

  /**
   * Use this regular expression to filter for whitespace that is not a new line.
   * Mostly used when text is 'justify' aligned.
   * @private
   */
  declare _reSpaceAndTab: RegExp;

  /**
   * Use this regular expression to filter consecutive groups of non spaces.
   * Mostly used when text is 'justify' aligned.
   * @private
   */
  declare _reWords: RegExp;

  declare text: string;

  /**
   * Font size (in pixels)
   * @type Number
   * @default
   */
  declare fontSize: number;

  /**
   * Font weight (e.g. bold, normal, 400, 600, 800)
   * @type {(Number|String)}
   * @default
   */
  declare fontWeight: string;

  /**
   * Font family
   * @type String
   * @default
   */
  declare fontFamily: string;

  /**
   * Text decoration underline.
   * @type Boolean
   * @default
   */
  declare underline: boolean;

  /**
   * Text decoration overline.
   * @type Boolean
   * @default
   */
  declare overline: boolean;

  /**
   * Text decoration linethrough.
   * @type Boolean
   * @default
   */
  declare linethrough: boolean;

  /**
   * Text alignment. Possible values: "left", "center", "right", "justify",
   * "justify-left", "justify-center" or "justify-right".
   * @type String
   * @default
   */
  declare textAlign: string;

  /**
   * Font style . Possible values: "", "normal", "italic" or "oblique".
   * @type String
   * @default
   */
  declare fontStyle: string;

  /**
   * Line height
   * @type Number
   * @default
   */
  declare lineHeight: number;

  /**
   * Superscript schema object (minimum overlap)
   */
  declare superscript: {
    /**
     * fontSize factor
     * @default 0.6
     */
    size: number;
    /**
     * baseline-shift factor (upwards)
     * @default -0.35
     */
    baseline: number;
  };

  /**
   * Subscript schema object (minimum overlap)
   */
  declare subscript: {
    /**
     * fontSize factor
     * @default 0.6
     */
    size: number;
    /**
     * baseline-shift factor (downwards)
     * @default 0.11
     */
    baseline: number;
  };

  /**
   * Background color of text lines
   * @type String
   * @default
   */
  declare textBackgroundColor: string;

  declare styles: TextStyle;

  /**
   * Path that the text should follow.
   * since 4.6.0 the path will be drawn automatically.
   * if you want to make the path visible, give it a stroke and strokeWidth or fill value
   * if you want it to be hidden, assign visible = false to the path.
   * This feature is in BETA, and SVG import/export is not yet supported.
   * @type Path
   * @example
   * const textPath = new Text('Text on a path', {
   *     top: 150,
   *     left: 150,
   *     textAlign: 'center',
   *     charSpacing: -50,
   *     path: new Path('M 0 0 C 50 -100 150 -100 200 0', {
   *         strokeWidth: 1,
   *         visible: false
   *     }),
   *     pathSide: 'left',
   *     pathStartOffset: 0
   * });
   * @default
   */
  declare path: Path | null;

  /**
   * Offset amount for text path starting position
   * Only used when text has a path
   * @type Number
   * @default
   */
  declare pathStartOffset: number;

  /**
   * Which side of the path the text should be drawn on.
   * Only used when text has a path
   * @type {TPathSide} 'left|right'
   * @default
   */
  declare pathSide: TPathSide;

  /**
   * How text is aligned to the path. This property determines
   * the perpendicular position of each character relative to the path.
   * (one of "baseline", "center", "ascender", "descender")
   * This feature is in BETA, and its behavior may change
   * @type TPathAlign
   * @default
   */
  declare pathAlign: TPathAlign;

  /**
   * @private
   */
  declare _fontSizeFraction: number;

  /**
   * @private
   */
  declare offsets: { underline: number; linethrough: number; overline: number };

  /**
   * Text Line proportion to font Size (in pixels)
   * @type Number
   * @default
   */
  declare _fontSizeMult: number;

  /**
   * additional space between characters
   * expressed in thousands of em unit
   * @type Number
   * @default
   */
  declare charSpacing: number;

  /**
   * Baseline shift, styles only, keep at 0 for the main text object
   * @type {Number}
   * @default
   */
  declare deltaY: number;

  /**
   * WARNING: EXPERIMENTAL. NOT SUPPORTED YET
   * determine the direction of the text.
   * This has to be set manually together with textAlign and originX for proper
   * experience.
   * some interesting link for the future
   * https://www.w3.org/International/questions/qa-bidi-unicode-controls
   * @since 4.5.0
   * @type {CanvasDirection} 'ltr|rtl'
   * @default
   */
  declare direction: CanvasDirection;

  /**
   * contains characters bounding boxes
   */
  protected __charBounds: GraphemeBBox[][] = [];

  /**
   * use this size when measuring text. To avoid IE11 rounding errors
   * @type {Number}
   * @default
   * @readonly
   * @private
   */
  declare CACHE_FONT_SIZE: number;

  /**
   * contains the min text width to avoid getting 0
   * @type {Number}
   * @default
   */
  declare MIN_TEXT_WIDTH: number;

  /**
   * contains the the text of the object, divided in lines as they are displayed
   * on screen. Wrapping will divide the text independently of line breaks
   * @type {string[]}
   * @default
   */
  declare textLines: string[];

  /**
   * same as textlines, but each line is an array of graphemes as split by splitByGrapheme
   * @type {string[]}
   * @default
   */
  declare _textLines: string[][];

  declare _unwrappedTextLines: string[][];
  declare _text: string[];
  declare cursorWidth: number;
  declare __lineHeights: number[];
  declare __lineWidths: number[];
  declare initialized?: true;

  static cacheProperties = [...cacheProperties, ...additionalProps];

  static ownDefaults: Record<string, any> = textDefaultValues;

  static getDefaults() {
    return { ...super.getDefaults(), ...Text.ownDefaults };
  }

  constructor(text: string, options: any) {
    super({ ...options, text, styles: options?.styles || {} });
    this.initialized = true;
    if (this.path) {
      this.setPathInfo();
    }
    this.initDimensions();
    this.setCoords();
  }

  /**
   * If text has a path, it will add the extra information needed
   * for path and text calculations
   */
  setPathInfo() {
    const path = this.path;
    if (path) {
      path.segmentsInfo = getPathSegmentsInfo(path.path);
    }
  }

  /**
   * @private
   * Divides text into lines of text and lines of graphemes.
   */
  _splitText() {
    const newLines = this._splitTextIntoLines(this.text);
    this.textLines = newLines.lines;
    this._textLines = newLines.graphemeLines;
    this._unwrappedTextLines = newLines._unwrappedLines;
    this._text = newLines.graphemeText;
    return newLines;
  }

  /**
   * Initialize or update text dimensions.
   * Updates this.width and this.height with the proper values.
   * Does not return dimensions.
   */
  initDimensions() {
    this._splitText();
    this._clearCache();
    this.dirty = true;
    if (this.path) {
      this.width = this.path.width;
      this.height = this.path.height;
    } else {
      this.width =
        this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH;
      this.height = this.calcTextHeight();
    }
    if (this.textAlign.indexOf('justify') !== -1) {
      // once text is measured we need to make space fatter to make justified text.
      this.enlargeSpaces();
    }
  }

  /**
   * Enlarge space boxes and shift the others
   */
  enlargeSpaces() {
    let diffSpace,
      currentLineWidth,
      numberOfSpaces,
      accumulatedSpace,
      line,
      charBound,
      spaces;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (
        this.textAlign !== 'justify' &&
        (i === len - 1 || this.isEndOfWrapping(i))
      ) {
        continue;
      }
      accumulatedSpace = 0;
      line = this._textLines[i];
      currentLineWidth = this.getLineWidth(i);
      if (
        currentLineWidth < this.width &&
        (spaces = this.textLines[i].match(this._reSpacesAndTabs))
      ) {
        numberOfSpaces = spaces.length;
        diffSpace = (this.width - currentLineWidth) / numberOfSpaces;
        for (let j = 0; j <= line.length; j++) {
          charBound = this.__charBounds[i][j];
          if (this._reSpaceAndTab.test(line[j])) {
            charBound.width += diffSpace;
            charBound.kernedWidth += diffSpace;
            charBound.left += accumulatedSpace;
            accumulatedSpace += diffSpace;
          } else {
            charBound.left += accumulatedSpace;
          }
        }
      }
    }
  }

  /**
   * Detect if the text line is ended with an hard break
   * text and itext do not have wrapping, return false
   * @return {Boolean}
   */
  isEndOfWrapping(lineIndex: number): boolean {
    return lineIndex === this._textLines.length - 1;
  }

  /**
   * Detect if a line has a linebreak and so we need to account for it when moving
   * and counting style.
   * It return always for text and Itext.
   * @return Number
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  missingNewlineOffset(lineIndex: number) {
    return 1;
  }

  /**
   * Returns 2d representation (lineIndex and charIndex) of cursor
   * @param {Number} selectionStart
   * @param {Boolean} [skipWrapping] consider the location for unwrapped lines. useful to manage styles.
   */
  get2DCursorLocation(selectionStart: number, skipWrapping?: boolean) {
    const lines = skipWrapping ? this._unwrappedTextLines : this._textLines;
    let i: number;
    for (i = 0; i < lines.length; i++) {
      if (selectionStart <= lines[i].length) {
        return {
          lineIndex: i,
          charIndex: selectionStart,
        };
      }
      selectionStart -= lines[i].length + this.missingNewlineOffset(i);
    }
    return {
      lineIndex: i - 1,
      charIndex:
        lines[i - 1].length < selectionStart
          ? lines[i - 1].length
          : selectionStart,
    };
  }

  /**
   * Returns string representation of an instance
   * @return {String} String representation of text object
   */
  toString(): string {
    return `#<Text (${this.complexity()}): { "text": "${
      this.text
    }", "fontFamily": "${this.fontFamily}" }>`;
  }

  /**
   * Return the dimension and the zoom level needed to create a cache canvas
   * big enough to host the object to be cached.
   * @private
   * @param {Object} dim.x width of object to be cached
   * @param {Object} dim.y height of object to be cached
   * @return {Object}.width width of canvas
   * @return {Object}.height height of canvas
   * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
   * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
   */
  _getCacheCanvasDimensions(): TCacheCanvasDimensions {
    const dims = super._getCacheCanvasDimensions();
    const fontSize = this.fontSize;
    dims.width += fontSize * dims.zoomX;
    dims.height += fontSize * dims.zoomY;
    return dims;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
    const path = this.path;
    path && !path.isNotVisible() && path._render(ctx);
    this._setTextStyles(ctx);
    this._renderTextLinesBackground(ctx);
    this._renderTextDecoration(ctx, 'underline');
    this._renderText(ctx);
    this._renderTextDecoration(ctx, 'overline');
    this._renderTextDecoration(ctx, 'linethrough');
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderText(ctx: CanvasRenderingContext2D) {
    if (this.paintFirst === 'stroke') {
      this._renderTextStroke(ctx);
      this._renderTextFill(ctx);
    } else {
      this._renderTextFill(ctx);
      this._renderTextStroke(ctx);
    }
  }

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
  _setTextStyles(
    ctx: CanvasRenderingContext2D,
    charStyle?: any,
    forMeasuring?: boolean
  ) {
    ctx.textBaseline = 'alphabetic';
    if (this.path) {
      switch (this.pathAlign) {
        case 'center':
          ctx.textBaseline = 'middle';
          break;
        case 'ascender':
          ctx.textBaseline = 'top';
          break;
        case 'descender':
          ctx.textBaseline = 'bottom';
          break;
      }
    }
    ctx.font = this._getFontDeclaration(charStyle, forMeasuring);
  }

  /**
   * calculate and return the text Width measuring each line.
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @return {Number} Maximum width of Text object
   */
  calcTextWidth(): number {
    let maxWidth = this.getLineWidth(0);

    for (let i = 1, len = this._textLines.length; i < len; i++) {
      const currentLineWidth = this.getLineWidth(i);
      if (currentLineWidth > maxWidth) {
        maxWidth = currentLineWidth;
      }
    }
    return maxWidth;
  }

  /**
   * @private
   * @param {String} method Method name ("fillText" or "strokeText")
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {String} line Text to render
   * @param {Number} left Left position of text
   * @param {Number} top Top position of text
   * @param {Number} lineIndex Index of a line in a text
   */
  _renderTextLine(
    method: 'fillText' | 'strokeText',
    ctx: CanvasRenderingContext2D,
    line: string[],
    left: number,
    top: number,
    lineIndex: number
  ) {
    this._renderChars(method, ctx, line, left, top, lineIndex);
  }

  /**
   * Renders the text background for lines, taking care of style
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextLinesBackground(ctx: CanvasRenderingContext2D) {
    if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor')) {
      return;
    }
    const originalFill = ctx.fillStyle,
      leftOffset = this._getLeftOffset();
    let lineTopOffset = this._getTopOffset();

    for (let i = 0, len = this._textLines.length; i < len; i++) {
      const heightOfLine = this.getHeightOfLine(i);
      if (
        !this.textBackgroundColor &&
        !this.styleHas('textBackgroundColor', i)
      ) {
        lineTopOffset += heightOfLine;
        continue;
      }
      const jlen = this._textLines[i].length;
      const lineLeftOffset = this._getLineLeftOffset(i);
      let boxWidth = 0;
      let boxStart = 0;
      let drawStart;
      let currentColor;
      let lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');
      for (let j = 0; j < jlen; j++) {
        const charBox = this.__charBounds[i][j];
        currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
        if (this.path) {
          ctx.save();
          ctx.translate(charBox.renderLeft, charBox.renderTop);
          ctx.rotate(charBox.angle);
          ctx.fillStyle = currentColor;
          currentColor &&
            ctx.fillRect(
              -charBox.width / 2,
              (-heightOfLine / this.lineHeight) * (1 - this._fontSizeFraction),
              charBox.width,
              heightOfLine / this.lineHeight
            );
          ctx.restore();
        } else if (currentColor !== lastColor) {
          drawStart = leftOffset + lineLeftOffset + boxStart;
          if (this.direction === 'rtl') {
            drawStart = this.width - drawStart - boxWidth;
          }
          ctx.fillStyle = lastColor;
          lastColor &&
            ctx.fillRect(
              drawStart,
              lineTopOffset,
              boxWidth,
              heightOfLine / this.lineHeight
            );
          boxStart = charBox.left;
          boxWidth = charBox.width;
          lastColor = currentColor;
        } else {
          boxWidth += charBox.kernedWidth;
        }
      }
      if (currentColor && !this.path) {
        drawStart = leftOffset + lineLeftOffset + boxStart;
        if (this.direction === 'rtl') {
          drawStart = this.width - drawStart - boxWidth;
        }
        ctx.fillStyle = currentColor;
        ctx.fillRect(
          drawStart,
          lineTopOffset,
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
  }

  /**
   * measure and return the width of a single character.
   * possibly overridden to accommodate different measure logic or
   * to hook some external lib for character measurement
   * @private
   * @param {String} _char, char to be measured
   * @param {Object} charStyle style of char to be measured
   * @param {String} [previousChar] previous char
   * @param {Object} [prevCharStyle] style of previous char
   */
  _measureChar(
    _char: string,
    charStyle: TextStyleDeclaration,
    previousChar: string | undefined,
    prevCharStyle: any
  ) {
    const fontCache = cache.getFontCache(charStyle),
      fontDeclaration = this._getFontDeclaration(charStyle),
      previousFontDeclaration = this._getFontDeclaration(prevCharStyle),
      couple = previousChar + _char,
      stylesAreEqual = fontDeclaration === previousFontDeclaration,
      fontMultiplier = charStyle.fontSize / this.CACHE_FONT_SIZE;
    let width: number | undefined,
      coupleWidth: number | undefined,
      previousWidth: number | undefined,
      kernedWidth: number | undefined;

    if (previousChar && fontCache[previousChar] !== undefined) {
      previousWidth = fontCache[previousChar];
    }
    if (fontCache[_char] !== undefined) {
      kernedWidth = width = fontCache[_char];
    }
    if (stylesAreEqual && fontCache[couple] !== undefined) {
      coupleWidth = fontCache[couple];
      kernedWidth = coupleWidth - previousWidth!;
    }
    if (
      width === undefined ||
      previousWidth === undefined ||
      coupleWidth === undefined
    ) {
      const ctx = getMeasuringContext()!;
      // send a TRUE to specify measuring font size CACHE_FONT_SIZE
      this._setTextStyles(ctx, charStyle, true);
      if (width === undefined) {
        kernedWidth = width = ctx.measureText(_char).width;
        fontCache[_char] = width;
      }
      if (previousWidth === undefined && stylesAreEqual && previousChar) {
        previousWidth = ctx.measureText(previousChar).width;
        fontCache[previousChar] = previousWidth;
      }
      if (stylesAreEqual && coupleWidth === undefined) {
        // we can measure the kerning couple and subtract the width of the previous character
        coupleWidth = ctx.measureText(couple).width;
        fontCache[couple] = coupleWidth;
        kernedWidth = coupleWidth - previousWidth;
      }
    }
    return {
      width: width * fontMultiplier,
      kernedWidth: kernedWidth * fontMultiplier,
    };
  }

  /**
   * Computes height of character at given position
   * @param {Number} line the line index number
   * @param {Number} _char the character index number
   * @return {Number} fontSize of the character
   */
  getHeightOfChar(line: number, _char: number): number {
    return this.getValueOfPropertyAt(line, _char, 'fontSize');
  }

  /**
   * measure a text line measuring all characters.
   * @param {Number} lineIndex line number
   */
  measureLine(lineIndex: number) {
    const lineInfo = this._measureLine(lineIndex);
    if (this.charSpacing !== 0) {
      lineInfo.width -= this._getWidthOfCharSpacing();
    }
    if (lineInfo.width < 0) {
      lineInfo.width = 0;
    }
    return lineInfo;
  }

  /**
   * measure every grapheme of a line, populating __charBounds
   * @param {Number} lineIndex
   * @return {Object} object.width total width of characters
   * @return {Object} object.numOfSpaces length of chars that match this._reSpacesAndTabs
   */
  _measureLine(lineIndex: number) {
    let width = 0,
      prevGrapheme: string | undefined,
      graphemeInfo: GraphemeBBox | undefined;

    const reverse = this.pathSide === 'right',
      path = this.path,
      line = this._textLines[lineIndex],
      llength = line.length,
      lineBounds = new Array<GraphemeBBox>(llength);

    this.__charBounds[lineIndex] = lineBounds;
    for (let i = 0; i < llength; i++) {
      const grapheme = line[i];
      graphemeInfo = this._getGraphemeBox(grapheme, lineIndex, i, prevGrapheme);
      lineBounds[i] = graphemeInfo;
      width += graphemeInfo.kernedWidth;
      prevGrapheme = grapheme;
    }
    // this latest bound box represent the last character of the line
    // to simplify cursor handling in interactive mode.
    lineBounds[llength] = {
      left: graphemeInfo ? graphemeInfo.left + graphemeInfo.width : 0,
      width: 0,
      kernedWidth: 0,
      height: this.fontSize,
    };
    if (path && path.segmentsInfo) {
      let positionInPath = 0;
      const totalPathLength =
        path.segmentsInfo[path.segmentsInfo.length - 1].length;
      const startingPoint = getPointOnPath(path.path, 0, path.segmentsInfo);
      startingPoint.x += path.pathOffset.x;
      startingPoint.y += path.pathOffset.y;
      switch (this.textAlign) {
        case 'left':
          positionInPath = reverse ? totalPathLength - width : 0;
          break;
        case 'center':
          positionInPath = (totalPathLength - width) / 2;
          break;
        case 'right':
          positionInPath = reverse ? 0 : totalPathLength - width;
          break;
        //todo - add support for justify
      }
      positionInPath += this.pathStartOffset * (reverse ? -1 : 1);
      for (
        let i = reverse ? llength - 1 : 0;
        reverse ? i >= 0 : i < llength;
        reverse ? i-- : i++
      ) {
        graphemeInfo = lineBounds[i];
        if (positionInPath > totalPathLength) {
          positionInPath %= totalPathLength;
        } else if (positionInPath < 0) {
          positionInPath += totalPathLength;
        }
        // it would probably much faster to send all the grapheme position for a line
        // and calculate path position/angle at once.
        this._setGraphemeOnPath(positionInPath, graphemeInfo, startingPoint);
        positionInPath += graphemeInfo.kernedWidth;
      }
    }
    return { width: width, numOfSpaces: 0 };
  }

  /**
   * Calculate the angle  and the left,top position of the char that follow a path.
   * It appends it to graphemeInfo to be reused later at rendering
   * @private
   * @param {Number} positionInPath to be measured
   * @param {GraphemeBBox} graphemeInfo current grapheme box information
   * @param {Object} startingPoint position of the point
   */
  _setGraphemeOnPath(
    positionInPath: number,
    graphemeInfo: GraphemeBBox<true>,
    startingPoint: Point
  ) {
    const centerPosition = positionInPath + graphemeInfo.kernedWidth / 2,
      path = this.path;

    // we are at currentPositionOnPath. we want to know what point on the path is.
    const info = getPointOnPath(path.path, centerPosition, path.segmentsInfo);
    graphemeInfo.renderLeft = info.x - startingPoint.x;
    graphemeInfo.renderTop = info.y - startingPoint.y;
    graphemeInfo.angle = info.angle + (this.pathSide === 'right' ? Math.PI : 0);
  }

  /**
   *
   * @param {String} grapheme to be measured
   * @param {Number} lineIndex index of the line where the char is
   * @param {Number} charIndex position in the line
   * @param {String} [prevGrapheme] character preceding the one to be measured
   * @returns {GraphemeBBox} grapheme bbox
   */
  _getGraphemeBox(
    grapheme: string,
    lineIndex: number,
    charIndex: number,
    prevGrapheme?: string,
    skipLeft?: boolean
  ): GraphemeBBox {
    const style = this.getCompleteStyleDeclaration(lineIndex, charIndex),
      prevStyle = prevGrapheme
        ? this.getCompleteStyleDeclaration(lineIndex, charIndex - 1)
        : {},
      info = this._measureChar(grapheme, style, prevGrapheme, prevStyle);
    let kernedWidth = info.kernedWidth,
      width = info.width,
      charSpacing;

    if (this.charSpacing !== 0) {
      charSpacing = this._getWidthOfCharSpacing();
      width += charSpacing;
      kernedWidth += charSpacing;
    }

    const box: GraphemeBBox = {
      width,
      left: 0,
      height: style.fontSize,
      kernedWidth,
      deltaY: style.deltaY,
    };
    if (charIndex > 0 && !skipLeft) {
      const previousBox = this.__charBounds[lineIndex][charIndex - 1];
      box.left =
        previousBox.left + previousBox.width + info.kernedWidth - info.width;
    }
    return box;
  }

  /**
   * Calculate height of line at 'lineIndex'
   * @param {Number} lineIndex index of line to calculate
   * @return {Number}
   */
  getHeightOfLine(lineIndex: number): number {
    if (this.__lineHeights[lineIndex]) {
      return this.__lineHeights[lineIndex];
    }

    // char 0 is measured before the line cycle because it needs to char
    // emptylines
    let maxHeight = this.getHeightOfChar(lineIndex, 0);
    for (let i = 1, len = this._textLines[lineIndex].length; i < len; i++) {
      maxHeight = Math.max(this.getHeightOfChar(lineIndex, i), maxHeight);
    }

    return (this.__lineHeights[lineIndex] =
      maxHeight * this.lineHeight * this._fontSizeMult);
  }

  /**
   * Calculate text box height
   */
  calcTextHeight() {
    let lineHeight,
      height = 0;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      lineHeight = this.getHeightOfLine(i);
      height += i === len - 1 ? lineHeight / this.lineHeight : lineHeight;
    }
    return height;
  }

  /**
   * @private
   * @return {Number} Left offset
   */
  _getLeftOffset(): number {
    return this.direction === 'ltr' ? -this.width / 2 : this.width / 2;
  }

  /**
   * @private
   * @return {Number} Top offset
   */
  _getTopOffset(): number {
    return -this.height / 2;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {String} method Method name ("fillText" or "strokeText")
   */
  _renderTextCommon(
    ctx: CanvasRenderingContext2D,
    method: 'fillText' | 'strokeText'
  ) {
    ctx.save();
    let lineHeights = 0;
    const left = this._getLeftOffset(),
      top = this._getTopOffset();
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      const heightOfLine = this.getHeightOfLine(i),
        maxHeight = heightOfLine / this.lineHeight,
        leftOffset = this._getLineLeftOffset(i);
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
    ctx.restore();
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextFill(ctx: CanvasRenderingContext2D) {
    if (!this.fill && !this.styleHas('fill')) {
      return;
    }

    this._renderTextCommon(ctx, 'fillText');
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextStroke(ctx: CanvasRenderingContext2D) {
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
  }

  /**
   * @private
   * @param {String} method fillText or strokeText.
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Array} line Content of the line, splitted in an array by grapheme
   * @param {Number} left
   * @param {Number} top
   * @param {Number} lineIndex
   */
  _renderChars(
    method: 'fillText' | 'strokeText',
    ctx: CanvasRenderingContext2D,
    line: Array<any>,
    left: number,
    top: number,
    lineIndex: number
  ) {
    const lineHeight = this.getHeightOfLine(lineIndex),
      isJustify = this.textAlign.indexOf('justify') !== -1,
      path = this.path,
      shortCut =
        !isJustify &&
        this.charSpacing === 0 &&
        this.isEmptyStyles(lineIndex) &&
        !path,
      isLtr = this.direction === 'ltr',
      sign = this.direction === 'ltr' ? 1 : -1,
      // this was changed in the PR #7674
      // currentDirection = ctx.canvas.getAttribute('dir');
      currentDirection = ctx.direction;

    let actualStyle,
      nextStyle,
      charsToRender = '',
      charBox,
      boxWidth = 0,
      timeToRender,
      drawingLeft;

    ctx.save();
    if (currentDirection !== this.direction) {
      ctx.canvas.setAttribute('dir', isLtr ? 'ltr' : 'rtl');
      ctx.direction = isLtr ? 'ltr' : 'rtl';
      ctx.textAlign = isLtr ? 'left' : 'right';
    }
    top -= (lineHeight * this._fontSizeFraction) / this.lineHeight;
    if (shortCut) {
      // render all the line in one pass without checking
      // drawingLeft = isLtr ? left : left - this.getLineWidth(lineIndex);
      this._renderChar(method, ctx, lineIndex, 0, line.join(''), left, top);
      ctx.restore();
      return;
    }
    for (let i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing || path;
      charsToRender += line[i];
      charBox = this.__charBounds[lineIndex][i];
      if (boxWidth === 0) {
        left += sign * (charBox.kernedWidth - charBox.width);
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
        timeToRender = hasStyleChanged(actualStyle, nextStyle, false);
      }
      if (timeToRender) {
        if (path) {
          ctx.save();
          ctx.translate(charBox.renderLeft, charBox.renderTop);
          ctx.rotate(charBox.angle);
          this._renderChar(
            method,
            ctx,
            lineIndex,
            i,
            charsToRender,
            -boxWidth / 2,
            0
          );
          ctx.restore();
        } else {
          drawingLeft = left;
          this._renderChar(
            method,
            ctx,
            lineIndex,
            i,
            charsToRender,
            drawingLeft,
            top
          );
        }
        charsToRender = '';
        actualStyle = nextStyle;
        left += sign * boxWidth;
        boxWidth = 0;
      }
    }
    ctx.restore();
  }

  /**
   * This function try to patch the missing gradientTransform on canvas gradients.
   * transforming a context to transform the gradient, is going to transform the stroke too.
   * we want to transform the gradient but not the stroke operation, so we create
   * a transformed gradient on a pattern and then we use the pattern instead of the gradient.
   * this method has drawbacks: is slow, is in low resolution, needs a patch for when the size
   * is limited.
   * @private
   * @param {TFiller} filler a fabric gradient instance
   * @return {CanvasPattern} a pattern to use as fill/stroke style
   */
  _applyPatternGradientTransformText(filler: TFiller) {
    const pCanvas = createCanvasElement(),
      // TODO: verify compatibility with strokeUniform
      width = this.width + this.strokeWidth,
      height = this.height + this.strokeWidth,
      pCtx = pCanvas.getContext('2d')!;
    pCanvas.width = width;
    pCanvas.height = height;
    pCtx.beginPath();
    pCtx.moveTo(0, 0);
    pCtx.lineTo(width, 0);
    pCtx.lineTo(width, height);
    pCtx.lineTo(0, height);
    pCtx.closePath();
    pCtx.translate(width / 2, height / 2);
    pCtx.fillStyle = filler.toLive(pCtx)!;
    this._applyPatternGradientTransform(pCtx, filler);
    pCtx.fill();
    return pCtx.createPattern(pCanvas, 'no-repeat')!;
  }

  handleFiller<T extends 'fill' | 'stroke'>(
    ctx: CanvasRenderingContext2D,
    property: `${T}Style`,
    filler: TFiller | string
  ) {
    let offsetX, offsetY;
    if (filler.toLive) {
      if (
        filler.gradientUnits === 'percentage' ||
        filler.gradientTransform ||
        filler.patternTransform
      ) {
        // need to transform gradient in a pattern.
        // this is a slow process. If you are hitting this codepath, and the object
        // is not using caching, you should consider switching it on.
        // we need a canvas as big as the current object caching canvas.
        offsetX = -this.width / 2;
        offsetY = -this.height / 2;
        ctx.translate(offsetX, offsetY);
        ctx[property] = this._applyPatternGradientTransformText(filler);
        return { offsetX: offsetX, offsetY: offsetY };
      } else {
        // is a simple gradient or pattern
        ctx[property] = filler.toLive(ctx, this)!;
        return this._applyPatternGradientTransform(ctx, filler);
      }
    } else {
      // is a color
      ctx[property] = filler;
    }
    return { offsetX: 0, offsetY: 0 };
  }

  _setStrokeStyles(
    ctx: CanvasRenderingContext2D,
    { stroke, strokeWidth }: Pick<this, 'stroke' | 'strokeWidth'>
  ) {
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = this.strokeLineCap;
    ctx.lineDashOffset = this.strokeDashOffset;
    ctx.lineJoin = this.strokeLineJoin;
    ctx.miterLimit = this.strokeMiterLimit;
    return this.handleFiller(ctx, 'strokeStyle', stroke);
  }

  _setFillStyles(ctx: CanvasRenderingContext2D, { fill }: Pick<this, 'fill'>) {
    return this.handleFiller(ctx, 'fillStyle', fill);
  }

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
  _renderChar(
    method: 'fillText' | 'strokeText',
    ctx: CanvasRenderingContext2D,
    lineIndex: number,
    charIndex: number,
    _char: string,
    left: number,
    top: number
  ) {
    const decl = this._getStyleDeclaration(lineIndex, charIndex),
      fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex),
      shouldFill = method === 'fillText' && fullDecl.fill,
      shouldStroke =
        method === 'strokeText' && fullDecl.stroke && fullDecl.strokeWidth;
    let fillOffsets, strokeOffsets;

    if (!shouldStroke && !shouldFill) {
      return;
    }
    ctx.save();

    shouldFill && (fillOffsets = this._setFillStyles(ctx, fullDecl));
    shouldStroke && (strokeOffsets = this._setStrokeStyles(ctx, fullDecl));

    ctx.font = this._getFontDeclaration(fullDecl);

    if (decl && decl.textBackgroundColor) {
      this._removeShadow(ctx);
    }
    if (decl && decl.deltaY) {
      top += decl.deltaY;
    }
    shouldFill &&
      ctx.fillText(
        _char,
        left - fillOffsets.offsetX,
        top - fillOffsets.offsetY
      );
    shouldStroke &&
      ctx.strokeText(
        _char,
        left - strokeOffsets.offsetX,
        top - strokeOffsets.offsetY
      );
    ctx.restore();
  }

  /**
   * Turns the character into a 'superior figure' (i.e. 'superscript')
   * @param {Number} start selection start
   * @param {Number} end selection end
   */
  setSuperscript(start: number, end: number) {
    this._setScript(start, end, this.superscript);
  }

  /**
   * Turns the character into an 'inferior figure' (i.e. 'subscript')
   * @param {Number} start selection start
   * @param {Number} end selection end
   */
  setSubscript(start: number, end: number) {
    this._setScript(start, end, this.subscript);
  }

  /**
   * Applies 'schema' at given position
   * @private
   * @param {Number} start selection start
   * @param {Number} end selection end
   * @param {Number} schema
   */
  protected _setScript(
    start: number,
    end: number,
    schema: {
      size: number;
      baseline: number;
    }
  ) {
    const loc = this.get2DCursorLocation(start, true),
      fontSize = this.getValueOfPropertyAt(
        loc.lineIndex,
        loc.charIndex,
        'fontSize'
      ),
      dy = this.getValueOfPropertyAt(loc.lineIndex, loc.charIndex, 'deltaY'),
      style = {
        fontSize: fontSize * schema.size,
        deltaY: dy + fontSize * schema.baseline,
      };
    this.setSelectionStyles(style, start, end);
  }

  /**
   * @private
   * @param {Number} lineIndex index text line
   * @return {Number} Line left offset
   */
  _getLineLeftOffset(lineIndex: number): number {
    const lineWidth = this.getLineWidth(lineIndex),
      lineDiff = this.width - lineWidth,
      textAlign = this.textAlign,
      direction = this.direction,
      isEndOfWrapping = this.isEndOfWrapping(lineIndex);
    let leftOffset = 0;
    if (
      textAlign === 'justify' ||
      (textAlign === 'justify-center' && !isEndOfWrapping) ||
      (textAlign === 'justify-right' && !isEndOfWrapping) ||
      (textAlign === 'justify-left' && !isEndOfWrapping)
    ) {
      return 0;
    }
    if (textAlign === 'center') {
      leftOffset = lineDiff / 2;
    }
    if (textAlign === 'right') {
      leftOffset = lineDiff;
    }
    if (textAlign === 'justify-center') {
      leftOffset = lineDiff / 2;
    }
    if (textAlign === 'justify-right') {
      leftOffset = lineDiff;
    }
    if (direction === 'rtl') {
      if (
        textAlign === 'right' ||
        textAlign === 'justify' ||
        textAlign === 'justify-right'
      ) {
        leftOffset = 0;
      } else if (textAlign === 'left' || textAlign === 'justify-left') {
        leftOffset = -lineDiff;
      } else if (textAlign === 'center' || textAlign === 'justify-center') {
        leftOffset = -lineDiff / 2;
      }
    }
    return leftOffset;
  }

  /**
   * @private
   */
  _clearCache() {
    this._forceClearCache = false;
    this.__lineWidths = [];
    this.__lineHeights = [];
    this.__charBounds = [];
  }

  /**
   * Measure a single line given its index. Used to calculate the initial
   * text bounding box. The values are calculated and stored in __lineWidths cache.
   * @private
   * @param {Number} lineIndex line number
   * @return {Number} Line width
   */
  getLineWidth(lineIndex: number): number {
    if (this.__lineWidths[lineIndex] !== undefined) {
      return this.__lineWidths[lineIndex];
    }

    const { width } = this.measureLine(lineIndex);
    this.__lineWidths[lineIndex] = width;
    return width;
  }

  _getWidthOfCharSpacing() {
    if (this.charSpacing !== 0) {
      return (this.fontSize * this.charSpacing) / 1000;
    }
    return 0;
  }

  /**
   * Retrieves the value of property at given character position
   * @param {Number} lineIndex the line number
   * @param {Number} charIndex the character number
   * @param {String} property the property name
   * @returns the value of 'property'
   */
  getValueOfPropertyAt(lineIndex: number, charIndex: number, property: string) {
    const charStyle = this._getStyleDeclaration(lineIndex, charIndex);
    if (charStyle && typeof charStyle[property] !== 'undefined') {
      return charStyle[property];
    }
    return this[property];
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextDecoration(
    ctx: CanvasRenderingContext2D,
    type: 'underline' | 'linethrough' | 'overline'
  ) {
    if (!this[type] && !this.styleHas(type)) {
      return;
    }
    let topOffset = this._getTopOffset();
    const leftOffset = this._getLeftOffset(),
      path = this.path,
      charSpacing = this._getWidthOfCharSpacing(),
      offsetY = this.offsets[type];

    for (let i = 0, len = this._textLines.length; i < len; i++) {
      const heightOfLine = this.getHeightOfLine(i);
      if (!this[type] && !this.styleHas(type, i)) {
        topOffset += heightOfLine;
        continue;
      }
      const line = this._textLines[i];
      const maxHeight = heightOfLine / this.lineHeight;
      const lineLeftOffset = this._getLineLeftOffset(i);
      let boxStart = 0;
      let boxWidth = 0;
      let lastDecoration = this.getValueOfPropertyAt(i, 0, type);
      let lastFill = this.getValueOfPropertyAt(i, 0, 'fill');
      let currentDecoration;
      let currentFill;
      const top = topOffset + maxHeight * (1 - this._fontSizeFraction);
      let size = this.getHeightOfChar(i, 0);
      let dy = this.getValueOfPropertyAt(i, 0, 'deltaY');
      for (let j = 0, jlen = line.length; j < jlen; j++) {
        const charBox = this.__charBounds[i][j];
        currentDecoration = this.getValueOfPropertyAt(i, j, type);
        currentFill = this.getValueOfPropertyAt(i, j, 'fill');
        const currentSize = this.getHeightOfChar(i, j);
        const currentDy = this.getValueOfPropertyAt(i, j, 'deltaY');
        if (path && currentDecoration && currentFill) {
          ctx.save();
          ctx.fillStyle = lastFill;
          ctx.translate(charBox.renderLeft, charBox.renderTop);
          ctx.rotate(charBox.angle);
          ctx.fillRect(
            -charBox.kernedWidth / 2,
            offsetY * currentSize + currentDy,
            charBox.kernedWidth,
            this.fontSize / 15
          );
          ctx.restore();
        } else if (
          (currentDecoration !== lastDecoration ||
            currentFill !== lastFill ||
            currentSize !== size ||
            currentDy !== dy) &&
          boxWidth > 0
        ) {
          let drawStart = leftOffset + lineLeftOffset + boxStart;
          if (this.direction === 'rtl') {
            drawStart = this.width - drawStart - boxWidth;
          }
          if (lastDecoration && lastFill) {
            ctx.fillStyle = lastFill;
            ctx.fillRect(
              drawStart,
              top + offsetY * size + dy,
              boxWidth,
              this.fontSize / 15
            );
          }
          boxStart = charBox.left;
          boxWidth = charBox.width;
          lastDecoration = currentDecoration;
          lastFill = currentFill;
          size = currentSize;
          dy = currentDy;
        } else {
          boxWidth += charBox.kernedWidth;
        }
      }
      let drawStart = leftOffset + lineLeftOffset + boxStart;
      if (this.direction === 'rtl') {
        drawStart = this.width - drawStart - boxWidth;
      }
      ctx.fillStyle = currentFill;
      currentDecoration &&
        currentFill &&
        ctx.fillRect(
          drawStart,
          top + offsetY * size + dy,
          boxWidth - charSpacing,
          this.fontSize / 15
        );
      topOffset += heightOfLine;
    }
    // if there is text background color no
    // other shadows should be casted
    this._removeShadow(ctx);
  }

  /**
   * return font declaration string for canvas context
   * @param {Object} [styleObject] object
   * @returns {String} font declaration formatted for canvas context.
   */
  _getFontDeclaration(
    styleObject?: TextStyleDeclaration,
    forMeasuring?: boolean
  ): string {
    const style = styleObject || this,
      family = this.fontFamily,
      fontIsGeneric = Text.genericFonts.indexOf(family.toLowerCase()) > -1;
    const fontFamily =
      family === undefined ||
      family.indexOf("'") > -1 ||
      family.indexOf(',') > -1 ||
      family.indexOf('"') > -1 ||
      fontIsGeneric
        ? style.fontFamily
        : `"${style.fontFamily}"`;
    return [
      style.fontStyle,
      style.fontWeight,
      forMeasuring ? this.CACHE_FONT_SIZE + 'px' : style.fontSize + 'px',
      fontFamily,
    ].join(' ');
  }

  /**
   * Renders text instance on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) {
      return;
    }
    if (
      this.canvas &&
      this.canvas.skipOffscreen &&
      !this.group &&
      !this.isOnScreen()
    ) {
      return;
    }
    if (this._forceClearCache) {
      this.initDimensions();
    }
    super.render(ctx);
  }

  /**
   * Override this method to customize grapheme splitting
   * @todo the util `graphemeSplit` needs to be injectable in some way.
   * is more comfortable to inject the correct util rather than having to override text
   * in the middle of the prototype chain
   * @param {string} value
   * @returns {string[]} array of graphemes
   */
  graphemeSplit(value: string): string[] {
    return graphemeSplit(value);
  }

  /**
   * Returns the text as an array of lines.
   * @param {String} text text to split
   * @returns  Lines in the text
   */
  _splitTextIntoLines(text: string) {
    const lines = text.split(this._reNewline),
      newLines = new Array<string[]>(lines.length),
      newLine = ['\n'];
    let newText: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      newLines[i] = this.graphemeSplit(lines[i]);
      newText = newText.concat(newLines[i], newLine);
    }
    newText.pop();
    return {
      _unwrappedLines: newLines,
      lines: lines,
      graphemeText: newText,
      graphemeLines: newLines,
    };
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject<
    T extends Omit<Props & TClassProperties<this>, keyof SProps>,
    K extends keyof T = never
  >(propertiesToInclude: K[] = []): Pick<T, K> & SProps {
    return {
      ...super.toObject([...additionalProps, ...propertiesToInclude]),
      styles: stylesToArray(this.styles, this.text),
      ...(this.path ? { path: this.path.toObject() } : {}),
    };
  }

  set(key: string | any, value?: any) {
    const { textLayoutProperties } = this.constructor as typeof Text;
    super.set(key, value);
    let needsDims = false;
    let isAddingPath = false;
    if (typeof key === 'object') {
      for (const _key in key) {
        if (_key === 'path') {
          this.setPathInfo();
        }
        needsDims = needsDims || textLayoutProperties.includes(_key);
        isAddingPath = isAddingPath || _key === 'path';
      }
    } else {
      needsDims = textLayoutProperties.includes(key);
      isAddingPath = key === 'path';
    }
    if (isAddingPath) {
      this.setPathInfo();
    }
    if (needsDims && this.initialized) {
      this.initDimensions();
      this.setCoords();
    }
    return this;
  }

  /**
   * Returns complexity of an instance
   * @return {Number} complexity
   */
  complexity(): number {
    return 1;
  }

  static genericFonts = [
    'sans-serif',
    'serif',
    'cursive',
    'fantasy',
    'monospace',
  ];

  /* _FROM_SVG_START_ */

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Text.fromElement})
   * @static
   * @memberOf Text
   * @see: http://www.w3.org/TR/SVG/text.html#TextElement
   */
  static ATTRIBUTE_NAMES = SHARED_ATTRIBUTES.concat(
    'x',
    'y',
    'dx',
    'dy',
    'font-family',
    'font-style',
    'font-weight',
    'font-size',
    'letter-spacing',
    'text-decoration',
    'text-anchor'
  );

  /**
   * Returns Text instance from an SVG element (<b>not yet implemented</b>)
   * @static
   * @memberOf Text
   * @param {SVGElement} element Element to parse
   * @param {Function} callback callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  static fromElement(
    element: SVGElement,
    callback: (text: Text | null) => any,
    options: object
  ) {
    if (!element) {
      return callback(null);
    }

    const parsedAttributes = parseAttributes(element, Text.ATTRIBUTE_NAMES),
      parsedAnchor = parsedAttributes.textAnchor || 'left';
    options = Object.assign({}, options, parsedAttributes);

    options.top = options.top || 0;
    options.left = options.left || 0;
    if (parsedAttributes.textDecoration) {
      const textDecoration = parsedAttributes.textDecoration;
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
      options.fontSize = DEFAULT_SVG_FONT_SIZE;
    }

    let textContent = '';

    // The XML is not properly parsed in IE9 so a workaround to get
    // textContent is through firstChild.data. Another workaround would be
    // to convert XML loaded from a file to be converted using DOMParser (same way loadSVGFromString() does)
    if (!('textContent' in element)) {
      if ('firstChild' in element && element.firstChild !== null) {
        if ('data' in element.firstChild && element.firstChild.data !== null) {
          textContent = element.firstChild.data;
        }
      }
    } else {
      textContent = element.textContent;
    }

    textContent = textContent
      .replace(/^\s+|\s+$|\n+/g, '')
      .replace(/\s+/g, ' ');
    const originalStrokeWidth = options.strokeWidth;
    options.strokeWidth = 0;

    const text = new this(textContent, options),
      textHeightScaleFactor = text.getScaledHeight() / text.height,
      lineHeightDiff =
        (text.height + text.strokeWidth) * text.lineHeight - text.height,
      scaledDiff = lineHeightDiff * textHeightScaleFactor,
      textHeight = text.getScaledHeight() + scaledDiff;

    let offX = 0;
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
      top:
        text.top -
        (textHeight - text.fontSize * (0.07 + text._fontSizeFraction)) /
          text.lineHeight,
      strokeWidth:
        typeof originalStrokeWidth !== 'undefined' ? originalStrokeWidth : 1,
    });
    callback(text);
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Text instance from an object representation
   * @param {Object} object plain js Object to create an instance from
   * @returns {Promise<Text>}
   */
  static fromObject<T extends TProps<SerializedTextProps>>(object: T) {
    return this._fromObject<Text>(
      {
        ...object,
        styles: stylesFromArray(object.styles || {}, object.text),
      },
      {
        extraParam: 'text',
      }
    );
  }
}

applyMixins(Text, [TextSVGExportMixin]);
classRegistry.setClass(Text);
classRegistry.setSVGClass(Text);
