import { Point } from '../../../Point';
import { TDegree } from '../../../typedefs';
import { getBisector } from '../vectors';

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
  bisector?: ReturnType<typeof getBisector>;
};
