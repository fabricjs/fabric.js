import type { Point, TBBox } from 'fabric';

export type AltMapPoint = {
  target: Point;
  xPoint: Point;
  yPoint: Point;
};

export type AltMap = {
  origin: TBBox;
  target: TBBox;
  points: AltMapPoint[];
};

export type DrawLineMapProps = AltMapPoint & {
  ctx: CanvasRenderingContext2D;
};

export type MovingMapLine = {
  origin: Point;
  target: Point;
};
export type MovingMap = {
  xLines: MovingMapLine[];
  yLines: MovingMapLine[];
};

export type DistanceGuideProps = {
  /** The color of the guide line */
  color: string;
  /** The fill color of the text */
  fillStyle: string;
  /** The width of the guide line */
  lineWidth: number;
  /** The style of the dashed line */
  lineDash: number[];
  /** The offset of the dashed line */
  lineDashOffset: number;
  /** The size of the text */
  fontSize: number;
  /** The fontFamily of the text */
  fontFamily: string;
  /** The spacing of the text within the rectangle */
  padding: number;
  /** The distance between the text and the guide line */
  space: number;
  /** The detection distance when moving the graphic */
  margin: number;
};
