import type { Control, Gradient } from 'fabric';
import { createLinearGradientControls as createCoreLinearGradientControls } from '../../packages/gradient-controls/src/linearGradientControls';

export function createLinearGradientControls(
  gradient: Gradient<'linear'>,
  options: Partial<Control> = {},
): Record<string, Control> {
  return createCoreLinearGradientControls(gradient, options);
}
