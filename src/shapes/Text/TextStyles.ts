import { pick } from '../../util';
import { pickBy } from '../../util/misc/pick';
import { styleProperties, type StylePropertiesType } from './constants';
import type { Text } from './Text';

export type CompleteTextStyleDeclaration = Pick<Text, StylePropertiesType>;

export type TextStyleDeclaration = Partial<CompleteTextStyleDeclaration>;

export type LegacyTextStyle = {
  [line: number | string]: { [char: number | string]: TextStyleDeclaration };
};

export type TextStyleJSON = {
  start: number;
  end: number;
  style: TextStyleDeclaration;
};

type PositionOrOffset =
  | { lineIndex: number; charIndex: number; offset?: never }
  | { lineIndex?: never; charIndex?: never; offset: number };

type StyleOptions =
  | {
      complete?: boolean;
      uniq?: never;
    }
  | {
      complete?: never;
      uniq?: boolean;
    };

/**
 * @param {Object} prevStyle first style to compare
 * @param {Object} thisStyle second style to compare
 * @param {boolean} forTextSpans whether to check overline, underline, and line-through properties
 * @return {boolean} true if the style changed
 */
export const hasStyleChanged = (
  prevStyle: TextStyleDeclaration,
  thisStyle: TextStyleDeclaration,
  forTextSpans = false
) =>
  prevStyle.fill !== thisStyle.fill ||
  prevStyle.stroke !== thisStyle.stroke ||
  prevStyle.strokeWidth !== thisStyle.strokeWidth ||
  prevStyle.fontSize !== thisStyle.fontSize ||
  prevStyle.fontFamily !== thisStyle.fontFamily ||
  prevStyle.fontWeight !== thisStyle.fontWeight ||
  prevStyle.fontStyle !== thisStyle.fontStyle ||
  prevStyle.textBackgroundColor !== thisStyle.textBackgroundColor ||
  prevStyle.deltaY !== thisStyle.deltaY ||
  (forTextSpans &&
    (prevStyle.overline !== thisStyle.overline ||
      prevStyle.underline !== thisStyle.underline ||
      prevStyle.linethrough !== thisStyle.linethrough));

export class TextStyles {
  protected styles: TextStyleDeclaration[];

  constructor(
    readonly target: Text,
    styles?: TextStyleDeclaration[] | TextStyleJSON[] | LegacyTextStyle
  ) {
    const len = this.target._text.length;
    if (Array.isArray(styles) && styles.length === len) {
      this.styles = styles as TextStyleDeclaration[];
    } else {
      // backward compatibility
      this.styles = new Array(len).fill({});
      if (Array.isArray(styles)) {
        // compact style array
        (styles as TextStyleJSON[]).forEach(({ start, end, style }) => {
          for (let index = start; index < end; index++) {
            this.styles[index] = { ...style };
          }
        });
      } else if (typeof styles === 'object') {
        // legacy styles
        for (const lineIndex in styles) {
          for (const charIndex in styles[lineIndex]) {
            this.set({
              lineIndex: Number(lineIndex),
              charIndex: Number(charIndex),
              style: { ...styles[lineIndex][charIndex] },
            });
          }
        }
      }
    }
  }

  protected getLines() {
    return this.target._textLines;
  }

  positionToOffset(lineIndex: number, charIndex = 0) {
    const lines = this.getLines();
    let total = 0;
    for (let index = 0; index < lineIndex; index++) {
      total += lines[index].length;
    }
    return total + charIndex;
  }

  resolveOffset({ lineIndex, charIndex, offset }: PositionOrOffset) {
    return typeof offset === 'number'
      ? offset
      : this.positionToOffset(lineIndex, charIndex);
  }

  slice(
    start: number,
    end?: number,
    { uniq = false, complete = false }: StyleOptions = {}
  ) {
    // @ts-expect-error readonly
    const upstream = complete ? pick(this.target, styleProperties) : {};
    return this.styles.slice(start, end).map(
      (style) =>
        ({
          ...upstream,
          ...(uniq && !complete
            ? pickBy(style, (v, k) => this.target[k] !== v)
            : style),
        } as TextStyleDeclaration)
    );
  }

  get({
    uniq = false,
    complete = false,
    ...position
  }: PositionOrOffset & StyleOptions) {
    // @ts-expect-error readonly
    const upstream = complete ? pick(this.target, styleProperties) : {};
    const style = this.styles[this.resolveOffset(position)];
    return {
      ...upstream,
      ...(uniq && !complete
        ? pickBy(style, (v, k) => this.target[k] !== v)
        : style),
    } as TextStyleDeclaration;
  }

  value({
    key,
    uniq = false,
    complete = false,
    ...position
  }: PositionOrOffset & StyleOptions & { key: keyof TextStyleDeclaration }) {
    const value = this.styles[this.resolveOffset(position)][key];
    return complete
      ? value ?? this.target[key]
      : !uniq || value !== this.target[key]
      ? value
      : undefined;
  }

  set({
    style,
    repeatCount,
    ...position
  }: PositionOrOffset & { repeatCount?: number; style: TextStyleDeclaration }) {
    const offset = this.resolveOffset(position);
    this.styles[offset] = style;
    for (let index = 0; index < offset + (repeatCount || 1); index++) {
      this.styles[offset] = style;
    }
  }

  clear(position: PositionOrOffset) {
    this.set({ ...position, style: {} });
  }

  splice(
    position: PositionOrOffset,
    deleteCount: number,
    styles: TextStyleDeclaration[] = []
  ) {
    this.styles.splice(this.resolveOffset(position), deleteCount, ...styles);
  }

  reset(styles: TextStyleDeclaration[] = []) {
    this.styles = styles;
  }

  has({
    lineIndex,
    charIndex,
    offset,
    key,
  }:
    | {
        lineIndex?: never;
        charIndex?: never;
        offset?: number;
        key?: keyof TextStyleDeclaration;
      }
    | {
        lineIndex: number;
        charIndex?: number;
        offset?: never;
        key?: keyof TextStyleDeclaration;
      } = {}): boolean {
    let slice: TextStyleDeclaration[];
    if (typeof offset === 'number') {
      slice = [this.styles[offset]];
    } else if (typeof lineIndex === 'number') {
      const start = this.positionToOffset(lineIndex, charIndex || 0);
      slice = this.styles.slice(
        start,
        start + typeof charIndex === 'number'
          ? start + 1
          : this.getLines()[lineIndex].length
      );
    } else {
      slice = this.styles;
    }

    return slice.some((value) =>
      !!value && key ? Object.hasOwn(value, key) : Object.keys(value).length > 0
    );
  }

  uniq() {
    return this.styles.map((value) =>
      pickBy(value, (v, k) => this.target[k] !== v)
    );
  }

  uniqSelf() {
    this.styles = this.uniq();
  }

  /**
   * Returns the array form of a text object's inline styles property with styles grouped in ranges
   * rather than per character. This format is less verbose, and is better suited for storage
   * so it is used in serialization (not during runtime).
   * @return {TextStyleJSON[]}
   */
  toJSON() {
    const textLines = this.getLines(),
      stylesArray: TextStyleJSON[] = [];
    let charIndex = -1,
      prevStyle = {};

    //loop through each textLine
    for (let i = 0; i < textLines.length; i++) {
      if (!this.has({ lineIndex: i })) {
        //no styles exist for this line, so add the line's length to the charIndex total and reset prevStyle
        charIndex += textLines[i].length;
        prevStyle = {};
        continue;
      }
      //loop through each character of the current line
      for (let c = 0; c < textLines[i].length; c++) {
        charIndex++;
        const thisStyle = this.get({ lineIndex: i, charIndex: c, uniq: true });
        //check if style exists for this character
        if (thisStyle && Object.keys(thisStyle).length > 0) {
          if (hasStyleChanged(prevStyle, thisStyle, true)) {
            stylesArray.push({
              start: charIndex,
              end: charIndex + 1,
              style: thisStyle,
            });
          } else {
            //if style is the same as previous character, increase end index
            stylesArray[stylesArray.length - 1].end++;
          }
        }
        prevStyle = thisStyle || {};
      }
    }
    return stylesArray;
  }
}
