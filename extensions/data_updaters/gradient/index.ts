import type { GradientOptions, ColorStop } from 'fabric';
import { Color, Gradient } from 'fabric';

/**
 * Updates the fromObject function of a Gradient to return a version that can restore old data
 * with opactiy in color Stops
 * Used to upgrade from fabric 6 to fabric 7
 * @param originalFn the original fromObject function of an object,
 * @returns a wrapped fromObject function for the object
 */

type OldColorStop = ColorStop & {
  opacity?: number;
};

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
    const newColorStops: ColorStop[] = (
      colorStops as OldColorStop[]
    )?.map<ColorStop>(({ color, opacity, offset }) => {
      if (opacity === undefined || opacity === 1) {
        return {
          color,
          offset,
        };
      }
      const col = new Color(color).setAlpha(opacity).toRgba();
      return {
        color: col,
        offset,
      };
    });
    const gradient = await originalFn.call(this, {
      ...serializedGradient,
      colorStops: newColorStops,
    });
    return gradient;
  };

/**
 * Wraps and override the current fabricJS fromObject static functions
 * Used to upgrade from fabric 7 to fabric 8
 * If you used to export with includeDefaultValues = false, you have to specify
 * which were yours default origins values
 */
export const installGradientUpdater = () => {
  // @ts-expect-error untypable
  Gradient.fromObject = gradientUpdaterWrapper(Gradient.fromObject);
};
