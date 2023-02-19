import type { IText } from './IText';
export type TKeyMapIText = Record<
  KeyboardEvent['key'],
  keyof IText | ((this: IText, e: KeyboardEvent) => any)
>;

// @TODO look into import { Key } from 'ts-key-enum';
/**
 * For functionalities on keyDown when `direction === 'ltr'`
 */
export const keysMap: TKeyMapIText = {
  Tab: 'exitEditing',
  Escape: 'exitEditing',
  PageUp: 'moveCursorUp',
  PageDown: 'moveCursorDown',
  End: 'moveCursorRight',
  Home: 'moveCursorLeft',
  ArrowLeft: 'moveCursorLeft',
  ArrowUp: 'moveCursorUp',
  ArrowRight: 'moveCursorRight',
  ArrowDown: 'moveCursorDown',
};

/**
 * For functionalities on keyDown when `direction === 'rtl'`
 */
export const keysMapRtl: TKeyMapIText = {
  Tab: 'exitEditing',
  Escape: 'exitEditing',
  PageUp: 'moveCursorUp',
  PageDown: 'moveCursorDown',
  End: 'moveCursorLeft',
  Home: 'moveCursorRight',
  ArrowLeft: 'moveCursorRight',
  ArrowUp: 'moveCursorUp',
  ArrowRight: 'moveCursorLeft',
  ArrowDown: 'moveCursorDown',
};

/**
 * For functionalities on keyDown + ctrl || cmd
 */
export const ctrlKeysMapDown: TKeyMapIText = {
  KeyA: 'selectAll',
};
