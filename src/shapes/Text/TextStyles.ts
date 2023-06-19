import { pick } from '../../util';
import { pickBy } from '../../util/misc/pick';
import { styleProperties, type StylePropertiesType } from './constants';
import type { Text } from './Text';

export type TextStyleDeclaration = Partial<Pick<Text, StylePropertiesType>>;
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

  get(
    position: PositionOrOffset,
    { slim = false, complete = false }: { slim?: boolean; complete?: boolean }
  ) {
    // @ts-expect-error readonly
    const upstream = complete ? pick(this, styleProperties) : {};
    const style = this.styles[this.getOffsetFromPosition(position)];
    return {
      ...upstream,
      ...(slim ? pickBy(style, (v, k) => this.target[k] !== v) : style),
    } as TextStyleDeclaration;
  }

  set(position: PositionOrOffset, style: TextStyleDeclaration) {
    this.styles[this.getOffsetFromPosition(position)] = style;
  }

  clear(position: PositionOrOffset) {
    this.set(position, {});
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

  slim() {
    return this.styles.map((value) =>
      pickBy(value, (v, k) => this.target[k] !== v)
    );
  }

  slimSelf() {
    this.styles = this.slim();
  }
}
