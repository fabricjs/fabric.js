import type { ObjectEvents } from '../../EventTypeDefs';
import type {
  FabricObjectProps,
  SerializedObjectProps,
  TProps,
} from '../Object/types';
import { FabricObject } from '../Object/FabricObject';
import { styleProperties } from './constants';
import type { StylePropertiesType } from './constants';
import type { TextStyleDeclaration, TextStyles } from './TextStyles';

export abstract class StyledText<
  Props extends TProps<FabricObjectProps> = Partial<FabricObjectProps>,
  SProps extends SerializedObjectProps = SerializedObjectProps,
  EventSpec extends ObjectEvents = ObjectEvents
> extends FabricObject<Props, SProps, EventSpec> {
  protected declare abstract _textLines: string[][];
  protected declare _forceClearCache: boolean;
  static _styleProperties: Readonly<StylePropertiesType[]> = styleProperties;
  abstract get2DCursorLocation(selectionStart: number): {
    charIndex: number;
    lineIndex: number;
  };

  styleManager: TextStyles;

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
