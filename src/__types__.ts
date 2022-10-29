import { ModifierKey } from './typedefs';

/**
 * @todo remove transient
 */
export type Shadow = any;
export type Canvas = StaticCanvas & {
  altActionKey: ModifierKey;
  uniScaleKey: ModifierKey;
  uniformScaling: boolean;
} & Record<string, unknown>;
export type StaticCanvas = Record<string, unknown> & {
  getZoom(): number;
};
export type Rect = any;
export type TObject = any;
