import type { TEvent } from '../EventTypeDefs';
import type { Point } from '../Point';

export type TBrushEventData = TEvent & { pointer: Point };

export type CircleBrushPoint = {
  x: number;
  y: number;
  radius: number;
  fill: string;
};

export type SprayBrushPoint = {
  x: number;
  y: number;
  width: number;
  opacity: number;
};
