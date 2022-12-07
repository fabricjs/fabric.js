import { fabric } from '../../../HEADER';
import { Eraser } from './Eraser';
import { EraserBrush } from './EraserBrush';

export * from './Eraser';
export * from './EraserBrush';
export * from './types';

fabric.Eraser = Eraser;
fabric.EraserBrush = EraserBrush;
