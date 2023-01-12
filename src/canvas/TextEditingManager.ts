import { TPointerEvent } from '../EventTypeDefs';
import type { IText } from '../shapes/itext.class';
import type { Textbox } from '../shapes/textbox.class';
import { removeFromArray } from '../util/internals';

/**
 * In charge of synchronizing all interactive text instances of a canvas
 */
export class TextEditingManager {
  private targets: (IText | Textbox)[] = [];
  private target?: IText | Textbox;

  exitTextEditing() {
    this.target = undefined;
    this.targets.forEach((target) => {
      if (target.isEditing) {
        target.exitEditing();
      }
    });
  }

  add(target: IText | Textbox) {
    this.targets.push(target);
  }

  remove(target: IText | Textbox) {
    this.unregister(target);
    removeFromArray(this.targets, target);
  }

  register(target: IText | Textbox) {
    this.target = target;
  }

  unregister(target: IText | Textbox) {
    if (target === this.target) {
      this.target = undefined;
    }
  }

  onMouseMove(e: TPointerEvent) {
    this.target?.isEditing && this.target.updateSelectionOnMouseMove(e);
  }

  dispose() {
    this.targets = [];
    this.target = undefined;
  }
}
