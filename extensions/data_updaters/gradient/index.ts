import type { Gradient, GradientOptions } from 'fabric';

/**
 * Updates the fromObject function of a Gradient to return a version that can restore old data
 * with opactiy in color Stops
 * Used to upgrade from fabric 6 to fabric 7
 * @param originalFn the original fromObject function of an object,
 * @returns a wrapped fromObject function for the object
 */

export const gradientUpdaterWrapper = <S, T extends Gradient<S> = Gradient<S>>(
  originalFn: (
    options: GradientOptions<'linear'> | GradientOptions<'radial'>,
  ) => Promise<T>,
): ((
  options: GradientOptions<'linear'> | GradientOptions<'radial'>,
) => Promise<T>) =>
  async function (this: T, serializedGradient) {
    // we default to left and top because those are defaults before deprecation
    const { colorStops } = serializedGradient;
    // and we do not want to pass those properties on the object anymore
    const newColorStops = colorStops?.map((v) => v);
    const gradient = await originalFn.call(this, {
      ...serializedGradient,
      colorStops: newColorStops,
    });
    return gradient;
  };
