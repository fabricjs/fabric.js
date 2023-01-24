import type { IText } from './IText';
export type TKeyMapIText = Record<KeyboardEvent['keyCode'], keyof IText>;

// @TODO look into import { Key } from 'ts-key-enum';
// and transition from keyCode to Key
// also reduce string duplication
export const keysMap: TKeyMapIText = {
  9: 'exitEditing',
  27: 'exitEditing',
  33: 'moveCursorUp',
  34: 'moveCursorDown',
  35: 'moveCursorRight',
  36: 'moveCursorLeft',
  37: 'moveCursorLeft',
  38: 'moveCursorUp',
  39: 'moveCursorRight',
  40: 'moveCursorDown',
};

export const keysMapRtl: TKeyMapIText = {
  9: 'exitEditing',
  27: 'exitEditing',
  33: 'moveCursorUp',
  34: 'moveCursorDown',
  35: 'moveCursorLeft',
  36: 'moveCursorRight',
  37: 'moveCursorRight',
  38: 'moveCursorUp',
  39: 'moveCursorLeft',
  40: 'moveCursorDown',
};

/**
 * For functionalities on keyUp + ctrl || cmd
 */
export const ctrlKeysMapUp: TKeyMapIText = {
  67: 'copy',
  // @ts-ignore there was a reason this wasn't deleted. for now leave it here
  88: 'cut',
};

/**
 * For functionalities on keyDown + ctrl || cmd
 */
export const ctrlKeysMapDown: TKeyMapIText = {
  65: 'selectAll',
};
