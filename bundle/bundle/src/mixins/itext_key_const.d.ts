import type { IText } from '../shapes/itext.class';
export type TKeyMapIText = Record<KeyboardEvent['keyCode'], keyof IText>;
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
//# sourceMappingURL=itext_key_const.d.ts.map