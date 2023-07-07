import { parsePercent } from '../../parser/percent';
import { parsePathForIteration } from '../path';
import type { TPointAngle } from '../path/typedefs';
import { ValueAnimation } from './ValueAnimation';
import type { PathAnimationOptions, TOnAnimationChangeCallback } from './types';

const wrapPathCallback = <R>(
  callback:
    | TOnAnimationChangeCallback<
        TPointAngle & { distance: number; progress: number },
        R
      >
    | undefined,
  context: ReturnType<typeof parsePathForIteration>
) =>
  callback &&
  ((pathProgress: number, valueProgress: number, durationProgress: number) => {
    const distance = pathProgress * context.length;
    return callback(
      {
        ...context.getPointOnPath(distance),
        distance,
        progress: pathProgress,
      },
      valueProgress,
      durationProgress
    );
  });

/**
 * Animated value ∈ [0, 1] is the progress value from path start
 */
export class PathAnimation extends ValueAnimation {
  readonly context: ReturnType<typeof parsePathForIteration>;

  constructor({
    path: arg0,
    startValue,
    endValue,
    onChange,
    onComplete,
    abort,
    ...options
  }: PathAnimationOptions) {
    const context = parsePathForIteration(arg0);
    const totalLength = context.length;
    super({
      ...options,
      startValue: parsePercent(
        typeof startValue === 'number' ? startValue / totalLength : startValue,
        0
      ),
      endValue: parsePercent(
        typeof endValue === 'number' ? endValue / totalLength : endValue,
        1
      ),
      onChange: wrapPathCallback(onChange, context),
      onComplete: wrapPathCallback(onComplete, context),
      abort: wrapPathCallback(abort, context),
    });
    this.context = context;
  }
}
