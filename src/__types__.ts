import type { Observable } from './mixins/observable.mixin';
import type { Point } from './point.class';
import { ModifierKey, TMat2D } from './typedefs';

/**
 * @todo remove transient
 */
export type Canvas = StaticCanvas & {
  altActionKey: ModifierKey;
  uniScaleKey: ModifierKey;
  uniformScaling: boolean;
} & Record<string, any>;
export type StaticCanvas = Record<string, any> & {
  getZoom(): number;
  viewportTransform: TMat2D;
  vptCoords: {
    tl: Point;
    br: Point;
  };
  getRetinaScaling(): number;
} & Observable;
export type TObject = any;
