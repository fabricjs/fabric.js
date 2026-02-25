import type { Gradient } from 'fabric';
import { Control, controlsUtils } from 'fabric';
import {
  linearGradientColorActionHandler,
  linearGradientColorPositionHandlerGenerator,
  linearGradientControlLineRender,
  linearGradientCoordPositionHandler,
  linearGradientCoordsActionHandler,
} from './linearGradientHandlers';

export function createGradientControls(
  gradient: Gradient<'linear'>,
  options: Partial<Control> = {},
): Record<string, Control> {
  const controls = {} as Record<string, Control>;
  controls[`lgp_1`] = new Control({
    ...options,
    positionHandler: linearGradientCoordPositionHandler(gradient, 1),
    actionHandler: linearGradientCoordsActionHandler(gradient, 1),
    render: linearGradientControlLineRender(gradient),
  });
  gradient.colorStops.forEach((colorStop, index) => {
    controls[`lgo_${index}`] = new Control({
      ...options,
      positionHandler: linearGradientColorPositionHandlerGenerator(
        gradient,
        index,
      ),
      actionHandler: linearGradientColorActionHandler(gradient, index),
    });
  });

  controls[`lgp_2`] = new Control({
    ...options,
    positionHandler: linearGradientCoordPositionHandler(gradient, 2),
    actionHandler: linearGradientCoordsActionHandler(gradient, 2),
    render: controlsUtils.renderCircleControl,
  });
  return controls;
}
