import { Canvas } from '../../canvas/Canvas';
import type { ITextEvents } from './ITextBehavior';
import { ITextClickBehavior } from './ITextClickBehavior';
import {
  ctrlKeysMapDown,
  ctrlKeysMapUp,
  keysMap,
  keysMapRtl,
} from './constants';
import type { TClassProperties, TFiller, TOptions } from '../../typedefs';
import { classRegistry } from '../../ClassRegistry';
import type { SerializedTextProps, TextProps } from '../Text/Text';
import {
  JUSTIFY,
  JUSTIFY_CENTER,
  JUSTIFY_LEFT,
  JUSTIFY_RIGHT,
} from '../Text/constants';
import { CENTER, FILL, LEFT, RIGHT } from '../../constants';
import type { ObjectToCanvasElementOptions } from '../Object/Object';

export type CursorBoundaries = {
  left: number;
  top: number;
  leftOffset: number;
  topOffset: number;
};

export type CursorRenderingData = {
  color: string;
  opacity: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

// Declare IText protected properties to workaround TS
const protectedDefaultValues = {
  _selectionDirection: null,
  _reSpace: /\s|\r?\n/,
  inCompositionMode: false,
};

export const iTextDefaultValues: Partial<TClassProperties<IText>> = {
  selectionStart: 0,
  selectionEnd: 0,
  selectionColor: 'rgba(17,119,255,0.3)',
  isEditing: false,
  editable: true,
  editingBorderColor: 'rgba(102,153,255,0.25)',
  cursorWidth: 2,
  cursorColor: '',
  cursorDelay: 1000,
  cursorDuration: 600,
  caching: true,
  hiddenTextareaContainer: null,
  keysMap,
  keysMapRtl,
  ctrlKeysMapDown,
  ctrlKeysMapUp,
  ...protectedDefaultValues,
};

// @TODO this is not complete
interface UniqueITextProps {
  selectionStart: number;
  selectionEnd: number;
}

export interface SerializedITextProps
  extends SerializedTextProps,
    UniqueITextProps {}

export interface ITextProps extends TextProps, UniqueITextProps {}

/**
 * @fires changed
 * @fires selection:changed
 * @fires editing:entered
 * @fires editing:exited
 * @fires dragstart
 * @fires drag drag event firing on the drag source
 * @fires dragend
 * @fires copy
 * @fires cut
 * @fires paste
 *
 * #### Supported key combinations
 * ```
 *   Move cursor:                    left, right, up, down
 *   Select character:               shift + left, shift + right
 *   Select text vertically:         shift + up, shift + down
 *   Move cursor by word:            alt + left, alt + right
 *   Select words:                   shift + alt + left, shift + alt + right
 *   Move cursor to line start/end:  cmd + left, cmd + right or home, end
 *   Select till start/end of line:  cmd + shift + left, cmd + shift + right or shift + home, shift + end
 *   Jump to start/end of text:      cmd + up, cmd + down
 *   Select till start/end of text:  cmd + shift + up, cmd + shift + down or shift + pgUp, shift + pgDown
 *   Delete character:               backspace
 *   Delete word:                    alt + backspace
 *   Delete line:                    cmd + backspace
 *   Forward delete:                 delete
 *   Copy text:                      ctrl/cmd + c
 *   Paste text:                     ctrl/cmd + v
 *   Cut text:                       ctrl/cmd + x
 *   Select entire text:             ctrl/cmd + a
 *   Quit editing                    tab or esc
 * ```
 *
 * #### Supported mouse/touch combination
 * ```
 *   Position cursor:                click/touch
 *   Create selection:               click/touch & drag
 *   Create selection:               click & shift + click
 *   Select word:                    double click
 *   Select line:                    triple click
 * ```
 */
export class IText<
    Props extends TOptions<ITextProps> = Partial<ITextProps>,
    SProps extends SerializedITextProps = SerializedITextProps,
    EventSpec extends ITextEvents = ITextEvents,
  >
  extends ITextClickBehavior<Props, SProps, EventSpec>
  implements UniqueITextProps
{
  /**
   * Index where text selection starts (or where cursor is when there is no selection)
   * @type Number
   * @default
   */
  declare selectionStart: number;

  /**
   * Index where text selection ends
   * @type Number
   * @default
   */
  declare selectionEnd: number;

  declare compositionStart: number;

  declare compositionEnd: number;

  /**
   * Color of text selection
   * @type String
   * @default
   */
  declare selectionColor: string;

  /**
   * Indicates whether text is in editing mode
   * @type Boolean
   * @default
   */
  declare isEditing: boolean;

  /**
   * Indicates whether a text can be edited
   * @type Boolean
   * @default
   */
  declare editable: boolean;

  /**
   * Border color of text object while it's in editing mode
   * @type String
   * @default
   */
  declare editingBorderColor: string;

  /**
   * Width of cursor (in px)
   * @type Number
   * @default
   */
  declare cursorWidth: number;

  /**
   * Color of text cursor color in editing mode.
   * if not set (default) will take color from the text.
   * if set to a color value that fabric can understand, it will
   * be used instead of the color of the text at the current position.
   * @type String
   * @default
   */
  declare cursorColor: string;

  /**
   * Delay between cursor blink (in ms)
   * @type Number
   * @default
   */
  declare cursorDelay: number;

  /**
   * Duration of cursor fade in (in ms)
   * @type Number
   * @default
   */
  declare cursorDuration: number;

  declare compositionColor: string;

  /**
   * Indicates whether internal text char widths can be cached
   * @type Boolean
   * @default
   */
  declare caching: boolean;

  static ownDefaults = iTextDefaultValues;

  static getDefaults(): Record<string, any> {
    return { ...super.getDefaults(), ...IText.ownDefaults };
  }

  static type = 'IText';

  get type() {
    const type = super.type;
    // backward compatibility
    return type === 'itext' ? 'i-text' : type;
  }

  /**
   * Constructor
   * @param {String} text Text string
   * @param {Object} [options] Options object
   */
  constructor(text: string, options?: Props) {
    super(text, { ...IText.ownDefaults, ...options } as Props);
    this.initBehavior();
  }

  /**
   * While editing handle differently
   * @private
   * @param {string} key
   * @param {*} value
   */
  _set(key: string, value: any) {
    if (this.isEditing && this._savedProps && key in this._savedProps) {
      // @ts-expect-error irritating TS
      this._savedProps[key] = value;
      return this;
    }
    if (key === 'canvas') {
      this.canvas instanceof Canvas &&
        this.canvas.textEditingManager.remove(this);
      value instanceof Canvas && value.textEditingManager.add(this);
    }
    return super._set(key, value);
  }

  /**
   * Sets selection start (left boundary of a selection)
   * @param {Number} index Index to set selection start to
   */
  setSelectionStart(index: number) {
    index = Math.max(index, 0);
    this._updateAndFire('selectionStart', index);
  }

  /**
   * Sets selection end (right boundary of a selection)
   * @param {Number} index Index to set selection end to
   */
  setSelectionEnd(index: number) {
    index = Math.min(index, this.text.length);
    this._updateAndFire('selectionEnd', index);
  }

  /**
   * @private
   * @param {String} property 'selectionStart' or 'selectionEnd'
   * @param {Number} index new position of property
   */
  protected _updateAndFire(
    property: 'selectionStart' | 'selectionEnd',
    index: number,
  ) {
    if (this[property] !== index) {
      this._fireSelectionChanged();
      this[property] = index;
    }
    this._updateTextarea();
  }

  /**
   * Fires the even of selection changed
   * @private
   */
  _fireSelectionChanged() {
    this.fire('selection:changed');
    this.canvas && this.canvas.fire('text:selection:changed', { target: this });
  }

  /**
   * Initialize text dimensions. Render all text on given context
   * or on a offscreen canvas to get the text width with measureText.
   * Updates this.width and this.height with the proper values.
   * Does not return dimensions.
   * @private
   */
  initDimensions() {
    this.isEditing && this.initDelayedCursor();
    super.initDimensions();
  }

  /**
   * Gets style of a current selection/cursor (at the start position)
   * if startIndex or endIndex are not provided, selectionStart or selectionEnd will be used.
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} endIndex End index to get styles at, if not specified selectionEnd or startIndex + 1
   * @param {Boolean} [complete] get full style or not
   * @return {Array} styles an array with one, zero or more Style objects
   */
  getSelectionStyles(
    startIndex: number = this.selectionStart || 0,
    endIndex: number = this.selectionEnd,
    complete?: boolean,
  ) {
    return super.getSelectionStyles(startIndex, endIndex, complete);
  }

  /**
   * Sets style of a current selection, if no selection exist, do not set anything.
   * @param {Object} [styles] Styles object
   * @param {Number} [startIndex] Start index to get styles at
   * @param {Number} [endIndex] End index to get styles at, if not specified selectionEnd or startIndex + 1
   */
  setSelectionStyles(
    styles: object,
    startIndex: number = this.selectionStart || 0,
    endIndex: number = this.selectionEnd,
  ) {
    return super.setSelectionStyles(styles, startIndex, endIndex);
  }

  /**
   * Returns 2d representation (lineIndex and charIndex) of cursor (or selection start)
   * @param {Number} [selectionStart] Optional index. When not given, current selectionStart is used.
   * @param {Boolean} [skipWrapping] consider the location for unwrapped lines. useful to manage styles.
   */
  get2DCursorLocation(
    selectionStart = this.selectionStart,
    skipWrapping?: boolean,
  ) {
    return super.get2DCursorLocation(selectionStart, skipWrapping);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    // clear the cursorOffsetCache, so we ensure to calculate once per renderCursor
    // the correct position but not at every cursor animation.
    this.cursorOffsetCache = {};
    this.renderCursorOrSelection();
  }

  /**
   * @override block cursor/selection logic while rendering the exported canvas
   * @todo this workaround should be replaced with a more robust solution
   */
  toCanvasElement(options?: ObjectToCanvasElementOptions): HTMLCanvasElement {
    const isEditing = this.isEditing;
    this.isEditing = false;
    const canvas = super.toCanvasElement(options);
    this.isEditing = isEditing;
    return canvas;
  }

  /**
   * Renders cursor or selection (depending on what exists)
   * it does on the contextTop. If contextTop is not available, do nothing.
   */
  renderCursorOrSelection() {
    if (!this.isEditing) {
      return;
    }
    const ctx = this.clearContextTop(true);
    if (!ctx) {
      return;
    }
    const boundaries = this._getCursorBoundaries();
    if (this.selectionStart === this.selectionEnd && !this.inCompositionMode) {
      this.renderCursor(ctx, boundaries);
    } else {
      this.renderSelection(ctx, boundaries);
    }
    this.canvas!.contextTopDirty = true;
    ctx.restore();
  }

  /**
   * Returns cursor boundaries (left, top, leftOffset, topOffset)
   * left/top are left/top of entire text box
   * leftOffset/topOffset are offset from that left/top point of a text box
   * @private
   * @param {number} [index] index from start
   * @param {boolean} [skipCaching]
   */
  _getCursorBoundaries(
    index: number = this.selectionStart,
    skipCaching?: boolean,
  ): CursorBoundaries {
    const left = this._getLeftOffset(),
      top = this._getTopOffset(),
      offsets = this._getCursorBoundariesOffsets(index, skipCaching);
    return {
      left: left,
      top: top,
      leftOffset: offsets.left,
      topOffset: offsets.top,
    };
  }

  /**
   * Caches and returns cursor left/top offset relative to instance's center point
   * @private
   * @param {number} index index from start
   * @param {boolean} [skipCaching]
   */
  _getCursorBoundariesOffsets(
    index: number,
    skipCaching?: boolean,
  ): { left: number; top: number } {
    if (skipCaching) {
      return this.__getCursorBoundariesOffsets(index);
    }
    if (this.cursorOffsetCache && 'top' in this.cursorOffsetCache) {
      return this.cursorOffsetCache as { left: number; top: number };
    }
    return (this.cursorOffsetCache = this.__getCursorBoundariesOffsets(index));
  }

  /**
   * Calculates cursor left/top offset relative to instance's center point
   * @private
   * @param {number} index index from start
   */
  __getCursorBoundariesOffsets(index: number) {
    let topOffset = 0,
      leftOffset = 0;
    const { charIndex, lineIndex } = this.get2DCursorLocation(index);

    for (let i = 0; i < lineIndex; i++) {
      topOffset += this.getHeightOfLine(i);
    }
    const lineLeftOffset = this._getLineLeftOffset(lineIndex);
    const bound = this.__charBounds[lineIndex][charIndex];
    bound && (leftOffset = bound.left);
    if (
      this.charSpacing !== 0 &&
      charIndex === this._textLines[lineIndex].length
    ) {
      leftOffset -= this._getWidthOfCharSpacing();
    }
    const boundaries = {
      top: topOffset,
      left: lineLeftOffset + (leftOffset > 0 ? leftOffset : 0),
    };
    if (this.direction === 'rtl') {
      if (
        this.textAlign === RIGHT ||
        this.textAlign === JUSTIFY ||
        this.textAlign === JUSTIFY_RIGHT
      ) {
        boundaries.left *= -1;
      } else if (this.textAlign === LEFT || this.textAlign === JUSTIFY_LEFT) {
        boundaries.left = lineLeftOffset - (leftOffset > 0 ? leftOffset : 0);
      } else if (
        this.textAlign === CENTER ||
        this.textAlign === JUSTIFY_CENTER
      ) {
        boundaries.left = lineLeftOffset - (leftOffset > 0 ? leftOffset : 0);
      }
    }
    return boundaries;
  }

  /**
   * Renders cursor on context Top, outside the animation cycle, on request
   * Used for the drag/drop effect.
   * If contextTop is not available, do nothing.
   */
  renderCursorAt(selectionStart: number) {
    this._renderCursor(
      this.canvas!.contextTop,
      this._getCursorBoundaries(selectionStart, true),
      selectionStart,
    );
  }

  /**
   * Renders cursor
   * @param {Object} boundaries
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  renderCursor(ctx: CanvasRenderingContext2D, boundaries: CursorBoundaries) {
    this._renderCursor(ctx, boundaries, this.selectionStart);
  }

  /**
   * Return the data needed to render the cursor for given selection start
   * The left,top are relative to the object, while width and height are prescaled
   * to look think with canvas zoom and object scaling,
   * so they depend on canvas and object scaling
   */
  getCursorRenderingData(
    selectionStart: number = this.selectionStart,
    boundaries: CursorBoundaries = this._getCursorBoundaries(selectionStart),
  ): CursorRenderingData {
    const cursorLocation = this.get2DCursorLocation(selectionStart),
      lineIndex = cursorLocation.lineIndex,
      charIndex =
        cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
      charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
      multiplier = this.getObjectScaling().x * this.canvas!.getZoom(),
      cursorWidth = this.cursorWidth / multiplier,
      dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY'),
      topOffset =
        boundaries.topOffset +
        ((1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex)) /
          this.lineHeight -
        charHeight * (1 - this._fontSizeFraction);

    return {
      color:
        this.cursorColor ||
        (this.getValueOfPropertyAt(lineIndex, charIndex, 'fill') as string),
      opacity: this._currentCursorOpacity,
      left: boundaries.left + boundaries.leftOffset - cursorWidth / 2,
      top: topOffset + boundaries.top + dy,
      width: cursorWidth,
      height: charHeight,
    };
  }

  /**
   * Render the cursor at the given selectionStart.
   *
   */
  _renderCursor(
    ctx: CanvasRenderingContext2D,
    boundaries: CursorBoundaries,
    selectionStart: number,
  ) {
    const { color, opacity, left, top, width, height } =
      this.getCursorRenderingData(selectionStart, boundaries);
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(left, top, width, height);
  }

  /**
   * Renders text selection
   * @param {Object} boundaries Object with left/top/leftOffset/topOffset
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  renderSelection(ctx: CanvasRenderingContext2D, boundaries: CursorBoundaries) {
    const selection = {
      selectionStart: this.inCompositionMode
        ? this.hiddenTextarea!.selectionStart
        : this.selectionStart,
      selectionEnd: this.inCompositionMode
        ? this.hiddenTextarea!.selectionEnd
        : this.selectionEnd,
    };
    this._renderSelection(ctx, selection, boundaries);
  }

  /**
   * Renders drag start text selection
   */
  renderDragSourceEffect() {
    const dragStartSelection =
      this.draggableTextDelegate.getDragStartSelection()!;
    this._renderSelection(
      this.canvas!.contextTop,
      dragStartSelection,
      this._getCursorBoundaries(dragStartSelection.selectionStart, true),
    );
  }

  renderDropTargetEffect(e: DragEvent) {
    const dragSelection = this.getSelectionStartFromPointer(e);
    this.renderCursorAt(dragSelection);
  }

  /**
   * Renders text selection
   * @private
   * @param {{ selectionStart: number, selectionEnd: number }} selection
   * @param {Object} boundaries Object with left/top/leftOffset/topOffset
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  _renderSelection(
    ctx: CanvasRenderingContext2D,
    selection: { selectionStart: number; selectionEnd: number },
    boundaries: CursorBoundaries,
  ) {
    const selectionStart = selection.selectionStart,
      selectionEnd = selection.selectionEnd,
      isJustify = this.textAlign.includes(JUSTIFY),
      start = this.get2DCursorLocation(selectionStart),
      end = this.get2DCursorLocation(selectionEnd),
      startLine = start.lineIndex,
      endLine = end.lineIndex,
      startChar = start.charIndex < 0 ? 0 : start.charIndex,
      endChar = end.charIndex < 0 ? 0 : end.charIndex;

    for (let i = startLine; i <= endLine; i++) {
      const lineOffset = this._getLineLeftOffset(i) || 0;
      let lineHeight = this.getHeightOfLine(i),
        realLineHeight = 0,
        boxStart = 0,
        boxEnd = 0;

      if (i === startLine) {
        boxStart = this.__charBounds[startLine][startChar].left;
      }
      if (i >= startLine && i < endLine) {
        boxEnd =
          isJustify && !this.isEndOfWrapping(i)
            ? this.width
            : this.getLineWidth(i) || 5; // WTF is this 5?
      } else if (i === endLine) {
        if (endChar === 0) {
          boxEnd = this.__charBounds[endLine][endChar].left;
        } else {
          const charSpacing = this._getWidthOfCharSpacing();
          boxEnd =
            this.__charBounds[endLine][endChar - 1].left +
            this.__charBounds[endLine][endChar - 1].width -
            charSpacing;
        }
      }
      realLineHeight = lineHeight;
      if (this.lineHeight < 1 || (i === endLine && this.lineHeight > 1)) {
        lineHeight /= this.lineHeight;
      }
      let drawStart = boundaries.left + lineOffset + boxStart,
        drawHeight = lineHeight,
        extraTop = 0;
      const drawWidth = boxEnd - boxStart;
      if (this.inCompositionMode) {
        ctx.fillStyle = this.compositionColor || 'black';
        drawHeight = 1;
        extraTop = lineHeight;
      } else {
        ctx.fillStyle = this.selectionColor;
      }
      if (this.direction === 'rtl') {
        if (
          this.textAlign === RIGHT ||
          this.textAlign === JUSTIFY ||
          this.textAlign === JUSTIFY_RIGHT
        ) {
          drawStart = this.width - drawStart - drawWidth;
        } else if (this.textAlign === LEFT || this.textAlign === JUSTIFY_LEFT) {
          drawStart = boundaries.left + lineOffset - boxEnd;
        } else if (
          this.textAlign === CENTER ||
          this.textAlign === JUSTIFY_CENTER
        ) {
          drawStart = boundaries.left + lineOffset - boxEnd;
        }
      }
      ctx.fillRect(
        drawStart,
        boundaries.top + boundaries.topOffset + extraTop,
        drawWidth,
        drawHeight,
      );
      boundaries.topOffset += realLineHeight;
    }
  }

  /**
   * High level function to know the height of the cursor.
   * the currentChar is the one that precedes the cursor
   * Returns fontSize of char at the current cursor
   * Unused from the library, is for the end user
   * @return {Number} Character font size
   */
  getCurrentCharFontSize(): number {
    const cp = this._getCurrentCharIndex();
    return this.getValueOfPropertyAt(cp.l, cp.c, 'fontSize');
  }

  /**
   * High level function to know the color of the cursor.
   * the currentChar is the one that precedes the cursor
   * Returns color (fill) of char at the current cursor
   * if the text object has a pattern or gradient for filler, it will return that.
   * Unused by the library, is for the end user
   * @return {String | TFiller} Character color (fill)
   */
  getCurrentCharColor(): string | TFiller | null {
    const cp = this._getCurrentCharIndex();
    return this.getValueOfPropertyAt(cp.l, cp.c, FILL);
  }

  /**
   * Returns the cursor position for the getCurrent.. functions
   * @private
   */
  _getCurrentCharIndex() {
    const cursorPosition = this.get2DCursorLocation(this.selectionStart, true),
      charIndex =
        cursorPosition.charIndex > 0 ? cursorPosition.charIndex - 1 : 0;
    return { l: cursorPosition.lineIndex, c: charIndex };
  }

  dispose() {
    this.exitEditingImpl();
    this.draggableTextDelegate.dispose();
    super.dispose();
  }
}

classRegistry.setClass(IText);
// legacy
classRegistry.setClass(IText, 'i-text');
