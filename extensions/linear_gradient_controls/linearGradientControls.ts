import type { Gradient } from 'fabric';
import { Control, controlsUtils } from 'fabric';
import {
  linearGradientColorActionHandlerGenerator,
  linearGradientColorPositionHandlerGenerator,
  linearGradientControlLineRender,
  linearGradientCoordPositionHandlerGenerator,
  linearGradientCoordsActionHandlerGenerator,
} from './linearGradientHandlers';

export function createLinearGradientControls(
  gradient: Gradient<'linear'>,
  options: Partial<Control> = {},
): Record<string, Control> {
  const controls = {} as Record<string, Control>;
  controls[`lgp_1`] = new Control({
    ...options,
    positionHandler: linearGradientCoordPositionHandlerGenerator(gradient, 1),
    actionHandler: linearGradientCoordsActionHandlerGenerator(gradient, 1),
    render: linearGradientControlLineRender(gradient),
  });
  gradient.colorStops.forEach((colorStop, index) => {
    controls[`lgo_${index}`] = new Control({
      ...options,
      positionHandler: linearGradientColorPositionHandlerGenerator(
        gradient,
        index,
      ),
      actionHandler: linearGradientColorActionHandlerGenerator(gradient, index),
    });
  });

  controls[`lgp_2`] = new Control({
    ...options,
    positionHandler: linearGradientCoordPositionHandlerGenerator(gradient, 2),
    actionHandler: linearGradientCoordsActionHandlerGenerator(gradient, 2),
    render: controlsUtils.renderCircleControl,
  });
  return controls;
}
