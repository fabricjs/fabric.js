import type { Point } from 'fabric';

export type LineProps = {
  origin: Point;
  target: Point;
};

export type AligningLineConfig = {
  /** At what distance from the shape does alignment begin? */
  margin: number;
  /** Aligning line dimensions */
  width: number;
  /** Aligning line color */
  color: string;
};
