import { noop } from '../../constants';
import { requestAnimFrame } from './AnimationFrameProvider';
import { runningAnimations } from './AnimationRegistry';
import { defaultEasing } from './easing';
import {
  AnimationState,
  TAbortCallback,
  TBaseAnimationOptions,
  TEasingFunction,
  TOnAnimationChangeCallback,
} from './types';

const defaultAbort = () => false;

export abstract class AnimationBase<
  T extends number | number[] = number | number[]
> {
  readonly startValue: T;
  readonly byValue: T;
  readonly endValue: T;
  readonly duration: number;
  readonly delay: number;
  protected readonly easing: TEasingFunction<T>;

  private readonly _onStart: VoidFunction;
  private readonly _onChange: TOnAnimationChangeCallback<T, void>;
  private readonly _onComplete: TOnAnimationChangeCallback<T, void>;
  private readonly _abort: TAbortCallback<T>;

  /**
   * Used to register the animation to a target object
   * so that it can be cancelled within the object context
   */
  readonly target?: unknown;

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
  value: T;
  /**
   * Animation start time ms
   */
  private startTime!: number;

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
    this.endValue = this.calculate(this.duration).value;
  }

  get state() {
    return this._state;
  }

  /**
   * Calculate the current value based on the easing parameters
   * @param timeElapsed in ms
   * @protected
   */
  protected abstract calculate(timeElapsed: number): {
    value: T;
    changeRatio: number;
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
    const { value, changeRatio } = this.calculate(boundDurationMs);
    this.value = Array.isArray(value) ? (value.slice() as T) : value;
    this.valueProgress = changeRatio;

    if (this._state === 'aborted') {
      return;
    } else if (this._abort(value, this.valueProgress, this.durationProgress)) {
      this._state = 'aborted';
      this.unregister();
    } else if (durationMs >= this.duration) {
      const endValue = this.endValue;
      this.durationProgress = this.valueProgress = 1;
      this._onChange(
        (Array.isArray(endValue) ? endValue.slice() : endValue) as T,
        this.valueProgress,
        this.durationProgress
      );
      this._state = 'completed';
      this._onComplete(endValue, this.valueProgress, this.durationProgress);
      this.unregister();
    } else {
      this._onChange(value, this.valueProgress, this.durationProgress);
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
