import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { removeFromArray } from '../util/internals/removeFromArray.mjs';

/**
 * In charge of synchronizing all interactive text instances of a canvas
 */
class TextEditingManager {
  constructor(canvas) {
    _defineProperty(this, "targets", []);
    _defineProperty(this, "__disposer", void 0);
    const cb = () => {
      const {
        hiddenTextarea
      } = canvas.getActiveObject() || {};
      hiddenTextarea && hiddenTextarea.focus();
    };
    const el = canvas.upperCanvasEl;
    el.addEventListener('click', cb);
    this.__disposer = () => el.removeEventListener('click', cb);
  }
  exitTextEditing() {
    this.target = undefined;
    this.targets.forEach(target => {
      if (target.isEditing) {
        target.exitEditing();
      }
    });
  }
  add(target) {
    this.targets.push(target);
  }
  remove(target) {
    this.unregister(target);
    removeFromArray(this.targets, target);
  }
  register(target) {
    this.target = target;
  }
  unregister(target) {
    if (target === this.target) {
      this.target = undefined;
    }
  }
  onMouseMove(e) {
    var _this$target;
    ((_this$target = this.target) === null || _this$target === void 0 ? void 0 : _this$target.isEditing) && this.target.updateSelectionOnMouseMove(e);
  }
  clear() {
    this.targets = [];
    this.target = undefined;
  }
  dispose() {
    this.clear();
    this.__disposer();
    // @ts-expect-error disposing
    delete this.__disposer;
  }
}

export { TextEditingManager };
//# sourceMappingURL=TextEditingManager.mjs.map
