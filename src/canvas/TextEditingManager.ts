import { TPointerEvent } from '../EventTypeDefs';
import type { ITextBehavior } from '../shapes/IText/ITextBehavior';
import { removeFromArray } from '../util/internals';

/**
 * In charge of synchronizing all interactive text instances of a canvas
 */
export class TextEditingManager {
  private targets: ITextBehavior[] = [];
  private declare target?: ITextBehavior;

  exitTextEditing() {
    this.target = undefined;
    this.targets.forEach((target) => {
      if (target.isEditing) {
        target.exitEditing();
      }
    });
  }

  add(target: ITextBehavior) {
    this.targets.push(target);
  }

  remove(target: ITextBehavior) {
    this.unregister(target);
    removeFromArray(this.targets, target);
  }

  register(target: ITextBehavior) {
    this.target = target;
  }

  unregister(target: ITextBehavior) {
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
