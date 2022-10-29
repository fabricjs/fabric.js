import { ModifierKey } from './typedefs';

/**
 * @todo remove transient
 */
export type Shadow = any;
export type Canvas = StaticCanvas & {
  altActionKey: ModifierKey;
} & Record<string, unknown>;
export type StaticCanvas = Record<string, unknown>;
export type Rect = any;
export type TObject = any;
