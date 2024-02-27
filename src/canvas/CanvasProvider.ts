import { getEnv } from '../env';
import { TSize } from '../typedefs';
import { createCanvasElement } from '../util/misc/dom';

type RenderingContextType = '2d' | 'webgl';
type ContextState = {
  __type: RenderingContextType;
  __locked: boolean;
  release(): void;
};
type RenderingContextProviderMap = {
  '2d': CanvasRenderingContext2D;
  // bitmaprenderer:ImageBitmapRenderingContext
  webgl: WebGLRenderingContext;
  // webgl2: WebGL2RenderingContext
};

type RenderingContext<T extends RenderingContextType = RenderingContextType> =
  RenderingContextProviderMap[T];

type RenderingContextProvider<
  T extends RenderingContextType = RenderingContextType
> = (type: T, options?: any) => RenderingContext<T> | null;

type StatefulRenderingContext<
  T extends RenderingContextType = RenderingContextType
> = RenderingContext<T> & ContextState;

class CanvasProvider {
  private builder: RenderingContextProvider = <T extends RenderingContextType>(
    type: T,
    options?: any
  ) => {
    return createCanvasElement().getContext(
      type,
      options
    ) as RenderingContextProviderMap[T];
  };
  private stack: StatefulRenderingContext[] = [];
  private pruned: StatefulRenderingContext[] = [];
  private isPruning = false;

  public registerBuilder(builder: RenderingContextProvider) {
    this.builder = builder;
  }

  private create<T extends RenderingContextType>(type: T) {
    const value = Object.defineProperties(this.builder(type), {
      __type: {
        value: type,
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

  public request<T extends RenderingContextType = '2d'>({
    type = '2d' as T,
    width,
    height,
  }: { type?: T } & TSize): StatefulRenderingContext<T> {
    const ctx = (this.stack.find(
      (item) => !item.__locked && item.__type === type
    ) || this.create(type)) as StatefulRenderingContext<T>;
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
