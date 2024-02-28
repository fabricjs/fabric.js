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
  private isPruning = false;

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
    this.isPruning && this.pruned.push(ctx);
    const { canvas } = ctx;
    canvas.width = width;
    canvas.height = height;
    return ctx;
  }

  public release(ctx: RenderingContext) {
    const found = this.stack.find((c) => c === ctx);
    found && (found.__locked = false);
  }

  public beginPruning() {
    this.isPruning = true;
    this.pruned = [];
  }

  public prune() {
    this.stack
      .filter((ctx) => !this.pruned.includes(ctx))
      .forEach((ctx) => getEnv().dispose(ctx.canvas));
    this.stack = this.pruned;
    this.pruned = [];
    this.isPruning = false;
  }

  public dispose() {
    this.stack.map((ctx) => getEnv().dispose(ctx.canvas));
    this.stack = [];
    this.pruned = [];
    this.isPruning = false;
  }
}

export const canvasProvider = new CanvasProvider();
