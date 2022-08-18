
export type GradientUnits = 'pixels' | 'percentage';

export type GradientType = 'linear' | 'radial';

export type Percent = `${number}%`;

export type GradientValue = number | Percent;

export type ColorStop = {
  color: string;
  opacity: number;
  offset: number;
};

export type LinearGradientCoords<T> = {
  /**
   * X coordiante of the first point
   */
  x1: GradientValue;
  /**
   * Y coordiante of the first point
   */
  y1: GradientValue;
  /**
   * X coordiante of the second point
   */
  x2: GradientValue;
  /**
   * Y coordiante of the second point
   */
  y2: GradientValue;
};

export type RadialGradientCoords = {
  /**
   * X coordiante of the first focal point
   */
  x1: GradientValue;
  /**
   * Y coordiante of the first focal point
   */
  y1: GradientValue;
  /**
   * X coordiante of the second focal point
   */
  x2: GradientValue;
  /**
   * Y coordiante of the second focal point
   */
  y2: GradientValue;
  /**
   * radius of the inner circle
   */
  r1: GradientValue;
  /**
   * radius of the outer circle
   */
  r2: GradientValue;
};

export type GradientCoords<T extends GradientType> = T extends 'linear' ? LinearGradientCoords : RadialGradientCoords;

export type GradientOptions<T extends GradientType> = {
  type: T;
  gradientUnits: GradientUnits;
  colorStops: ColorStop[];
  coords: GradientCoords<T>;
  /**
   * @todo rename?
   */
  gradientTransform: number[];
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

export type SVGBBoxOptions = {
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
};