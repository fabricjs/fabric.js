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

  private static blur(target: IText | Textbox) {
    if (target.isEditing) {
      target.exitEditing();
    }
  }

  exitTextEditing() {
    this.targets.forEach(TextEditingManager.blur);
  }

  add(target: IText | Textbox) {
    this.targets.push(target);
  }

  remove(target: IText | Textbox) {
    removeFromArray(this.targets, target);
  }

  focus(target: IText | Textbox) {
    this.target = target;
    this.targets.forEach(
      (obj) => obj !== target && TextEditingManager.blur(obj)
    );
  }

  onMouseMove(e: TPointerEvent) {
    this.target?.isEditing && this.target.updateSelection(e);
  }

  dispose() {
    this.targets = [];
    this.target = undefined;
  }
}
