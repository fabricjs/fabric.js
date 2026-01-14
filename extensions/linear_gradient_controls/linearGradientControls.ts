import type { Gradient } from 'fabric';
import { Control } from 'fabric';
import {
  linearGradientColorPositionHandlerGenerator,
  linearGradientCoordPositionHandler,
} from './linearGradientHandlers';

export function createGradientControls(
  gradient: Gradient<'linear'>,
  options: Partial<Control> = {},
): Record<string, Control> {
  const controls = {} as Record<string, Control>;
  gradient.colorStops.forEach((colorStop, index) => {
    controls[`lgo_${index}`] = new Control({
      ...options,
      positionHandler: linearGradientColorPositionHandlerGenerator(
        gradient,
        index,
      ),
    });
  });
  controls[`lgp_1`] = new Control({
    ...options,
    positionHandler: linearGradientCoordPositionHandler(gradient, 1),
  });
  controls[`lgp_2`] = new Control({
    ...options,
    positionHandler: linearGradientCoordPositionHandler(gradient, 2),
  });
  return controls;
}
