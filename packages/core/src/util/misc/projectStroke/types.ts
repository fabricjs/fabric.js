import type { Point } from '../../../Point';
import type { TDegree, TRadian } from '../../../typedefs';

export type TProjectStrokeOnPointsOptions = {
  strokeWidth: number;
  strokeLineCap: CanvasLineCap;
  strokeLineJoin: CanvasLineJoin;
  /**
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
   */
  strokeMiterLimit: number;
  strokeUniform: boolean;
  scaleX: number;
  scaleY: number;
  skewX: TDegree;
  skewY: TDegree;
};

export type TProjection = {
  projectedPoint: Point;
  originPoint: Point;
  angle?: TRadian;
  bisector?: Point;
};
