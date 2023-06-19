import { pick } from '../../util';
import { pickBy } from '../../util/misc/pick';
import { styleProperties, type StylePropertiesType } from './constants';
import type { Text } from './Text';

export type TextStyleDeclaration = Partial<Pick<Text, StylePropertiesType>>;

export class TextStyles {
  protected styles: TextStyleDeclaration[] = [];

  constructor(readonly target: Text) {}

  protected getLines() {
    return this.target._unwrappedTextLines;
  }

  protected getLine(index: number) {
    return this.getLines()[index];
  }

  positionToOffset(lineIndex: number, charIndex = 0) {
    const lines = this.getLines();
    let total = 0;
    for (let index = 0; index < lineIndex; index++) {
      total += lines[lineIndex].length;
    }
    return total + charIndex;
  }

  slice(lineIndex: number) {
    const lineStartOffset = this.positionToOffset(lineIndex);
    return this.styles.slice(
      lineStartOffset,
      lineStartOffset + this.getLine(lineIndex).length
    );
  }

  get(
    lineIndex: number,
    charIndex: number,
    { slim = false, complete = false }: { slim?: boolean; complete?: boolean }
  ) {
    const style = this.styles[this.positionToOffset(lineIndex, charIndex)];
    return {
      // @ts-expect-error readonly
      ...(complete ? pick(this, styleProperties) : {}),
      ...(slim ? pickBy(style, (v, k) => this.target[k] !== v) : style),
    } as TextStyleDeclaration;
  }

  set(lineIndex: number, charIndex: number, style: TextStyleDeclaration) {
    this.styles[this.positionToOffset(lineIndex, charIndex)] = style;
  }

  clear(lineIndex: number, charIndex: number) {
    this.styles[this.positionToOffset(lineIndex, charIndex)] = {};
  }

  has({
    lineIndex,
    charIndex,
    key,
  }:
    | {
        lineIndex?: never;
        charIndex?: never;
        key?: keyof TextStyleDeclaration;
      }
    | {
        lineIndex: number;
        charIndex?: number;
        key?: keyof TextStyleDeclaration;
      } = {}): boolean {
    const slice =
      typeof lineIndex === 'number' ? this.slice(lineIndex) : this.styles;
    return (typeof charIndex === 'number' ? [slice[charIndex]] : slice).some(
      (value) =>
        !!value && key
          ? Object.hasOwn(value, key)
          : Object.keys(value).length > 0
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
