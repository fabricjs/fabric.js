import type { IText } from '../shapes/itext.class';
import type { Textbox } from '../shapes/textbox.class';
import { removeFromArray } from '../util/internals';
import type { Canvas } from './canvas_events';

export class CanvasTextEditingManager {
  private targets: (IText | Textbox)[] = [];
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

  add(target: IText | Textbox) {
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

  remove(target: IText | Textbox) {
    removeFromArray(this.targets, target);
    this.targets.length === 0 && this.disposer && this.disposer();
  }

  dispose() {
    this.disposer && this.disposer();
    this.targets = [];
  }
}
