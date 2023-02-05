import { FabricObject } from '../shapes/Object/FabricObject';
import { Textbox } from '../shapes/Textbox';
import { createResizeControls, defaultControls } from './defaultControls';

// shared with the default object on purpose
export const textboxDefaultControls = {
  ...defaultControls,
  ...createResizeControls(),
};

FabricObject.prototype.controls = {
  ...(FabricObject.prototype.controls || {}),
  ...defaultControls,
};

if (Textbox) {
  // this is breaking the prototype inheritance, no time / ideas to fix it.
  // is important to document that if you want to have all objects to have a
  // specific custom control, you have to add it to Object prototype and to Textbox
  // prototype. The controls are shared as references. So changes to control `tr`
  // can still apply to all objects if needed.
  Textbox.prototype.controls = {
    ...(Textbox.prototype.controls || {}),
    ...textboxDefaultControls,
  };
}
