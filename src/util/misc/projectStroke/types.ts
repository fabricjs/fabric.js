import { Point } from '../../../point.class';
import { StrokeLineJoin, TDegree } from '../../../typedefs';
import { getBisector } from '../vectors';

export type TProjectStrokeOnPointsOptions = {
  strokeWidth: number;
  strokeLineJoin: StrokeLineJoin;
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
  bisector?: ReturnType<typeof getBisector>;
};
