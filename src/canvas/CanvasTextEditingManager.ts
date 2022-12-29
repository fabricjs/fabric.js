import type { IText } from '../shapes/itext.class';
import type { Textbox } from '../shapes/textbox.class';
import { removeFromArray } from '../util/internals';
import type { Canvas } from './canvas_events';

export class CanvasTextEditingManager {
  private targets: (IText | Textbox)[] = [];
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
    this.targets.push(target);
  }

  remove(target: IText | Textbox) {
    removeFromArray(this.targets, target);
  }

  dispose() {
    this.targets = [];
  }
}
