import type { TEvent } from '../EventTypeDefs';
import type { Point } from '../Point';

export interface TBrushEventData extends TEvent {
  scenePoint: Point;
  viewportPoint: Point;
}

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
