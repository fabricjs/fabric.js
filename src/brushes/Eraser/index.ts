import { fabric } from '../../../HEADER';
import { Eraser } from './Eraser';
import { EraserBrush } from './EraserBrush';

export * from './Eraser';
export * from './EraserBrush';
export * from './types';
export * from './util';

fabric.Eraser = Eraser;
fabric.EraserBrush = EraserBrush;
