import type { Observable } from './mixins/observable.mixin';
import type { Point } from './point.class';
import { ModifierKey, TMat2D } from './typedefs';

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
  viewportTransform: TMat2D;
  vptCoords: {
    tl: Point;
    br: Point;
  };
} & Observable;
export type Rect = any;
export type TObject = any;
