import type { IText } from '../shapes/itext.class';
import { removeFromArray } from '../util/internals';
import type { Canvas } from './canvas_events';

export class CanvasTextEditingManager {
  private targets: IText[] = [];
  private disposer?: VoidFunction;
  readonly canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  exitTextEditing() {
    this.targets.forEach((obj) => {
      obj.selected = false;
      if (obj.isEditing) {
        obj.exitEditing();
      }
    });
  }

  informMouseUp() {
    this.targets.forEach((obj) => {
      obj.__isMousedown = false;
    });
  }

  onAdded(target: IText): void {
    if (!this.disposer) {
      const disposer = this.canvas.on('mouse:up', () => {
        this.informMouseUp();
      });
      this.disposer = () => {
        disposer();
        delete this.disposer;
      };
    }
    this.targets.push(target);
  }

  onRemoved(target: IText): void {
    removeFromArray(this.targets, target);
    this.targets.length === 0 && this.disposer && this.disposer();
  }

  dispose() {
    this.disposer && this.disposer();
    this.targets = [];
  }
}
