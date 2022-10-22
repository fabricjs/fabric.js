import { noop } from '../../constants';
import { requestAnimFrame } from './AnimationFrameProvider';
import { runningAnimations } from './AnimationRegistry';
import { defaultEasing } from './easing';
import {
  TAnimationBaseOptions,
  TAnimationValues,
  TAbortCallback,
  TEasingFunction,
  TOnAnimationChangeCallback,
  TAnimationCallbacks,
} from './types';

export abstract class AnimationBase<T extends number | number[]> {
  readonly startValue: T;
  readonly endValue: T;
  readonly byValue: T;
  readonly duration: number;
  readonly delay: number;
  protected readonly easing: TEasingFunction<T>;
  private readonly _onStart: VoidFunction;
  private readonly _onChange: TOnAnimationChangeCallback<T, void>;
  private readonly _onComplete: TOnAnimationChangeCallback<T, void>;
  private readonly _abort: TAbortCallback<T>;
  /**
   * used to register the animation to a target object so it can be cancelled within hte object context
   */
  readonly target?: unknown;

  state: 'pending' | 'running' | 'completed' | 'aborted' = 'pending';
  /**
   * time %
   */
  durationRate = 0;
  /**
   * value %
   */
  valueRate = 0;
  /**
   * current value
   */
  value: T;
  /**
   * animation start time ms
   */
  private startTime!: number;

  constructor({
    startValue,
    endValue,
    byValue,
    duration = 500,
    delay = 0,
    easing = defaultEasing,
    onStart = noop,
    onChange = noop,
    onComplete = noop,
    abort = noop,
    target,
  }: Partial<TAnimationBaseOptions<T> & TAnimationCallbacks<T>> &
    TAnimationValues<T>) {
    this.startValue = startValue;
    this.endValue = endValue;
    this.byValue = byValue;
    this.duration = duration;
    this.delay = delay;
    this.easing = easing;
    this._onStart = onStart;
    this._onChange = onChange;
    this._onComplete = onComplete;
    this._abort = abort;
    this.value = this.startValue;
    this.target = target;
  }

  protected abstract calculate(currentTime: number): {
    value: T;
    changeRate: number;
  };

  start() {
    const firstTick: FrameRequestCallback = (timestamp = +new Date()) => {
      this.startTime = timestamp;
      this.state = 'running';
      this._onStart();
      this.tick(timestamp);
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

  private tick: FrameRequestCallback = (t: number = +new Date()) => {
    const durationMs = t - this.startTime;
    const boundDurationMs = Math.min(durationMs, this.duration);
    this.durationRate = boundDurationMs / this.duration;
    const { value, changeRate } = this.calculate(boundDurationMs);
    this.value = Array.isArray(value) ? (value.slice() as T) : value;
    this.valueRate = changeRate;

    if (this.state === 'aborted') {
      return;
    } else if (this._abort(value, this.valueRate, this.durationRate)) {
      this.state = 'aborted';
      this.unregister();
    } else if (durationMs >= this.duration) {
      // TODO this line seems redundant
      this.durationRate = this.valueRate = 1;
      this._onChange(
        (Array.isArray(this.endValue)
          ? this.endValue.slice()
          : this.endValue) as T,
        this.valueRate,
        this.durationRate
      );
      this.state = 'completed';
      this._onComplete(this.endValue, this.valueRate, this.durationRate);
      this.unregister();
    } else {
      this._onChange(value, this.valueRate, this.durationRate);
      requestAnimFrame(this.tick);
    }
  };

  private register() {
    runningAnimations.push(this);
  }

  private unregister() {
    runningAnimations.remove(this);
  }

  abort() {
    this.state = 'aborted';
    this.unregister();
  }
}
