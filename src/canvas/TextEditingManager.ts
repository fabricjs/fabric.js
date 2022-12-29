import type { IText } from '../shapes/itext.class';
import type { Textbox } from '../shapes/textbox.class';
import { removeFromArray } from '../util/internals';

/**
 * In charge of synchronizing all interactive text instances of a canvas
 */
export class TextEditingManager {
  private targets: (IText | Textbox)[] = [];

  exitTextEditing() {
    this.targets.forEach((obj) => {
      obj.selected = false;
      if (obj.isEditing) {
        obj.exitEditing();
      }
    });
  }

  /**
   * called from canvas mouse up
   */
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
