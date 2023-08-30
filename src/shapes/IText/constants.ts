export type TKeyMapIText = Record<
  KeyboardEvent['keyCode'],
  CursorHandlingMethods
>;

export type CursorHandlingMethods =
  | 'moveCursorUp'
  | 'moveCursorDown'
  | 'moveCursorLeft'
  | 'moveCursorRight'
  | 'exitEditing'
  | 'copy'
  | 'cut'
  | 'selectAll';

const MOVE_CURSOR_UP: CursorHandlingMethods = 'moveCursorUp';
const MOVE_CURSOR_DOWN: CursorHandlingMethods = 'moveCursorDown';
const MOVE_CURSOR_LEFT: CursorHandlingMethods = 'moveCursorLeft';
const MOVE_CURSOR_RIGHT: CursorHandlingMethods = 'moveCursorRight';
const EXIT_EDITING: CursorHandlingMethods = 'exitEditing';

// @TODO look into import { Key } from 'ts-key-enum';
// and transition from keyCode to Key
// also reduce string duplication
export const keysMap: TKeyMapIText = {
  9: EXIT_EDITING,
  27: EXIT_EDITING,
  33: MOVE_CURSOR_UP,
  34: MOVE_CURSOR_DOWN,
  35: MOVE_CURSOR_RIGHT,
  36: MOVE_CURSOR_LEFT,
  37: MOVE_CURSOR_LEFT,
  38: MOVE_CURSOR_UP,
  39: MOVE_CURSOR_RIGHT,
  40: MOVE_CURSOR_DOWN,
};

export const keysMapRtl: TKeyMapIText = {
  9: EXIT_EDITING,
  27: EXIT_EDITING,
  33: MOVE_CURSOR_UP,
  34: MOVE_CURSOR_DOWN,
  35: MOVE_CURSOR_LEFT,
  36: MOVE_CURSOR_RIGHT,
  37: MOVE_CURSOR_RIGHT,
  38: MOVE_CURSOR_UP,
  39: MOVE_CURSOR_LEFT,
  40: MOVE_CURSOR_DOWN,
};

/**
 * For functionalities on keyUp + ctrl || cmd
 */
export const ctrlKeysMapUp: TKeyMapIText = {
  67: 'copy',
  // there was a reason this wasn't deleted. for now leave it here
  88: 'cut',
};

/**
 * For functionalities on keyDown + ctrl || cmd
 */
export const ctrlKeysMapDown: TKeyMapIText = {
  65: 'selectAll',
};
