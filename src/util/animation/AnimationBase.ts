import { noop } from '../../constants';
import { requestAnimFrame } from './AnimationFrameProvider';
import { runningAnimations } from './AnimationRegistry';
import { defaultEasing } from './easing';
import type {
  AnimationState,
  TAbortCallback,
  TBaseAnimationOptions,
  TEasingFunction,
  TOnAnimationChangeCallback,
} from './types';

const defaultAbort = () => false;

export abstract class AnimationBase<
  T extends number | number[] = number | number[],
> {
  declare readonly startValue: T;
  declare readonly endValue: T;
  declare readonly duration: number;
  declare readonly delay: number;

  declare protected readonly byValue: T;
  declare protected readonly easing: TEasingFunction<T>;

  declare private readonly _onStart: VoidFunction;
  declare private readonly _onChange: TOnAnimationChangeCallback<T>;
  declare private readonly _onComplete: TOnAnimationChangeCallback<T>;
  declare private readonly _abort: TAbortCallback<T>;

  /**
   * Used to register the animation to a target object
   * so that it can be cancelled within the object context
   */
  declare readonly target?: unknown;

  private _state: AnimationState = 'pending';
  /**
   * Time %, or the ratio of `timeElapsed / duration`
   * @see tick
   */
  durationProgress = 0;
  /**
   * Value %, or the ratio of `(currentValue - startValue) / (endValue - startValue)`
   */
  valueProgress = 0;
  /**
   * Current value
   */
  declare value: T;
  /**
   * Animation start time ms
   */
  declare private startTime: number;

  constructor({
    startValue,
    byValue,
    duration = 500,
    delay = 0,
    easing = defaultEasing,
    onStart = noop,
    onChange = noop,
    onComplete = noop,
    abort = defaultAbort,
    target,
  }: TBaseAnimationOptions<T>) {
    this.tick = this.tick.bind(this);

    this.duration = duration;
    this.delay = delay;
    this.easing = easing;
    this._onStart = onStart;
    this._onChange = onChange;
    this._onComplete = onComplete;
    this._abort = abort;
    this.target = target;

    this.startValue = startValue;
    this.byValue = byValue;
    this.value = this.startValue;
    this.endValue = Object.freeze(this.calculate(this.duration).value);
  }

  get state() {
    return this._state;
  }

  isDone() {
    return this._state === 'aborted' || this._state === 'completed';
  }

  /**
   * Calculate the current value based on the easing parameters
   * @param timeElapsed in ms
   * @protected
   */
  protected abstract calculate(timeElapsed: number): {
    value: T;
    valueProgress: number;
  };

  start() {
    const firstTick: FrameRequestCallback = (timestamp) => {
      if (this._state !== 'pending') return;
      this.startTime = timestamp || +new Date();
      this._state = 'running';
      this._onStart();
      this.tick(this.startTime);
    };

    this.register();

    // setTimeout(cb, 0) will run cb on the next frame, causing a delay
    // we don't want that
    if (this.delay > 0) {
      setTimeout(() => requestAnimFrame(firstTick), this.delay);
    } else {
      requestAnimFrame(firstTick);
    }
  }

  private tick(t: number) {
    const durationMs = (t || +new Date()) - this.startTime;
    const boundDurationMs = Math.min(durationMs, this.duration);
    this.durationProgress = boundDurationMs / this.duration;
    const { value, valueProgress } = this.calculate(boundDurationMs);
    this.value = Object.freeze(value);
    this.valueProgress = valueProgress;

    if (this._state === 'aborted') {
      return;
    } else if (
      this._abort(this.value, this.valueProgress, this.durationProgress)
    ) {
      this._state = 'aborted';
      this.unregister();
    } else if (durationMs >= this.duration) {
      this.durationProgress = this.valueProgress = 1;
      this._onChange(this.endValue, this.valueProgress, this.durationProgress);
      this._state = 'completed';
      this._onComplete(
        this.endValue,
        this.valueProgress,
        this.durationProgress,
      );
      this.unregister();
    } else {
      this._onChange(this.value, this.valueProgress, this.durationProgress);
      requestAnimFrame(this.tick);
    }
  }

  private register() {
    runningAnimations.push(this as unknown as AnimationBase);
  }

  private unregister() {
    runningAnimations.remove(this as unknown as AnimationBase);
  }

  abort() {
    this._state = 'aborted';
    this.unregister();
  }
}
