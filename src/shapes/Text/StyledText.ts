import type { ObjectEvents } from '../../EventTypeDefs';
import type {
  FabricObjectProps,
  SerializedObjectProps,
  TProps,
} from '../Object/types';
import { FabricObject } from '../Object/FabricObject';
import { styleProperties } from './constants';
import type { StylePropertiesType } from './constants';
import type { Text } from './Text';
import { pick } from '../../util';

export type CompleteTextStyleDeclaration = Pick<Text, StylePropertiesType>;

export type TextStyleDeclaration = Partial<CompleteTextStyleDeclaration>;

export type TextStyle = {
  [line: number | string]: { [char: number | string]: TextStyleDeclaration };
};

export abstract class StyledText<
  Props extends TProps<FabricObjectProps> = Partial<FabricObjectProps>,
  SProps extends SerializedObjectProps = SerializedObjectProps,
  EventSpec extends ObjectEvents = ObjectEvents
> extends FabricObject<Props, SProps, EventSpec> {
  /**
   * correlates to unwrapped lines
   */
  declare abstract styles: TextStyle;
  protected declare abstract _textLines: string[][];
  protected declare _forceClearCache: boolean;
  static _styleProperties: Readonly<StylePropertiesType[]> = styleProperties;
  abstract getStyleCursorPosition(
    index: number,
    text?: string[]
  ): {
    charIndex: number;
    lineIndex: number;
  };

  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles(lineIndex?: number): boolean {
    if (!this.styles) {
      return true;
    }
    if (typeof lineIndex !== 'undefined' && !this.styles[lineIndex]) {
      return true;
    }
    const obj =
      typeof lineIndex === 'undefined'
        ? this.styles
        : { line: this.styles[lineIndex] };
    for (const p1 in obj) {
      for (const p2 in obj[p1]) {
        // eslint-disable-next-line no-unused-vars
        for (const p3 in obj[p1][p2]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Returns true if object has a style property or has it ina specified line
   * This function is used to detect if a text will use a particular property or not.
   * @param {String} property to check for
   * @param {Number} lineIndex to check the style on
   * @return {Boolean}
   */
  styleHas(property: keyof TextStyleDeclaration, lineIndex?: number): boolean {
    if (!this.styles) {
      return false;
    }
    if (typeof lineIndex !== 'undefined' && !this.styles[lineIndex]) {
      return false;
    }
    const obj =
      typeof lineIndex === 'undefined'
        ? this.styles
        : { 0: this.styles[lineIndex] };
    // eslint-disable-next-line
    for (const p1 in obj) {
      // eslint-disable-next-line
      for (const p2 in obj[p1]) {
        if (typeof obj[p1][p2][property] !== 'undefined') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Gets style of a current selection/cursor (at the start position)
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} endIndex End index to get styles at, if not specified startIndex + 1
   * @param {Boolean} [complete] get full style or not
   * @return {Array} styles an array with one, zero or more Style objects
   */
  getSelectionStyles(
    startIndex: number,
    endIndex?: number,
    complete?: boolean
  ) {
    const styles: TextStyleDeclaration[] = [];
    for (let i = startIndex; i < (endIndex || startIndex); i++) {
      styles.push(this.getStyleAtPosition(i, complete));
    }
    return styles;
  }

  /**
   * Gets style of a current selection/cursor position
   * @param {Number} position  to get styles at
   * @param {Boolean} [complete] full style if true
   * @return {Object} style Style object at a specified index
   * @private
   */
  getStyleAtPosition<
    T extends boolean = false,
    R = T extends true ? CompleteTextStyleDeclaration : TextStyleDeclaration
  >(position: number, complete?: T): R {
    const { lineIndex, charIndex } = this.getStyleCursorPosition(position);
    return {
      ...(complete
        ? // @ts-expect-error readonly
          pick(this, (this.constructor as typeof StyledText)._styleProperties)
        : {}),
      ...(this.styles[lineIndex]?.[charIndex] || {}),
    } as R;
  }

  /**
   * Sets style of a current selection, if no selection exist, do not set anything.
   * @param {Object} styles Styles object
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} [endIndex] End index to get styles at, if not specified startIndex + 1
   */
  setSelectionStyles(
    style: TextStyleDeclaration,
    startIndex: number,
    endIndex?: number
  ) {
    for (let i = startIndex; i < (endIndex || startIndex); i++) {
      const { lineIndex, charIndex } = this.getStyleCursorPosition(i);
      (this.styles[lineIndex] || (this.styles[lineIndex] = {}))[charIndex] = {
        ...style,
      };
    }
    /* not included in _extendStyles to avoid clearing cache more than once */
    this._forceClearCache = true;
  }

  /**
   * get the reference, not a clone, of the style object for a given character,
   * if not style is set for a pre det
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {Object} style object a REFERENCE to the existing one or a new empty object
   */
  _getStyleDeclaration(
    lineIndex: number,
    charIndex: number
  ): TextStyleDeclaration {
    const lineStyle = this.styles && this.styles[lineIndex];
    return lineStyle ? lineStyle[charIndex] ?? {} : {};
  }

  /**
   * return a new object that contains all the style property for a character
   * the object returned is newly created
   * @param {Number} lineIndex of the line where the character is
   * @param {Number} charIndex position of the character on the line
   * @return {Object} style object
   */
  getCompleteStyleDeclaration(
    lineIndex: number,
    charIndex: number
  ): CompleteTextStyleDeclaration {
    return {
      // @ts-expect-error readonly
      ...pick(this, (this.constructor as typeof StyledText)._styleProperties),
      ...this._getStyleDeclaration(lineIndex, charIndex),
    } as CompleteTextStyleDeclaration;
  }
}
