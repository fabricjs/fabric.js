import { hasStyleChanged, pick } from '../../util';
import { pickBy } from '../../util/misc/pick';
import { styleProperties, type StylePropertiesType } from './constants';
import type { Text } from './Text';

export type TextStyleDeclaration = Partial<Pick<Text, StylePropertiesType>>;

export type TextStyleJSON = {
  start: number;
  end: number;
  style: TextStyleDeclaration;
};

type PositionOrOffset =
  | { lineIndex: number; charIndex: number; offset?: never }
  | { lineIndex?: never; charIndex?: never; offset: number };

export class TextStyles {
  protected styles: TextStyleDeclaration[] = [];

  constructor(readonly target: Text) {}

  protected getLines() {
    return this.target._unwrappedTextLines;
  }

  positionToOffset(lineIndex: number, charIndex = 0) {
    const lines = this.getLines();
    let total = 0;
    for (let index = 0; index < lineIndex; index++) {
      total += lines[lineIndex].length;
    }
    return total + charIndex;
  }

  getOffsetFromPosition({ lineIndex, charIndex, offset }: PositionOrOffset) {
    return typeof offset === 'number'
      ? offset
      : this.positionToOffset(lineIndex, charIndex);
  }

  slice(
    start: number,
    end?: number,
    {
      slim = false,
      complete = false,
    }: {
      slim?: boolean;
      complete?: boolean;
    } = {}
  ) {
    // @ts-expect-error readonly
    const upstream = complete ? pick(this, styleProperties) : {};
    return this.styles.slice(start, end).map(
      (style) =>
        ({
          ...upstream,
          ...(slim ? pickBy(style, (v, k) => this.target[k] !== v) : style),
        } as TextStyleDeclaration)
    );
  }

  get({
    slim = false,
    complete = false,
    ...position
  }: PositionOrOffset & { slim?: boolean; complete?: boolean }) {
    // @ts-expect-error readonly
    const upstream = complete ? pick(this, styleProperties) : {};
    const style = this.styles[this.getOffsetFromPosition(position)];
    return {
      ...upstream,
      ...(slim ? pickBy(style, (v, k) => this.target[k] !== v) : style),
    } as TextStyleDeclaration;
  }

  set({
    style,
    ...position
  }: PositionOrOffset & { style: TextStyleDeclaration }) {
    this.styles[this.getOffsetFromPosition(position)] = style;
  }

  clear(position: PositionOrOffset) {
    this.set({ ...position, style: {} });
  }

  splice(
    position: PositionOrOffset,
    deleteCount: number,
    styles: TextStyleDeclaration[] = []
  ) {
    this.styles.splice(
      this.getOffsetFromPosition(position),
      deleteCount,
      ...styles
    );
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
        const thisStyle = this.get({ lineIndex: i, charIndex: c, slim: true });
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
