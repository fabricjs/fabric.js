import { CanvasEvents, ModifierKey, StaticCanvasEvents } from './EventTypeDefs';
import type { Observable } from './mixins/observable.mixin';
import type { Point } from './point.class';
import type { FabricObject } from './shapes/fabricObject.class';
import { TMat2D } from './typedefs';

/**
 * @todo remove transient
 */
export type Canvas = StaticCanvas & {
  altActionKey: ModifierKey;
  uniScaleKey: ModifierKey;
  uniformScaling: boolean;
} & Record<string, any> &
  Observable<CanvasEvents>;
export type StaticCanvas = Record<string, any> & {
  getZoom(): number;
  viewportTransform: TMat2D;
  vptCoords: {
    tl: Point;
    br: Point;
  };
  getRetinaScaling(): number;
  _objects: FabricObject[];
} & Observable<StaticCanvasEvents>;
