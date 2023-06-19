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
import { TextStyles } from './TextStyles';

export type TextStyleDeclaration = Partial<Pick<Text, StylePropertiesType>>;

export type TextStyle = {
  [line: number | string]: { [char: number | string]: TextStyleDeclaration };
};

export abstract class StyledText<
  Props extends TProps<FabricObjectProps> = Partial<FabricObjectProps>,
  SProps extends SerializedObjectProps = SerializedObjectProps,
  EventSpec extends ObjectEvents = ObjectEvents
> extends FabricObject<Props, SProps, EventSpec> {
  protected declare abstract _textLines: string[][];
  protected declare _forceClearCache: boolean;
  static _styleProperties: Readonly<StylePropertiesType[]> = styleProperties;
  abstract get2DCursorLocation(
    selectionStart: number,
    skipWrapping?: boolean
  ): { charIndex: number; lineIndex: number };

  styleManager = new TextStyles(this);

  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles(lineIndex?: number): boolean {
    return !this.styleManager.has({ lineIndex });
  }

  /**
   * Returns true if object has a style property or has it ina specified line
   * This function is used to detect if a text will use a particular property or not.
   * @param {String} property to check for
   * @param {Number} lineIndex to check the style on
   * @return {Boolean}
   */
  styleHas(property: keyof TextStyleDeclaration, lineIndex?: number): boolean {
    return this.styleManager.has({ key: property, lineIndex });
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
    endIndex = startIndex,
    complete?: boolean
  ) {
    return this.styleManager.slice(startIndex, endIndex, { complete });
  }

  /**
   * Sets style of a current selection, if no selection exist, do not set anything.
   * @param {Object} style Styles object
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} [endIndex] End index to get styles at, if not specified startIndex + 1
   */
  setSelectionStyles(
    style: TextStyleDeclaration,
    startIndex: number,
    endIndex?: number
  ) {
    for (let i = startIndex; i < (endIndex || startIndex); i++) {
      this.styleManager.set({ offset: i, style: { ...style } });
    }
    /* not included in _extendStyles to avoid clearing cache more than once */
    this._forceClearCache = true;
  }

  /**
   * get the reference, not a clone, of the style object for a given character
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {Object} style object
   */
  _getStyleDeclaration(lineIndex: number, charIndex: number) {
    return this.styleManager.get({ lineIndex, charIndex });
  }

  /**
   * return a new object that contains all the style property for a character
   * the object returned is newly created
   * @param {Number} lineIndex of the line where the character is
   * @param {Number} charIndex position of the character on the line
   * @return {Object} style object
   */
  getCompleteStyleDeclaration(lineIndex: number, charIndex: number) {
    return this.styleManager.get({ lineIndex, charIndex, complete: true });
  }
}
