import { getEnv } from '../env';
import { TSize } from '../typedefs';
import { createCanvasElement } from '../util/misc/dom';

type RenderingContextType = '2d' | 'webgl';

type RenderingContextProviderMap = {
  '2d': {
    ctx: CanvasRenderingContext2D;
    options: CanvasRenderingContext2DSettings;
  };
  webgl: { ctx: WebGLRenderingContext; options: WebGLContextAttributes };
  // webgl2: { ctx: WebGL2RenderingContext; options: WebGLContextAttributes };
  // bitmaprenderer: {
  //   ctx: ImageBitmapRenderingContext;
  //   options: ImageBitmapRenderingContextSettings;
  // };
};

type RenderingContext<T extends RenderingContextType = RenderingContextType> =
  RenderingContextProviderMap[T]['ctx'];

type RenderingContextOptions<
  T extends RenderingContextType = RenderingContextType
> = RenderingContextProviderMap[T]['options'];

type RenderingContextProvider<
  T extends RenderingContextType = RenderingContextType
> = (
  type: T,
  options?: RenderingContextOptions<T>
) => RenderingContext<T> | null;

type StatefulRenderingContext<
  T extends RenderingContextType = RenderingContextType
> = RenderingContext<T> & {
  __type: T;
  __options: RenderingContextOptions<T>;
  __locked: boolean;
  release(): void;
};

const isEqualOrDefault = <T>(
  a: T | undefined,
  b: T | undefined,
  defaultValue: T
) => a === b || (!a && b === defaultValue) || (a === defaultValue && !b);

class CanvasProvider {
  static compare2dOptions(
    a: RenderingContextOptions<'2d'> | undefined,
    b: RenderingContextOptions<'2d'> | undefined
  ) {
    return (
      a === b ||
      isEqualOrDefault(a?.alpha, b?.alpha, false) ||
      isEqualOrDefault(a?.colorSpace, b?.colorSpace, 'srgb') ||
      isEqualOrDefault(a?.desynchronized, b?.desynchronized, false) ||
      isEqualOrDefault(a?.willReadFrequently, b?.willReadFrequently, false)
    );
  }

  static compareWebGLOptions(
    a: RenderingContextOptions<'webgl'> | undefined,
    b: RenderingContextOptions<'webgl'> | undefined
  ) {
    return (
      a === b ||
      isEqualOrDefault(a?.alpha, b?.alpha, false) ||
      isEqualOrDefault(a?.antialias, b?.antialias, false) ||
      isEqualOrDefault(a?.depth, b?.depth, false) ||
      isEqualOrDefault(a?.desynchronized, b?.depth, false) ||
      isEqualOrDefault(
        a?.failIfMajorPerformanceCaveat,
        b?.failIfMajorPerformanceCaveat,
        false
      ) ||
      isEqualOrDefault(a?.powerPreference, b?.powerPreference, 'default') ||
      isEqualOrDefault(a?.premultipliedAlpha, b?.premultipliedAlpha, false) ||
      isEqualOrDefault(
        a?.preserveDrawingBuffer,
        b?.preserveDrawingBuffer,
        false
      ) ||
      isEqualOrDefault(a?.stencil, b?.stencil, false)
    );
  }

  static compareOptions<T extends RenderingContextType>(
    type: T,
    a: RenderingContextOptions<T> | undefined,
    b: RenderingContextOptions<T> | undefined
  ) {
    switch (type) {
      case '2d':
        return this.compare2dOptions(a, b);
      case 'webgl':
        return this.compareWebGLOptions(a, b);
    }
  }

  private builder: RenderingContextProvider = <T extends RenderingContextType>(
    type: T,
    options?: RenderingContextOptions<T>
  ) => {
    return createCanvasElement().getContext(
      type,
      options
    ) as RenderingContext<T>;
  };
  private stack: StatefulRenderingContext[] = [];
  private pruned: StatefulRenderingContext[] = [];
  private pruning = false;
  private locked: boolean;

  public registerBuilder(builder: RenderingContextProvider) {
    this.builder = builder;
  }

  public create<T extends RenderingContextType>(
    type: T,
    options?: RenderingContextOptions<T>
  ) {
    const value = Object.defineProperties(this.builder(type, options), {
      __type: {
        value: type,
        enumerable: false,
        configurable: false,
        writable: false,
      },
      __options: {
        value: options,
        enumerable: false,
        configurable: false,
        writable: false,
      },
      __locked: {
        value: false,
        enumerable: false,
        configurable: false,
        writable: true,
      },
      release: {
        value() {
          this.__locked = false;
        },
        enumerable: false,
        configurable: false,
        writable: false,
      },
    }) as StatefulRenderingContext<T>;
    this.stack.push(value);
    return value;
  }

  public request<T extends RenderingContextType = '2d'>(
    { type = '2d' as T, width, height }: { type?: T } & TSize,
    options?: RenderingContextOptions<T>
  ): StatefulRenderingContext<T> {
    const ctx = (this.stack.find(
      (item) =>
        !item.__locked &&
        item.__type === type &&
        (this.constructor as typeof CanvasProvider).compareOptions(
          type,
          item.__options,
          options
        )
    ) || this.create(type, options)) as StatefulRenderingContext<T>;
    ctx.__locked = true;
    this.pruning && this.pruned.push(ctx);
    const { canvas } = ctx;
    canvas.width = width;
    canvas.height = height;
    return ctx;
  }

  /**
   * Inform that resources are locked and can't be freed
   * {@link dispose} and {@link prune} will have no affect while {@link locked}
   */
  lock() {
    this.locked = true;
  }

  /**
   * Inform that the instance is idle so that resources can be freed upon request
   */
  unlock() {
    this.locked = false;
  }

  /**
   * Call this at the beginning of the rendering cycle of the deepest object tree
   * Call {@link prune} at the end of the rendering cycle to cleanup unused resources
   */
  public beginPruning() {
    this.pruning = true;
    this.pruned = [];
  }

  /**
   * Dispose of unused resources
   * Notice that this method should be called after {@link beginPruning} at the end of the rendering cycle
   * Calling this method without calling {@link beginPruning} or during a rendering cycle has no effect
   */
  public prune() {
    if (this.locked || !this.pruning) {
      return;
    }
    this.stack
      .filter((ctx) => !this.pruned.includes(ctx))
      .forEach((ctx) => getEnv().dispose(ctx.canvas));
    this.stack = this.pruned;
    this.pruned = [];
    this.pruning = false;
  }

  /**
   * Dispose of all resources
   * Notice that this method can be called at anytime
   * However calling during a rendering cycle will have no effect
   */
  public dispose() {
    if (this.locked) {
      return;
    }
    this.stack.map((ctx) => getEnv().dispose(ctx.canvas));
    this.stack = [];
    this.pruned = [];
    this.pruning = false;
  }
}

export const canvasProvider = new CanvasProvider();
