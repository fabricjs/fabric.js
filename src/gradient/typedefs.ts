import type { Percent, TMat2D } from '../typedefs';

export type GradientUnits = 'pixels' | 'percentage';

export type GradientType = 'linear' | 'radial';

export type GradientCoordValue = number | Percent | string;

export type ColorStop = {
  color: string;
  offset: number;
};

export type LinearGradientCoords<T extends GradientCoordValue> = {
  /**
   * X coordiante of the first point
   */
  x1: T;
  /**
   * Y coordiante of the first point
   */
  y1: T;
  /**
   * X coordiante of the second point
   */
  x2: T;
  /**
   * Y coordiante of the second point
   */
  y2: T;
};

export type RadialGradientCoords<T extends GradientCoordValue> = {
  /**
   * X coordinate of the first focal point
   */
  x1: T;
  /**
   * Y coordiante of the first focal point
   */
  y1: T;
  /**
   * X coordiante of the second focal point
   */
  x2: T;
  /**
   * Y coordiante of the second focal point
   */
  y2: T;
  /**
   * radius of the inner circle
   */
  r1: T;
  /**
   * radius of the outer circle
   */
  r2: T;
};

export type GradientCoords<T extends GradientType> = T extends 'linear'
  ? LinearGradientCoords<number>
  : RadialGradientCoords<number>;

export type GradientOptions<T extends GradientType> = {
  type?: T;
  gradientUnits?: GradientUnits;
  colorStops?: ColorStop[];
  coords?: Partial<GradientCoords<T>>;
  /**
   * @todo rename?
   */
  gradientTransform?: TMat2D;
  id?: string;
  /**
   * SVG import compatibility
   */
  offsetX?: number;
  /**
   * SVG import compatibility
   */
  offsetY?: number;
};

export type SVGOptions = {
  /**
   * width part of the viewBox attribute on svg
   */
  viewBoxWidth: number;
  /**
   * height part of the viewBox attribute on svg
   */
  viewBoxHeight: number;
  /**
   * width part of the svg tag if viewBox is not specified
   */
  width: number;
  /**
   * height part of the svg tag if viewBox is not specified
   */
  height: number;

  opacity: string | null;
};

export type SerializedGradientProps<T extends GradientType> = Omit<
  GradientOptions<T>,
  'id'
>;
