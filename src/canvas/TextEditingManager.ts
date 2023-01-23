import { TPointerEvent } from '../EventTypeDefs';
import type { ITextBehaviorMixin } from '../mixins/itext_behavior.mixin';
import { removeFromArray } from '../util/internals';

/**
 * In charge of synchronizing all interactive text instances of a canvas
 */
export class TextEditingManager {
  private targets: ITextBehaviorMixin[] = [];
  private declare target?: ITextBehaviorMixin;

  exitTextEditing() {
    this.target = undefined;
    this.targets.forEach((target) => {
      if (target.isEditing) {
        target.exitEditing();
      }
    });
  }

  add(target: ITextBehaviorMixin) {
    this.targets.push(target);
  }

  remove(target: ITextBehaviorMixin) {
    this.unregister(target);
    removeFromArray(this.targets, target);
  }

  register(target: ITextBehaviorMixin) {
    this.target = target;
  }

  unregister(target: ITextBehaviorMixin) {
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
