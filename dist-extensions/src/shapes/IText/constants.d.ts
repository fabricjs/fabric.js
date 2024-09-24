export type TKeyMapIText = Record<KeyboardEvent['keyCode'], CursorHandlingMethods>;
export type CursorHandlingMethods = 'moveCursorUp' | 'moveCursorDown' | 'moveCursorLeft' | 'moveCursorRight' | 'exitEditing' | 'copy' | 'cut' | 'selectAll';
export declare const keysMap: TKeyMapIText;
export declare const keysMapRtl: TKeyMapIText;
/**
 * For functionalities on keyUp + ctrl || cmd
 */
export declare const ctrlKeysMapUp: TKeyMapIText;
/**
 * For functionalities on keyDown + ctrl || cmd
 */
export declare const ctrlKeysMapDown: TKeyMapIText;
//# sourceMappingURL=constants.d.ts.map