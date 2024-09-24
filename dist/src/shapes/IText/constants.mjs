const MOVE_CURSOR_UP = 'moveCursorUp';
const MOVE_CURSOR_DOWN = 'moveCursorDown';
const MOVE_CURSOR_LEFT = 'moveCursorLeft';
const MOVE_CURSOR_RIGHT = 'moveCursorRight';
const EXIT_EDITING = 'exitEditing';

// @TODO look into import { Key } from 'ts-key-enum';
// and transition from keyCode to Key
// also reduce string duplication
const keysMap = {
  9: EXIT_EDITING,
  27: EXIT_EDITING,
  33: MOVE_CURSOR_UP,
  34: MOVE_CURSOR_DOWN,
  35: MOVE_CURSOR_RIGHT,
  36: MOVE_CURSOR_LEFT,
  37: MOVE_CURSOR_LEFT,
  38: MOVE_CURSOR_UP,
  39: MOVE_CURSOR_RIGHT,
  40: MOVE_CURSOR_DOWN
};
const keysMapRtl = {
  9: EXIT_EDITING,
  27: EXIT_EDITING,
  33: MOVE_CURSOR_UP,
  34: MOVE_CURSOR_DOWN,
  35: MOVE_CURSOR_LEFT,
  36: MOVE_CURSOR_RIGHT,
  37: MOVE_CURSOR_RIGHT,
  38: MOVE_CURSOR_UP,
  39: MOVE_CURSOR_LEFT,
  40: MOVE_CURSOR_DOWN
};

/**
 * For functionalities on keyUp + ctrl || cmd
 */
const ctrlKeysMapUp = {
  67: 'copy',
  // there was a reason this wasn't deleted. for now leave it here
  88: 'cut'
};

/**
 * For functionalities on keyDown + ctrl || cmd
 */
const ctrlKeysMapDown = {
  65: 'selectAll'
};

export { ctrlKeysMapDown, ctrlKeysMapUp, keysMap, keysMapRtl };
//# sourceMappingURL=constants.mjs.map
